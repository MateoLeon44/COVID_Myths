import React, { useState } from "react";
import { Route, Link } from "react-router-dom";
import Home from "../components/Home";
import Menu from "../components/Menu";
import Login from "../components/Login";
import Footer from "./Footer";
import Register from "../components/Register";
import Noticias from "../components/VerNoticias";

const Navbar = (props) => {
  const [img, setimg] = useState("./img/noticias.png");  

  return (
    <div className="container-fluid">
      <div>
        <nav className="navbar navbar-light">
          <Link className="navbar-brand" to="/">
            <img
              src="logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="Logo Aplicación"
            ></img>
          </Link>

          <div className="text-right">
            <Link className="btnLogin" to="/register">
              Registrate
            </Link>
            <Link className="btnLogin" to="/login">
              Ingresa
            </Link>
          </div>
        </nav>
        <hr></hr>
      </div>

      <Route
        path="/"
        exact
        component={() => <Home img={img} setimg={setimg}></Home>}
      ></Route>

      <Route
        path="/menu"
        exact
        component={() => <Menu></Menu>}
      ></Route>

      <Route path="/login" exact component={() => <Login setUsuario={props.setUsuario}></Login>}></Route>

      <Route
        path="/register"
        exact
        component={() => <Register></Register>}
      ></Route>

      <Route
        path="/noticias"
        exact
        component={() => <Noticias></Noticias>}
      ></Route>
      <Footer></Footer>
    </div>
  );
};

export default Navbar;
