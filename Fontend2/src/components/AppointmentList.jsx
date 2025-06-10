import React from "react";

// Sử dụng component để hiển thị
const AppointmentList = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.map((item, index) => (
        <div
          className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          key={index}
        >
          <div className="flex-1 text-sm text-zinc-600">
            <p className="text-neutral-800 font-semibold">{item.serviceName}</p>

            <p className="text-zinc-700 font-medium mt-1">
              Nhân viên: {item.staffName}
            </p>

            <p className="text-xs mt-1">
              <span className="text-sm text-neutral-700 font-medium">
                Date & Time:
              </span>{" "}
              {item.date} - {item.time}
            </p>
          </div>

          <div className="w-32">
            <p className="text-sm text-neutral-700 text-center font-medium mt-1">
              {item.status}
            </p>
          </div>

          <div className=""></div>

          <div className="flex flex-col gap-2 justify-end">
            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer">
              Pay Online
            </button>
            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer">
              Cancel appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
