import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile } from "../../utils/uploadfile";
import NewService from "../../services/NewService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Button,
 
} from "@mui/material";
const NewsEdit = ({ open, onClose, onSuccess, newsId }) => {
  const [formData, setFormData] = useState({
    id: newsId,
    title: "",
    content: "",
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const inpRef = useRef();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await NewService.getById(newsId);
        setFormData(res.data);
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
        toast.error("Không thể tải dữ liệu tin tức!");
      }
    };

    if (open && newsId) {
      fetchNews();
    }
  }, [open, newsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageurl = formData.imageurl;

      if (file) {
        const uploadedUrl = await uploadFile(file, "images");
        if (typeof uploadedUrl !== "string" || uploadedUrl === "Error upload") {
          throw new Error("Tải ảnh lên thất bại.");
        }
        imageurl = uploadedUrl;
      }

      const updatedData = { ...formData, imageurl };
      await NewService.update(newsId, updatedData);

      toast.success("Cập nhật tin tức thành công!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Lỗi khi cập nhật tin tức. Vui lòng thử lại!");
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          width: "95%",
          maxWidth: 800,
        }}
      >
        <h2>Chỉnh sửa tin tức</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <CKEditor
            editor={ClassicEditor}
            data={formData.content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prev) => ({ ...prev, content: data }));
            }}
          />

          <Button
            onClick={() => inpRef.current?.click()}
            variant="outlined"
            color="primary"
          >
            Chọn ảnh
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={inpRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // Ẩn input
          />

          {(file || formData.imageurl) && (
            <img
              src={file ? URL.createObjectURL(file) : formData.imageurl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 20px" }}
            >
              Hủy
            </button>
            <button type="submit" style={{ padding: "10px 20px" }}>
              Cập nhật
            </button>
          </div>
        </form>

        <ToastContainer theme="colored" />
      </div>
    </div>
  );
};

export default NewsEdit;
