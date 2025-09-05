import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from './baseApi'
import { fileBaseApi } from './fileBaseApi'
import authReducer from './authSlice'
import transactionFormReducer from './features/transactionFormSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [fileBaseApi.reducerPath]: fileBaseApi.reducer,
    auth: authReducer,
    transactionForm: transactionFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, fileBaseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch