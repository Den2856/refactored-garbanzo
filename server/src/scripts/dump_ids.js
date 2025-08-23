// server/dump_ids.js
const mongoose = require('mongoose');

(async () => {
  try {
    // Подключитесь к вашей базе (замените URL на свой, если нужно)
    await mongoose.connect('mongodb://localhost:27017/newproject', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Берём коллекцию trips (любая схема, strict: false)
    const Trip = mongoose.model(
      'Trip',
      new mongoose.Schema({}, { strict: false }),
      'trips'
    );

    // Запрашиваем только _id
    const docs = await Trip.find({}, { _id: 1 }).lean();

    // Печатаем все ObjectId по одному на строку
    docs.forEach(doc => {
      console.log(doc._id.toString());
    });
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
})();
