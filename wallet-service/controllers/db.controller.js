const axios = require('axios');

class DBController {
  constructor() { }

  async getUserProfile(userId) {
    const response = await axios.get(`http://localhost:8484/users/${userId}`);
    return response.data;
  }

  async getUserWallets(userId) {
    const response = await axios.get(`http://localhost:8484/wallets/?userId=${userId}`);
    const wallets = response.data;

    return wallets.map(wallet => ({
      walletId: wallet.id,
      currencyId: wallet.currencyId,
      amount: wallet.amount
    }));
  }

  async getCurrencies() {
    const response = await axios.get(`http://localhost:8484/currencies/`);
    return response.data.map(currency => ({
      currencyId: currency.id,
      name: currency.name,
      value: currency.value
    }));
  }

  async topupWallet(userId, currency, amount) {
    // if (!this.isValidCurrency(currency)) {
    //   throw new Error(`Currency ${currency} is not valid`);
    // }

    // if (!this.isValidAmount(amount)) {
    //   throw new Error(`Amount ${amount} is not valid`);
    // }

    const currencyResponse = await axios.get(`http://localhost:8484/currencies/?name=${currency}`);
    const currencyId = currencyResponse.data[0].id;

    // Get wallet associated with currency
    const getWalletResponse = await axios.get(`http://localhost:8484/users/${userId}/wallets?currencyId=${currencyId}`);

    let walletId;

    if (getWalletResponse.data.length === 0) {
      const createWalletResponse = await axios.post(`http://localhost:8484/wallets`, {
        userId,
        currencyId,
        amount: 0
      });
      walletId = createWalletResponse.data.id;
    } else {
      walletId = getWalletResponse.data[0].id;
    }

    // Create a topup
    const topupResponse = await axios.post(`http://localhost:8484/topups/`, {
      userId,
      walletId,
      currency,
      amount
    });
    const topup = topupResponse.data;

    // Get wallet and update amount in wallet
    const walletResponse = await axios.get(`http://localhost:8484/wallets/${walletId}`);
    const wallet = walletResponse.data;
    const updatedAmount = wallet.amount + parseFloat(amount);
    await axios.patch(`http://localhost:8484/wallets/${walletId}`, {
      amount: updatedAmount
    });

    return topup;
  }

  async convert(
    userId,
    fromCurrencyId,
    toCurrencyId,
    type,
    fromAmount,
    toAmount
  ) {
    // Get wallet associated with currency
    const getWalletResponse = await axios.get(`http://localhost:8484/users/${userId}/wallets?currencyId=${fromCurrencyId}`);

    let walletId;

    if (getWalletResponse.data.length === 0) {
      const createWalletResponse = await axios.post(`http://localhost:8484/wallets`, {
        userId,
        fromCurrencyId,
        amount: 0
      });
      walletId = createWalletResponse.data.id;
    } else {
      walletId = getWalletResponse.data[0].id;
    }

    // Create a convert
    const convertResponse = await axios.post(`http://localhost:8484/converts/`, {
      userId,
      walletId,
      fromCurrencyId,
      toCurrencyId,
      type,
      fromAmount,
      toAmount
    });
    const convert = convertResponse.data;

    // Get source wallet and update amount
    const sourceWalletResponse = await axios.get(`http://localhost:8484/wallets/${walletId}`);
    const sourceWallet = sourceWalletResponse.data;

    if (sourceWallet.amount < parseFloat(fromAmount)) {
      throw new Error('Insufficient balance in wallet');
    }
    await axios.patch(`http://localhost:8484/wallets/${walletId}`, {
      amount: sourceWallet.amount - parseFloat(fromAmount)
    });

    // Get destination wallet and update amount
    const destinationWalletResponse = await axios.get(`http://localhost:8484/wallets/?userId=${userId}&currencyId=${toCurrencyId}&_limit=1`);
    const destinationWallet = destinationWalletResponse.data[0];
    await axios.patch(`http://localhost:8484/wallets/${destinationWallet.id}`, {
      amount: destinationWallet.amount + parseFloat(toAmount)
    });

    return convert;
  }
}

module.exports = new DBController();
