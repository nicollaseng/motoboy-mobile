import React, { Component } from  'react'
import { View, Text, Dimensions, Alert, TouchableWithoutFeedback, Image} from 'react-native'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import {
	Button,
	Label,
	Container,
	Spinner,
	Thumbnail
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { colors } from '../../themes'
import HeaderView from '../HeaderView';


const options = {
  title: 'TIRE UMA FOTO DA SUA CNH',
  customButtons: [{ name: 'fb', title: 'ESCOLHA DO FACEBOOK' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
	},
	quality: 0.5,
	// allowsEditing: false, 
	maxWidth: 500, maxHeight: 500
};

class Cnh extends Component {

	constructor(props){
		super(props)
		this.state ={
			delayRunning: false,
			time: 0,
			isLoading: false,
			photo: '',
		}
	}


	componentDidMount(){
		if(this.state.photo.length > 0){
			const images = firebase.storage().ref(`profile/photo/${this.props.user.id}`).child('cnh_photo');
			images.getDownloadURL().then(async (url) => { 
				if(url){
					await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
						photo: url
					})
						.then(() => {
							this.setState({ photo: url })
						})
						.catch(error => {
							console.log('error at foto', error)
						})
				}
		})
		}
}

selectPhoto = async () => {
	/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info in the API Reference)
 */
	await ImagePicker.launchCamera(options, async (response) => {
		this.setState({ 
			isLoading: true
		})
		console.log('response da photo', response)
		if (response.didCancel) {
			this.setState({ isLoading: false })
			console.log('User cancelled image picker');
		} else if (response.error) {
			this.setState({ isLoading: false })
			console.log('ImagePicker Error: ', response.error);
		} else if (response.customButton) {
			this.setState({ isLoading: false })
			console.log('User tapped custom button: ', response.customButton);
		} else {
			const source = { uri: response.uri };
			console.log('source da photo', source)
			this.setState({
				photo64: response.data,
				profilePhoto: source
			});
		}
		const image = `data:image/jpeg;base64,${response.data}`
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			cnh: image
		})
			.then(() => {
				Alert.alert('Atenção', 'Foto da CNH foi salva com sucesso')
				this.props.navigation.navigate('DrawerComponent') 
				this.setState({ isLoading: false })
			})
			.catch(error => {
				console.log('error saving perfil foto', error)
				Alert.alert('Atenção', 'Houve um erro ao salvar sua foto. Tente novamente ou entre em contato com nosso suporte')
			})
	})
}

	render(){
		return (
			<Container style={styles.container} pointerEvents={this.state.isLoading ? 'none' : 'auto'}>
			<HeaderView
				title={'UPLOAD CNH' }
				onBack={() => false}
			/>
			{this.state.isLoading ? (
				<Spinner />
			) : (
				<View style={{ alignItems: 'center'}}> 
						<Label style={styles.logoText}>UPLOAD DA CNH</Label>
						<TouchableWithoutFeedback onPress={() => this.selectPhoto()}>
              <Image
                source={this.state.photo && this.state.photo.length > 0 ? {uri: `${this.state.photo}`} : require('../../assets/avatar.png')} style={{ width: 200, heigth: 200, resizeMode: 'contain'}}/>
						</TouchableWithoutFeedback>
						<Text style={styles.subLabel}> CLIQUE E FAÇA UPLOAD DE SUA CNH </Text>
				</View>
   	 	)
		}	
		</Container>
		)
	}
}
const styles = {
  container: {
		flex: 1,
    backgroundColor: '#fff'
	},
	photoProfile: {
		width: 150,
		heigth: 150,
		resizeMode: 'contain',
		borderRadius: 50,
	},
  holder: {
    padding: Dimensions.padding
  },
  logoTextHolder: {
    alignItems: 'center',
    padding: 20
  },
  logoText: {
    fontSize: 22,
    marginTop: 10
  },
  item: {
    margin: 10
  },
  itemTitle: {
    color: '#666666',
    paddingBottom: 10
  },
  itemContent: {
    paddingLeft: 6,
    paddingBottom: 10
  },
  itemUnderline: {
    flex: 1,
    height: 1,
    backgroundColor: '#cccccc'
  },
  itemRow: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row'
  },
  termsText: {
    marginLeft: 20,
    fontSize: 14,
    color: '#888888'
  },
  signUpButton: {
		margin: 15,
    backgroundColor: colors.button.primary
  },
  signUpButtonText: {
    color: colors.text.footer
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 10
  },
  loginButtonText: {
    color: '#888888'
  },
  loginButtonTextBold: {
    color: '#888888',
    fontWeight: 'bold'
  },
  logoTextHolder: {
    alignItems: 'center',
    marginTop: 40
  },
  logoText: {
		fontWeight: 'bold',
		padding: 10
	},
	subLabel: {
		textAlign: 'center',
		fontSize: 14,
		color: '#ccc',
		padding: 8
  },
  cepButton: {
    backgroundColor: colors.standardButton
  }
}

// const styles = {
// 	container: {
// 		// heigth: Dimensions.get('window').heigth/2,
// 		position: 'absolute',
// 		top: Platform.select({
// 			ios: Dimensions.get('window').height/2.3, android: Dimensions.get('window').height/2.3
// 		}),
// 		justifyContent: 'flex-end',
// 		alignItems: 'flex-end',
// 		right: 13,
// 		// bottom: Platform.select({
// 		// 	ios: 100, android: 80
// 		// }),
// 		// width: '40%',
// 		alignSelf: 'flex-end',
// 	},
// 	subContainer: {
// 		borderRadius: 35,
// 		backgroundColor: '#fff',
// 		padding: 10,
// 		elevation: 10,
// 		shadowColor: '#000',
// 		shadowOpacity: 0.2,
// 		shadowOffset: { x: 0, y: 0},
// 		shadowRadius: 19,
// 	},
// 	title: {
// 		textAlign: 'center',
// 		color: '#222',
// 		fontSize: 14,
// 	},
// 	description: {
// 		textAlign: 'center',
// 		color: '#666',
// 		fontSize: 22,
// 	}
// }

const mapStateToProps = state => ({
	user: state.user.user,
	ride: state.ride.ride,
})

export default connect(mapStateToProps)(Cnh)