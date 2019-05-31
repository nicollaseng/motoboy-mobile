// import React, { Component } from  'react'
// import { Platform, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome5'
// import VMasker from 'vanilla-masker'
// import * as firebase from 'firebase'
// import { connect } from 'react-redux'
// import Sound from 'react-native-sound'
// import DropdownAlert from 'react-native-dropdownalert';

// var rideAlert = new Sound('alert2.mp3', Sound.MAIN_BUNDLE, (error) => {

// 	rideAlert.setVolume(10);
//   if (error) {
//     console.log('failed to load the sound', error);
// 	}
// })

// class Refresh extends Component {

// 	constructor(props){
// 		super(props)
// 		this.state ={
// 			delayRunning: false,
// 			time: 0,
// 			status: false,
// 		}
// 	}

// 	async componentDidMount(){
// 		console.log('ride available', this.props.rideAvailable)
// 		if(this.props.rideAvailable){
// 			let i;
// 			 rideAlert.play((success) => {
// 				if (success) {
// 					console.log('SET RIDE FREE SUCCESS', i);
// 				} else {
// 					console.log('playback failed due to audio decoding errors');
// 				}
// 			})
// 		}
// 			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', snap => {
// 				this.setState({
// 					status: snap.val().rideStatus
// 				})
// 			})
// 	}

// 	// delay = () => {
// 	// 	var timeleft = 30;
// 	// 	// const delayNumber = 10
// 	// 	if(this.state.delayRunning){
// 	// 		var downloadTimer = setInterval(() => {
// 	// 			timeleft--
// 	// 			console.log(timeleft)
// 	// 			this.setState({ time: parseInt(timeleft)} )
// 	// 			if(timeleft === 0){
// 	// 				this.setState({ delayRunning: false })
// 	// 				// this.refuseRide()
// 	// 				// this.setState({ initialMilliseconds: 0 })
// 	// 				clearInterval(downloadTimer);
// 	// 			}
// 	// 		}, 1000);
// 	// 	}
// 	// }

// 	refresh = async () => {
// 		console.log('clicou no refresh', this.state.status, this.props.user.id)
// 		this.props.checkRide()

// 		// alert(`Estamos buscando novas corridas para você`);
// 		// if(this.props.user.id){
// 		// 	await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
// 		// 		onRide: false,
// 		// 		activeRide: false,
// 		// 		pendingRideId: false,
// 		// 		ride: false,
// 		// 	})
// 		// 		.then(async () => {
// 		// 			this.setState({ delayRunning: true })
// 		// 			this.props.checkRide()
// 		// 			// this.delay()
// 		// 			// Alert.alert('Atenção', 'Buscando novas entregas. Por favor aguarde. Clique em ok')
// 		// 		})
// 		// 		.catch(error => {
// 		// 			console.log('error trying to refresh', error)
// 		// 		})
// 		// }
// 	}

// 	render(){
// 		console.log('STATUS AQUIIIII', this.state.status)
// 		return (
// 			<View style={styles.container}>
// 					<TouchableOpacity onPress={() => {
// 						if(this.state.status){
// 							return this.refresh()
// 						} else {
// 							Alert.alert('Atenção', `Você precisa estar online para receber novas chamadas!`);
// 							return;
// 						}
// 					}} style={[styles.subContainer, { backgroundColor: this.props.rideAvailable ? '#363777' : '#fff' }]}>
// 						{/* {this.state.delayRunning ? <Text style={{ color: '#666', fontSize: 19, textAlign: 'center', padding: 9, fontWeight: '500'}}>{this.state.time}</Text>  */}
// 						<Icon name="motorcycle" size={30} style={{ color: this.props.rideAvailable ? '#fff' : '#666', backgroundColor: this.props.rideAvailable ? '#363777' : '#fff'}} />
// 					</TouchableOpacity>
// 					<DropdownAlert
// 					 ref={ref => this.dropdown = ref}
// 					 closeInterval={10000}
// 					/>
// 			</View>

// // 	<View style={styles.container}>
// // 	<TouchableOpacity onPress={this.props.getLocation} style={[styles.subContainer, { backgroundColor:  '#363777' }]}>
// // 		<Icon name="compass" size={30} style={{ color: '#54fa2a', backgroundColor: '#363777'}} />
// // 	</TouchableOpacity>
// // </View>
//     )
// 	}	
// }

