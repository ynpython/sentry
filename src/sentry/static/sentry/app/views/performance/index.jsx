import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styled from 'react-emotion';

import space from 'app/styles/space';

import GlobalSelectionHeader from 'app/components/organizations/globalSelectionHeader';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import withOrganization from 'app/utils/withOrganization';
import withTeamsForUser from 'app/utils/withTeamsForUser';
import AsyncView from 'app/views/asyncView';
import SentryTypes from 'app/sentryTypes';
import NoProjectMessage from 'app/components/noProjectMessage';
import PageHeading from 'app/components/pageHeading';
import Pagination from 'app/components/pagination';
import {PageContent, PageHeader} from 'app/styles/organization';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';

const Layout = styled('div')`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  grid-column-gap: ${space(1.5)};
  width: 100%;
  align-items: center;
  grid-template-areas: 'project-name errors rpm p95 p99 apdex';

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    grid-template-columns: 5fr 1fr;
    grid-template-areas: 'project-name errors';
  }
`;

const ProjectColumn = styled('div')`
  grid-area: project-name;
  overflow: hidden;
`;

const P95Column = styled('div')`
  grid-area: p95;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const P99Column = styled('div')`
  grid-area: p99;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const ApdexColumn = styled('div')`
  grid-area: apdex;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const RpmColumn = styled('div')`
  grid-area: rpm;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const ErrorsColumn = styled('div')`
  grid-area: errors;
  text-align: right;
`;

class PerformanceContainer extends AsyncView {
  static propTypes = {
    organization: SentryTypes.Organization,
    teams: PropTypes.array,
  };

  getTitle() {
    return 'Performance';
  }

  getEndpoints() {
    const {organization} = this.props;
    return [
      [
        'results',
        `/organizations/${
          organization.slug
        }/eventsv2/?statsPeriod=14d&field=project&field=count(id)&field=p95&field=p99&field=apdex&sort=p99&per_page=50&query=event.type%3Atransaction`,
      ],
    ];
  }

  renderStreamBody() {
    const {organization} = this.props;
    // TODO(dcramer): major issue here is that we always need to show all projects
    // even when there is no data for them
    return this.state.results.data.map(row => {
      return (
        <PanelItem key={row.project}>
          <Layout>
            <ProjectColumn>
              <Link
                to={`/organizations/${organization.slug}/performance/${row.project}/`}
              >
                {row.project}
              </Link>
            </ProjectColumn>
            <ErrorsColumn>{''}</ErrorsColumn>
            <RpmColumn>{row.rpm || ''}</RpmColumn>
            <P95Column>{row.p95}</P95Column>
            <P99Column>{row.p99}</P99Column>
            <ApdexColumn>{row.apdex}</ApdexColumn>
          </Layout>
        </PanelItem>
      );
    });
  }

  renderBody() {
    const {organization} = this.props;
    return (
      <React.Fragment>
        <GlobalSelectionHeader organization={organization} />
        <PageContent>
          <NoProjectMessage organization={organization}>
            <PageHeader>
              <PageHeading>{t('Performance')}</PageHeading>
            </PageHeader>
            <div>
              <Panel>
                <PanelHeader>
                  <Layout>
                    <ProjectColumn>{t('Project')}</ProjectColumn>
                    <ErrorsColumn>{t('Errors')}</ErrorsColumn>
                    <RpmColumn>{t('RPM')}</RpmColumn>
                    <P95Column>{t('p95')}</P95Column>
                    <P99Column>{t('p99')}</P99Column>
                    <ApdexColumn>{t('Apdex')}</ApdexColumn>
                  </Layout>
                </PanelHeader>
                <PanelBody>{this.renderStreamBody()}</PanelBody>
              </Panel>
              <Pagination pageLinks={this.state.resultsPageLinks} />
            </div>
          </NoProjectMessage>
        </PageContent>
      </React.Fragment>
    );
  }
}

export default withGlobalSelection(
  withOrganization(withTeamsForUser(PerformanceContainer))
);
export {PerformanceContainer};
