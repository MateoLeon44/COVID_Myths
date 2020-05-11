import React, { Redirect } from "react";
import PropTypes from "prop-types";
import { Route, Link } from "react-router-dom";
import "./Menu.css";
import Pregunta from "./Pregunta";
import ForoPreguntas from "./ForoPreguntas";
import Noticias from "../components/VerNoticias";
import VerDetalleNoticia from "../components/VerDetalleNoticia";

const Menu = (props) => {
  return (
    <div>
      <div>
        <div className="sidebar">
          <a className="active"> Menu </a>
          <Link to="/preguntar">Preguntar</Link>
        </div>
        <div className="content">
          <Route
            path="/preguntar"
            exact
            component={() => (
              <ForoPreguntas
                user={props.user}
                q={props.q}
                setUser={props.setUser}
              ></ForoPreguntas>
            )}
          ></Route>

          <Route
            path="/noticias"
            exact
            component={() => <Noticias></Noticias>}
          ></Route>

          <Route
            path="/verDetalleNoticia"
            exact
            component={() => <VerDetalleNoticia></VerDetalleNoticia>}
          ></Route>

        </div>
      </div>
    </div>
  );
};

Menu.propTypes = {};

export default Menu;
