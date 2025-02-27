import {IncidentTrigger} from './incidentTrigger';

export function IncidentRule(params) {
  return {
    status: 0,
    dateAdded: '2019-07-31T23:02:02.731Z',
    dataset: 'events',
    query: '',
    id: '4',
    name: 'My Incident Rule',
    timeWindow: 60,
    aggregation: 0,
    projects: ['project-slug'],
    dateModified: '2019-07-31T23:02:02.731Z',
    triggers: [IncidentTrigger()],
    ...params,
  };
}
