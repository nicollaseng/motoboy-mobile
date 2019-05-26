import { 
	API,
} from '../action/actionTypes'

const initial_state = {
		api: "",
}

export const api = (state = initial_state, action) => {
	switch(action.type){
		case API:
			return { ...state, api: action.payload }
		default:
			return state
	}
}