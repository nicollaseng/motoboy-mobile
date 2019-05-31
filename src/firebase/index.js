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
		appId: "1:357451698079:web:eb76ae92a97e7674",
	  };
	var test = {
		apiKey: "AIzaSyCO7eGRAN_oebD4V58di8hBezhs16sfNPs",
		authDomain: "motoboy-teste2.firebaseapp.com",
		databaseURL: "https://motoboy-teste2.firebaseio.com",
		projectId: "motoboy-teste2",
		storageBucket: "",
		messagingSenderId: "896134286660",
		appId: "1:896134286660:web:42ba05fb03bc75e1"
	}
	var database = isTest ? test : config
	return database
}

