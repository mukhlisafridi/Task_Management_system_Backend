import express from "express"
import { adminOnly, verification } from "../utils/authentication.js"
import { createTask } from "../controllers/task.controller.js"

const router = express.Router()
router.post("/create",verification,adminOnly,createTask)

export default router 