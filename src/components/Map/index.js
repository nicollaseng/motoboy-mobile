import React, { Component, Fragment } from  'react'
import { View, Image } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Search from '../Search'
import Directions from '../Directions'
import Details from '../Details'
import Active from '../Active'
import { getPixelSize } from '../../utils'

import markerImage from '../../assets/marker.png'
import backImage from '../../assets/back.png'


import { LocationBox, LocationText, LocationTimeText, LocationTimeBox, LocationTimeTextSmall, Back } from './styles'
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyBionuXtSnhN7kKXD8Y2tms-Dx43GI4W6g")

class Map extends Component {
	state = {
		region: null,
		destination: null,
		duration: null,
		location: null
	}
	async componentDidMount(){
		navigator.geolocation.getCurrentPosition(
		async	({ coords: { latitude, longitude } }) => {
			const response = await Geocoder.from({ latitude, longitude })
			console.log(response)
			const address = response.results[0].formatted_address
			const location = address.substring(0, address.indexOf(','))
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

	render(){
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
					{this.state.destination ? (
						<Fragment>
							<Back onPress={this.handleBack}>
								<Image source={backImage} />
							</Back>
							<Details /> 
						</Fragment>
					)
					: 
					<Fragment>
						<Search
							onLocationSelected={this.handleLocationSelected}
						/>
						<Active />
					</Fragment>
					}
					
					{/* <Search
						onLocationSelected={this.handleLocationSelected}
					/> */}
			</View>
    )
	}	
}

export default Map