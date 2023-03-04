const express = require("express");
const addCountry = express.Router();
const {countries} = require("./db");


addCountry.post("/", (req, res) => {
  console.log(countries);
  // console.log(req.body);
  const { name, population, capital, language } = req.body;

  // Check if required fields are present
  if (!name || !population || !capital || !language) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if population is a valid integer
  if (isNaN(parseInt(population))) {
    return res.status(400).json({ message: "Population must be an integer" });
  }

  const allowedKeys = ["name", "population", "capital", "language"];

  // Check if there are any invalid keys
  const receivedKeys = Object.keys(req.body);
  const invalidKeys = receivedKeys.filter(
    (key) => !allowedKeys.includes(key)
  );
  if (invalidKeys.length > 0) {
    return res.status(400).json({ message: "Invalid keys in request body" });
  }

  // Check if there are too many keys
  if (receivedKeys.length > allowedKeys.length) {
    return res
      .status(400)
      .json({ message: "Too many keys in request body" });
  }

  const id = countries.length + 1;
  const newCountry = { id, name, population, capital, language };
  countries.push(newCountry);
  res.status(201).json(newCountry);
});

module.exports = addCountry;
