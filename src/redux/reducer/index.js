import { combineReducers } from 'redux'
import { user } from './auth'
import { ride } from './ride'
import { finish } from './finish'
import { out } from './out'
import { map } from './map'
import { admin } from './admin'
import { drawer } from './drawer'
import { api } from './api'

export const Reducers = combineReducers({
    user,
    ride,
    finish,
    out,
    map,
    admin,
    drawer,
    api,
})
