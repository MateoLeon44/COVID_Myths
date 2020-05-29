import React, { useState } from "react";
import { Route, NavLink } from "react-router-dom";
import "./styles/Menu.css";
import ForoPreguntas from "./ForoPreguntas";
import Noticias from "../components/VerNoticias";
import VerDetalleNoticia from "../components/VerDetalleNoticia";
import Footer from "../layout/Footer";
const Menu = (props) => {
  const [initial, setInitial] = useState(true);
  return (
    <div>
      <div>
        <div className="sidebar">
          <a>Menu </a>
          <hr></hr>
          <NavLink to="/preguntar" activeClassName="is-active">
            Preguntar
          </NavLink>
          <NavLink to="/noticias">Noticias</NavLink>
        </div>
        <div className="content">
          {initial ? (
            <div>
              <div className="welcome">
                Bienvenido !! <br></br>a la izquierda encontrarás un las
                opciones para hacer la pregunta o ver la noticias sobre el COVID
                Todas las noticias son traidas desde:
              </div>
              <div className="text-center">
                <a href="https://newsapi.org/docs/get-started" title="API">
                News API
                </a>{" "}
              </div>
              <hr></hr>
              <img
                src="./img/readNew.jpg"
                className="rounded mx-auto d-block"
                alt="Leer noticias"
              ></img>
              <Footer></Footer>
            </div>
          ) : (
            <div></div>
          )}
          <Route
            path="/preguntar"
            exact
            component={() => (
              <ForoPreguntas
                user={props.user}
                q={props.q}
                setUser={props.setUser}
                setInitial={setInitial}
              ></ForoPreguntas>
            )}
          ></Route>
          <Route
            path="/noticias"
            exact
            component={() => <Noticias setUser={props.setUser} setInitial={setInitial}></Noticias>}
          ></Route>
          <Route
            path="/verDetalleNoticia"
            exact
            component={() => (
              <VerDetalleNoticia user={props.user}></VerDetalleNoticia>
            )}
          ></Route>
        </div>
      </div>
    </div>
  );
};

Menu.propTypes = {};

export default Menu;
