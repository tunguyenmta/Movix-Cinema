import { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CircleRating from "../CircleRating/CircleRating";
import ContentWrapper from "../ContentWrapper/ContentWrapper";
import Img from "../Img";
import PosterFallback from "../../../assets/no-poster.png";
import "./CarouselCinema.scss";
function CarouselCinema({ data, loading }) {
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
    <div className="carousel-cinema">
      <ContentWrapper>
        <BsFillArrowLeftCircleFill
          className="carouselLeft-nav arrow"
          onClick={() => navigation("left")}
        ></BsFillArrowLeftCircleFill>
        <BsFillArrowRightCircleFill
          className="carouselRight-nav arrow"
          onClick={() => navigation("right")}
        ></BsFillArrowRightCircleFill>
        {!loading ? (
          <div className="carousel-items" ref={carouselContainer}>
            {data?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="carousel-item"
                  onClick={() => {
                    sessionStorage.setItem(
                      "cinema",
                      JSON.stringify({
                        cinemaName: `${item.name}`,
                        cinemaCode: `${item.code}`,
                      })
                    );
                    nav(`/cinema/${item.code}`, {
                      state: { cinemaName: `${item.name}` },
                    });
                  }}
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
                      </>
                    )}
                  </div>
                  <div className="text-block">
                    <span className="title">{item.name || item.subName}</span>
                    {item.address && (
                      <span className="date">{item.address}</span>
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

export default CarouselCinema;
