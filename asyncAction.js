const redux = require("redux");
const thunkMiddleWare = require("redux-thunk").default;
const axios = require("axios");

const createStore = redux.createStore;
const applyMiddleWare = redux.applyMiddleware;

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const fetchUserReq = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};
const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};
const fetchUserFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

const reducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
  }
};

const fetchUsers = () => {
  return async (dispatch) => {
    dispatch(fetchUserReq());
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      const users = res.data.map((user) => user.name);
      dispatch(fetchUserSuccess(users));
    } catch (error) {
      dispatch(fetchUserFailure(error.message));
    }
  };
};
const store = createStore(reducer, applyMiddleWare(thunkMiddleWare));
store.subscribe(() => {
  console.log(store.getState());
});
store.dispatch(fetchUsers());
