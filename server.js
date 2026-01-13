const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("YOUR_MONGODB_URL");

const User = mongoose.model("User", {
  username: String,
  password: String,
  balance: Number
});

app.post("/register", async (req,res)=>{
  const u = new User({
    username: req.body.username,
    password: req.body.password,
    balance: 1000
  });
  await u.save();
  res.json({success:true});
});

app.post("/login", async (req,res)=>{
  const u = await User.findOne(req.body);
  res.json(u);
});

app.post("/spin", async (req,res)=>{
  const u = await User.findOne({username:req.body.username});
  if(!u) return res.json({error:"No user"});

  u.balance -= 50;
  let win = Math.random() < 0.3 ? 200 : 0;
  u.balance += win;
  await u.save();

  res.json({win, balance:u.balance});
});

app.listen(3000);
