import React from 'react'
import { AsyncStorage } from 'react-native'

export const saveId = async userId => {
    try {
      await AsyncStorage.setItem('userId', userId);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };

export const getId = async () => {
    let userId = '';
    try {
      userId = await AsyncStorage.getItem('userId') || 'none';
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return userId;
  }