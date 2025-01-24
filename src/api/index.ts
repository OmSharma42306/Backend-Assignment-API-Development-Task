import express from "express"
import userRouter from "../routes/user"
import taskRouter from "../routes/tasks"
import feedRouter from "../routes/feed"

// Initializing a Base Router for All Routes
const router = express.Router();

router.use("/user",userRouter);
router.use("/task",taskRouter)
router.use("/posts",feedRouter)


// Exporting Base Router
export default router;
