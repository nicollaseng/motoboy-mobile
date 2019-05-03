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

			// flags
      terms: false,
      isLoading: false
    };
	}
	
  componentWillMount(){
    const { user } = this.props
    console.log('current user do will', user)
    if(user){
      this.setState({
				nome: user.nome,
				rides: user.rides,
				cpf: user.cpf,
      })
    }
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
		if(rides.length > 0){
			return rides.map(ride => {
				let date = ride.createdAt.substring(0,10)
				console.log('valor', ride.tax, ride.tax -0.12*ride.tax)
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
					}}>
						<View style={{ flex: 0.15, backgroundColor: '#363777', alignItems: 'center', justifyContent: 'space-around'}}>
							<Text style={[styles.date, { fontSize: 22 }]}>{date.substring(0,2)}</Text>
							<Text style={styles.date}>{this.renderDate(date.substring(3,5))}</Text>
							<Text style={[styles.date, { fontSize: 22 }]}>{date.substring(8,10)}</Text>
						</View>
						<View style={{
							left: 3,
							flex: 0.8
						}}>
							<Text>
								Origem: <Text>{ride.restaurant.nome}</Text>
							</Text>
							<Text>
								Destino: <Text>{ride.delivery.endereco}</Text>
							</Text>
							<Text>
								Retorno: <Text>{ride.retorno ? 'Sim' : 'Não'}</Text>
							</Text>
							<Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'right', color: '#54fa2a' }}>
								Ganhos: <Text> R$ {VMasker.toMoney((Math.round((ride.tax - 0.12*ride.tax)*100)/10)*10)}</Text>
							</Text>
						</View>
					</View>
				)
			})
		}	else {
			return(
				<View style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					<Text style={{
						fontSize: 18,
						fontWeight: 'bold'
					}}>Não há entregas na data selecionada!</Text>
				</View>
			)
		}
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
      <Container style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          title={'Minhas entregas' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
					<Fragment>
						<View style={{
							flex: 0.2,
						}}>
						<CalendarStrip
							onDateSelected={this.filterDelivery}
							ref={c => { this.calendar = c } }
							calendarAnimation={{type: 'sequence', duration: 300}}
							daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
							style={{height: 100, paddingTop: 20, paddingBottom: 3}}
							calendarHeaderStyle={{color: '#363777'}}
							calendarColor={'#54fa2a'}
							dateNumberStyle={{color: '#363777'}}
							dateNameStyle={{color: '#363777'}}
							highlightDateNumberStyle={{color: '#363777'}}
							highlightDateNameStyle={{color: '#363777'}}
							disabledDateNameStyle={{color: '#363777'}}
							disabledDateNumberStyle={{color: '#363777'}}
							// datesWhitelist={datesWhitelist}
							// datesBlacklist={datesBlacklist}
							iconContainer={{flex: 0.1}}
							locale={locale}
						/>
						</View>
						<Content style={styles.holder} keyboardShouldPersistTaps="handled">
							{this.renderDelivery(ridesFiltered)}
						</Content>
					</Fragment>
				)}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps, { setUser })(withNavigation(Delivery))

