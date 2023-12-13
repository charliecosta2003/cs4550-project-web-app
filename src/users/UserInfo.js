import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import * as userClient from "./client";
import {setCurrentUser, setLoggedIn} from "./reducer";
import * as followClient from "../follows/client";
import {useNavigate} from "react-router-dom";
import * as rankingClient from "../ranking/client";
import * as favoritesClient from "../favorites/client";
import DeleteProfileModal from "./DeleteProfileModal";

function UserInfo({isAdmin, uid, pathname, followers, following, rankings, favorites, credentials, setCredentials}) {

    const {currentUser} = useSelector(state => state.usersReducer);
    const [isFollowing, setIsFollowing] = useState(false);

    const [canEdit, setCanEdit] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();



    const updateProfile = async () => {
        if (credentials.username.length === 0) {
            console.log("in here")
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
            await userClient.updateUser(credentials, true);
            setCurrentUser(credentials);
            setCanEdit(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const doesCurrentUserFollow = async () => {
        const response = await followClient.followExists(currentUser._id, uid);
        setIsFollowing(response);
    };

    const handleFollowClick = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        if (isFollowing) {
            await unfollow(uid);
        } else {
            await follow(uid);
        }
    }

    const follow = async (id) => {
        await followClient.createFollow(currentUser._id, id);
        setIsFollowing(true);
    };

    const unfollow = async (id) => {
        await followClient.deleteFollow(currentUser._id, id);
        setIsFollowing(false);
    };

    const deleteProfile = async () => {
        const id = isOwner ? currentUser._id : uid;

        for (const follower of followers) {
            await followClient.deleteFollow(follower._id, id);
        }
        for (const followee of following) {
            await followClient.deleteFollow(id, followee._id);
        }
        for (const ranking of rankings) {
            await rankingClient.deleteRanking(id, ranking.artist._id);
        }
        for (const favorite of favorites) {
            await favoritesClient.deleteFavorite(id, favorite._id);
        }
        if (isOwner) {
            await userClient.deleteUser(credentials);
            await userClient.logout();
            setCurrentUser(null);
            setLoggedIn(false);
            navigate("/home");
        } else {
            await userClient.deleteUser(credentials);
            navigate("/users");
        }
    }

    useEffect(() => {
        if (uid && currentUser)
            doesCurrentUserFollow();

        setIsOwner(uid === undefined);

    }, [uid, pathname, isFollowing]);


    return (
        <>
            {credentials && (
                <>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!canEdit && (
                        <div className="w-100">
                            <div className="d-flex w-100 align-items-center">
                                <h1 style={{textOverflow: "ellipsis"}}>{credentials.username}</h1>
                                {!isOwner &&
                                    <button className="btn btn-dark ms-3" onClick={handleFollowClick}
                                            style={{width: "90px", height: "40px"}}
                                    >
                                        {!isFollowing ? <span>Follow</span> : <span>Unfollow</span>}
                                    </button>
                                }
                            </div>
                            <h2 className="mt-2 overflow-hidden pb-2"
                                style={{textOverflow: "ellipsis"}}>
                                {credentials.firstName} {credentials.lastName}
                            </h2>
                            {(isOwner || isAdmin) &&
                                <button className="btn btn-dark mt-3 w-100" onClick={() => setCanEdit(true)}>
                                    Edit Profile
                                </button>}
                        </div>
                    )}
                    {canEdit && (
                        <>
                            <label htmlFor="profile-username" className="form-label mb-1">
                                Username
                            </label>
                            <input
                                id="profile-username"
                                className="form-control mb-2"
                                value={credentials.username}
                                disabled
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                            <label htmlFor="profile-password" className="form-label mb-1">
                                Password
                            </label>
                            <input id="profile-password"
                                   className="form-control mb-2"
                                   value={credentials.password}
                                   onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                            <label htmlFor="profile-firstname" className="form-label mb-1">
                                First Name
                            </label>
                            <input id="profile-firstname"
                                   className="form-control mb-2"
                                   value={credentials.firstName}
                                   onChange={(e) => setCredentials({...credentials, firstName: e.target.value})}
                            />
                            <label htmlFor="profile-lastname" className="form-label mb-1">
                                Last Name
                            </label>
                            <input id="profile-lastname"
                                   className="form-control mb-2"
                                   value={credentials.lastName}
                                   onChange={(e) => setCredentials({...credentials, lastName: e.target.value})}
                            />
                            <label htmlFor="profile-email" className="form-label mb-1">
                                Email
                            </label>
                            <input id="profile-email"
                                   className="form-control mb-2"
                                   value={credentials.email}
                                   onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                            />
                            <label htmlFor="profile-phone" className="form-label mb-1">
                                Phone Number
                            </label>
                            <input id="profile-phone"
                                   className="form-control mb-2"
                                   type="tel"
                                   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                   value={credentials.phone}
                                   onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                            />
                            <label htmlFor="profile-dob" className="form-label mb-1">
                                Date of Birth
                            </label>
                            <input id="profile-dob"
                                   className={`form-control ${isAdmin && "mb-2"}`}
                                   type="date"
                                   value={credentials.dob ? credentials.dob.substring(0, 10) : ""}
                                   onChange={(e) => setCredentials({...credentials, dob: e.target.value})}
                            />
                            {isAdmin &&
                                <>
                                    <label htmlFor="profile-role" className="form-label mb-1">
                                        Role
                                    </label>
                                    <select id="profile-role"
                                            className="form-select"
                                            value={credentials.role}
                                            onChange={(e) => setCredentials({...credentials, role: e.target.value})}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </>
                            }
                            <button className="btn btn-dark mt-3 w-100" onClick={updateProfile}>
                                Save Profile
                            </button>
                            <button className="btn btn-outline-dark mt-1 w-100" onClick={() => setCanEdit(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger mt-1 w-100"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteProfileModal"
                            >
                                Delete Profile
                            </button>
                        </>
                    )}
                    <DeleteProfileModal deleteProfile={deleteProfile}/>
                </>
            )}
        </>
    );
}

export default UserInfo;