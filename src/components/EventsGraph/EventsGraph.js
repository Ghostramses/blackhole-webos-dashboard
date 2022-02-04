import React, { Component } from 'react';
import Counter from '../Counter';
import {
  getLiveEventsGraph,
  getTotalEventsGraph
} from '../../providers/api/requests';

import css from './EventsGraph.less';

export default class EventsGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: 0,
      noClassified: 0,
      relevant: 0,
      unrelevant: 0,
      following: 0,
      trash: 0
    };

    this.getEvents = this.getEvents.bind(this);
    this.getAliveEvents = this.getAliveEvents.bind(this);
  }

  componentDidMount() {
    this.getEvents();
    this.getAliveEvents();
  }

  getEvents() {
    getTotalEventsGraph()
      .then(response => {
        const { discarded, in_follow_up_evidences, not_relevant, relevant } =
          response.items[0];
        this.setState({
          relevant,
          unrelevant: not_relevant,
          following: in_follow_up_evidences,
          trash: discarded
        });
      })
      .catch(e => console.error(e))
      .finally(() => {
        this.timeoutIdClassificatedEvents = setTimeout(() => {
          this.getEvents();
        }, 1500);
      });
  }

  getAliveEvents() {
    getLiveEventsGraph()
      .then(response => {
        const [unclassified, alive] = response.items;
        this.setState({
          noClassified: unclassified.total,
          alive: alive.total
        });
      })
      .catch(e => console.error(e))
      .finally(() => {
        this.timeoutIdAliveEvents = setTimeout(() => {
          this.getAliveEvents();
        }, 1500);
      });
  }

  render() {
    const { alive, noClassified, relevant, unrelevant, following, trash } =
      this.state;
    return (
      <div {...this.props} className={css.eventsGraph}>
        <Counter title='En vivo' icon='alive' counter={alive} color='red' />
        <Counter
          title='Sin Clasificar'
          icon='noClassified'
          counter={noClassified}
          color='yellow'
        />
        <Counter
          title='Relevante'
          icon='relevant'
          counter={relevant}
          color='green'
        />
        <Counter
          title='No relevante'
          icon='unrelevant'
          counter={unrelevant}
          color='orange'
        />
        <Counter
          title='Seguimiento'
          icon='following'
          counter={following}
          color='blue'
        />
        <Counter title='Descartado' icon='trash' counter={trash} color='gray' />
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutIdClassificatedEvents);
    clearTimeout(this.timeoutIdAliveEvents);
  }
}
