const express = require("express");

const app = express();
const port = 4000;
const router = require("./routes");
const addCountry = require("./countriesRoute");

// Middleware för att parse request bodies
app.use(express.json());
// använder express.Router() för att importera addCountry från countriesRoute.js
app.use('/countries', addCountry); 
// använder router för att importera resten av routes från routes.js
router(app);

// Starta servern
app.listen(port, () => {
  console.log(`Servern lyssnar på http://localhost:${port}`);
});


// Middleware för att parse request bodies
