import React, { Component } from  'react'
import { Platform, View, Text, TouchableOpacity, Dimensions, Alert, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import Sound from 'react-native-sound'

class Refresh extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
		}
	}

	call = () => {
		console.log('telefone que vem', this.props.telefone)
		Linking.openURL(`tel:${this.props.telefone}`)
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.call} style={[styles.subContainer, { backgroundColor:  '#363777' }]}>
					<Icon name="phone" size={30} style={{ color: '#fff', backgroundColor: '#363777'}} />
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
			ios: Dimensions.get('window').height/2.3, android: Dimensions.get('window').height/2.3
		}),
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
	ride: state.ride.ride,
})

export default connect(mapStateToProps)(Refresh)