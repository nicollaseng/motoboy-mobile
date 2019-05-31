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
import moment from 'moment'
import VMasker from 'vanilla-masker'

import axios from 'axios'

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { Fumi } from 'react-native-textinput-effects';
import DropdownAlert from 'react-native-dropdownalert';



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

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

			// user register variables
      isLoading: false,
      isRegistered: false,
      cnh: "",
      cpf: "",
      birthday: "",
      password: "",
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
      cpf,
      cnh,
      // birthday,
    } = this.state;

    if(!this.validateCpf(unMask(cpf))){
      this.dropdown.alertWithType('error','Atenção', 'CPF inválido');
      return;
    }

    // if (cnh.length < 4) {
    //   this.dropdown.alertWithType('error','Atenção', 'CNH inválida');
    //   return;
    // }

    // if (birthday.length < 4) {
    //   this.dropdown.alertWithType('error','Atenção', 'Data inválida');
    //   return;
    // }

		this.recover()
	};
	
	recover = async () => {
    const { 
       cpf,
       cnh,
       birthday,
       } = this.state

    this.setState({ isLoading: true })
    await firebase.database().ref(`register/commerce/motoboyPartner`).once('value',async shot => {
      let moto = Object.values(shot.val())
      let isRegistered = _.filter(moto, e => {
          return unMask(e.cpf) == unMask(cpf)
      })
      console.log('é registrado', isRegistered)

      if(isRegistered.length > 0){
        await firebase.database().ref(`register/commerce/motoboyPartner/${isRegistered[0].id}`).update({
          activeRide: false,
          onRide: false,
          ride: false,
          rideId: false,
          password: unMask(cpf),
        })
          .then(async () => {
            if(isRegistered[0].email){
            await axios.post('http://192.168.15.2:8000/user_uid',{
              email: isRegistered[0].email
            })
              .then(async res => {
                console.log('response, uid do usuario', res)
                  await axios.post('http://192.168.15.2:8000/recover_password', {
                    uid: res.data.uid,
                    cpf: unMask(cpf)
                  })
                  .then((res_2) => {
                    console.log('updated password success', res_2)
                    this.setState({ isLoading: false, motoboy: isRegistered[0], password: unMask(cpf), isRegistered: true })
                  })
                  .catch(err => {
                    this.setState({ isLoading: false })
                    console.log(err)
                  })
              })
              .catch(err => {
                this.setState({ isLoading: false })
                console.log(err.message, err)
              })
            }

          
          })
          .catch(error => {
            this.setState({ isLoading: false })
            console.log('Error updating motoboy with standar variables', error)
          })
      } else {
        this.setState({ isLoading: false })
        this.dropdown.alertWithType('error','Atenção', 'A pesquisa não retornou nenhum resultado. Confira se os dados inseridos estão corretos');
      }
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
  
  validateCep(response) {
    if (this.state.enderecoCep) {
      if (!unMask(this.state.enderecoCep).match(/^[0-9]{8}$/) || response.erro) {
        this.dropdown.alertWithType('error', 'Atenção', 'Cep inválido');
      }
    }
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

  renderRecover = () => {
    const { isLoading, isRegistered } = this.state
    if(isLoading){
      return <Spinner />
    } else {
      if(isRegistered){
        return (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center'}}> 
          
              <Text style={styles.subLabel}>  Visualize abaixo os seus dados de acesso a plataforma </Text>
            </View>
            <View>
              <Fumi
                editable={false}
                label={'Email'}
                iconClass={FontAwesomeIcon}
                iconName={'envelope'}
                iconColor={'#54fa2a'}
                iconSize={20}
                iconWidth={40}
                inputPadding={16}
                autoCapitalize="words"
                // returnKeyType="next"
                autoCapitalize="none"
                onChangeText={email => false}
                value={this.state.motoboy.email}
                keyboardType="email-address"
              />
                <Fumi
                  editable={false}
                  label={'Senha'}
                  iconClass={FontAwesomeIcon}
                  iconName={'key'}
                  iconColor={'#54fa2a'}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  autoCapitalize="words"
                  returnKeyType="next"
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={birthday => false}
                  value={this.state.password}
                />
                <Button
                  block
                  style={styles.signUpButton}
                  onPress={this.goBack}
                >
                  <Text>Retornar</Text>
                </Button>
            </View>
          </Content>
        )
      } else {
        return (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
            <View style={{ alignItems: 'center'}}> 
              <Text style={styles.subLabel}> Iremos lhe ajudar a recupera seu acesso. Para isso, preencha todos os dados a seguir. </Text>
            </View>
            <View>
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
                  }
                  value={this.state.cpf}
                  keyboardType="number-pad"
                />
                {/* <Fumi
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
                /> */}
                {/* <Fumi
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
                /> */}
                <Button
                  block
                  style={styles.signUpButton}
                  onPress={this.validateFieldsAndRegister}
                >
                  <Text>Recuperar acesso</Text>
                </Button>
            </View>
          </Content>
        )
      }
    }
  }

  goBack = () => {
    this.setState({
      isRegistered: false,
      cnh: '',
      cpf: '',
      birthday: '',
    })
    this.props.navigation.navigate('Login')
  }

  render() {
    console.log('props and state', this.state, this.props.api, this.props.api.users)
    const { isLoading } = this.state;
    return (
      <Container style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          color={"#54fa2a"}
          title={'Recuperar acesso'}
          onBack={this.onClickBackButton}
        />
         {this.renderRecover()}
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

export default connect(mapStateToProps, { setUser })(withNavigation(RegisterScreen))

