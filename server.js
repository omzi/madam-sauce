const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config()
const app = express();

const PORT = process.env.PORT || 5500

app.listen(PORT, () => {
  console.log(':>>'.green.bold, `Server running in ${process.env.NODE_ENV} mode on port`.yellow.bold, `${PORT}`.blue.bold)
})