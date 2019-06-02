import React, { Component, Fragment } from  'react'
import { View, TouchableOpacity, Platform, Linking, Alert, Text} from 'react-native'
import axios from 'axios'
import { Spinner } from 'native-base'
import { 
	Container, TypeTitle, TypeDescription
 } from './style'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import { setRide } from '../../redux/action/ride'
import { setUser } from '../../redux/action/auth'
import { setFinish } from '../../redux/action/finish'
import { setOut } from '../../redux/action/out'

import Countdown from '../Countdown'

import _ from 'lodash'

import Sound from 'react-native-sound'

import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

var alert = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
	}
})

class Details extends Component {
	state = {
		loading: false,
		timeout: null,

		//ride canceled
		ride: {},
		isRideCanceled: false,
		taxCanceled: 0,
		deliveryPaid: false,

		// time
		time: 5
	}


	async componentDidMount(){
		if(!this.props.user.onRide && this.props.isRide && this.props.user.rideStatus){
			alert.play((success) => {
				if (success) {
				} else {
					console.log('playback failed due to audio decoding errors');
				}
			});
		}

		await firebase.database().ref(`rides/${this.props.ride.id}`).on('value', snapRide => {
			let ride = snapRide.val()
			if(ride !== null){
				if(ride.status === 'canceled'){
					this.setState({ isRideCanceled: true, taxCanceled: ride.taxCanceled, ride: {} })
				} else {
					this.setState({ ride })
				}
			}
		})
	}


	handleAcceptRide = async () => {
		this.props.setFinish(true)
		this.setState({ loading: true })
		axios.post(this.props.api.updateRide, {
			ride: JSON.stringify(this.state.ride),
			motoboy: JSON.stringify(this.props.user),
			// latitude: this.props.user.latitude,
			// longitude: this.props.user.longitude,
			// localizacao: this.props.user.localizacao,
			time: this.props.time,
			status: 'onWay'
		})
			.then((response) => {
				this.props.setFinish(true)
					this.props.setRide({
						...this.state.ride,
						status: 'onWay'
					})
					this.props.setUser({
						...this.props.user,
						onRide: true,
						activeRide: this.state.ride,
						earnings: this.props.user.earnings ? [ ...Object.values(this.props.user.earnings) ,{ date: this.state.ride.createdAt, tax: this.state.ride.taxMotoboy }] : [{ date: this.state.ride.createdAt, tax: this.state.ride.taxMotoboy }],
						earningsManutencao: this.props.user.earnings ? [ ...Object.values(this.props.user.earnings) ,{ date: this.state.ride.createdAt, tax: this.state.ride.taxManutencao }] : [{ date: this.state.ride.createdAt, tax: this.state.ride.taxManutencao }],
						rides: this.props.user.rides ? [...Object.values(this.props.user.rides), this.state.ride] : [this.state.ride]
					})
					this.setState({ loading: false })
			})
			.catch(err => console.log(err))
	}


