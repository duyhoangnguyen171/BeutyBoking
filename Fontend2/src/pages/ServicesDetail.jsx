import { useParams, Link, useNavigate } from "react-router-dom";
import { ServiceContext } from "../context/ServiceContext";
import { useContext, useEffect, useState } from "react";

const ServicesDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pathId = window.location.pathname.split("/").pop();
  const serviceId = id || pathId;
  const { services, formatPrice } = useContext(ServiceContext);

  const [serviceInfo, setServiceInfo] = useState({
    id: 0,
    name: "",
    price: "",
    description: "",
    durationMinutes: "",
    
  });
  const [relatedServices, setRelatedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!Array.isArray(services) || !serviceId) {
          throw new Error("Dữ liệu dịch vụ hoặc ID không hợp lệ");
        }
        const serviceInfo = services.find(
          (ser) => ser.id === parseInt(serviceId, 10)
        );

        if (!serviceInfo) {
          throw new Error(`Không tìm thấy dịch vụ với ID: ${serviceId}`);
        }
        setServiceInfo(serviceInfo);

        // Tìm các dịch vụ liên quan
        const priceRange = 200000; // Khoảng giá ±200,000 VND
        const durationRange = 30; // Khoảng thời gian ±30 phút

        const related = services
          .filter((service) => {
            const isPriceInRange =
              Math.abs(service.price - serviceInfo.price) <= priceRange;
            const isDurationInRange =
              Math.abs(service.durationMinutes - serviceInfo.durationMinutes) <=
              durationRange;
            return (
              (isPriceInRange || isDurationInRange) &&
              service.id !== serviceInfo.id
            );
          })
          .slice(0, 4); // Giới hạn 4 dịch vụ liên quan

        setRelatedServices(related);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceInfo();
  }, [services, serviceId]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-blue-400 w-70 h-70 sm:max-w-80 rounded-lg"
            src={
              serviceInfo.imageurl ||
              "https://www.w3schools.com/w3images/avatar2.png"
            }
            alt={serviceInfo.name}
          />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {serviceInfo.name}
          </p>

          <p className="text-gray-500 font-medium mt-4">
            Giá:{" "}
            <span className="text-red-600">
              {formatPrice(serviceInfo?.price)}
            </span>{" "}
            VND
          </p>
          <p className="text-gray-500 font-medium mt-4">
            Thời gian:{" "}
            <span className="text-gray-600">
              {serviceInfo?.durationMinutes} phút
            </span>
          </p>
          <div>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              Mô tả: {serviceInfo?.description}
            </p>
          </div>
          <button
            onClick={() => {
              navigate("/booking");
              scrollTo(0, 0);
            }}
            className="bg-blue-300 mt-2 text-black text-sm sm:text-base font-semibold px-8 py-3 rounded-full hover:scale-105 transition-all"
          >
            Đặt lịch ngay
          </button>
        </div>
      </div>

      {/* Phần dịch vụ liên quan */}
      {relatedServices.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Dịch vụ liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedServices.map((service) => (
              <Link
                to={`/service-detail/${service.id}`}
                key={service.id}
                className="block group"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={
                      service.imageurl ||
                      "https://www.w3schools.com/w3images/avatar2.png"
                    }
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{service.price} VND</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {service.durationMinutes} phút
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesDetail;
