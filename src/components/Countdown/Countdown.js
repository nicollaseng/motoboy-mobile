import React, { Component } from  'react'
import { Platform, View, Dimensions, Alert } from 'react-native'
import _ from 'lodash'
import { connect }  from 'react-redux'
import { setRide } from '../../redux/action/ride'

import axios from 'axios'

import CountDown from 'react-native-countdown-component';

class Countdown extends Component {

	handleEndCountdown = async () => {
		const { status } = this.props
		if(status === 'onWay'){
			this.refuseRide()
		} else if(status === 'onDelivery' || status === 'onBackWay'){
			this.updateRating()
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

	updateRating = async () => {
		await axios.post(this.props.api.updateRating, {
			motoboy: JSON.stringify(this.props.user),
		})
			.then((response) => {
				// this.props.setRide({
				// 	...this.props.ride,
				// 	status: 'pending'
				// })
				Alert.alert('Atenção', 'Você está atrasado e isto impactará em sua avaliação')
				console.log(response)
			})
			.catch(err => console.log(err))
	}

	render(){
		const { status } = this.props
		if(status === 'onDelivery' || status === 'onWay' || status === 'onBackWay'){
			return (
				<View style={styles.container}>
						<CountDown
							until={60 * this.props.time }
							size={20}
							onFinish={this.handleEndCountdown}
							digitStyle={{backgroundColor: 'rgba(62, 65, 126, 0.9)'}}
							digitTxtStyle={{color: '#54fa2a'}}
							timeToShow={['M', 'S']}
							timeLabels={{m: 'MM', s: 'SS'}}
							timeLabelStyle={{ color: '#54fa2a'}}
						/>
				</View>
    	)	
		} else {
			return <View />
		}
	}	
}

const styles = {
	container: {
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/4.0, android: Dimensions.get('window').height/1.8
		}),
		// right: 13,
		width: '30%',
		alignSelf: 'flex-start',
	},
	subContainer: {
		backgroundColor: '#fff',
		padding: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 15,
	},
	subContainerIcon: {
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
		fontSize: 18,
	}
}


const mapStateToProps = state => ({
	api: state.api.api,
	user: state.user.user,
})

export default connect(mapStateToProps, { setRide })(Countdown)