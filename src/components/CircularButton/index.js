import React, { Component } from  'react'
import { View, TouchableOpacity, Dimensions, Platform, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'

class Navigation extends Component {

	constructor(props){
		super(props)
		this.state ={
		}
	}

	render(){
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this.props.handleCircle} style={[styles.subContainer, { backgroundColor:  '#363777', borderRadius: this.props.circular ? 90 : 60 }]}>
					<Icon name={this.props.circular ? "times" : "plus"} size={this.props.circular ? 20 : 25} style={{ color: "#54fa2a", padding: 10}} />
				</TouchableOpacity>
			</View>
    	)
	}	
}

const styles = {
	container: {
		borderRadius: 40,
		// heigth: Dimensions.get('window').heigth/2,
		position: 'absolute',
		top: Platform.select({
			ios: Dimensions.get('window').height/1.8, android: Dimensions.get('window').height/1.2
		}),
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		right: 13,
		marginRight: Dimensions.get('window').width/2.5,
		// bottom: Platform.select({
		// 	ios: 100, android: 80
		// }),
		// width: '40%',
		alignSelf: 'flex-start',
	},
	subContainer: {
		// borderRadius: 60,
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