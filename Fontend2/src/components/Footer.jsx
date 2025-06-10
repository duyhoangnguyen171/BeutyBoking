import React from "react";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="bg-gray-100 py-10 px-4 sm:px-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-4 text-sm">
        {/* ----------Phần bên trái---------- */}
        <div className="">
          <h1 className="text-3xl font-bold ">
            Salon<span className="text-blue-500">Hair</span>
          </h1>
          <p className="text-gray-600 mt-2 mb-4">
            Salon làm tóc chuyên nghiệp với phong cách hiện đại
          </p>

          <div className="">
            <a
              href="https://www.facebook.com/vandphuong0105/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex mb-4"
            >
              <FaFacebook className="text-xl mr-3" />
              <p>facebook.com/vandphuong0105</p>
            </a>

            <a
              href="https://www.instagram.com/v_puo.0_o/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <FaInstagramSquare className="text-xl mr-3" />
              <p>instagram.com/v_puo.0_o</p>
            </a>
          </div>
        </div>

        {/* ----------Phần giữa---------- */}
        <div className="">
          <p className="text-xl font-medium mb-5">SALON</p>
          <ul className="text-gray-600 space-y-2">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/about">Về chúng tôi</a>
            </li>
            <li>
              <a href="/services">Dịch vụ</a>
            </li>
            <li>
              <a href="/booking">Đặt lịch</a>
            </li>
          </ul>
        </div>

        {/* ----------Phần bên phải---------- */}
        <div className="">
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>0900.999.333</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>salonhair@salon.com</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>123 Đường ABC, Quận 1, TP.HCM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ----------Bản quyền---------- */}
      <div className="">
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-center text-gray-600">
          Bản quyền © 2025 SalonHair. Giữ toàn quyền.
        </p>
      </div>
    </div>
  );
};

export default Footer;
