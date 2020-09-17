const { createStore } = require("redux");

const initialState = {
  counter: 0,
};

//Reducer

const rootReducer = (state = initialState, action) => {
  if (action.type === "INC_COUNTER") {
    return {
      ...state,
      counter: state.counter + 10,
    };
  }
  return state;
};

//Store

const store = createStore(rootReducer);
console.log(store.getState());

//Subscription
store.subscribe(() => {
  console.log("Subscription", store.getState());
});
//DispatchingActions
store.dispatch({ type: "INC_COUNTER" });
console.log(store.getState());
