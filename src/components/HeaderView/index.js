import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right
} from 'native-base';
import { colors } from "../../themes"

const HeaderView = ({ title, hasTabs, onBack }) => (
  <Header hasTabs={hasTabs} style={{ backgroundColor: colors.drawer.header }}>
    <Left>
      <Button transparent onPress={() => onBack()}>
        <Icon name="arrow-back" />
      </Button>
    </Left>
    <Body style={{ flex: 3 }}>
      <Title style={{ fontSize: 18, color: '#fff'}}>
        {title}
      </Title>
    </Body>
    <Right />
  </Header>
);

HeaderView.propTypes = {
  onBack: PropTypes.func,
  hasTabs: PropTypes.bool,
  title: PropTypes.string.isRequired
};

HeaderView.defaultProps = {
  hasTabs: false
};

export default HeaderView;
