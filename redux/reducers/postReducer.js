const initialState = {
    posts: [],
    loading: true,
  };
  
  const postReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_POSTS_SUCCESS':
        return {
          ...state,
          posts: action.payload,
          loading: false,
        };
      // Add more cases for other post-related actions
      default:
        return state;
    }
  };
  
  export default postReducer;