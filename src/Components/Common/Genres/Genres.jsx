import { useSelector } from "react-redux";

import "./Genres.scss";

const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.cinemaState);

  return (
    <div className="genres">
      {data?.map((g) => {
        if (!genres[g]?.name) return;
        return (
          <div key={g} className="genre">
            {genres[g]?.name}
          </div>
        );
      })}
    </div>
  );
};

export default Genres;
