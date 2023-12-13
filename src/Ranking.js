import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

function Ranking({title, url, title2, url2, ranking, comment, artistId, userId}) {

    const {currentUser} = useSelector(state => state.usersReducer);

    return (
        <div className="border border-dark rounded p-3 mb-3">
            <div className="d-flex flex-nowrap justify-content-between">
                <Link to={url}
                      className="link-dark link-underline link-underline-dark
                      link-underline-opacity-0 link-underline-opacity-75-hover">
                    <h3>
                        {title}
                    </h3>
                </Link>
                {title2 && url2 &&
                    <Link to={url2}
                          className="link-dark link-underline link-underline-dark
                      link-underline-opacity-0 link-underline-opacity-75-hover">
                        <h3>
                            {title2}
                        </h3>
                    </Link>
                }
                {(currentUser && currentUser._id === userId) &&
                    <Link to={`/details/${artistId}/ranking`}
                    className="btn btn-dark me-2">Edit Ranking</Link>
                }
            </div>
            <hr/>
            <div className="d-flex flex-wrap justify-content-center mx-3">
                {ranking.map((album, index) => (
                    <img src={album.image} alt={album.name} style={{height: "100px"}}
                         key={index}/>
                ))}
            </div>
            <hr/>
            <p>{comment}</p>
        </div>
    );
}

export default Ranking;