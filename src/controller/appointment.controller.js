import {appointmentService} from "../service/appointment.service.js";

export const createAppointment = async (req, res) => {
    try {
      const appointment = await appointmentService.create(req.body);

      return res.status(201).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      const statusCode = /không|không hợp lệ/.test(error.message) ? 400 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.list();
        return res.status(200).json({
            success: true,
            data: appointments,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
};
