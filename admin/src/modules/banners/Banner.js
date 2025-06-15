import { useEffect, useState } from "react";
import BannerService from "../../services/BannerService"; // Đảm bảo import đúng đường dẫn tới BannerService

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState(null);

  // Lấy tất cả banner
   const fetchBanners = async () => {
    try {
      const response = await BannerService.getAll();
      
      // Kiểm tra xem response.data và response.data.$values có phải là mảng không
      if (Array.isArray(response.data.$values)) {
        setBanners(response.data.$values);  // Cập nhật danh sách banner từ API
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (error) {
      setError("Không thể tải danh sách banner.");
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();  // Gọi API khi component được render
  }, []);

  if (error) {
    return <div>{error}</div>;  // Hiển thị lỗi nếu có
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mb-4">Danh sách Banner</h1>

      {banners.length === 0 ? (
        <p>Không có banner nào.</p>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tiêu đề</th>
              <th className="px-4 py-2 border">Mô tả</th>
              <th className="px-4 py-2 border">Link</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-4 py-2 border">{banner.id}</td>
                <td className="px-4 py-2 border">{banner.title}</td>
                <td className="px-4 py-2 border">{banner.description}</td>
                <td className="px-4 py-2 border">
                  <a href={banner.link} target="_blank" rel="noopener noreferrer">
                    {banner.link}
                  </a>
                </td>
                <td className="px-4 py-2 border">
                  {banner.status === 1 ? "Đang hoạt động" : "Tạm dừng"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(banner.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Xử lý sự kiện sửa
  const handleEdit = (id) => {
    console.log(`Chỉnh sửa banner có ID: ${id}`);
    // Định hướng tới trang chỉnh sửa banner hoặc mở modal
  };

  // Xử lý sự kiện xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      try {
        await BannerService.delete(id);  // Gọi API xóa banner
        fetchBanners();  // Tải lại danh sách sau khi xóa
        alert("Xóa banner thành công!");
      } catch (error) {
        console.error("Error deleting banner:", error);
        alert("Không thể xóa banner.");
      }
    }
  };
};

export default Banner;
