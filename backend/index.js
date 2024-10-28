const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./config/db"); // Assuming the DB connection setup is in config/db.js
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const passport = require("./controllers/googleController");
const next = require("next");
const path = require("path"); // Import path module

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: path.join(__dirname, "../frontend") }); // Point to the frontend directory
const handle = app.getRequestHandler();

const server = express();

// Middleware setup
server.use(express.json());
server.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL, // URL of your Next.js app in development/production
  credentials: true,
};
server.use(cors(corsOptions));

// Connect to the database
connectDb();
server.use(passport.initialize());

// API routes
server.use("/api/auth", authRoute);
server.use("/api/users", postRoute);
server.use("/api/users", userRoute);
// Prepare the Next.js app
app.prepare().then(() => {
  // Handle all requests not caught by API routes
  server.all("*", (req, res) => {
    return handle(req, res); // Let Next.js handle it
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});
