
export const countDown = () => {

	var timeleft = 20;
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
