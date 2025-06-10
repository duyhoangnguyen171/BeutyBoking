import React from "react";
import SalonBanner from "../assets/images/SalonBanner.jpg";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div
      className="relative rounded-lg overflow-hidden my-10 h-80 md:h-80 lg:h-96"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.5)),url(${SalonBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ------------- Background Image ------------- */}
      {/* <img
        src={SalonBanner}
        alt="Salon Banner"
        className="w-full h-full object-cover opacity-90 "
      /> */}

      {/* ------------- Overlay Content ------------- */}
      <div className="absolute inset-0 flex flex-col bg-gradient-to-b from justify-center items-start p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="text-white  text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4">
          <p>
            Ưu Đãi Đặc Biệt: <span className="font-semibold">Giảm 20%</span> cho
            tất cả dịch vụ
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/booking");
            scrollTo(0, 0);
          }}
          className="bg-white text-black text-sm sm:text-base font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all"
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
