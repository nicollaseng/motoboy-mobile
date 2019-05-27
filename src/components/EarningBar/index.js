import React, { Component } from  'react'
import { Platform, View, Text, Dimensions } from 'react-native'
import VMasker from 'vanilla-masker'

class EarningBar extends Component {
	state = {
	
	}

	render(){
		return (
				<View style={styles.container}>
					<View style={styles.subContainer}>
						{/* <Text style={styles.title}>Ganhos Hoje:</Text>
						<Text style={styles.description}>R$ {VMasker.toMoney(this.props.earning*100)}</Text> */}
					</View>
				</View>
    )
	}	
}

const styles = {
	container: {
		position: 'absolute',
		top: Platform.select({
			ios: 60, android: 20
		}),
		right: 13,
		width: '90%',
		height: '5%',
		// alignSelf: 'flex-end',
	},
	subContainer: {
		backgroundColor: '#fff',
		// padding: 10,
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

export default EarningBar