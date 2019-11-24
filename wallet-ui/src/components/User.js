import React, { Component } from 'react';
import { Card, Avatar } from 'antd';

const { Meta } = Card;

class User extends Component {
  render() {
    return <Card
      style={{ width: 300, marginTop: 16, marginBottom: 16 }}
    >
      <Meta
        avatar={
          <Avatar src="https://www.pngkey.com/png/detail/308-3081138_contact-avatar-generic.png" />
        }
        title={this.props.profile.name}
        description={`User ID: ${this.props.profile.id}`}
      />
    </Card>
  }
}

export default User;
