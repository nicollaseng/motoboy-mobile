import React, { Component, Fragment} from 'react'
import { Drawer } from 'native-base'
import SideBar from '../Sidebar/Sidebar'
import getSideBarItems from '../Sidebar/SidebarItems'
import Map from '../Map'

import { connect } from "react-redux"

class DrawerComponent extends Component {

	closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
	};
	
	handleUserButton = () => {
		this.props.navigation.navigate('Profile')
	}

    render(){
        return (
					<Drawer
						panOpenMask={0.15}
						ref={ref => {
							this.drawer = ref;
						}}
						onClose={() => this.closeDrawer}
						content={<SideBar user={this.props.user ? this.props.user : {}} sideBarItems={getSideBarItems(this)} />}
					>
						<Map
							openDrawer={this.openDrawer}
							closeDrawer={this.closeDrawer}
						/>
				</Drawer>
        )
    }
}

mapStateToProps = state => ({
	user: state.user.user
})

export default connect(mapStateToProps)(DrawerComponent)