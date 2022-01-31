import kind from '@enact/core/kind';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import Panels from '@enact/moonstone/Panels';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import propTypes from 'prop-types';

import MainPanel from '../views/MainPanel';
import DashboardPanel from '../views/DashboardPanel';

import css from './App.less';

const App = kind({
  name: 'App',

  styles: {
    css,
    className: 'app'
  },
  props: {
    index: propTypes.number,
    onChangeIndex: propTypes.func,
    showCloseNotification: propTypes.bool,
    onShowCloseNotificationChange: propTypes.func
  },
  defaultProps: {
    index: 0,
    showCloseNotification: false
  },
  handlers: {
    onChangeIndex: (index, { onChangeIndex }) => {
      onChangeIndex({ index });
    },
    onCloseAttemp: (ev, { index, onShowCloseNotificationChange }) => {
      if (index === 1) {
        onShowCloseNotificationChange({ showCloseNotification: true });
      }
    }
  },

  render: ({
    index,
    onChangeIndex,
    showCloseNotification,
    onShowCloseNotificationChange,
    onCloseAttemp,
    ...props
  }) => (
    <div {...props}>
      <Panels
        index={index}
        onBack={onCloseAttemp}
        onApplicationClose={onCloseAttemp}
      >
        <MainPanel onChangeIndex={onChangeIndex} />
        <DashboardPanel
          onChangeIndex={onChangeIndex}
          showCloseNotification={showCloseNotification}
          onShowCloseNotification={onShowCloseNotificationChange}
        />
      </Panels>
    </div>
  )
});

export default MoonstoneDecorator(
  Changeable(
    {
      prop: 'index',
      change: 'onChangeIndex'
    },
    Changeable(
      {
        prop: 'showCloseNotification',
        change: 'onShowCloseNotificationChange'
      },
      App
    )
  )
);
