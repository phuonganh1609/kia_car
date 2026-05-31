import Car from '../models/car.js';

class CarRepository {
    async findAll(filter = {}, pagination = { page: 1, limit: 10 }) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;

        const { rows, count } = await Car.findAndCountAll({
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
const carRepository = new CarRepository();
export { carRepository };