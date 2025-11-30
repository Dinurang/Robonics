import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // replaces body-parser.urlencoded()



// common routes

// import FrontOfficeLogin from "./routes/FrontDesk/FrontOfficeLogin.js";
// app.use("/frontofficelogin", FrontOfficeLogin);



//user routes



//admin routes




// Example route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


// Start the server and make it listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});

