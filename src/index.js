import React, { Component } from  'react'
import Map from './components/Map'
import { firebaseConfig } from './firebase'
import * as firebase from 'firebase'
import AppContainer from './routes/index'
import { Provider } from 'react-redux';
import { Store }  from './redux/store';

class App extends Component {
	
	componentWillMount() {
		!firebase.apps.length ? firebase.initializeApp(firebaseConfig()) : firebase.app();
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