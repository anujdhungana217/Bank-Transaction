import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Username must be Entered"],
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email must required for creating Account"],
      trim: true,
      lowercase: true,
      unique: true ,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid Email Format",
      ],
    },
    password: {
        type:String,
      required: [true, "Password required"],
      minlength: [6, "Password Length must be longer than 6 character"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save",async function (){
    if(!this.isModified("password")){
        return 
    }

    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
    return 
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}


const userModel=mongoose.model("user",userSchema)

export default userModel