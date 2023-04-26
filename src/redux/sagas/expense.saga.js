import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* addNewExpense(action) {
  try {
    console.log("action.payload in addnewexpense", action.payload)
    yield axios.post('/api/expenses', action.payload);
    yield put({ type: 'FETCH_GROUP_CATEGORIES', payload: action.payload.budgetId})
    yield put({ type: "FETCH_ALL_GROUP_EXPENSES", payload: action.payload.currentGroup });
  } catch (error) {
    console.log('Error in addNewExpense saga', error);
  }
}

function* deleteExpense(action) {
  try {
    // this is a delete request
    yield axios.post(`/api/expenses/delete`, action.payload.expenseIds);
    yield put({ type: 'FETCH_GROUP_CATEGORIES', payload: action.payload.budgetId })
    yield put({ type: "FETCH_ALL_GROUP_EXPENSES", payload: action.payload.budgetId });
  } catch(error) {
    console.log('Error in deleteExpense saga:', error);
  }
}

function* deleteAllExpenses(action) {
  try {
    yield axios.delete(`/api/expenses/deleteAll/${action.payload}`);
    yield put({ type: 'FETCH_GROUP_CATEGORIES', payload: action.payload})
  } catch(error) {
    console.log('Error in deleteAllExpenses saga:', error);
  }
}

function* updateExpense(action) {
  try {
    yield axios.put(`/api/expenses/update/${action.payload.id}`, action.payload);
    yield put({ type: 'FETCH_GROUP_CATEGORIES', payload: action.payload.budgetId})
    yield put({ type: 'FETCH_ALL_GROUP_EXPENSES', payload: action.payload.budgetId})
  } catch(error) {
    console.log('Error in updateExpense saga:', error);
  }
}

function* fetchAllgroupExpenses(action) {
  try {
    console.log("action.payload in fetchallexpenses",action.payload)
    const response = yield axios.get(`/api/expenses/allGroupExpenses/${action.payload}`);
    yield put({ type: 'SET_ALL_GROUP_EXPENSES', payload: response.data });
  } catch (error) {
    console.log('Error in fetchAllGroupExpenses');
  }
}

function* expenseSaga() {
  yield takeLatest('ADD_NEW_EXPENSE', addNewExpense);
  yield takeLatest('DELETE_EXPENSE', deleteExpense);
  yield takeLatest('DELETE_ALL_EXPENSES', deleteAllExpenses);
  yield takeLatest('UPDATE_EXPENSE', updateExpense);
  yield takeLatest('FETCH_ALL_GROUP_EXPENSES', fetchAllgroupExpenses)
}

export default expenseSaga;