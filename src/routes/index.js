
import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import screens from './screens';

const AppNavigator = createStackNavigator({
	Login: {
		screen: screens.Login
	},
	Map: {
		screen: screens.Map
    },
    DrawerComponent: {
		screen: screens.DrawerComponent
    },
    Profile: {
		screen: screens.Profile
    },
    Delivery: {
		screen: screens.Delivery
    },
    Payment: {
		screen: screens.Payment
	},
	Register: {
		screen: screens.Register
	},
	RecoverPassword: {
		screen: screens.RecoverPassword
	},
	Chat: {
		screen: screens.Chat
	},
	ChatList: {
		screen: screens.ChatList
	},
	Documents: {
		screen: screens.Documents
	},
	Photo: {
		screen: screens.Photo
	},
},
{
	initialRouteName: 'Login',
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	},
}
)

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer