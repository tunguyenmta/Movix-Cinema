import "./Cinema.scss";
import ContentWrapper from "../../Common/ContentWrapper/ContentWrapper";
import CarouselCinema from "../../Common/CarouselCinema/CarouselCinema";
import useFetch from "../../../Hooks/useFetch";

function Cinema() {
  const { data, loading } = useFetch(
    "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/cinemas"
  );
  return (
    <div className="cinema">
      <div className="carousel-section">
        <ContentWrapper>
          <span className="carousel-title">Cinemas</span>
        </ContentWrapper>
        <CarouselCinema data={data} loading={loading} type={"cinema"} />
      </div>
    </div>
  );
}

export default Cinema;
