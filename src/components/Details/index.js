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
import moment from 'moment'

import Sound from 'react-native-sound'

import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

const today = moment().format('DD/MM/YYYY')

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
					console.log('successfully finished playing');
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
			time: this.props.time,
			time: this.props.time,
			status: 'onWay'
		})
			.then((response) => {
				console.log(response)
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




		// // 1 - check if there is motoboy record at ride choosed if true refuse ride not on server
		// await firebase.database().ref(`rides/${this.state.ride.id}`).once('value', async snapRide => {
		// 	if(snapRide.val().motoboy && Object.values(snapRide.val().motoboy).length > 0){
		// 		this.props.setUser({
		// 			...this.props.user,
		// 			onRide: false,
		// 			activeRide: false,
		// 		})
		// 		this.setState({ loading: false })
		// 		return this.props.setRide(false)
		// 	} else { 
		// 		// if not motoboy then proceed to accept ride
		// 		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
		// 			onRide: true,
		// 			activeRide: this.state.ride,
		// 		})
		// 			.then(async () => {
		// 				await firebase.database().ref(`rides/${this.state.ride.id}`).update({
		// 					status: 'onWay',
		// 					motoboy: {
		// 						nome: this.props.user.nome,
		// 						telefone: this.props.user.telefone,
		// 						id: this.props.user.id
		// 					}
		// 				})
		// 					.then(() => {
		// 						this.props.setRide({
		// 							...this.state.ride,
		// 							status: 'onWay'
		// 						})
		// 						this.props.setUser({
		// 							...this.props.user,
		// 							onRide: true,
		// 							activeRide: this.state.ride,
		// 							earnings: this.props.user.earnings ? [ ...Object.values(this.props.user.earnings) ,{ date: this.state.ride.createdAt, tax: this.state.ride.taxMotoboy }] : [{ date: this.state.ride.createdAt, tax: this.state.ride.taxMotoboy }],
		// 							earningsManutencao: this.props.user.earnings ? [ ...Object.values(this.props.user.earnings) ,{ date: this.state.ride.createdAt, tax: this.state.ride.taxManutencao }] : [{ date: this.state.ride.createdAt, tax: this.state.ride.taxManutencao }],
		// 							rides: this.props.user.rides ? [...Object.values(this.props.user.rides), this.state.ride] : [this.state.ride]
		// 						})
		// 						this.setState({ loading: false })
		// 					})
		// 					.catch(error => {
		// 						this.setState({ loading: false })
		// 						console.log('error updating ride status', error)
		// 					})
		// 			})
		// 			.catch(error => {
		// 				console.log('error updating motoboy', error)
		// 				Alert.alert('Atenção', 'Houve uma falha, favor tente novamente em instantes')
		// 				this.setState({ loading: false })
		// 			})
		// 	}
		// })
	}


	handleRide = (ride) => {
		console.log(ride.status)

		if(ride && ride.status && ride.status.length > 0){

			let restaurantLat = ride.restaurant.latitude
			let restaurantLong = ride.restaurant.longitude
			let deliveryLat = ride.delivery.latitude
			let deliveryLong = ride.delivery.longitude

			if(ride.status === 'pending'){
				return (
					// <Fragment>
					// 	<TypeTitle>Obrigado por essa viagem</TypeTitle>
					// 	<TypeDescription>Receba do estabelecimento o valor abaixo</TypeDescription>
					// 	<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
					// 	<Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text>
					// 		{/* <TypeTitle>R$ {ride.taxMotoboy.toString().replace('.',',')}0</TypeTitle> */}
					// 	</View>
					// 		<Fragment>
					// 			<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
					// 			<RestaurantButton onPress={this.dismiss}>
					// 				<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
					// 			</RestaurantButton>
					// 		</Fragment>
					// </Fragment>
					
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
								{/* <RequestButton onPress={this.refuseRide}>
										<RequestButtonText>Recusar</RequestButtonText>
									</RequestButton> */}
							</Fragment>
					</View>
				)
			} else if( ride.status === 'onWay'){
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							{/* <TypeTitle>Clique no ícone abaixo para iniciar uma navegação externa</TypeTitle> */}
								<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
									{/* <TouchableOpacity onPress={() => {
											this.openGoogleMaps(restaurantLat, restaurantLong)
										}}>
											<Icon name="route" size={55} style={{ color: '#54fa2a'}} />
										</TouchableOpacity> */}
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
									{/* <RestaurantButton onPress={this.onRestaurant}>
										<RequestButtonText> NO RESTAURANTE </RequestButtonText>
									</RestaurantButton> */}
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
							{/* <TypeTitle>Essa viagem não tem retorno</TypeTitle> */}
							{/* <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 10, color: '#fff', padding: 5 }}>Antes de prosseguir receba do estabelecimento a sua taxa de entrega</Text> */}
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							{/* <Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
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
								{/* <RestaurantButton onPress={this.startDelivery}>
									<RequestButtonText>{'Iniciar Entrega'}</RequestButtonText>
								</RestaurantButton> */}
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
								{/* <TypeTitle>Clique na imagem abaixo para iniciar uma navegação externa</TypeTitle> */}
								<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
									{/* <TouchableOpacity onPress={() => {
										this.openGoogleMaps(deliveryLat, deliveryLong)
										}}>
											<Icon name="route" size={55} style={{ color: '#54fa2a'}} />
										</TouchableOpacity> */}
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
								{/* <Fragment>
									<RestaurantButton onPress={this.startDelivery}>
										<RequestButtonText>Iniciar entrega</RequestButtonText>
									</RestaurantButton>
								</Fragment> */}
						</Fragment>
					)		
				}
			} else if( ride.status === 'onDelivery') {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							{/* <TypeTitle>Clique na imagem abaixo para iniciar uma navegação externa</TypeTitle> */}
							<View style={{ flex: 1.0 ,justifyContent: 'center', alignItems: 'center', padding: 10}}>
								{/* <TouchableOpacity onPress={() => {
									this.openGoogleMaps(restaurantLat, restaurantLong)
									}}>
										<Icon name="route" size={55} style={{ color: '#54fa2a'}} />
									</TouchableOpacity> */}
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

	onRestaurant = async () => {
		this.setState({ loading: true })
		if(!this.state.isRideCanceled){
			await firebase.database().ref(`rides/${this.state.ride.id}`).update({
				status: 'onRestaurant'
			})
				.then(() => {
					this.props.setRide({
						...this.state.ride,
						status: 'onRestaurant'
					})
					this.setState({ loading: false})
				})
				.catch(error => {
					this.setState({ loading: false})
					console.log('error updating ride status', error)
				})
		} else {
			this.setState({ loading: false })
		}
	}

	startDelivery = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`rides/${this.state.ride.id}`).update({
			status: 'onDelivery'
		})
			.then(() => {
				this.props.setRide({
					...this.state.ride,
					status: 'onDelivery'
				})
				this.setState({ loading: false})
			})
			.catch(error => {
				this.setState({ loading: false})
				console.log('error updating ride status', error)
			})
	}

	wayBack = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`rides/${this.state.ride.id}`).update({
			status: 'onBackWay'
		})
			.then(() => {
				this.props.setRide({
					...this.state.ride,
					status: 'onBackWay'
				})
				this.setState({ loading: false})
			})
			.catch(error => {
				this.setState({ loading: false})
				console.log('error updating ride status', error)
			})
	}

	finishDelivery = async () => {
		this.setState({ loading: true })
		const { isRideCanceled } = this.state
		await firebase.database().ref(`rides/${this.state.ride.id}`).update({
			status: 'finished',
			motoboyId: false,
		})
			.then(async () => {

				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value', async snap => {
					let motoboy = snap.val()
					let index;
					let motoboyEarning = []
					let motoboyEarningManutencao = []
						if(motoboy.earnings && Object.values(motoboy.earnings).length > 0){
							motoboyEarning = Object.values(motoboy.earnings)
							index = _.findIndex(motoboyEarning, e => e.date === today)
							if(index !== -1){
								motoboyEarning[index] = { date: today, tax: [...motoboyEarning[index].tax, isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]}
							} else {
								motoboyEarning.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]}) 
							}
						} else {
							motoboyEarning.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]})
						}
		
						if(motoboy.earningsManutencao && Object.values(motoboy.earningsManutencao).length > 0){
							motoboyEarningManutencao = Object.values(motoboy.earningsManutencao)
							index = _.findIndex(motoboyEarningManutencao, e => e.date === today)
							if(index !== -1){
								motoboyEarningManutencao[index] = { date: today, tax: [...motoboyEarningManutencao[index].tax, isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]}
							} else {
								motoboyEarningManutencao.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]}) 
							}
						} else {
							motoboyEarningManutencao.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]})
						}
						await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
							pendingRideId: false,
							ride: false,
							onRide: false,
							rideId: false,
							activeRide: false,
							earnings: motoboyEarning,
							earningsManutencao: motoboyEarningManutencao,
							rides: this.props.user.rides ? [...Object.values(this.props.user.rides), isRideCanceled ? ride : this.state.ride] : [isRideCanceled ? ride : this.state.ride],
						})
							.then(() => {
								this.setState({ loading: false })
							})
							.catch(error => {
								this.setState({ loading: false })
								console.log('error updating user withou ride finished', error)
							})
					})
				this.props.setRide({
					...this.state.ride,
					status: 'finished'
				})
			})
			.catch(error => {
				this.setState({ loading: false})
				console.log('error updating ride status', error)
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