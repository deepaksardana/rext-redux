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
  requestParams.keys().forEach((key: string) => {
    url = url.replace(`:${key}`, encodeURIComponent(requestParams[key]));
  });
  return url;
}

export function generateQueryParamsString(queryParams: { [key: string]: any }): string {
  let query = '';
  const queryParamsKeys = queryParams.keys();
  queryParams.keys().forEach((key: string, index: number) => {
    query += `${key}=${encodeURIComponent(queryParams[key])}`;
    if (index < queryParamsKeys.length - 1) {
      query += `&`;
    }
  });
  return query;
}

function handleResponse(response: Response) {
  return new Promise((resolve, reject) => {
    if (response.status === 401) {
      window.location.reload();
      response.json().then((json) => {
        reject(json.message || 'Unauthorized');
      });
    } else if (response.status >= 200 && response.status < 300) {
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
    } else {
      response.json().then((json) => {
        reject(json.message || json.error || 'Internal Server Error');
      });
    }
  });
}
