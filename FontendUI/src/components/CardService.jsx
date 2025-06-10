import React, { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";
import { useNavigate } from "react-router-dom";

const CardService = ({ item, index }) => {
  const { formatPrice, handleImageError } = useContext(ServiceContext);
  const navigate = useNavigate();
  return (
    <div
      // onClick={() => handleAppointmentClick(item.id)}
      key={index}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 hover:shadow-lg bg-white"
    >
      <div className="relative pt-[75%]">
        {/* Aspect ratio container */}
        <img
          src={item.image}
          alt={item.name}
          onError={handleImageError}
          className="absolute top-0 left-0 w-full h-full object-cover bg-blue-50"
        />
      </div>
      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-medium line-clamp-2 min-h-[3.5rem]">
          {item.name}
        </h3>
        <div className="text-gray-600 text-sm mt-2">
          <p className="flex items-center justify-between">
            <span>Giá từ:</span>
            <span className="text-red-500 font-medium">
              {formatPrice(item.price)} VNĐ
            </span>
          </p>
        </div>
        <button
          onClick={() => navigate("/booking")}
          className="w-full text-amber-700 my-2 font-bold text-lg bg-amber-300 py-2 px-4 rounded-2xl hover:bg-amber-200 transition-colors duration-200"
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
};

export default CardService;
