import React, { Component } from 'react';
import { Result } from 'antd';

class ResultWrapper extends Component {
  render() {
    const { status, title, subTitle } = this.props;
    return <Result
      status={status}
      title={title}
      subTitle={subTitle}
    />;
  }
}

export default ResultWrapper;
