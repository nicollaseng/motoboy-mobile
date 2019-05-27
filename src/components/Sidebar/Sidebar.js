import React from "react";

import { TouchableOpacity, Text, Platform, Image } from "react-native";

import {
  Container,
  View,
  Content,
  List,
  ListItem,
  Grid,
  Col,
  Label,
  Icon,
  Header,
  Body,
  Thumbnail
} from "native-base";

import PropTypes from "prop-types";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import { colors } from "../../themes"
import { connect } from "react-redux"
import _ from "lodash"
import axios from 'axios'

import VMasker from 'vanilla-masker'

const SideBar = props => {
	return (
		<Container style={{ backgroundColor: "#fefefe" }}>
		<Content>
			<View style={styles.container}>
					<View style={{ width: '90%', margin: 7, flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.select({
						ios: 40,
						android: 10,
					})}}>
						<Thumbnail
							large
							source={
								props.user.photo && props.user.photo.length > 0 ?
									{uri: `${props.user.photo}`} : require('../../assets/avatar.png')}
						/>
            <TouchableOpacity onPress={() => props.closeDrawer()}>
              <IconAwesome
                size={24}
                style={{ color: "#fff" }}
                name="arrow-right"
              />
            </TouchableOpacity>
					</View>
					<View style={{ margin: 7}}>
						<View style={{ flexDirection: 'row', alignItems: 'center'}}>
							<Text style={styles.headerText}>{props.user.nome.split(' ').slice(0, -1).join(' ')}</Text>
							<View style={{ flexDirection: 'row', alignItems: 'center'}}>
								<Image source={require('../../assets/rating.png')} style={{ width: 15, height: 15, resizeMode: 'contain', marginLeft: 3 }} />
								<Text style={{
									color: '#fff',
									fontWeight: '700',
									marginLeft: 1,
									fontSize: 14
								}}>{props.user.rating ? ((Object.values(props.user.rating).reduce((a,b) => a+b,0))/(Object.values(props.user.rating).length)).toFixed(2) : 'Carregando...'}</Text>
							</View>
						</View>
						<Text style={[styles.headerText, { fontWeight: '200'}]}>{props.user.email}</Text>
					</View>
			</View>
			<List
				dataArray={props.sideBarItems.filter(e => e != undefined)}
				renderRow={item => (
					<View>
						{item && (
							<ListItem icon noBorder onPress={item.action} style={styles.item}>
								<Grid>
									<Col style={{ alignItems: "flex-start", flex: 0.15 }}>
										{item.useAwesome && (
											<IconAwesome
												size={24}
												style={{ color: "#666666" }}
												name={item.icon}
											/>
                    )}
                    {item.useAwesome && item.isAdmin && (
											<IconAwesome
												size={24}
												style={{ color: "#666666" }}
												name={item.icon}
											/>
										)}
										{!item.useAwesome && (
											<Icon
												size={24}
												style={{ color: "#666666" }}
												name={item.icon}
											/>
										)}
									</Col>
									<Col style={{ alignItems: "flex-start", flex: 0.85 }}>
										<Body noBorder style={{ borderBottomWidth: 0 }}>
											<Label style={{ color: "#666666" }}>{item.title}</Label>
										</Body>
									</Col>
								</Grid>
							</ListItem>
            )}
					</View>
				)}
			/>
			</Content>
			<View style={{justifyContent: 'flex-end'}}>
					<Text style={styles.version}>Versão 2.0.1</Text>
			</View>
		</Container>
	)
}
 
const styles = {
  containerDrawer: {
    flex: 1,
    backgroundColor: colors.drawer.header
  },
  headerProfileText: {
    fontSize: 14,
    color: colors.header.primary,
    padding: 9,
    fontWeight: "500"
  },
  headerProfileButton: {
    borderRadius: 60,
    backgroundColor: colors.button.profile
  },
  headerImage: {
    height: 140
  },
  headerItem: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 18,
    backgroundColor: "transparent",
    marginLeft: 0
  },
  item: {
    marginTop: 16,
    backgroundColor: "transparent"
  },
  headerName: {
    color: "#565656",
    fontWeight: "bold"
  },
  headerEmail: {
    color: "#666666",
    fontSize: 16
  },
  headerCondominium: {
    color: "#777777",
    fontSize: 14
  },
  container: {
    flex: 0.5,
    backgroundColor: colors.drawer.header
  },
  header: {
    flex:1,
    backgroundColor: colors.header.primary
  },
  headerText: {
    color: colors.drawer.text,
    fontSize: 14,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'right',
    padding: 10
  }
}

SideBar.propTypes = {
  sideBarItems: PropTypes.array.isRequired
};

export default SideBar