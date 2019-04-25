import React, { Component } from  'react'
import { Platform, TouchableOpacity, Text } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { View } from 'react-native'
import MapView from 'react-native-maps'

class Active extends Component {
	state = {
		status: false
	}

	changeStatus = () => {
		this.setState({
			status: !this.state.status
		})
	}

	render(){
		return (
				<TouchableOpacity style={[styles.container, { backgroundColor: this.state.status ? "green" : "red"}]} onPress={this.changeStatus}>
					<Text style={styles.text}>{this.state.status ? "ONLINE" : "OFFLINE"}</Text>
				</TouchableOpacity>
    )
	}	
}

const styles = {
	container: {
		// position: 'absolute',
		// top: Platform.select({
		// 	ios: 60, android: 40
		// }),
		// width: '30%',
		// // height: 54,
		// margin: 0,
		// borderRadius: 0,
		// paddingTop: 0,
		// paddingBottom: 0,
		// paddingLeft: 20,
		// paddingRight: 20,
		// marginTop: 65,
		// marginLeft: 0,
		// marginRight: 0,
		// elevation: 5,
		// shadowColor: '#000',
		// shadowOpacity: 0.1,
		// shadowOffset: { x:0, y:0},
		// shadowRadius: 20,
		// borderWidth: 1,
		// borderColor: '#DDD',
		backgroundColor: 'red',
		// alignSelf: 'flex-end'
	},
	text: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		padding: 20,
		textAlign: 'center'
	}
}

export default Active

// styles={{
// 	container: {
// 		position: 'absolute',
// 		top: Platform.select({
// 			ios: 60, android: 40
// 		}),
// 		width: '100%'
// 	},
// 	textInputContainer: {
// 		flex: 1,
// 		backgroundColor: 'transparent',
// 		heigth: 54,
// 		marginHorizontal: 20,
// 		borderTopWidth: 0,
// 		borderBottomWidth: 0
// 	},
// 	textInput: {
// 		height: 54,
// 		margin: 0,
// 		borderRadius: 0,
// 		paddingTop: 0,
// 		paddingBottom: 0,
// 		paddingLeft: 20,
// 		paddingRight: 20,
// 		marginTop: 0,
// 		marginLeft: 0,
// 		marginRight: 0,
// 		elevation: 5,
// 		shadowColor: '#000',
// 		shadowOpacity: 0.1,
// 		shadowOffset: { x:0, y:0},
// 		shadowRadius: 15,
// 		borderWidth: 1,
// 		borderColor: '#DDD',
// 		fontSize: 18
// 	},
// 	listView: {
// 		borderWidth: 1,
// 		borderColor: '#DDD',
// 		backgroundColor: '#FFF',
// 		marginHorizontal: 20,
// 		elevation: 5,
// 		shadowColor: '#000',
// 		shadowOpacity: 0.1,
// 		shadowOffset: { x:0, y:0},
// 		shadowRadius: 15,
// 		marginTop: 10
// 	},
// 	description: {
// 		fontSize: 16,
// 	},
// 	row: {
// 		padding: 20,
// 		height: 58
// 	}
// }}