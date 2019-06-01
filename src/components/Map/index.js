import React, { Component, Fragment } from  'react'
import { View, AppState, Platform } from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome5'

import Directions from '../Directions'
import Details from '../Details'
import Active from '../Active'
import BonusBar from '../BonusBar'
import Info from '../Info'
import Refresh from '../Refresh'
import Terms from '../Terms'
import Privacy from '../Privacy'
import Telephone from '../Telephone'
import Cancel from '../Cancel'
import Navigation from '../Navigation'
import CircularButton from '../CircularButton'
import RecoverUser from '../Recover'
import Countdown from '../Countdown/Countdown'
import Chat from '../Chat'
import Location from '../Location'

import { connect } from 'react-redux'
import * as firebase from 'firebase'

import { getPixelSize, getId } from '../../utils'

import marker2 from '../../assets/marker2.png'

import { setUser } from '../../redux/action/auth'
import { setRide } from '../../redux/action/ride'
import { setOut } from '../../redux/action/out'
import { setApi } from '../../redux/action/api'

import { LocationBox, LocationText, LocationTimeText, LocationTimeBox, LocationTimeTextSmall, Back, Menu } from './styles'

import Geocoder from 'react-native-geocoding';
import geolib from 'geolib'

import _ from 'lodash'
import moment from 'moment'


import TimerCountdown from "react-native-timer-countdown";
import Sound from 'react-native-sound'

import Modal from "react-native-modal";
import BackgroundTimer from 'react-native-background-timer';

import axios from 'axios'

mapStyle = require('./day.json')
nigthMap = require('./nigth.json')

const today = moment().format('DD/MM/YYYY')
let time = moment().format('HH:mm:ss')

Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")


var alert = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
	alert.setVolume(100);
  if (error) {
    console.log('failed to load the sound', error);
	}
})

var rideAlert = new Sound('alert2.mp3', Sound.MAIN_BUNDLE, (error) => {

	rideAlert.setVolume(100);

  if (error) {
    console.log('failed to load the sound', error);
	}
})

