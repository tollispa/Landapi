

const router = (app) => {
  app.get("/countries/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const country = countries.find((country) => country.id === id);
    if (!country) {
      return res.status(404).json({ message: "Landet kunde inte hittas" });
    }
    const { name, population, capital, language } = country;
    res.json({ name, population, capital, language });
  });

  // Middleware för att verifiera säkerhetskoden
  const verifySecurityCode = (req, res, next) => {
    const securityCode = req.headers["x-security-code"];
    if (!securityCode || securityCode !== "mySecurityCode") {
      return res.status(401).json({ message: "Ogiltig säkerhetskod" });
    }
    next();
  };



  app.post("/countries", verifySecurityCode, (req, res) => {
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
    const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      return res.status(400).json({ message: "Invalid keys in request body" });
    }
  
    // Check if there are too many keys
    if (receivedKeys.length > allowedKeys.length) {
      return res.status(400).json({ message: "Too many keys in request body" });
    }
  
    const id = countries.length + 1;
    const newCountry = { id, name, population, capital, language };
    countries.push(newCountry);
    res.status(201).json(newCountry);
  });

  // Route för att redigera information om ett land
  app.put("/countries/:id", verifySecurityCode, (req, res) => {
    const id = parseInt(req.params.id);
    const { name, population, capital, language } = req.body;
    const country = countries.find((country) => country.id === id);
    const receivedKeys = Object.keys(req.body);
    console.log(receivedKeys)
    // Kolla om land id existerar
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    if (receivedKeys.length > 4) {
      return res.status(400).json({ message: "Cant be more than 4 keys!" });
    }
    if (!name || !population || !capital || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
  
    // Kollar om population är en Int
    if (population !== undefined && isNaN(parseInt(population))) {
      return res.status(400).json({ message: "Population must be an integer" });
    }
  
    // 
    if (name !== undefined) {
      country.name = name;
    }
    if (population !== undefined) {
      country.population = population;
    }
    if (capital !== undefined) {
      country.capital = capital;
    }
    if (language !== undefined) {
      country.language = language;
    }
  
    res.json(country);
  });

  // Route för att ta bort ett land
  app.delete("/countries/:id", verifySecurityCode, (req, res) => {
    const id = parseInt(req.params.id);
    const index = countries.findIndex((country) => country.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Landet kunde inte hittas" });
    }
    countries.splice(index, 1);
    res.status(204).send();
  });
};

let countries = [
  {
    id: 1,
    name: "Sverige",
    population: 10000000,
    capital: "Stockholm",
    language: "svenska",
  },
  {
    id: 2,
    name: "Norge",
    population: 5000000,
    capital: "Oslo",
    language: "norska",
  },
  {
    id: 3,
    name: "Danmark",
    population: 6000000,
    capital: "Köpenhamn",
    language: "danska",
  },
];

module.exports = router;
