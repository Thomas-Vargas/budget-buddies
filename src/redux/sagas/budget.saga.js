import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// function* fetchGroupBudget (action) {
//   const response = yield axios.get(`/api/budget/${action.payload}`);
//   console.log(response);
//   yield put({ type: 'SET_GROUP_BUDGET', payload: response.data })
// }

function* updateBudgetAmount (action) {
  yield axios.put(`/api/budget/update/${action.payload.budgetId}`, action.payload);
  yield put({ type: 'FETCH_CURRENT_GROUP', payload: action.payload });
}

function* budgetSaga() {
  // yield takeLatest('FETCH_GROUP_BUDGET', fetchGroupBudget);
  yield takeLatest('UPDATE_BUDGET_AMOUNT', updateBudgetAmount)
}

export default budgetSaga;