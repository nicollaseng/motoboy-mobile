import React, { Component, Fragment } from  'react'
import { View, TouchableOpacity, Platform, Linking, PushNotificationIOS, Image, Alert, Text} from 'react-native'
import { Thumbnail, Spinner } from 'native-base'
import { 
	Container, TypeTitle, TypeDescription, TypeImage, RequestButton, RequestButtonText, RestaurantButton
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
import VMasker from 'vanilla-masker'

import Sound from 'react-native-sound'
import PushNotification from 'react-native-push-notification'

import TimerCountdown from "react-native-timer-countdown";
import Icon from 'react-native-vector-icons/FontAwesome5'

import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

const today = moment().format('DD/MM/YYYY')

PushNotification.configure({

	// (required) Called when a remote or local notification is opened or received
	onNotification: function(notification) {
			console.log( 'NOTIFICATION:', notification );
			// process the notification
			// required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
			notification.finish(PushNotificationIOS.FetchResult.NoData);
	},

	// Should the initial notification be popped automatically
	// default: true
	popInitialNotification: true,

	/**
		* (optional) default: true
		* - Specified if permissions (ios) and token (android and ios) will requested or not,
		* - if not, you must call PushNotificationsHandler.requestPermissions() later
		*/
	requestPermissions: true,
	foreground: false,
});

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
		// const timeout = setTimeout(() => this.refuseRide(), 10*2000);
			// this.setState({ timeout })
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
				// if(ride.motoboy && Object.values(ride.motoboy).length > 0 && ride.motoboy.id !== this.props.user.id){
				// 	this.props.setUser({
				// 		...this.props.user,
				// 		onRide: false,
				// 		activeRide: false,
				// 	})
				// 	this.setState({ loading: false })
					// return this.props.setRide(false)
				// }
			}
		})
	}

	handleAcceptRide = async () => {

		this.props.setFinish(true)

		this.setState({ loading: true })

		// 1 - check if there is motoboy record at ride choosed if true refuse ride not on server
		await firebase.database().ref(`rides/${this.state.ride.id}`).once('value', async snapRide => {
			if(snapRide.val().motoboy && Object.values(snapRide.val().motoboy).length > 0){
				this.props.setUser({
					...this.props.user,
					onRide: false,
					activeRide: false,
				})
				this.setState({ loading: false })
				return this.props.setRide(false)
			} else { 
				// if not motoboy then proceed to accept ride
				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					onRide: true,
					activeRide: this.state.ride,
				})
					.then(async () => {
						await firebase.database().ref(`rides/${this.state.ride.id}`).update({
							status: 'onWay',
							motoboy: {
								nome: this.props.user.nome,
								telefone: this.props.user.celular,
								id: this.props.user.id
							}
						})
							.then(() => {
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
							.catch(error => {
								this.setState({ loading: false })
								console.log('error updating ride status', error)
							})
					})
					.catch(error => {
						console.log('error updating motoboy', error)
						Alert.alert('Atenção', 'Houve uma falha, favor tente novamente em instantes')
						this.setState({ loading: false })
					})
			}
		})
	}

	cancelOut = () => {
		// this.props.setOut(false)
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
											DESLIZE PARA RECUSAR >>>
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
							{/* <Fragment>
								<RestaurantButton onPress={() => !this.state.isRideCanceled ? ride.retorno ? this.wayBack() : this.finishDelivery() : false}>
									<RequestButtonText>{ride.retorno ? 'Retornar Restaurante' : 'Finalizar'}</RequestButtonText>
								</RestaurantButton>
							</Fragment> */}
						</Fragment>
					)		
				}
			} else if( ride.status === 'onBackWay' && ride.retorno) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							{/* <TypeTitle>Clique na imagem abaixo para iniciar uma navegação externa</TypeTitle> */}
							{/* <TypeDescription>Clique em finalizar somente após retornar ao restaurante</TypeDescription> */}
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
									onSlidingSuccess={() => !this.state.isRideCanceled ? this.finishDelivery() : false}
									slideDirection={SlideDirection.RIGHT}>
									<View>
										<Text numberOfLines={1} style={style.textSlide}>
										{'FINALIZAR >>>'}
										</Text>
									</View>
									</RNSlidingButton>
							{/* <Fragment>
								<RestaurantButton onPress={() => !this.state.isRideCanceled ? this.finishDelivery() : false}>
									<RequestButtonText>{'Finalizar'}</RequestButtonText>
								</RestaurantButton>
							</Fragment> */}
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
							{/* <TypeTitle>Obrigado por essa viagem</TypeTitle>
							<TypeDescription>Receba do estabelecimento o valor abaixo</TypeDescription> */}
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							{/* <Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
								{/* <TypeTitle>R$ {ride.taxMotoboy.toString().replace('.',',')}0</TypeTitle> */}
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
								{/* <Fragment>
									<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
									<RestaurantButton onPress={this.dismiss}>
										<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
									</RestaurantButton>
								</Fragment> */}
						</Fragment>
					)		
				}
			} else if(ride.status === 'finished' && !ride.retorno){
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							{/* <TypeTitle>Obrigado por essa viagem</TypeTitle>
							<TypeDescription>Receba do estabelecimento o valor abaixo</TypeDescription> */}
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							{/* <Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
								{/* <TypeTitle>R$ {ride.taxMotoboy.toString().replace('.',',')}0</TypeTitle> */}
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
								{/* <Fragment>
									<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
									<RestaurantButton onPress={this.dismiss}>
										<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
									</RestaurantButton>
								</Fragment> */}
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
							{/* <TypeTitle>Obrigado por essa viagem</TypeTitle>
							<TypeDescription>Receba do estabelecimento o valor abaixo</TypeDescription> */}
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							{/* <Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
								{/* <TypeTitle>R$ {ride.taxMotoboy.toString().replace('.',',')}0</TypeTitle> */}
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
								{/* <Fragment>
									<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
									<RestaurantButton onPress={this.dismiss}>
										<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
									</RestaurantButton>
								</Fragment> */}
						</Fragment>
					)		
				}
			} else if (ride.status === undefined || ride.status === null ) {
				if(this.state.loading){
					return <Spinner />
				} else {
					return (
						<Fragment>
							{/* <TypeTitle>Obrigado por essa viagem</TypeTitle>
							<TypeDescription>Receba do estabelecimento o valor abaixo</TypeDescription> */}
							<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							{/* <Text style={{ fontSize: 50, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '400'}}>R$ {ride.taxMotoboy.toString().includes('.') ? `${ride.taxMotoboy.toString().replace('.',',')}0` : `${ride.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
								{/* <TypeTitle>R$ {ride.taxMotoboy.toString().replace('.',',')}0</TypeTitle> */}
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
								{/* <Fragment>
									<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
									<RestaurantButton onPress={this.dismiss}>
										<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
									</RestaurantButton>
								</Fragment> */}
						</Fragment>
					)		
				}
			}
		} 
		// else if (ride.status === undefined) {
		// 	const { taxCanceled } = this.state
		// 	return (
		// 		<Fragment>
		// 			<TypeTitle>Viagem cancelada pelo estabelecimento</TypeTitle>
		// 			<TypeDescription>Você será pago pelo seu deslocamento. Confira em seus pagamentos.</TypeDescription>
		// 			<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
		// 				<TypeTitle>R$ {VMasker.toMoney(taxCanceled)}</TypeTitle>
		// 			</View>
		// 				<Fragment>
		// 					<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
		// 					<RestaurantButton onPress={this.dismiss}>
		// 						<RequestButtonText>{'PROSSEGUIR'}</RequestButtonText>
		// 					</RestaurantButton>
		// 				</Fragment>
		// 		</Fragment>	
		// 	)
		// }
	}

	openGoogleMaps = (lat , lng ) => {
		console.log('latitude and longitude passing', lat, lng)
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

	// transferRide = async (ride) => {
	// 	console.log('ride a ser transferido', ride)
	// 	const { latitude, longitude } = ride.restaurant
	// 	await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', async snap => {
	// 		if(snap.val() !== null){
	// 			let motoboys = Object.values(snap.val())
	// 			let motoboyActive =  _.filter(Object.values(motoboys), e => {
	// 				if(e.latitude && e.longitude){
	// 					return !e.onRide  &&  e.rideStatus && !e.pendingRideId && e.id !== this.props.user.id &&geolib.getDistance(
	// 						{ latitude: e.latitude, longitude: e.longitude },
	// 						{ latitude, longitude }
	// 					 ) <= 4000 //if another motoboy has accept nothing must happen
	// 				}
	// 			})
	// 			if(motoboyActive &&  motoboyActive.length > 0){
	// 				let motoboySelected = _.sample(motoboyActive)
	// 				console.log('MOTOBOY SELECIONADO DEPOIS DE CLICAR EM RECUSAR', motoboySelected, motoboySelected.id, ride.id)
	// 				await firebase.database().ref(`register/commerce/motoboyPartner/${motoboySelected.id}`).update({
	// 					pendingRideId: ride.id,
	// 					ride: ride
	// 				})
	// 					.then(() => {
	// 						console.log('SUCCESS TRANSFER RIDE FOR ANOTHER MOTOBOY AFTER CLICK ON RECUSAR')
	// 					})
	// 					.catch(error => {
	// 						console.log('ERROR TRANSFER RIDE FOR ANOTHER MOTOBOY AFTER CLICK ON RECUSAR', error)
	// 					})
	// 			} else {
	// 				this.props.setFinish(false)
	// 				await firebase.database().ref(`rides/${ride.id}`).update({
	// 					motoboyId: false,
	// 					free: true
	// 				})
	// 			}
	// 		}
	// 	})
	// }

	refuseRide = async () => {
		this.setState({ loading: true, time: 10 })

		this.props.setFinish(true) // CLEAR COUNTDOWN

		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value', async snapshot => {
			let user = snapshot.val()
			if(this.state.ride.id){
				await firebase.database().ref(`rides/${this.state.ride.id}`).update({
					refusedBy: [this.props.user.id],
					pendingMotoboyId: false,
					free: true,
					pendingMotboyId: false,
					motoboyId: false,
				})
					.then(async () => {
							await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
								ridesRefused: user.ridesRefused ? [...user.ridesRefused, this.state.ride.id] : [this.state.ride.id],
									onRide: false,
									activeRide: false,
									pendingRideId: false,
									ride: false,
									rideId: false, 
							})
								.then(() => {
									// console.log('ride que sera trasnferido', this.state.ride)
									// this.transferRide(this.state.ride)
									this.props.setUser({
										...this.props.user,
										onRide: false,
										activeRide: false,
									})
									this.setState({ loading: false })
									this.props.setFinish(false)
									return this.props.setRide(false)
								})
								.catch(error => {
									this.props.setFinish(false)
									this.setState({ loading: false })
									console.log('error refusing ride', error)
								})
					})
					.catch(error => {
						this.props.setFinish(false)
						console.log('error updating ride with refused id', error)
					})
			}
		})
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
		// const { taxCanceled, isRideCanceled, ride } = this.state
		// await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value', async snap => {
		// 	let motoboy = snap.val()
		// 	let index;
		// 	let motoboyEarning = []
		// 	let motoboyEarningManutencao = []
		// 		if(motoboy.earnings && Object.values(motoboy.earnings).length > 0){
		// 			motoboyEarning = Object.values(motoboy.earnings)
		// 			index = _.findIndex(motoboyEarning, e => e.date === today)
		// 			if(index !== -1){
		// 				motoboyEarning[index] = { date: today, tax: [...motoboyEarning[index].tax, isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]}
		// 			} else {
		// 				motoboyEarning.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]}) 
		// 			}
		// 		} else {
		// 			motoboyEarning.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxMotoboy]})
		// 		}

		// 		if(motoboy.earningsManutencao && Object.values(motoboy.earningsManutencao).length > 0){
		// 			motoboyEarningManutencao = Object.values(motoboy.earningsManutencao)
		// 			index = _.findIndex(motoboyEarningManutencao, e => e.date === today)
		// 			if(index !== -1){
		// 				motoboyEarningManutencao[index] = { date: today, tax: [...motoboyEarningManutencao[index].tax, isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]}
		// 			} else {
		// 				motoboyEarningManutencao.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]}) 
		// 			}
		// 		} else {
		// 			motoboyEarningManutencao.push({ date: today, tax: [isRideCanceled ? taxCanceled : this.state.ride.taxManutencao]})
		// 		}

		// 		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
		// 			earnings: motoboyEarning,
		// 			earningsManutencao: motoboyEarningManutencao,
		// 			rides: this.props.user.rides ? [...Object.values(this.props.user.rides), isRideCanceled ? ride : this.state.ride] : [isRideCanceled ? ride : this.state.ride],
		// 			// onRide: false,
		// 			// activeRide: false,
		// 			// pendingRideId: false,
		// 			// ride: false,
		// 			// rideId: false,
		// 			// awaiting: false,
		// 		})
		// 			.then(async () => {
		// 				this.props.setFinish(false)
		// 				this.setState({ loading: false})
		// 				console.log('successfully set earning and rite for motoboy')
		// 				// return this.props.setRide(false)
		// 				}
		// 			)
		// 			.catch(error => {
		// 				this.props.setFinish(false)
		// 				// this.props.setRide(false)
		// 				this.setState({ loading: false})
		// 				console.log('error set earning and rite for motoboy', error)
		// 			})
		// })
		this.setState({ loading: false})
		console.log('successfully finished ride')
	}

	render(){
		const { ride } = this.props
		console.log('is ride canceled', this.state.isRideCanceled)
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
})

export default connect(mapStateToProps, { setRide, setUser, setFinish, setOut })(Details)