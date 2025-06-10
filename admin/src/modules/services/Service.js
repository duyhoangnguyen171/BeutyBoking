import {
  Button,
  Modal,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../asset/styles/service/service.css";
import ServiceService from "../../services/Serviceservice";
import ServiceAdd from "./ServiceAdd";
import ServiceEdit from "./ServiceEdit";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;
  const inpRef = useRef();

  const loadServices = async () => {
    try {
      const response = await ServiceService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setServices(data.$values);
        setFilteredServices(data.$values);
      } else {
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải dịch vụ:", error);
      setServices([]);
      setFilteredServices([]);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
    setPage(1);
  }, [searchTerm, services]);

  const handleAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setSelectedServiceId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await ServiceService.delete(id);
        toast.success("Dịch vụ đã bị xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        loadServices();
      } catch (error) {
        console.error("Lỗi khi xoá dịch vụ:", error);
        toast.error("Có lỗi khi xóa dịch vụ. Vui lòng thử lại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedServices = filteredServices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredServices.length / rowsPerPage);

  return (
    <div>
      <h1>Dịch vụ</h1>
      <Stack direction="row" spacing={2} style={{ marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm dịch vụ
        </Button>
        <TextField
          label="Tìm kiếm theo tên dịch vụ"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ minWidth: 250 }}
          size="small"
        />
      </Stack>
      <ServiceAdd
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={() => {
          loadServices();
          handleCloseAdd();
        }}
      />

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Chi tiết</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell>
                    <img
                      src={service.imageurl}
                      className="table-image"
                      alt={service.name}
                    />
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} className="actions">
                      <Button
                        size="small"
                        onClick={() => handleView(service)}
                        variant="outlined"
                        color="info"
                      >
                        Xem
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleEdit(service.id)}
                        variant="outlined"
                        color="warning"
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDelete(service.id)}
                        variant="outlined"
                        color="error"
                      >
                        Xoá
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có dịch vụ nào để hiển thị.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredServices.length > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          className="mt-4"
          siblingCount={1}
          boundaryCount={1}
        />
      )}

      <ServiceEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        serviceId={selectedServiceId}
        onSuccess={() => {
          loadServices();
          setOpenEdit(false);
        }}
      />

      <Modal open={openView} onClose={handleCloseView}>
        <div
          style={{
            padding: "20px",
            maxWidth: "500px",
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            marginTop: "50px",
          }}
        >
          <h3>Chi tiết dịch vụ</h3>
          {selectedService && (
            <>
              <p>
                <strong>Tên:</strong> {selectedService.name}
              </p>
              <p>
                <strong>Giá:</strong> {selectedService.price}
              </p>
              <p>
                <strong>Thời gian:</strong> {selectedService.durationMinutes}{" "}
                phút
              </p>
              {selectedService.imageUrl && (
                <p>
                  <strong>Ảnh:</strong>
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.name}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </p>
              )}
              <Button variant="outlined" onClick={handleCloseView}>
                Đóng
              </Button>
            </>
          )}
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Services;