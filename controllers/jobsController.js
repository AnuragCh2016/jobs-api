import { Job } from "../models/Job.js";
import errors from "../errors/index.js";
import { User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";

export class JobController {
  static createJob = async (req, res) => {
    const { title, company, status } = req.body;
    const { id } = req.data;
    const user = await User.findById(id);
    const job = new Job({
      title,
      company,
      status,
      createdBy:id,
    });
    // const result = await job.save();
    await job.save();
    // console.log("Created job:",result);
    user.jobs.push(job);
    // console.log("Jobs of user:",user.jobs)
    // const checkUser = await user.save();
    await user.save();
    // console.log("User now:",checkUser);
    res.status(StatusCodes.CREATED).json({ msg: "Job created",job:job });
  };

  static getAllJobs = async (req, res) => {
    const { id } = req.data;
    // console.log(id);
    const user = await User.findById(id);
    res.status(StatusCodes.OK).json({ jobs: user.jobs });
  };

  static getSingleJob = async (req, res) => {
    const { id: jobsId } = req.params;
    // console.log(jobsId);
    // const {id:userId} = req.data;
    const job = await Job.findById(jobsId);
    // console.log(job)
    res.status(StatusCodes.OK).json({ msg: "Success", job: job });
  };

  static editJob = async (req, res) => {
    // https://stackoverflow.com/questions/18173482/mongodb-update-deeply-nested-subdocument/28952991#28952991
    // https://stackoverflow.com/a/47762417/8603687s
    //already have the req.data containing _id of user
    const { id } = req.data;
    // const {status} = req.body;
    const { id: jobsID } = req.params;
    const user = await User.findById(id);
    const actualJob = await Job.findById(jobsID);
    const job = user.jobs.id(jobsID);   //for subdocument
    if (!job) {
      throw new errors.BadRequestError(`No job with matching id`);
    }
    // console.log(job);
    job.status = req.body.status;
    actualJob.status = req.body.status;
    await user.save();
    await actualJob.save();
    res.json({ edited: job });
  };

  static deleteJob = async (req, res) => {
    //https://stackoverflow.com/questions/18553946/remove-sub-document-from-mongo-with-mongoose
    const { id } = req.data;
    console.log("Id is:", id);
    const { id: jobsID } = req.params;
    // console.log("Job Id is:",jobsID)
    const user = await User.findById(id);
    // console.log("User is:",user);
    let job = user.jobs.id(jobsID);
    // console.log(job);
    if (!job) {
      throw new errors.BadRequestError(`No job with matching id`);
    } else {
      job = user.jobs.id(jobsID).remove();
      // console.log("Removed job:",job);
      await user.save();
      res.json({ msg: "Job deleted", job: job });
    }
  };
}

/**
 * const {id:jobsId} = req.params;
        const {status} = req.body;
        // const {id:userId} = req.data;
        const update = {status: status};

        const userAfterUpdatedJob = await User.findOneAndUpdate({'jobs._id':jobsId},update,{
            new:true,
            runValidators:true,
        });
        if(!userAfterUpdatedJob){
            throw new errors.BadRequestError(`No job with matching id`);
        }
        res.json({job:userAfterUpdatedJob.jobs});
 */

/**
     * const user = await User.findById(id);

        const job = user.jobs.id(jobsID);
        if(!job){
            throw new errors.BadRequestError(`No job with that ID`);
        }
        
        // user.jobs.id(jobsID).status = req.body;
        // user.save();
     */
