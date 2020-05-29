import React, { useState, useRef, useEffect } from "react";

import { Modal } from "react-bootstrap";
import "./styles/Comentarios.css";
const Comentarios = (props) => {
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, sethasMore] = useState(false);
  const [comentarios, setcomentarios] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    const id = props.pregunta;
    const url =
      "/preguntas/comentariosUnaPregunta/?page=" + page + "&pregunta=" + id;

    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.preguntas);
        setcomentarios(json.preguntas);
        sethasMore(json.hasMore);
      });
    setShow(true);
  };
  const formRef = useRef();

  const listarComentarios = (comentarios) => {
    return comentarios.map((elem, index) => {
      return (
        <li key={elem._id} className="list-group-item">
          {elem.contenido}
        </li>
      );
    });
  };

  const cargarMas = () => {
    setPage(page => page + 1);
    const id = props.pregunta;
    const p=page+1;
    const url =
      "/preguntas/comentariosUnaPregunta/?page=" + p + "&pregunta=" + id;
    console.log(page);
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.preguntas);
        const l = listarComentarios(json.preguntas);
        setcomentarios((l2) => {
          return l2.concat(json.preguntas);
        });
        sethasMore(json.hasMore);
      });
    setShow(true);
  };

  const comentar = (evt) => {
    evt.preventDefault();
    console.log(props);
    const contenido = formRef.current.contenido.value;
    const comentario = {
      usuario: props.usuario,
      pregunta: props.pregunta,
      contenido: contenido,
    };
    fetch("/preguntas/hacerUnComentario", {
      method: "POST",
      body: JSON.stringify(comentario),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      formRef.current.contenido.value = "";
      const id = props.pregunta;
      const url =
        "/preguntas/comentariosUnaPregunta/?page=" + page + "&pregunta=" + id;
      fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          
          setcomentarios(json.preguntas);
        });
    });
  };
  return (
    <>
      <button
        className="btn-comentarios"
        variant="primary"
        onClick={handleShow}
      >
        Comentarios de esta publicación
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <div className="modal-title">Comentarios</div>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <form onSubmit={comentar} ref={formRef}>
              <label>Haz un comentario:</label>
              <div className="input-group mb-3">
                <textarea
                  name="contenido"
                  className="form-control"
                  aria-label="descripcion"
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  className="btn-comentarios"
                  type="submit"
                  variant="primary"
                >
                  Comenta
                </button>
              </div>
            </form>
            <br></br>
            <br></br>
          </ul>
          <ul className="list-group">
            {comentarios ? (
              comentarios.map((elem, index) => {
                return (
                  <li key={index} className="list-group-item">
                    {elem.contenido}
                  </li>
                );
              })
            ) : (
              <div></div>
            )}
          </ul>

          {hasMore ? (
            <button className="btnLogin" onClick={cargarMas}>
              Cargar más
            </button>
          ) : (
            <div></div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn-comentarios"
            variant="primary"
            onClick={handleShow}
          >
            Comentarios de esta publicación
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Comentarios.propTypes = {};

export default Comentarios;
