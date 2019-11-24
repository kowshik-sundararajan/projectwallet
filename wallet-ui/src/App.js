import React, { Component } from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import { Layout, Menu, message } from 'antd';
import Profile from './components/Profile';
import Topup from './components/Topup';
import Convert from './components/Convert';
const { Header, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Profile',
      profileLoader: true,
      walletsLoader: true,
      profile: {},
      currencies: [],
      wallets: []
    }
  }

  getProfileData() {
    return axios.get('http://localhost:9000/users/1/profile');
  }

  getCurrenciesData() {
    return axios.get('http://localhost:9000/currencies/lookup-values');
  }

  getWalletsData() {
    return axios.get('http://localhost:9000/users/1/wallets');
  }

  componentDidMount() {
    message.success('Logged in successfully', 1)
      .then(() => Promise.all([
        this.getProfileData(),
        this.getCurrenciesData()
      ]).then(([profileResponse, currenciesResponse]) => {
        this.setState({
          profile: profileResponse.data,
          currencies: currenciesResponse.data,
          profileLoader: false
        });
      }))
      .then(() => {
        this.getWalletsData()
          .then((walletsResponse) => {
            this.setState({
              wallets: walletsResponse.data,
              walletsLoader: false
            });
          })
      });
  }

  updateWalletsData = () => {
    this.getWalletsData()
    .then((walletsResponse) => {
      this.setState({
        wallets: walletsResponse.data,
        walletsLoader: false
      });
    })
  }

  toggleTabs = (e) => {
    this.setState({
      currentTab: e.key
    });
  }

  renderTab(tabName) {
    switch (tabName) {
      case 'Topup':
        return <Topup currencies={this.state.currencies} />;
      case 'Convert':
        return <Convert updateWalletsData={this.updateWalletsData} currencies={this.state.currencies} />;
      case 'Profile':
      default:
        return <Profile
          profileLoader={this.state.profileLoader}
          profile={this.state.profile}
          currencies={this.state.currencies}
          wallets={this.state.wallets}
          walletsLoader={this.state.walletsLoader}
        />;
    }
  }

  render() {
    return (
      <Layout className="layout" style={{ height: '100vh' }}>
        <Header>
          <div className="logo" />
          <Menu
            onClick={this.toggleTabs}
            theme="dark"
            mode="horizontal"
            selectedKeys={[this.state.currentTab]}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="Profile">Profile</Menu.Item>
            <Menu.Item key="Topup">Topup</Menu.Item>
            <Menu.Item key="Convert">Convert Money</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ background: '#fff', padding: 24, height: '100vh' }}>
          {this.renderTab(this.state.currentTab)}
        </Content>
      </Layout>
    );
  }
}

export default App;
