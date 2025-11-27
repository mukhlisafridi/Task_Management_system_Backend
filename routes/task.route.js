import express from "express"
import { adminOnly, verification } from "../utils/authentication.js"
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, updateTask, updateTaskChecklist, updateTaskStatus, userDashboardData } from "../controllers/task.controller.js"

const router = express.Router()
router.post("/create",verification,adminOnly,createTask)
router.get("/",verification,getTasks)
//admin Dashboard-Data route
router.get("/dashboard-data",verification,adminOnly,getDashboardData)
//user route Dashboard-Data route
router.get("/user-dashboard-data",verification,userDashboardData)
router.get("/:id",verification,getTaskById)
router.put("/:id",verification,updateTask)
router.delete("/:id",verification,adminOnly,deleteTask)
router.put("/:id/status",verification,updateTaskStatus)
router.put("/:id/todo",verification,updateTaskChecklist)

export default router 