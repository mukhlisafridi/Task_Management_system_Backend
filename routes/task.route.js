import express from "express"
import { adminOnly, verification } from "../utils/authentication.js"
import { createTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js"

const router = express.Router()
router.post("/create",verification,adminOnly,createTask)
router.get("/",verification,getTasks)
router.get("/:id",verification,getTaskById)
router.put("/:id",verification,updateTask)

export default router 