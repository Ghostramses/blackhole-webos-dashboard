import React from 'react';
import kind from '@enact/core/kind';
import { Panel, Header } from '@enact/moonstone/Panels';
import css from './DashboardPanel.less';
//import Changeable from '@enact/ui/Changeable';
import Button from '@enact/moonstone/Button';
import Notification from '@enact/moonstone/Notification';
import { logout } from '../../providers/api/requests/auth';

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
      {console.log({ showCloseNotification, props })}
      <Header title='Esta es una prueba ' />
      <Notification
        open={showCloseNotification}
        buttons={[
          <Button onClick={cancelCloseSession}>No</Button>,
          <Button onClick={closeSession}>Si</Button>
        ]}
      >
        ¿Está seguro que desea cerrar sesión?
      </Notification>
    </Panel>
  )
});

export default DashboardPanel;
