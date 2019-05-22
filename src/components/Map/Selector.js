import React, { Component } from  'react'
import { Platform, View, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import VMasker from 'vanilla-masker'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import Sound from 'react-native-sound'
import { setMap } from '../../redux/action/map'


class Selector extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
			day: true,
		}
	}

	handleMap = () => {
		this.setState({ day: !this.state.day })
		this.props.setMap( this.state.day )
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.handleMap} style={[styles.subContainer, { backgroundColor:  '#363777' }]}>
					<Icon name={this.state.day ? "sun" : "moon"} size={30} style={{ color: '#fff', backgroundColor: '#363777'}} />
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
			ios: Dimensions.get('window').height/1.4, android: Dimensions.get('window').height/1.4
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

export default connect(mapStateToProps, { setMap })(Selector)