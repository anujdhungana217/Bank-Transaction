import {mongoose} from "mongoose"

async function createDB(){
  await  mongoose.connect(process.env.MONGO_URI)
    console.log("dataBase Connected")
}

export default createDB