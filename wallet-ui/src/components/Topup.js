import React, { Component } from 'react';
import { InputNumber, message, Select, Button } from 'antd';
import axios from 'axios';
import ResultWrapper from './Result';

const { Option } = Select;

class Topup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSuccess: false,
      showFailure: false,
      amount: 0,
      currency: props.currencies[0].name || 'USD'
    };
  }

  onAmountChange = (value) => {
    if (value <= 0) {
      message.warning('Amount must be greater than 0', 1);
      return;
    }

    this.setState({ amount: value });
  }

  onCurrencyChange = (value) => {
    this.setState({ currency: value })
  }

  renderFailure() {
    return <ResultWrapper
      status="error"
      title="Failed to topup :("
      subTitle=""
    />
  }

  renderSuccess(topupId) {
    if (this.state.showSuccess) {
      return <ResultWrapper
      status="success"
      title="Successfully topped up!"
      subTitle={topupId ? `Topup ID: ${topupId}` : ''}
    />
    }

    return '';
  }

  handleTopup = () => {
    const { amount, currency } = this.state;

    axios.post('http://localhost:9000/users/1/wallets/topup', {
      amount,
      currency
    })
      .then((topupResponse) => {
        const { topupId } = topupResponse.data;
        this.setState({
          showSuccess: true,
          topupId,
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

  renderTopupForm() {
    return <div>
      <Select
        size="large"
        value={this.state.currency}
        style={{ width: 120, margin: 8 }}
        onChange={this.onCurrencyChange}
      >
        {this.renderCurrencies()}
      </Select>

      <InputNumber
        autoFocus
        size="large"
        defaultValue={0}
        min={0}
        style={{ margin: 8 }}
        precision={3}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        onChange={this.onAmountChange}
      />

      <Button
        type="primary"
        size="large"
        style={{ margin: 12 }}
        onClick={this.handleTopup}
      >
        Topup!
      </Button>
    </div>;
  }

  render() {
    return <div>
      {this.renderSuccess(this.state.topupId)}

      {this.state.showFailure && this.renderFailure()}

      {!this.state.showSuccess && !this.state.showFailure && this.renderTopupForm()}
    </div>
  }
}

export default Topup;
