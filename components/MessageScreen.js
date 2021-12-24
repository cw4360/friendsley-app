/* 
- This screen will be autopopulated with conversation you selected on the "View All Chats" screen
- Grab all messages relating to the currently-logged-in user 

*/

import React, {useContext, useState} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, 
    ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { initializeApp } from "firebase/app";
import StateContext from './StateContext'; 

export default function MessageScreen(props) {
    // const stateProps = useContext(StateContext);
    return (
        <View>
            <Text>Messaging!</Text>
        </View>
    );
}