import { Platform, PixelRatio } from 'react-native'

export function getPixelSize(pixels){
    return Platform.select({
        ios: pixels,
        android: PixelRatio.getPixelSizeForLayoutSize(pixels)
    })
}

export const countDown = () => {

	var timeleft = 10;
	var downloadTimer = setInterval(() => {
		timeleft--
		console.log(timeleft)
		// this.setState({ time: parseInt(timeleft)} )
			if(timeleft === 0 ){
				clearInterval(downloadTimer);
			}
	}, 1000);
	return timeLeft
		
}
