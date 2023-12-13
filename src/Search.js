import {useParams} from "react-router";
import {useEffect, useState} from "react";
import * as spotifyClient from "./spotify/client";
import ArtistCard from "./ArtistCard";

function Search() {
    const {query} = useParams();
    const [results, setResults] = useState([]);

    const fetchSearchResults = async () => {
        const searchResults = await spotifyClient.fetchSearchResults(query);
        const artists = searchResults.artists.items;
        setResults(artists);
    }

    useEffect(() => {
        fetchSearchResults();
    }, [query]);

    return (
        <div className="container my-5">
            <h1>Search Results for "{query}":</h1>
            <div className={"row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-lg-6 row-cols-xl-6 g-4"}>
                {results.map((artist) => {
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
    );
}

export default Search;