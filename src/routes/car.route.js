import express from "express";
import {getAllCars} from "../controller/car.controller.js";

const router = express.Router();

router.get("/", getAllCars);

export default router;