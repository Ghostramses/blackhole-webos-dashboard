import { instance } from '../instance';

export const getTotalEventsGraph = () => instance.get('/events_graph');

export const getLiveEventsGraph = () => instance.get('/events_graph/hard');

export const getCaseCutGraph = () => instance.get('/case_cut_graph');
