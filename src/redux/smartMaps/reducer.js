const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_SMART_MAPS":
      state = action.payload
      return [...state];

    default:
      return [...state];
  }
};
