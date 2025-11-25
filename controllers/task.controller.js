import Task from "../models/task.model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;
    const adminId = req.user.id;
    if (!Array.isArray(assignedTo)) {
      return next(errorHandler(400, "assignedTo must be array..!"));
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
      createdBy: adminId,
    });
    return res.status(201).json({
      message: "Task Created Successfully..!",
      success: true,
      task,
    });
  } catch (error) {
    console.log(error.message);
    return next(errorHandler(500, error.message));
  }
};
