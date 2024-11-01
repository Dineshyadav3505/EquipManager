import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/dataConnection.js';
import { app } from './app.js';

dotenv.config({
  path: './.env',

});

connectToDatabase()
 .then(() => {
    const port = process.env.PORT || 3000; // Default port if environment variable is not set
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
 .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with a non-zero status code to indicate an error
  });

app.on('error', (error) => {
  console.error("Server error:", error);
  process.exit(1); // Exit the process with a non-zero status code to indicate an error
});