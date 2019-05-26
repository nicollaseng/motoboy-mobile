import { 
	DRAWER,
} from '../action/actionTypes'

const initial_state = {
		drawer: false,
}

export const drawer = (state = initial_state, action) => {
	switch(action.type){
		case DRAWER:
			return { ...state, drawer: action.payload }
		default:
			return state
	}
}