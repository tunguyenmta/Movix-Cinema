import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";
import "./DetailBanner.scss";
import ContentWrapper from "../../Common/ContentWrapper/ContentWrapper";
import useFetchTMDB from "../../../Hooks/useFetchTMDB";
import Genres from "../../Common/Genres/Genres";
import CircleRating from "../../Common/CircleRating/CircleRating";
import Img from "../../Common/Img";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../Common/VideoPopup/VideoPopup";
import { getMovieInfo } from "../../../Store/cinemaSlice";
const dayOfWeek = {
  "Thứ hai": "Mon",
  "Thứ ba": "Tue",
  "Thứ tư": "Wed",
  "Thứ năm": "Thu",
  "Thứ sáu": "Fri",
  "Thứ bảy": "Sat",
  "Chủ nhật": "Sun",
};
const month = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};
const weekDay = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};
const DetailsBanner = ({ video, crew, getSession, getTicketInfo }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading } = useFetchTMDB(`/movie/${id}`);
  const [listCinemas, setListCinemas] = useState([]);
  const { url } = useSelector((state) => state.cinemaState);
  const location = useLocation();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchCinema = async () => {
    fetch(
      `https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/movieById/${location.state.movieID}`
    )
      .then((res) => res.json())
      .then((data) => dispatch(getMovieInfo(data)));
    fetch(
      `https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/movie/${location.state.movieID}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length == 0) {
          toast.warn("Movie coming soon", {
            position: toast.POSITION.TOP_CENTER,
          });
          sleep(2000).then(() => {
            navigate("/");
          });
        }
        setListCinemas(data);
        setSelectedCinema(data[0]);
        setDate(data[0]);
        setSelectedDate(data[0]?.dates[0]);
        setListSession(data[0]?.dates[0]?.bundles[0].sessions);
      });
  };
  const _genres = data?.genres?.map((g) => g.id);
  const [selectedCinema, setSelectedCinema] = useState();
  const [date, setDate] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [listSession, setListSession] = useState();
  const [selectedSession, setSelectedSession] = useState();
  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };
  useEffect(() => {
    fetchCinema();
  }, []);
  useEffect(() => {}, [selectedCinema]);
  return (
    <div className="detailsBanner">
      <ToastContainer limit={1}></ToastContainer>
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} />
                    <div className="row">
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setVideoId(video.key);
                        }}
                      >
                        <PlayIcon />

                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="booking-selections">
                      <div className="cinema-selection">
                        <p className="text">CINEMAS</p>
                        <select
                          onChange={(e) => {
                            setSelectedCinema(JSON.parse(e.target.value));
                            setDate(JSON.parse(e.target.value));
                            setListSession(
                              JSON.parse(e.target.value).dates[0].bundles[0]
                                .sessions
                            );
                          }}
                          className="select-tab"
                        >
                          {listCinemas.length > 0 &&
                            listCinemas.map((c, index) => {
                              return (
                                <option key={c.id} value={JSON.stringify(c)}>
                                  {c.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                    <div className="booking-sessions">
                      <div className="date-session">
                        <p className="text">
                          {selectedDate &&
                            new Date(
                              selectedDate.showDate.split("/")[2],
                              selectedDate.showDate.split("/")[1] - 1,
                              selectedDate.showDate.split("/")[0]
                            )
                              .toDateString()
                              .split(" ")[0]
                              .toUpperCase()}
                          <span>
                            ,{" "}
                            {selectedDate &&
                              new Date(
                                selectedDate.showDate.split("/")[2],
                                selectedDate.showDate.split("/")[1] - 1,
                                selectedDate.showDate.split("/")[0]
                              )
                                .toDateString()
                                .split(" ")[2]}{" "}
                            {selectedDate &&
                              month[
                                new Date(
                                  selectedDate.showDate.split("/")[2],
                                  selectedDate.showDate.split("/")[1] - 1,
                                  selectedDate.showDate.split("/")[0]
                                )
                                  .toDateString()
                                  .split(" ")[1]
                              ].toUpperCase()}
                          </span>
                        </p>
                        <div className="date-item">
                          {date?.dates?.map((d, i) => {
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  setListSession(d.bundles[0].sessions);
                                  setSelectedDate(d);
                                  setSelectedSession({});
                                }}
                                className={`btn-date ${
                                  selectedDate.showDate == d.showDate
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <span>
                                  {dayOfWeek[`${d.dayOfWeekLabel}`] ==
                                  weekDay[`${new Date().getDay()}`]
                                    ? "Today"
                                    : dayOfWeek[`${d.dayOfWeekLabel}`]}
                                </span>
                                <p>{d.showDate.split("/")[0]}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="select-session">
                        <p className="text">TIME</p>
                        <div className="session-item">
                          {listSession?.map((s, i) => {
                            return (
                              <button
                                className={`btn-session`}
                                key={s.id}
                                onClick={() => {
                                  setSelectedSession(s);
                                  getSession(s.id);
                                  getTicketInfo({
                                    cinema: selectedCinema,
                                    session: s,
                                  });
                                }}
                              >
                                <span
                                  className={`session-choice ${
                                    selectedSession?.id == s.id ? "active" : ""
                                  }`}
                                >
                                  {s.showTime}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
