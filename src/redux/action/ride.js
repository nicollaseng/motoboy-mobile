import { 
	RIDE
} from './actionTypes'

const setRide = param => {
	return ({
			type: RIDE,
			payload: param
	})
}

export {
	setRide,
}