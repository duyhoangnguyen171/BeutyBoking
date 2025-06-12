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
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../../asset/styles/contact/contact.css"; // Giả định bạn có file CSS riêng cho Contact
import ContactService from "../../services/ContactService";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openView, setOpenView] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const loadContacts = async () => {
    try {
      const response = await ContactService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setContacts(data.$values);
        setFilteredContacts(data.$values);
      } else {
        setContacts([]);
        setFilteredContacts([]);
        toast.error("Không có dữ liệu liên hệ.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải liên hệ:", error);
      setContacts([]);
      setFilteredContacts([]);
      toast.error("Có lỗi khi tải liên hệ. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    let filtered = [...contacts];
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredContacts(filtered);
    setPage(1);
  }, [searchTerm, contacts]);

  const handleView = (contact) => {
    setSelectedContact(contact);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedContacts = filteredContacts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

  return (
    <div>
      <h1>Liên hệ</h1>
      <Stack direction="row" spacing={2} style={{ marginBottom: "20px" }}>
        <TextField
          label="Tìm kiếm theo tên hoặc email"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ minWidth: 250 }}
          size="small"
        />
      </Stack>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tin nhắn</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    {contact.message.length > 100
                      ? `${contact.message.substring(0, 100)}...`
                      : contact.message}
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{contact.userId}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleView(contact)}
                      variant="outlined"
                      color="info"
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có liên hệ nào để hiển thị.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredContacts.length > 0 && (
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
          <h3>Chi tiết liên hệ</h3>
          {selectedContact && (
            <>
              <p>
                <strong>Tên:</strong> {selectedContact.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p>
                <strong>Tin nhắn:</strong> {selectedContact.message}
              </p>
              <p>
                <strong>Ngày gửi:</strong>{" "}
                {new Date(selectedContact.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>User ID:</strong> {selectedContact.userId}
              </p>
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

export default Contact;