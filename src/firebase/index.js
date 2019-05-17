import { isTest } from './test'

export const firebaseConfig = () => {
	// var config = {
	// 	apiKey: "AIzaSyDnXghX4B9z0fqg5qLFf3c0XQadmPKkh9k",
	// 	authDomain: "motoboyplantao-1554169039556.firebaseapp.com",
	// 	databaseURL: "https://motoboyplantao-1554169039556.firebaseio.com",
	// 	projectId: "motoboyplantao-1554169039556",
	// 	storageBucket: "motoboyplantao-1554169039556.appspot.com",
	// 	messagingSenderId: "422610018589"
	//   };
	var config = {
		apiKey: "AIzaSyCnp4Io0F_6HMxsYtinE8QmqemQxabhHoI",
		authDomain: "motoboy-mobile.firebaseapp.com",
		databaseURL: "https://motoboy-mobile.firebaseio.com",
		projectId: "motoboy-mobile",
		storageBucket: "motoboy-mobile.appspot.com",
		messagingSenderId: "357451698079",
		appId: "1:357451698079:web:eb76ae92a97e7674"
	  };
	var test = {
		apiKey: "AIzaSyDlgrMyc-e2TbkUoPpx1mvmNdp4ionzTXE",
		authDomain: "motoboy-teste.firebaseapp.com",
		databaseURL: "https://motoboy-teste.firebaseio.com",
		projectId: "motoboy-teste",
		storageBucket: "motoboy-teste.appspot.com",
		messagingSenderId: "957945046455",
		appId: "1:957945046455:web:1cd16085ed7f9d84"
	}
	var database = isTest ? test : config
	return database
}

