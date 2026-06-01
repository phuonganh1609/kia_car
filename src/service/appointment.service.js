import {appointmentRepository} from "../respository/appointment.repository.js";
import { validateAppointment } from "../validators/appointment.validation.js";
import { sendAppointmentNotification } from "./sendEmail.service.js";
import { appendAppointment } from "./googlesheet.service.js";

class AppointmentService {
  async create(data) {
  validateAppointment(data);

  // 1. Tạo và lưu dữ liệu vào Database SQL trước
  const appointment = await appointmentRepository.create({
    firstName: data.firstName.toString().trim(),
    lastName: data.lastName.toString().trim(),
    phone: data.phone.toString(),
    content: data.content.toString().trim(),
    status: "da_nop",
  });

  // 2. Chạy ngầm việc gửi email và ghi sheet, không bắt Swagger phải đợi (Non-blocking)
  // Việc này giúp Swagger nhận được phản hồi ngay lập tức và hết bị "LOADING"
  
  // Tiến trình gửi Email
  console.log("Preparing email...");
  sendAppointmentNotification(appointment)
    .then(() => console.log("Email sent successfully"))
    .catch((emailError) => {
      console.error("EMAIL ERROR nhưng luồng code vẫn tiếp tục chạy:", emailError.message);
    });

  // Tiến trình ghi vào Google Sheet (Vẫn chạy bình thường dù Mail có lỗi)
  appendAppointment(appointment)
    .then(() => console.log("Google Sheet updated successfully"))
    .catch((sheetError) => {
      console.error("GOOGLE SHEET ERROR:", sheetError.message);
    });

  // 3. Trả dữ liệu về ngay lập tức cho Swagger / Client
  return appointment;
}
  async list(filter = {}) {
        if (filter.name) {
            const appointments = await appointmentRepository.find({
                name: { $regex: filter.name, $options: 'i' },
            }).select('_id');

            filter.carID = { $in: appointments.map((c) => c._id) };
            delete filter.name;
        }

        // repository already populates the supply and warehouse
        return await appointmentRepository.findAll(filter);
  };
}
const appointmentService = new AppointmentService();
export { appointmentService };