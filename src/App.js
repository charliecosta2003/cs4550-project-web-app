import {HashRouter} from "react-router-dom";
import {Routes, Route, Navigate} from "react-router";
import Home from "./Home";
import NavBar from "./NavBar";
import Search from "./Search";
import Details from "./Details";
import LogIn from "./users/LogIn";
import Register from "./users/Register";
import {Provider} from "react-redux";
import CurrentUser from "./users/CurrentUser";
import store from "./store";
import Profile from "./users/Profile";
import RankingEditor from "./ranking/RankingEditor";
import AlbumDetails from "./AlbumDetails";
import UserTable from "./UserTable";

function App() {
    return (
        <HashRouter>
            <Provider store={store}>
                <CurrentUser>
                    <div>
                        <NavBar/>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home"/>}/>
                            <Route path="/home" element={<Home/>}/>
                            <Route path="/search" element={<Navigate to="/home"/>}/>
                            <Route path="/search/:query" element={<Search/>}/>
                            <Route path="/details/:aid" element={<Details/>}/>
                            <Route path="/details/:aid/albums/:albumId" element={<AlbumDetails/>}/>
                            <Route path='/details/:aid/ranking' element={<RankingEditor/>}/>
                            <Route path="/login" element={<LogIn/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/profile/following" element={<Profile/>}/>
                            <Route path="/profile/followers" element={<Profile/>}/>
                            <Route path="/profile/:uid" element={<Profile/>}/>
                            <Route path="/profile/:uid/following" element={<Profile/>}/>
                            <Route path="/profile/:uid/followers" element={<Profile/>}/>
                            <Route path="/users" element={<UserTable/>}/>
                        </Routes>
                    </div>
                </CurrentUser>
            </Provider>
        </HashRouter>
    );
}

export default App;
