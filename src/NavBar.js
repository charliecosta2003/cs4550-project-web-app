import {Link, useNavigate} from "react-router-dom";
import {FaSearch} from "react-icons/fa";
import {useState} from "react";

function NavBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home">Navbar</Link>
                <div>
                    <button className="navbar-toggler me-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSearch" aria-controls="navbarSearch"
                            aria-expanded="false" aria-label="Toggle search">
                        <FaSearch style={{"width": "30px", "height": "30px"}}/>
                    </button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item" key="home">
                            <Link className="nav-link active" to="/home">Home</Link>
                        </li>
                        {!loggedIn ?
                            <>
                                <li className="nav-item d-lg-none" key="login">
                                    <Link className="nav-link active" to="/login">Log In</Link>
                                </li>
                                <li className="nav-item d-lg-none" key="register">
                                    <Link className="nav-link active" to="/register">Register</Link>
                                </li>
                            </>
                            :
                            <li className="nav-item d-lg-none" key="profile">
                                <Link className="nav-link active" to="/profile">Profile</Link>
                            </li>
                        }
                    </ul>
                </div>
                <div className="collapse navbar-collapse mt-2 mt-lg-0 d-lg-flex justify-content-lg-center"
                     id="navbarSearch">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}/>
                        <button className="btn btn-outline-success" type="submit"
                                onClick={() => navigate(`/search/${search}`)}>
                            Search
                        </button>
                    </form>
                </div>
                <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end"
                     id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {!loggedIn ?
                            <>
                                <li className="nav-item" key="collapse-login">
                                    <Link className="nav-link active" to="/login">Log In</Link>
                                </li>
                                <li className="nav-item" key="collapse-register">
                                    <Link className="nav-link active" to="/register">Register</Link>
                                </li>
                            </>
                            :
                            <li className="nav-item" key="collapse-profile">
                                <Link className="nav-link active" to="/profile">Profile</Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;