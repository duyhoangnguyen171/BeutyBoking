import { useContext, useState, useEffect } from "react";
import { ServiceContext } from "../context/ServiceContext";
import CardService from "../components/CardService";

const Services = () => {
  const { errorService, loadingService, loadServices, services } =
    useContext(ServiceContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  // Reset về trang 1 khi services thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [services]);

  if (loadingService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl animate-pulse">Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  if (errorService) {
    return (
      <section className="relative bg-gray-100 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-16 lg:py-32">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-red-600 mb-4">{errorService}</div>
          <button
            onClick={loadServices}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium text-center">TẤT CẢ DỊCH VỤ</h1>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {currentServices.map((item, index) => (
          <CardService item={item} key={index} />
        ))}
      </div>

      {/* Phần phân trang */}
      {services.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
