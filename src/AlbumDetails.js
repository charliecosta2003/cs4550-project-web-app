import * as spotifyClient from "./spotify/client";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function AlbumDetails() {
    const {albumId} = useParams();
    const [album, setAlbum] = useState(null);

    const fetchAlbum = async () => {
        const album = await spotifyClient.fetchAlbumDetails(albumId);
        setAlbum(album);
    }

    useEffect(() => {
        fetchAlbum();
    }, [albumId]);

    return (
        <div className="container my-5 px-4 px-md-0">
            {album && (
                <>
                    <div className="border border-dark rounded p-3 mb-4">
                        <div className="d-flex flex-wrap">
                            {album.images.length > 0 && (
                                <img
                                    src={album.images[0].url}
                                    alt={album.name}
                                    style={{
                                        minWidth: "50px",
                                        maxWidth: "200px"
                                    }}
                                    className="w-50 me-4"
                                />
                            )}
                            <div className="d-flex flex-nowrap align-items-end mt-2">
                                <div>
                                    <h1>{album.name} ({album.release_date.substring(0, 4)})</h1>
                                    <div className="d-flex">
                                        {album.artists.map((artist, index) => {
                                            return (
                                                <>
                                                    <Link
                                                        to={`/details/${artist.id}`}
                                                        className="link-dark link-underline link-underline-dark
                                                        link-underline-opacity-0 link-underline-opacity-100-hover"
                                                    >
                                                        <h2>
                                                            {artist.name}
                                                        </h2>
                                                    </Link>
                                                    <h2 className="ms-2 me-2">
                                                        {index !== album.artists.length - 1 && "|"}
                                                    </h2>
                                                </>

                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border border-dark rounded p-3">
                        {album.tracks.items.map((track, index) => {
                            console.log(album)
                            return (
                                <div>
                                    <div className="d-flex flex-nowrap align-items-center ">
                                        <h3 className="ms-2 me-5">{track.track_number}</h3>
                                        <div
                                            className="overflow-hidden"
                                            style={{textOverflow: "ellipsis"}}
                                        >
                                            <h2 style={{textOverflow: "ellipsis"}}>
                                                {track.name}
                                            </h2>
                                            <audio controls className="me-5">
                                                <source src={track.preview_url}/>
                                            </audio>
                                        </div>
                                    </div>
                                    {index !== album.tracks.items.length - 1 && <hr/>}
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default AlbumDetails;