import { 
	DRAWER
} from './actionTypes'

const setDrawer = param => {
	return ({
			type: DRAWER,
			payload: param
	})
}

export {
	setDrawer,
}