const initialState = {
  users: [],
  user: {},
  loading: false,
  error: false,
}

export default function reducer (state = initialState, action) {
  const { type, payload } = action;
  if ( type === 'users/setUsers' ) return { ...state, users: payload }
  if ( type === 'user/setUser' ) return { ...state, user: payload }
  if ( type === 'loading/setLoading' ) return { ...state, loading: payload }
  if ( type === 'error/setError' ) return { ...state, error: payload }
  return state
}
