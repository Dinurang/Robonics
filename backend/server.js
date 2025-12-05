import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

// ---- ESSENTIAL ORDER ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//middleware
import { authenticateToken, isAdmin } from "./routes/middleware/middleware.js";

import googleAuthRoutes from './routes/googleAuth.js';
app.use('/auth/google', googleAuthRoutes);
// Visit http://localhost:5000/auth/google/login



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
import userOrders from './routes/userend/userOrders.js';
app.use('/user/orders', userOrders);



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

