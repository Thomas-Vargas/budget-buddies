import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createBudget(action) {
  try {
    const response = yield axios.post('/api/group/createBudget', action.payload.budget);
    yield put({ type: 'CREATE_BUDGET', payload: {...action.payload.budget, id: response.data[0].id, username: action.payload.username}});
    yield put({ type: 'CREATE_CATEGORIES', payload:{id: response.data[0].id, categories: action.payload.categories}});
  } catch (error) {
    console.log('Budget post request failed', error);
  }
}

function* createGroup(action) {
  try {
    //post request creating group
    console.log(action.payload)
    // store group id in response
    // i need group id, and both user ids in group
    //action.payload.username is the name to add to group
    const groupIdResponse = yield axios.post('/api/group/createGroup', action.payload);
    const userToAddId = yield axios.get(`/api/group/user/${action.payload.username}`);
    // console.log('User id response', userToAddId.data)
    // console.log('Group id response:', groupIdResponse.data)

    yield put({ type: 'CREATE_USER_GROUP', payload: {groupId: groupIdResponse.data[0].id, userId: userToAddId.data[0].id }})
  } catch (error) {
    console.log('Create group request failed', error);
  }
}

function* createUserGroup(action) {
  try {
    console.log('payload in creatUsergroup', action.payload)
    yield axios.post('/api/group/createUserGroup', action.payload);
    yield put({ type: 'FETCH_ALL_GROUPS' });
  } catch (error) {
    console.log('Failure in create user group saga', error);
  }
}

function* createCategories(action) {
  try {
    // console.log('Payload in createCategories', action.payload)
    // IS HAVING THIS AXIOS POST WITHOUT A YIELD OK?
    yield action.payload.categories.map(category => {
      axios.post('/api/group/createCategories', {category, id: action.payload.id});
    })
  } catch (error) {
    console.log('Failure in createCategories saga', error);
  }
}

function* fetchCurrentGroup(action) {
  try {
    console.log('payload in fetchCurrentGroup', action.payload)
    const response = yield axios.get(`/api/group/currentGroup/${action.payload.id}`);
    console.log(response.data);
    yield put({ type: 'SET_CURRENT_GROUP', payload: response.data[0] });
  } catch (error) {
    console.log('failure in setCurrentGroup saga', error);
  }
}

function* fetchAllGroups(action) {
  try {
    // get the groups the user belongs to 
    const userGroupsResponse = yield axios.get('/api/group/userGroups');
    // set the groups user belongs to
    yield put({type: 'SET_USER_GROUPS', payload: userGroupsResponse.data});
  } catch (error) {
    console.log('failure in fetchAllGroups saga', error);
  }
}

function* updateGroupName(action) {
  try {
    yield axios.put(`/api/group/update/${action.payload.id}`, action.payload);
    yield put({type: 'FETCH_CURRENT_GROUP', payload: action.payload});
  } catch (error) {
    console.log('failure in updateGroupName saga', error);
  }
}
function* deleteGroup(action) {
  try {
    yield axios.delete('/api/group/delete', { data: action.payload} );
    yield put( {type: "FETCH_ALL_GROUPS"} )
  } catch (error) {
    console.log('failure in deleteGroup saga', error)
  }
}

function* groupSaga() {
  // budget -> groups -> user_group -> categories
  yield takeLatest('CREATE_GROUP', createBudget);
  yield takeLatest('CREATE_BUDGET', createGroup);
  yield takeLatest('CREATE_USER_GROUP', createUserGroup);
  yield takeLatest('CREATE_CATEGORIES', createCategories);
  yield takeLatest('FETCH_CURRENT_GROUP', fetchCurrentGroup);
  yield takeLatest('FETCH_ALL_GROUPS', fetchAllGroups);
  yield takeLatest('UPDATE_GROUP_NAME', updateGroupName);
  yield takeLatest('DELETE_GROUP', deleteGroup);
}

export default groupSaga