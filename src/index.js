import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import { worker } from './api/server'
import { fetchUsers } from './features/users/usersSlice'

import { apiSlice } from './features/api/apiSlice'

// Start our mock API server
worker.start({ onUnhandledRequest: 'bypass' })

// Normally you should stick with using the hooks(like above), but here we're 
// going to work with the user data using just the RTK Query core 
// API so you can see how to use it.

// Manually dispatching an RTKQ request thunk will create a subscription entry, 
// but it's then up to you to unsubscribe from that data later - otherwise the 
// data stays in the cache permanently. In this case, we always need user data, 
// so we can skip unsubscribing.
store.dispatch(apiSlice.endpoints.getUsers.initiate());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
