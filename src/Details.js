import {useParams} from "react-router";
import axios from "axios";
import {useEffect, useState} from "react";

function Details() {
    const {aid} = useParams();
    const [albums, setAlbums] = useState([]);

    const fetchAlbums = async () => {
        const response = await axios.get(`http://localhost:4000/details/${aid}`);
        const albums = response.data.items;
        setAlbums(albums);
    }

    useEffect(() => {
        fetchAlbums();
    }, [aid]);

    return (
        <>
            <h1>Details</h1>
            <div>
                {albums.map((album, index) =>
                    <img title={album.name} src={album.images[0].url} alt={album.name} style={{width: "100px"}}/>
                )}
            </div>
        </>
    );
}

export default Details;