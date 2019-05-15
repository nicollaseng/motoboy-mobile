import { combineReducers } from 'redux'
import { user } from './auth'
import { ride } from './ride'
import { finish } from './finish'

export const Reducers = combineReducers({
    user,
    ride,
    finish,
})
