const express = require("express");
const cors = require("cors");  // ✅ Import CORS

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());  // ✅ Use CORS middleware (allows frontend access)

// Connect MongoDB
require("./config/database").DbConnect();

app.get("/", (req, res) => {
    return res.send("Hi Rajneesh");
});

// Import Routes
const signup = require("./routes/user");
app.use("/api/v1", signup);

const job = require("./routes/job");
app.use("/api/v1", job);

const company = require("./routes/companyroutes");
app.use("/api/v1", company);

const application = require("./routes/application");
app.use("/api/v1", application);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
