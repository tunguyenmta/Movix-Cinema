import "./HeroBanner.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../Hooks/useFetch";
import Img from "../../Common/Img";
import ContentWrapper from "../../Common/ContentWrapper/ContentWrapper";
function HeroBanner() {
  const nav = useNavigate();

  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const searchQueryHandler = (e) => {
    if (
      (e.keyCode === 13 && query.length > 0) ||
      (e.type == "click" && query.length > 0)
    ) {
      nav(`/search/${query}`);
    }
  };
  const { data, loading } = useFetch(
    "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/nowAndSoon"
  );
  useEffect(() => {
    const bg =
      data?.movieShowing[Math.floor(Math.random() * data.movieShowing.length)]
        .imageLandscape;
    setBackground(bg);
  }, [data]);
  return (
    <div className="hero-banner">
      {!loading && (
        <div className="background-img">
          <Img src={background}></Img>
        </div>
      )}
      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="wrapper">
          <div className="herobanner-content">
            <span className="title">Welcome.</span>
            <span className="subTitle">
              Bring the cinema to you. Explore more.
            </span>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search for movie or cinema"
                onKeyUp={searchQueryHandler}
                onChange={(e) => setQuery(e.target.value)}
              ></input>
              <button onClick={searchQueryHandler}>Search</button>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}

export default HeroBanner;
