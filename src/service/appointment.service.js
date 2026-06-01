import {appointmentRepository} from "../respository/appointment.repository.js";
import { validateAppointment } from "../validators/appointment.validation.js";
import { sendAppointmentNotification } from "./sendEmail.service.js";
import { appendAppointment } from "./googleSheet.service.js";

class AppointmentService {
  async create(data) {
  validateAppointment(data);

  const appointment = await appointmentRepository.create({
    firstName: data.firstName.toString().trim(),
    lastName: data.lastName.toString().trim(),
    phone: data.phone.toString(),
    content: data.content.toString().trim(),
    status: "da_nop",
  });

  console.log("Sending email...");
  await sendAppointmentNotification(appointment);
  console.log("Email sent");

  await appendAppointment(appointment);

  return appointment;
}
  async list(filter = {}, pagination = { page: 1, limit: 10 }) {
        if (filter.name) {
            const appointments = await appointmentRepository.find({
                name: { $regex: filter.name, $options: 'i' },
            }).select('_id');

            filter.carID = { $in: appointments.map((c) => c._id) };
            delete filter.name;
        }

        // repository already populates the supply and warehouse
        return await appointmentRepository.findAll(filter, pagination);
  };
}
const appointmentService = new AppointmentService();
export { appointmentService };