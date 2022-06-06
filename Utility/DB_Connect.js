const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("-".repeat(38).yellow);
    console.log(`[✔] Database Connected.`.green);
    console.log("-".repeat(38).yellow);
  } catch (err) {
    console.log(`[×] Failed To Connect Database\n`.red, err);
    console.log("-".repeat(38).yellow);
    console.log(err.toString().yellow);
    console.log("-".repeat(38).yellow);
  }
};
