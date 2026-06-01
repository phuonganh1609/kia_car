import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // THÊM DOẠN NÀY ĐỂ ÉP SỬ DỤNG IPV4
  connectionTimeout: 10000, // Thêm timeout để tránh treo app nếu lỗi (10s)
  greetingTimeout: 10000,
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