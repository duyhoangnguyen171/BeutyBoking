import TopServices from "../components/TopServices";
import Banner from "../components/Banner";
import TopReviews from "../components/TopReviews";
import Staff from "../components/Staff";
import TopBlog from "../components/TopBlog";

const Home = () => {
  return (
    <div className="">
      <Banner />
      <TopServices />
      <TopReviews />
      <Staff />
      <TopBlog />
    </div>
  );
};

export default Home;
