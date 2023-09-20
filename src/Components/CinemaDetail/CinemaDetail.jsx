import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./CinemaDetail.scss";

import { fetchDataFromTMDB, fetchDataFromApi } from "../../Utils/api";
import ContentWrapper from "../Common/ContentWrapper/ContentWrapper";
import MovieCard from "../../Components/Common/MovieCard/MovieCard";
import Spinner from "../Common/Spinner/Spinner";
import noResults from "../../assets/no-results.png";
import CinemaCard from "../Common/CinemaCard/CinemaCard";
const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const CinemaDetail = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { code } = useParams();
  const location = useLocation();
  const [genresData, setGenresData] = useState([]);
  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(
      `https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/cinemas/${code}`
    ).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromTMDB(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data?.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };
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
    fetchingGenres();
  });
  useEffect(() => {
    fetchInitialData();
    setGenresData([]);
    fetchingGenres();
  }, [code]);

  return (
    <div className="cinema-detail">
      {loading && genresData.length == 0 && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`List ${data?.length > 1 ? "movies" : "movie"} of ${
                  location.state.cinemaName
                }`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <CinemaCard
                      key={index}
                      TMDBData={
                        genresData.length > 0 ? genresData[index] : undefined
                      }
                      data={item}
                      fromSearch={true}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results not found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default CinemaDetail;
