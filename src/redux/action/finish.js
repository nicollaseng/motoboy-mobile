import { 
	FINISH
} from './actionTypes'

const setFinish = param => {
	return ({
			type: FINISH,
			payload: param
	})
}

export {
	setFinish,
}