import {Navigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import * as spotifyClient from "../spotify/client";
import * as rankingClient from "./client";
import * as albumClient from "../albums/client";
import * as artistClient from "../artists/client";
import {useSelector} from "react-redux";
import "../styles.css";

import {
    DndContext,
    rectIntersection,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import Trash from "./Trash";
import SortableItem from "./SortableItem";
import {Link, useNavigate} from "react-router-dom";
import DeleteRankingModal from "../DeleteRankingModal";

function RankingEditor() {
    const {aid} = useParams();
    const [originalAlbums, setOriginalAlbums] = useState(null);
    const [albumIds, setAlbumIds] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [overTrash, setOverTrash] = useState(false);
    const [comment, setComment] = useState("");
    const [artist, setArtist] = useState(null);
    const [rankingExists, setRankingExists] = useState(false);
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.usersReducer);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchAlbums = async () => {
        let fetchedAlbums = await spotifyClient.fetchArtistAlbums(aid);
        fetchedAlbums = fetchedAlbums.map(fetchedAlbum => {
                const album = {
                    _id: fetchedAlbum.id,
                    name: fetchedAlbum.name,
                };
                if (fetchedAlbum.images.length > 0) {
                    album.image = fetchedAlbum.images[0].url;
                }
                return album;
            }
        );
        setOriginalAlbums(fetchedAlbums);
        const userRanking = await rankingClient.findRanking(currentUser._id, aid);
        if (userRanking) {
            setRankingExists(true);
            setAlbumIds(userRanking.ranking.map((album) => album._id));
            setComment(userRanking.comment);
            console.log(userRanking.ranking)
        } else {
            setAlbumIds(fetchedAlbums.map((album) => album._id));
        }
    };

    const fetchArtist = async () => {
        const artist = await spotifyClient.fetchArtistDetails(aid);
        setArtist(artist);
    };

    const isArtistInDatabase = async () => {
        const artist = await artistClient.findArtistById(aid);
        return !!artist;
    };

    const isAlbumInDatabase = async (albumId) => {
        const album = await albumClient.findAlbumById(albumId);
        return !!album;
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

    const addAlbum = async (albumId) => {
        const album = originalAlbums.find(album => album._id === albumId);
        const albumToAdd = {
            _id: album._id,
            name: album.name,
        }
        if (album.image) {
            albumToAdd.image = album.image;
        }
        await albumClient.createAlbum(albumToAdd);
    }

    const handleRankingClick = async () => {
        const artistInDatabase = await isArtistInDatabase();
        if (!artistInDatabase) {
            await addArtist();
        }
        for (const albumId of albumIds) {
            const albumInDatabase = await isAlbumInDatabase(albumId);
            if (!albumInDatabase) {
                await addAlbum(albumId);
            }
        }
        const ranking = {
            userId: currentUser._id,
            artistId: aid,
            ranking: [...albumIds],
            comment: comment,
        };
        if (rankingExists) {
            await rankingClient.updateRanking(ranking.userId, ranking.artistId, ranking.ranking, ranking.comment);
        } else {
            await rankingClient.createRanking(ranking.userId, ranking.artistId, ranking.ranking, ranking.comment);
        }
        navigate("/details/" + aid);
    }

    const handleResetClick = () => {
        setAlbumIds(originalAlbums.map((album) => album._id));
        setComment("");
    };

    const handleDeleteClick = async () => {
        await rankingClient.deleteRanking(currentUser._id, aid);
        navigate("/details/" + aid);
    };

    useEffect(() => {
        if (currentUser) {
            fetchArtist();
            fetchAlbums();
        }
    }, [aid]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const {active, over} = event;

        if (!over) return;

        if (over.id === "trash")
            setOverTrash(true);
        else
            setOverTrash(false);

        if (active.id !== over.id) {
            const oldIndex = albumIds.indexOf(active.id);
            const newIndex = albumIds.indexOf(over.id);
            setAlbumIds((albumIds) => arrayMove(albumIds, oldIndex, newIndex));
        }
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const {active, over} = event;

        if (!over) return;

        if (active.id !== over.id) {
            if (over.id === "trash") {
                setAlbumIds((albumIds) => albumIds.filter((albumId) => albumId !== active.id));
                setOverTrash(false);
            } else {
                const oldIndex = albumIds.indexOf(active.id);
                const newIndex = albumIds.indexOf(over.id);
                setAlbumIds((albumIds) => arrayMove(albumIds, oldIndex, newIndex));
            }
        }
    };


    return (
        <>
            {currentUser ?
                <>
                    {albumIds &&
                        <>
                            <div className="container my-5">
                                <div className="border border-dark rounded p-3">
                                    <Link to={`/details/${aid}`}
                                          className="link-dark link-underline link-underline-dark
                          link-underline-opacity-0 link-underline-opacity-75-hover">
                                        <h3>
                                            {artist.name}
                                        </h3>
                                    </Link>
                                    <hr/>
                                    <div className="row">
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={rectIntersection}
                                            onDragStart={handleDragStart}
                                            onDragOver={handleDragOver}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div
                                                className="col-12 col-md d-flex justify-content-center align-items-center mb-4 mb-md-0">
                                                <Trash items={albumIds} overTrash={overTrash}/>
                                            </div>
                                            <div className="col-12 col-md-9">
                                                <SortableContext
                                                    items={albumIds}
                                                    strategy={rectSortingStrategy}
                                                >
                                                    <div className="d-flex flex-wrap justify-content-center">
                                                        {albumIds.map((albumId) => (
                                                            <SortableItem key={albumId} id={albumId}
                                                                          hideOnDrag={overTrash}>
                                                                <img
                                                                    src={originalAlbums.find((album) => album._id === albumId).image}
                                                                    alt={originalAlbums.find((album) => album._id === albumId).name}
                                                                    style={{width: "100px", height: "100px"}}
                                                                    title={originalAlbums.find((album) => album._id === albumId).name}
                                                                />
                                                            </SortableItem>
                                                        ))}
                                                    </div>
                                                    <DragOverlay>
                                                        {activeId ? (
                                                            <div
                                                                style={{
                                                                    width: "100px",
                                                                    height: "100px",
                                                                }}
                                                            >
                                                                <img
                                                                    src={originalAlbums.find((album) => album._id === activeId).image}
                                                                    alt={originalAlbums.find((album) => album._id === activeId).name}
                                                                    style={{width: "100px", height: "100px"}}
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </DragOverlay>
                                                </SortableContext>
                                            </div>
                                        </DndContext>
                                        <div>
                                            <hr/>
                                            <textarea className="form-control" value={comment}
                                                      onChange={(e) => setComment(e.target.value)}
                                                      rows="10" placeholder="Explain your ranking here"/>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                        <button className="btn btn-dark mx-1" onClick={handleRankingClick}>
                                            {rankingExists ? "Update Ranking" : "Create Ranking"}
                                        </button>
                                        <Link to={`/details/${aid}`} className="btn btn-outline-dark mx-1">Cancel</Link>
                                        <button className="btn btn-primary mx-1" onClick={handleResetClick}>Reset
                                        </button>
                                        {rankingExists &&
                                            <button className="btn btn-danger mx-1"
                                                    data-bs-toggle="modal" data-bs-target="#deleteRankingModal"
                                            >Delete
                                            </button>}
                                    </div>
                                </div>
                            </div>

                            <DeleteRankingModal handleDeleteClick={handleDeleteClick}/>

                        </>
                    }
                </> :
                <Navigate to="/login"/>}
        </>
    );
}

export default RankingEditor;