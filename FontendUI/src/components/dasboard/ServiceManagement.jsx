// import React, { useContext, useState } from "react";
// import { AppContext } from "../../context/AppContext";
// import ServiceService from "../../services/serviceServices";
// import ServiceAdd from "../dasboard/serviceDashboard/ServiceAdd";
// import ServiceEdit from "./serviceDashboard/ServiceEdit";
// const ServiceManagement = () => {
//   const { services, setLoadingService } = useContext(AppContext);
//   // const [services, setServices] = useState([]);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [selectedServiceId, setSelectedServiceId] = useState(null);

//   const handleAdd = () => setOpenAdd(true);
//   const handleCloseAdd = () => setOpenAdd(false);

//   const handleEdit = (id) => {
//     setSelectedServiceId(id);
//     setOpenEdit(true);
//   };
//   const handleDelete = async (id) => {
//     if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
//       try {
//         await ServiceService.delete(id);
//         alert("Dịch vụ đã bị xóa thành công!");
//         setLoadingService(false);
//       } catch (error) {
//         console.error("Lỗi khi xoá dịch vụ:", error);
//         alert("Có lỗi khi xóa dịch vụ. Vui lòng thử lại!");
//       }
//     }
//   };

//   const handleView = (service) => {
//     setSelectedService(service);
//     setOpenView(true);
//   };

//   const handleCloseView = () => setOpenView(false);

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">Service Management</h2>
//       <div className="">
//         <button
//           onClick={handleAdd}
//           className="mb-5 bg-green-500 p-2 rounded-2xl hover:bg-green-300 cursor-pointer"
//         >
//           Thêm dịch vụ
//         </button>
//       </div>
//       <ServiceAdd
//         open={openAdd}
//         onClose={handleCloseAdd}
//         onSuccess={() => {
//           setLoadingService(false); // Cập nhật danh sách dịch vụ sau khi thêm mới
//           handleCloseAdd();
//         }}
//       />
//       <div className="">
//         {/* <ServiceList services={services} /> */}
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-2xl font-bold mb-4">Service List</h2>

//           <table className="w-full border-collapse border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2 text-left">
//                   Service Name
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">
//                   Description
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">
//                   Price
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">
//                   Duration
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">
//                   Hành động
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {services.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2">
//                     {item.name}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {item.description}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     giá từ <span className="text-red-500">{item.price}</span>{" "}
//                     vnd
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     {item.duration}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <button
//                       className="bg-green-200 cursor-pointer"
//                       onClick={() => handleView(item)}
//                     >
//                       Xem |
//                     </button>

//                     <button
//                       className="bg-amber-200 cursor-pointer"
//                       onClick={() => handleEdit(item.id)}
//                     >
//                       Sửa |
//                     </button>
//                     <button
//                       className="bg-red-300 cursor-pointer"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       Xóa
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Modal chỉnh sửa dịch vụ */}
//           <ServiceEdit
//             open={openEdit}
//             onClose={() => setOpenEdit(false)}
//             serviceId={selectedServiceId}
//             onSuccess={() => {
//               setLoadingService(false);
//               setOpenEdit(false);
//             }}
//           />

//           {/* Modal xem chi tiết */}
//           <div
//             className={`fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 transition-opacity ${
//               openView ? "opacity-100" : "opacity-0 pointer-events-none"
//             }`}
//           >
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-800">
//                   Chi tiết dịch vụ
//                 </h3>
//                 <button
//                   onClick={handleCloseView}
//                   className="text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {selectedService && (
//                 <div className="space-y-3 text-gray-700">
//                   <div className="flex">
//                     <span className="font-medium w-28">Tên:</span>
//                     <span>{selectedService.name}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-28">Giá:</span>
//                     <span>
//                       {new Intl.NumberFormat("vi-VN", {
//                         style: "currency",
//                         currency: "VND",
//                       }).format(selectedService.price)}
//                     </span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-28">Thời gian:</span>
//                     <span>{selectedService.durationMinutes} phút</span>
//                   </div>

//                   <div className="pt-4">
//                     <button
//                       onClick={handleCloseView}
//                       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       Đóng
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceManagement;
