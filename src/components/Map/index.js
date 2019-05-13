import React, { Component, Fragment } from  'react'
import { View, Image, Text, AppState, Platform } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { withNavigation } from 'react-navigation'

import Search from '../Search'
import Directions from '../Directions'
import Details from '../Details'
import Active from '../Active'
import EarningBar from '../EarningBar'
import Info from '../Info'
import Refresh from '../Refresh'
import Terms from '../Terms'

import { connect } from 'react-redux'
import * as firebase from 'firebase'

import { getPixelSize } from '../../utils'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'
import menuImage from '../../assets/menu.png'

import { setUser } from '../../redux/action/auth'
import { setRide } from '../../redux/action/ride'

import { LocationBox, LocationText, LocationTimeText, LocationTimeBox, LocationTimeTextSmall, Back, Menu } from './styles'

import Geocoder from 'react-native-geocoding';
import geolib from 'geolib'

import _ from 'lodash'
import moment from 'moment'

import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { ONE_SIGNAL_ID, ONE_SIGNAL_TEST } from '../../utils/constants'
import { isTest } from '../../firebase/test'

import TimerCountdown from "react-native-timer-countdown";
import Sound from 'react-native-sound'

import Modal from "react-native-modal";


Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")

const refresh = Math.floor((Math.random() * 100000000000) + 1)
const updateId = '71c457d0-7294-11e9-94cb-eb86a10ade79'

var alert = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
	}
})

var refuseAlert = new Sound('refuse.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
	}
})

class Map extends Component {

	constructor(props){
		super(props)
		this.state = {
			region: null,
			destination: null,
			duration: null,
			location: null,
			
			//ride
			ride: null,
			isRide: false,
			rideDistance: null,
			rideTime: 10,
	
			//earning
			earning: 0,
	
			//foreground
			appState: AppState.currentState,

			initialMilliseconds: 0,
			delay: false,
			time: 10,

			//modal
			openModal: false,
		}
	}

		onReceived(notification) {
			console.log("Notification received: ", notification);
	  }
	
	  onOpened(openResult) {
			console.log('Message: ', openResult.notification.payload.body);
			console.log('Data: ', openResult.notification.payload.additionalData);
			console.log('isActive: ', openResult.notification.isAppInFocus);
			console.log('openResult: ', openResult);
	  }
	
	  onIds(device) {
			console.log('Device info: ', device);
	  }


