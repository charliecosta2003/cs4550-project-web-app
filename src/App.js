import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import Home from "./Home";
import NavBar from "./NavBar";
import Search from "./Search";
import Details from "./Details";

function App() {
    return (
        <HashRouter>
            <div>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/home"/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/search/:query" element={<Search/>}/>
                    <Route path="/details/:aid" element={<Details/>}/>
                    <Route path="/login" element={<h1>Login</h1>}/>
                    <Route path="/register" element={<h1>Register</h1>}/>
                    <Route path="/profile" element={<h1>Profile</h1>}/>
                    <Route path="/profile/:uid" element={<h1>Profile</h1>}/>
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
