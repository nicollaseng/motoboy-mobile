import React, { Component, Fragment } from  'react'
import { View, Image } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Search from '../Search'
import Directions from '../Directions'
import Details from '../Details'
import Active from '../Active'

import { connect } from 'react-redux'
import * as firebase from 'firebase'

import { getPixelSize } from '../../utils'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'
import menuImage from '../../assets/menu.png'

import { LocationBox, LocationText, LocationTimeText, LocationTimeBox, LocationTimeTextSmall, Back, Menu } from './styles'

import Geocoder from 'react-native-geocoding';
import geolib from 'geolib'

import _ from 'lodash'

Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")

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
		rideTime: 10
	}

	async componentDidMount(){
		navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
			const response = await Geocoder.from({ latitude, longitude })
			console.log(response)
			const address = response.results[0].formatted_address
			const location = address.substring(0, address.indexOf(','))
			firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', snapshot => {
				let motoboy = snapshot.val()
				console.log('motoboy', motoboy)
				if(motoboy.rideStatus){
					firebase.database().ref(`rides`).on('value', rideshot => {
						if(rideshot.val() !== null){
							let nearRide = _.filter(Object.values(rideshot.val()), e => {
								return geolib.getDistance(
									{ latitude: e.restaurant.latitude, longitude: e.restaurant.longitude },
									{ latitude, longitude }
								 ) <= 8000 && e.status === 'pending'
							})
							if(nearRide.length > 0){
								let ride = _.sample(nearRide)
								let rideRefused = _.filter(motoboy.rideRefused, e => e.id === ride.id)
								console.log('ride', ride, rideRefused)
								if(rideRefused.length === 0){
									this.setState({ isRide: true, ride })
								} else {
									this.setState({ isRide: false, ride: false })
								}
								// let rideDistance = geolib.getDistance(
								// 	{ latitude: ride.latitude, longitude: ride.longitude },
								// 	{ latitude, longitude }
								// )
							}
						}
					})
				}
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
					}
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
					}
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
		} else {
			this.setState({
				isRide: false,
				ride: null,
				destination: null
			})
		}
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
		console.log('analise de parametros', this.state.isRide, this.props.ride, this.state.ride)
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
												rigth: getPixelSize(50),
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

mapStateToProps = state => ({
	user: state.user.user,
	ride: state.ride.ride
})

export default connect(mapStateToProps)(Map)