let userId;
getId().then(async id => {
		userId = id
})

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
				if(motoboy.stopPosition){
					Platform.OS === 'ios' ? BackgroundTimer.stop() : BackgroundTimer.clearInterval()
				}
			}
		})
		}, //success,
	() => {}, //error
	{}
	)
}, 
180*1000);


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
			indication: 0,
			bonus: 0,
	
			//foreground
			appState: AppState.currentState,

			initialMilliseconds: 0,
			delay: false,
			time: 10,
			diff: 0,

			//modal
			openModal: false,

			// ride free
			rideFreeAvailable: false,

			ridesOfRestaurant: [],

			motoboy: {},

			// for navigation purpose
			rideLat: 0.0,
			rideLng: 0.0,

			// circular menu
			circular: false,	
			api: {}
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
		await firebase.database().ref(`api`).once('value',async snap => {
			if(snap.val()!==null){
				let api = snap.val()
				this.props.setApi(api)
				this.setState({ api: snap.val()})

				await	axios.get(api.calor)
				.then(response => {
					this.setState({ ridesOfRestaurant: response.data })
				})
				.catch(err => console.log(err))
			}
		})
		
			// -- get earnings, bonus and indication at backend --// 
			await axios.post(this.state.api.getEarning, {
				motoboy: JSON.stringify(this.props.user),
			})
				.then(async response => {
					axios.post(this.state.api.getIndication, {
						motoboy: JSON.stringify(this.props.user),
					})
						.then(res => {
							console.log('indication', res)
							this.setState({ indication: parseFloat(res.data.indication) })
						})
						.catch(err => {
							console.log(err)
						})
					if(response){
						this.setState({ earning: response.data.earning })
					}
				})
				.catch(err => console.log(err))
	}
		// -- END: get earnings, bonus and indication at backend --// 

	async componentDidMount(){
		this.updateMap()
	}

	updateMap = async () => {
		AppState.addEventListener('change', this._handleAppStateChange);

		navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
			const response = await Geocoder.from({ latitude, longitude })
			const address = response.results[0].formatted_address
			const location = address.substring(0, address.indexOf(','))

			// UPDATE FIREBASE WITH MOTOBOY POSITION
			await axios.post(this.state.api.setPosition, {
				motoboy: JSON.stringify(this.props.user),
				latitude,
				longitude
			})
				.	then((response) => console.log(response) )
				.	catch((err) => console.log(err) )
			// END FIREBASE WITH MOTOBOY POSITION

			firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', async snapshot => {

				let motoboy = snapshot.val()
				this.setState({ motoboy })
	
				// START - CHECK IF THERE IS ACTIVE RIDE FOR MOTOBOy
				if(motoboy.rideId && Object.values(motoboy.ride)){
					firebase.database().ref(`rides/${motoboy.rideId}`).once('value', snap => {
						this.setState({
							isRide: true,
							ride: snap.val()
						})
					})
				} 
				else {
					this.setState({
						isRide: false,
						ride: {},
						destination: null,
					})
				}
				// END - CHECK IF THERE IS ACTIVE RIDE FOR MOTOBOy
	
				// START - CHECK IF TERMS ARE TRUE
				if(!motoboy.terms){
					this.props.navigation.navigate('Terms')
				} 
				// END - CHECK IF TERMS ARE TRUE
				
				if(this.props.user.photo && this.props.user.photo.length > 0){
					axios.get(this.props.user.photo)
					.then(response => {
						this.props.setUser({
							...motoboy,
							photo: response.data
						})
					})
				} else {
					this.props.setUser(motoboy)
				}
	
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
									destination: null,
								})
							} else if(ride.status === 'pending') { 
								this.setState({
									ride: motoboy.ride,
									isRide: true,
									initialMilliseconds: 1000*10,
								})
								this.setState({ rideFreeAvailable: false })
								alert.play((success) => {
									if (success) {
									} else {
										console.log('playback failed due to audio decoding errors');
									}
								})
							}
						})
						
					} 
	
				// END - CHECK IF THERE IS A RIDE AVAILABLE FOR MOTOBOY
	
				await firebase.database().ref(`rides`).on('value',async snapshot => {
					if(snapshot.val() !== null){
						let rides = snapshot.val()
						let rideFree =  _.filter(Object.values(rides), e => {
								return e.motoboyId === false && e.free && e.status && e.status === 'pending' && geolib.getDistance(
									{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
									{ latitude, longitude }
								 ) <= 4500 
							})
							this.setState({ rideFreeAvailable: rideFree.length > 0 })
							if(rideFree.length > 0  && this.props.user.rideStatus){
								rideAlert.play((success) => {
								if (success) {
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
		await firebase.database().ref(`rides`).once('value',async snapshot => {
			if(snapshot.val() !== null){
				let rides = snapshot.val()
				let rideFree =  _.filter(Object.values(rides), e => {
						return  e.free && e.status === 'pending' && e.motoboyId === false && geolib.getDistance(
							{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
							{ latitude, longitude }
						 ) <= 4500 
					})
					if(!this.state.isRide){
						if(rideFree && rideFree.length > 0){
							this.setState({ rideFreeAvailable: rideFree.length > 0 })
							let rideSelected = _.sample(rideFree)
							await firebase.database().ref(`rides/${rideSelected.id}`).update({
								motoboyId: this.props.user.id,
								free: false,
							})
								.then(async () => {
									await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
										rideId: rideSelected.id,
										ride: rideSelected
									})
									.catch(error => console.log('ERROR', error))
									
									}
								)
				
						}
					} 
				} 
		})
	}

	delayRide = (diff) => {
		if(diff < 10){
			this.setState({ diff })
		} else
		if (diff === 10 && !this.props.finish){
			this.refuseRide()
		}
	}

	countDown = () => {
		if(this.state.initialMilliseconds > 0 && this.state.ride){
			return (
				<View style={[styles.countdowncontainer]}>
					<TimerCountdown
						initialMilliseconds={this.state.ride && this.state.ride.status !== 'pending' ? 0 : this.state.initialMilliseconds}
						onTick={(milliseconds) => false}
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
		await axios.post(this.props.api.transferRide, {
			motoboy: JSON.stringify(this.props.user),
			ride: JSON.stringify(this.props.ride)
		})
			.then(async (response) => {
				this.updateRating()
			})
			.catch(err => console.log(err))
	}

	updateRating = async () => {
		await axios.post(this.props.api.updateRating, {
			motoboy: JSON.stringify(this.props.user),
		})
			.then((response) => {
				this.props.setRide({
					...this.props.ride,
					status: 'pending'
				})
			})
			.catch(err => console.log(err))
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
					.catch(error => console.log('Error going outside', error))
			}

    } else if (this._backgroundState(this.state.appState) && (nextAppState === 'active')) {

			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				out: false
			})
				.then(() => {
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
					isRide: true,
					ride,
					rideLat: ride.delivery.latitude,
					rideLng: ride.delivery.longitude,
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
					isRide: true,
					ride,
					rideLat: ride.restaurant.latitude,
					rideLng: ride.restaurant.longitude,
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
					isRide: false,
					destination: null,
					ride: {}
				})
			} else if(ride.status === 'pending'){
				this.setState({
					isRide: true,
				})
			} 
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

	_getLocation = async () => {
    await navigator.geolocation.getCurrentPosition(position => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
				latitudeDelta: 0.0143,
				longitudeDelta: 0.0134
      };
      this.mapView.animateToRegion(region, 500);
    });
  };

	circularMenu = () => {
		if(this.state.circular){
			return (
				<Fragment>
					<Refresh checkRide={this.checkRide} rideAvailable={this.state.rideFreeAvailable} isRide={this.state.isRide} />
					<Location getLocation={this._getLocation}/>
					<Chat />
					<Active />
				</Fragment>
			)
		} else {
			return <Fragment />
		}
	}

	handleCircle = () => {
		this.setState({ circular: !this.state.circular })
	}

	render(){

		return (
			<View style={{ flex: 1 }}>
			 <Modal isVisible={this.state.openModal}>
          {!this.state.motoboy.terms && <Terms />}
          {!this.state.motoboy.privacy && <Privacy />}
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
						showsMyLocationButton={false}
						customMapStyle={mapStyle}
					>
					{this.state.ridesOfRestaurant.length > 0 && this.state.ridesOfRestaurant.map(ride => {
						const { rideColor } = ride

						let color = 'transparent'

						if(rideColor > 0 &&  rideColor <= 5 ){
							color = "rgba(77, 255, 77, 0.3)"
						} else
						if(rideColor > 5 && rideColor <= 10){
							color = "rgba(255, 166, 77,0.3)"
						} else
						if(rideColor > 10 &&  rideColor <= 15){
							color =  "rgba(255, 77, 77, 0.3)"
						} else
						if(rideColor > 15){
							color = "rgba(115, 0, 230, 0.6)"
						}
						
						return (
							<Circle
								radius={1000}
								center={{ latitude: ride.latitude, longitude: ride.longitude, }}
								strokeOpacity={0}
								strokeWidth={2}
								strokeColor="transparent"
								fillColor={color}
								fillOpacity={0.2}
							/>
						)
					}) }
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
								coordinate={this.state.destination} anchor={{ x: 0.12, y: 0.78 }} image={marker2}
							>
								<LocationBox>
									<LocationText>
										{this.state.destination.title}
									</LocationText>
								</LocationBox>
							 </Marker>
							 <Marker
								coordinate={this.state.region} anchor={{ x: 0.12, y: 0.78 }} image={marker2}
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
								pedido={this.state.ride}
							/>
							<Countdown time={this.state.duration} status={this.state.ride.status} ride={this.state.ride}/>
							{}
							<Details
								 time={this.state.time}
								 isRide={true}
								 duration={this.state.duration}
								 ride={this.state.ride}
								 rideDistance={this.state.rideDistance}
							 />
							{ this.state.ride.status !== "pending" && (
								<Fragment>
									<Cancel />
									<Telephone telefone={this.state.ride.restaurant.celular.length > 0 ? this.state.ride.restaurant.celular : this.state.ride.restaurant.telefone}/>
									<Navigation lat={this.state.rideLat} lng={this.state.rideLng}/>
									{/* <RecoverUser /> */}
								</Fragment>
							)
						}
						</Fragment>
					) : (
						<Fragment>
							<Menu onPress={this.handleMenu}>
								<Icon name="bars" size={30} style={{ color: '#54fa2a'}} />
							</Menu>
							{!this.props.drawer && (
								<Fragment>
										<BonusBar earning={this.state.earning} bonus={this.state.motoboy.bonusToday && this.state.motoboy.bonusToday.length > 0 ? this.state.motoboy.bonusToday.reduce((a,b) => a+b,0) : 0} indication={this.state.indication} />
										{this.circularMenu()}
										<CircularButton 
											handleCircle={this.handleCircle}
											circular={this.state.circular}
										/>
								</Fragment>
							)}
						</Fragment>
					)}
			</View>
    )
	}	
}

const styles = {
	countdowncontainer: {
		backgroundColor: "#fff",
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
	out: state.out.out,
	map: state.map.map,
	drawer: state.drawer.drawer
})

export default connect(mapStateToProps, { setUser, setRide, setOut, setApi })(withNavigation(Map))