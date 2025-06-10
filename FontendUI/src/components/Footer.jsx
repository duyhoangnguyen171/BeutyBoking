import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-100 py-10 px-4 sm:px-10 mt-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-4 text-sm ">
        {/* ----------Left Section---------- */}

        <div className="">
          <h1 className="text-3xl font-bold ">SalonHair</h1>

          <ul className=" text-gray-600 ">
            <li>
              <a href="/">Chính sách bảo hành</a>
            </li>
            <li>
              <a href="/about">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>
        {/* ----------Center Section---------- */}
        <div className="">
          <p className="text-xl  font-medium mb-5">COMPANY</p>
          <ul className=" text-gray-600 ">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>
        {/* ----------Right Section---------- */}
        <div className="">
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+84-900-999-333</li>
            <li>info@company.com</li>
          </ul>
        </div>
      </div>
      {/* ------------------Copyright Text--------------- */}
      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
