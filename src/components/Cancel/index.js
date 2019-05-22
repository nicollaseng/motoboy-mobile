import React, { Component } from  'react'
import { Platform, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import Sound from 'react-native-sound'
import { setRide } from '../../redux/action/ride'


class Refresh extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
		}
	}

	cancel = async () => {
		const { ride } = this.props
		if(ride.status === 'onRestaurant' || ride.status === 'onWay' || ride.status === 'pending'){
			await firebase.database().ref(`rides/${ride.id}`).update({
				free: true,
				pendingMotboyId: false,
				motoboyId: false,
				checked: true,
				status: 'pending',
				motoboy: {}
			})
			.then(async () => {
					await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
						rideId: false, 
						ride: false,
						activeRide: false,
						onRide: false,
					})
						.then(() => {
							this.props.setRide({
								...this.state.ride,
								status: 'finished'
							})
							console.log('RIDE TRANSFERED TO LIMBO')
						})
						.catch(error => console.log('ERROR TRASFERING RIDE TO LIMBO', error))
				})
			.catch(error => {
				console.log('ERROR UPDATING RIDE TO FREE', error)
			})
		} else {
			Alert.alert('Atenção', 'Esta corrida não pode mais ser cancelada uma vez que você iniciou a entrega')
		}
	}



	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.cancel} style={[styles.subContainer, { backgroundColor:  '#cc2900' }]}>
					<Icon name="hand-paper" size={30} style={{ color: '#fff', backgroundColor: '#cc2900'}} />
				</TouchableOpacity>
			</View>
    	)
	}	
}

const styles = {
	container: {
		// heigth: Dimensions.get('window').heigth/2,
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/3.2, android: Dimensions.get('window').height/3.2
		}),
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		right: 13,
		// bottom: Platform.select({
		// 	ios: 100, android: 80
		// }),
		// width: '40%',
		alignSelf: 'flex-start',
	},
	subContainer: {
		borderRadius: 45,
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
	ride: state.ride.ride
})

export default connect(mapStateToProps, { setRide })(Refresh)