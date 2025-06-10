import React, { useContext, useEffect, useRef, useState } from "react";
import dropdown_icon from "../assets/dropdown_icon.svg";
import logo from "../assets/logo.svg";
import menu_icon from "../assets/menu_icon.svg";
import cross_icon from "../assets/cross_icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, setToken, setUser } = useContext(AppContext);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 ">
      <h1
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer text-3xl font-bold "
      >
        Salon<span className="text-blue-500">Hair</span>
      </h1>

      <ul className="hidden md:flex items-start gap-5 font-medium ">
        <NavLink to="/" className="py-1 text-xl">
          Trang chủ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/services" className="py-1 text-xl">
          Dịch vụ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/contact" className="py-1 text-xl">
          Liên hệ
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/blog" className="py-1 text-xl">
          Tin tức
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
        <NavLink to="/about" className="py-1 text-xl">
          Giới thiệu
          <hr className="border-none outline-none h-0.5 bg-primary w-full m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer relative">
            <div
              className="flex"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={
                  user?.image ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="Avatar"
                className="w-8 rounded-full"
              />
              <img src={dropdown_icon} alt="" className="w-2.5" />
            </div>

            {/* Dropdown menu - hiển thị khi showDropdown = true */}
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 text-base font-medium text-gray-600 z-20">
                <div className="flex flex-col gap-4 p-4 min-w-48 bg-stone-100 rounded shadow-2xl">
                  <p
                    onClick={() => {
                      navigate("/my-profile");
                      setShowDropdown(false);
                    }}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Thông tin cá nhân
                  </p>

                  <p
                    onClick={() => {
                      navigate("/my-appointments");
                      setShowDropdown(false);
                    }}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Lịch hẹn của tôi
                  </p>

                  <p
                    onClick={() => {
                      handleLogout();
                      navigate("/");
                      setShowDropdown(false);
                    }}
                    className="hover:bg-red-600 text-center text-white bg-red-500 cursor-pointer py-1 rounded"
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary  text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Đăng nhập
          </button>
        )}
        <div className="flex flex-col items-center gap-1">
          {" "}
          {/* Thêm gap để tạo khoảng cách */}
          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden"
            src={menu_icon}
            alt="Menu"
          />
          <p className="text-sm">{user?.role}</p>{" "}
          {/* Thêm text-sm để giảm kích thước chữ */}
        </div>
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
            {!token ? (
              <NavLink onClick={() => setShowMenu(false)} to="/login">
                <p className="px-4 py-2 rounded inline-block bg-red-500 text-white">
                  Đăng nhập
                </p>
              </NavLink>
            ) : (
              <NavLink onClick={() => setShowMenu(false)} to="/login">
                <p className="px-4 py-2 rounded inline-block bg-red-500 text-white">
                  Đăng xuất
                </p>
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
