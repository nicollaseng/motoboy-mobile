import React, { Component, Fragment, DeviceEventEmitter } from  'react'
import { View, Image, Text, AppState, Platform, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

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

import { getPixelSize, getId } from '../../utils'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'
import menuImage from '../../assets/menu.png'

import { setUser } from '../../redux/action/auth'
import { setRide } from '../../redux/action/ride'
import { setOut } from '../../redux/action/out'

import { LocationBox, LocationText, LocationTimeText, LocationTimeBox, LocationTimeTextSmall, Back, Menu } from './styles'

import Geocoder from 'react-native-geocoding';
import geolib from 'geolib'

import _ from 'lodash'
import moment from 'moment'

import OneSignal from 'react-native-onesignal'; // Import package from node modules
import PushNotification from 'react-native-push-notification'
import Notification from 'react-native-android-local-notification';

import { ONE_SIGNAL_ID, ONE_SIGNAL_TEST } from '../../utils/constants'
import { isTest } from '../../firebase/test'

import TimerCountdown from "react-native-timer-countdown";
import Sound from 'react-native-sound'

import Modal from "react-native-modal";
import BackgroundTimer from 'react-native-background-timer';
import { getAppstoreAppVersion } from "react-native-appstore-version-checker";


let latestVersion = null

getAppstoreAppVersion("com.xdev.motoboysdeplantaodriver") //put any apps packageId here
  .then(appVersion => {
		latestVersion = appVersion
    console.log("clashofclans android app version on playstore", appVersion);
  })
  .catch(err => {
    console.log("error occurred", err);
	});


Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")


var alert = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
	alert.setVolume(100);
  if (error) {
    console.log('failed to load the sound', error);
	}
})

var refuseAlert = new Sound('refuse.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
	}
})

var rideAlert = new Sound('alert2.mp3', Sound.MAIN_BUNDLE, (error) => {

	rideAlert.setVolume(100);
	// rideAlert.setNumberOfLoops(3);

  if (error) {
    console.log('failed to load the sound', error);
	}
})

let userId;
getId().then(async id => {
		userId = id
})

console.log('userId', userId)

BackgroundTimer.runBackgroundTimer(() => { 
	navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
		
		firebase.database().ref(`register/commerce/motoboyPartner/${userId}`).once('value',async snap => {
			if(snap.val() !== null){
				let motoboy = snap.val()
				if(motoboy.rideStatus){
					const response = await Geocoder.from({ latitude, longitude })
					const address = response.results[0].formatted_address
					if(userId.length > 0 && userId !== 'none'){
						await firebase.database().ref(`register/commerce/motoboyPartner/${userId}`).update({
							latitude,
							longitude,
							localizacao: address,
						})
							.then(() => {
								console.log('atualizou posicao')
							})
							.catch(error => {
								console.log('nao atualizou posicao', error)
							})
					}
				} else {
					Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
				}
			}
		})
		}, //success,
	() => {}, //error
	{}
	)

	firebase.database().ref('status').once('value',async snap => {
		if(snap.val() !== null){
			let status = snap.val()
			console.log('status do servidor', status)
			if(!status.status){
				if(userId.length > 0 && userId !== 'none'){
					firebase.database().ref(`register/commerce/motoboyPartner/${userId}`).update({
						rideStatus: false,
						activeRide: false,
						rideId: false,
						ride: false,
						onRide: false,
					})
						.then( async () => {
								await firebase.auth().signOut()
									.then(() => {
										
										Alert.alert('Atenção', 'Você foi desconectado pois o sistema está em manutenção')
										// this.props.navigation.navigate('Login')
										Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
									})
									.catch(error => {
										Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
										console.log('error signout', error)
									})
						})
						.catch(error => {
							Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
							Alert.alert('Atenção', 'Houve um erro interno. Tente novamente em alguns instantes')
							console.log('error updating ridestatus', error)
						})
				}
			} 
		}
	})
}, 
10*1000);

