import {Link} from "react-router-dom";
import "./styles.css";

function ArtistCard({artistId, artistName, artistImage}) {
   return (
       <Link className="text-decoration-none"
             key={artistId}
             to={`/details/${artistId}`}
             title={artistName}
       >
           <div className="col">
               <div className="card hover-card h-100">
                   <div className="card-body">
                       <img
                           style={{
                               objectFit: "cover",
                               borderRadius: "50%",
                               aspectRatio: "1/1"
                           }}
                           src={artistImage}
                           alt={artistName}
                           className="w-100 mb-2"
                       />
                       <h6 className="text-nowrap overflow-hidden fw-bold"
                           style={{textOverflow: "ellipsis"}}>
                           {artistName}
                       </h6>
                   </div>
               </div>
           </div>
       </Link>
   );
}

export default ArtistCard;