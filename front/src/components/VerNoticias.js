import React, { useEffect, useState } from "react";
import "./styles/Menu.css";
import "./styles/VerNoticias.css";
import { useHistory } from "react-router-dom";

const Noticias = (props) => {
  const [noticias, setNoticias] = useState([]);
  const [page, setPages] = useState(1);
  const [hayNoticias, setHayNoticias] = useState(false);
  const history = useHistory();
  const [fetching, setFetching] = useState(false);

  const loadMore = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setPages((prevState) => {
        return prevState + 1;
      });
    }
  };

  const saliendo = () => {
    fetch("/salir", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      if (res.status == 200) {
        props.setUser(false);
      }
    });
  };

  useEffect(() => {
    props.setInitial(false);
    window.addEventListener("scroll", loadMore);
    fetch("/news/getNews", {
      method: "GET",
      qs: {
        page: 1,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.articles) {
          setHayNoticias(true);
          setNoticias(json.articles);
        }
      });
    return () => window.removeEventListener("scroll", loadMore);
  }, []);

  useEffect(() => {
    fetch("/news/getNews?page=" + page, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.articles) {
          setHayNoticias(true);
          setNoticias(noticias.concat(json.articles));
        }
      });
  }, [page]);

  return (
    <div>
      <div>
        <div className="container-fluid">
          <div className="fixed">
            <nav className="navbar navbar-light">
              <div className="navbar-brand" to="/"></div>

              <div className="text-right">
                <button className="btnLogin" onClick={saliendo}>
                  Salir
                </button>
              </div>
            </nav>

            <div className="row">
              {noticias
                ? noticias.map((el, key) => {
                    return (
                      <div
                        key={"noticia" + key}
                        className="col-sm-12 col-md-6 col-lg-6 col-xl-4"
                      >
                        <div
                          className="card cardBorder"
                          onClick={() =>
                            history.push("/verDetalleNoticia", { state: el })
                          }
                        >
                          <img
                            className="card-img-top"
                            src={el.urlToImage}
                            onError={(e) => (e.target.src = "./periodico.jpg")}
                            alt="Imagen de noticia"
                          ></img>
                          <div className="card-body">
                            <h5 className="card-title">{el.title}</h5>
                            <p className="card-text">{el.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noticias;
