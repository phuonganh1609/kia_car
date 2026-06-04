import {appointmentRepository} from "../respository/appointment.repository.js";
import { validateAppointment } from "../validators/appointment.validation.js";
import { sendAppointmentNotification } from "./sendEmail.service.js";
import { appendAppointment } from "./googlesheet.service.js";

class AppointmentService {
  async create(data) {
    validateAppointment(data);
    return await appointmentRepository.create({
      firstName: data.firstName.toString().trim(),
      lastName: data.lastName.toString().trim(),
      phone: data.phone.toString(),
      address: data.address.toString().trim(),
      carID: data.carID,
      status: "da_nop",
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