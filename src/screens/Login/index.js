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
  Alert
} from 'react-native';
import { Spinner } from 'native-base'
import { connect } from 'react-redux'
import * as firebase from 'firebase'
import _ from 'lodash'
import { setUser } from '../../redux/action/auth'

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
		// let userId;
		// OneSignal.init(ONE_SIGNAL_ID, {
		// 	kOSSettingsKeyAutoPrompt: true,
		// });
		// OneSignal.getPermissionSubscriptionState( (status) => {
		// 	userId =  status.userId;
		// 	this.setState({ userId })
		// });
		firebase.auth().onAuthStateChanged(user => {
			console.log('user', user)
			if(user){
				this.setState({ loading: true })
				console.log('USER ON AUTH STATE CHANGE', user.toJSON())
				let userJson = user.toJSON()
				this.setState({ email: user.toJSON().email })
				this._setUserInfo()
			}
			// this.props.navigation.navigate(user ? 'DashBoard' : 'Login')
		})
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
					Alert.alert('Ops :(','E-mail ou senha inválidos')
					console.log('Erro while login firebase', err)
					this.setState({ loading: false })
				})
		}	catch (err) {	
			this.setState({ loading: false })
			Alert.alert('Ops :(','Algo de errado aconteceu. Tente novamente em alguns instantes')
			console.log('Error before login firebase', err)
		}
	}

	_setUserInfo = async key => {
		await firebase.database().ref(`register/commerce/motoboyPartner`).once('value', data => {
			if(data){
				let dataJson = data.toJSON()
				let user = _.filter(Object.values(dataJson), e => e.email === this.state.email)
				console.log('user', user)
				if(user.length > 0){
					if(user[0].status === 'Aprovado'){
						console.log('passou por aqui e user', user[0])
						this.props.setUser(user[0])
						this.props.navigation.navigate('DrawerComponent')
						this.setState({ loading: false })
						console.log('user', user)
					} else if(user[0].status === 'Bloqueado')  {
						Alert.alert('Atenção', 'Sua conta encontra-se temporariamente bloqueada. Entre em contato com nosso suporte')
						this.setState({ loading: false })
					} else {
						Alert.alert('Atenção', 'Seu cadastro ainda está em análise')
						this.setState({ loading: false })
					}
				}
			}
		})
	}


  render() {
		const { loading } = this.state
    return (
      <View style={styles.container}>
				<Fragment>
					<Image source={require('../../assets/logo.png')} style={{ width: 200, height: 200, resizeMode: 'contain'}} />
				</Fragment>
        <View>
					<View style={styles.inputContainer}>
						<Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
						<TextInput style={styles.inputs}
								placeholder="Email"
								keyboardType="email-address"
								underlineColorAndroid='transparent'
								onChangeText={(email) => this.setState({email})}/>
					</View>
					
					<View style={styles.inputContainer}>
						<Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
						<TextInput style={styles.inputs}
								placeholder="Password"
								secureTextEntry={true}
								underlineColorAndroid='transparent'
								onChangeText={(password) => this.setState({password})}/>
					</View>

					{loading ? <Spinner /> : (
							<TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.login}>
								<Text style={styles.loginText}>Login</Text>
							</TouchableHighlight>
					)}
				</View>
				{/* <View style={{ height: 100 }} /> */}
      </View>
    );
  }
}

export default connect(null, { setUser })(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#363777'
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
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
		fontWeight: 'bold'
  }
});