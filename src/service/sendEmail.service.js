import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 25,            // Thử nghiệm với port 25
  secure: false,       // Phải là false đối với port 25
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Bỏ qua xác thực chứng chỉ nếu bị chặn kết nối nâng cao
  },
  connectionTimeout: 10000,
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