import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceContext } from "../context/ServiceContext";
import CardService from "./CardService";

const TopServices = () => {
  const navigate = useNavigate();
  const { errorService, loadingService, loadServices, services } =
    useContext(ServiceContext);

  if (loadingService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-red-500 animate-pulse">
            Đang tải dịch vụ...
          </div>
        </div>
      </section>
    );
  }

  if (errorService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorService}</div>
          <button
            onClick={loadServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-center">Dịch Vụ Nổi Bật</h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {services
          .map((item, index) => <CardService item={item} key={index} />)
          .slice(0, 5)}
      </div>

      <button
        onClick={() => {
          navigate("/services");
          scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="bg-blue-200 hover:bg-blue-300 text-gray-700 px-12 py-3 rounded-full mt-10 transition-colors duration-200"
      >
        Xem tất cả dịch vụ
      </button>
    </div>
  );
};

export default TopServices;
