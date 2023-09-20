import { useEffect, useRef, useState } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import CircleRating from "../CircleRating/CircleRating";
import ContentWrapper from "../ContentWrapper/ContentWrapper";
import Img from "../Img";
import PosterFallback from "../../../assets/no-poster.png";
import Genres from "../Genres/Genres";
import "./Carousel.scss";
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
function Carousel({ data, loading, changing }) {
  const carouselContainer = useRef();
  const nav = useNavigate();
  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };
  const [genresData, setGenresData] = useState([]);
  const fetchingGenres = async () => {
    data?.forEach((item) => {
      fetch(
        `${BASE_URL}/search/movie?api_key=${TMDB_KEY}&query=${item.slug.replaceAll(
          "-",
          "+"
        )}&sort_by=release_date.dsc`
      )
        .then((res) => res.json())
        .then((data) => {
          setGenresData((prev) => {
            return [...prev, data.results[0]];
          });
        });
    });
  };
  useEffect(() => {
    setGenresData([]);
    fetchingGenres();
  }, [changing]);
  const skItem = () => {
    return (
      <div className="skeleton-item">
        <div className="poster-block skeleton"></div>
        <div className="text-block">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };
  return (
    <div className="carousel">
      <ContentWrapper>
        <BsFillArrowLeftCircleFill
          className="carouselLeft-nav arrow"
          onClick={() => navigation("left")}
        ></BsFillArrowLeftCircleFill>
        <BsFillArrowRightCircleFill
          className="carouselRight-nav arrow"
          onClick={() => navigation("right")}
        ></BsFillArrowRightCircleFill>
        {!loading && genresData.length > 0 ? (
          <div className="carousel-items" ref={carouselContainer}>
            {data?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="carousel-item"
                  onClick={() =>
                    nav(`/detail/${genresData[index].id}`, {
                      state: { movieID: item.id },
                    })
                  }
                >
                  <div className="poster-block">
                    <Img
                      src={
                        item.imagePortrait
                          ? item.imagePortrait
                          : item.imageUrls[0]
                      }
                    ></Img>
                    {item.point && (
                      <>
                        <CircleRating
                          rating={item.point?.toFixed(1)}
                        ></CircleRating>

                        <Genres
                          data={genresData[index]?.genre_ids.slice(0, 2)}
                        />
                      </>
                    )}
                  </div>
                  <div className="text-block">
                    <span className="title">{item.name || item.subName}</span>
                    {item.startdate && (
                      <span className="date">
                        {dayjs(item.startdate).format("MMM D, YYYY")}
                      </span>
                    )}
                    {item.address && (
                      <span className="title">{item.address}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loading-skeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
}

export default Carousel;
