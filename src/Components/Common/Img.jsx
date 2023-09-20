import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useState } from "react";
const Img = ({ src, className }) => {
  const [loadingSuccess, setLoadingSuccess] = useState(true);
  return (
    <LazyLoadImage
      className={className || ""}
      alt=""
      effect="blur"
      src={
        loadingSuccess
          ? src
          : "https://cdn.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-nguyen-du-1_1557134449561.jpg"
      }
      onError={() => {
        setLoadingSuccess(false);
      }}
    />
  );
};

export default Img;
