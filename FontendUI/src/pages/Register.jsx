// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import authService from "../services/authService";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     fullName: "",
//     phone: "",
//     password: "",
//     role: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await registe({
//         ...formData,
//         role: "customer",
//       });

//       // Đăng ký thành công
//       alert("Đăng ký thành công");
//       navigate("/login");
//     } catch (error) {
//       console.error("Lỗi đăng ký:", error);
//       setError(
//         error.message ||
//           "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="min-h-[80vh] flex items-center " onSubmit={handleRegister}>
//       <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-300  rounded-2xl text-sm shadow-lg  ">
//         <p className="text-2xl font-semibold">Đăng Ký Tài Khoản</p>
//         <p className="">Vui lòng đăng ký tài khoản</p>
//         {error && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//             role="alert"
//           >
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}

//         <div className="w-full">
//           <p className="">Tên đầy đủ</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="text"
//             onChange={handleChange}
//             name="FullName"
//             value={formData.FullName}
//           />
//         </div>
//         <div className="w-full">
//           <p className="">Số điện thoại</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="text"
//             onChange={handleChange}
//             name="Phone"
//             value={formData.Phone}
//           />
//         </div>

//         <div className="w-full">
//           <p className="">Email</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="email"
//             onChange={handleChange}
//             name="email"
//             value={formData.Email}
//           />
//         </div>
//         <div className="w-full">
//           <p className="">Mật khẩu</p>
//           <input
//             className="border border-zinc-300 rounded w-full p-2 mt-1"
//             type="password"
//             onChange={handleChange}
//             name="password"
//             value={formData.PasswordHash}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//             loading
//               ? "bg-blue-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//         >
//           {loading ? "Đang xử lý..." : "Đăng ký"}
//         </button>

//         <p>
//           Bạn đã có tài khoản?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-blue-500 underline cursor-pointer ml-2"
//           >
//             Đăng nhập tại đây
//           </span>
//         </p>
//       </div>
//     </form>
//   );
// };

// export default Register;
