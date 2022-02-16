import { createRext } from "rext-redux"
import { getBaseUrl, getToken } from "./store/selector"

export const test1 = createRext({
    identity: "test1",
    getBaseUrl: getBaseUrl,
    getToken: getToken
  })
  
export const test2 = createRext({
    identity: "test2",
    getBaseUrl: getBaseUrl,
    getToken: getToken
  })