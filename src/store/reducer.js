const initialState = {
  counter: 10,
  results: [],
  labels: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === "INCREMENT") {
    return {
      ...state,
      counter: state.counter + 1,
    };
  }
  if (action.type === "STORE_RESULT") {
    return {
      ...state,
      results: state.results.concat({ id: new Date(), value: action.result }),
    };
  } else {
    /*const a = fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        return json;
      });
    console.log("reducer json", JSON.stringify(a));
    return {
      ...state,
      labels: a,
    };*/
  }
  return state;
};

export default reducer;
