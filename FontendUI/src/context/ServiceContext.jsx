import { createContext, useEffect, useState } from "react";
import ServiceService from "../services/Serviceservice";

export const ServiceContext = createContext();

export const ServiceContextProvider = (props) => {
  const [services, setServices] = useState([]);
  const [errorService, setErrorService] = useState(null);
  const [loadingService, setLoadingService] = useState(false);

  const loadServices = async () => {
    try {
      setLoadingService(true);
      setErrorService(null);
      const response = await ServiceService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setServices(data.$values.reverse());
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      setErrorService(" Lỗi tải dịch vụ");
    } finally {
      setLoadingService(false);
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-service.jpg"; // Ảnh mặc định khi lỗi
    e.target.classList.add("image-error");
  };

  useEffect(() => {
    loadServices();
  }, []);

  const value = {
    services,
    errorService,
    loadingService,
    loadServices,
    formatPrice,
    handleImageError,
    setErrorService,
  };

  return (
    <ServiceContext.Provider value={value}>
      {props.children}
    </ServiceContext.Provider>
  );
};
