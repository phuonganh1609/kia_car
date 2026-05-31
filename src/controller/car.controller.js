import {carService} from '../service/car.service.js';

export const getAllCars = async (req, res) => {
    try {
        const cars = await carService.list();
        return res.status(200).json({
            success: true,
            data: cars,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
}

