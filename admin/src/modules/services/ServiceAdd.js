
import React, { useRef, useState } from "react";
import { Button, TextField, Modal, Stack, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceService from "../../services/Serviceservice";
import { uploadFile } from "../../utils/uploadfile";
import { UploadFile } from "@mui/icons-material";

const ServiceAdd = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageurl, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const inpRef = useRef();

  const handleAddService = async () => {

    // Kiểm tra thông tin nhập vào
    if (!name || !price || !description) {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Giá phải là một số dương!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (name.trim().length < 3) {
      toast.error("Tên dịch vụ phải có ít nhất 3 ký tự!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    if (description.trim().length < 3) {
      toast.error("Mô tả phải có ít nhất 3 ký tự!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      let downloadURL = "";
      if (file) {
        downloadURL = await uploadFile(file, "images");
        if (typeof downloadURL !== "string" || downloadURL === "Error upload") {
          throw new Error("Tải ảnh lên thất bại, không nhận được URL hợp lệ.");
        }
      }

      const serviceData = {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imageurl: downloadURL ? [downloadURL] : [],
      };

      await ServiceService.create(serviceData);
      toast.success("Thêm dịch vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      onSuccess();
      setName("");
      setPrice("");
      setDescription("");
      setImage([]);
      setFile(null);
      inpRef.current.value = "";
      // Delay onClose to allow toast to display
      setTimeout(() => {
        console.log("Closing modal");
        onClose();
      }, 3500);
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Có lỗi khi thêm dịch vụ. Vui lòng thử lại!", {
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

  

  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6" gutterBottom>
          Thêm dịch vụ mới
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tên dịch vụ"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Giá"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
          <TextField
            label="Mô tả"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />
          <label>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              component="span"
              startIcon={<UploadFile />}
              onClick={() => inpRef.current.click()}
            >
              Thêm ảnh
            </Button>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={inpRef}
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={2} style={{ marginTop: "20px" }}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddService}
          >
            Thêm
          </Button>
          {/* Temporary test button for debugging toast rendering */}
          
        </Stack>
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
    </Modal>
  );
};

export default ServiceAdd;