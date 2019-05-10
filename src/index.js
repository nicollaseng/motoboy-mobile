import React, { Component } from  'react'
import Map from './components/Map'
import { firebaseConfig } from './firebase'
import * as firebase from 'firebase'
import AppContainer from './routes/index'
import { Provider } from 'react-redux';
import { Store }  from './redux/store';
import { ONE_SIGNAL_ID } from './utils/constants'
import OneSignal from 'react-native-onesignal'; // Import package from node modules

console.disableYellowBox = true;

class App extends Component {

	constructor(properties) {
		super(properties);
		
		OneSignal.init(ONE_SIGNAL_ID, {
			kOSSettingsKeyAutoPrompt: true,
			kOSSettingsKeyInFocusDisplayOption:2,
		});
	
		OneSignal.addEventListener('received', this.onReceived);
		OneSignal.addEventListener('opened', this.onOpened);
		OneSignal.addEventListener('ids', this.onIds);
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