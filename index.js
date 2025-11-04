import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import {connectDB} from "./utils/db.js"
dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(morgan("dev"))
connectDB()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(` app listening on port ${PORT}`)
})