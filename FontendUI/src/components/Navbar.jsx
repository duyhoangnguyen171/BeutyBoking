import React, { useContext, useState } from "react";
import profile_pic from "../assets/profile_pic.png";
import dropdown_icon from "../assets/dropdown_icon.svg";
import logo from "../assets/logo.svg";
import menu_icon from "../assets/menu_icon.svg";
import cross_icon from "../assets/cross_icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, setToken, setUser } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  // console.log("User role:", user);
  // console.log("Token:", token);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 ">
      <h1
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer text-3xl font-bold text-indigo-600"
      >
        SalonHair
      </h1>

      <ul className="hidden md:flex items-start gap-5 font-medium ">
        <NavLink to="/" className="py-1">
          Trang chủ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/services" className="py-1 ">
          Dịch vụ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/contact" className="py-1 ">
          Liên hệ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/blog" className="py-1 ">
          Tin tức
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img src={profile_pic} alt="" className="w-8 rounded-full" />
            <img src={dropdown_icon} alt="" className="w-2.5" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="flex flex-col gap-4  min-w-48 bg-stone-100 rounded shadow-2xl">
                {user?.role === "admin" ||
                  (user?.role === "staff" && (
                    <p
                      onClick={() => navigate("/admin")}
                      className=" text-white font-bold bg-red-400"
                    >
                      Dashboard
                      {/* <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" /> */}
                    </p>
                  ))}
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-blue-600"
                >
                  Thông tin cá nhân
                </p>

                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-blue-600"
                >
                  Lịch hẹn của tôi
                </p>
                <p onClick={handleLogout} className="hover:text-blue-600">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary  text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={menu_icon}
          alt=""
        />
        {/* ---------Mobile Menu---------- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white `}
        >
          <div className="flex  items-center justify-between px-5 py-6">
            <img className="w-36" src={logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center justify-center gap-4  py-10 font-medium text-lg">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Trang chủ</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/services">
              <p className="px-4 py-2 rounded inline-block">Dịch vụ</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/blog">
              <p className="px-4 py-2 rounded inline-block">Tin tức</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">Về chúng tôi</p>
            </NavLink>

            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Liên hệ</p>
            </NavLink>
            {!token && (
              <NavLink onClick={() => setShowMenu(false)} to="/login">
                <p className="px-4 py-2 rounded inline-block">Login</p>
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
