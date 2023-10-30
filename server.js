require('dotenv').config();
const express = require('express');
const Router = require('./src/router');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res, next) => {
  res.json({
    messaga: 'Succeess',
    data: `Server running on port ${PORT}`,
  });
});

app.use(Router);

app.listen(PORT, () => {
  console.log(`Server success running on port ${PORT}`);
});
