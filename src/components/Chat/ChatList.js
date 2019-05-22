import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import * as firebase from 'firebase'
import moment from 'moment'
import HeaderView from '../HeaderView';
import { TouchableOpacity } from 'react-native'

class ChatList extends Component {

	state = {
		users: [],
		messages: []
	}

	async componentDidMount(){
		await firebase.database().ref(`support/messages`).on('value', snap => {
			if(snap.val() !== null){
				// let ids = Object.keys(snap.val())
				// ids.map(async id => {
				// 	await firebase.database().ref(`register/commerce/motoboyPartner/${id}`).once('value', snapshot => {
				// 		users = [...users, {
				// 			id,
				// 			name: snapshot.val().nome
				// 		}]
				// 	})
				// })
				this.setState({ messages: Object.values(snap.val())})
			}
		})
	}

	renderUsers = () => {
		const { messages } = this.state
		if(messages.length > 0){
			return messages.map(message => {
					return (
						<List>
							<ListItem avatar>
								<Left>
									<Thumbnail source={require('../../assets/avatar.png')} />
								</Left>
								<TouchableOpacity onPress={() => this.navigateChat(message[0].user.id)}>
									<Body>
										<Text>{message[0].user.nome}</Text>
										<Text note>{message[0].text}</Text>
									</Body>
								</TouchableOpacity>
								<Right>
									<Text note>{moment(message[0].createdAt).format('DD/MM/YYYY HH:mm')}</Text>
								</Right>
							</ListItem>
						</List>
				)
			})
		} else {
			return (
				<Text>
					Ainda não há mensagens de usuários
				</Text>
			)
		}
	}

	navigateChat = param => {
		this.props.navigation.navigate('Chat', {
			id: param
		})
	}

	onClickBackButton = () => {
    return this.props.navigation.goBack()
  };


  render() {
		console.log('messages', this.state.messages)
    return (
      <Container>
				<HeaderView
          title={'Motoboys' }
          onBack={this.onClickBackButton}
        />
        <Content>
          {this.renderUsers()}
        </Content>
      </Container>
    );
  }
}

export default ChatList