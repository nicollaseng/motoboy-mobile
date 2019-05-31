import React, { Component } from 'react';
import validator from 'validator';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Alert,
	StyleSheet,
	TouchableWithoutFeedback,
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
	maxWidth: 800, maxHeight: 800
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

			// user register variables
			location: {},
      profilePhoto: {},
      photo64: '',
			password: '',
			cpf: '',
      birthday: '',
      phone: '',
			telefone: '',
			email: '',
			dddphone: '',
			nome: '',
			enderecoLogradouro: '',
			enderecoNumero: '',
			enderecoBairro: '',
			enderecoLocalidade: '',
			enderecoComplemento: '',
      enderecoEstado: '',
      enderecoCep: "",
      cnh: '', 
      cnhDate: '', 
      cnhUrl: '',
      cnhImage: "",
      photo:  "",

			//bank data
			bank: '',
			bankAgency: '',
			bankAgencyDigit: '',
			bankAccount: '',
      bankAccountDigit: '',

			// flags
      terms: false,
      isLoading: false
    };
	}

  onClickBackButton = () => {
    return this.props.navigation.goBack()
  };

  onClickTermsButton = () => {
    const { history } = this.props;
    history.push(Paths.terms);
  }

  getPhoneNumberWithCountryCode = phone => `+55${phone}`;

  showWarningAlert = (message) => {
    Alert.alert('Atenção', message);
  };

  toggleLoading = (loading) => {
    this.setState({ isLoading: loading });
  }

  validateEmail = email => validator.isEmail(email);

  validateFieldsAndRegister = () => {
    const {
			telefone,
      email,
      enderecoLogradouro,
      enderecoNumero,
      enderecoBairro,
      enderecoLocalidade,
      cnh,
      cnhDate,
      cnhImage,
      image,
      photo,
    } = this.state;

    console.log('procurando undefined', this.state.photo.length, this.state.cnhImage.length)

    if(!this.validateCpf(unMask(this.state.cpf))){
      this.dropdown.alertWithType('error','Atenção', 'CPF inválido');
      return;
    }


    // if ( photo.length === 0) {
    //   this.dropdown.alertWithType('error','Atenção', 'É necessário fazer upload de sua foto de perfil');
    //   // this.showWarningAlert('Número inválido');
    //   return;
    // }

    // if (cnhImage.length === 0) {
    //   this.dropdown.alertWithType('error','Atenção', 'É necessário fazer upload de sua foto CNH');
    //   // this.showWarningAlert('Número inválido');
    //   return;
    // }

		let validPhone = false;
		
    if (telefone && telefone.length >= 14) {
      validPhone = true;
		}
		
    let validEmail = false;
    if (validator.isEmail(email)) {
      validEmail = true;
    }


    if (!validEmail && !validPhone) {
      this.dropdown.alertWithType('warn', 'Atenção', 'É necessário preencher todos os campos');
      // this.showWarningAlert('É obrigratório preencher ao menos o telefone ou o e-mail');
      return;
    }

    if (validEmail) {
      if (!validPhone) {
      this.dropdown.alertWithType('error', 'Atenção', 'Telefone inválido');
        // this.showWarningAlert('Telefone inválido');
        return;
      }
    }

    if (validPhone) {
      if (!validEmail && email && email.length > 0) {
        this.dropdown.alertWithType('error','Atenção','E-mail inválido');
        // this.showWarningAlert('E-mail inválido');
        return;
      }
    }

    if (cnh.length < 4) {
      this.dropdown.alertWithType('error','Atenção', 'CNH inválida');

      // this.showWarningAlert('Bairro inválido');
      return;
    }

    if (cnhDate.length < 4) {
      this.dropdown.alertWithType('error','Atenção', 'Validade da cnh inválida');
      this.showWarningAlert('Bairro inválido');
      return;
    }
    
    //validate only if old user
      if (enderecoBairro.length < 4) {
        this.dropdown.alertWithType('error','Atenção', 'Bairro inválido');
        // this.showWarningAlert('Bairro inválido');
        return;
      }

      if(enderecoLocalidade && enderecoLocalidade.length < 3) {
        this.dropdown.alertWithType('error','Atenção', 'Cidade inválida');
        // this.showWarningAlert('Cidade inválida');
        return;
      }

      if (enderecoLogradouro && enderecoLogradouro.length < 5) {
        this.dropdown.alertWithType('error','Atenção', 'Endereço inválido');
        // this.showWarningAlert('Endereço inválido');
        return;
      }

      if (enderecoNumero && enderecoNumero.length < 1) {
        this.dropdown.alertWithType('error','Atenção', 'Número inválido');
        // this.showWarningAlert('Número inválido');
        return;
      }

		this.updateProfile()
	};
	
	updateProfile = async () => {
    const { 
       email,
			 telefone,
				dddphone,
				name,
				birthday,
				enderecoEstado,
				enderecoLogradouro,
				enderecoNumero,
				enderecoBairro,
				enderecoLocalidade,
        enderecoComplemento,
        cnh,
        cnhUrl,
        cnhDate,
        cpf,
        photo,
       } = this.state
    
		let currentUser = {
      nome: name,
      photo,
			email,
			dddphone,
			telefone,
			estado: enderecoEstado,
			endereco: enderecoLogradouro,
			numero: enderecoNumero,
			bairro: enderecoBairro,
			cidade: enderecoLocalidade,
			complemento: enderecoComplemento,
			birthday,
      cpf,
      password: unMask(this.state.cpf),
      cnh,
      cnhUrl,
      cnhDate,
      rideStatus: false,
      status: 'Aprovado', //if false partner is blocked to use app
      out: true,
      rideId: false,
      ride: false,
      onRide: false,
      droped: false,
      activeRide: false,
      updateProfile: true,
      rating: [5],
      createdAt: moment().format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: moment().format('DD/MM/YYYY HH:mm:ss'),
    }

    this.setState({ isLoading: true })
    await firebase.database().ref(`register/commerce/motoboyPartner`).once('value',async shot => {
      let moto = shot.val()
      await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
				...currentUser,
			})
				.then(() => {
						this.initialState()
						this.setState({ isLoading: false })
						this.dropdown.alertWithType('success','Atenção', 'Dados atualizados com sucesso!');
						this.props.navigation.navigate('Terms')
						console.log('sucess sending email')
					})
					.catch(err => {
						this.dropdown.alertWithType('error','Atenção', 'Atenção E-mail inválido ou já em uso');
						this.setState({ isLoading: false })
						console.log('error set regiser new user firebase', err)
					})
    	})
    }

  initialState = () => {
    this.setState({
      	// user register variables
			location: {},
      profilePhoto: {},
      photo64: '',
			password: '',
			cpf: '',
      birthday: '',
      phone: '',
			telefone: '',
			email: '',
			dddphone: '',
			nome: '',
			enderecoLogradouro: '',
			enderecoNumero: '',
			enderecoBairro: '',
			enderecoLocalidade: '',
			enderecoComplemento: '',
      enderecoEstado: '',
      cnh: '', 
      cnhDate: '', 

			//bank data
			bank: '',
			bankAgency: '',
			bankAgencyDigit: '',
			bankAccount: '',
			bankAccountDigit: '',

			// flags
      terms: false,
      isLoading: false
    })
  }

  focusInput(inputField) {
    this[inputField]._root.focus();
  }

  handleSearchCepButtonClick = () => {
    this.setState({ isLoading: true });

    if(this.state.enderecoCep.length === 0){
      this.setState({ isLoading: false });
      this.dropdown.alertWithType('error', 'Atenção', 'É necessário inserir CEP');
      return;
    } else {
      fetch(`https://viacep.com.br/ws/${unMask(this.state.enderecoCep)}/json/`)
      .then(response => response.json())
      .then((response) => {
        if (response.erro) {
          this.setState({
            isLoading: false,
            enderecoLogradouro: '',
            enderecoBairro: '',
            enderecoLocalidade: '',
            enderecoEstado: ''
          }, () => { this.validateCep(response); });
        } else {
          this.setState({
            isLoading: false,
            enderecoLogradouro: response.logradouro,
            enderecoBairro: response.bairro,
            enderecoLocalidade: response.localidade,
            enderecoEstado: response.uf
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false
        });
      });
    }
	}
	
  selectPhoto = async (param, key) => {
    await ImagePicker.showImagePicker(options, async (response) => {
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
      if(image){
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
          this.dropdown.alertWithType('error', 'Error', error);
          console.log('error ao fazer upload da foto', error);
        });
      } else {
        this.dropdown.alertWithType('error', 'Atenção', 'No momento não possível fazer o upload da foto, mas você pode continuar a se cadastrar normalmente');
        this.setState({ isLoading: false, [param]: 'http://direitodetodos.com.br/wp-content/uploads/2014/04/idade-m%C3%ADnima-para-trabalhar-motoboy.png', [key]: 'data:image/jpeg;base64,kjdlkfahi23k4h2lk3j4kl23j4l2' })
      }
    })
  }

	handleEstadoChange = (estado) => {
		this.setState({ enderecoEstado: estado })
  }
  
  validateCep(response) {
    if (this.state.enderecoCep) {
      if (!unMask(this.state.enderecoCep).match(/^[0-9]{8}$/) || response.erro) {
        this.dropdown.alertWithType('error', 'Atenção', 'Cep inválido');
      }
    }
  }

  validateCpf = (strCPF) => {
    var Soma;
    var Resto;
    let i;
    Soma = 0;
    if (strCPF == "00000000000") return false;
      
    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
    
      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
    
    Soma = 0;
      for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;
    
      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
      return true;
  }

  noMask = param => {
    console.log('sem mascara', unMask(param))
  }

  handleBirthday = param => {
    let birthday = VMasker.toPattern(param, '99/99/9999')
    this.setState({ birthday })
  }

  handleCnhDate = param => {
    let cnhDate = VMasker.toPattern(param, '99/99/9999')
    this.setState({ cnhDate })
  }

  render() {
    console.log('props and state', this.state, this.props.api, this.props.api.users)
    const { isLoading } = this.state;
    return (
      <Container style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          color={"#54fa2a"}
          title={'Atualizar Perfil' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
					<View style={{ alignItems: 'center'}}> 
						<TouchableWithoutFeedback onPress={() => this.selectPhoto('photo', 'image')}>
              <Thumbnail
                large
                source={this.state.image && this.state.image.length > 0 ? {uri: `${this.state.image}`} : require('../../assets/avatar.png')} />
						</TouchableWithoutFeedback>
						<Text style={styles.subLabel}> Clique e selecione uma foto de perfil </Text>
					</View>
				  <View>
          <Fumi
              label={'Nome Completo'}
              iconClass={FontAwesomeIcon}
              iconName={'user'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              onChangeText={name => this.setState({ name })}
              returnKeyType="next"
              value={this.state.name}
            />
            <Fumi
              label={'Telefone'}
              iconClass={FontAwesomeIcon}
              iconName={'mobile'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={applyMask(this, 'telefone', brPhone)}
              value={this.state.telefone}
              keyboardType="phone-pad"
            />
            <Fumi
              label={'Email'}
              iconClass={FontAwesomeIcon}
              iconName={'envelope'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              keyboardType="email-address"
            />
            <Fumi
              label={'Data de nascimento'}
              iconClass={FontAwesomeIcon}
              iconName={'calendar'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={birthday => this.handleBirthday(birthday)}
              value={this.state.birthday}
            />
						<Grid>
              <Col style={{ flex: 0.6 }}>
                <Fumi
                  label={'CEP'}
                  iconClass={FontAwesomeIcon}
                  iconName={'paper-plane'}
                  iconColor={'#54fa2a'}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  autoCapitalize="words"
                  onEndEditing={() => this.handleSearchCepButtonClick()}
                  returnKeyType="next"
                  keyboardType="phone-pad"
                  onChangeText={applyMask(this, 'enderecoCep', brCep)}
                  value={this.state.enderecoCep}
                />
              </Col>
              <Col
                style={{
                  flex: 0.4,
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Button
                  block
                  style={styles.cepButton}
                  onPress={this.handleSearchCepButtonClick}
                >
                  <Text>
                    Buscar
                  </Text>
                </Button>
              </Col>
            </Grid>
            <Grid>
              <Col style={{ flex: 0.7 }}>
              <Fumi
                  label={'Logradouro'}
                  iconClass={FontAwesomeIcon}
                  iconName={'road'}
                  iconColor={'#54fa2a'}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onChangeText={enderecoLogradouro => this.setState({ enderecoLogradouro })}
                  value={this.state.enderecoLogradouro}
                />
              </Col>
              <Col style={{ flex: 0.3 }}>
              <Fumi
                  label={'Nº'}
                  iconClass={FontAwesomeIcon}
                  iconName={'rocket'}
                  iconColor={'#54fa2a'}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onChangeText={enderecoNumero => this.setState({ enderecoNumero })}
                  value={this.state.enderecoNumero || ''}
                />
              </Col>
            </Grid>
            <Fumi
              label={'Bairro'}
              iconClass={FontAwesomeIcon}
              iconName={'users'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={enderecoBairro => this.setState({ enderecoBairro })}
              value={this.state.enderecoBairro}
            />
            <Grid>
              <Col style={{ flex: 0.7 }}>
                <Fumi
                  label={'Cidade'}
                  iconClass={FontAwesomeIcon}
                  iconName={'city'}
                  iconColor={'#54fa2a'}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onChangeText={enderecoLocalidade => this.setState({ enderecoLocalidade })}
                  value={this.state.enderecoLocalidade}
                />
              </Col>
              <Col style={{ flex: 0.3 }}>
                <View style={styles.estadoContainer}>
                  <Picker
                    mode="dropdown"
                    placeholder="Estado"
                    selectedValue={this.state.enderecoEstado}
                    onValueChange={this.handleEstadoChange}
                  >
                    {estados.map(estado =>
                      <Item key={estado.sigla} label={estado.sigla} value={estado.sigla} />)}
                  </Picker>
                </View>
              </Col>
            </Grid>
            <Fumi
              label={'CPF'}
              iconClass={FontAwesomeIcon}
              iconName={'id-card-alt'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={applyMask(this, 'cpf', brCpf)
                // ( brCpf ) => {
                // this.setState({ password: brCpf, cpf: brCpf })
              }
              // onEndEditing={applyMask(this, 'cpf', brCpf)}
              value={this.state.cpf}
              keyboardType="number-pad"
            />
            <Fumi
              label={'CNH'}
              iconClass={FontAwesomeIcon}
              iconName={'id-badge'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              onChangeText={(cnh ) => this.setState({ cnh })}
              value={this.state.cnh}
              keyboardType="number-pad"
            />
             <Fumi
              label={'Validade CNH'}
              iconClass={FontAwesomeIcon}
              iconName={'calendar'}
              iconColor={'#54fa2a'}
              iconSize={20}
              iconWidth={40}
              inputPadding={16}
              autoCapitalize="words"
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={cnhDate => this.handleCnhDate(cnhDate)}
              value={this.state.cnhDate}
            />
						<View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subLabel}> Faça o upload da sua CNH </Text>
              <TouchableWithoutFeedback onPress={() => this.selectPhoto('cnhUrl', 'cnhImage')}>
                <Thumbnail
                  large
                  square
                  source={this.state.cnhImage && this.state.cnhImage.length > 0 ? {uri: `${this.state.cnhImage}`} : require('../../assets/upload.png')} />
              </TouchableWithoutFeedback>
            </View>
            <Button
              block
              style={styles.signUpButton}
              onPress={this.validateFieldsAndRegister}
            >
              <Text>Enviar</Text>
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

