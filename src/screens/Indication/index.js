import React, { Component } from 'react';
import validator from 'validator';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Alert,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	TextInput
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
import { colors } from '../../themes'
import { withNavigation } from 'react-navigation'

import axios from 'axios'

import DropdownAlert from 'react-native-dropdownalert';

import { Share } from 'react-native';

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
	},
	pickerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 8,
		marginHorizontal: 10,
		elevation: 5,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { x: 0, y: 0},
		shadowRadius: 15,
	},
});

class Indication extends Component {
  constructor(props) {
    super(props);
    this.state = {
			cnhUrl: '',
			cnhImage: '',
    };
	}

  onClickBackButton = () => {
    return this.props.navigation.goBack()
  };

share = () => {
	Share.share({
    message: `Utilize meu código de para se cadastrar e ter benefícios exclusivos: ${this.props.user.inviteCode}. Faça seu cadastro dentro do aplicativo Motoboys de Plantão ou acesse o link https://play.google.com/store/apps/details?id=com.xdev.motoboysdeplantaodriver&hl=en_US`,
    url: 'https://play.google.com/store/apps/details?id=com.xdev.motoboysdeplantaodriver&hl=en_US',
    title: 'Seja parceiro MP?'
  }, {
    // Android only:
    dialogTitle: 'Seja parceiro MP',
    // iOS only:
    excludedActivityTypes: [
      'com.apple.UIKit.activity.PostToTwitter'
    ]
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
          title={'Indicação' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
					<View style={{ alignItems: 'center'}}> 
						<Text style={styles.subLabel}>
							Compartilhe o código abaixo com seus amigos. Para cada amigo que se cadastrar e a cada 10 entregas que ele fizer você ganhará um bônus extra de R$ 2,50 por tempo ideterminado
						</Text>
					</View>
				  <View>
						<View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.subLabel}> Compartilhe o código abaixo. Clique no botão compartilhar </Text>
							<View style={[styles.pickerContainer, { width: '90%', padding: 20}]}>
								<TextInput
									style={{ color: '#666', fontSize: 39, textAlign: 'center'}}
									onChangeText={code => false}
									value={this.props.user.inviteCode.toString()}
								/>
							</View>
            </View>
            <Button
              block
              style={styles.signUpButton}
              onPress={this.share}
            >
              <Text>Compartilhar</Text>
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

export default connect(mapStateToProps, { setUser })(withNavigation(Indication))

