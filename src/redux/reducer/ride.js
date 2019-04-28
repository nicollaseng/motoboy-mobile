import { 
	RIDE,
} from '../action/actionTypes'

const initial_state = {
		ride: false,
}

export const ride = (state = initial_state, action) => {
	switch(action.type){
		case RIDE:
			return { ...state, ride: action.payload }
		default:
			return state
	}
}