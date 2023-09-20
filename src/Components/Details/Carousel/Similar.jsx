import React from "react";
import CarouselSimilar from "../../Common/CarouselSimilar/CarouselSimilar";
import useFetchTMDB from "../../../Hooks/useFetchTMDB";

const Similar = ({ id }) => {
  //   const { data, loading, error } = useFetchTMDB(`/movie/${id}/similar`);
  const title = "Movies You May Like";
  const { data, loading } = useFetchTMDB(`/trending/movie/week`);
  return (
    <>
      <CarouselSimilar title={title} data={data?.results} loading={loading} />
    </>
  );
};

export default Similar;
