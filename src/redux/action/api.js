import { 
	API
} from './actionTypes'

const setApi = param => {
	return ({
			type: API,
			payload: param
	})
}

export {
	setApi,
}