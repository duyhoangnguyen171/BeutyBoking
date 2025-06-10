import TopServices from "../components/TopServices";
import Banner from "../components/Banner";
import TopReviews from "../components/TopReviews";
import Staff from "../components/Staff";

const Home = () => {
  return (
    <div className="">
      <Banner />
      <TopServices />
      <TopReviews />
      <Staff />
      {/* <TopDoctors /> */}
    </div>
  );
};

export default Home;
