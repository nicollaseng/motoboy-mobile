import React, { Component, Fragment } from  'react'
import { View, TouchableOpacity, Platform, Linking } from 'react-native'
import { Thumbnail, Spinner } from 'native-base'
import { 
	Container, TypeTitle, TypeDescription, TypeImage, RequestButton, RequestButtonText, RestaurantButton
 } from './style'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import { setRide } from '../../redux/action/ride'
import Sound from 'react-native-sound'

var alert = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
	}
})

class Details extends Component {
	state = {
		loading: false,
	}

	componentDidMount(){
		if(!this.props.user.onRide && this.props.isRide){
			alert.play((success) => {
				if (success) {
					console.log('successfully finished playing');
				} else {
					console.log('playback failed due to audio decoding errors');
				}
			});
			return setTimeout(() => this.refuseRide(), 10*1000);
		}
	}


	handleAcceptRide = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			onRide: true,
			activeRide: this.props.ride,
			earnings: this.props.user.earnings ? [ ...Object.values(this.props.user.earnings) ,{ date: this.props.ride.createdAt, tax: this.props.ride.tax }] : [{ date: this.props.ride.createdAt, tax: this.props.ride.tax }],
			rides: this.props.user.rides ? [...Object.values(this.props.user.rides), this.props.ride] : [this.props.ride]
		})
			.then(async () => {
				await firebase.database().ref(`rides/${this.props.ride.id}`).update({
					status: 'onWay'
				})
					.then(() => {
						this.props.setRide({
							...this.props.ride,
							status: 'onWay'
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

	handleRide = (ride) => {
		console.log(ride.status)
			if(ride.status === 'pending'){
				return (
					<Fragment>
						<TypeTitle>Você tem uma entrega disponível</TypeTitle>
						<TypeDescription>Clique abaixo para aceitar</TypeDescription>
						{this.state.loading ? <Spinner /> : (
							<Fragment>
								<TouchableOpacity onPress={this.handleAcceptRide}>
									<Thumbnail large source={require('../../assets/motoboy.png')} />
								</TouchableOpacity>
								<TypeTitle>{this.props.ride.name}</TypeTitle>
								<TypeDescription>{this.props.rideDistance/1000} km</TypeDescription>
				
								<RequestButton onPress={this.refuseRide}>
									<RequestButtonText>Recusar</RequestButtonText>
								</RequestButton>
							</Fragment>
						)}
					</Fragment>
				)
			} else if( ride.status === 'onWay'){
				return (
					<Fragment>
						<TypeTitle>Escolha um mapa abaixo para iniciar a navegação</TypeTitle>
						<TypeDescription>Clique no mapa para abrir</TypeDescription>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
									<TouchableOpacity onPress={this.openGoogleMaps}>
										<Thumbnail large source={require('../../assets/google.png')} />
									</TouchableOpacity>
								</View>
								<RestaurantButton onPress={this.onRestaurant}>
									<RequestButtonText>Cheguei no restaurante</RequestButtonText>
								</RestaurantButton>
							</Fragment>
					</Fragment>
				)		
			} else if( ride.status === 'onRestaurant') {
				return (
					<Fragment>
						<TypeTitle>Escolha um mapa abaixo para iniciar a navegação</TypeTitle>
						<TypeDescription>Clique no mapa para abrir</TypeDescription>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
									<TouchableOpacity onPress={this.openGoogleMaps}>
										<Thumbnail large source={require('../../assets/google.png')} />
									</TouchableOpacity>
								</View>
								<RestaurantButton onPress={this.startDelivery}>
									<RequestButtonText>Iniciar entrega</RequestButtonText>
								</RestaurantButton>
							</Fragment>
					</Fragment>
				)		
			} else if( ride.status === 'onDelivery') {
				return (
					<Fragment>
						<TypeTitle>Escolha um mapa abaixo para iniciar a navegação</TypeTitle>
						<TypeDescription>Clique no mapa para abrir</TypeDescription>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
									<TouchableOpacity onPress={this.openGoogleMaps}>
										<Thumbnail large source={require('../../assets/google.png')} />
									</TouchableOpacity>
								</View>
								<RestaurantButton onPress={ride.retorno ? this.wayBack : this.finishDelivery}>
									<RequestButtonText>{ride.retorno ? 'Retornar Restaurante' : 'Finalizar'}</RequestButtonText>
								</RestaurantButton>
							</Fragment>
					</Fragment>
				)		
			} else if( ride.status === 'onBackWay') {
				return (
					<Fragment>
						<TypeTitle>Favor retorne ao restaurante com troco/maquineta</TypeTitle>
						<TypeDescription>Clique em finalizar somente após retornar ao restaurante</TypeDescription>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
								<RestaurantButton onPress={this.finishDelivery}>
									<RequestButtonText>{'Finalizar'}</RequestButtonText>
								</RestaurantButton>
							</Fragment>
					</Fragment>
				)		
			} else if( ride.status === 'finished') {
				return (
					<Fragment>
						<TypeTitle>Obrigado por essa viagem</TypeTitle>
						<TypeDescription>Confira abaixo o seu pagamento</TypeDescription>
						<View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
							<TypeTitle>R$ {ride.tax - 0.12*ride.tax}</TypeTitle>
						</View>
							<Fragment>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around'}} />
								<RestaurantButton onPress={this.dismiss}>
									<RequestButtonText>{'Entendido'}</RequestButtonText>
								</RestaurantButton>
							</Fragment>
					</Fragment>
				)		
			}
			// default:
			// return (
			// 	<Fragment>
			// 		<TypeTitle>Você tem uma entrega disponível</TypeTitle>
			// 		<TypeDescription>Clique abaixo para aceitar</TypeDescription>
			// 		{this.state.loading ? <Spinner /> : (
			// 			<Fragment>
			// 				<TouchableOpacity onPress={this.handleAcceptRide}>
			// 					<Thumbnail large source={require('../../assets/motoboy.png')} />
			// 				</TouchableOpacity>
			// 				<TypeTitle>{this.props.ride.name}</TypeTitle>
			// 				<TypeDescription>{this.props.rideDistance/1000} km</TypeDescription>
			
			// 				<RequestButton onPress={() => {}}>
			// 					<RequestButtonText>Recusar</RequestButtonText>
			// 				</RequestButton>
			// 			</Fragment>
			// 		)}
			// 	</Fragment>
			// )
	}

	openGoogleMaps = () => {
		const { ride } = this.props
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${ride.restaurant.latitude},${ride.restaurant.longitude}`;
		const label = 'Rotas para restaurante';
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`
		});
		Linking.openURL(url); 
	}

	refuseRide = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			rideRefused: this.props.user.rideRefused && this.props.user.rideRefused.length > 0 ?
				[...this.props.user.rideRefused, this.props.ride] : [this.props.ride]
		})
			.then(() => {
				this.setState({ loading: false })
				return this.props.setRide(false)
			})
			.catch(error => {
				this.setState({ loading: false })
				console.log('error refusing ride', error)
			})
	}

	onRestaurant = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`rides/${this.props.ride.id}`).update({
			status: 'onRestaurant'
		})
			.then(() => {
				this.props.setRide({
					...this.props.ride,
					status: 'onRestaurant'
				})
				this.setState({ loading: false})
			})
			.catch(error => {
				this.setState({ loading: false})
				console.log('error updating ride status', error)
			})
	}

	startDelivery = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`rides/${this.props.ride.id}`).update({
			status: 'onDelivery'
		})
			.then(() => {
				this.props.setRide({
					...this.props.ride,
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
		await firebase.database().ref(`rides/${this.props.ride.id}`).update({
			status: 'onBackWay'
		})
			.then(() => {
				this.props.setRide({
					...this.props.ride,
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
		await firebase.database().ref(`rides/${this.props.ride.id}`).update({
			status: 'finished'
		})
			.then(() => {
				this.props.setRide({
					...this.props.ride,
					status: 'finished'
				})
				this.setState({ loading: false})
			})
			.catch(error => {
				this.setState({ loading: false})
				console.log('error updating ride status', error)
			})
	}

	dismiss = async () => {
		this.setState({ loading: true })
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			onRide: false,
			activeRide: false,
		})
			.then(() => {
				this.setState({ loading: false })
				return this.props.setRide(false)
			})
			.catch(error => {
				this.setState({ loading: false })
				console.log('error dimiss ride', error)
			})
	}

	render(){
		const { ride } = this.props
		return (
			<Container>
				{this.handleRide(ride)}
			</Container>
    )
	}	
}

const mapStateToProps = state => ({
	user: state.user.user
})

export default connect(mapStateToProps, { setRide })(Details)