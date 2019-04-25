import React, { Component } from  'react'
import Map from './components/Map'
import { firebaseConfig } from './firebase'
import * as firebase from 'firebase'

class App extends Component {
	
	componentWillMount() {
		!firebase.apps.length ? firebase.initializeApp(firebaseConfig()) : firebase.app();
	}
	
	render(){
		return <Map />
	}
}

export default App