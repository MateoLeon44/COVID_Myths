import React, { useState, useEffect } from "react";
import { Route, Link } from "react-router-dom";
import Home from "../components/Home";
import Menu from "../components/Menu";
import Login from "../components/Login";
import Footer from "./Footer";
import Register from "../components/Register";
import Noticias from "../components/VerNoticias"

const Navbar = () => {
  const [img, setimg] = useState("./img/noticias.png");
  const [mostrar, setmostrar] = useState(true);

  useEffect(() => {
    setmostrar(true);
    console.log(mostrar)
  })

  return (
    <div>
      {mostrar ? (
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
              <Link className="btnLogin" to="/register">Registrate</Link>
              <Link className="btnLogin" to="/login">
                Ingresa
              </Link>
            </div>
          </nav>
          <hr></hr>
        </div>
      ) : (
        <div></div>
      )}

      <Route
        path="/"
        exact
        component={() => <Home img={img} setimg={setimg}></Home>}
      ></Route>

      <Route
        path="/menu"
        exact
        component={() => <Menu setmostrar={setmostrar}></Menu>}
      ></Route>

      <Route path="/login" exact component={() => <Login></Login>}></Route>

      <Route path="/register" exact component={() => <Register></Register>}></Route>

      <Route
        path="/noticias"
        exact
        component={() => <Noticias setmostrar={setmostrar}></Noticias>}
      ></Route>

      {mostrar ? <Footer></Footer> : <div></div>}
      
    </div>
  );
};

export default Navbar;
