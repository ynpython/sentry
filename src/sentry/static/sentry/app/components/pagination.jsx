import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import {t} from 'app/locale';
import parseLinkHeader from 'app/utils/parseLinkHeader';

class Pagination extends React.Component {
  static propTypes = {
    pageLinks: PropTypes.string,
    to: PropTypes.string,
    onCursor: PropTypes.func,
  };

  static contextTypes = {
    location: PropTypes.object,
  };

  static defaultProps = {
    onCursor: (cursor, path, query) => {
      browserHistory.push({
        pathname: path,
        query: {...query, cursor},
      });
    },
  };

  render() {
    const {className, onCursor, pageLinks} = this.props;
    if (!pageLinks) {
      return null;
    }

    const location = this.context.location;
    const path = this.props.to || location.pathname;
    const query = location.query;

    const links = parseLinkHeader(pageLinks);

    let previousPageClassName = 'btn btn-default btn-lg prev';
    if (links.previous.results === false) {
      previousPageClassName += ' disabled';
    }

    let nextPageClassName = 'btn btn-default btn-lg next';
    if (links.next.results === false) {
      nextPageClassName += ' disabled';
    }

    return (
      <div className={className}>
        <div className="btn-group">
          <a
            onClick={() => {
              onCursor(links.previous.cursor, path, query, -1);
            }}
            className={previousPageClassName}
            disabled={links.previous.results === false}
          >
            <span title={t('Previous')} className="icon-arrow-left" />
          </a>
          <a
            onClick={() => {
              onCursor(links.next.cursor, path, query, 1);
            }}
            className={nextPageClassName}
            disabled={links.next.results === false}
          >
            <span title={t('Next')} className="icon-arrow-right" />
          </a>
        </div>
      </div>
    );
  }
}

export default styled(Pagination)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 20px 0 0 0;

  .icon-arrow-right,
  .icon-arrow-left {
    font-size: 20px !important;
  }
`;
