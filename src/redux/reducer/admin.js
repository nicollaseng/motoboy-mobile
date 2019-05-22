import { 
	ADMIN,
} from '../action/actionTypes'

const initial_state = {
		finish: false,
}

export const admin = (state = initial_state, action) => {
	switch(action.type){
		case ADMIN:
			return { ...state, admin: action.payload }
		default:
			return state
	}
}