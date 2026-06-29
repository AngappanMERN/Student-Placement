const Application = require('../models/Application');
const Job = require('../models/Job');

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const jobExists = await Job.findById(jobId);
    if (!jobExists) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = await Application.findOne({ user: req.user._id, job: jobId });
    if (alreadyApplied) return res.status(400).json({ message: 'You have already applied for this job' });

    const application = await Application.create({
      user: req.user._id,
      job: jobId
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).populate('job').populate('user', '-password');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyForJob, getUserApplications, getAllApplications, updateApplicationStatus };
