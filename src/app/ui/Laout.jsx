import { Link, Outlet } from "react-router-dom";
import './Layout.css'
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../feauters/context/AppContext";
import Base64 from "../../shared/base64/Base64";

export default function Layout() {
    const {user, setToken, count} = useContext(AppContext);

    return <>
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <a className="navbar-brand" asp-area="" asp-controller="Home" asp-action="Index">ASP_P26</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/privacy">Privacy</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-dark" to="/about">About</Link>
                            </li>
                        </ul>
                            <h3 className="header-h3">Пидсумок:{count}</h3>
                        <div>
                            {!!user && <>
                                <button type="button" className="btn btn-outline-secondary" 
                                    onClick={() => setToken(null)}>
                                    <i className="bi bi-box-arrow-right"></i>
                                </button>
                            </>}
                            {!user && <>
                                <a className="btn btn-outline-secondary" asp-controller="User" asp-action="SignUp"><i className="bi bi-person-circle"></i></a>
                                <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#authModal">
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </button>
                            </>}
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        <main><Outlet/></main>
        <footer className="border-top footer text-muted">
            <div className="container">
                &copy; 2025 - React-P26<Link to="/privacy"> Privacy</Link>
            </div>
        </footer>

        <AuthModal/>
    </>   
}

function AuthModal() {
    const { setToken } = useContext(AppContext);
    const closeModalRef = useRef();
    const [formState, setFormState] = useState({
        "login": "",
        "password": ""
    });
    const [isFormValid, setFormValid] = useState(false);

    const authenticate = () => {
        console.log(formState.login, formState.password);

        const credentials = Base64.encode(`${formState.login}:${formState.password}`);

        fetch("https://localhost:7229/user/login", {
            method: "GET",
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        }).then(r => r.json()).then(j => {
            if(j.status == 200) {
                const jwt = j.data;
                setToken(jwt);
            }
            else {
                console.error(j.data)
            }
        });

        // setUser({
        //     name: "The User",
        //     email: "user@i.ua"
        // })
        // closeModalRef.current.click();
    };


    useEffect(() => {
        console.log("useEffect", formState.login, formState.password);
        setFormValid(formState.login.length > 2 && formState.password.length > 2);
    }, [formState]);


    return <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="authModalLabel">Вхід до сайту</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="user-login-addon"><i className="bi bi-key"></i></span>
                                
                                <input
                                 onChange={e => {
                                    // formState.login = e.target.value
                                    // setFormState(formState) // ссылка не изменяется и состояние не обноавляется
                                    // console.log("event", formState.login);

                                    setFormState({...formState, login: e.target.value});
                                }}
                                 
                                 value={formState.login}
                                 name="user-login" type="text" className="form-control" placeholder="Логін" aria-label="Логін" aria-describedby="user-login-addon"/>
                                <div className="invalid-feedback"></div>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="user-password-addon"><i className="bi bi-lock"></i></span>
                                <input
                                 onChange={e => {
                                    setFormState(state => { return{...state, password: e.target.value } });
                                }}
                                 value={formState.password} 
                                 name="user-password" type="password" className="form-control" placeholder="Пароль" aria-label="Пароль" aria-describedby="user-password-addon"/>
                                <div className="invalid-feedback"></div>
                            </div>
                    </div>
                    <div className="modal-footer">
                        <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                        <button disabled={!isFormValid} onClick={authenticate} type="button" className="btn btn-primary">Вхід</button>
                    </div>
                </div>
            </div>
        </div>
}

