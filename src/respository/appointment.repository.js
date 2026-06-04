import Appointment from "../models/appointment.js";

class AppointmentRepository {
  async create(appointmentData) {
    return await Appointment.create(appointmentData);
  }
  async findAll(filter = {}) {
        const { count, rows } = await Appointment.findAndCountAll({
            where: filter,
            order: [['createdAt', 'DESC']],
            distinct: true,
        });

        return {
            data: rows,
            total: count,
        };
    }
}

const appointmentRepository = new AppointmentRepository();
export { appointmentRepository };
