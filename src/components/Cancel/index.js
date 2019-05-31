import React, { Component } from  'react'
import { Platform, View, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import { setRide } from '../../redux/action/ride'

import axios from 'axios'

import _ from 'lodash'

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
		if(ride.id && (ride.status === 'onRestaurant' || ride.status === 'onWay' || ride.status === 'pending')){
			this.refuseRide()
		} else {
			Alert.alert('Atenção', 'Esta corrida não pode mais ser cancelada uma vez que você iniciou a entrega')
		}
	}

	refuseRide = async () => {
		await axios.post(this.props.api.transferRide, {
			motoboy: JSON.stringify(this.props.user),
			ride: JSON.stringify(this.props.ride)
		})
			.then((response) => {
				Alert.alert('Atenção', 'Você está atrasado e isto impactará em sua avaliação')
				console.log(response)
			})
			.catch(err => console.log(err))
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
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/3.2, android: Dimensions.get('window').height/3.2
		}),
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		right: 13,
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
	api: state.api.api
})

export default connect(mapStateToProps, { setRide })(Refresh)