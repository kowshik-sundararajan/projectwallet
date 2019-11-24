import React, { Component } from 'react';
import {Skeleton } from 'antd';
import User from './User';
import Wallet from './Wallet';

class Profile extends Component {
  render() {
    return (
      <div>
          {
            this.props.profileLoader
              ? <Skeleton active />
              : <User profile={this.props.profile} />
          }

          {
            this.props.walletsLoader
              ? <Skeleton active />
              : <Wallet
                wallets={this.props.wallets}
                currencies={this.props.currencies}
              />
          }
      </div>
    );
  }
}

export default Profile;
