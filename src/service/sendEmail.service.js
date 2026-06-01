import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,         // Đổi từ 587 sang 465 (Cổng bảo mật SSL)
  secure: true,      // BẮT BUỘC ĐỔI THÀNH TRUE khi dùng port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // (Tùy chọn) Tự động ngắt kết nối sau 10s nếu mạng lag
});

export const sendAppointmentNotification = async (appointment) => {
  try {
    console.log("Preparing email...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CTA_EMAIL,
      subject: "Khách hàng mới đăng ký tư vấn",
      html: `
        <h2>Khách hàng mới đăng ký tư vấn</h2>
        <p><strong>Họ:</strong> ${appointment.firstName}</p>
        <p><strong>Tên:</strong> ${appointment.lastName}</p>
        <p><strong>SĐT:</strong> ${appointment.phone}</p>
        <p><strong>Nội dung:</strong> ${appointment.content}</p>
      `,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};