import React, { Component } from  'react'
import { Platform, View, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import Sound from 'react-native-sound'

class Navigation extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
		}
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => false} style={[styles.subContainer, { backgroundColor:  '#54fa2a' }]}>
					<Icon name="road" size={30} style={{ color: '#363777', backgroundColor: '#54fa2a'}} />
				</TouchableOpacity>
			</View>
    	)
	}	
}

const styles = {
	container: {
		// heigth: Dimensions.get('window').heigth/2,
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/1.8, android: Dimensions.get('window').height/1.8
		}),
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		right: 13,
		// bottom: Platform.select({
		// 	ios: 100, android: 80
		// }),
		// width: '40%',
		alignSelf: 'flex-start',
	},
	subContainer: {
		borderRadius: 45,
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
		fontSize: 22,
	}
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps)(Navigation)