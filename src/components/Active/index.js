import React, { Component } from  'react'
import { Platform, TouchableOpacity, Text, Alert } from 'react-native'
import { setUser } from '../../redux/action/auth'
import { connect } from 'react-redux'
import { Spinner } from 'native-base'
import * as firebase from 'firebase'

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
			<TouchableOpacity style={[styles.container, { backgroundColor: this.state.status ? "#54fa2a" : "#363777"}]} onPress={this.changeStatus}>
				{this.state.loading ? <Spinner /> : <Text style={styles.text}>{this.state.status ? "ONLINE" : "OFFLINE"}</Text>}
			</TouchableOpacity>
    )
	}	
}

const mapStateToProps = state => ({
	user: state.user.user
})

const styles = {
	container: {
		// position: 'absolute',
		// top: Platform.select({
		// 	ios: 60, android: 40
		// }),
		// width: '30%',
		// // height: 54,
		// margin: 0,
		// borderRadius: 0,
		// paddingTop: 0,
		// paddingBottom: 0,
		// paddingLeft: 20,
		// paddingRight: 20,
		// marginTop: 65,
		// marginLeft: 0,
		// marginRight: 0,
		// elevation: 5,
		// shadowColor: '#000',
		// shadowOpacity: 0.1,
		// shadowOffset: { x:0, y:0},
		// shadowRadius: 20,
		// borderWidth: 1,
		// borderColor: '#DDD',
		backgroundColor: 'red',
		// alignSelf: 'flex-end'
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