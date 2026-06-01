import axios from 'axios';

/**
 * Hàm gửi email thông báo lịch hẹn qua API Promailer
 * @param {Object} appointment - Thông tin lịch hẹn của khách hàng
 */
export const sendAppointmentNotification = async (appointment) => {
  try {
    console.log("Preparing email...");

    // Gọi API của Promailer để gửi thư
    const response = await axios.post(
      'https://mailserver.automationlounge.com/api/v1/messages/send',
      {
        // Địa chỉ email nhận thông báo (lấy từ biến môi trường của bạn)
        to: process.env.CTA_EMAIL, 
        
        // Tiêu đề email
        subject: "Khách hàng mới đăng ký tư vấn",
        
        // Nội dung email dạng HTML (đã được map theo đúng data từ biến appointment)
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
          // Token xác thực Promailer lấy từ biến môi trường
          'Authorization': `Bearer ${process.env.API_MAIL_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Email sent successfully:", response.data);
    return response.data;

  } catch (error) {
    // In ra chi tiết lỗi từ API Promailer nếu có
    if (error.response) {
      console.error("EMAIL ERROR (API):", error.response.data);
    } else {
      console.error("EMAIL ERROR:", error.message);
    }
    throw error;
  }
};