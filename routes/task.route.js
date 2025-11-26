import express from "express"
import { adminOnly, verification } from "../utils/authentication.js"
import { createTask, getTasks } from "../controllers/task.controller.js"

const router = express.Router()
router.post("/create",verification,adminOnly,createTask)
router.get("/",verification,getTasks)

export default router 