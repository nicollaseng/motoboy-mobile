import React, { Component, Fragment} from 'react'
import { Alert } from 'react-native'
import { Drawer } from 'native-base'
import SideBar from '../Sidebar/Sidebar'
import getSideBarItems from '../Sidebar/SidebarItems'
import Map from '../Map'
import * as firebase from 'firebase'

import { connect } from "react-redux"

import { setUser } from '../../redux/action/auth'


class DrawerComponent extends Component {

	closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
	};
	
	handleUserButton = () => {
		this.props.navigation.navigate('Profile')
	}

	handleDeliveryButton = () => {
		this.props.navigation.navigate('Delivery')
	}

	handlePaymentButton = () => {
		this.props.navigation.navigate('Payment')
	}

	handleSignOutButton = () => {
		this.signOut()
	}

	handleChatButton = () => {
		this.props.isAdmin ? this.props.navigation.navigate('ChatList') : this.props.navigation.navigate('Chat')
	}

	handleDocumentsButton = () => {
		Alert.alert('Aviso', 'Em breve você poderá fazer upload e acompanhar a situação de seus documentos pelo aplicativo')
		// this.props.navigation.navigate('Documents')
	}

	handleIndicationButotn = () => {
		Alert.alert('Aviso', 'Em breve você poderá indicar novos amigos e ganhar bônus por indicação')
		// this.props.navigation.navigate('Documents')
	}

	signOut = async () => {
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			rideStatus: false
		})
			.then( async () => {
					await firebase.auth().signOut()
						.then(() => {
							this.props.navigation.navigate('Login')
						})
						.catch(error => {
							console.log('error signout', error)
						})
			})
			.catch(error => {
				Alert.alert('Atenção', 'Houve um erro interno. Tente novamente em alguns instantes')
				console.log('error updating ridestatus', error)
			})
	}

    render(){
        return (
					<Drawer
						panOpenMask={0.15}
						ref={ref => {
							this.drawer = ref;
						}}
						onClose={() => this.closeDrawer}
						content={<SideBar user={this.props.user ? this.props.user : {}} sideBarItems={getSideBarItems(this)} />}
					>
						<Map
							openDrawer={this.openDrawer}
							closeDrawer={this.closeDrawer}
						/>
				</Drawer>
        )
    }
}

mapStateToProps = state => ({
	user: state.user.user,
	isAdmin: state.admin.admin
})

export default connect(mapStateToProps, { setUser })(DrawerComponent)