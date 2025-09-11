'use client'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

interface User {
  id: number
  name: string
  email: string
  // agrega más campos si necesitas
}

interface UserState {
  session: User | null
}

const initialState: UserState = {
  session: null,
}

// 👇 thunk para hidratar desde localStorage
export const hydrateUser:any = createAsyncThunk('user/hydrate', async () => {
  const stored = await localStorage.getItem('user') // lo dejo en async/await aunque es síncrono
  if (stored) {
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  }
  return null
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<User | null>) => {
      state.session = action.payload
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload))
      } else {
        localStorage.removeItem('user')
      }
    },
    clearSession: (state) => {
      state.session = null
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateUser.fulfilled, (state, action) => {
      state.session = action.payload
    })
  },
})

export const { setSession, clearSession } = userSlice.actions
export default userSlice.reducer
