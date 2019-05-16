import { Platform, PixelRatio, AsyncStorage } from 'react-native'

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

export const setId = async userId => {
    try {
      await AsyncStorage.setItem('userId', userId);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };

export const getId = async () => {
    let userId = '';
    try {
      userId = await AsyncStorage.getItem('userId') || 'none';
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return userId;
  }
