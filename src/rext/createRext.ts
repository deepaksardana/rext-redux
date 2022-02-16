import { combineReducers, Reducer } from 'redux';
import { info as infoReducer, items as itemsReducer, resources as resourcesReducer } from './reducer';
import { rextActionFunctions, resetUpdateAction, createIdentityAction } from './actions';
import {
  IRextKeys,
  IRextActionCreators,
  IRextParams,
  IRextAction,
  IRextInfo,
  IRext,
  ActionIdentity,
} from './interface';
import { defaultRextInfo } from './defautState';
import createSagaEvent from './saga';

export const getRextActionCreators = (keys: IRextKeys, actionidentity: ActionIdentity): IRextActionCreators => {
  return {
    request: (params: IRextParams, overrideMetsKeys?: IRextKeys, resources?: any) =>
      rextActionFunctions.request(
        { actions: actionidentity.REXT_FETCH, keys: { ...keys, ...overrideMetsKeys } },
        params,
        resources,
      ),
    update: (params: IRextParams, overrideMetsKeys?: IRextKeys, resources?: any) =>
      rextActionFunctions.request(
        { actions: actionidentity.REXT_UPDATE, keys: { ...keys, ...overrideMetsKeys } },
        params,
        resources,
      ),
    resetUpdate: () =>
      resetUpdateAction(actionidentity.RESET_UPDATE_STATE, { actions: actionidentity.REXT_UPDATE, keys }),
  };
};
export const rext = (
  items: Reducer<any, IRextAction>,
  info: Reducer<IRextInfo, IRextAction>,
  resources: Reducer<any, IRextAction>,
  requestRextActionCreators: IRextActionCreators,
  saga: any,
): IRext => ({
  reducers: combineReducers({
    info,
    items,
    resources,
  }),
  ...requestRextActionCreators,
  saga,
});
export const createRext = (keys: IRextKeys): IRext => {
  const { identity } = keys;
  const actionidentity = createIdentityAction(identity);
  const info = infoReducer(actionidentity, defaultRextInfo);
  const items = itemsReducer(actionidentity);
  const resources = resourcesReducer(actionidentity);
  const rextActionCreators = getRextActionCreators(keys, actionidentity);
  const sagaEvent = createSagaEvent(actionidentity);
  return rext(items, info, resources, rextActionCreators, sagaEvent);
};
