import axios from 'axios'
import setAlert from './alert'
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types'
import setAuthToken from '../utils/setAuthToken'

import AsyncStorage from '@react-native-async-storage/async-storage'

export const loadUser = () => async dispatch => {
    if(AsyncStorage.token){
        setAuthToken(AsyncStorage.token)
    }

    try{
        const res = await axios.get('/api/auth')

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch(err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// register user
export const register = ({ name, username, passsword }) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, username, password })

    try{
        const res = await axios.post('/api/users', body, config)

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    } catch(err) {
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}