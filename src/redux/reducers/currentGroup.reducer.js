const currentGroup = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_GROUP':
      return action.payload;
    case 'UNSET_CURRENT_GROUP':
      return {};
    default:
      return state;
  }
}

export default currentGroup;