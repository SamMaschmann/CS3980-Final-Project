import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import axios from 'axios'

export const signup = createAsyncThunk('auth/signup', async({username, password}: Record<string, string>, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:8000/signup', {username, password})
        return res.data
    } catch (err: any) {
        console.log(err)
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const signin = createAsyncThunk('auth/signin', async({username, password}: Record<string, string>, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:8000/signin', {username, password})
        return res.data
    } catch (err: any) {
        console.log(err)
        return thunkAPI.rejectWithValue(err.message)
    }
})


interface UserState {
    user: string,
    isLoggedIn: boolean,
    loading: boolean,
    error: any
}

const initialState: UserState = {
    user: '',
    isLoggedIn: false,
    loading: false,
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.user = '',
            state.isLoggedIn = false,
            state.loading = false,
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
                state.user = action.payload.username
                state.isLoggedIn = true
                state.loading = false
                state.error = null
            })
            .addCase(signup.pending, (state, action) => {
                state.loading = true
            })
            .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
                state.user = ''
                state.loading = false
                state. isLoggedIn = false
                state.error = action.payload
            })


            .addCase(signin.fulfilled, (state, action: PayloadAction<any>) => {
                state.user = action.payload.username
                state.isLoggedIn = true
                state.loading = false
                state.error = null
            })
            .addCase(signin.pending, (state, action) => {
                state.loading = true
            })
            .addCase(signin.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false
                state. isLoggedIn = false
                state.error = action.payload
            })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer