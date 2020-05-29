require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const request = require("request");

const MongoUtils = () => {
  const MyMongoLib = this || {};
  const url = process.env.MONGODB_URI || "mongodb://localhost:27017";  
  const apiKey = process.env.APIKEY;
  const apiUrl = process.env.APIURL;
  const dbName = process.env.DB;
  let db;
  MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
    db = client.db(dbName);
  });

  MyMongoLib.connect = (url) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    return client.connect();
  };

  MyMongoLib.insertOneDoc = (doc, dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .insertOne(doc)
        .finally(() => client.close())
    );
  };

  MyMongoLib.getPaginateQuestion = (page, query) => {
    console.log(query);
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("preguntas")
        .find({ contenido: { $regex: query } })
        .sort([["_id", -1]])
        .limit(10)
        .skip(page)
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getPaginateComments = (page, query) => {
    console.log(query);
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("preguntas")
        .find({ contenido: { $regex: query } })
        .sort([["_id", -1]])
        .limit(10)
        .skip(page)
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.hasMore = (page, query) => {
    console.log(query);
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("preguntas")
        .find({ contenido: { $regex: query } })
        .count()
        .finally(() => client.close())
    );
  };


  MyMongoLib.hasMoreComentarios = (page, criteria) => {
    
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("comentarios")
        .find(criteria)
        .count()
        .finally(() => client.close())
    );
  };

  MyMongoLib.listenNewQuestions = (notifyAll) => {
    return MyMongoLib.connect(url).then((client) => {
      const cursor = client.db("covidDB").collection("preguntas").watch();

      cursor.on("change", (data) => {
        // console.log(data.fullDocument);
        // MyMongoLib.getDocs("preguntas").then((docs) => {
        //   console.log("PR",docs);
        //   notifyAll(JSON.stringify(docs));
        // });

        if (data.operationType == "update") {
          const criteria = { _id: data.documentKey._id };
          console.log(criteria);
          MyMongoLib.getDocsByCriteria(criteria, "preguntas").then(
            (data_db) => {
              const data_2 = { operationType: "update", fullDocument: data_db };
              notifyAll(JSON.stringify(data_2));
            }
          );
        } else {
          notifyAll(JSON.stringify(data));
        }
      });
    });
  };

  MyMongoLib.insertManyDocs = (docs, dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .insertManyDocs(doc)
        .finally(() => client.close())
    );
  };

  MyMongoLib.getDocs = (dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .find()
        .sort([["_id", -1]])
        .limit(600)
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getCountDocs = (dbCollection, limit) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .find()
        .sort([["_id", -1]])
        .limit(limit)
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getDocsByCriteria = (criteria, dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .find(criteria)
        .toArray()
        .finally(() => client.close())
    );
  };
  MyMongoLib.updateNoticia = (ids, usuario, upvote, text) => {
    return MyMongoLib.connect(url).then((client) => {
      client
        .db(dbName)
        .collection("detalleNoticia")
        .findOneAndUpdate(
          { _id: ids, votos: { $elemMatch: { usuario } } },
          {
            $set: { ["votos.$.voto"]: upvote, ["votos.$.usuario"]: usuario },
          }
        )
        .finally(() => client.close());
    });
  };

  MyMongoLib.updateNoticia2 = (ids, usuario, upvote, text) => {
    return MyMongoLib.connect(url).then((client) => {
      client
        .db(dbName)
        .collection("detalleNoticia")
        .findOneAndUpdate(
          { contenido: text },
          {
            $push: { votos: { usuario, voto: upvote } },
          },
          { upsert: true }
        )
        .finally(() => client.close());
    });
  };

  MyMongoLib.searchUsuarioInArray = (ids, usuario) => {
    return new Promise((resolve, reject) => {
      MyMongoLib.connect(url).then((client) => {
        client
          .db(dbName)
          .collection("detalleNoticia")
          .find({ _id: ids, "votos.usuario": usuario })
          .toArray(function (err, things) {
            resolve(things);
          });
      });
    });
  };

  MyMongoLib.registrarComentario = (usuario, text, comentario) => {
    return MyMongoLib.connect(url).then((client) => {
      client
        .db(dbName)
        .collection("detalleNoticia")
        .findOneAndUpdate(
          { contenido: text },
          {
            $push: { comentarios: { usuario: ObjectId(usuario), comentario } },
          },
          { upsert: true, returnOriginal: false }
        )
        .finally(() => client.close());
    });
  };

  MyMongoLib.updateDoc = (id, object, dbCollection) => {
    const usuario = "Vamos..";
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $set: { object } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.deleteDoc = (doc, dbCollection) => {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection(dbCollection)
          .remove(doc, {
            justOne: true,
          })
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.votarTrue = (id) => {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $inc: { verdad: 1 } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.votarFalse = (id) => {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $inc: { verdad: 1 } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.votarFalse = (id) => {
    console.log("Votar false");
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $inc: { mito: 1 } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.noVotarFalse = (id) => {
    console.log("Votar false");
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $inc: { mito: -1 } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.noVotarTrue = (id) => {
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection("preguntas")
          .updateOne(
            {
              _id: ObjectId(id),
            },
            { $inc: { verdad: -1 } }
          )
          .catch((err) => console.log(err))
    );
  };

  MyMongoLib.getDocById = (id, dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .find({ _id: ObjectId(id) })
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getDocByText = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .find({ contenido: text })
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getMasComentarios = (text, page) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .aggregate([
          { $match: { contenido: text } },
          {
            $project: {
              comentarios: { $slice: ["$comentarios", 0, page] },
              contenido: 1,
              votos: 1,
              comments: "$comentarios",
            },
          },
          {
            $lookup: {
              from: "login",
              localField: "comentarios.usuario",
              foreignField: "_id",
              as: "comentarios",
            },
          },
          {
            $addFields: {
              comentarios: {
                $map: {
                  input: "$comentarios",
                  as: "c",
                  in: {
                    usuario: "$$c._id",
                    comentario: {
                      $arrayElemAt: [
                        "$comments.comentario",
                        { $indexOfArray: ["$comments.usuario", "$$c._id"] },
                      ],
                    },
                    "username": "$$c.username"
                  },
                },
              },
            },
          },

        ])
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getComentariosPaginados = (text, limInf, limSup) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .aggregate([
          { $match: { contenido: text } },
          {
            $project: {
              comentarios: { $slice: ["$comentarios", limInf, limSup] },
            },
          },
        ])
        .toArray()
        .finally(() => client.close())
    );
  };

  
  MyMongoLib.getCommentarios = (criteria, page) => {
    console.log(criteria);
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("comentarios")
        .find(criteria)
        .sort([["_id", -1]])
        .skip((page-1)*10)
        .limit(10)        
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getUpVotesByText = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .aggregate([
          { $match: { contenido: text } },
          { $unwind: "$votos" },
          { $match: { "votos.voto": true } },
          { $count: "total" },
        ])
        .toArray()
    );
  };

  MyMongoLib.getTamanioComentarios = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .aggregate([
          { $match: { contenido: text } },
          { $project: { num_comentarios: { $size: "$comentarios" } } },
        ])
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getDownVotesByText = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("detalleNoticia")
        .aggregate([
          { $match: { contenido: text } },
          { $unwind: "$votos" },
          { $match: { "votos.voto": false } },
          { $count: "total" },
        ])
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getVotoPregunta = (usuario, pregunta, dbCollection) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbCollection)
        .find({ usuario, pregunta })
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getLoginByUsername = (username) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection("login")
        .find({ username: username })
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getNewsOfCovid = (page) => {
    return new Promise((resolve, reject) => {
      let pt = {
        url: apiUrl,
        qs: {
          q: "Covid AND coronavirus",
          qInTitle: "Covid AND coronavirus",
          language: "es",
          pageSize: 6,
          page: page,
          apiKey: apiKey,
        },
      };
      request(pt, (error, response, body) => {
        if (!error) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  };

  MyMongoLib.getWithJoin = (
    dbcollection,
    fromCollection,
    localField,
    foreingField,
    asName,
    id
  ) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection(dbcollection)
        .aggregate([
          { $match: { _id: ObjectId(id) } },
          { $unwind: "$" + localField },
          {
            $lookup: {
              from: fromCollection,
              localField: localField,
              foreignField: foreingField,
              as: asName,
            },
          },
          { $unwind: "$" + asName },
          {
            $group: {
              _id: "$_id",
              revisiones_id: { $push: "$" + localField },
              revisiones: { $push: "$" + asName },
            },
          },
        ])
        .finally(() => client.close())
    );
  };

  return MyMongoLib;
};

module.exports = MongoUtils();
