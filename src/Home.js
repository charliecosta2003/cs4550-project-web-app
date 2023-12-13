import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import * as favoritesClient from "./favorites/client";
import * as spotifyClient from "./spotify/client";
import ArtistCard from "./ArtistCard";
import * as followsClient from "./follows/client";
import * as rankingsClient from "./ranking/client";
import Ranking from "./Ranking";

function Home() {
    const {currentUser} = useSelector(state => state.usersReducer);
    const [favoriteArtist, setFavoriteArtist] = useState(null);
    const [displayFavorites, setDisplayFavorites] = useState([]);
    const [displayRankings, setDisplayRankings] = useState([]);
    const [hasFollowingRankings, setHasFollowingRankings] = useState(true);


    const fetchDisplayFavorites = async () => {
        if (currentUser) {
            let favorites = await favoritesClient.findUserFavorites(currentUser._id);
            if (favorites.length === 0) {
                fetchRecentFavorites();
                return;
            }
            if (favorites.length > 5) {
                favorites = favorites.slice(favorites.length - 5, favorites.length);
            }
            const randomIndex = Math.floor(Math.random() * favorites.length);
            setFavoriteArtist(favorites[randomIndex]);
            let relatedArtists = await spotifyClient.fetchRelatedArtists(favorites[randomIndex]._id);
            if (relatedArtists.length > 10) {
                relatedArtists = relatedArtists.slice(0, 10);
            }
            setDisplayFavorites(relatedArtists);
        } else {
            fetchRecentFavorites();
        }
    };

    const fetchRecentFavorites = async () => {
        let favorites = await favoritesClient.findAllFavorites();
        favorites = favorites.map(favorite => favorite.artist);
        let filteredFavorites = [];
        const favoritesIndexSet = new Set();
        for (let favorite of favorites) {
            if (!favoritesIndexSet.has(favorite._id)) {
                filteredFavorites.push(favorite);
                favoritesIndexSet.add(favorite._id);
            }
        }
        if (filteredFavorites.length > 10) {
            filteredFavorites = filteredFavorites.slice(filteredFavorites.length - 10, filteredFavorites.length);
        }
        setDisplayFavorites(filteredFavorites);
    };

    const fetchDisplayRankings = async () => {
        if (currentUser) {
            let following = await followsClient.findUserFollowing(currentUser._id);
            if (following.length === 0) {
                setHasFollowingRankings(false);
                fetchRecentRankings();
                return;
            }
            let rankings;
            if (following.length >= 3) {
                following.sort(() => Math.random() - 0.5);
                rankings = await rankingsClient.findUsersRankings(following[0]._id, following[1]._id, following[2]._id);
            } else if (following.length === 2) {
                rankings = await rankingsClient.findUsersRankings(following[0]._id, following[1]._id, null);
            } else if (following.length === 1) {
                rankings = await rankingsClient.findUsersRankings(following[0]._id, null, null);
            }
            if (rankings.length === 0) {
                setHasFollowingRankings(false);
                fetchRecentRankings();
                return;
            }
            if (rankings.length > 10) {
                rankings = rankings.slice(rankings.length - 10, rankings.length);
            }
            rankings.sort(() => Math.random() - 0.5);
            setDisplayRankings(rankings);
        } else {
            setHasFollowingRankings(false);
            fetchRecentRankings();
        }
    };

    const fetchRecentRankings = async () => {
        let rankings = await rankingsClient.findAllRankings();
        if (rankings.length > 30) {
            rankings = rankings.slice(rankings.length - 30, rankings.length);
        }
        rankings.sort(() => Math.random() - 0.5);
        setDisplayRankings(rankings);
    }

    useEffect(() => {
        fetchDisplayFavorites();
        fetchDisplayRankings();
    }, [currentUser]);

    return (
        <div className="container my-3 px-4 px-md-0">
            {currentUser ? (
                <>
                    <h1>Welcome back to Album Ranker, {currentUser.firstName}!</h1>
                    <h4>Here you can rank your favorite albums by your favorite artists!</h4>
                </>
            ) : (
                <>
                    <h1>Welcome to Album Ranker!</h1>
                    <h4>Here you can rank your favorite albums by your favorite artists!</h4>
                </>
            )}
            <hr/>
            <div className="row">
                <div className="col-12 col-md-5 col-lg-4 col-xl-3">
                    {(currentUser && favoriteArtist) ? (
                        <>
                            <h4>Because you like {favoriteArtist.name}</h4>
                            <div className="border border-dark rounded p-3">
                                <div className={"row row-cols-3 row-cols-md-2 g-2"}>
                                    {displayFavorites.map((artist) => {
                                        return (
                                            <ArtistCard artistId={artist.id}
                                                        artistName={artist.name}
                                                        artistImage={artist.images.length > 0 ? artist.images[0].url : "user.png"}
                                                        key={artist.id}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4>Recent Popular Artists</h4>
                            <div className="border border-dark rounded p-3">
                                <div className={"row row-cols-3 row-cols-md-2 g-2"}>
                                    {displayFavorites.map((artist) => {
                                        return (
                                            <ArtistCard artistId={artist._id}
                                                        artistName={artist.name}
                                                        artistImage={artist.image ? artist.image : "user.png"}
                                                        key={artist._id}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="col-12 col-md-7 col-lg-8 col-xl-9 ps-4 pb-3">
                    {(currentUser && hasFollowingRankings) ? (
                        <>
                            <h4>Recent Follower Rankings</h4>
                            {displayRankings.map(ranking =>
                                <Ranking title={ranking.artist.name} url={`/details/${ranking.artist._id}`}
                                         title2={ranking.user.username} url2={`/profile/${ranking.user._id}`}
                                         ranking={ranking.ranking} comment={ranking.comment}
                                         artistId={ranking.artist._id} userId={ranking.user._id}
                                         key={ranking._id}/>
                            )}
                        </>
                    ) : (
                        <>
                            <h4>Recent Rankings</h4>
                            {displayRankings.map(ranking =>
                                <Ranking title={ranking.artist.name} url={`/details/${ranking.artist._id}`}
                                         title2={ranking.user.username} url2={`/profile/${ranking.user._id}`}
                                         ranking={ranking.ranking} comment={ranking.comment}
                                         artistId={ranking.artist._id} userId={ranking.user._id}
                                         key={ranking._id}/>
                            )}
                        </>
                    )}
                </div>
            </div>


        </div>
    );
}

export default Home;