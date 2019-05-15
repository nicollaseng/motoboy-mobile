import React, { Component, Fragment } from 'react';
import {
	ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
	Alert,
	TouchableOpacity
} from 'react-native';
import { Spinner, Content } from 'native-base'
import { connect } from 'react-redux'
import * as firebase from 'firebase'
import _ from 'lodash'
import { setUser } from '../../redux/action/auth'

import IconAwesome from "react-native-vector-icons/FontAwesome5";


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
			password: '',
			
			// loading
			loading: false,
    }
  }

	 componentWillMount(){
		try {
				this.setState({ loading: true })
			 firebase.auth().onAuthStateChanged(user => {
				console.log('user', user)
				if(user){
					console.log('USER ON AUTH STATE CHANGE', user.toJSON())
					this.setState({ email: user.toJSON().email })
					this._setUserInfo()
				} else {
					this.setState({ loading: false })
				}
			})
		} catch( error ) {
			this.setState({ loading: false })
			console.log(error)
		}
	}

	login = async () => {
		const { email, password } = this.state
		this.setState({ loading: true })
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password)
				.then(response => {
					console.log(response)
					this._setUserInfo()
				})
				.catch(err => {
					Alert.alert('Atenção','Verifique seu e-mail e senha novamente. Caso o erro persista tente recuperar sua senha. Se ainda mantiver o erro entre em contato com nosso suporte')
					console.log('Erro while login firebase', err)
					this.setState({ loading: false })
				})
		}	catch (err) {	
			this.setState({ loading: false })
			Alert.alert('Atenção','Algo de errado aconteceu. Tente novamente em alguns instantes. Cód: login0002')
			console.log('Error before login firebase', err)
		}
	}

	_setUserInfo = async key => {
		await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', data => {
			if(data !== null){
				let dataJson = data.toJSON()
				console.log('email lower case', dataJson)
				let user = _.filter(Object.values(dataJson), e => {
					if(e.email && e.email.length > 0){
						return e.email.toLowerCase() === this.state.email.toLowerCase()
					}
				})
				
				console.log('user', user)
				if(user.length > 0){
					user.map(async user => {
						if(user.email.toLowerCase() === this.state.email.toLowerCase()){
							if(user.status === 'Aprovado'){
								// ASSURE THAT RIDE ID AND RIDE WILL NOT BLOCK USER LOGIN IF USER HAS NOT ANY ACTIVE RIDE RUNNING
								if(user.activeRide !== null && !Object.values(user.activeRide).length > 0){
									await firebase.database().ref(`register/commerce/motoboyPartner/${user.id}`).update({
										rideId: false,
										ride: false,
										out: false,
									})
									.then(() => {
										console.log('passou por aqui e user', user)
										this.props.setUser(user)
										this.props.navigation.navigate('DrawerComponent')
										this.setState({ loading: false })
										console.log('user', user)
									})
									.catch(error => {
										console.log('Error firebase login updatin motoboy', error)
										Alert.alert('Atenção', 'Firebase error. Contate nosso suporte')
									})
									//IF ACTIVE RIDE RUNNING SO JUST PROCESSO NORMALLY BUT ASSURE THAT OUT IS FALSE
								} else {
									 await firebase.database().ref(`register/commerce/motoboyPartner/${user.id}`).update({
										out: false,
									})
										.then(() => {
											this.props.setUser(user)
											this.props.navigation.navigate('DrawerComponent')
											this.setState({ loading: false })
											console.log('user', user)
										})
										.catch(error => {
											console.log('Error firebase login updatin motoboy', error)
											Alert.alert('Atenção', 'Firebase error set out false. Contate nosso suporte')
										})
								}
							} else if(user.status === 'Bloqueado')  {
								Alert.alert('Atenção', 'Sua conta encontra-se temporariamente bloqueada. Entre em contato com nosso suporte')
								this.setState({ loading: false })
							} else {
								Alert.alert('Atenção', 'Seu cadastro está em análise')
								this.setState({ loading: false })
							}
						}
					})
				} else {
					alert('Atenção, estamos enfrentando problemas técnicos na sua conta. Tente novamente em instantes')
					this.setState({ loading: false })
				}
			}
		})
	}

	register = () => {
		this.props.navigation.navigate('Register')
	}

	recoverPassword = () => {
		this.props.navigation.navigate('RecoverPassword')
	}

  render() {
		const { loading } = this.state
		console.log('email', this.state.email)
    return (
      <View style={styles.container}>
				<Fragment>
					<Image source={require('../../assets/logo.png')} style={{ width: 150, height: 150, resizeMode: 'contain'}} />
				</Fragment>
        <View>
						<View style={styles.inputContainer}>
							<IconAwesome
									size={22}
									style={styles.inputIcon}
									name="envelope"
								/>
								{/* <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/> */}
								<TextInput style={styles.inputs}
										placeholder="Email"
										placeholderTextColor="#fff"
										keyboardType="email-address"
										underlineColorAndroid='transparent'
										onChangeText={(email) => this.state.blocked ? '': this.setState({email: email.replace(/^\s+|\s+$|\s+(?=\s)/g, "")})}
										value={this.state.email}
									/>
							</View>
							
							<View style={styles.inputContainer}>
								<IconAwesome
									size={22}
									style={styles.inputIcon}
									name={"key"}
								/>
								{/* <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/> */}
								<TextInput style={styles.inputs}
										placeholder="Senha"
										placeholderTextColor="#fff"
										secureTextEntry={true}
										underlineColorAndroid='transparent'
										onChangeText={(password) =>this.state.blocked ? '' : this.setState({password})}
										value={this.state.password}
								/>
							</View>
							{this.state.loading ? <Spinner /> : (
								<TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.login}>
									<Text style={styles.loginText}>Login</Text>
								</TouchableHighlight>
							)}
							<TouchableOpacity onPress={this.register}>
								<Text style={styles.register}>Cadastre-se</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={this.recoverPassword}>
								<Text style={styles.register}>Esqueceu sua senha?</Text>
							</TouchableOpacity>
							<Text style={[styles.register, { textAlign: 'right'}]}>1.4.4</Text>
				</View>
				{/* <View style={{ height: 100 }} /> */}
				</View>
      // </View>
    );
  }
}

export default connect(null, { setUser })(Login)

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#363777'
  },
  inputContainer: {
      borderBottomColor: 'transparent',
      backgroundColor: '#FFFFFF50',
      borderRadius:0,
      borderBottomWidth: 0,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
			color: '#fff',
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    marginLeft:15,
		justifyContent: 'center',
		color: '#54fa2a'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#54fa2a",
  },
  loginText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '400'
	},
	register: {
		textAlign: 'center',
		color: '#fff',
		fontWeigth: 'bold',
		fontSize: 16,
		padding: 10
	}
}