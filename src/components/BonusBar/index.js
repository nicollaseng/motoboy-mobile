import React, { Component } from  'react'
import { Platform, View, Text, TouchableOpacity } from 'react-native'
import VMasker from 'vanilla-masker'

import Icon from 'react-native-vector-icons/FontAwesome5'

class BonusBar extends Component {
	state = {
		open: false,
	}

	handleTop = () => {
		this.setState({
			open: !this.state.open
		})
	}

	render(){
		return (
				<View style={styles.container}>
					<TouchableOpacity style={styles.subContainer} onPress={this.handleTop}>
						<Icon name="sort-down" size={17} style={{ color: '#54fa2a', backgroundColor: 'rgba(62, 65, 126, 0.9)'}} />
					</TouchableOpacity>
					{this.state.open && (
						<View style={{ alignItems: 'center'}}>
							<View style={styles.detailsContainer}>
								<View>
									<Text style={styles.title}>Ganhos Hoje:</Text>
									<Text style={styles.description}>R$ {VMasker.toMoney(this.props.earning*100)}</Text>
								</View>
								<View>
									<Text style={styles.title}>Bônus:</Text>
									<Text style={styles.description}>R$ {VMasker.toMoney(this.props.bonus*100)}</Text>
								</View>
								<View>
									<Text style={styles.title}>Indicação:</Text>
									<Text style={styles.description}>R$ {VMasker.toMoney(this.props.indication*100)}</Text>
								</View>
							</View>
						</View>
					)}
				</View>
    )
	}	
}

const styles = {
	container: {
		position: 'absolute',
		top: Platform.select({
			ios: 130, android: -5
		}),
		right: 13,
		width: '90%',
		// height: '15%',
		alignSelf: 'flex-end',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	subContainer: {
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		// heigth: 10,
		backgroundColor: 'rgba(62, 65, 126, 0.9)',
		// padding: 2,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 15,
	},
	title: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 12,
	},
	description: {
		textAlign: 'center',
		color: '#54fa2a',
		fontSize: 18,
	},
	detailsContainer: {
		borderRadius: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		width: '90%',
		backgroundColor: 'rgba(62, 65, 126, 0.9)',
	}
}

export default BonusBar