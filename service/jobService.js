const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllJobs = async (query, userId) => {
  const { search, status, jobType, sort, page, limit } = query;

  let queryObject = { createdBy: userId };

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // Pagination defaults
  const pageNumber = Number(page) || 1;
  const resultsPerPage = Number(limit) || 10;
  const skip = (pageNumber - 1) * resultsPerPage;

  // Sorting
  let sortOptions;
  switch (sort) {
    case 'latest':
      sortOptions = '-createdAt';
      break;
    case 'oldest':
      sortOptions = 'createdAt';
      break;
    case 'a-z':
      sortOptions = 'position';
      break;
    case 'z-a':
      sortOptions = '-position';
      break;
    default:
      sortOptions = '-createdAt';
  }

  const jobs = await Job.find(queryObject)
    .sort(sortOptions)
    .skip(skip)
    .limit(resultsPerPage);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / resultsPerPage);

  return { jobs, totalJobs, numOfPages, currentPage: pageNumber };
};

const getJobById = async (jobId, userId) => {
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  return job;
};

const createJob = async (jobData, userId) => {
  // Ensure required fields are provided (if needed)
  if (!jobData.company || !jobData.position) {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }

  jobData.createdBy = userId;
  const job = await Job.create(jobData);
  return job;
};

const updateJob = async (jobId, userId, jobData) => {
  const { company, position } = jobData;
  if (!company || !position) {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    jobData,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  return job;
};

const deleteJob = async (jobId, userId) => {
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  // No data to return for a delete, so just return
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
