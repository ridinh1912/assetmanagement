import { fork, put } from 'redux-saga/effects';

import { setIsAdd, setIsEdit, setKey, setResetState, setUser } from '../../reducer/user/user.reducer';

function* handleSetIsAdd(action) {
  yield put(setIsAdd(action));
}

function* handleSetIsEdit(action) {
  yield put(setIsEdit(action));
}

function* handleSetUser(action) {
  yield put(setUser(action));
}

function* handleSetResetState(action) {
  yield put(setResetState(action));
}

function* handleSetKey(action) {
  yield put(setKey(action));
}

export const appSaga = [
  fork(handleSetIsAdd),
  fork(handleSetIsEdit),
  fork(handleSetUser),
  fork(handleSetResetState),
  fork(handleSetKey),
];
