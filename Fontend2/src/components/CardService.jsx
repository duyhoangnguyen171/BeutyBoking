import React, { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";
import { Link } from "react-router-dom";

const CardService = ({ item }) => {
  const { formatPrice, handleImageError } = useContext(ServiceContext);
  return (
    <Link
      to={`/service-detail/${item.id}`}
      key={item.id}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 hover:shadow-lg bg-white"
    >
      <div className="relative pt-[75%]">
        {/* Aspect ratio container */}
        <img
          src={item.imageurl}
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
      </div>
    </Link>
  );
};

export default CardService;
