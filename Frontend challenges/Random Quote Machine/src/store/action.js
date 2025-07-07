export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAILURE = "FETCH_FAILURE";
export const RANDOM_QUOTE = "RANDOM_QUOTE";

export const fetchReq = () => ({
  type: FETCH_REQUEST,
});

export const fetchSuccess = (data) => ({
  type: FETCH_SUCCESS,
  payload: data,
});

export const fetchFailure = (err) => ({
  type: FETCH_FAILURE,
  payload: err.message || "Something went wrong!",
});

export const randomQuote = () => ({
  type: RANDOM_QUOTE
});

export const fetchQuotes = () => {
  return async (dispatch) => {
    dispatch(fetchReq());
    try {
      const res = await fetch(
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch the quote!");
      }
      const data = await res.json();
      dispatch(fetchSuccess(data));
      dispatch(randomQuote())
    } catch (err) {
      dispatch(fetchFailure(err));
    }
  };
};
