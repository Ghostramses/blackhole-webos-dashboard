import React from 'react';
import kind from '@enact/core/kind';
import { Panel } from '@enact/moonstone/Panels';
import css from './DashboardPanel.less';
import Button from '@enact/moonstone/Button';
import Notification from '@enact/moonstone/Notification';
import { logout } from '../../providers/api/requests';
import EventsGraph from '../../components/EventsGraph';
import CaseCutGraph from '../../components/CaseCutGraph';

const DashboardPanel = kind({
  name: 'DashboardPanel',
  styles: {
    css,
    className: 'dashboard'
  },
  handlers: {
    closeSession: (ev, { onChangeIndex, onShowCloseNotification }) => {
      logout()
        .then(() => {
          onShowCloseNotification({ showCloseNotification: false });
          localStorage.token = undefined; // eslint-disable-line
          onChangeIndex(0);
        })
        .catch(e => {
          console.error(e);
        });
    },
    cancelCloseSession: (ev, { onShowCloseNotification }) => {
      onShowCloseNotification({ showCloseNotification: false });
    }
  },
  render: ({
    showCloseNotification,
    cancelCloseSession,
    closeSession,
    ...props
  }) => (
    <Panel {...props}>
      <Notification
        open={showCloseNotification}
        buttons={[
          <Button onClick={cancelCloseSession}>No</Button>,
          <Button onClick={closeSession}>Si</Button>
        ]}
      >
        ¿Está seguro que desea cerrar sesión?
      </Notification>
      <EventsGraph />
      <CaseCutGraph />
    </Panel>
  )
});

export default DashboardPanel;
