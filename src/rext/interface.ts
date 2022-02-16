import { Reducer, Action } from 'redux';

/**
 * Defines three actions for the common case of processing an async request:
 */
export interface RequestType {
  /**
   * A request is in progress.
   */
  REQUEST: string;
  /**
   * The request has succeeded.
   */
  SUCCESS: string;
  /**
   * The request failed.
   */
  FAILURE: string;
}
/**
 * Defines our convention for structuring actions.
 */
export interface StandardAction extends Action {
  /**
   * The data associated with the action, such as request parameters or a response.
   */
  payload?: any;
  meta?: any;
}
/**
 * An action creator is simply a function that produces an action.
 */
export type ActionCreator = (...args: any[]) => StandardAction;

export interface ActionIdentity {
  REXT_FETCH: RequestType;
  REXT_UPDATE: RequestType;
  RESET_UPDATE_STATE: string;
}

export type IRextActionDefinition = (params: IRextParams, overrideMetsKeys?: IRextKeys, resources?: any) => IRextAction;
export type IRextResetActionDefinition = () => IRextAction;

export interface IRextActionCreators {
  request: IRextActionDefinition;
  update: IRextActionDefinition;
  resetUpdate: IRextResetActionDefinition;
}

export interface IRextMeta {
  uniqueKey?: string;
  keys: IRextKeys;
  actions: RequestType;
}
export interface IRextKeys {
  identity: string;
  transformation?: any;
  getBaseUrl: (state: any) => string;
  getToken: (state: any) => string;
  maintainOldValues?: boolean;
}
export interface IRextParams {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  queryParams?: { [key: string]: string | number | boolean };
  urlParams?: { [key: string]: string | number };
  body?: any;
  headers?: Headers;
}
export interface IRextAction extends Action {
  meta: IRextMeta;
  payload: {
    params?: IRextParams;
    resources?: any;
    items?: any;
    message?: string;
    error?: boolean;
  };
}
/**
 * Reducers
 */
export interface IRextInfo {
  params?: IRextParams;
  fetching?: boolean;
  isUpdated?: boolean;
  hasError?: boolean;
  message?: string;
  isCancelled: boolean;
}

export interface RextResourcesReducer {
  [key: string]: any;
}

export interface IRextReducer {
  info: IRextInfo;
  resources: any;
  items: any;
}
export interface IRext extends IRextActionCreators {
  reducers: Reducer<IRextReducer, IRextAction>;
  saga: any;
}
/**
 * Selector
 */
export interface IRextState {
  params: IRextParams;

  fetching?: boolean;
  isUpdated?: boolean;

  resources: any;
  data: any;

  error: boolean;
  message: string;
}
