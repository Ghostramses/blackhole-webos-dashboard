import React, { Component } from 'react';
import Scroller from '@enact/moonstone/Scroller';
import { Job } from '@enact/core/util';
import { config } from '../../providers/config';

import css from './CaseCutGraph.less';

export default class CaseCutGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      morning: [],
      evening: [],
      night: []
    };
    this.getCaseCut = this.getCaseCut.bind(this);
    this.renderTables = this.renderTables.bind(this);
  }

  componentDidMount() {
    this.getCaseCut();
  }

  getCaseCut() {
    const onOk = function (response) {
      const morning = response.items[0].morning;
      const evening = response.items[1].evening;
      const night = response.items[2].night;
      this.setState({ morning, evening, night });
    }.bind(this);
    const onCallback = function () {
      this.getCaseCut();
    }.bind(this);
    const job = new Job(onCallback, 1500);
    this.caseCutGraphJob = job;
    const onFinally = function () {
      job.start();
    };
    const xhr = new XMLHttpRequest(); //eslint-disable-line
    this.caseCutGraphXhr = xhr;
    xhr.open('GET', config.mainBackendUrl + '/case_cut_graph');
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
    const { morning, evening, night } = this.state;
    return (
      <div>
        <div className={css.caseCutGraph}>
          {this.renderTables(morning, 'Matutino', css.morningTable, 'Matutino')}

          {this.renderTables(
            evening,
            'Vespertino',
            css.eveningTable,
            'Vespertino'
          )}

          {this.renderTables(night, 'Nocturno', css.nightTable, 'Nocturno')}
        </div>
      </div>
    );
  }

  renderTables(chunk, chunkName, turn = '', key) {
    return (
      <div key={key} className={css.tableContainer}>
        <h3 className={css.chunkName}>{chunkName}</h3>
        <Scroller
          focusableScrollbar
          vertical='auto'
          direction='vertical'
          style={{ minHeight: '57vh' }}
        >
          <div className={css.tableScroller}>
            <table className={`${css.cutTable} ${turn}`}>
              <thead>
                <tr>
                  <th>T.I.</th>
                  <th style={{ maxWidth: '200px' }}>Corte</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td
                      style={{
                        maxWidth: '200px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal'
                      }}
                    >
                      {item.court}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Scroller>
      </div>
    );
  }

  componentWillUnmount() {
    try {
      this.caseCutGraphXhr.abort();
    } catch (e) {
      console.error(e);
    }
    try {
      this.caseCutGraphJob.stop();
    } catch (e) {
      console.error(e);
    }
  }
}