	handleRide = (ride) => {

		if(ride && ride.status && ride.status.length > 0){

			let restaurantLat = ride.restaurant.latitude
			let restaurantLong = ride.restaurant.longitude
			let deliveryLat = ride.delivery.latitude
			let deliveryLong = ride.delivery.longitude

			if(ride.status === 'pending'){
				return (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
						<Fragment>
							<TypeTitle>Você tem uma entrega disponível</TypeTitle>
							<TypeDescription>Clique abaixo para aceitar</TypeDescription>
						</Fragment>
						{this.state.loading ? <Spinner /> : (
								<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
									<TouchableOpacity onPress={this.handleAcceptRide} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#54fa2a', borderRadius: 60}}>
										<Countdown style={{ fontSize: 50, color: '#666', padding: 10, fontWeigth: '400',}} />
									</TouchableOpacity>
							</View>
						)}
						<Fragment>
							<TypeDescription>{this.props.ride.restaurant.nome} </TypeDescription>
							<RNSlidingButton
									style={{
										backgroundColor: '#cc2900',
										width: 280,
										padding: 25,
										borderRadius: 5,
									}}
									height={50}
									onSlidingSuccess={this.refuseRide}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
											RECUSAR >>>
										</Text>
									</View>
								</RNSlidingButton>
							</Fragment>
					</View>
				)
			} else if( ride.status === 'onWay'){
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
								<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
								</View>
								<Fragment>
								<RNSlidingButton
										style={{
											backgroundColor: '#363777',
											borderRadius: 5,
											width: 280,
											padding: 25
										}}
									height={50}
										onSlidingSuccess={this.onRestaurant}
										slideDirection={SlideDirection.RIGHT}>
										<View>
											<Text numberOfLines={1} style={style.textSlide}>
												NO RESTAURANTE >>>
											</Text>
										</View>
									</RNSlidingButton>
								</Fragment>
						</Fragment>
					)		
				}
			} else if(ride.status === 'onRestaurant' && !ride.retorno){
				if(this.state.loading){
					return <Spinner />
				} else { 
					return(
						<Fragment>
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							</View>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
								<RNSlidingButton
										style={{
											backgroundColor: '#363777',
											borderRadius: 5,
											width: 280,
											padding: 25
										}}
									height={50}
										onSlidingSuccess={this.startDelivery}
										slideDirection={SlideDirection.RIGHT}>
										<View>
											<Text numberOfLines={1} style={style.textSlide}>
												INICIAR ENTREGA >>>
											</Text>
										</View>
									</RNSlidingButton>
							</Fragment>
					</Fragment>
					)
				}
			}
			else if( ride.status === 'onRestaurant' && ride.retorno ) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
								<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
								</View>
								<RNSlidingButton
										style={{
											backgroundColor: '#363777',
											borderRadius: 5,
											width: 280,
											padding: 25
										}}
									height={50}
										onSlidingSuccess={this.startDelivery}
										slideDirection={SlideDirection.RIGHT}>
										<View>
											<Text numberOfLines={1} style={style.textSlide}>
												INICIAR ENTREGA >>>
											</Text>
										</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			} else if( ride.status === 'onDelivery') {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={() => !this.state.isRideCanceled ? ride.retorno ? this.wayBack() : this.finishDelivery() : false}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{ride.retorno ? 'RETORNAR RESTAURANTE >>>' : 'FINALIZAR >>>'}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			} else if( ride.status === 'onBackWay' && ride.retorno) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={() => !this.state.isRideCanceled ? this.finishDelivery() : false}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'FINALIZAR >>>'}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			} 
			else if( ride.status === 'finished' && ride.retorno) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={this.dismiss}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'FINALIZAR >>> '}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			} else if(ride.status === 'finished' && !ride.retorno){
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={this.dismiss}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'PROSSEGUIR >>> '}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			}
			else if (ride.status === 'canceled' || ride.status === undefined || ride.status === null) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={this.dismiss}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'FINALIZAR >>> '}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			} else if (ride.status === undefined || ride.status === null ) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							</View>
							<RNSlidingButton
									style={{
										backgroundColor: '#363777',
										borderRadius: 5,
										width: 280,
										padding: 25
									}}
								height={50}
									onSlidingSuccess={this.dismiss}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'PROSSEGUIR >>> '}
										</Text>
									</View>
									</RNSlidingButton>
						</Fragment>
					)		
				}
			}
		} 
	}

	openGoogleMaps = (lat , lng ) => {
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = 'Destino';
    const url = Platform.select({
      ios: `https://www.google.com/maps/search/?api=1&query=${label}&center=${lat},${lng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.canOpenURL(url)
    .then((supported) => {
        if (!supported) {
            browser_url =`http://maps.google.com/maps?daddr=${lat},${lng}`
            // "https://www.google.de/maps/@" +
            // lat +
            // "," +
            // lng +
            // "?q=" +
            // label;
            return Linking.openURL(browser_url);
        } else {
            return Linking.openURL(url);
        }
    })
    .catch((err) => console.log('error', err));
	}

	refuseRide = async () => {
		this.setState({ loading: true})
		await axios.post(this.props.api.transferRide, {
			motoboy: JSON.stringify(this.props.user),
			ride: JSON.stringify(this.props.ride)
		})
			.then((response) => {
				this.setState({ loading: false})
				Alert.alert('Atenção', 'Você está atrasado e isto impactará em sua avaliação')
				console.log(response)
			})
			.catch(err => {
				this.setState({ loading: false})
				console.log(err)
			})
	}

	onRestaurant = async () => {
		this.setState({ loading: true})
		if(!this.state.isRideCanceled){
			await axios.post(this.props.api.updateRide, {
				ride: JSON.stringify(this.state.ride),
				motoboy: JSON.stringify(this.props.user),
				time: this.props.time,
				time: this.props.time,
				status: 'onRestaurant'
			})
				.then(() => {
					this.props.setRide({
						...this.state.ride,
						status: 'onRestaurant'
					})
					this.setState({ loading: false})
				})
				.catch(err => {
					this.setState({ loading: false})
					console.log(err)
				})
		} else {
			this.setState({ loading: false })
		}
	}

	startDelivery = async () => {
		this.setState({ loading: true})
	await	axios.post(this.props.api.updateRide, {
			ride: JSON.stringify(this.state.ride),
			motoboy: JSON.stringify(this.props.user),
			time: this.props.time,
			time: this.props.time,
			status: 'onDelivery'
		})
			.then(() => {
				this.props.setRide({
					...this.state.ride,
					status: 'onDelivery'
				})
				this.setState({ loading: false})
			})
			.catch(err => {
				this.setState({ loading: false})
				console.log(err)
			})
	}

	wayBack = async () => {
		this.setState({ loading: true})
		await axios.post(this.props.api.updateRide, {
			ride: JSON.stringify(this.state.ride),
			motoboy: JSON.stringify(this.props.user),
			time: this.props.time,
			time: this.props.time,
			status: 'onBackWay'
		})
			.then(() => {
				this.props.setRide({
					...this.state.ride,
					status: 'onBackWay'
				})
				this.setState({ loading: false})
			})
			.catch(err => {
				this.setState({ loading: false})
				console.log(err)
			})
	}

	finishDelivery = async () => {
		this.setState({ loading: true})
		await axios.post(this.props.api.finishRide, {
			ride: JSON.stringify(this.state.ride),
			motoboy: JSON.stringify(this.props.user),
			isRideCanceled: this.state.isRideCanceled
		})
			.then(() => {
				this.props.setRide({
					...this.state.ride,
					status: 'finished'
				})
				this.setState({ loading: false})
			})
			.catch(err => {
				this.setState({ loading: false})
				console.log(err)
			})
	}

	
	dismiss = async () => {
		this.props.setFinish(false)
		this.setState({ loading: false})
	}

	render(){
		const { ride } = this.props
		return (
			<Container status={this.state.isRideCanceled ? this.state.ride.status : ride.status}>
				{this.handleRide(this.state.isRideCanceled ? this.state.ride : ride)}
			</Container>
    )
	}	
}

const style = {
	textSlide :{
		color: '#fff',
		fontSize: 16,
		padding: 25,
		fontWeight: '700'
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	api: state.api.api,
})

export default connect(mapStateToProps, { setRide, setUser, setFinish, setOut })(Details)