import { configureStore } from "@reduxjs/toolkit"
import navigationReducer from "./features/navigationSlice"
import profileReducer from "./slices/profileSlice"

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
