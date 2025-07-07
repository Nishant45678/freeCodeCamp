import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  RANDOM_QUOTE,
} from "./action";

const defaultState = {
  loading: false,
  quotes: [],
  currentQuote: null,
  error: null,
};

export const quoteReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        quotes: action.payload.quotes,
        error: null,
      };
    case FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case RANDOM_QUOTE:
      return {
        ...state,
        loading: false,
        currentQuote:
          state.quotes[Math.floor(Math.random() * state.quotes.length)],
      };
    default:
      return state;
  }
};
