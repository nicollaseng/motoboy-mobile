import React, { Component, Fragment } from  'react'
import { View, Image, Text, AppState } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { withNavigation } from 'react-navigation'

import Search from '../Search'
import Directions from '../Directions'
import Details from '../Details'
import Active from '../Active'
import EarningBar from '../EarningBar'
import Info from '../Info'

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
import { ONE_SIGNAL_ID } from '../../utils/constants'

Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")
const refresh = Math.floor((Math.random() * 100000000000) + 1)
const updateId = '71c457d0-7294-11e9-94cb-eb86a10ade79'

class Map extends Component {
	state = {
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
	}

	async componentWillMount(){

		let userDeviceId;

			OneSignal.init(ONE_SIGNAL_ID, {
				kOSSettingsKeyAutoPrompt: true,
				kOSSettingsKeyInFocusDisplayOption:2,
			});
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
		setTimeout( () => {
			firebase.database().ref(`rides/${updateId}`).update({
				voyageNumber: refresh,
			})
		 }, 90000); // 2,2 mintus reload page
		//  ec87c3f0-7288-11e9-957c-afb9416aeeb7

		AppState.addEventListener('change', this._handleAppStateChange);

		navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
			const response = await Geocoder.from({ latitude, longitude })
			const address = response.results[0].formatted_address
			const location = address.substring(0, address.indexOf(','))
			firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', async snapshot => {
				let motoboy = snapshot.val()
				console.log('dados do motoboy', motoboy, motoboy.earnings)
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


					// let toPay = []
					// let payment = 0

					
					// payment = toPay.reduce((a,b) => a+b,0) - 0.12*(toPay.reduce((a,b) => a+b,0))

					// await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					// 	toPay: payment
					// })

					//add 5 reais each 10 rides on a day locally

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

					// when complete 7 days do below

					// if(Object.values(motoboy.earnings).length === 7){ 
						
					// 	payment = toPay.reduce((a,b) => a+b,0) - 0.12*(toPay.reduce((a,b) => a+b,0))

					// 	await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
					// 		earnings: [],
					// 		cyclePayment: payment
					// 	})
					// }

					// let totalEarningToday = earningToday.reduce((a,b) => a+b,0)
					// this.setState({ earning: ((Math.round(( totalEarningToday - 0.12*totalEarningToday ) * 100) / 10)*10)})
				}

				if(motoboy.onRide && motoboy.rideStatus){
				 firebase.database().ref(`rides/${motoboy.activeRide.id}`).once('value', snap => {
					 if(snap.val() !== null){
						console.log('CORRIDA PERDIDA', snap.val())
						this.setState({ isRide: true, ride: snap.val()})
					 }
				 })
				}

				this.props.setUser(motoboy)
				console.log('DECIFRANDO O ERRO', motoboy.rideStatus && !motoboy.onRide)
				if(motoboy.rideStatus && !motoboy.onRide){ 
					console.log('ENTROU AQUI MESMO NAO DEVENDO')
					firebase.database().ref(`rides`).on('value', async rideshot => {
						if(rideshot.val() !== null){
							let nearRide = []
							 nearRide = _.filter(Object.values(rideshot.val()), e => {
								return geolib.getDistance(
									{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
									{ latitude, longitude }
								 ) <= 4000 && e.status === 'pending' && !e.motoboy //if another motoboy has accept nothing must happen
							})
								console.log('SE PASSAR DAQUI E SACANAGEM', nearRide.length > 0 && motoboy.rideStatus && !motoboy.onRide)

						await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', r => {
							let moto = r.val()
							if(nearRide.length > 0 && moto.rideStatus && !moto.onRide){
								let ride = _.sample(nearRide)
								// let rideRefused = _.filter(motoboy.rideRefused, e => e.id === ride.id)
								// 	if(rideRefused.length > 0 ){
								// 		this.setState({ isRide: false })
								// 	} else if(rideRefused.length === 0) {
										this.setState({ isRide: true, ride })
									// }
								}
							})
						}
					})
				} else {
					this.setState({ isRide: false })
				}
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
				timeout: 2000,
				enableHighAccuracy: true,
				maximumAge: 1000,
			}
		)
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
		await firebase.database().ref(`rides/${updateId}`).update({
			voyageNumber: refresh,
		})
			.then(() => {
				console.log('refresh done')
			})
			.catch(error => {
				console.log('refresh error', error)
			})
	}


	componentWillReceiveProps(nextProps){
		const { ride } = nextProps
		console.log('rideeeeee', nextProps.ride, ride.status, !ride.status)
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
			}
		} else if(ride.status === 'finished'){
			this.setState({
				isRide: true,
				destination: null
			})
		} else { 
			this.setState({
				destination: null,
				isRide: false,
				ride: null,
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
		console.log('analise de parametros', this.state.isRide, this.state.ride)
		// return <Text>Oi</Text>
		return (
			<View style={{ flex: 1 }}>
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
							<Details
								 isRide={true}
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

const mapStateToProps = state => ({
	user: state.user.user,
	ride: state.ride.ride
})

export default connect(mapStateToProps, { setUser, setRide })(withNavigation(Map))