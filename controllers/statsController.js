const { StatusCodes } = require('http-status-codes');
const jobService = require('../services/jobService');

const showStats = async (req, res) => {
  const userId = req.user.userId;
  const stats = await jobService.showStats(userId);
  res.status(StatusCodes.OK).json(stats);
};

module.exports = {
  // other controllers...
  showStats,
};
