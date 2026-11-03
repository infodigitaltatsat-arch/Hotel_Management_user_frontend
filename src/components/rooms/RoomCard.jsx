import "./RoomCard.css";

import { ArrowRight, Check, Users } from "lucide-react";

const RoomCard = ({ room }) => {
    const {
        id,
        name,
        description,
        price,
        capacity,
        size,
        image,
        tag,
        amenities: roomAmenities = [],
    } = room;

    return (
        <article className="room-card">
            <div className="room-card__image-wrapper">
                <img
                    src={image}
                    className="room-card__image"
                    alt={name}
                    loading="lazy" />

                {tag && <span className="room-card__tag">{tag}</span>}
            </div>

            <div className="room-card__content">
                <div className="room-card__heading">
                    <h3>{name}</h3>
                    <span>{size} sq ft</span>
                </div>

                <p className="room-card__description">{description}</p>

                <div className="room-card__meta">
                    <span>
                        <Users size={15}
                            aria-hidden="true" />
                        Up to {capacity} guests
                    </span>

                    {roomAmenities.slice(0,1).map((amenity)=>(
                        <span key={amenity}>
                            <Check size={15}
                               aria-hidden="true" />

                        </span>
                    ))}
                </div>

                <div className="room-card__footer">
                    <p className="room-card__price">
                        <strong>
                            {Number(price).toLocaleString("en-IN")}
                            <span>/ night</span>
                            </strong>
                    </p>

                    <a 
                    href={`/rooms/${encodedURIComponent(id)}`}
                    className="room-card__link"
                   aria-label={`Explore ${name}`} 
                    >
                        Explore <ArrowRight size={16}/>

                    </a>
                </div>
            </div>
        </article>
    )



}

export default RoomCard;