import { 
	OUT,
} from '../action/actionTypes'

const initial_state = {
		out: true,
}

export const out = (state = initial_state, action) => {
	switch(action.type){
		case OUT:
			return { ...state, user: action.payload }
		default:
			return state
	}
}