import React, { Component, Fragment } from  'react'
import { Platform, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import _ from 'lodash'

import CountDown from 'react-native-countdown-component';

import geolib from 'geolib'

class Countdown extends Component {
	state = {
	
	}

	// handleDetails = (pedido) => {
	// 	if(pedido.status === 'onWay' || pedido.status === 'onBackWay'){
	// 		let index = _.findIndex(pedido.restaurant.endereco, e => e === "-")
	// 		endereco = '-'
	// 		if(index !== -1){
	// 			endereco =  pedido.restaurant.endereco.slice(0, index)
	// 		}
	// 		return (
	// 			<Fragment>
	// 				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Detalhes do destino</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Estabelecimento: {pedido.restaurant.nome}</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
	// 				{/* <Text style={styles.title}>Telefone: {pedido.restaurant.telefone}</Text>
	// 				<Text style={styles.title}>Celular: {pedido.restaurant.celular}</Text>
	// 				<Text style={styles.title}>Pedido: {pedido.numeroPedido}</Text> */}
	// 			</Fragment>
	// 		)
	// 	} else if(pedido.status === 'onDelivery') {
	// 		let index = _.findIndex(pedido.delivery.endereco, e => e === "-")
	// 		endereco = '-'
	// 		if(index !== -1){
	// 			endereco =  pedido.delivery.endereco.slice(0, index)
	// 		}
	// 		return (
	// 			<Fragment>
	// 			<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Detalhes do destino</Text>
	// 			<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Cliente: {pedido.delivery.destinatario}</Text>
	// 			<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
	// 				{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
	// 			</Fragment>
	// 		)
	// 	}  else if(pedido.status === 'onRestaurant' && !pedido.retorno) {
	// 		return (
	// 			<Fragment>
	// 				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Entrega sem retorno</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Receba seu pagamento antecipadamente</Text>
	// 				<Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text>
	// 				{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
	// 			</Fragment>
	// 		)
	// 	} else if(pedido.status === 'onBackWay') {
	// 		let index = _.findIndex(pedido.restaurant.endereco, e => e === "-")
	// 		endereco = '-'
	// 		if(index !== -1){
	// 			endereco =  pedido.restaurant.endereco.slice(0, index)
	// 		}
	// 		return (
	// 			<Fragment>
	// 				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Retorno ao estabelecimento</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 11 }]}>Retorne ao estabelecimento para devolução de troco/maquineta</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Estabelecimento: {pedido.restaurant.nome}</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
	// 				{/* <Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
	// 				{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
	// 			</Fragment>
	// 		)
	// 	} else if(pedido.status === 'finished' && pedido.retorno) {
	// 		return (
	// 			<Fragment>
	// 			<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Obrigado!</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>O estabelecimento deve pagar</Text>
	// 				<Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text>
	// 				{/* <Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
	// 				{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
	// 			</Fragment>
	// 		)
	// 	} else if (pedido.status === 'finished' && !pedido.retorno) {
	// 		return (
	// 			<Fragment>
	// 			<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Obrigado!</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Obrigado por ser parceiro Motoboys de Plantão</Text>
	// 			</Fragment>
	// 		)
	// 	} else if(pedido.status === 'canceled' || pedido.status === undefined || pedido.status === null){
	// 		return (
	// 			<Fragment>
	// 			<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Esta viagem foi cancelada</Text>
	// 				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>O estabelecimento solicitou o cancelamento dessa viagem</Text>
	// 			</Fragment>
	// 		)
	// 	}
	// }

	handleEndCountdown = async () => {
		const { status } = this.props
		if(status === 'onWay'){
			this.refuseRide()
		} else if(status === 'onDelivery' || status === 'onBackWay'){
			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				rating: [...this.props.user.rating, 4.9]
			})
				.then(() => {
					Alert.alert('Atenção', 'Você está atrasado')
				})
				.catch(error => {
					console.log('error updating motoboy status after countdown finished', error)
				})
		}
	}

	refuseRide = async () => {
		const { ride } = this.props
		let id = ride.id
		await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', async motosnap => {
			let motoboy = motosnap.val()
			let latitude = ride.restaurant.latitude
			let longitude = ride.restaurant.longitude

			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				onRide: false,
				rideId: false,
				ride: false,
			})
				.then(async () => {
					// if(this.props.restaurant.credit > 0 && this.props.restaurant.credit >= parseFloat(taxaEntrega)){
					if(this.searchMotoboy(motoboy, 200, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 500, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 1000, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 2000, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 3000, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 4000, latitude, longitude)) {
						this.startRide(ride, id, false)
					} else if(this.searchMotoboy(motoboy, 5000, latitude, longitude)) {
						this.startRide(ride, id, false)
					}  
					else {
						this.setState({
							loading: false
						})
						await firebase.database().ref(`rides/${id}`).update({
							free: true,
							pendingMotboyId: false,
							motoboyId: false,
							checked: true,
						})

						.then(async () => {
							if(voyage.motoboyId){
								await firebase.database().ref(`register/commerce/motoboyPartner/${voyage.motoboyId}`).update({
									rideId: false, 
									ride: false,
									activeRide: false,
									onRide: false,
								})
									.then(() => {
										console.log('RIDE TRANSFERED TO LIMBO')
									})
									.catch(error => console.log('ERROR TRASFERING RIDE TO LIMBO', error))
								} else {
										console.log('RIDE TRANSFERED TO LIMBO')
								}
							})
						.catch(error => {
							console.log('ERROR UPDATING RIDE TO FREE', error)
						})
						// alert('Atenção: no momento todos os nossos motoboys estão ocupados. Tente novamente em instantes')
					}
				}
				)
				.catch(error => {
					console.log('error refusing ride trying to release motoboy ', error)
				})

		})
	}

	searchMotoboy = (motoboy, distance, latitude, longitude) => {
    let nearMoboy =  _.filter(Object.values(motoboy), e => {
      if(e.latitude && e.longitude){
        return !e.onRide  &&  e.rideStatus && !e.droped && e.id !== this.props.user.id && geolib.getDistance(
          { latitude: e.latitude, longitude: e.longitude },
          { latitude, longitude }
         ) <= distance 
      }
		})
		console.log('NEAR MOTOBOY', nearMotoboy)
    this.setState({ motoboyActive: nearMoboy })
    return nearMoboy.length > 0
  }

  startRide = async (ride, id, checked) => {
    console.log('uuid que vem', id)
    await firebase.database().ref(`rides/${id}`).set(ride)
          .then(async () => { this.setRide(ride, this.state.motoboyActive, checked) })
          .catch(error => {
            this.setState({
              loading: false
            })
            alert('Atenção: houve um erro técnico. Estamos trabalhando para corrigir')
            console.log('error set ride on firebase', error)
          })
		}
		
		setRide = async (param, motoboyActive, checked) => {

			await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', async motosnap => {
					let motoboySelected = _.sample(motoboyActive)
					console.log('motoboy selecionado', motoboySelected)
					
					await firebase.database().ref(`register/commerce/motoboyPartner/${motoboySelected.id}`).update({
						rideId: param.id,
						ride: param
					})
						.then(async () => {
							await firebase.database().ref(`rides/${param.id}`).update({
								motoboyId: motoboySelected.id,
								pendingMotoboyId: motoboySelected.id,
								checked,
							})
								.then(async () => {
									Alert.alert('Atenção', 'O tempo limite para chegar no restaurante encerrou. Sua entrega foi transferida para outro entregador')
									console.log('trasnferiu')
								})
								.catch(error => {
									this.setState({ loading: false })
									console.log('erro updating ride selected with pendingMotoboyId', error)
								})
						})
						.catch(error => {
							console.log('error updating motoboy with pendingRideId', error)
						})
			})
		}


	render(){
		const { status } = this.props
		if(status === 'onDelivery' || status === 'onWay' || status === 'onBackWay'){
			return (
				<View style={styles.container}>
					{/* <View style={[styles.subContainer, {backgroundColor:  'rgba(62, 65, 126, 0.9)' }]}> */}
						{/* {this.handleDetails(pedido)} */}
						<CountDown
							until={60 * this.props.time }
							size={20}
							onFinish={this.handleEndCountdown}
							digitStyle={{backgroundColor: 'rgba(62, 65, 126, 0.9)'}}
							digitTxtStyle={{color: '#54fa2a'}}
							timeToShow={['M', 'S']}
							timeLabels={{m: 'MM', s: 'SS'}}
							timeLabelStyle={{ color: '#54fa2a'}}
						/>
					{/* </View> */}
				</View>
    	)	
		} else {
			return <View />
		}
	}	
}

const styles = {
	container: {
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/4.0, android: Dimensions.get('window').height/1.8
		}),
		// right: 13,
		width: '30%',
		alignSelf: 'flex-start',
	},
	subContainer: {
		backgroundColor: '#fff',
		padding: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 15,
	},
	subContainerIcon: {
		borderRadius: 35,
		backgroundColor: '#fff',
		padding: 10,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 19,
	},
	title: {
		textAlign: 'center',
		color: '#222',
		fontSize: 14,
	},
	description: {
		textAlign: 'center',
		color: '#666',
		fontSize: 18,
	}
}

export default Countdown