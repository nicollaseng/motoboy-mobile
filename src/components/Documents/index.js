import React, { Component } from 'react';
import validator from 'validator';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Alert,
	StyleSheet,
	TouchableWithoutFeedback,
	Image
} from 'react-native';
import { setUser } from '../../redux/action/auth'
import {
    View,
    Button,
    Item,
    Label,
    Input,
    Container,
    Content,
    Form,
    Text,
    Grid,
    Col,
    Picker,
    Thumbnail,
    Spinner
} from 'native-base';
import Dimensions from '../../utils/dimensions';
import HeaderView from '../../components/HeaderView';
import estados from '../../utils/estados';
import applyMask, { brPhone, unMask, brCpf, brCep }  from '../../utils/maks';
import { colors } from '../../themes'
import { withNavigation } from 'react-navigation'
import * as firebase from 'firebase'
// import uuid from 'uuid/v1'
import moment from 'moment'
import VMasker from 'vanilla-masker'

import axios from 'axios'

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { Fumi } from 'react-native-textinput-effects';
import DropdownAlert from 'react-native-dropdownalert';

import uuid from 'uuid/v1'

const options = {
  title: 'TIRE UMA FOTO DE PERFIL',
  customButtons: [{ name: 'fb', title: 'ESCOLHA DO FACEBOOK' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
	},
	quality: 0.8,
	// allowsEditing: false, 
	maxWidth: 600, maxHeight: 600
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
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
    marginVertical: 20,
    backgroundColor: "#54fa2a"
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
    backgroundColor: "#54fa2a"
  }
});

class UpdateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
			cnhUrl: '',
			cnhImage: '',
    };
	}

	async componentWillMount(){
		if(this.props.user.cnhUrl && this.props.user.cnhUrl.length > 0){
			await axios.get(this.props.user.cnhUrl).then(response => this.setState({ cnhImage: response.data }))
		}
	}

  onClickBackButton = () => {
    return this.props.navigation.goBack()
  };

  validateFieldsAndRegister = () => {
    const {
      cnhImage,
    } = this.state;

    if (cnhImage.length === 0) {
      this.dropdown.alertWithType('error','Atenção', 'É necessário fazer upload de sua foto CNH');
      return;
    }

		this.updateProfile()
	};
	
	updateProfile = async () => {
  
    this.setState({ isLoading: true })
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			cnhUrl: this.state.cnhUrl,
		})
			.then(() => {
					this.initialState()
					this.setState({ isLoading: false })
					this.dropdown.alertWithType('success','Atenção', 'CNH atualizada com sucesso!');
					// this.props.navigation.navigate('Terms')
					// console.log('sucess sending email')
				})
				.catch(err => {
					this.dropdown.alertWithType('error','Atenção', 'Servidor ocupado no momento. Tente novamente em instantes');
					this.setState({ isLoading: false })
					console.log('error set regiser new user firebase', err)
				})
    }

  initialState = () => {
    this.setState({
      cnhUrl: '',
    })
  }
	
  selectPhoto = async (param, key) => {
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
        this.setState({
          photo64: response.data,
          profilePhoto: source
        });
      }
      const image = `data:image/jpeg;base64,${response.data}`
      console.log('api que vai', this.props.api.users, image)
      axios.post(this.props.api.users, {
        file: image,
        id: Math.random(),
        fileType: 'ProfilePhoto'
      })
      .then(async response => {
        this.setState({ isLoading: false })
        this.dropdown.alertWithType('success', 'Atenção', 'O upload da sua foto foi efetuado com sucesso');
        this.setState({ [param]: response.data[1].Location, [key]: image })
      })
      .catch((error) =>  {
        this.setState({ isLoading: false })
        this.dropdown.alertWithType('error', 'Atenção', 'Erro ao fazer upload da foto de perfil. Tente novamente. ');
        console.log('error ao fazer upload da foto', error);
      });
    })
  }

	handleEstadoChange = (estado) => {
		this.setState({ enderecoEstado: estado })
  }

  render() {
    console.log('props and state', this.state, this.props.api, this.props.api.users)
    const { isLoading } = this.state;
    return (
      <Container style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          color={"#54fa2a"}
          title={'Documentos' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
					<View style={{ alignItems: 'center'}}> 
						<Text style={styles.subLabel}> Verifique abaixo a photo de sua CNH. Caso necessite atualizar, clique na photo para fazer upload de um nova foto.
							Lembre-se: é importante manter seus dados e documentos sempre em dia.
						 </Text>
					</View>
				  <View>
						<View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subLabel}> Faça o upload da sua CNH </Text>
              <TouchableWithoutFeedback onPress={() => this.selectPhoto('cnhUrl', 'cnhImage')}>
                <Image
                  source={this.state.cnhImage && this.state.cnhImage.length > 0 ? {uri: `${this.state.cnhImage}`} : require('../../assets/upload.png')} style={{ width: 250, height: 250, resizeMode: 'contain'}} />
              </TouchableWithoutFeedback>
            </View>
            <Button
              block
              style={styles.signUpButton}
              onPress={this.validateFieldsAndRegister}
            >
              <Text>Atualizar</Text>
            </Button>
          </View>
        </Content>
        )}
        <DropdownAlert
					 ref={ref => this.dropdown = ref}
					 closeInterval={15000}
					/>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
	user: state.user.user,
	api: state.api.api,
})

export default connect(mapStateToProps, { setUser })(withNavigation(UpdateProfileScreen))

