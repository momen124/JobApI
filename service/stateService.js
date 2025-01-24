const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors'); 
const moment = require('moment');

const showStats = async (userId) => {
  // 1) Aggregate jobs by status
  let statsByStatus = await Job.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert result into { pending: 3, interview: 5, declined: 2 }
  statsByStatus = statsByStatus.reduce((acc, curr) => {
    const { _id: status, count } = curr;
    acc[status] = count;
    return acc;
  }, {});

  // Ensure all statuses appear, even if 0
  const defaultStats = {
    pending: statsByStatus.pending || 0,
    interview: statsByStatus.interview || 0,
    declined: statsByStatus.declined || 0,
  };

  // 2) Aggregate jobs by month/year
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  // Format monthly data, e.g., 'Jan 2025'
  monthlyApplications = monthlyApplications.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;
    const date = moment().month(month - 1).year(year).format('MMM Y');
    return { date, count };
  });

  // Reverse the array to show oldest month first (optional)
  monthlyApplications.reverse();

  // Return the final stats object
  return {
    defaultStats,
    monthlyApplications,
  };
};

module.exports = {
  showStats,
  // other service methods...
};
