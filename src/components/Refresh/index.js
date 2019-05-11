import React, { Component } from  'react'
import { Platform, View, Text, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'

const updateId = '71c457d0-7294-11e9-94cb-eb86a10ade79'

class Refresh extends Component {
	state = {
	
	}

	refresh = async () => {
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			awaiting: false,
			onRide: false,
			activeRide: false,
		})
			.then(async () => {
				await	firebase.database().ref(`rides/${updateId}`).update({
					voyageNumber: refresh,
				})
			})
	}

	render(){
		return (
				<View style={styles.container}>
					<TouchableOpacity onPress={this.refresh} style={styles.subContainer}>
						<Icon name="redo-alt" size={30} style={{ color: '#666', backgroundColor: '#fff'}} />
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
			ios: 140, android: 160
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
		shadowRadius: 15,
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