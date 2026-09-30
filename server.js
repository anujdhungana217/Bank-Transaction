import "dotenv/config"
import app from "./src/app.js"
import createDB from "./src/db/db.js"

createDB()

app.listen(3000,()=>{
    console.log("server is running in localhost 3000")
})