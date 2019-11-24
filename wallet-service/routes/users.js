const express = require('express');
const dbController = require('../controllers/db.controller');

const router = express.Router();

/**
 * @description Get user profile by id
 */
router.get('/:id/profile', async function (req, res, next) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      code: 400,
      message: 'User id is required!'
    });
  }

  try {
    const userProfile = await dbController.getUserProfile(userId);
    return res.json(userProfile);
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});

/**
 * @description Get list of wallets for a user
 */
router.get('/:id/wallets', async function (req, res, next) {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({
      code: 400,
      message: 'User id is required!'
    });
  }

  try {
    const userWallets = await dbController.getUserWallets(userId);
    return res.json(userWallets);
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});

/**
 * @description Topup a wallet
 */
router.post('/:id/wallets/topup', async function (req, res, next) {
  const userId = req.params.id;
  const { currency, amount } = req.body;

  if (!userId || !currency || !amount) {
    return res.status(400).json({
      code: 400,
      message: 'User id, currency and amount are required!'
    });
  }

  try {
    const topup = await dbController.topupWallet(userId, currency, amount);
    return res.json({
      topupId: topup.id
    });
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});

/**
 * @description Topup a wallet
 */
router.post('/:id/wallets/convert', async function (req, res, next) {
  const userId = req.params.id;
  const { fromCurrencyId, toCurrencyId, type, fromAmount, toAmount } = req.body;

  if (
    !userId
    || !fromCurrencyId
    || !type
    || !fromAmount
    || !toAmount
  ) {
    return res.status(400).json({
      code: 400,
      message: 'User id, currency ids, type and amounts are required!'
    });
  }

  try {
    const convert = await dbController.convert(
      userId,
      fromCurrencyId,
      toCurrencyId,
      type,
      fromAmount,
      toAmount
    );
    return res.json({
      convertMoneyId: convert.id
    });
  } catch (e) {
    return res.status(500).json({ message: e.message, code: e.code });
  }
});

module.exports = router;
