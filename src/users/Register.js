import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as client from "./client";
import {setCurrentUser, setLoggedIn} from "./reducer";
import {Navigate} from "react-router";

function Register() {

    const {currentUser} = useSelector(state => state.usersReducer);
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const register = async () => {
        if (credentials.username.length === 0) {
            setError("Username cannot be blank.");
            return;
        }
        if (credentials.password.length === 0) {
            setError("Password cannot be blank.");
            return;
        }
        if (credentials.username.includes(" ")) {
            setError("Username cannot contain spaces.");
            return;
        }
        if (credentials.password.includes(" ")) {
            setError("Password cannot contain spaces.");
            return;
        }
        if (credentials.firstName.length === 0) {
            setError("First name cannot be blank.");
            return;
        }
        if (credentials.lastName.length === 0) {
            setError("Last name cannot be blank.");
            return;
        }
        try {
            const user = await client.register(credentials);
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
                        <h1 className="mt-5">Register</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="border border-dark rounded p-3">
                            <label htmlFor="login-username" className="form-label">
                                Username*
                            </label>
                            <input
                                id="login-username"
                                className="form-control"
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                            <label htmlFor="login-password" className="form-label">
                                Password*
                            </label>
                            <input
                                id="login-password"
                                className="form-control"
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                            <label htmlFor="login-firstname" className="form-label">
                                First Name*
                            </label>
                            <input
                                id="login-firstname"
                                className="form-control"
                                value={credentials.firstName}
                                onChange={(e) => setCredentials({...credentials, firstName: e.target.value})}
                            />
                            <label htmlFor="login-lastname" className="form-label">
                                Last Name*
                            </label>
                            <input
                                id="login-lastname"
                                className="form-control"
                                value={credentials.lastName}
                                onChange={(e) => setCredentials({...credentials, lastName: e.target.value})}
                            />
                            <label htmlFor="login-email" className="form-label">
                                Email
                            </label>
                            <input
                                id="login-email"
                                className="form-control"
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            />
                            <label htmlFor="login-phone" className="form-label">
                                Phone Number
                            </label>
                            <input
                                id="login-phone"
                                className="form-control"
                                type="tel"
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                value={credentials.phone}
                                onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                            />
                            <label htmlFor="login-dob" className="form-label">
                                Date of Birth
                            </label>
                            <input
                                id="login-dob"
                                className="form-control"
                                type="date"
                                value={credentials.dob}
                                onChange={(e) => setCredentials({...credentials, dob: e.target.value})}
                            />
                            <button className="btn btn-primary mt-3 w-100" onClick={register}>Register</button>
                            <h6 className="mt-3">* Indicates Required Field</h6>
                            <h6 className="mt-1">
                                Already have an account?
                                <Link
                                    to="/login"
                                    className="link-primary link-underline-opacity-0 link-underline-opacity-100-hover ms-1">
                                    Log In
                                </Link>
                            </h6>
                        </div>
                    </div>
                </div> :
                <Navigate to={"/home"}/>}
        </>
    );
}

export default Register;