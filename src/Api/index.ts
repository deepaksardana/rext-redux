import { forEach, replace, keys, constant } from 'lodash';
// TODO need to change method name as method support both Post and Put request
export function fetchRequest(
  url: string,
  token: string,
  method: 'post' | 'get' | 'put' | 'delete',
  body?: any,
  headers?: Headers,
): Promise<any> {
  const requestHeaders: any = {
    method,
    headers: checkAndAppendHeaders(headers!, token, body),
  };
  if (body) {
    requestHeaders.body = body instanceof FormData ? body : JSON.stringify(body);
  }
  return fetch(url, requestHeaders).then(handleResponse);
}

export function checkAndAppendHeaders(headers: Headers, token: string, body?: any): Headers {
  if (!headers) {
    headers = new Headers();
  }
  if (token) {
    headers.set('Authorization', token);
  }
  if (!body || (body && !(body instanceof FormData))) {
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }
  return headers;
}

export function generateUrlWithRequestParams(url: string, requestParams: { [key: string]: any }): string {
  forEach(keys(requestParams), (key: string) => {
    url = replace(url, `:${key}`, encodeURIComponent(requestParams[key]));
  });
  return url;
}

export function generateQueryParamsString(queryParams: { [key: string]: any }): string {
  let query = '';
  const queryParamsKeys = keys(queryParams);
  forEach(keys(queryParams), (key: string, index: number) => {
    query += `${key}=${encodeURIComponent(queryParams[key])}`;
    if (index < queryParamsKeys.length - 1) {
      query += `&`;
    }
  });
  return query;
}

function handleResponse(response: Response) {
  return new Promise((resolve, reject) => {
    if (response.status === 400) {
      response.json().then((json) => {
        reject(json.message || 'Bad Request');
      });
    }
    if (response.status === 401) {
      window.location.reload();
      response.json().then((json) => {
        reject(json.message || 'Unauthorized');
      });
    }
    if (response.status === 404) {
      reject('Not Found');
    }

    if (response.status === 405) {
      response.json().then((json) => {
        reject(json.message || 'Not Allowed');
      });
    }

    if (response.status === 422) {
      response.json().then((json) => {
        reject(json.message || 'Payload Mismatch');
      });
    }

    if (response.status === 500) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.json().then((json) => {
          reject(json.message);
        });
      } else {
        reject('Internal Server Error');
      }
    }

    if (response.status >= 200 && response.status < 300) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        try {
          response.json().then((json) => {
            resolve(json);
          });
        } catch (error: any) {
          reject('Error while parsing result');
        }
      } else {
        resolve(response);
      }
    }
  });
}
