import { 
	MAP
} from './actionTypes'

const setMap = param => {
	return ({
			type: MAP,
			payload: param
	})
}

export {
	setMap,
}