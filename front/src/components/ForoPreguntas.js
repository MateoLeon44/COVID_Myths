import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import Pregunta from "./Pregunta";
import "./styles/ForoPreguntas.css";
import UseSearchQuestions from "./useSearchQuestions.js";

const ForoPreguntas = (props) => {
  const [query, setquery] = useState("");
  const [pageNumber, setpageNumber] = useState(1);
  const [changes, setChanges] = useState(false);
  const formSearch = useRef();
  const clean=(e)=>{
    e.preventDefault();
    setquery("");
  };

  const setupWS = () => {
    const wss = new WebSocket("wss://covid19-myths.herokuapp.com");

    wss.onopen = () => {
      console.log("WS Client connected");
      wss.onmessage = (msg) => {
        console.log(msg.data);
        const a = JSON.parse(msg.data);
        setChanges(a);        
      };
    };
  };

  useEffect(() => {
    props.setInitial(false);
    setupWS();
  }, [props]);

  const handleSearch = (e) => {
    e.preventDefault();
    setquery(formSearch.current.query.value);
    setpageNumber(1);
  };

  const searchQuestions = () => {
    setpageNumber((prevStatus) => prevStatus + 1);
  };

  const { loading, hasMore, questions } = UseSearchQuestions(
    query,
    pageNumber,
    changes
  );

  const salir = () => {
    fetch("/salir", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 200) {
        props.setUser(false);
      }
    });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const contenido = formRef.current.contenido.value;
    const titulo = formRef.current.titulo.value;
    const user = props.user;
    const pregunta = { titulo, contenido, user, verdad: 0, mito: 0 };

    fetch("/preguntas/publicarPregunta", {
      method: "POST",
      body: JSON.stringify(pregunta),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 200) {
        Swal.fire("Pregunta creado con exito", "", "success");
        formRef.current.contenido.value="";
        formRef.current.titulo.value="";
      } else {
        Swal.fire("Ha ocurrido un error");
      }
    });
  };
  const formRef = useRef();

  return (
    <div>
      <div className="container-fluid">
        <div className="fixed">
          <nav className="navbar navbar-light">
            <div className="navbar-brand"></div>

            <div className="text-right">
              <button className="btn-comentarios" onClick={salir}>
                Salir
              </button>
              <hr></hr>
            </div>
          </nav>
          <div>
            <form ref={formSearch}>
              <input
                type="text"
                className="form-control"
                placeholder="Busca sobre un tema"
                aria-label="Busca sobre un tema"
                name="query"
                aria-describedby="addon-wrapping"
              />
              <button type="submit" className="btnLogin" onClick={handleSearch}>
                Buscar
              </button>
              <button className="btnLogin" onClick={clean}>
                Limpiar busqueda
              </button>
            </form>
          </div>
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="card">
              <div className="card-header">Pregunta algo</div>
              <div className="card-body">
                <blockquote className="blockquote mb-0">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Titulo"
                      aria-label="titulo"
                      aria-describedby="basic-addon1"
                      name="titulo"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <textarea
                      name="contenido"
                      className="form-control"
                      aria-label="descripcion"
                    ></textarea>
                  </div>
                </blockquote>
                <hr></hr>
                <div className="text-right">
                  <button className="btnLogin">Publicar</button>
                </div>
              </div>
            </div>
          </form>

          {questions ? (
            questions.map((elem, index) => {
              if (index == questions[0].length - 1) {
                return (
                  <Pregunta
                    user={props.user}
                    id={elem._id}
                    key={elem._id}
                    title={elem.titulo}
                    contenido={elem.contenido}
                    usuario={elem.usuario}
                    mito={elem.mito}
                    verdad={elem.verdad}
                  ></Pregunta>
                );
              } else {
                return (
                  <Pregunta
                    user={props.user}
                    id={elem._id}
                    key={elem._id}
                    title={elem.titulo}
                    contenido={elem.contenido}
                    usuario={elem.usuario}
                    mito={elem.mito}
                    verdad={elem.verdad}
                  ></Pregunta>
                );
              }
            })
          ) : (
            <div></div>
          )}

          {loading ? <div className="loader"></div> : <div></div>}

          {hasMore ? (
            <button className="btnLogin" onClick={searchQuestions}>
              Cargar más
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForoPreguntas;
