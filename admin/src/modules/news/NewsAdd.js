// newsadd.js - Thêm tin tức mới dưới dạng Modal

import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile } from "../../utils/uploadfile";
import NewService from "../../services/NewService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const NewsAdd = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageurl: "",
  });
  const [file, setFile] = useState(null);
  const inpRef = useRef();

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
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
        imageurl = uploadedUrl;
      }

      const response = await NewService.create({ ...formData, imageurl });

      toast.success("Thêm tin tức thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      console.log("Thêm tin tức thành công:", response.data);
      setFormData({ title: "", content: "", imageurl: "" });
      setFile(null);
      inpRef.current.value = "";
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
      toast.error("Có lỗi khi thêm tin tức. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
        <h2>Thêm tin tức mới</h2>
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
            config={{
              height: "400px", // không có tác dụng ở đây
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={inpRef}
            style={{ marginTop: 10 }}
          />

          {file && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
              />
            </div>
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
              Thêm
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </div>
    </div>
  );
};

export default NewsAdd;
