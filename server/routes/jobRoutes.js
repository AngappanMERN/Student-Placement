const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, admin, createJob)
  .get(protect, getJobs);

router.route('/:id')
  .put(protect, admin, updateJob)
  .delete(protect, admin, deleteJob);

module.exports = router;
