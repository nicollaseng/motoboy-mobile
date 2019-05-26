import React, { Component } from  'react'
import { View, TouchableOpacity, Dimensions, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as firebase from 'firebase'
import { connect } from 'react-redux'

class RecoverUser extends Component {

recoverUser = async () => {
	console.log('apertou')
	await	firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
		ride: false,
		rideId: false,
		activeRide: false,
		onRide: false,
	})
		.then(() => {
			console.log('updated')	
		})
		.catch(error => {
			console.log('error trying recover', error)
		})
}
	render(){
		// return <View />
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.recoverUser} style={[styles.subContainer, { backgroundColor:  '#cc2900' }]}>
					<Icon name="sync-alt" size={30}  style={{ color: '#fff', backgroundColor: '#cc2900'}} />
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
			ios: Dimensions.get('window').height/1.5, android: Dimensions.get('window').height/1.5
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
	ride: state.ride.ride,
})

export default connect(mapStateToProps)(RecoverUser)