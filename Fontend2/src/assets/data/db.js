import cattoc from "../images/cattoc.jpg";
import phuchoi from "../images/phuchoi.png";
import uontoc from "../images/uontoc.png";
import noitoc from "../images/noitoc.png";
import nhomtoc1 from "../images/nhomtoc1.jpg";
import goidau from "../images/goidau.jpg";

//CUSTOMERS
export const staffs = [
  {
    id: "s1",
    name: "Thanh Hằng",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    email: "sarah.johnson@example.com",
    phone: "123-456-7890",
    gender: "Female",
    joinDate: "2023-01-15",
    position: "Nhà tạo mẫu cao cấp",
  },
  {
    id: "s2",
    name: "Tuấn Vũ",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    email: "michael.brown@example.com",
    phone: "987-654-3210",
    gender: "Male",
    joinDate: "2023-02-10",
    position: "Chuyên gia màu sắc",
  },
  {
    id: "s3",
    name: "Na Na",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    email: "emily.davis@example.com",
    phone: "456-789-1234",
    gender: "Female",
    joinDate: "2023-03-05",
    position: "Chuyên gia điều trị tóc",
  },
  {
    id: "s3",
    name: "Quốc Phòng",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    email: "john.smith@example.com",
    phone: "321-654-9870",
    gender: "Male",
    joinDate: "2023-04-20",
    position: "Nhà tạo mẫu trẻ",
  },
  {
    id: "s5",
    name: "Thị Trắng",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    email: "anna.white@example.com",
    phone: "654-321-0987",
    gender: "Female",
    position: "Giám đốc dịch vụ khách hàng",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Trung Hùng",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    email: "james.wilson@example.com",
    phone: "987-654-3210",
    gender: "Male",
    position: "Quản lý Salon",
    joinDate: "2023-01-05",
  },
];

export const customers = [
  {
    id: "cus1",
    name: "Thu Hằng",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    email: "sarah.johnson@example.com",
    phone: "123-456-7890",
    gender: "Female",
  },
  {
    id: "cus2",
    name: "Michael Brown",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    email: "michael.brown@example.com",
    phone: "987-654-3210",
    gender: "Male",
  },
  {
    id: "cus3",
    name: "Emily Davis",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    email: "emily.davis@example.com",
    phone: "456-789-1234",
    gender: "Female",
  },
  {
    id: "cus4",
    name: "John Smith",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    email: "john.smith@example.com",
    phone: "321-654-9870",
    gender: "Male",
  },
];

export const reviews = [
  {
    id: 1,
    user_name: "Nguyễn Văn Thành",
    comment: "thợ cắt tóc rất đẹp, rất nhiệt tình",
    service_id: 11,
  },
  {
    id: 2,
    user_name: "Chu Thị Hương",
    comment: "thợ cắt tóc rất đẹp, rất nhiệt tình",
    service_id: 2,
  },
  {
    id: 3,
    user_name: "Đàng Thị Diễm",
    comment: "thợ cắt tóc rất đẹp, rất nhiệt tình",
    service_id: 3,
  },
  {
    id: 4,
    user_name: "Kim Ngân",
    comment: "thợ cắt tóc rất đẹp, rất nhiệt tình",
    service_id: 4,
  },
];
//SERVICE
export const services = [
  {
    id: "ser1",
    name: "Cắt tóc",
    description: "Cắt tóc chính xác được điều chỉnh theo phong cách của bạn.",
    price: 50000,
    duration: "30 minutes",
    image: cattoc,
  },
  {
    id: "ser2",
    name: "Nối tóc",
    description: "Professional hair coloring with premium products.",
    price: 120000,
    duration: "1 giờ",
    image: noitoc,
  },
  {
    id: "ser3",
    name: "Gội đầu",
    description: "Deep conditioning and scalp treatment.",
    price: 50000,
    duration: "45 phút",
    image: goidau,
  },
  {
    id: "ser4",
    name: "Uốn tóc",
    description: "Blow dry and styling for any occasion.",
    price: 300000,
    duration: "30 phút",
    image: uontoc,
  },
  {
    id: "ser5",
    name: "Phục hồi",
    description: "Blow dry and styling for any occasion.",
    price: 300000,
    duration: "30 phút",
    image: phuchoi,
  },
  {
    id: "ser6",
    name: "Nhộm tóc",
    description: "Nhuộm tóc chuyên nghiệp với các sản phẩm cao cấp",
    price: 300000,
    duration: "30 phút",
    image: nhomtoc1,
  },
];

