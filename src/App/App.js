import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import Panels from '@enact/moonstone/Panels';
import React, { Component } from 'react';

import MainPanel from '../views/MainPanel';
import DashboardPanel from '../views/DashboardPanel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      showCloseNotification: false
    };
    this.onChangeIndex = this.onChangeIndex.bind(this);
    this.onCloseAttemp = this.onCloseAttemp.bind(this);
    this.onShowCloseNotificationChange =
      this.onShowCloseNotificationChange.bind(this);
  }

  onChangeIndex(index) {
    this.setState({ index });
  }
  onShowCloseNotificationChange(showCloseNotification) {
    this.setState({ showCloseNotification });
  }

  onCloseAttemp() {
    if (this.state.index === 1) this.onShowCloseNotificationChange(true);
  }

  render() {
    return (
      <div {...this.props}>
        <Panels
          index={this.state.index}
          onBack={this.onCloseAttemp}
          onApplicationClose={this.onCloseAttemp}
        >
          <MainPanel onChangeIndex={this.onChangeIndex} />
          <DashboardPanel
            onChangeIndex={this.onChangeIndex}
            showCloseNotification={this.state.showCloseNotification}
            onShowCloseNotification={this.onShowCloseNotificationChange}
          />
        </Panels>
      </div>
    );
  }
}

export default MoonstoneDecorator(App);
