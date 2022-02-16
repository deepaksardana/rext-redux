import { combineReducers } from "redux";
import { test1, test2 } from "../../rext";
import { IRextReducer } from "rext-redux";

export interface ApplicationState {
    test1State: IRextReducer,
    test2State: IRextReducer
}

const rootReducer =  combineReducers <ApplicationState>({
    test1State: test1.reducers,
    test2State: test2.reducers,
})

export default rootReducer;