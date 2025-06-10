import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
const Appointment = () => {
  const { serviceId } = useParams();
  const { services, currencySymbol, staffs } = useContext(AppContext);
  const dayOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const [selectedStaff, setSelectedStaff] = useState("");
  const [serviceInfo, setserviceInfo] = useState(null);
  const [serviceSlots, setServiceSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!services.length) {
        throw new Error("không có dịch vụ nào");
      }
      const serviceInfo = services.find((ser) => ser._id === serviceId);
      if (!serviceInfo) {
        throw new Error("không tìm thấy dịch vụ nào");
      }
      setserviceInfo(serviceInfo);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = async () => {
    try {
      if (!serviceInfo) return;

      setServiceSlots([]);

      // Lấy ngày hiện tại
      let today = new Date();

      // Duyệt qua 7 ngày tới
      for (let i = 0; i < 7; i++) {
        // Lấy ngày hiện tại với chỉ số i
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        // Thiết lập thời gian bắt đầu và kết thúc cho mỗi ngày
        let startTime = new Date(currentDate);
        startTime.setHours(8, 0, 0, 0); // Bắt đầu từ 8:00 sáng
        let endTime = new Date(currentDate);
        endTime.setHours(20, 0, 0, 0); // Kết thúc lúc 8:00 tối

        // Tạo các khung giờ trong ngày
        let timeSlots = [];
        while (startTime < endTime) {
          timeSlots.push({
            datetime: new Date(startTime),
            time: startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          // Tăng thời gian thêm 30 phút
          startTime.setMinutes(startTime.getMinutes() + 30);
        }

        // Thêm các khung giờ vào danh sách
        setServiceSlots((prev) => [...prev, timeSlots]);
      }
    } catch (error) {
      setError("Error generating time slots");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServiceInfo();
  }, [services, serviceId]);

  useEffect(() => {
    getAvailableSlots();
  }, [serviceInfo]);

  useEffect(() => {
    console.log(serviceSlots);
  }, [serviceSlots]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  if (!serviceInfo) {
    return <div className="text-center">Doctor information not available</div>;
  }

  return (
    serviceInfo && (
      <div className="">
        {/* // --------------- Doctor Details--------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={serviceInfo.image}
              alt=""
            />
          </div>
          {/* -------- Doc Info: name, degree experience---------- */}
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {serviceInfo.name}
            </p>

            <p className="text-gray-500 font-medium mt-4">
              Giá :{" "}
              <span className="text-gray-600 ">
                {serviceInfo.price}
                {currencySymbol}
              </span>
            </p>
            <div>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {serviceInfo.description}
              </p>
            </div>
          </div>
        </div>
        {/* -----------Booking slots--------- */}
        <div className="sm:ml-7 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Đặt chỗ</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            <p>Chọn ngày</p>
            {serviceSlots.length &&
              serviceSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-10 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200 hover:bg-blue-200"
                  }`}
                  key={index}
                >
                  <p className="">
                    {item[0] && dayOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="">{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex gap-3 items-center w-full  overflow-x-scroll mt-4">
            <p>Chọn nhân viên</p>
            {serviceSlots.length &&
              staffs.map((item, index) => (
                <div
                  onClick={() => setSelectedStaff(item.name)}
                  className={`text-center py-6 min-w-10 w-2xl h-40 rounded-2xl cursor-pointer ${
                    selectedStaff === item.name
                      ? "bg-primary text-white"
                      : "border border-gray-200 hover:bg-blue-200"
                  }`}
                  key={index}
                >
                  <img
                    src={item.image}
                    className="w-15 rounded-full mx-auto mb-2"
                    alt=""
                  />
                  <p className="">{item.name}</p>
                </div>
              ))}
          </div>
          <p>Chọn giờ</p>
          <div className="flex flex-wrap items-center gap-3 w-full  mt-4">
            {serviceSlots.length &&
              serviceSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "border border-gray-200 hover:bg-blue-200"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button className="bg-blue-600 hover:bg-blue-400 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer hover:scale-105 transiton-all duration-300">
            Đặt lịch hẹn
          </button>
        </div>
        {/* -------- Listing Relatedservices---------- */}
      </div>
    )
  );
};

export default Appointment;
