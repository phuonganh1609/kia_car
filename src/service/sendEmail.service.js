import axios from 'axios';
import dns from 'dns';

// Ép Node.js ưu tiên dùng IPv4 khi phân giải tên miền để tránh lỗi mạng ENETUNREACH
dns.setDefaultResultOrder("ipv4first");

/**
 * Hàm gửi email thông báo lịch hẹn bằng Promailer API
 * @param {Object} appointment - Đối tượng chứa thông tin khách hàng
 */
export const sendAppointmentNotification = async (appointment) => {
  try {
    console.log("Preparing email via Promailer API...");

    // Gọi API của Promailer để gửi email
    const response = await axios.post(
      'https://mailserver.automationlounge.com/api/v1/messages/send',
      {
        to: process.env.CTA_EMAIL, // Email người nhận (Lấy từ biến môi trường của bạn)
        subject: "Khách hàng mới đăng ký tư vấn",
        html: `
          <h2>Khách hàng mới đăng ký tư vấn</h2>
          <p><strong>Họ:</strong> ${appointment.firstName}</p>
          <p><strong>Tên:</strong> ${appointment.lastName}</p>
          <p><strong>SĐT:</strong> ${appointment.phone}</p>
          <p><strong>Nội dung:</strong> ${appointment.content}</p>
        `
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_MAIL_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000 // Tự động ngắt kết nối sau 10 giây nếu API không phản hồi
      }
    );

    // log kết quả khi gửi thành công
    console.log("Email sent successfully via Promailer:", response.data);

  } catch (error) {
    console.error("❌ PROMAILER ERROR:");
    
    if (error.response) {
      // Lỗi trả về từ server của Promailer (Ví dụ: Sai Token, hết hạn gói, sai định dạng data)
      console.error(`Status: ${error.response.status} - Message:`, error.response.data);
    } else {
      // Lỗi kết nối mạng (Không tìm thấy server, rớt mạng,...)
      console.error("Network/Connection Error:", error.message);
    }

    // Bắn lỗi ra ngoài để luồng chính (nơi gọi hàm này) biết và dừng lại, không chạy tiếp các logic sau nó
    throw error;
  }
};