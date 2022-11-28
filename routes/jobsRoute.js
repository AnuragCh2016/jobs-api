import express from "express";
import { JobController } from "../controllers/jobsController.js";
import { authenticateMiddleware } from "../middleware/authentication.js";
const router = express.Router();

//stackoverflow.com/a/58847774/
https: router.use("/", authenticateMiddleware);

router.route("/").get(JobController.getAllJobs).post(JobController.createJob);
router
  .route("/:id")
  .get(JobController.getSingleJob)
  .patch(JobController.editJob)
  .delete(JobController.deleteJob);

export default router;
