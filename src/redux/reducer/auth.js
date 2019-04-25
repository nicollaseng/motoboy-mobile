import { 
	AUTH,
} from '../action/actionTypes'

const initial_state = {
		user: {},
}

export const user = (state = initial_state, action) => {
	switch(action.type){
		case AUTH:
			return { ...state, user: action.payload }
		default:
			return state
	}
}