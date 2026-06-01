import { Resend } from 'resend';

// Khởi tạo thư viện bằng API KEY từ biến môi trường
const resend = new Resend(process.env.API_KEY_RESEND);

export async function sendAppointmentNotification(appointment) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_USER, // Email mặc định test của Resend, sau này có tên miền riêng thì đổi sau
      to: [process.env.CTA_EMAIL], // Điền email của bạn vào đây để nhận thông báo
      subject: 'Thông báo lịch hẹn mới từ Kia Car',
      html: `<p>Bạn có lịch hẹn mới từ khách hàng <strong>${appointment.firstName} ${appointment.lastName}</strong></p>
             <p>Số điện thoại: ${appointment.phone}</p>
             <p>Nội dung: ${appointment.content}</p>`,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Email sent successfully via Resend API!", data.id);
  } catch (error) {
    // Luồng code chính vẫn chạy an toàn nhờ khối catch này
    console.error("Hệ thống API Mail lỗi:", error.message);
  }
}