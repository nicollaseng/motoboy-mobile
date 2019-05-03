import React, { Component, Fragment } from 'react';
import validator from 'validator';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Alert,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	Text
} from 'react-native';
import { setUser } from '../../redux/action/auth'
import {
    Button,
    Item,
    Label,
    Input,
    Container,
    Content,
    Form,
    Grid,
    Col,
    Picker,
    Thumbnail,
    Spinner
} from 'native-base';
import Dimensions from '../../utils/dimensions';
import HeaderView from '../../components/HeaderView';
import estados from '../../utils/estados';
import applyMask, { brPhone, unMask, brCpf, brCep }  from '../../utils/maks';
import { colors } from '../../themes'
import { withNavigation } from 'react-navigation'
import * as firebase from 'firebase'
// import uuid from 'uuid/v1'
import moment from 'moment'
import VMasker from 'vanilla-masker'
import CalendarStrip from 'react-native-calendar-strip';

const locale = {
	name: 'fr',
  config: {
    months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split(
      '_'
    ),
    monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split(
      '_'
    ),
    weekdays: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
    weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sab'.split('_'),
    weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY LT',
      LLLL: 'dddd D MMMM YYYY LT'
    },
    calendar: {
      sameDay: "[Aujourd'hui à] LT",
      nextDay: '[Demain à] LT',
      nextWeek: 'dddd [à] LT',
      lastDay: '[Hier à] LT',
      lastWeek: 'dddd [dernier à] LT',
      sameElse: 'L'
    },
    relativeTime: {
      future: 'dans %s',
      past: 'il y a %s',
      s: 'quelques secondes',
      m: 'une minute',
      mm: '%d minutes',
      h: 'une heure',
      hh: '%d heures',
      d: 'un jour',
      dd: '%d jours',
      M: 'un mois',
      MM: '%d mois',
      y: 'une année',
      yy: '%d années'
    },
    ordinalParse: /\d{1,2}(er|ème)/,
    ordinal: function(number) {
      return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function(input) {
      return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem: function(hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    // week: {
    //   dow: 1, // Monday is the first day of the week.
    //   doy: 4 // The week that contains Jan 4th is the first week of the year.
    // }
  }
}


const styles = StyleSheet.create({
  date: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 13,
	}
});

class Delivery extends Component {
  constructor(props) {
    super(props);
    this.state = {

			// user register variables
			nome: '',
			earnings: '',
			cpf: '',

			//date

			date: '',
			rides: [],
			ridesFiltered: [],
			startDate: null,
			endDate: null,
			payment: null,
			earning: null,

			// flags
      terms: false,
			isLoading: false,
			
    };
	}
	
  async componentDidMount(){
    const { user } = this.props
		console.log('current user do will', user)


		// let earnings = Object.values(motoboy.earnings)
		// let momentToday = moment().format('DD/MM/YYYY')
		// let earningToday = []
		// _.filter(earnings, e => e.date.substring(0,10) === momentToday).map(earning => {
		// 	return earningToday = [...earningToday, earning.tax]
		// })
		// let totalEarningToday = earningToday.reduce((a,b) => a+b,0)
		// this.setState({ earning: Math.round(( totalEarningToday - 0.12*totalEarningToday ) * 100) / 100})


    if(user){
      this.setState({
				nome: user.nome,
				rides: user.rides,
				cpf: user.cpf,
      })
		}

		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).on('value', snapshot => {
			let motoboy = snapshot.val()
			console.log('motoboy eanring', motoboy)

			if(motoboy.earnings){
				console.log('motoboy eanring', motoboy, motoboy.earnings)
				let earningWeekly = []
				Object.values(motoboy.earnings).map(earning => {
					console.log('earnings', earning.tax)
					return earning.tax.map(earn => {
						return earningWeekly = [...earningWeekly, earn]
					})
				})
				let totalEarningWeekly = earningWeekly.reduce((a,b) => a+b,0)
				console.log('total ', earningWeekly )

				console.log('total earning weekly', motoboy.earnings[0].date.substring(6,10),motoboy.earnings[0].date.substring(3,5), motoboy.earnings[0].date.substring(0,2) )
				this.setState({ 
					earning: (Math.round(( totalEarningWeekly) * 100) / 10)*10,
					startDate: motoboy.earnings[0].date,
					endDate: moment(motoboy.earnings[0].date, "DD-MM-YYYY").add(7, 'days').format('DD/MM/YYYY'),
					paymentDate: moment(motoboy.earnings[0].date, "DD-MM-YYYY").add(10, 'days').format('DD/MM/YYYY'),
				})
			}
	})
}

  onClickBackButton = () => {
    return this.props.navigation.goBack()
  };

  showWarningAlert = (message) => {
    Alert.alert('Atenção', message);
	};
	
	renderDate = (param) => {
			if(param === '01'){
				return 'Jan'
			} 
			if(param === '02'){
				return 'Feb'
			}
			if(param === '03'){
				return 'Mar'
			}
			if(param === '04'){
				return 'Abr'
			}
			if(param === '05'){
				return 'Mai'
			}
			if(param === '06'){
				return 'Jun'
			}
			if(param === '07'){
				return 'Jul'
			}
			if(param === '08'){
				return 'Ago'
			}
			if(param === '09'){
				return 'Set'
			}
			if(param === '10'){
				return 'Out'
			}
			if(param === '11'){
				return 'Nov'
			}
			if(param === '12'){
				return 'Dez'
			}
	}

	renderDelivery = (rides) => {

		let earningWeeklyOff;
		let earningWeeklyTotal;
		let off;

	if(this.state.earning){
		earningWeeklyOff = VMasker.toMoney(this.state.earning - 0.12*this.state.earning)
		earningWeeklyTotal = VMasker.toMoney(this.state.earning)
		off = VMasker.toMoney(0.12*this.state.earning)
	} else {
		earningWeeklyOff = 0
		earningWeeklyTotal = 0
		off = 0
	}
		
				return (
					<View style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						backgroundColor: '#fff',
						paddingVertical: 10,
						paddingHorizontal: 10,
						elevation: 5,
						shadowColor: '#000',
						shadowOpacity: 0.1,
						shadowOffset: { x: 0, y: 0},
						shadowRadius: 10,
						marginBottom: 10,
						marginTop: 20,
					}}>
						<View style={{
							left: 3,
							flex: 0.8
						}}>
							<Text style={{
								fontSize: 12,
								textAlign: 'center',
								color: 'grey'
							}}>
								GANHOS SEMANAIS
							</Text>
							<Text style={{
								fontSize: 27,
								textAlign: 'center',
								color: '#000',
								fontWeight: '600'
							}}>
								R$ {earningWeeklyOff}
							</Text>
							<View style={{ marginTop: 30, paddingHorizontal: 10 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
									<Text style={{ fontWeight: 'bold'}}>Ganhos</Text>
									<Text style={{ fontWeight: 'bold', color: 'grey'}}>	R$ {earningWeeklyOff}</Text>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
									<Text style={{ color: 'grey'}}>Ganhos totais</Text>
									<Text style={{ color: 'grey'}}>	R$ {earningWeeklyTotal}</Text>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
									<Text style={{ color: 'grey'}}>Taxa de serviço</Text>
									<Text style={{ color: 'grey'}}>R$ {off}</Text>
								</View>
							</View>
							<View>
							<Text style={{
								paddingVertical: 15,
								fontSize: 11,
								textAlign: 'justify',
								color: 'grey'
							}}>
								PREZADO MOTOBOY TODOS OS PAGAMENTOS SÃO REALIZADOS NO DÉCIMO DIA 
								APÓS O INICIO DO CICLO DE ENTREGAS. CADA CICLO É COMPOSTO POR 7 (SETE)
								DIAS. 3 (TRÊS) DIAS APÓS O FECHAMENTO DO CICLO A MOTOBOYS DE PLANTÃO IRÁ 
								DEPOSITAR EM SUA CONTA-CORRENTE CADASTRADA O VALOR CORRESPONDENTE AO GANHO SEMANAL.
								<Text style={{ fontWeight: 'bold'}}>FAVOR MANTENHA SEMPRE TODOS OS SEUS DADOS ATUALIZADOS!</Text>
							</Text>
								<Text style={{
									paddingVertical: 10,
									fontSize: 20,
									textAlign: 'center',
									color: '#000',
									fontWeight: '800',
									textAlign: 'center'
								}}>Dados de fechamento</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
										<Text style={{ }}>Data do início</Text>
										<Text style={{ color: 'grey'}}>{this.state.startDate}</Text>
									</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
										<Text style={{ }}>Data do fechamento</Text>
										<Text style={{ color: 'grey'}}>{this.state.endDate}</Text>
									</View>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
										<Text style={{ }}>Próximo pagamento</Text>
										<Text style={{ color: 'grey'}}>{this.state.paymentDate}</Text>
									</View>
						</View>
					</View>
				)
	}

	filterDelivery = param => {
		const { rides } = this.state
		let datefiltered = param.format('DD/MM/YYYY')
		let ridesFiltered = _.filter(rides, e => {
			return e.createdAt.substring(0,10) === datefiltered
		})
		console.log('rides filtered', ridesFiltered)
		this.setState({ ridesFiltered, date: datefiltered })
	}


  render() {
    console.log('dados do usuario minha conta', this.props.user)
    const { isLoading, rides, ridesFiltered } = this.state;
		const { user } = this.props
		
    return (
      <View style={{
				flex: 1,
			}} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          title={'Pagamento' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
					<View style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						{this.renderDelivery(ridesFiltered)}
					</View>
				)}
      </View>
    );
  }
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps, { setUser })(withNavigation(Delivery))

