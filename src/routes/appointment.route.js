import express from "express";
import{createAppointment,getAllAppointments} from "../controller/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);

export default router;