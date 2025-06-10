import React, { useEffect, useState } from 'react';
import axios from 'axios'; // hoặc dùng ContactService nếu có

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách liên hệ
    axios.get('http://localhost:5155/api/Contacts') // Cập nhật URL nếu khác
      .then(res => setContacts(res.data))
      .catch(err => console.error('Lỗi khi lấy danh sách liên hệ:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Danh sách liên hệ</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Tin nhắn</th>
            <th>Ngày gửi</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.message}</td>
              <td>{new Date(contact.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contact;
