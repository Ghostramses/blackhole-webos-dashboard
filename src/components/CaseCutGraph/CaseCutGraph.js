import React, { Component } from 'react';
import { getCaseCutGraph } from '../../providers/api/requests';
import Scroller from '@enact/moonstone/Scroller';

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
  }

  componentDidMount() {
    this.getCaseCut();
  }

  getCaseCut() {
    getCaseCutGraph()
      .then(response => {
        const { morning } = response.items[0];
        const { evening } = response.items[1];
        const { night } = response.items[2];
        this.setState({ morning, evening, night });
      })
      .catch(e => console.error(e))
      .finally(() => {
        this.timeoutId = setTimeout(() => {
          this.getCaseCut();
        }, 1500);
      });
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
        <Scroller focusableScrollbar horizontalScrollbar='hidden'>
          <div className={css.tableScroller}>
            <table className={`${css.cutTable} ${turn}`}>
              <thead>
                <tr>
                  <th>T.I.</th>
                  <th>Corte</th>
                </tr>
              </thead>
              <tbody>
                {chunk.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.court}</td>
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
    clearTimeout(this.timeoutId);
  }
}
