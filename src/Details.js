import {useParams} from "react-router";
import {useEffect, useState} from "react";
import * as spotifyClient from "./spotify/client";
import * as artistClient from "./artists/client";
import * as favoritesClient from "./favorites/client";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import * as rankingClient from "./ranking/client";
import Ranking from "./Ranking";
import AlbumCard from "./AlbumCard";
import {MdFavorite, MdFavoriteBorder} from "react-icons/md";

function Details() {
    const {aid} = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const {currentUser} = useSelector(state => state.usersReducer);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rankings, setRankings] = useState([]);
    const [userRanking, setUserRanking] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    const fetchAlbums = async () => {
        const albums = await spotifyClient.fetchArtistAlbums(aid);
        setAlbums(albums);
    }

    const fetchArtist = async () => {
        const artist = await spotifyClient.fetchArtistDetails(aid);
        setArtist(artist);
    }

    const isArtistFavorite = async () => {
        const response = await favoritesClient.favoriteExists(currentUser._id, aid);
        setIsFavorite(response);
    }

    const isArtistInDatabase = async () => {
        const artist = await artistClient.findArtistById(aid);
        return !!artist;
    }

    const handleFavoriteClick = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        if (isFavorite) {
            await unfavorite();
        } else {
            await favorite();
        }
    }

    const favorite = async () => {
        const artistInDatabase = await isArtistInDatabase();
        if (!artistInDatabase) {
            await addArtist();
        }
        await favoritesClient.createFavorite(currentUser._id, aid);
        setIsFavorite(true);
    }

    const unfavorite = async () => {
        await favoritesClient.deleteFavorite(currentUser._id, aid);
        setIsFavorite(false);
    }

    const addArtist = async () => {
        const image = artist.images.length > 0 ? artist.images[0].url : "";
        const artistToAdd = {
            _id: artist.id,
            name: artist.name,
        }
        if (image) {
            artistToAdd.image = image;
        }
        await artistClient.createArtist(artistToAdd);
    };

    const fetchRankings = async () => {
        const localRankings = await rankingClient.findArtistRankings(aid);
        setRankings(localRankings);
    }

    const fetchUserRanking = async () => {
        if (!currentUser) {
            return;
        }
        const ranking = await rankingClient.findRanking(currentUser._id, aid);
        if (ranking) {
            setUserRanking(ranking);
        }
    }

    useEffect(() => {
        fetchArtist();
        fetchAlbums();
        fetchRankings();
        fetchUserRanking();
        if (currentUser) {
            isArtistFavorite();
        }
        setLoading(false);
    }, [aid]);

    useEffect(() => {
        if (userRanking && rankings.length > 0) {
            const filteredRankings = rankings.filter(ranking => ranking.user._id !== userRanking.user);
            setRankings(filteredRankings);
        }
    }, [userRanking]);

    return (
        <div className="container my-5 px-4 px-md-0">
            {!loading && artist &&
                <div className="row">
                    <div className="col-12 col-md-5 col-lg-4 col-xl-3">
                        <div className="border border-dark rounded p-3">
                            <div className="d-flex align-items-end">
                                <img
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        aspectRatio: "1/1"
                                    }}
                                    src={artist.images.length > 0 ? artist.images[0].url : "user.png"}
                                    alt={artist.name}
                                    className="w-75 mb-2"
                                />
                                <div onClick={handleFavoriteClick}>

                                    {isFavorite ?
                                        <MdFavorite
                                            className="float-end"
                                            style={{width: "60px", height: "60px"}}
                                        /> :
                                        <MdFavoriteBorder
                                            className="float-end"
                                            style={{width: "60px", height: "60px"}}
                                        />}
                                </div>
                            </div>
                            <h2>{artist.name}</h2>
                        </div>

                        <div className="my-4">
                            <h2>Albums ({albums.length})</h2>
                            <div className="border border-dark rounded p-3">
                                <div className={"row row-cols-3 row-cols-md-2 g-2"}>
                                    {albums.map((album) => {
                                        return (
                                            <AlbumCard artistId={aid}
                                                       albumId={album.id}
                                                       albumName={album.name}
                                                       albumImage={album.images[0].url}
                                            />
                                        );
                                    })}
                                </div>
                                {albums.length === 0 && <h3 className="mb-0">No albums yet.</h3>}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-7 col-lg-8 col-xl-9">
                        {currentUser && userRanking && (
                            <>
                                <h2>Your Ranking</h2>
                                <Ranking title={currentUser.username}
                                         url={"/profile"}
                                         ranking={userRanking.ranking}
                                         comment={userRanking.comment}
                                         artistId={aid}
                                         userId={currentUser._id}
                                />
                            </>
                        )}
                        <div className="d-flex flex-nowrap align-items-center">
                            {!userRanking && currentUser && (
                                <>
                                    <h2>You have not ranked this artist yet.</h2>
                                    <Link to={`/details/${aid}/ranking`} className="btn btn-dark ms-3">Create
                                        Ranking</Link>
                                </>
                            )}
                            {!currentUser && (
                                <>
                                    <h2>You must be logged in to rank this artist.</h2>
                                    <Link to="/login" className="btn btn-dark ms-3">Log In</Link>
                                </>)}
                        </div>
                        <hr/>
                        <h2>Other Rankings ({rankings.length})
                        </h2>
                        <div>
                            {rankings.map(ranking =>
                                <Ranking title={ranking.user.username}
                                         url={`/profile/${ranking.user._id}`}
                                         ranking={ranking.ranking}
                                         comment={ranking.comment}
                                         key={ranking._id}
                                         artistId={aid}
                                         userId={ranking.user._id}
                                />
                            )}
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default Details;