const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const fs = require('fs');

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const data = JSON.parse(fs.readFileSync('./mock-data.json', 'utf-8'));

    await User.deleteMany();
    await Job.deleteMany();

    const insertedUsers = await User.insertMany(data.users);
    data.jobs.forEach(job => job.createdBy = insertedUsers[0]._id);
    await Job.insertMany(data.jobs);

    console.log('Mock data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
