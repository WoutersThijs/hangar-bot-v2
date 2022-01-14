import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

function connect(){
    const dbUri = process.env.MONGO_URI;

    return mongoose
        .connect(dbUri as string)
        .then(() => {
            console.log("MongoDB connected.")
        })
        .catch((error) => {
            console.log("MongoDB connection failed. " + error)
            process.exit(1);
        });
}

export default connect;