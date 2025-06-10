import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin ứng tuyển:", { name, email, message });
    alert("Đơn ứng tuyển của bạn đã được gửi thành công!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="">
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          LIÊN HỆ <span className="text-gray-700 font-semibold">CHÚNG TÔI</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center my-10 gap-10 mb-28 text-sm px-4">
        {/* Phần bản đồ Google Maps */}
        <div className="w-full md:max-w-[360px] h-96">
          <iframe
            title="Salon Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.319347674224!2d106.6608373152608!3d10.786840892314785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3e5%3A0x5652e4a9a8f6f1fa!2s123%20%C4%90%C6%B0%E1%BB%9Dng%20L%C3%A0m%20%C4%90%E1%BA%B9p%2C%20Ph%C6%B0%E1%BB%9Dng%2012%2C%20Qu%E1%BA%ADn%20T%C3%A2n%20B%C3%ACnh%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-700">
            SALON CỦA CHÚNG TÔI
          </p>
          <p className="text-gray-600">
            123 Đường Làm Đẹp <br />
            Tầng 456, TP. Hồ Chí Minh, Việt Nam
          </p>
          <p className="text-gray-600">
            Điện thoại: (123) 456-7890 <br />
            Email: salonbooking@example.com
          </p>
          <p className="font-semibold text-lg text-gray-700">
            THAM GIA ĐỘI NGŨ CỦA CHÚNG TÔI
          </p>
          <p className="text-gray-600">
            Bạn muốn làm việc với chúng tôi? Vui lòng điền vào biểu mẫu bên dưới
            để ứng tuyển.
          </p>

          {/* Form gửi email */}
          <form
            className="flex flex-col gap-4 w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Họ và tên"
              className="border border-gray-300 rounded p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email của bạn"
              className="border border-gray-300 rounded p-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Lý do bạn muốn tham gia với chúng tôi"
              className="border border-gray-300 rounded p-2 w-full"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="border px-8 py-2 text-sm hover:bg-black hover:text-white rounded-2xl duration-300 cursor-pointer"
            >
              Gửi đơn ứng tuyển
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
