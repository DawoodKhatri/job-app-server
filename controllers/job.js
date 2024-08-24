import { CONTRACTS } from "../constants/contract.js";
import Job from "../models/job.js";
import User from "../models/user.js";

export const getActiveJobs = async (req, res) => {
  try {
    let jobs = await Job.find().select("-applications");

    jobs = jobs.filter((job) => job.active);

    return res.status(200).json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    let jobs = await Job.find();

    jobs = jobs.map((job) => ({
      ...job.toObject(),
      applications: job.applications.length,
    }));

    return res.status(200).json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    let job = await Job.findById(jobId).populate({
      path: "applications",
      select: "-jobs -role",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { applications: job.applications },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const { company, position, contract, location, description } = req.body;

    if (!company || !position || !contract || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!Object.values(CONTRACTS).includes(contract)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contract type",
      });
    }

    const job = await Job.create({
      company,
      position,
      contract,
      location,
      description,
    });

    return res.status(200).json({
      success: true,
      data: { job },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { company, position, contract, location, description } = req.body;

    if (!company || !position || !contract || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!Object.values(CONTRACTS).includes(contract)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contract type",
      });
    }

    let job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndUpdate(jobId, {
      company,
      position,
      contract,
      location,
      description,
    });

    return res.status(200).json({
      success: true,
      data: {
        job: {
          ...job.toObject(),
          company,
          position,
          contract,
          location,
          description,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changeJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { active } = req.body;

    let job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndUpdate(jobId, {
      active,
    });

    return res.status(200).json({
      success: true,
      data: {
        job: {
          ...job.toObject(),
          active,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { _id } = req.user;

    let job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!job.active) {
      return res.status(400).json({
        success: false,
        message: "Job is not accepting applications",
      });
    }

    if (job.applications.includes(_id)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: _id },
    });

    await User.findByIdAndUpdate(_id, {
      $push: { jobs: jobId },
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userJobs = async (req, res) => {
  try {
    const { _id } = req.user;

    const jobs = await Job.find({ applications: _id }).select("-applications");

    return res.status(200).json({
      success: true,
      data: { jobs },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
