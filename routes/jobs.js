const express = require('express')
const { createJob, deleteJob, getAllJobs, updateJob, getJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authentication');
const router = express.Router()

router.route('/').post(createJob).get(getAllJobs)

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router
