import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    const userTaskCounts = new Promise(
      users.map(async (user) => {
        const pendingTasks = Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });

        const inProgressTasks = Task.countDocuments({
          assignedTo: user._id,
          status: "In Process",
        });
        const completedTask = Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTask,
        };
      })
    );
  } catch (error) {
    throw errorHandler(500, error.message);
  }
};
