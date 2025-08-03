require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Intern = require('../models/Intern');
const Reward = require('../models/Reward');
const { generateReferralCode } = require('../utils/generateReferralCode');

const internsSeed = [
  { name: "John Doe", email: "john.doe@example.com", department: "Marketing", referralCode: generateReferralCode("John Doe"), donationsRaised: 2500, joinDate: "2025-01-15" },
  { name: "Jane Smith", email: "jane.smith@example.com", department: "Development", referralCode: generateReferralCode("Jane Smith"), donationsRaised: 3200, joinDate: "2025-01-10" },
  { name: "Mike Johnson", email: "mike.johnson@example.com", department: "Design", referralCode: generateReferralCode("Mike Johnson"), donationsRaised: 1800, joinDate: "2025-01-20" },
  { name: "Sarah Wilson", email: "sarah.wilson@example.com", department: "Operations", referralCode: generateReferralCode("Sarah Wilson"), donationsRaised: 2900, joinDate: "2025-01-12" },
  { name: "David Brown", email: "david.brown@example.com", department: "Sales", referralCode: generateReferralCode("David Brown"), donationsRaised: 2100, joinDate: "2025-01-18" },
];

const rewardsSeed = [
  { title: "Bronze Achiever", description: "Raised $1000 in donations", threshold: 1000, icon: "🥉" },
  { title: "Silver Performer", description: "Raised $2000 in donations", threshold: 2000, icon: "🥈" },
  { title: "Gold Star", description: "Raised $3000+ in donations", threshold: 3000, icon: "🥇" },
  { title: "Team Player", description: "Completed first month", threshold: 0, icon: "👥" },
];

const seed = async () => {
  await connectDB();
  await Intern.deleteMany();
  await Reward.deleteMany();
  await Intern.insertMany(internsSeed);
  await Reward.insertMany(rewardsSeed);
  console.log("✅ Seeded Interns and Rewards!");
  mongoose.disconnect();
};

seed();
