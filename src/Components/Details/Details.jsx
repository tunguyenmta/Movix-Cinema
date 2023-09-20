import "./Detail.scss";
import useFetchTMDB from "../../Hooks/useFetchTMDB";
import { useParams } from "react-router-dom";
import DetailsBanner from "./DetailBanner/DetailBanner";
import Cast from "./Cast/Cast";
import VideoSection from "./VideoSection/VideoSection";
import Similar from "./Carousel/Similar";

function Details() {
  const params = useParams();
  const { data, loading } = useFetchTMDB(`/movie/${params.id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetchTMDB(
    `/movie/${params.id}/credits`
  );
  return (
    <div className="detail">
      <DetailsBanner
        video={data?.results[0]}
        crew={credits?.crew}
      ></DetailsBanner>
      <Cast data={credits?.cast} loading={creditsLoading}></Cast>
      <VideoSection data={data} loading={loading}></VideoSection>
      <Similar id={params.id}></Similar>
    </div>
  );
}

export default Details;
