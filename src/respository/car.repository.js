import Car from '../models/car.js';

class CarRepository {
    
    async findAll(filter = {}) {
        const { count, rows } = await Car.findAndCountAll({
          where: filter,
          order: [["id", "ASC"]],
          distinct: true,
        });
    
        return {
          data: rows,
          total: count,
        };
    };
    async findById(id) {
        return await Car.findByPk(id);
    }

}
const carRepository = new CarRepository();
export { carRepository };