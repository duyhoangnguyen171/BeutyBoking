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
// import "../../asset/styles/new/new.css"; // Giả định bạn có file CSS riêng cho News
import NewService from "../../services/NewService";
// import NewsAdd from "./NewsAdd";
// import NewsEdit from "./NewsEdit";

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const loadNews = async () => {
    try {
      const response = await NewService.getAll();
      const data = response.data;
      if (data && Array.isArray(data.$values)) {
        setNews(data.$values);
        setFilteredNews(data.$values);
      } else {
        setNews([]);
        setFilteredNews([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
      setNews([]);
      setFilteredNews([]);
      toast.error("Có lỗi khi tải tin tức. Vui lòng thử lại!", {
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
    loadNews();
  }, []);

  useEffect(() => {
    let filtered = [...news];
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredNews(filtered);
    setPage(1);
  }, [searchTerm, news]);

  const handleAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (id) => {
    setSelectedNewsId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tin tức này?")) {
      try {
        await NewService.delete(id);
        toast.success("Tin tức đã bị xóa thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        loadNews();
      } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
        toast.error("Có lỗi khi xóa tin tức. Vui lòng thử lại!", {
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

  const handleView = (newsItem) => {
    setSelectedNews(newsItem);
    setOpenView(true);
  };

  const handleCloseView = () => setOpenView(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedNews = filteredNews.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredNews.length / rowsPerPage);

  return (
    <div>
      <h1>Tin tức</h1>
      <Stack direction="row" spacing={2} style={{ marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm tin tức
        </Button>
        <TextField
          label="Tìm kiếm theo tiêu đề tin tức"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ minWidth: 250 }}
          size="small"
        />
      </Stack>
      {/* <NewsAdd
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={() => {
          loadNews();
          handleCloseAdd();
        }}
      /> */}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNews.length > 0 ? (
              paginatedNews.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell>{newsItem.id}</TableCell>
                  <TableCell>
                    {newsItem.imageUrl && (
                      <img
                        src={newsItem.imageUrl}
                        className="table-image"
                        alt={newsItem.title}
                      />
                    )}
                  </TableCell>
                  <TableCell>{newsItem.title}</TableCell>
                  <TableCell>
                    {newsItem.content.length > 100
                      ? `${newsItem.content.substring(0, 100)}...`
                      : newsItem.content}
                  </TableCell>
                  <TableCell>
                    {new Date(newsItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} className="actions">
                      <Button
                        size="small"
                        onClick={() => handleView(newsItem)}
                        variant="outlined"
                        color="info"
                      >
                        Xem
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleEdit(newsItem.id)}
                        variant="outlined"
                        color="warning"
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDelete(newsItem.id)}
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
                <TableCell colSpan={6} align="center">
                  Không có tin tức nào để hiển thị.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredNews.length > 0 && (
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
{/* 
      <NewsEdit
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        newsId={selectedNewsId}
        onSuccess={() => {
          loadNews();
          setOpenEdit(false);
        }}
      /> */}

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
          <h3>Chi tiết tin tức</h3>
          {selectedNews && (
            <>
              <p>
                <strong>Tiêu đề:</strong> {selectedNews.title}
              </p>
              <p>
                <strong>Nội dung:</strong> {selectedNews.content}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedNews.createdAt).toLocaleDateString()}
              </p>
              {selectedNews.imageUrl && (
                <p>
                  <strong>Ảnh:</strong>
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
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

export default News;