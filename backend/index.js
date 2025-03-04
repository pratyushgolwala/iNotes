const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend
  credentials: true, // Allow cookies and headers
};

// Connect to MongoDB
connectToMongo();

const app = express(); // Initialize app
const port = 5002;

app.use(cors(corsOptions));
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Start the server
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
