import React, { Component } from 'react';
import axios from 'axios';
import { InputNumber, message, Select, Button, Divider, Card, Statistic } from 'antd';
import ResultWrapper from './Result';

const { Option } = Select;

class Convert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSuccess: false,
      showFailure: false,
      fromAmount: 0,
      toAmount: 0,
      getRate: false,
      rate: 1,
      fromCurrency: props.currencies[0] || {},
      toCurrency: props.currencies[0] || {}
    };
  }

  getRate() {
    const fromCurrencyId = this.props.currencies.find(currency => currency.name === this.state.fromCurrency.name).currencyId;
    const toCurrencyId = this.props.currencies.find(currency => currency.name === this.state.toCurrency.name).currencyId;

    if (fromCurrencyId === toCurrencyId) {
      return this.setState({
        rate: 1,
        getRate: false
      });
    }

    axios.get(`http://localhost:9000/currencies/get-rate?fromCurrencyId=${fromCurrencyId}&toCurrencyId=${toCurrencyId}`).then((rateResponse) => {
      if (this.state.getRate) {
        this.setState({
          rate: rateResponse.data.rate,
          getRate: false
        });
      }
    });
  }

  renderRate() {
    if (this.state.getRate) {
      this.getRate();
    }

    return <div>
      <Card>
        <Statistic
          title={this.state.fromCurrency.name}
          value={1}
          precision={3}
        />
      </Card>
      <Card>
        <Statistic
          title={this.state.toCurrency.name}
          value={this.state.rate}
          precision={3}
        />
      </Card>
    </div>
  }

  onFromAmountChange = (value) => {
    if (value <= 0) {
      message.warning('Amount must be greater than 0', 1);
      return;
    }

    this.setState({
      fromAmount: value,
      toAmount: value * this.state.rate
    });
  }

  onToAmountChange = (value) => {
    if (value <= 0) {
      message.warning('Amount must be greater than 0', 1);
      return;
    }

    this.setState({
      toAmount: value,
      fromAmount: value * this.state.rate
    });
  }

  onFromCurrencyChange = (value) => {
    const updatedCurrency = this.props.currencies.find((currency) => currency.name === value);

    this.setState({
      fromCurrency: updatedCurrency,
      toAmount: this.state.fromAmount * this.state.rate,
      getRate: true
    });
  }

  onToCurrencyChange = (value) => {
    const updatedCurrency = this.props.currencies.find((currency) => currency.name === value);

    this.setState({
      toCurrency: updatedCurrency,
      fromAmount: this.state.toAmount * this.state.rate,
      getRate: true
    });
  }

  handleConvert = () => {
    const { fromAmount, toAmount, fromCurrency, toCurrency } = this.state;

    axios.post(`http://localhost:9000/users/1/wallets/convert`, {
      fromCurrencyId: fromCurrency.currencyId,
      toCurrencyId: toCurrency.currencyId,
      type: 'FROM',
      fromAmount,
      toAmount
    })
      .then((convertResponse) => {
        const { convertId } = convertResponse.data;
        this.setState({
          showSuccess: true,
          convertId,
          showFailure: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          showFailure: true,
          showSuccess: false,
        });
      });
  }

  renderCurrencies() {
    return this.props.currencies.map((currency, index) => <Option value={currency.name} key={index}>{currency.name}</Option>);
  }

  renderFailure() {
    return <ResultWrapper
      status="error"
      title="Failed to convert money :("
      subTitle=""
    />
  }

  renderSuccess(convertId) {
    return <ResultWrapper
      status="success"
      title="Successfully converted money!"
      subTitle={convertId ? `Convert ID: ${convertId}` : ''}
    />
  }

  renderConvertForm() {
    const { fromCurrency, toCurrency, fromAmount, toAmount } = this.state;

    return <div>
      <p>From: </p>
      <Select
        size="large"
        value={fromCurrency.name}
        style={{ width: 120, margin: 8 }}
        onChange={this.onFromCurrencyChange}
      >
        {this.renderCurrencies()}
      </Select>

      <InputNumber
        autoFocus
        size="large"
        value={fromAmount}
        min={0}
        style={{ margin: 8 }}
        precision={3}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        onChange={this.onFromAmountChange}
      />

      <Divider />

      {this.renderRate()}

      <Divider />

      <p>To: </p>
      <Select
        size="large"
        value={toCurrency.name}
        style={{ width: 120, margin: 8 }}
        onChange={this.onToCurrencyChange}
      >
        {this.renderCurrencies()}
      </Select>

      <InputNumber
        autoFocus
        size="large"
        value={toAmount}
        min={0}
        style={{ margin: 8 }}
        precision={3}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        onChange={this.onToAmountChange}
      />

      <Button
        type="primary"
        size="large"
        style={{ margin: 12 }}
        onClick={this.handleConvert}
      >
        Convert money!
      </Button>
    </div>;
  }

  render() {
    return <div>
      {this.state.showSuccess && this.renderSuccess(this.state.convertId) && this.props.updateWalletsData()}

      {this.state.showFailure && this.renderFailure()}

      {!this.state.showSuccess && !this.state.showFailure && this.renderConvertForm()}
    </div>

  }
}

export default Convert;
