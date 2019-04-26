import React, { Component, Fragment} from 'react'
import { Drawer } from 'native-base'
import SideBar from '../Sidebar/Sidebar'
import getSideBarItems from '../Sidebar/SidebarItems'
import Map from '../Map'

export default class DrawerComponent extends Component {

	closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

    render(){
        return (
					<Drawer
						panOpenMask={0.15}
						ref={ref => {
							this.drawer = ref;
						}}
						onClose={() => this.closeDrawer}
						content={<SideBar sideBarItems={getSideBarItems(this)} />}
					>
						<Map
							openDrawer={this.openDrawer}
							closeDrawer={this.closeDrawer}
						/>
				</Drawer>
        )
    }
}