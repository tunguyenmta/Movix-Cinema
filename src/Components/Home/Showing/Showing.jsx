import { useState, useEffect } from "react";
import "./Showing.scss";
import ContentWrapper from "../../Common/ContentWrapper/ContentWrapper";
import SwitchTab from "../../Common/SwitchTab/SwitchTab";
import Carousel from "../../Common/Carousel/Carousel";
import useFetch from "../../../Hooks/useFetch";
function Showing() {
  const [defaultState, setDefaultState] = useState("Now");
  const onTabChange = (tab) => {
    setDefaultState(tab !== "Now" ? "Coming Soon" : "Now");
  };
  const { data, loading } = useFetch(
    "https://teachingserver.org/U2FsdGVkX18MaY1VB6bVfvVBm0wdPflO/cinema/nowAndSoon"
  );

  return (
    <div className="showing">
      <div className="carousel-section">
        <ContentWrapper>
          <span className="carousel-title">
            {defaultState !== "Now" ? "Coming Soon" : "Now Showing"}
          </span>
          <SwitchTab
            data={["Now", "Coming Soon"]}
            onTabChange={onTabChange}
          ></SwitchTab>
        </ContentWrapper>
        {data && (
          <Carousel
            data={
              defaultState === "Now"
                ? data?.movieShowing
                : data?.movieCommingSoon
            }
            loading={loading}
            changing={defaultState}
          />
        )}
      </div>
    </div>
  );
}

export default Showing;
