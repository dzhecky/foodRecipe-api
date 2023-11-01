require('dotenv').config();
const express = require('express');
const Router = require('./src/router');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));
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
