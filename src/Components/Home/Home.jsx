import Cinema from "./Cinema/Cinema";
import HeroBanner from "./HeroBanner/HeroBanner";
import Showing from "./Showing/Showing";
import "./home.scss";
function Home() {
  return (
    <div className="home">
      <HeroBanner></HeroBanner>
      <Showing></Showing>
      <Cinema></Cinema>
      <div></div>
    </div>
  );
}

export default Home;
