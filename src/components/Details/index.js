import React, { Component, Fragment } from  'react'
import { View } from 'react-native'
import { Container, TypeTitle, TypeDescription, TypeImage, RequestButton, RequestButtonText } from './style'

import uberx from '../../assets/uberx.png'

class Details extends Component {
	state = {
	}

	render(){
		return (
			<Container>
				<TypeTitle>Popular</TypeTitle>
				<TypeDescription>Viagens baratas para o dia a dia</TypeDescription>
				<TypeImage source={uberx} />
				<TypeTitle>UberX</TypeTitle>
				<TypeDescription>R$ 6,00</TypeDescription>

				<RequestButton onPress={() => {}}>
					<RequestButtonText>Solicitar uberX</RequestButtonText>
				</RequestButton>
			</Container>
    )
	}	
}

export default Details