//APPOINTMENT
export const appointmentsData = [
  {
    id: "p1",
    customerId: "cus1",
    staffId: "s1",
    serviceId: "ser2",
    date: "2025-03-26",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: "p2",
    customerId: "cus1",
    staffId: "s4",
    serviceId: "ser1",
    date: "2025-03-27",
    time: "2:00 PM",
    status: "Pending",
  },
  {
    id: "p3",
    customerId: "cus1",
    staffId: "s3",
    serviceId: "ser4",
    date: "2025-03-28",
    time: "11:00 AM",
    status: "Cancelled",
  },
  {
    id: "p4",
    customerId: "cus2",
    staffId: "s4",
    serviceId: "ser4",
    date: "2025-03-29",
    time: "3:00 PM",
    status: "Confirmed",
  },
  {
    id: "p5",
    customerId: "cus2",
    staffId: "s4",
    serviceId: "ser4",
    date: "2025-03-29",
    time: "3:00 PM",
    status: "Confirmed",
  },
  {
    id: "p6",
    customerId: "cus3",
    staffId: "s5",
    serviceId: "ser5",
    date: "2025-03-29",
    time: "3:00 PM",
    status: "Confirmed",
  },
];

export const blogData = [
  {
    id: 1,
    category: "Xu hướng tóc",
    date: "5 Jun, 2025",
    title: "Top 5 Kiểu Tóc Nam Thịnh Hành 2025",

    description:
      "Khám phá những kiểu tóc nam đang được ưa chuộng nhất trong năm 2025, từ undercut hiện đại đến kiểu tóc layer tự nhiên. Cùng tìm hiểu cách để bạn có thể thể hiện phong cách cá nhân qua mái tóc của mình.",
    author: "Hà My",
    authorRole: "Senior Hair Stylist",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
    tags: ["Kiểu tóc nam", "Xu hướng 2025", "Undercut", "Layer"],
    readTime: "5 phút đọc",
  },
  {
    id: 2,
    category: "Chăm sóc tóc",
    date: "4 Jun, 2025",
    title: "Bí Quyết Dưỡng Tóc Mùa Hè",

    description:
      "Mùa hè đến với nắng nóng gay gắt có thể làm tóc bạn trở nên khô xơ và hư tổn. Cùng khám phá những bí quyết chăm sóc tóc hiệu quả để bảo vệ mái tóc luôn óng ả, suôn mượt.",
    author: "Thu Hương",
    authorRole: "Hair Care Specialist",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    tags: ["Chăm sóc tóc", "Mùa hè", "Dưỡng tóc", "Tips"],
    readTime: "7 phút đọc",
  },
  {
    id: 3,
    category: "Màu tóc",
    date: "3 Jun, 2025",
    title: "Những Gam Màu Tóc Thời Thượng 2025",

    description:
      "Năm 2025 chứng kiến sự lên ngôi của những gam màu tóc độc đáo và cá tính. Từ nâu caramel ngọt ngào đến xám khói cá tính, hãy cùng khám phá những xu hướng màu tóc đang làm mưa làm gió.",
    author: "Minh Anh",
    authorRole: "Color Expert",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    image:
      "https://tiki.vn/blog/wp-content/uploads/2023/01/mau-nhuom-toc-1024x576.png",
    tags: ["Màu tóc", "Xu hướng", "Nhuộm tóc", "Fashion"],
    readTime: "6 phút đọc",
  },
  {
    id: 4,
    category: "Kiểu tóc nữ",
    date: "2 Jun, 2025",
    title: "5 Kiểu Tóc Sang Trọng Cho Buổi Tiệc",

    description:
      "Chuẩn bị cho một buổi tiệc quan trọng? Khám phá ngay 5 kiểu tóc sang trọng và quyến rũ sẽ giúp bạn tỏa sáng trong mọi sự kiện. Từ búi tóc cao quý phái đến xoăn sóng nước gợi cảm.",
    author: "Thanh Vân",
    authorRole: "Style Director",
    authorImage: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1",
    tags: ["Kiểu tóc nữ", "Tiệc tùng", "Sang trọng", "Updo"],
    readTime: "8 phút đọc",
  },
  {
    id: 5,
    category: "Tips & Tricks",
    date: "1 Jun, 2025",
    title: "Cách Giữ Nếp Tóc Cả Ngày Dài",

    description:
      "Bạn đã bao giờ tốn công tạo kiểu nhưng tóc lại xẹp sau vài giờ? Bài viết này sẽ chia sẻ những bí quyết giúp giữ nếp tóc bền đẹp suốt cả ngày, phù hợp với mọi loại tóc và thời tiết.",
    author: "Đức Anh",
    authorRole: "Professional Stylist",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f",
    tags: ["Styling", "Tips", "Giữ nếp", "Hướng dẫn"],
    readTime: "5 phút đọc",
  },
];
export const blogContent = {
  1: {
    title: "Top 5 Kiểu Tóc Nam Thịnh Hành 2025",
    content: `
## 1. Textured Crop - Phong Cách Hiện Đại Đầy Cá Tính

Kiểu tóc Textured Crop đang làm mưa làm gió trong năm 2025 với phần đỉnh được cắt ngắn có kết cấu và phần hai bên được fade gọn gàng. Đây là sự lựa chọn hoàn hảo cho những người đàn ông hiện đại:

- Phù hợp với hầu hết khuôn mặt
- Dễ dàng tạo kiểu mỗi ngày
- Mang lại vẻ ngoài chuyên nghiệp nhưng không kém phần trẻ trung

### Cách Tạo Kiểu
1. Sử dụng sáp tóc có độ giữ nếp trung bình
2. Tạo texture bằng cách vuốt ngược lên và về phía trước
3. Hoàn thiện với gôm xịt nhẹ để giữ nếp cả ngày

## 2. Modern Quiff - Vẻ Đẹp Cổ Điển Được Tái Sinh

Modern Quiff là phiên bản cập nhật của kiểu tóc pompadour cổ điển. Xu hướng 2025 cho thấy kiểu tóc này đang được ưa chuộng với phần đỉnh dài hơn và có độ phồng tự nhiên.

### Đặc Điểm Nổi Bật
- Phần đỉnh dài 5-7cm
- Hai bên undercut hoặc fade
- Phần sau được cắt layer để tạo độ phồng

## 3. Messy Medium Length - Phong Cách Tự Nhiên

Xu hướng tóc nam 2025 chứng kiến sự trở lại của những kiểu tóc có độ dài vừa phải với phong cách bồng bềnh tự nhiên:

- Độ dài trung bình
- Texture tự nhiên
- Phù hợp với nhiều场合 khác nhau

### Tips Chăm Sóc
- Sử dụng dầu gội đặc trị cho tóc dài
- Định kỳ cắt tỉa để tránh tóc chẻ ngọn
- Sử dụng các sản phẩm dưỡng tóc phù hợp

## 4. Clean Fade - Sự Lựa Chọn Của Người Đàn Ông Hiện Đại

Clean Fade tiếp tục là một trong những kiểu tóc được ưa chuộng nhất 2025:

- Phần fade được cắt kỹ thuật
- Đỉnh được giữ ngắn gọn
- Dễ dàng tạo kiểu và bảo trì

### Ưu Điểm
- Phù hợp với môi trường công sở
- Dễ dàng chăm sóc
- Tạo vẻ ngoài chuyên nghiệp

## 5. Textured Slick Back - Lịch Lãm Và Cá Tính

Slick Back năm 2025 được biến tấu với nhiều texture hơn, tạo nên vẻ ngoài vừa lịch lãm vừa hiện đại:

- Phần tóc được vuốt ngược về sau
- Tạo texture để tránh vẻ bóng nhẫy
- Kết hợp với fade hai bên

### Hướng Dẫn Tạo Kiểu
1. Sử dụng pre-styling spray khi tóc còn ẩm
2. Sấy tóc theo hướng ngược về sau
3. Hoàn thiện với sáp tóc matte

## Lời Khuyên Từ Chuyên Gia

Khi chọn kiểu tóc, bạn nên cân nhắc:
- Hình dáng khuôn mặt
- Tính chất công việc
- Thời gian có thể dành cho việc tạo kiểu mỗi ngày
- Đặc điểm tóc của bạn

## Kết Luận

Xu hướng tóc nam 2025 đang hướng đến sự kết hợp giữa phong cách cổ điển và hiện đại, với việc chú trọng nhiều hơn đến texture và sự tự nhiên. Việc chọn một kiểu tóc phù hợp không chỉ giúp nâng cao vẻ ngoài mà còn thể hiện cá tính của người đàn ông hiện đại.
    `,
  },
  2: {
    title: "Bí Quyết Dưỡng Tóc Mùa Hè",
    content: `
## Tại Sao Tóc Dễ Hư Tổn Trong Mùa Hè?

Mùa hè với nắng nóng gay gắt có thể gây ra nhiều vấn đề cho mái tóc:
- Tia UV làm yếu sợi tóc
- Nhiệt độ cao khiến tóc mất nước
- Chlorine từ hồ bơi làm tóc khô xơ
- Độ ẩm cao khiến tóc rối và khó vào nếp

## Các Bước Chăm Sóc Tóc Cơ Bản

### 1. Làm Sạch Đúng Cách
- Sử dụng dầu gội phù hợp với loại tóc
- Không gội đầu quá nóng
- Hạn chế gội đầu mỗi ngày
- Massage da đầu nhẹ nhàng

### 2. Dưỡng Ẩm Chuyên Sâu
- Ủ tóc 1-2 lần/tuần
- Sử dụng dầu xả sau mỗi lần gội
- Áp dụng phương pháp ủ tóc qua đêm

### 3. Bảo Vệ Tóc Khỏi Nhiệt
- Đội mũ khi ra nắng
- Sử dụng xịt chống nắng cho tóc
- Hạn chế sử dụng máy sấy, máy duỗi

## Các Công Thức Dưỡng Tóc Tự Nhiên

### Mặt Nạ Bơ và Dầu Dừa
**Nguyên liệu:**
- 1 quả bơ chín
- 2 muỗng canh dầu dừa
- 1 muỗng canh mật ong

**Cách làm:**
1. Nghiền nhuyễn bơ
2. Trộn đều với dầu dừa và mật ong
3. Thoa đều lên tóc và để trong 30 phút
4. Gội sạch với nước ấm

### Mặt Nạ Trứng và Sữa Chua
**Nguyên liệu:**
- 1 lòng đỏ trứng
- 2 muỗng canh sữa chua không đường
- 1 muỗng canh dầu oliu

## Tips Chăm Sóc Tóc Hàng Ngày

1. **Buổi Sáng:**
   - Chải tóc nhẹ nhàng
   - Thoa serum bảo vệ
   - Búi tóc lỏng nếu ra nắng

2. **Buổi Tối:**
   - Gội đầu sạch sẽ
   - Lau khô tóc nhẹ nhàng
   - Thoa tinh dầu dưỡng tóc

## Chế Độ Ăn Uống Cho Mái Tóc Khỏe

### Các Thực Phẩm Tốt Cho Tóc:
- Cá hồi (omega-3)
- Trứng (protein và biotin)
- Rau xanh (vitamin và khoáng chất)
- Hạt (vitamin E)
- Trái cây giàu vitamin C

## Những Thói Quen Cần Tránh

1. Không buộc tóc quá chặt
2. Tránh sử dụng máy sấy nóng
3. Không chải tóc khi ướt
4. Hạn chế sử dụng hóa chất

## Kết Luận

Chăm sóc tóc mùa hè đòi hỏi sự kiên nhẫn và chăm chỉ. Với những bí quyết trên, bạn có thể bảo vệ mái tóc khỏe đẹp suốt mùa hè này.
    `,
  },
  3: {
    title: "Những Gam Màu Tóc Thời Thượng 2025",
    content: `
## Xu Hướng Màu Tóc 2025

Năm 2025 chứng kiến sự lên ngôi của những gam màu độc đáo, kết hợp giữa các tông màu truyền thống và hiện đại. Dưới đây là những màu tóc đang được ưa chuộng nhất:

### 1. Nâu Caramel Ánh Vàng
Một sự kết hợp hoàn hảo giữa nâu truyền thống và ánh vàng ấm áp:
- Phù hợp với mọi tông da
- Dễ dàng phối với nhiều phong cách
- Không quá kén trang phục

#### Cách Bảo Quản:
- Sử dụng dầu gội đặc trị cho tóc nhuộm
- Ủ tóc thường xuyên
- Hạn chế tiếp xúc với chlorine

### 2. Xám Khói Thời Thượng
Màu tóc mang đến vẻ hiện đại, cá tính:
- Phù hợp với làn da sáng
- Tạo điểm nhấn ấn tượng
- Dễ dàng mix-match với nhiều phong cách

#### Quy Trình Nhuộm:
1. Tẩy tóc đến level 9-10
2. Nhuộm màu xám
3. Sử dụng toner để điều chỉnh tông

### 3. Rose Gold Ngọt Ngào
Sự kết hợp tinh tế giữa hồng và vàng ánh kim:
- Tạo vẻ ngoài ngọt ngào, nữ tính
- Phù hợp với xu hướng Y2K
- Dễ dàng blend với nhiều tông màu khác

### 4. Nâu Sô-cô-la Đậm Chất
Màu tóc cổ điển được nâng cấp:
- Phù hợp với môi trường công sở
- Tạo vẻ sang trọng, quý phái
- Dễ dàng chăm sóc và duy trì

### 5. Highlight Bạch Kim
Kỹ thuật highlight với màu bạch kim:
- Tạo điểm nhấn ấn tượng
- Phù hợp với nhiều độ tuổi
- Dễ dàng mix nhiều phong cách

## Chăm Sóc Tóc Nhuộm

### Những Điều Cần Lưu Ý:
1. Sử dụng sản phẩm chuyên dụng
2. Hạn chế gội đầu thường xuyên
3. Tránh tiếp xúc nhiều với nắng
4. Định kỳ dưỡng tóc tại salon

### Sản Phẩm Khuyên Dùng:
- Dầu gội không sulfate
- Dầu xả màu chuyên dụng
- Mặt nạ dưỡng tóc nhuộm
- Serum bảo vệ màu tóc

## Lời Khuyên Từ Chuyên Gia

### Chọn Màu Phù Hợp:
- Cân nhắc tông da
- Xem xét môi trường làm việc
- Tính đến chi phí bảo dưỡng
- Đánh giá độ hư tổn của tóc

### Quy Trình Nhuộm:
1. Tư vấn với chuyên gia
2. Test màu trước khi nhuộm
3. Thực hiện tại salon uy tín
4. Tuân thủ hướng dẫn chăm sóc

## Xu Hướng Kỹ Thuật Nhuộm

### 1. Balayage
- Tạo hiệu ứng màu tự nhiên
- Phù hợp nhiều độ tuổi
- Dễ dàng chăm sóc

### 2. Money Piece
- Highlight phần tóc mai
- Tạo điểm nhấn cho khuôn mặt
- Trend được ưa chuộng

## Kết Luận

Xu hướng màu tóc 2025 đa dạng và phong phú, phù hợp với nhiều phong cách và cá tính khác nhau. Việc chọn màu tóc phù hợp không chỉ giúp bạn theo kịp xu hướng mà còn thể hiện được cá tính riêng của mình.
    `,
  },
  4: {
    title: "5 Kiểu Tóc Sang Trọng Cho Buổi Tiệc",
    content: `
## Giới Thiệu

Một kiểu tóc đẹp có thể nâng tầm vẻ ngoài của bạn trong các buổi tiệc quan trọng. Dưới đây là 5 kiểu tóc sang trọng và cách thực hiện chi tiết cho từng kiểu.

## 1. Búi Tóc Cao Quý Phái

### Đặc Điểm:
- Tạo vẻ cao sang
- Phù hợp với mọi dáng mặt
- Dễ dàng kết hợp phụ kiện

### Hướng Dẫn Thực Hiện:
1. Chải tóc thật mượt
2. Tạo đuôi ngựa cao
3. Xoắn tóc thành búi
4. Cố định bằng kẹp tóc
5. Xịt gôm giữ nếp

### Tips:
- Sử dụng lược răng nhỏ để tạo nếp
- Thêm phụ kiện để tăng điểm nhấn
- Để vài sợi tóc mai tự nhiên

## 2. Xoăn Sóng Nước Hollywood

### Đặc Điểm:
- Phong cách cổ điển
- Tạo vẻ quyến rũ
- Phù hợp với váy dạ hội

### Các Bước Thực Hiện:
1. Xịt heat protectant
2. Chia tóc thành nhiều phần
3. Uốn từng phần bằng máy uốn
4. Chải nhẹ để tạo sóng
5. Hoàn thiện với serum bóng

## 3. Half-Up Twist Elegance

### Đặc Điểm:
- Nửa búi nửa xõa
- Phù hợp với trang phục công chúa
- Tạo vẻ trẻ trung nhưng sang trọng

### Hướng Dẫn:
1. Tạo texture cho tóc
2. Chia tóc làm hai phần
3. Xoắn phần trên thành búi
4. Uốn xoăn phần dưới
5. Cố định bằng kẹp và gôm

## 4. Braided Crown Updo

### Đặc Điểm:
- Kiểu tóc tết vương miện
- Phù hợp với váy cưới
- Tạo vẻ tinh tế, cổ điển

### Các Bước Thực Hiện:
1. Chia tóc thành hai phần
2. Tết từng bên
3. Quấn tết quanh đầu
4. Cố định bằng kẹp
5. Trang trí với hoa hoặc phụ kiện

## 5. Sleek Low Bun

### Đặc Điểm:
- Búi thấp bóng mượt
- Phù hợp với áo dài
- Tạo vẻ trang nhã

### Hướng Dẫn:
1. Tạo đường ngôi
2. Chải tóc thật mượt
3. Búi tóc thấp
4. Cố định và tạo form
5. Hoàn thiện với serum

## Các Sản Phẩm Cần Thiết

### Công Cụ:
- Lược chải
- Máy uốn tóc
- Kẹp tóc các loại
- Dây chun
- Gương cầm tay

### Sản Phẩm Tạo Kiểu:
- Gôm xịt tóc
- Serum bóng
- Sáp tạo kiểu
- Heat protectant
- Dầu dưỡng tóc

## Tips Giữ Nếp Tóc

### Trước Khi Tạo Kiểu:
1. Gội đầu trước một ngày
2. Sử dụng dầu xả
3. Tránh tóc quá mượt

### Trong Quá Trình Tạo Kiểu:
1. Sử dụng kẹp định hình
2. Xịt gôm từng lớp mỏng
3. Kiểm tra kỹ các góc

### Sau Khi Hoàn Thành:
1. Mang theo kẹp phụ
2. Tránh chạm tay nhiều
3. Mang theo gôm xịt

## Kết Luận

Với 5 kiểu tóc sang trọng này, bạn sẽ tỏa sáng trong mọi buổi tiệc. Hãy nhớ chọn kiểu tóc phù hợp với trang phục và chủ đề của buổi tiệc để có vẻ ngoài hoàn hảo nhất.
    `,
  },
  5: {
    title: "Cách Giữ Nếp Tóc Cả Ngày Dài",
    content: `
## Tại Sao Tóc Khó Giữ Nếp?

Có nhiều yếu tố ảnh hưởng đến việc giữ nếp tóc:
- Độ ẩm không khí
- Chất lượng tóc
- Sản phẩm tạo kiểu
- Kỹ thuật tạo kiểu

## Chuẩn Bị Trước Khi Tạo Kiểu

### 1. Chọn Đúng Sản Phẩm
- Dầu gội phù hợp
- Pre-styling products
- Sản phẩm tạo kiểu chính
- Gôm xịt giữ nếp

### 2. Chuẩn Bị Tóc
1. Gội đầu đúng cách
2. Sử dụng dầu xả
3. Lau khô tóc nhẹ nhàng
4. Thoa sản phẩm bảo vệ nhiệt

## Kỹ Thuật Tạo Kiểu Cơ Bản

### 1. Sấy Tóc Đúng Cách
- Sấy từ gốc đến ngọn
- Điều chỉnh nhiệt độ phù hợp
- Sử dụng đầu tạo kiểu
- Sấy theo hướng mong muốn

### 2. Tạo Nền Tóc
1. Chia tóc thành nhiều phần
2. Sử dụng lô cuốn nếu cần
3. Cố định từng phần
4. Để tóc nguội hoàn toàn

## Các Bước Giữ Nếp Chi Tiết

### Bước 1: Tạo Nền
1. Thoa mousse lên tóc ẩm
2. Sấy tóc theo hướng mong muốn
3. Sử dụng lược tròn
4. Để tóc nguội tự nhiên

### Bước 2: Tạo Kiểu
1. Thoa sáp hoặc wax
2. Định hình theo ý muốn
3. Sử dụng kẹp nếu cần
4. Chờ tóc định hình

### Bước 3: Cố Định
1. Xịt gôm từ khoảng cách 30cm
2. Xịt theo từng lớp mỏng
3. Để khô tự nhiên
4. Chỉnh sửa nếu cần

## Tips Cho Từng Loại Tóc

### Tóc Thẳng
- Sử dụng sản phẩm nhẹ
- Tránh quá nhiều sản phẩm
- Sấy với nhiệt độ vừa phải

### Tóc Xoăn
- Sử dụng kem xả leave-in
- Định hình từng lọn
- Tránh chải khi tóc khô

### Tóc Nhuộm
- Sử dụng sản phẩm bảo vệ màu
- Hạn chế nhiệt độ cao
- Dưỡng ẩm thường xuyên

## Sản Phẩm Khuyên Dùng

### Sản Phẩm Tạo Kiểu
1. Mousse tạo phồng
2. Sáp vuốt tóc
3. Gôm xịt tóc
4. Serum bóng tóc

### Công Cụ Cần Thiết
1. Máy sấy chuyên dụng
2. Lược tròn các cỡ
3. Kẹp tóc
4. Bình xịt nước

## Tips Giữ Nếp Trong Điều Kiện Đặc Biệt

### Thời Tiết Nóng Ẩm
1. Sử dụng sản phẩm chống ẩm
2. Tạo kiểu khi tóc khô hoàn toàn
3. Xịt gôm nhiều lớp mỏng
4. Mang theo gôm xịt

### Hoạt Động Thể Thao
1. Buộc tóc gọn gàng
2. Sử dụng băng đô thấm mồ hôi
3. Mang theo kẹp dự phòng
4. Tránh chạm tay nhiều

## Các Lỗi Thường Gặp

### Lỗi Khi Tạo Kiểu
1. Sử dụng quá nhiều sản phẩm
2. Không đợi tóc khô hoàn toàn
3. Xịt gôm quá gần
4. Chải tóc sau khi xịt gôm

### Cách Khắc Phục
1. Điều chỉnh lượng sản phẩm
2. Đợi tóc khô tự nhiên
3. Xịt gôm đúng khoảng cách
4. Để tóc định hình tự nhiên

## Kết Luận

Giữ nếp tóc cả ngày đòi hỏi sự kiên nhẫn và kỹ thuật đúng. Với những tips trên, bạn có thể duy trì kiểu tóc đẹp suốt ngày dài.
    `,
  },
};
