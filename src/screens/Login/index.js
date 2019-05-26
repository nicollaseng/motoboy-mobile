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
	TouchableOpacity, 
	Platform
} from 'react-native';
import { Spinner, Content } from 'native-base'
import { connect } from 'react-redux'
import * as firebase from 'firebase'
import _ from 'lodash'
import { setUser } from '../../redux/action/auth'
import { setAdmin } from '../../redux/action/admin'
import { setApi } from '../../redux/action/api'

import IconAwesome from "react-native-vector-icons/FontAwesome5";

import { getPixelSize, setId } from '../../utils'

import DropdownAlert from 'react-native-dropdownalert';


// import VersionCheck from 'react-native-version-check';

// let latestVersion = VersionCheck.getLatestVersion().then(latestVersion => {
// 		console.log(latestVersion); 
// 	});

import { getAppstoreAppVersion } from "react-native-appstore-version-checker";


let latestVersion = null

getAppstoreAppVersion("com.xdev.motoboysdeplantaodriver") //put any apps packageId here
  .then(appVersion => {
		latestVersion = appVersion
    console.log('version of app', appVersion);
  })
  .catch(err => {
    console.log("error occurred get version of app", err);
	});
	

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email   : '',
			password: '',
			
			// loading
			loading: false,

			isVisible: true,

			versao: 0
    }
  }

	async componentWillMount(){
		await firebase.database().ref('version/versao').once('value', async snap => {
			let versao = snap.val()
			if(versao !== null){
				console.log('versao do app do servidor', versao)
				this.setState({ versao })

				console.log('versao', versao, latestVersion)
				if(latestVersion === versao || Platform.OS === 'ios'){
					try {
					this.setState({ loading: true })
					firebase.auth().onAuthStateChanged(user => {
						console.log('user', user)
						if(user){
							console.log('USER ON AUTH STATE CHANGE', user.toJSON())
							this.setState({ email: user.toJSON().email })
							this._setUserInfo()
							if(user.toJSON().email === 'suporte.motoboysdeplantao@gmail.com'){
								this.props.setAdmin(true)
							}
						} else {
							this.setState({ loading: false })
						}
					})
				} catch( error ) {
					this.setState({ loading: false })
					console.log(error)
				}
				} 
				else {
					this.setState({ loading: false })
					this.dropdown.alertWithType('warn', 'Atenção', 'O seu aplicativo está desatualizado. Favor atualize seu aplicativo na Playstore');
					// alert('O seu aplicativo está desatualizado. Favor atualize seu aplicativo na Playstore')
				}
			}
		})
		firebase.database().ref('api').once('value', snap => {
			if(snap.val() !== null){
				let api = snap.val()
				console.log('api', api)
				this.props.setApi(api)
			}
		})
	}


	login = async () => {
		const { email, password } = this.state

		if(!email.length > 0 || !password.length >0){
			this.dropdown.alertWithType('warn', 'Atenção', 'Parece que você se esqueceu de preencher E-mail ou Senha');
			return;
		}
		
		if(latestVersion === this.state.versao || Platform.OS === 'ios'){
			this.setState({ loading: true })
				firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) // persistence 
				.then(async () => {
					await firebase.auth().signInWithEmailAndPassword(email, password)
						.then(response => {
							console.log(response)
							this._setUserInfo()
						})
						.catch(err => {
							if(err.message ===  "The password is invalid or the user does not have a password."){
								this.dropdown.alertWithType('error', 'Atenção', 'Senha inválida. Se você tiver se esquecido sua senha nós podemos te dar uma forcinha. Clique em Recuperar Senha!');
							} else 	if(err.message ===  "There is no user record corresponding to this identifier. The user may have been deleted."){
								this.dropdown.alertWithType('error', 'Atenção', 'E-mail não encontrado no banco de dados. Você ainda não se cadastrou? Esperando o que, vem ser MP!');
							} else {
								this.dropdown.alertWithType('error', 'Atenção', 'E-mail não encontrado no banco de dados. Você ainda não se cadastrou? Esperando o que, vem ser MP!');
							}
							console.log('Erro while login firebase', err)
							this.setState({ loading: false })
						})
				})
				.catch((error) => {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
				});
		} else {
			this.setState({ loading: false })
			this.dropdown.alertWithType('warn', 'Atenção', 'Seu aplicativo está desatualizado, que tal atualizar? Basta ir na Playstore e baixar a versão mais recente.');
		}
	}

	_setUserInfo = async key => {
		await firebase.database().ref('version/versao').once('value', async snap => {
			let versao = snap.val()
			// console.log('versao', versao, latestVersion)

			await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', data => {
				if(data !== null){
					let dataJson = data.toJSON()
					// console.log('email lower case', dataJson)
					let user = _.filter(Object.values(dataJson), e => {
						if(e.email && e.email.length > 0){
							return e.email.toLowerCase().includes(this.state.email.toLowerCase()) 
						}
					})
					// console.log('user', user)
					if(user.length > 0){
						user.map(async user => {
							let navigation = user.updateProfile ? 'DrawerComponent' : 'UploadProfile'
							if(user.email.toLowerCase() === this.state.email.toLowerCase()){
								if(latestVersion === versao || Platform.OS === 'ios'){
									if(user.status === 'Aprovado'){
										// ASSURE THAT RIDE ID AND RIDE WILL NOT BLOCK USER LOGIN IF USER HAS NOT ANY ACTIVE RIDE RUNNING
										if(user.activeRide && !Object.values(user.activeRide).length > 0){
											await firebase.database().ref(`register/commerce/motoboyPartner/${user.id}`).update({
												rideId: false,
												ride: false,
												out: false,
											})
											.then(() => {
												let isAdmin = user.email.toLowerCase() === 'suporte.motoboysdeplantao@gmail.com'
												this.props.setAdmin(isAdmin)
												this.props.setUser(user)

												setId(user.id)
												this.props.navigation.navigate(`DrawerComponent`)
												this.setState({ loading: false })
												// console.log('user', user)
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
													setId(user.id)
													this.props.navigation.navigate(`${navigation}`)
													this.setState({ loading: false })
													console.log('user', user)
												})
												.catch(error => {
													this.dropdown.alertWithType('warn', 'Erro', 'Nossos servidores estão temporariamente indisponíveis. Por favor tente novamente em instantes!', error);
												})
										}
										if(user.droped){
											await firebase.database().ref(`register/commerce/motoboyPartner/${user.id}`).update({
												ride: false,
												rideId: false,
												onRide: false,
												droped: false,
											})
											.then(() => {
												this.props.setUser(user)
												setId(user.id)
												this.props.navigation.navigate(`${navigation}`)
												this.setState({ loading: false })
												console.log('user', user)
											})
											.catch(error => {
												this.dropdown.alertWithType('warn', 'Erro', 'Nossos servidores estão temporariamente indisponíveis. Por favor tente novamente em instantes!', error);
											})
										}
									} else if(user.status === 'Bloqueado')  {
										this.dropdown.alertWithType('warn', 'Atenção', 'Sua conta encontra-se temporariamente bloqueada. Entre em contato com nosso suporte');
										this.setState({ loading: false })
									} else {
										this.dropdown.alertWithType('warn', 'Atenção', 'Seu cadastro está em análise. Aguarde 24h e tente novamente!');
										this.setState({ loading: false })
									}
								}	else {
									this.dropdown.alertWithType('warn', 'Atenção', 'Seu aplicativo está desatualizado, que tal atualizar? Basta ir na Playstore e baixar a versão mais recente.');
									this.setState({ loading: false })
								}
							} else {
								this.dropdown.alertWithType('error', 'Atenção', 'E-mail não encontrado no banco de dados. Você ainda não se cadastrou? Esperando o que, vem ser MP!');
								this.setState({ loading: false })
							}
						})
					} else {
						this.dropdown.alertWithType('error', 'Atenção', 'Não foram encontrados registros de usuário com o email informado no banco de dados. ');
						this.setState({ loading: false })
					}
				}
			})

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
        <View>
					<View style={{ flex: 0, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
						<Image source={require('../../assets/logo.png')} style={{ width: 180, height: 180, resizeMode: 'contain'}} />
					</View>
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
										secureTextEntry={this.state.isVisible}
										underlineColorAndroid='transparent'
										onChangeText={(password) =>this.state.blocked ? '' : this.setState({password})}
										value={this.state.password}
										keyboardType="number-pad"
								/>
									<TouchableOpacity onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
										<IconAwesome
											size={22}
											style={[styles.inputIcon, { marginLeft: 0, padding: 10 }]}
											name={"eye"}
										/>
									</TouchableOpacity>
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
								<Text style={styles.register}>Recuperar acesso</Text>
							</TouchableOpacity>
							<Text style={[styles.register, { textAlign: 'right'}]}>2.0.1</Text>
					</View>
					<DropdownAlert
					 ref={ref => this.dropdown = ref}
					 closeInterval={10000}
					/>
				{/* <View style={{ height: 100 }} /> */}
				</View>
      // </View>
    );
  }
}

export default connect(null, { setUser, setAdmin, setApi })(Login)

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'rgba(62, 65, 126, 1)'
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