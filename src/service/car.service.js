import {carRepository} from '../respository/car.repository.js';

class CarService {
    async list(filter = {}, pagination = { page: 1, limit: 10 }) {
        if (filter.name) {
            const car = await Car.find({
                name: { $regex: filter.name, $options: 'i' },
            }).select('_id');

            filter.carID = { $in: cars.map((c) => c._id) };
            delete filter.name;
        }

        // repository already populates the supply and warehouse
        return await carRepository.findAll(filter, pagination);
    };
}
const carService = new CarService();
export{ carService };