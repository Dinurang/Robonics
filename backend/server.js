import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
import { authenticateToken, isAdmin } from "./routes/middleware/middleware.js";

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // replaces body-parser.urlencoded()




// Common routes 
import registerRoute from "./routes/userend/register.js";
app.use("/register", registerRoute);
import loginRoute from "./routes/commonend/login.js";
app.use("/login", loginRoute);







// User routes 
import userProfileRoutes from "./routes/userend/userProfile.js";
app.use("/user/profile", userProfileRoutes);
import userBook from "./routes/userend/userBook.js";
app.use("/user/book", userBook);




//admin routes





//owner routes




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

