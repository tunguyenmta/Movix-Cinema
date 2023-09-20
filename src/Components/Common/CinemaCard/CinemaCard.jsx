import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./CinemaCard.scss";
import Img from "../Img";
import CircleRating from "../CircleRating/CircleRating";
import Genres from "../Genres/Genres";
import PosterFallback from "../../../assets/no-poster.png";

const CinemaCard = ({ data, fromSearch, mediaType, TMDBData }) => {
  const { url } = useSelector((state) => state.cinemaState);
  const navigate = useNavigate();
  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;
  return (
    <div
      className="cinema-card"
      onClick={() =>
        navigate(`/detail/${TMDBData.id}`, { state: { movieID: data.id } })
      }
    >
      <div className="posterBlock">
        <Img
          className="posterImg"
          src={data.imagePortrait ? data.imagePortrait : PosterFallback}
        />
        {fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.point.toFixed(1)} />
            <Genres
              data={TMDBData ? TMDBData.genre_ids.slice(0, 2) : undefined}
            />
          </React.Fragment>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data.title || data.name}</span>
        <span className="date">
          {dayjs(data.startdate).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
};

export default CinemaCard;
