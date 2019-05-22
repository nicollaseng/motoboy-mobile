import React, { Fragment } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation'
import HeaderView from '../HeaderView';
import * as firebase from 'firebase'
import { connect }  from 'react-redux'


class Chat extends React.Component {
  state = {
    messages: [],
  }

  async componentWillMount() {
		if(this.props.isAdmin){
			const id = this.props.navigation.getParam('id')
			console.log('id do usuario no chat', id)
			await firebase.database().ref(`support/messages/${id}`).on('value', snap => {
				if(snap.val() !== null){
					console.log('mensagens que vem', snap.val())
					this.setState({ messages: snap.val() })
				}
			})
		} else {
			await firebase.database().ref(`support/messages/${this.props.user.id}`).on('value', snap => {
				if(snap.val() !== null){
					this.setState({ messages: snap.val() })
				}
			})
		}
	}
	
	

  onSend = async (messages = [] ) => {
		console.log('messages', messages[0].user._id)
		//  messages[0].user._id = this.props.isAdmin ? 2 : 1
		let user = {
			nome: this.props.user.nome,
			id: this.props.user.id,
		 _id: 2,
		 name: 'React Native',
		 avatar: 'https://lh6.googleusercontent.com/lMjtq4XL2xC4agItMv6w4X1MZ6RI72w96ZFJVpZg6xKnYesM22QCefAFb8xD8C_izNfix4gOkj01q_zN1kmq=w1728-h1266-rw',
	 }
		if(this.props.isAdmin){
			messages[0].user = user
		} else {
			messages[0].user.nome = this.props.user.nome
			messages[0].user.id = this.props.user.id 
		}
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
		}))
		let serverMessage = this.state.messages.length > 0 ? [...messages, ...this.state.messages ] : [...messages]
		await firebase.database().ref(`support/messages/${this.props.isAdmin ? this.props.navigation.getParam('id') : this.props.user.id}`).update({
				...serverMessage
		})
			.then(() => {})
			.catch(error => console.log('error sending messages', error))
	}
	
	onClickBackButton = () => {
    return this.props.navigation.goBack()
  };


  render() {
		console.log('MESSAGES', this.state.messages)
    return (
			<Fragment>
				<HeaderView
          title={'Suporte' }
          onBack={this.onClickBackButton}
        />
				<GiftedChat
				  locale="pt-br"
          placeholder="Envie uma mensagem aqui"
					messages={this.state.messages}
					onSend={messages => this.onSend(messages)}
					user={{
						_id: 1,
					}}
				/>
			</Fragment>
    	)	
  	}
}

const mapStateToProps = state => ({
	user: state.user.user,
	isAdmin: state.admin.admin
})

export default connect(mapStateToProps)(withNavigation(Chat))