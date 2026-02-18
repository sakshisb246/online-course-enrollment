const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use local MongoDB by default if MONGO_URI is not set
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-course-enrollment';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
