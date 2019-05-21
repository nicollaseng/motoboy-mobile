import { combineReducers } from 'redux'
import { user } from './auth'
import { ride } from './ride'
import { finish } from './finish'
import { out } from './out'
import { map } from './map'

export const Reducers = combineReducers({
    user,
    ride,
    finish,
    out,
    map
})
