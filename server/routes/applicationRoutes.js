const express = require('express');
const { applyForJob, getUserApplications, getAllApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, applyForJob)
  .get(protect, getUserApplications);

router.route('/all').get(protect, admin, getAllApplications);
router.route('/:id').put(protect, admin, updateApplicationStatus);

module.exports = router;
