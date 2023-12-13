import {useSelector} from "react-redux";
import {Navigate, useNavigate, useParams} from "react-router";
import * as followClient from "../follows/client";
import * as favoritesClient from "../favorites/client";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import * as rankingsClient from "../ranking/client";
import UserInfo from "./UserInfo";
import Ranking from "../Ranking";
import ArtistCard from "../ArtistCard";
import * as userClient from "./client";

function Profile() {
    const {currentUser} = useSelector(state => state.usersReducer);
    const navigate = useNavigate();
    const {uid} = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [credentials, setCredentials] = useState(null);
    const {pathname} = useLocation();

    const fetchFollowersAndFollowing = async (id) => {
        const localFollowers = await followClient.findUserFollowers(id);
        setFollowers(localFollowers);
        const localFollowing = await followClient.findUserFollowing(id);
        setFollowing(localFollowing);
    };

    const fetchFavorites = async (id) => {
        const localFavorites = await favoritesClient.findUserFavorites(id);
        setFavorites(localFavorites);
    };

    const fetchRankings = async (id) => {
        const localRankings = await rankingsClient.findUserRankings(id);
        setRankings(localRankings);
    }

    const loadCredentials = async () => {
        let user;
        if (uid) {
            user = await userClient.findUserById(uid);
        } else {
            user = {...currentUser};
        }
        setCredentials(user);
    };

    useEffect(() => {
        if (currentUser && currentUser._id === uid) {
            navigate("/profile", {replace: true});
            return;
        }
        if (currentUser && currentUser.role === "ADMIN") {
            setIsAdmin(true);
        }
        let id;
        if (uid) {
            id = uid;
        } else {
            id = currentUser._id;
        }
        loadCredentials();
        fetchFavorites(id);
        fetchFollowersAndFollowing(id);
        fetchRankings(id);
        setLoading(false);
    }, [pathname]);

    return (
        <div className="container-md my-5 px-4 px-md-0">
            {!loading && credentials && (currentUser || uid) &&
                <div className="row">
                    <div className="col-12 col-md-5 col-lg-4 col-xl-3">
                        <div className="border border-dark rounded p-3">
                            <UserInfo isAdmin={isAdmin} uid={uid} pathname={pathname}
                                      followers={followers} following={following} rankings={rankings}
                                      favorites={favorites} credentials={credentials} setCredentials={setCredentials}
                            />
                            <hr/>
                            <Link to={`/profile${uid ? `/${uid}` : ""}/followers`}
                                  className="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                            >
                                <h3>{followers.length} {followers.length !== 1 ? "followers" : "follower"}</h3>
                            </Link>
                            <Link to={`/profile${uid ? `/${uid}` : ""}/following`}
                                  className="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                            >
                                <h3>{following.length} following</h3>
                            </Link>
                            {(pathname.includes("following") || pathname.includes("followers")) &&
                                <>
                                    <hr/>
                                    <Link to={`/profile${uid ? `/${uid}` : ""}`}
                                          className="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                                    >
                                        <h3>Rankings</h3>
                                    </Link>
                                </>
                            }
                        </div>

                        <div className="my-4">
                            <h2>Favorites List ({favorites.length})</h2>
                            <div className="border border-dark rounded p-3">
                                <div className={"row row-cols-3 row-cols-md-2 g-2"}>
                                    {favorites.map((artist) => {
                                        return (
                                            <ArtistCard artistId={artist._id}
                                                        artistName={artist.name}
                                                        artistImage={artist.image ? artist.image : "user.png"}
                                                        key={artist._id}
                                            />
                                        );
                                    })}
                                </div>
                                {favorites.length === 0 && <h3 className="mb-0">No favorites yet.</h3>}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-7 col-lg-8 col-xl-9 ps-4 pb-3">
                        {(pathname === `/profile${uid ? `/${uid}` : ""}`) &&
                            <>
                                <h2>Rankings ({rankings.length})</h2>
                                <div>
                                    {rankings.map(ranking =>
                                        <Ranking title={ranking.artist.name}
                                                 url={`/details/${ranking.artist._id}`}
                                                 ranking={ranking.ranking}
                                                 comment={ranking.comment}
                                                 key={ranking._id}
                                                 artistId={ranking.artist._id}
                                                 userId={ranking.user}
                                        />
                                    )}
                                </div>
                                {rankings.length === 0 &&
                                    <div className="border border-dark rounded p-3 mb-3">
                                        <h3>No rankings yet.</h3>
                                    </div>
                                }
                            </>
                        }

                        {(pathname === `/profile${uid ? `/${uid}` : ""}/followers`) &&
                            <>
                                <h2>Followers</h2>
                                <div className="border border-dark rounded p-3">
                                    {followers.map((follower, index) => (
                                            <>
                                                <div key={follower._id}>
                                                    <Link to={`/profile/${follower._id}`}
                                                          className="link-dark link-underline link-underline-dark
                                                      link-underline-opacity-0 link-underline-opacity-75-hover"
                                                    >
                                                        <h2>{follower.username}</h2>
                                                    </Link>
                                                </div>
                                                {index !== followers.length - 1 && <hr/>}
                                            </>
                                        )
                                    )}
                                    {followers.length === 0 && <h3>No followers yet.</h3>}
                                </div>
                            </>
                        }

                        {(pathname === `/profile${uid ? `/${uid}` : ""}/following`) &&
                            <>
                                <h2>Followers</h2>
                                <div className="border border-dark rounded p-3">
                                    {following.map((followee, index) => (
                                            <>
                                                <div key={followee._id}>
                                                    <Link to={`/profile/${followee._id}`}
                                                          className="link-dark link-underline link-underline-dark
                                                      link-underline-opacity-0 link-underline-opacity-75-hover"
                                                    >
                                                        <h2>{followee.username}</h2>
                                                    </Link>
                                                </div>
                                                {index !== following.length - 1 && <hr/>}
                                            </>
                                        )
                                    )}
                                    {following.length === 0 && <h3>Not following anyone yet.</h3>}
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
            {!(currentUser || uid) &&
                <Navigate to={"/home"} replace={true}/>
            }
        </div>
    );
}

export default Profile;