const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Job = require('./models/Job'); // Import the Job model

dotenv.config(); // Load environment variables from .env

const populateDB = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to database...');

    // Read mock data from the JSON file
    const jobs = JSON.parse(fs.readFileSync('./mock-data.json', 'utf-8'));

    // Clear the Job collection before inserting new data
    await Job.deleteMany();
    console.log('Existing jobs deleted.');

    // Insert mock jobs into the database
    await Job.insertMany(jobs);
    console.log('Mock job data successfully inserted.');

    // Close database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

// Run the function
populateDB();
