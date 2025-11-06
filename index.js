import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import {connectDB} from "./utils/db.js"
import cors from "cors"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(cors({
  origin:process.env.FRONTEND_URL,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}))
app.use(morgan("dev"))
connectDB()

import userRoute from "./routes/user.route.js"
app.use("/user",userRoute)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(` app listening on port ${PORT}`)
})