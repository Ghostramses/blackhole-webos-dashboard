import React, { Component } from 'react';
import { Panel } from '@enact/moonstone/Panels';
//import css from './DashboardPanel.less';
import Button from '@enact/moonstone/Button';
import Notification from '@enact/moonstone/Notification';
import io from 'socket.io-client';
import { logout } from '../../providers/api/requests';
import EventsGraph from '../../components/EventsGraph';
import CaseCutGraph from '../../components/CaseCutGraph';
import { config } from '../../providers/config';

class DashboardPanel extends Component {
  constructor(props) {
    super(props);
    this.closeSession = this.closeSession.bind(this);
    this.cancelCloseSession = this.cancelCloseSession.bind(this);
  }

  componentDidMount() {
    const { onChangeIndex } = this.props;
    const tokenBefore = localStorage.token; // eslint-disable-line
    this.socket = io(`${config.socket.url}/session?token=${tokenBefore}`, {
      path: config.socket.path,
      forceNew: true
    });

    this.socket.on('alreadyLogged', ({ token }) => {
      if (token === tokenBefore) {
        localStorage.token = undefined; //eslint-disable-line
        onChangeIndex(0);
      }
    });
  }

  closeSession() {
    const { onChangeIndex, onShowCloseNotification } = this.props;
    logout()
      .then(() => {
        onShowCloseNotification(false);
        localStorage.token = undefined; // eslint-disable-line
        localStorage.perms = undefined; //eslint-disable-line
        onChangeIndex(0);
      })
      .catch(e => {
        console.error(e);
      });
  }
  cancelCloseSession() {
    const { onShowCloseNotification } = this.props;
    onShowCloseNotification(false);
  }

  render() {
    const { showCloseNotification, ...props } = this.props;

    return (
      <Panel {...props}>
        <Notification
          open={showCloseNotification}
          buttons={[
            <Button onClick={this.cancelCloseSession}>No</Button>,
            <Button onClick={this.closeSession}>Si</Button>
          ]}
        >
          ¿Está seguro que desea cerrar sesión?
        </Notification>
        <EventsGraph />
        <CaseCutGraph />
      </Panel>
    );
  }

  componentWillUnmount() {
    try {
      this.socket.close();
    } catch (e) {
      console.log('Error al desconectar el socket');
      console.error(e);
    }
  }
}

export default DashboardPanel;
