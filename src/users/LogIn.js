import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import * as client from "./client";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser, setLoggedIn} from "./reducer";
import {Navigate} from "react-router";

function LogIn() {

    const {currentUser} = useSelector(state => state.usersReducer);
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const login = async () => {
        try {
            const user = await client.login(credentials);
            dispatch(setCurrentUser(user));
            dispatch(setLoggedIn(true));
            navigate("/home");
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <>
            {!currentUser ?
                <div className="d-flex justify-content-center mt-5">
                    <div style={{width: "300px"}}>
                        <h1 className="mt-5">Log In</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="border border-dark rounded p-3">
                            <label htmlFor="login-username" className="form-label">
                                Username
                            </label>
                            <input
                                id="login-username"
                                className="form-control"
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                            <label htmlFor="login-password" className="form-label">
                                Password
                            </label>
                            <input id="login-password"
                                   className="form-control"
                                   type="password"
                                   value={credentials.password}
                                   onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                            <button className="btn btn-primary mt-3 w-100" onClick={login}>Log In</button>
                            <h6 className="mt-3">
                                Don't have an account?
                                <Link
                                    to="/register"
                                    className="link-primary link-underline-opacity-0 link-underline-opacity-100-hover ms-1">
                                    Register
                                </Link>
                            </h6>
                        </div>
                    </div>
                </div> :
                <Navigate to={"/home"}/>}
        </>
    );
}

export default LogIn;