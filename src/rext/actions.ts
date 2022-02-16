import { RequestType, IRextParams, ActionIdentity, IRextAction, IRextMeta } from './interface';

/**
 * Defines a request type, used as the basis for an action type.
 * @param {string} base - The base name of the action type.
 * @returns {RequestType}
 */
export function defineRequestType(base: string): RequestType {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].reduce<RequestType>((acc: any, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {} as RequestType);
}

export function createIdentityAction(identity: string): ActionIdentity {
  return {
    REXT_FETCH: defineRequestType(`@${identity}CUSTOM_REDUX_REXT_FETCH`),
    REXT_UPDATE: defineRequestType(`@${identity}CUSTOM_REDUX_REXT_UPDATE`),
    RESET_UPDATE_STATE: `@${identity}CUSTOM_REDUX_REXT_RESET_UPDATE`,
  };
}

export const rextActionFunctions = {
  request: (meta: IRextMeta, params: IRextParams, resources?: any): IRextAction => {
    const { actions } = meta;
    return {
      type: actions.REQUEST,
      meta,
      payload: {
        params,
        resources,
      },
    };
  },
  success: (meta: IRextMeta, params: IRextParams, items: any, message: string): IRextAction => {
    const { actions } = meta;
    return {
      type: actions.SUCCESS,
      meta,
      payload: {
        params,
        items,
        message,
      },
    };
  },
  failure: (meta: IRextMeta, params: IRextParams, message: string): IRextAction => {
    const { actions } = meta;
    return {
      type: actions.FAILURE,
      meta,
      payload: {
        params,
        message,
      },
    };
  },
};

export function resetUpdateAction(identity: string, meta: IRextMeta): IRextAction {
  return {
    type: identity,
    meta,
    payload: {},
  };
}
