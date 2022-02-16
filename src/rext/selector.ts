import { IRextReducer, IRextState, IRextInfo } from './interface';
export function getRextState(rext: IRextReducer, defaultValue: any): IRextState {
  const info: IRextInfo = rext.info;
  const item: any = rext.items;
  return {
    isUpdated: info.isUpdated,
    fetching: info.fetching,
    error: info.hasError || false,
    message: info.message!,
    data: item.data || defaultValue,
    resources: rext.resources,
    params: rext.info.params!,
  };
}