// const styles = {
// 	container: {
// 		// heigth: Dimensions.get('window').heigth/2,
// 		position: 'absolute',
// 		top: Platform.select({
// 			ios: Dimensions.get('window').height/1.3, android: Dimensions.get('window').height/1.4
// 		}),
// 		marginRight: Dimensions.get('window').width/2,
// 		justifyContent: 'flex-end',
// 		alignItems: 'flex-end',
// 		right: 13,
// 		// bottom: Platform.select({
// 		// 	ios: 100, android: 80
// 		// }),
// 		// width: '40%',
// 		alignSelf: 'flex-end',
// 	},
// 	subContainer: {
// 		borderRadius: 35,
// 		backgroundColor: '#fff',
// 		padding: 10,
// 		elevation: 10,
// 		shadowColor: '#000',
// 		shadowOpacity: 0.2,
// 		shadowOffset: { x: 0, y: 0},
// 		shadowRadius: 19,
// 	},
// 	title: {
// 		textAlign: 'center',
// 		color: '#222',
// 		fontSize: 14,
// 	},
// 	description: {
// 		textAlign: 'center',
// 		color: '#666',
// 		fontSize: 22,
// 	}
// }

// const mapStateToProps = state => ({
// 	user: state.user.user,
// })

// export default connect(mapStateToProps)(Refresh)

import React, { Component } from  'react'
import { Platform, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import Sound from 'react-native-sound'



var rideAlert = new Sound('alert2.mp3', Sound.MAIN_BUNDLE, (error) => {

	rideAlert.setVolume(10);
	// rideAlert.setNumberOfLoops(3);

  if (error) {
    console.log('failed to load the sound', error);
	}
})

class Refresh extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
		}
	}

	componentDidMount(){
		console.log('ride available', this.props.rideAvailable)
		if(this.props.rideAvailable){
			let i;
			 rideAlert.play((success) => {
				if (success) {
					console.log('SET RIDE FREE SUCCESS', i);
				} else {
					console.log('playback failed due to audio decoding errors');
				}
			})
		}
	}

	delay = () => {
		var timeleft = 30;
		// const delayNumber = 10
		if(this.state.delayRunning){
			var downloadTimer = setInterval(() => {
				timeleft--
				console.log(timeleft)
				this.setState({ time: parseInt(timeleft)} )
				if(timeleft === 0){
					this.setState({ delayRunning: false })
					// this.refuseRide()
					// this.setState({ initialMilliseconds: 0 })
					clearInterval(downloadTimer);
				}
			}, 1000);
		}
	}

	refresh = async () => {
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			onRide: false,
			activeRide: false,
			pendingRideId: false,
			ride: false,
		})
			.then(async () => {
				this.setState({ delayRunning: true })
				this.props.checkRide()
				this.delay()
				// Alert.alert('Atenção', 'Buscando novas entregas. Por favor aguarde. Clique em ok')
			})
			.catch(error => {
				console.log('error trying to refresh', error)
			})
	}

	render(){
		return (
			<View style={styles.container}>
				{this.props.user.rideStatus && (
					<TouchableOpacity onPress={() => this.state.delayRunning && !this.props.isRide ? false : this.refresh()} style={[styles.subContainer, { backgroundColor: this.props.rideAvailable ? '#363777' : '#fff' }]}>
						{this.state.delayRunning ? <Text style={{ color: '#666', fontSize: 19, textAlign: 'center', padding: 9, fontWeight: '500'}}>{this.state.time}</Text> 
							: <Icon name="motorcycle" size={30} style={{ color: this.props.rideAvailable ? '#fff' : '#666', backgroundColor: this.props.rideAvailable ? '#363777' : '#fff'}} />}
					</TouchableOpacity>
				)}
			</View>

// 	<View style={styles.container}>
// 	<TouchableOpacity onPress={this.props.getLocation} style={[styles.subContainer, { backgroundColor:  '#363777' }]}>
// 		<Icon name="compass" size={30} style={{ color: '#54fa2a', backgroundColor: '#363777'}} />
// 	</TouchableOpacity>
// </View>
    )
	}	
}

const styles = {
	container: {
		// heigth: Dimensions.get('window').heigth/2,
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/1.3, android: Dimensions.get('window').height/1.4
		}),
		marginRight: Dimensions.get('window').width/2,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		right: 13,
		// bottom: Platform.select({
		// 	ios: 100, android: 80
		// }),
		// width: '40%',
		alignSelf: 'flex-end',
	},
	subContainer: {
		borderRadius: 35,
		backgroundColor: '#fff',
		padding: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 19,
	},
	title: {
		textAlign: 'center',
		color: '#222',
		fontSize: 14,
	},
	description: {
		textAlign: 'center',
		color: '#666',
		fontSize: 22,
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps)(Refresh)