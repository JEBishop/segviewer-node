'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send(process.env.NODE_ENV);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);








