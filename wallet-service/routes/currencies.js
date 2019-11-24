const express = require('express');
const dbController = require('../controllers/db.controller');

const router = express.Router();

/**
 * @description Get list of currencies
 */
router.get('/lookup-values', async function (req, res, next) {
  try {
    const currencies = await dbController.getCurrencies();
    return res.json(currencies);
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});

/**
 * @description Get list of currencies
 */
router.get('/get-rate', async function (req, res, next) {
  const { fromCurrencyId, toCurrencyId } = req.query;

  if (!fromCurrencyId || !toCurrencyId) {
    return res.status(400).json({
      code: 400,
      message: 'Invalid from and to currencies selected'
    });
  }

  if (fromCurrencyId === toCurrencyId) {
    return res.json({
      rate: 1
    });
  }

  try {
    const currencies = await dbController.getCurrencies();
    const fromCurrency = currencies.find(currency => currency.currencyId == fromCurrencyId);
    const toCurrency = currencies.find(currency => currency.currencyId == toCurrencyId);
    const rate = ((toCurrency.value / fromCurrency.value)).toFixed(3);

    return res.json({ rate });
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});


module.exports = router;
