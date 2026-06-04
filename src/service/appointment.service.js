import {appointmentRepository} from "../respository/appointment.repository.js";
import { validateAppointment } from "../validators/appointment.validation.js";
import {carRepository} from "../respository/car.repository.js";
import { sendAppointmentNotification } from "./sendEmail.service.js";
import { appendAppointment } from "./googlesheet.service.js";

class AppointmentService {
  async create(data) {
  validateAppointment(data);

  const appointment = await appointmentRepository.create({
    firstName: data.firstName.toString().trim(),
    lastName: data.lastName.toString().trim(),
    phone: data.phone.toString(),
    address: data.address.toString().trim(),
    carID: data.carID,
    status: "da_nop",
  });

  const car = await carRepository.findById(appointment.carID);
  console.log("Sending email...");
  await sendAppointmentNotification({ ...appointment.toJSON(), carName: car?.name || "" })
    .then(() => console.log("Email sent successfully"))
    .catch((err) => console.error("EMAIL ERROR:", err.message));

  appendAppointment({
    ...appointment.toJSON(),
    carName: car?.name || "",
  })
    .then(() => console.log("Google Sheet updated successfully"))
    .catch((err) =>
      console.error("GOOGLE SHEET ERROR:", err.message)
    );

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