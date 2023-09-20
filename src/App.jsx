import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Details from "./Components/Details/Details";
import Header from "./Components/Common/Header";
import Footer from "./Components/Common/Footer";
import SearchResult from "./Components/SearchResult/SearchResult";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import { fetchDataFromTMDB } from "./Utils/api";
import {
  getGenres,
  getApiConfiguration,
  getMoviesInCinema,
} from "./Store/cinemaSlice";
import Booking from "./Components/Booking/Booking";
import UserProfile from "./Components/UserProfile/UserProfile";
import Login from "./Components/Login/Login";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import CinemaDetail from "./Components/CinemaDetail/CinemaDetail";
function App() {
  useEffect(() => {
    genresCall();
    fetchApiConfig();
    fetchMovies();
  }, []);
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.cinemaState);
  const fetchMovies = () => {
    fetch(
      "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/nowAndSoon"
    )
      .then((res) => res.json())
      .then((data) => dispatch(getMoviesInCinema(data)));
  };

  // console.log(url);
  const fetchApiConfig = () => {
    fetchDataFromTMDB("/configuration").then((res) => {
      // console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };
  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromTMDB(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    // console.log(data);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/" element={<PrivateRoute></PrivateRoute>}>
          <Route path="/user" element={<UserProfile></UserProfile>}></Route>
          <Route path="/booking/:id" element={<Booking></Booking>}></Route>
        </Route>
        <Route path="/detail/:id" element={<Details></Details>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route
          path="/search/:query"
          element={<SearchResult></SearchResult>}
        ></Route>
        <Route path="/cinema/:code" element={<CinemaDetail></CinemaDetail>} />
        <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
