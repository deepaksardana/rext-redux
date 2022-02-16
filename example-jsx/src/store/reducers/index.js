import { combineReducers } from "redux";
import { test1, test2 } from "../../rext";

const rootReducer =  combineReducers({
    test1State: test1.reducers,
    test2State: test2.reducers,
})

export default rootReducer;