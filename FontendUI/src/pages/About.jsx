import React from "react";
import SalonTeam from "../assets/images/SalonBanner.jpg";
import { FaScissors, FaBrush, FaAward, FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Phần giới thiệu chính */}
      <section className="mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
          Về <span className="text-indigo-600">SalonHair</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <img
              src={SalonTeam}
              alt="Đội ngũ SalonHair"
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>

          <div className="md:w-1/2">
            <p className="text-lg text-gray-600 mb-4">
              Thành lập năm 2020, <strong>SalonHair</strong> tự hào là điểm đến
              uy tín cho những ai đam mê cái đẹp. Chúng tôi không chỉ tạo kiểu
              tóc mà còn kiến tạo phong cách sống.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Với đội ngũ <em>stylist giàu kinh nghiệm</em> cùng các sản phẩm
              chăm sóc tóc cao cấp, mỗi khách hàng đến với SalonHair đều nhận
              được trải nghiệm như một nghệ sĩ.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
              <p className="italic text-indigo-800">
                "Sứ mệnh của chúng tôi: Biến mỗi mái tóc thành tác phẩm nghệ
                thuật, mỗi lần ghé thăm là một trải nghiệm thư giãn đáng nhớ"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Triết lý kinh doanh */}
      <section className="mb-16 bg-gray-50 p-8 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Triết lý <span className="text-indigo-600">3T</span> của chúng tôi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaScissors className="text-indigo-500" size={40} />,
              title: "Tận tâm",
              desc: "Mỗi khách hàng đều nhận được sự chăm sóc tỉ mỉ từ khâu tư vấn đến hoàn thiện kiểu tóc",
            },

            {
              icon: <FaBrush className="text-indigo-500" size={40} />,
              title: "Tinh tế",
              desc: "Phong cách làm đẹp cân bằng giữa xu hướng và cá tính riêng của từng người",
            },

            {
              icon: <FaHeart className="text-indigo-500" size={40} />,
              title: "Tin cậy",
              desc: "Cam kết sử dụng sản phẩm an toàn và kỹ thuật không xâm lấn",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Thành tựu */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Thành tựu nổi bật
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              icon: <FaAward className="text-yellow-500" size={30} />,
              text: "Top 5 Salon tiêu chuẩn quốc tế 2024",
            },
            {
              icon: <FaAward className="text-yellow-500" size={30} />,
              text: "Giải thưởng Xuất sắc về Dịch vụ 2023",
            },
            {
              icon: <FaAward className="text-yellow-500" size={30} />,
              text: "Đối tác chính thức của L'Oréal Professionnel",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm border border-gray-200"
            >
              {item.icon}
              <span className="ml-2 text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lời kết */}
      <section className="text-center py-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <h3 className="text-2xl font-medium text-gray-800 mb-4">
          Sẵn sàng thay đổi diện mạo?
        </h3>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Hãy để SalonHair đồng hành cùng bạn trên hành trình khám phá vẻ đẹp
          tiềm ẩn
        </p>
        <button
          onClick={() => {
            navigate("/booking");
            scrollTo(0, 0);
          }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
        >
          Đặt lịch ngay
        </button>
      </section>
    </div>
  );
};

export default AboutPage;
