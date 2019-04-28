import { combineReducers } from 'redux'
import { user } from './auth'
import { ride } from './ride'

export const Reducers = combineReducers({
    user,
    ride
})