BackgroundTimer.setInterval(() => {
	firebase.database().ref(`register/commerce/motoboyPartner/${userId}`).once('value',async snap => {
		if(snap.val() !== null){
			console.log('MOTOBOY NO TIMER2',  snap.val())
			let motoboy = snap.val()
			if(motoboy.rideStatus){
				if(!motoboy.onRide && motoboy.rideStatus && motoboy.rideId && motoboy.rideId.length > 0){
					await firebase.database().ref(`rides/${motoboy.rideId}`).once('value', snap => {
						let ride = snap.val()
						if(ride !== null){
							// let diff = moment().diff(moment(motoboy.ride.createdAt, "DD/MM/YYYY HH:mm:ss"), 'seconds')
							if(ride.status && ride.status === 'pending'){
								alert.play((success) => {
									if (success) {
										console.log('SET RIDE FREE SUCCESS');
									} else {
										console.log('playback failed due to audio decoding errors');
									}
								})
							} else { 
								console.log('NAO HA CORRIDAS NO TIMER 2')
							}
						}
					})
				} else {
					console.log('SEM CORRIDAS NO TIMER 2')
				}
			} else {
				Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
			}
		}
	})
}, 5*1000);



console.log('userId', userId)



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
			rideTime: 5,
	
			//earning
			earning: 0,
	
			//foreground
			appState: AppState.currentState,

			initialMilliseconds: 0,
			delay: false,
			time: 10,
			diff: 0,

			//modal
			openModal: false,

			// ride free
			rideFreeAvailable: false
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
		this.updateMap()
		if(this.state.rideFreeAvailable || this.state.isRide){
			PushNotification.localNotification({
				/* Android Only Properties */
				id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
				ticker: "Uma nova Entrega para você", // (optional)
				autoCancel: true, // (optional) default: true
				largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
				smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
				bigText: "Olá uma nova Entrega surgiu", // (optional) default: "message" prop
				subText: "Entrega para você", // (optional) default: none
				color: "red", // (optional) default: system default
				vibrate: true, // (optional) default: true
				vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
				tag: 'some_tag', // (optional) add tag to message
				group: "group", // (optional) add group to message
				ongoing: false, // (optional) set whether this is an "ongoing" notification
				priority: "high", // (optional) set notification priority, default: high
				visibility: "private", // (optional) set notification visibility, default: private
				importance: "high", // (optional) set notification importance, default: high,
		
				/* iOS and Android properties */
				title: "Uma nova entrega para você", // (optional)
				message: "Olá uma nova Entrega surgiu", // (required)
				playSound: true, // (optional) default: true
		});
		}
	}

	updateMap = async () => {
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

				// await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value',async r => {
					// let motoride = r.val()
					if(!motoboy.onRide && motoboy.rideStatus && motoboy.rideId && motoboy.rideId.length > 0){
						await firebase.database().ref(`rides/${motoboy.rideId}`).once('value', snap => {
							let ride = snap.val()
							let diff = moment().diff(moment(motoboy.ride.createdAt, "DD/MM/YYYY HH:mm:ss"), 'seconds')
							if(ride.status && ride.status === 'canceled'){
								this.setState({
									ride: null,
									isRide: false,
									// initialMilliseconds: 1000*10,
									// delay: true,
								})
							} else { 
								this.setState({
									ride: motoboy.ride,
									isRide: true,
									// initialMilliseconds: 1000*5,
									initialMilliseconds: 1000*10,
									// delay: true,
								})
								this.setState({ rideFreeAvailable: false })
								// Notification.create({ subject: 'Hey', message: 'Yo! Hello world.' });
							}
							alert.play((success) => {
								if (success) {
									console.log('SET RIDE FREE SUCCESS');
								} else {
									console.log('playback failed due to audio decoding errors');
								}
							})
						})
						
					} 
				// })

				// END - CHECK IF THERE IS A RIDE AVAILABLE FOR MOTOBOY

				await firebase.database().ref(`rides`).on('value',async snapshot => {
					if(snapshot.val() !== null){
						console.log('RIDES FREE', Object.values(snapshot.val()) )
						let rides = snapshot.val()
						let rideFree =  _.filter(Object.values(rides), e => {
								return e.motoboyId === false && e.free && e.status && e.status === 'pending' && geolib.getDistance(
									{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
									{ latitude, longitude }
								 ) <= 4500 
							})
							this.setState({ rideFreeAvailable: rideFree.length > 0 })
							if(rideFree.length > 0 && !this.props.finish && this.props.user.rideStatus){
								rideAlert.play((success) => {
								if (success) {
									console.log('SET RIDE FREE SUCCESS');
								} else {
									console.log('playback failed due to audio decoding errors');
								}
							})
							}
						
						}
					})

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

	checkRide = async () => {
		this.setState({ rideFreeAvailable: false })
		const { latitude, longitude } = this.state.region
		console.log('CHECK RIDE', latitude, longitude)
		await firebase.database().ref(`rides`).once('value',async snapshot => {
			if(snapshot.val() !== null){
				console.log('RIDES FREE', Object.values(snapshot.val()) )
				let rides = snapshot.val()
				let rideFree =  _.filter(Object.values(rides), e => {
						return  e.free && e.status === 'pending' && e.motoboyId === false && geolib.getDistance(
							{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
							{ latitude, longitude }
						 ) <= 4500 
					})
					// console.log('is ride no check ride', this.state.isRide)
					if(!this.state.isRide){
						if(rideFree && rideFree.length > 0){
							this.setState({ rideFreeAvailable: rideFree.length > 0 })
							let rideSelected = _.sample(rideFree)
							await firebase.database().ref(`rides/${rideSelected.id}`).update({
								motoboyId: this.props.user.id,
								// pendingMotoboyId: true,
								free: false,
							})
								.then(async () => {
									await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
										rideId: rideSelected.id,
										ride: rideSelected
									})
									.catch(error => console.log('ERROR', error))
									// if(this.props.user.rideStatus && !this.props.user.onRide){
									// 	this.setState({
									// 		ride: rideSelected,
									// 		isRide: true,
									// 		initialMilliseconds: 1000*10,
									// 	})
									//  }
									}
								)
					// 			.catch(error => {
					// 				this.setState({
					// 					ride: null,
					// 					isRide: false,
					// 					// initialMilliseconds: 1000*10,
					// 					// delay: false,
					// 				})
					// 				console.log('error trying to set motoboy id at ride free', error)
					// 			})
						}
					} 
					// }
				} 
		})
	}

	delayRide = (diff) => {
		console.log('finish', !this.props.finish)
		console.log('diff', diff)
		if(diff < 10){
			this.setState({ diff })
		} else
		if (diff === 10 && !this.props.finish){
			console.log('diff', diff)
			this.refuseRide()
		}

		// var timeleft = 10;
		// 	var downloadTimer = setInterval(() => {
		// 		timeleft--
		// 		console.log(timeleft)
		// 		// this.setState({ time: parseInt(timeleft)} )
		// 		if(!this.props.finish){
		// 			if(timeleft === 0 && !this.props.finish){
					
		// 				clearInterval(downloadTimer);
		// 			}
		// 		} else {
		// 			clearInterval(downloadTimer);
		// 		}
		// 	}, 1000);
			
	}

	countDown = () => {
		if(this.state.initialMilliseconds > 0 && this.state.ride){
			return (
				<View style={[styles.countdowncontainer]}>
					<TimerCountdown
						initialMilliseconds={this.state.initialMilliseconds}
						onTick={(milliseconds) => console.log(milliseconds)}
						onExpire={() => {
							this.setState({ delay: false })
							this.props.finish ? false : this.refuseRide()
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
		console.log('state do refuse',)
		await firebase.database().ref(`rides/${this.state.ride.id}`).update({
			free: true,
			pendingMotboyId: false,
			motoboyId: false,
		})
			.then(async () => {
				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					rideId: false, 
					ride: false
				})
					.then(() => {
						this.setState({
							isRide: false,
							// initialMilliseconds: 0,
							// time: 10,
							ride: null,
							// delay: false,
						})
						refuseAlert.play((success) => {
							if (success) {
								console.log('SET RIDE FREE SUCCESS');
							} else {
								console.log('playback failed due to audio decoding errors');
							}
						});
					})
					.catch(error => console.log('ERROR UPDATING MOTOBOY STATUS WITHOU RIDE'))
			})
			.catch(error => {
				console.log('error updating ride with free true')
			})

		// const { latitude, longitude } = this.state.ride.restaurant
		// await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', async snap => {
		// 	if(snap.val() !== null){
		// 		let motoboys = Object.values(snap.val())
		// 		// let motoboyActive =  _.filter(Object.values(motoboys), e => {
		// 		// 	if(e.latitude && e.longitude){
		// 		// 		return !e.onRide  && e.rideStatus && e.pendingRideId && e.pendingRideId.length > 0 && e.id !== this.props.user.id && geolib.getDistance(
		// 		// 			{ latitude: e.latitude, longitude: e.longitude },
		// 		// 			{ latitude, longitude }
		// 		// 		 ) <= 4500 //if another motoboy has accept nothing must happen
		// 		// 	}
		// 		// })
		// 		// console.log('MOTOBOY ATIVO NO REFUSE APOS TEMPO', motoboyActive, this.state.ride)
		// 		// if(motoboyActive && motoboyActive.length > 0){
		// 		// 	this.setState({
		// 		// 		isRide: false,
		// 		// 		delay: false
		// 		// 	})
		// 		// 	let motoboySelected = _.sample(motoboyActive)
		// 		// 	console.log('MOTOBOY SELECIONADO NO REFUSE APOS TEMPO', motoboySelected, 'ID DO MOTOBOY SELECTED', motoboySelected.id, this.props.user.id, this.state.ride.id)

		// 		// 	await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
		// 		// 		ridesRefused: this.props.user.ridesRefused && this.props.user.ridesRefused.length > 0 ? 
		// 		// 			[...this.props.user.ridesRefused, this.state.ride.id] : [ this.state.ride.id ],
		// 		// 		pendingRideId: false,
		// 		// 		ride: false
		// 		// 	})
		// 		// 		.then(async () => {
		// 		// 			await firebase.database().ref(`register/commerce/motoboyPartner/${motoboySelected.id}`).update({
		// 		// 				pendingRideId: this.state.ride.id,
		// 		// 				ride: this.state.ride
		// 		// 			})
		// 		// 				.then(async () => {
		// 		// 					await firebase.database().ref(`rides/${this.state.ride.id}`).update({
		// 		// 						status: 'pending',
		// 		// 						pendingMotoboyId: true,
		// 		// 						motoboyId: motoboySelected.id,
		// 		// 					})
		// 		// 						.then(async () => {
		// 		// 							this.setState({ initialMilliseconds: 0, isRide: false, ride: null })
		// 		// 							refuseAlert.play((success) => {
		// 		// 								if (success) {
		// 		// 									console.log('TRANSFER RIDE SUCCESSS');
		// 		// 								} else {
		// 		// 									console.log('playback failed due to audio decoding errors');
		// 		// 								}
		// 		// 							});
		// 		// 						})
		// 		// 						.catch(error => {
		// 		// 							console.log('error refusing ride after countdown', error)
		// 		// 						})
		// 		// 					})
		// 		// 				.catch(error => console.log(error))
		// 		// 		})
		// 		// 		.catch(error => {
		// 		// 			console.log('error updating motoboy with ride refused', error)
		// 		// 		})
		// 		// } else {
					
		// 			}
		// 	}
		// })
	}




	componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
	}
	
	_backgroundState(state) {
    return state.match(/inactive|background/);
	}
	
	_handleAppStateChange = async (nextAppState) => {
    if (this._backgroundState(nextAppState)) {

			if(!this.props.user.onRide){
				await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					out: true
				})
					// .then(() => Alert.alert('Atenção', 'Você está saindo e poderá não receber chamadas'))
					.catch(error => console.log('Error going outside', error))
			}

			// if(this.props.out){
				
			// }

    } else if (this._backgroundState(this.state.appState) && (nextAppState === 'active')) {

			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				out: false
			})
				.then(() => {
					// this.props.setOut(true)
					// Alert.alert('Atenção', 'Você voltou, obrigado. Seu status é online. Em breve você receberá corridas')
				})
				.catch(error => console.log('Error going outside', error))
    }
    this.setState({appState: nextAppState});
	}
	

	async componentWillReceiveProps(nextProps){
		const { ride } = nextProps
		if(nextProps.ride && ride.status){
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
		console.log('finish', this.props.finish, this.state.diff)

		// return <Text>Oi</Text>
		return (
			<View style={{ flex: 1 }}>
			 <Modal isVisible={this.state.openModal}>
          <Terms />
        </Modal>
				{this.countDown()}
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
							{/* {this.countDown()} */}
							<Details
								//  delay={this.state.delay}
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
								{/* <Image source={menuImage} style={{ width: 30, height: 30, resizeMode: 'contain'}} /> */}
								<Icon name="bars" size={30} style={{ color: 'rgba(62, 65, 126, 1)'}} />
							</Menu>
							<EarningBar earning={this.state.earning} />
							{/* <Search
								onLocationSelected={this.handleLocationSelected}
							/> */}
							<Refresh checkRide={this.checkRide} rideAvailable={this.state.rideFreeAvailable} isRide={this.state.isRide} />
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
	ride: state.ride.ride,
	finish: state.finish.finish,
	out: state.out.out
})

export default connect(mapStateToProps, { setUser, setRide, setOut })(withNavigation(Map))