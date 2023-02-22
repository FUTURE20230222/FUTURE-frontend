const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_USER_ROBOTS":
      state = action.payload
      return [...state];

    default:
      return [...state];
  }
};