	async componentWillMount(){
		let userDeviceId;
			// OneSignal.init(isTest ? ONE_SIGNAL_TEST : ONE_SIGNAL_ID, {
			// 	kOSSettingsKeyAutoPrompt: true,
			// 	kOSSettingsKeyInFocusDisplayOption:2,
			// });
			OneSignal.getPermissionSubscriptionState( (status) => {
				userDeviceId =  status.userId;
				if(!this.props.user.userDeviceId){
				firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					userDeviceId
				})
					.then(() => {
						console.log('successfully update userDeviceId')
					})
					.catch((error) => {
						console.log('error update userDeviceId', error)
					})
				}
				this.setState({ userDeviceId })
			});
	}


	async componentDidMount(){
		// setTimeout( () => {
		// 	firebase.database().ref(`rides/${updateId}`).update({
		// 		voyageNumber: refresh,
		// 	})
		//  }, 90000);
		  // 2,2 mintus reload page
		//  ec87c3f0-7288-11e9-957c-afb9416aeeb7

		// OneSignal.init(isTest ? ONE_SIGNAL_TEST : ONE_SIGNAL_ID, {
		// 	kOSSettingsKeyAutoPrompt: true,
		// 	kOSSettingsKeyInFocusDisplayOption:2,
		// });
		// 	OneSignal.addEventListener('received', this.onReceived);
		// 	OneSignal.addEventListener('opened', this.onOpened);
		// 	OneSignal.addEventListener('ids', this.onIds);

		AppState.addEventListener('change', this._handleAppStateChange);
		 console.log('antes da dando certo')

		navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
			const response = await Geocoder.from({ latitude, longitude })
			const address = response.results[0].formatted_address
			const location = address.substring(0, address.indexOf(','))

			// UPDATE FIREBASE WITH MOTOBOY POSITION

			firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				latitude,
				longitude
			})
				.then(() => {})
				.catch(error => console.log('error update latitude and longitude of motoboy'))
			
			// END FIREBASE WITH MOTOBOY POSITION


			firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', async snapshot => {
				let motoboy = snapshot.val()

				// START - CHECK IF TERMS ARE TRUE
				if(!motoboy.terms){
					this.setState({ openModal: true })
				} else {
					this.setState({ openModal: false })
				}
				// END - CHECK IF TERMS ARE TRUE

				// START - GIVE 5 REAIS FOR EACH 10 RIDES ON DAY
				if(motoboy.earnings && Object.values(motoboy.earnings).length > 0){
					let earnings = Object.values(motoboy.earnings)
					let momentToday = moment().format('DD/MM/YYYY')
					let earningToday = []
					let toPay = []
					let payToday = []

					let earningFiltered = _.filter(earnings, e => e.date.substring(0,10) === momentToday)

					earningFiltered.map(earning => {
						earning.tax.map(earn => {
							return earningToday = [...earningToday, earn]
						})
					})

					if(earningToday.length > 0 && earningToday.length % 10 === 0){
						earningToday.push(5) 
						let index = _.findIndex(earnings, e => e === earningFiltered[0])
						earnings[index].tax = earningToday
						await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
							earnings,
							rating: motoboy.isRated ? motoboy.rating : [5],
							isRated: true
						})
					} else if(earningToday.length > 0 && earningToday.length % 10 !== 0){
							this.setState({ earning: earningToday.reduce((a,b) => a+b, 0) })
					}
				}
				// END - GIVE 5 REAIS FOR EACH 10 RIDES ON DAY

				// START - MAKE SURE THAT IS RIDE AND RIDE ARE SET ON A RIDE
				if(motoboy.onRide && motoboy.rideStatus){
				 firebase.database().ref(`rides/${motoboy.activeRide.id}`).once('value', snap => {
					 if(snap.val() !== null){
						console.log('CORRIDA PERDIDA', snap.val())
						this.setState({ isRide: true, ride: snap.val()})
					 }
				 })
				}
				// END - MAKE SURE THAT IS RIDE AND RIDE ARE SET ON A RIDE

				this.props.setUser(motoboy)

				// START - CHECK IF THERE IS A RIDE AVAILABLE FOR MOTOBOY

				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', r => {
					let motoride = r.val()
					if(!motoride.onRide && motoride.rideStatus && motoride.pendingRideId && motoride.pendingRideId.length > 0){
						this.setState({
							ride: motoride.ride,
							isRide: true,
							initialMilliseconds: 1000*10
						})
						this.delayRide()
					} 
				})

				// firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', snap => {
				// 	let m = snap.val()
				// 	if(m.rideStatus && !m.onRide && !m.awaiting){ 
				// 		console.log('ENTROU AQUI MESMO NAO DEVENDO')
				// 		firebase.database().ref(`rides`).on('value', async rideshot => {
				// 			if(rideshot.val() !== null){
				// 				let nearRide = []
				// 				 nearRide = _.filter(Object.values(rideshot.val()), e => {
				// 					return geolib.getDistance(
				// 						{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
				// 						{ latitude, longitude }
				// 					 ) <= 4000 && e.status === 'pending' && !e.motoboy //if another motoboy has accept nothing must happen
				// 				})
				// 					console.log('DISTANCIAS', nearRide)
	
				// 			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).once('value',async r => {
				// 				let moto = r.val()
				// 				if(nearRide.length > 0 && moto.rideStatus && !moto.onRide && !moto.awaiting){
				// 					let ride = _.sample(nearRide)
				// 					let isRideRefused = _.filter(moto.ridesRefused, e => e === ride.id)
				// 					if((ride.awaiting && ride.awaiting.length > 0) || isRideRefused.length > 0){
										
				// 						this.setState({ isRide: false, ride: null })
				// 						firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				// 							awaiting: false
				// 						})

				// 					} else {
				// 						await firebase.database().ref(`rides/${ride.id}`).update({
				// 							awaiting: ride.awaiting && ride.awaiting.lenght > 0 ? [...ride.awaiting, this.props.user.id] : [this.props.user.id]
				// 						})
				// 							.then(async () => {
				// 								await firebase.database().ref(`rides/${ride.id}`).once('value', async snap => {
				// 									let ride2 = snap.val()
				// 									console.log('primeiro elemento', ride2.awaiting[0])
				// 									if(ride2.awaiting[0] !== this.props.user.id){

				// 										firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				// 											awaiting: false
				// 										})
														
				// 										this.setState({ isRide: false, ride: null})
				// 									} else {
				// 										await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				// 											awaiting: true
				// 										})
				// 											.then(() => {
				// 												this.setState({ isRide: true, ride, initialMilliseconds: 1000*10 })
				// 											})
				// 											.catch(error => {
				// 												console.log('error update motoboy with awaiting true', error)
				// 											})
				// 									}
				// 								})
				// 							})
				// 							.catch(error => {
				// 								console.log('error update ride with motoboy status', error)
				// 							})
				// 					}
									
				// 					// let rideRefused = _.filter(motoboy.rideRefused, e => e.id === ride.id)
				// 					// 	if(rideRefused.length > 0 ){
				// 					// 		this.setState({ isRide: false })
				// 					// 	} else if(rideRefused.length === 0) {
										
				// 						// }
				// 					} 
				// 					// else {
				// 					// 	this.setState({ isRide: false, ride: null })
				// 					// }
				// 				})
				// 			}
				// 		})
				// 	} 
				// 	// else {
				// 	// 	this.setState({ isRide: false })
				// 	// }
				// })
				// if(((Object.values(motoboy.rating).reduce((a,b) => a+b,0))/(Object.values(motoboy.rating).length)).toFixed(2) < 4.5){
				// 	firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				// 		status: 'Bloqueado'
				// 	})
				// 		.then(() => {
				// 			return this.signOut()
				// 		})
				// 		.catch(error => {
				// 			console.log('error updating status to Bloqueado', error)
				// 		})
				// 	}
			})
				this.setState({
					location,
					region: {
						latitude,
						longitude,
						latitudeDelta: 0.0143,
						longitudeDelta: 0.0134
					}
				})
			}, //success,
			() => {}, //error
			{
				timeout: 50000,
				enableHighAccuracy: false,
				maximumAge: 1000,
			}
		) 
	}

	delayRide = () => {
		var timeleft = 10;
		// const delayNumber = 10
		let ride = this.props.ride && this.props.ride.status && this.props.ride.status.length >0 ? this.props.ride.status === 'pending' : this.state.ride.status === 'pending'
		if(this.state.initialMilliseconds > 0 && ride){
			var downloadTimer = setInterval(() => {
				timeleft--
				console.log(timeleft)
				this.setState({ time: parseInt(timeleft)} )
				if(timeleft === 0){
					// this.refuseRide()
					// this.setState({ initialMilliseconds: 0 })
					clearInterval(downloadTimer);
				}
			}, 1000);
		}
	}

	countDown = () => {
		let ride = this.props.ride && this.props.ride.status  && this.props.ride.status.length >0 ? this.props.ride.status === 'pending' : this.state.ride.status === 'pending'
		if(this.state.initialMilliseconds > 0 && ride){
			return (
				<View style={[styles.countdowncontainer]}>
					<TimerCountdown
						initialMilliseconds={this.state.initialMilliseconds}
						onTick={(milliseconds) => console.log(milliseconds)}
						onExpire={() => {
							this.refuseRide()
							console.log('expirou')
						}}
						formatMilliseconds={(milliseconds) => {
							const remainingSec = Math.round(milliseconds / 1000);
							const seconds = parseInt((remainingSec % 60).toString(), 10);
							const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
							const hours = parseInt((remainingSec / 3600).toString(), 10);
							const s = seconds < 10 ? '0' + seconds : seconds;
							const m = minutes < 10 ? '0' + minutes : minutes;
							let h = hours < 10 ? '0' + hours : hours;
							h = h === '00' ? '' : h + ':';
							return h + m + ':' + s;
						}}
						allowFontScaling={true}
						style={{ fontSize: 20 }}
				/>
				</View>
			)
		} else {
			return <View />
		}
	}

	refuseRide = async () => {
		console.log('state do refuse', this.state.ride.id, this.state, this.props.user, this.props.user.id)

		const { latitude, longitude } = this.state.ride.restaurant
		await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', async snap => {
			if(snap.val() !== null){
				let motoboys = Object.values(snap.val())
				let motoboyActive =  _.filter(Object.values(motoboys), e => {
					if(e.latitude && e.longitude){
						return !e.onRide  &&  e.rideStatus && !e.pendingRideId && geolib.getDistance(
							{ latitude: e.latitude, longitude: e.longitude },
							{ latitude, longitude }
						 ) <= 4000 //if another motoboy has accept nothing must happen
					}
				})
				if(motoboyActive &&  motoboyActive.length > 0){
					let motoboySelected = _.sample(motoboyActive)
					await firebase.database().ref(`register/commerce/motoboyPartner/${motoboySelected.id}`).update({
						pendingRideId: this.state.ride.id,
						ride: this.state.ride
					})
						.then(async () => {
							await firebase.database().ref(`rides/${this.state.ride.id}`).update({
								status: 'pending',
								pendingMotoboyId: false,
							})
								.then(async () => {
									await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
										ridesRefused: this.props.user.ridesRefused && this.props.user.ridesRefused.length > 0 ? 
											[...this.props.user.ridesRefused, this.state.ride.id] : [ this.state.ride.id ],
										pendingRideId: false,
										ride: false
									})
										.then(() => {
											this.setState({ initialMilliseconds: 0, isRide: false, ride: null })
											refuseAlert.play((success) => {
												if (success) {
													console.log('successfully finished playing');
												} else {
													console.log('playback failed due to audio decoding errors');
												}
											});
										})
										.catch(error => {
											console.log('error updating motoboy with ride refused', error)
										})
									
								})
								.catch(error => {
									console.log('error refusing ride after countdown', error)
								})
						})
						.catch(error => console.log(error))
				} else {
					this.setState({
						isRide: true,
						initialMilliseconds: 1000*10,
						time: 10
					})
					this.delayRide()

					alert.play((success) => {
						if (success) {
							console.log('successfully finished playing');
						} else {
							console.log('playback failed due to audio decoding errors');
						}
					});

				}
			}
		})
	}




	componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
	}
	
	_backgroundState(state) {
    return state.match(/inactive|background/);
	}
	
	_handleAppStateChange = async (nextAppState) => {
    if (this._backgroundState(nextAppState)) {
      console.log("App is going background");
    } else if (this._backgroundState(this.state.appState) && (nextAppState === 'active')) {
			return this.refresh()
    }
    this.setState({appState: nextAppState});
	}
	
	refresh = async () => {
		// await firebase.database().ref(`rides/${updateId}`).update({
		// 	voyageNumber: refresh,
		// })
		// 	.then(() => {
		// 		console.log('refresh done')
		// 	})
		// 	.catch(error => {
		// 		console.log('refresh error', error)
		// 	})
	}


	async componentWillReceiveProps(nextProps){
		const { ride } = nextProps
		if(nextProps.ride){
			if(
				ride.status === 'onRestaurant' ||
				ride.status === 'onDelivery' 
			) {
				this.setState({
					destination: {
						latitude: ride.delivery.latitude,
						longitude: ride.delivery.longitude,
						title: 'Destino Cliente',
					},
					isRide: true
				})
			} else if (
				ride.status === 'onWay' ||
				ride.status === 'onBackWay' 
			) {
				this.setState({
					destination: {
						latitude: ride.restaurant.latitude,
						longitude: ride.restaurant.longitude,
						title: 'Restaurante',
					},
					isRide: true
				})
			} else if(
				ride.status === 'canceled'
			) {
				this.setState({
					isRide: false,
					ride: null,
					destination: null
				})
			} else if(ride.status === 'finished'){
				this.setState({
					isRide: true,
					destination: null
				})
			} else if(ride.status === 'pending'){
				this.setState({
					isRide: true,
				})
			} 
		} else {
			this.setState({
				destination: null,
				isRide: false,
			})
		}
	 }

	signOut = async () => {
		await firebase.auth().signOut()
			.then(() => {
				this.props.navigation.navigate('Login')
			})
			.catch(error => {
				console.log('error signout', error)
			})
	}

	handleLocationSelected = (data, { geometry }) => {
		const { location: { lat: latitude, lng: longitude }} = geometry
		this.setState({
			destination: {
				latitude,
				longitude,
				title: data.structured_formatting.main_text,
			}
		})
	}

	handleBack = () => {
		this.setState({ destination: null })
	}

	handleMenu = () => {
		this.props.openDrawer()
	}

	render(){
		console.log('delay', this.state.isRide, this.state.ride, this.state.delay)
		// return <Text>Oi</Text>
		return (
			<View style={{ flex: 1 }}>
			 <Modal isVisible={this.state.openModal}>
          <Terms />
        </Modal>
				<MapView
						ref={el => this.mapView = el}
						style={{ flex: 1 }}
						region={this.state.region}
						showsUserLocation
						loadingEnabled
						mapType="standard"
            zoomEnabled={true}
            pitchEnabled={true}
            showsUserLocation={true}
            followsUserLocation={true}
            showsCompass={true}
            showsBuildings={true}
            showsTraffic={true}
            showsIndoors={true}
					>
						{this.state.destination && ( 
							<Fragment>
								<Directions 
									origin={this.state.region}
									destination={this.state.destination}
									onReady={(result) => {
										this.setState({
											duration: Math.floor(result.duration)
										})
										this.mapView.fitToCoordinates(result.coordinates, {
											edgePadding: {
												right: getPixelSize(50),
												left: getPixelSize(50),
												top: getPixelSize(50),
												bottom: getPixelSize(350)
											}
									})
								}}
							/>
							<Marker
								coordinate={this.state.destination} anchor={{ x: 0, y: 0 }} image={markerImage}
							>
								<LocationBox>
									<LocationText>
										{this.state.destination.title}
									</LocationText>
								</LocationBox>
							 </Marker>
							 <Marker
								coordinate={this.state.region} anchor={{ x: 0, y: 0 }} image={markerImage}
							>
								<LocationBox>
									<LocationTimeBox>
										<LocationTimeText>
											{this.state.duration}
										</LocationTimeText>
										<LocationTimeTextSmall>
											MIN
										</LocationTimeTextSmall>
									</LocationTimeBox>
									<LocationText>
										{this.state.location}
									</LocationText>
								</LocationBox>
							 </Marker>
							</Fragment>
						)}
					</MapView>

					{this.state.isRide ? (
						<Fragment>
							<Info
								pedido={this.props.ride ? this.props.ride : this.state.ride}
							/>
							{}
							{this.countDown()}
							<Details
								 time={this.state.time}
								 isRide={true}
								 duration={this.state.duration}
								 ride={this.props.ride ? this.props.ride : this.state.ride}
								 rideDistance={this.state.rideDistance}
							 />
						</Fragment>
					) : (
						<Fragment>
							<Menu onPress={this.handleMenu}>
								<Image source={menuImage} style={{ width: 30, height: 30, resizeMode: 'contain'}} />
							</Menu>
							<EarningBar earning={this.state.earning} />
							{/* <Search
								onLocationSelected={this.handleLocationSelected}
							/> */}
							<Refresh />
							<Active />
						</Fragment>
					)}


					{/* {this.state.destination ? (
						<Fragment>
							<Back onPress={this.handleBack}>
								<Image source={backImage} />
							</Back>
						</Fragment>
					)
					: 
					<Fragment>
						<Menu onPress={this.handleMenu}>
							<Image source={menuImage} style={{ width: 30, height: 30, resizeMode: 'contain'}} />
						</Menu>
						<Active />
					</Fragment>
					} */}
					
					{/* <Search
						onLocationSelected={this.handleLocationSelected}
					/> */}
			</View>
    )
	}	
}

const styles = {
	countdowncontainer: {
		// flex: 0.3,
		backgroundColor: "#fff",
		// alignItems: "center",
		// justifyContent: "center",
		position: 'absolute',
		top: Platform.select({
			ios: 60, android: 40
		}),
		right: 13,
		width: '0%',
		alignSelf: 'center',
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	ride: state.ride.ride
})

export default connect(mapStateToProps, { setUser, setRide })(withNavigation(Map))