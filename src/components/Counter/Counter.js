import kind from '@enact/core/kind';
import React from 'react';
import LiveTvIcon from '../../../resources/svg/live_tv.svg';
import DeleteIcon from '../../../resources/svg/delete.svg';
import EventAvailableIcon from '../../../resources/svg/event_available.svg';
import EventBusyIcon from '../../../resources/svg/event_busy.svg';
import EventIcon from '../../../resources/svg/event.svg';
import LocationSearchingIcon from '../../../resources/svg/location_searching.svg';

import css from './Counter.less';

const icons = {
  alive: LiveTvIcon,
  trash: DeleteIcon,
  relevant: EventAvailableIcon,
  unrelevant: EventBusyIcon,
  noClassified: EventIcon,
  following: LocationSearchingIcon
};

const Counter = kind({
  styles: { css, className: 'container' },

  computed: {
    containerClassname: ({ color }) => `${css.container} ${css[color]}`,
    icon: ({ icon }) => icons[icon]
  },

  render: ({ title, counter, containerClassname, icon, ...props }) => (
    <div {...props} className={containerClassname}>
      <img src={icon} className={css.icon} />
      <h3 className={css.title}>{title}</h3>
      <p className={css.counter}>{counter}</p>
    </div>
  )
});

export default Counter;
