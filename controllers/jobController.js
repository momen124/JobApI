const { StatusCodes } = require('http-status-codes');
const jobService = require('../services/jobService');

const getAllJobs = async (req, res) => {
  // 1) Parse query & userId
  // 2) Call jobService.getAllJobs(...)
  const data = await jobService.getAllJobs(req.query, req.user.userId);

  // data is an object: { jobs, totalJobs, numOfPages, currentPage }
  res.status(StatusCodes.OK).json(data);
};

const getJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  const job = await jobService.getJobById(jobId, userId);
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { userId } = req.user;
  // jobService handles any validation
  const job = await jobService.createJob(req.body, userId);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  const job = await jobService.updateJob(jobId, userId, req.body);
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  await jobService.deleteJob(jobId, userId);
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
