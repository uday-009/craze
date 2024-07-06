const mongoose = require("mongoose");


const dashboardSchema = new mongoose.Schema({
   
});

const Dashboard = mongoose.models.User || mongoose.model("Dasboard", dashboardSchema);

export default Dashboard;