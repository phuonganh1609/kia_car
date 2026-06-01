import axios from 'axios';
import https from 'https';

/**
 * Hàm gửi email thông báo lịch hẹn qua API Promailer
 * @param {Object} appointment - Thông tin lịch hẹn của khách hàng
 */
export const sendAppointmentNotification = async (appointment) => {
  try {
    console.log("Preparing email...");

    // Tạo một agent để bỏ qua lỗi kiểm tra phiên bản SSL/TLS không khớp từ server Promailer
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });

    // Gọi API của Promailer để gửi thư
    const response = await axios.post(
      'https://mailserver.automationlounge.com/api/v1/messages/send',
      {
        to: process.env.CTA_EMAIL, 
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
        httpsAgent: agent // Gắn cấu hình agent vào đây để bypass lỗi SSL
      }
    );

    console.log("Email sent successfully:", response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error("EMAIL ERROR (API):", error.response.data);
    } else {
      console.error("EMAIL ERROR:", error.message);
    }
    throw error;
  }
};