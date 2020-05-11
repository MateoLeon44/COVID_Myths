require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const request = require('request');

const MongoUtils = () => {
  const MyMongoLib = this || {};
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
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
        .find({})
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.updateNoticia = (text, upvote) => {
    return MyMongoLib.connect(url).then((client) => {
      client
        .db(dbName)
        .collection('detalleNoticia')
        .findOneAndUpdate(
          { contenido: text },
          { $push: { votos: { usuario: '1', voto: upvote } } },
          { upsert: true, returnOriginal: false }
        )
        .finally(() => client.close());
    });
  };


  MyMongoLib.registrarComentario = (usuario, text, comentario) => { 
    return MyMongoLib.connect(url).then((client) => {
      client
        .db(dbName)
        .collection('detalleNoticia')
        .findOneAndUpdate(
          { contenido: text },
          { $push: { comentarios: { usuario, comentario } } },
          { upsert: true, returnOriginal: false }
        )
        .finally(() => client.close());
    });
  }

 

  MyMongoLib.updateDoc = (id, object, dbCollection) => {
    const usuario = 'Vamos..';
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection('preguntas')
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
          .collection('preguntas')
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
          .collection('preguntas')
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
    console.log('Votar false');
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection('preguntas')
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
    console.log('Votar false');
    return MongoClient.connect(url, { useUnifiedTopology: true }).then(
      (client) =>
        client
          .db(dbName)
          .collection('preguntas')
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
          .collection('preguntas')
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
        .collection('detalleNoticia')
        .find({ contenido: text })
        .toArray()
        .finally(() => client.close())
    );
  };


  MyMongoLib.getUpVotesByText = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection('detalleNoticia')
        .aggregate([
          { $match: { contenido: text}},
          { $unwind: "$votos" },
          { $match: { "votos.voto": true}},
          { $count: "total" }
        ])
        .toArray()
    );
  }

  MyMongoLib.getDownVotesByText = (text) => {
    return MyMongoLib.connect(url).then((client) =>
      client
        .db(dbName)
        .collection('detalleNoticia')
        .aggregate([
          { $match: { contenido: text}},
          { $unwind: "$votos" },
          { $match: { "votos.voto": false}},
          { $count: "total" }
        ])
        .toArray()
    );
  }


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
        .collection('login')
        .find({ username: username })
        .toArray()
        .finally(() => client.close())
    );
  };

  MyMongoLib.getNewsOfCovid = (page) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: apiUrl,
        qs: {
          q: 'Covid AND coronavirus',
          qInTitle: 'Covid AND coronavirus',
          language: 'es',
          pageSize: 6,
          page: page,
          apiKey: apiKey,
        },
      };
      request(options, (error, response, body) => {
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
          { $unwind: '$' + localField },
          {
            $lookup: {
              from: fromCollection,
              localField: localField,
              foreignField: foreingField,
              as: asName,
            },
          },
          { $unwind: '$' + asName },
          {
            $group: {
              _id: '$_id',
              revisiones_id: { $push: '$' + localField },
              revisiones: { $push: '$' + asName },
            },
          },
        ])
        .finally(() => client.close())
    );
  };

  return MyMongoLib;
};

module.exports = MongoUtils();
