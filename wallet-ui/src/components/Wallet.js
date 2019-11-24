import React, { Component } from 'react';
import { List, Card } from 'antd';

class Wallet extends Component {
  render() {
    return <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={this.props.wallets}
      renderItem={item => (
        <List.Item>
          <Card title={`Wallet ID: ${item.walletId}`}>
            <p>{`Balance: ${item.amount} ${this.props.currencies.find(currency => currency.currencyId === item.currencyId).name}`}</p>
          </Card>
        </List.Item>
      )}
    />
  }
}

export default Wallet;
