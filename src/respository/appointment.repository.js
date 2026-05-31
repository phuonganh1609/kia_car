import Appointment from "../models/appointment.js";

class AppointmentRepository {
  async create(appointmentData) {
    return await Appointment.create(appointmentData);
  }
  async findAll(filter = {}, pagination = { page: 1, limit: 10 }) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        const { rows, count } = await Appointment.findAndCountAll({
            where: filter,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            
        });

        return {
            data: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        };
    }
}

const appointmentRepository = new AppointmentRepository();
export { appointmentRepository };
