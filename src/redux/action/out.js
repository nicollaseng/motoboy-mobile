import { 
	OUT
} from './actionTypes'

const setOut = param => {
	return ({
			type: OUT,
			payload: param
	})
}

export {
	setOut,
}