import { IRextAction, RextResourcesReducer, IRextInfo, IRextKeys, IRextParams, ActionIdentity } from './interface';

export const infoReducer =
  (identity: ActionIdentity, defaultRextInfo: IRextInfo) =>
  (info: IRextInfo = defaultRextInfo, action: IRextAction) => {
    const { type, payload } = action;
    switch (type) {
      case identity.REXT_FETCH.REQUEST:
      case identity.REXT_UPDATE.REQUEST:
        return {
          ...info,
          params: payload.params,
          fetching: type === identity.REXT_FETCH.REQUEST ? true : info.fetching,
          isUpdated: type === identity.REXT_UPDATE.REQUEST ? false : info.isUpdated,
          hasError: false,
          message: undefined,
        };
      case identity.REXT_FETCH.SUCCESS:
      case identity.REXT_UPDATE.SUCCESS:
        return {
          ...info,
          params: payload.params,
          fetching: type === identity.REXT_FETCH.SUCCESS ? false : info.fetching,
          isUpdated: type === identity.REXT_UPDATE.SUCCESS ? true : info.isUpdated,
          hasError: false,
          message: payload.message,
        };
      case identity.REXT_FETCH.FAILURE:
      case identity.REXT_UPDATE.FAILURE:
        return {
          ...info,
          params: payload.params,
          fetching: type === identity.REXT_FETCH.FAILURE ? false : info.fetching,
          isUpdated: type === identity.REXT_UPDATE.FAILURE ? true : info.isUpdated,
          hasError: true,
          message: payload.message,
        };
      case identity.RESET_UPDATE_STATE:
        return {
          ...info,
          isUpdated: false,
        };
      default:
        return info;
    }
  };
export const itemsReducer =
  (identity: ActionIdentity) =>
  (items: {} = {}, action: IRextAction) => {
    const { type, payload, meta } = action;
    const { keys } = meta || {};
    switch (type) {
      case identity.REXT_FETCH.SUCCESS:
      case identity.REXT_UPDATE.SUCCESS:
        return {
          data: getData(items, payload.items, keys, payload.params),
        };
      default:
        return items;
    }
  };

function getData(previousData: any, newData: any, keys: IRextKeys, params: IRextParams | undefined) {
  if (keys.transformation) {
    if (keys.maintainOldValues) {
      return keys.transformation(newData, previousData, params);
    }
    return keys.transformation(newData);
  } else {
    if (keys.maintainOldValues) {
      return { ...previousData, ...newData };
    }
    return newData;
  }
}
export const resourcesReducer =
  (identity: ActionIdentity) =>
  (resources: RextResourcesReducer = {}, action: IRextAction) => {
    const { type, payload } = action;
    switch (type) {
      case identity.REXT_FETCH.REQUEST:
      case identity.REXT_UPDATE.REQUEST: {
        return {
          ...resources,
          ...payload.resources,
        };
      }
      default:
        return resources;
    }
  };
