import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Search() {
    const {query} = useParams();
    const [results, setResults] = useState([]);

    const fetchSearchResults = async () => {
        const response = await axios.get(`http://localhost:4000/search/?query=${query}`);
        const artists = response.data.artists.items;
        setResults(artists);
    }

    useEffect(() => {
        fetchSearchResults();
    }, [query]);

    return (
        <div className="mx-5">
            <h1>Search Results for "{query}":</h1>
            <div className={"row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 row-cols-lg-6 row-cols-xl-6 g-4"}>
                {results.map((artist, index) => {
                    return (
                        <Link className="text-decoration-none" to={`/details/${artist.id}`}>
                            <div className="col">
                                <div className="card h-100" id={index.toString()} style={{paddingBottom: "5%"}}>
                                    <div className="card-body">
                                        <div className="position-relative w-100 mb-3"
                                             style={{paddingBottom: "100%"}}>
                                            <div className="position-absolute top-0 bottom-0 start-0 end-0">
                                                <img src={artist.images.length > 0 ? artist.images[0].url : "user.png"}
                                                     alt={artist.name}
                                                     className="rounded-circle w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                        </div>
                                        <h6 className="text-nowrap overflow-hidden fw-bold"
                                            style={{textOverflow: "ellipsis"}}>
                                            {artist.name}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Search;