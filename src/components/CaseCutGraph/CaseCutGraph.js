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
      night: [],
      morningRef: 0,
      eveningRef: 0,
      nightRef: 0
    };
    this.getCaseCut = this.getCaseCut.bind(this);
    this.renderTables = this.renderTables.bind(this);
    this.morningRef = null;
    this.eveningRef = null;
    this.nightRef = null;
  }

  componentDidMount() {
    this.getCaseCut();
  }

  getCaseCut() {
    const onOk = function (response) {
      const morning = response.items[0].morning;
      const evening = response.items[1].evening;
      const night = response.items[2].night;
      localStorage.token = response.token; // eslint-disable-line
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
          {this.renderTables(
            morning,
            'Matutino',
            css.morningTable,
            'Matutino',
            'morningRef'
          )}

          {this.renderTables(
            evening,
            'Vespertino',
            css.eveningTable,
            'Vespertino',
            'eveningRef'
          )}

          {this.renderTables(
            night,
            'Nocturno',
            css.nightTable,
            'Nocturno',
            'nightRef'
          )}
        </div>
      </div>
    );
  }

  /*componentWillUpdate(nextProps, nextState) {
    console.log('Actualizando: ', this.morningRef.offsetWidth); //eslint-disabled-line
    return null;
  }*/
  /*
  componentDidUpdate(props, state) {
    //eslint-disable-next-line
    if (this.morningRef?.offsetWitdh) {
      console.log('Llamando', this.morningRef.offsetWitdh); //eslint-disabled-line
      this.setState({
        morningRef: this.morningRef.offsetWitdh //eslint-disabled-line
      });
    }
    //eslint-disable-next-line
    if (this.eveningRef?.offsetWitdh) {
      this.setState({
        eveningRef: this.eveningRef.offsetWitdh //eslint-disabled-line
      });
    }
    //eslint-disable-next-line
    if (this.nightRef?.offsetWitdh) {
      this.setState({
        nightRef: this.nightRef.offsetWitdh //eslint-disabled-line
      });
    }
  }
*/

  componentDidUpdate(prevProps, prevState) {
    //eslint-disable-next-line
    if (prevState.morningRef !== this.morningRef.offsetWidth) {
      this.setState({ morningRef: this.morningRef.offsetWidth }); //eslint-disabled-line
    }

    //eslint-disable-next-line
    if (prevState.eveningRef !== this.eveningRef.offsetWidth) {
      this.setState({ eveningRef: this.eveningRef.offsetWidth }); //eslint-disabled-line
    }

    //eslint-disable-next-line
    if (prevState.nightRef !== this.nightRef.offsetWidth) {
      this.setState({ nightRef: this.nightRef.offsetWidth }); //eslint-disabled-line
    }
  }
  renderTables(chunk, chunkName, turn = '', key, ref) {
    return (
      <div key={key} className={css.tableContainer}>
        <h3 className={css.chunkName}>{chunkName}</h3>

        <table
          className={`${css.cutTable} ${turn} ${
            this.state[ref] < 584 ? css.less : ''
          }`}
        >
          <thead className={`${css.tableHeaders} ${turn}`}>
            <tr>
              <th>T.I.</th>
              <th>Corte</th>
            </tr>
          </thead>
        </table>

        <Scroller
          focusableScrollbar
          vertical='auto'
          direction='vertical'
          style={{ minHeight: '65vh' }}
        >
          <div
            className={css.tableScroller}
            ref={div => {
              this[ref] = div;
              //console.log(div?.offsetWidth); //eslint-disable-line
              //this.setState({ [ref]: div?.offsetWidth || this.state[ref] }); //eslint-disable-line
            }}
          >
            <table className={`${css.cutTable} ${turn}`}>
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
