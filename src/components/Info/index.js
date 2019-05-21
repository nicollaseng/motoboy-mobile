import React, { Component, Fragment } from  'react'
import { Platform, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import _ from 'lodash'


class Info extends Component {
	state = {
	
	}

	handleDetails = (pedido) => {
		if(pedido.status === 'onWay' || pedido.status === 'onBackWay'){
			let index = _.findIndex(pedido.restaurant.endereco, e => e === "-")
			endereco = '-'
			if(index !== -1){
				endereco =  pedido.restaurant.endereco.slice(0, index)
			}
			return (
				<Fragment>
					<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Detalhes do destino</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Estabelecimento: {pedido.restaurant.nome}</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
					{/* <Text style={styles.title}>Telefone: {pedido.restaurant.telefone}</Text>
					<Text style={styles.title}>Celular: {pedido.restaurant.celular}</Text>
					<Text style={styles.title}>Pedido: {pedido.numeroPedido}</Text> */}
				</Fragment>
			)
		} else if(pedido.status === 'onDelivery') {
			let index = _.findIndex(pedido.delivery.endereco, e => e === "-")
			endereco = '-'
			if(index !== -1){
				endereco =  pedido.delivery.endereco.slice(0, index)
			}
			return (
				<Fragment>
				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Detalhes do destino</Text>
				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Cliente: {pedido.delivery.destinatario}</Text>
				<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
					{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
				</Fragment>
			)
		}  else if(pedido.status === 'onRestaurant' && !pedido.retorno) {
			return (
				<Fragment>
					<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Entrega sem retorno</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Receba seu pagamento antecipadamente</Text>
					<Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text>
					{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
				</Fragment>
			)
		} else if(pedido.status === 'onBackWay') {
			let index = _.findIndex(pedido.restaurant.endereco, e => e === "-")
			endereco = '-'
			if(index !== -1){
				endereco =  pedido.restaurant.endereco.slice(0, index)
			}
			return (
				<Fragment>
					<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Retorno ao estabelecimento</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 11 }]}>Retorne ao estabelecimento para devolução de troco/maquineta</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Estabelecimento: {pedido.restaurant.nome}</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Endereço: {endereco}</Text>
					{/* <Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
					{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
				</Fragment>
			)
		} else if(pedido.status === 'finished' && pedido.retorno) {
			return (
				<Fragment>
				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Obrigado!</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>O estabelecimento deve pagar</Text>
					<Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text>
					{/* <Text style={{ fontSize: 24, color: '#fff', marginBottom: 10, marginTop: 10,  fontWeigth: '700', textAlign: 'center'}}>R$ {pedido.taxMotoboy.toString().includes('.') ? `${pedido.taxMotoboy.toString().replace('.',',')}0` : `${pedido.taxMotoboy.toString().replace('.',',')},00`}</Text> */}
					{/* {pedido.delivery.enderecoComplemento && pedido.delivery.enderecoComplemento.length > 0 && <Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>} */}
				</Fragment>
			)
		} else if (pedido.status === 'finished' && !pedido.retorno) {
			return (
				<Fragment>
				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Obrigado!</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>Obrigado por ser parceiro Motoboys de Plantão</Text>
				</Fragment>
			)
		} else if(pedido.status === 'canceled' || pedido.status === undefined || pedido.status === null){
			return (
				<Fragment>
				<Text style={[styles.description, { color: '#fff', fontSize: 18 }]}>Esta viagem foi cancelada</Text>
					<Text style={[styles.title, { color: '#fff', fontSize: 12 }]}>O estabelecimento solicitou o cancelamento dessa viagem</Text>
				</Fragment>
			)
		}
	}

	render(){
		const { pedido } = this.props
		if(pedido.status !== 'pending'){
			return (
				<View style={styles.container}>
					<View style={[styles.subContainer, {backgroundColor:  'rgba(62, 65, 126, 0.9)' }]}>
						{this.handleDetails(pedido)}
					</View>
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
			ios: 40, android: 20
		}),
		// right: 13,
		width: '80%',
		alignSelf: 'center',
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

export default Info