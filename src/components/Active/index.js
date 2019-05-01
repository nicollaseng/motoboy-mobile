import React, { Component } from  'react'
import { Platform, TouchableOpacity, Text, Alert } from 'react-native'
import { setUser } from '../../redux/action/auth'
import { connect } from 'react-redux'
import { Spinner } from 'native-base'
import * as firebase from 'firebase'

class Active extends Component {
	state = {
		status: false,
		loading: false
	}

	componentDidMount(){
		this.setState({
			status: this.props.user.rideStatus
		})
	}

	changeStatus = async () => {
		this.setState({ loading: true },  async () => {
			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				rideStatus: !this.state.status
			})
				.then(() => {
					this.props.setUser({
						...this.props.user,
						rideStatus: !this.state.status
					})
					this.setState({ loading: false, status: !this.state.status })
				})
				.catch(error => {
					Alert.alert('Atenção', 'Houve um erro interno. Tente novamente em alguns instantes')
					this.setState({ loading: false })
					console.log('error updating ridestatus', error)
			})
		})
	}

	render(){
		console.log('status do usuario', this.props.user)
		return (
			<TouchableOpacity style={[styles.container, { backgroundColor: this.state.status ? "#54fa2a" : "#363777"}]} onPress={this.changeStatus}>
				{this.state.loading ? <Spinner /> : <Text style={styles.text}>{this.state.status ? "ONLINE" : "OFFLINE"}</Text>}
			</TouchableOpacity>
    )
	}	
}

const mapStateToProps = state => ({
	user: state.user.user
})

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

export default connect(mapStateToProps, { setUser })(Active)