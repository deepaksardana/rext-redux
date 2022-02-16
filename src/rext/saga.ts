import { SagaIterator } from 'redux-saga';
import { put, call, select, takeLatest } from 'redux-saga/effects';
import { rextActionFunctions } from './actions';
import { fetchRequest, generateUrlWithRequestParams, generateQueryParamsString } from '../Api';
import { IRextAction, IRextParams, ActionIdentity } from './interface';

function* performRequestRextOperation(action: IRextAction): IterableIterator<{}> {
  const { meta, payload } = action;
  const { url, method } = payload.params!;
  const {
    keys: { getBaseUrl, getToken },
  } = meta;
  console.log(meta, payload);
  try {
    const token: string = (yield select(getToken))!;
    const requesturl: string = getFullUrl((yield select(getBaseUrl))!, url, payload.params);
    let response: any = yield call(
      fetchRequest,
      requesturl,
      token,
      method,
      payload?.params?.body,
      payload?.params?.headers,
    );
    yield put(
      rextActionFunctions.success(
        meta,
        payload.params!,
        response.data || response.record || response,
        response.message || 'Execution Done Successfully',
      ),
    );
  } catch (error: any) {
    yield put(rextActionFunctions.failure(meta, payload.params!, error.message || 'Execution Failed'));
  }
}

export default function (actionidentity: ActionIdentity) {
  return function* watchRextEvent(): SagaIterator {
    yield takeLatest(actionidentity.REXT_FETCH.REQUEST, performRequestRextOperation);
    yield takeLatest(actionidentity.REXT_UPDATE.REQUEST, performRequestRextOperation);
  };
}

function getFullUrl(baseUrl: string, operationEndPoint: string, params?: IRextParams): string {
  let url = `${baseUrl}${operationEndPoint}`;
  if (params && params.urlParams) {
    url = generateUrlWithRequestParams(url, params.urlParams);
  }
  if (params && params.queryParams) {
    url = `${url}?${generateQueryParamsString(params.queryParams)}`;
  }
  return url;
}
