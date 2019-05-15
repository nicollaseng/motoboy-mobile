import { 
	FINISH,
} from '../action/actionTypes'

const initial_state = {
		finish: false,
}

export const finish = (state = initial_state, action) => {
	switch(action.type){
		case FINISH:
			return { ...state, finish: action.payload }
		default:
			return state
	}
}