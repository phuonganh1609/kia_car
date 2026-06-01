import nodemailer from "nodemailer";
// Khởi động server (listen port)
// 1. Ép hệ thống ưu tiên sử dụng IPv4 để sửa lỗi ENETUNREACH trên Render
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 	'465',
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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