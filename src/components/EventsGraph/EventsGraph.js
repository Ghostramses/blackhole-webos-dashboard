import React, { Component } from 'react';
import Counter from '../Counter';
import { Job } from '@enact/core/util';
import { config } from '../../providers/config';

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
    const onOk = function (response) {
      const { discarded, in_follow_up_evidences, not_relevant, relevant } =
        response.items[0];
      this.setState({
        relevant,
        unrelevant: not_relevant,
        following: in_follow_up_evidences,
        trash: discarded
      });
    }.bind(this);
    const onCallback = function () {
      this.getEvents();
    }.bind(this);
    const job = new Job(onCallback, 1500);
    const onFinally = function () {
      job.start();
    };
    const xhr = new XMLHttpRequest(); //eslint-disable-line
    xhr.open('GET', config.mainBackendUrl + '/events_graph');
    xhr.setRequestHeader('token', localStorage.token); //eslint-disable-line
    xhr.onreadystatechange = function () {
      //eslint-disable-next-line
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(this.response);
        onOk(response);
        onFinally();
      } else {
        onFinally();
      }
    };
    xhr.onerror = function () {
      onFinally();
    };
    xhr.ontimeout = function () {
      onFinally();
    };
    xhr.send();
  }

  getAliveEvents() {
    const onOk = function (response) {
      const [unclassified, alive] = response.items;
      this.setState({
        noClassified: unclassified.total,
        alive: alive.total
      });
    }.bind(this);
    const onCallback = function () {
      this.getAliveEvents();
    }.bind(this);
    const job = new Job(onCallback, 1500);
    const onFinally = function () {
      job.start();
    };
    const xhr = new XMLHttpRequest(); //eslint-disable-line
    xhr.open('GET', config.mainBackendUrl + '/events_graph/hard');
    xhr.setRequestHeader('token', localStorage.token); //eslint-disable-line
    xhr.onreadystatechange = function () {
      //eslint-disable-next-line
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(this.response);
        onOk(response);
        onFinally();
      } else {
        onFinally();
      }
    };
    xhr.onerror = function () {
      onFinally();
    };
    xhr.ontimeout = function () {
      onFinally();
    };
    xhr.send();
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
