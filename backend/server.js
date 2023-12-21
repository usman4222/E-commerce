const app = require('./app')
const dotenv = require('dotenv')
const dataBase = require('./config/database')
const cloudinary = require("cloudinary")

//handling uncatch exception
// console.log(you) {this type of error}

process.on("uncaughtException", (error) =>{
    console.log(`Error: ${error.message}`)
    console.log(`Server is close due to Uncatch Exception Error`)
    process.exit(1);
    
})

//config

dotenv.config({path: "backend/config/config.env"})

dataBase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


const server = app.listen(process.env.PORT, () =>{
    console.log(`Server is running on http://localhost: ${process.env.PORT}`)
})

//unhandle promise rejection
process.on("unhandledRejection", (error)=>{
    console.log(`Error: ${error.message}`)
    console.log(`Shutting down the server dueto unhandled promise rejection`)

    server.close(() =>{
        process.exit(1)
    })
})