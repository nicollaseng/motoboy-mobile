import { 
	ADMIN
} from './actionTypes'

const setAdmin = param => {
	return ({
			type: ADMIN,
			payload: param
	})
}

export {
	setAdmin,
}