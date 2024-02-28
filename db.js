const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('Database is Connected');
        return; 
    } catch (error) {
        console.error('Database connection error:', error.message);
        throw error; 
    }
};

module.exports = connectDb;
