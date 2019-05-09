import React, { Component, Fragment } from  'react'
import { Platform, View, Text } from 'react-native'
import VMasker from 'vanilla-masker'

class Info extends Component {
	state = {
	
	}

	handleDetails = (pedido) => {
		if(pedido.status === 'onWay' || pedido.status === 'onBackWay'){
			return (
				<Fragment>
					<Text style={styles.description}>Detalhes do destino</Text>
					<Text style={styles.title}>Restaurante: {pedido.restaurant.nome}</Text>
					<Text style={styles.title}>Endereço: {pedido.restaurant.endereco}</Text>
					<Text style={styles.title}>Telefone: {pedido.restaurant.telefone}</Text>
					<Text style={styles.title}>Celular: {pedido.restaurant.celular}</Text>
					<Text style={styles.title}>Pedido: {pedido.numeroPedido}</Text>
				</Fragment>
			)
		} else if(pedido.status === 'onDelivery') {
			return (
				<Fragment>
					<Text style={styles.description}>Detalhes do destino</Text>
					<Text style={styles.title}>Entrega: {pedido.delivery.destinatario}</Text>
					<Text style={styles.title}>Endereço: {pedido.delivery.endereco}</Text>
					<Text style={styles.title}>Complemento: {pedido.delivery.enderecoComplemento}</Text>
				</Fragment>
			)
		} 
	}

	render(){
		const { pedido } = this.props
		if(pedido.status === 'onWay' || pedido.status === 'onBackWay' || pedido.status === 'onDelivery'){
			return (
				<View style={styles.container}>
					<View style={styles.subContainer}>
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
			ios: 40, android: 25
		}),
		// right: 13,
		width: '76%',
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
	title: {
		textAlign: 'center',
		color: '#222',
		fontSize: 14,
	},
	description: {
		textAlign: 'center',
		color: '#666',
		fontSize: 22,
	}
}

export default Info