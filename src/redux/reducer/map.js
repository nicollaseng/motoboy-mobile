import { 
	MAP,
} from '../action/actionTypes'

const initial_state = {
		map: [],
}

export const map = (state = initial_state, action) => {
	switch(action.type){
		case MAP:
			return { ...state, map: action.payload }
		default:
			return state
	}
}