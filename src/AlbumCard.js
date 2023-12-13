import {Link} from "react-router-dom";
import "./styles.css";

function AlbumCard({artistId, albumId, albumName, albumImage}) {
    return (
        <Link className="text-decoration-none"
              key={albumId}
              to={`/details/${artistId}/albums/${albumId}`}
              title={albumName}
        >
            <div className="col">
                <div className="card hover-card h-100">
                    <div className="card-body">
                        <img
                            style={{
                                objectFit: "cover",
                                aspectRatio: "1/1"
                            }}
                            src={albumImage}
                            alt={albumName}
                            className="w-100 mb-2 border border-1"
                        />
                        <h6 className="text-nowrap overflow-hidden fw-bold"
                            style={{textOverflow: "ellipsis"}}>
                            {albumName}
                        </h6>
                    </div>
                </div>
            </div>
        </Link>

    )
}

export default AlbumCard;