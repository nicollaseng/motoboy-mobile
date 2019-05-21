import React, { Component } from  'react'
import {BackHandler} from 'react-native'
import Map from './components/Map'
import { firebaseConfig } from './firebase'
import * as firebase from 'firebase'
import AppContainer from './routes/index'
import { Provider } from 'react-redux';
import { Store }  from './redux/store';
import { ONE_SIGNAL_ID, ONE_SIGNAL_TEST } from './utils/constants'
import { isTest } from './firebase/test'
import OneSignal from 'react-native-onesignal'; // Import package from node modules

console.disableYellowBox = true;

class App extends Component {

	constructor(properties) {
		super(properties);

		OneSignal.init(isTest ? ONE_SIGNAL_TEST : ONE_SIGNAL_ID, {
			kOSSettingsKeyAutoPrompt: true,
			kOSSettingsKeyInFocusDisplayOption:2,
		});
	
			OneSignal.addEventListener('received', this.onReceived);
			OneSignal.addEventListener('opened', this.onOpened);
			OneSignal.addEventListener('ids', this.onIds);
	  }
	

		componentDidMount() {
			BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}

		componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
		}

		handleBackButton() {
			return true;
		}
	
	componentWillMount() {
		!firebase.apps.length ? firebase.initializeApp(firebaseConfig()) : firebase.app();
	}

	onReceived(notification) {
		console.log("Notification received: ", notification);
	  }
	
	  onOpened(openResult) {
		console.log('Message: ', openResult.notification.payload.body);
		console.log('Data: ', openResult.notification.payload.additionalData);
		console.log('isActive: ', openResult.notification.isAppInFocus);
		console.log('openResult: ', openResult);
	  }
	
	  onIds(device) {
		console.log('Device info: ', device);
	  }

	render(){
		return (
			<Provider store={Store}>
				<AppContainer />
			</Provider>
		)
	}
}
 
export default App