const express = require('express');
const pkg = require('../package.json');

const router = express.Router();

function healthValue() {
  return ['name', 'version'].reduce((acc, key) => {
    acc[key] = pkg[key];
    return acc;
  }, {});
};

router.get('/health', (req, res) => {
  res.json(healthValue(req.query));
});

module.exports = router;
