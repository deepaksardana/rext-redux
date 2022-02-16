import { all, fork } from "redux-saga/effects";
import { test1, test2 } from "../../rext";
export default function* root() {
    yield all([
        fork(test1.saga),
        fork(test2.saga),
    ])
};