import React, { Component } from  'react'
import { Platform, TouchableOpacity, Text, Alert, Dimensions, View } from 'react-native'
import { setUser } from '../../redux/action/auth'
import { connect } from 'react-redux'
import { Spinner } from 'native-base'
import * as firebase from 'firebase'

import Icon from 'react-native-vector-icons/FontAwesome5'


const refresh = Math.floor((Math.random() * 100000000000) + 1)
const updateId = '71c457d0-7294-11e9-94cb-eb86a10ade79'

class Active extends Component {
	state = {
		status: false,
		loading: false
	}

	async componentDidMount(){
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value', snap => {
			this.setState({
				status: snap.val().rideStatus
			})
		})
	}

	changeStatus = async () => {
		this.setState({ loading: true }, async () => {
			// firebase.database().ref(`rides/${updateId}`).update({
			// 	voyageNumber: refresh,
			// })

			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value', async snap => {
				let motoboy = snap.val()
				let status = motoboy.rideStatus
				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					rideStatus: !status
				})
					.then(() => {
						// this.props.setUser({
						// 	...this.props.user,
						// 	rideStatus: !status
						// })
						this.setState({ loading: false, status: !status })
					})
					.catch(error => {
						Alert.alert('Atenção', 'Houve um erro interno. Tente novamente em alguns instantes')
						this.setState({ loading: false })
						console.log('error updating ridestatus', error)
				})
			})
		})
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.changeStatus} style={[styles.subContainer, {  backgroundColor: this.state.status ? "#54fa2a" : "#cc2900" }]}>
					<Icon name="power-off" size={30} style={{ color: '#fff' }} /> 
				</TouchableOpacity>
			</View>
    	)
	}	
}

const mapStateToProps = state => ({
	user: state.user.user
})

const styles = {
	container: {
		// heigth: Dimensions.get('window').heigth/2,
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/1.3, android: Dimensions.get('window').height/1.19
		}),
		marginRight: Dimensions.get('window').width/1.55,
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
		borderRadius: 45,
		backgroundColor: '#fff',
		padding: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 19,
	},
	text: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		padding: 20,
		textAlign: 'center'
	}
}

export default connect(mapStateToProps, { setUser })(Active)