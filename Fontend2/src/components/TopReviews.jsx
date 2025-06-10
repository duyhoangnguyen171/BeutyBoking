import React from "react";
import { reviews } from "../assets/data/db"; // Import your reviews data
const TopReviews = () => {
  return (
    <div className="flex flex-col items-center  gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Đánh Giá Của Khách Hàng</h1>

      <div className="w-full   grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {reviews.slice(0, 4).map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden  hover:translate-y-[-10px] transition-all duration-300"
          >
            <div className="p-4">
              <p className="text-gray-900 text-lg font-medium h-20">
                {item.comment}
              </p>
              <div className="text-gray-600 text-sm  ">
                <h1 className="bg-gray-700 text-white py-2 rounded-2xl text-center">
                  {item.user_name}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopReviews;
