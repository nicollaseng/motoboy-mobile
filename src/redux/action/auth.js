import { 
	AUTH
} from './actionTypes'

const setUser = param => {
	return ({
			type: AUTH,
			payload: param
	})
}

export {
	setUser,
}