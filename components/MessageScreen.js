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
    const stateProps = useContext(StateContext);
    // Grab the messages from the stateProps that pertain to the current user
    // Implement "checks" of the database to grab new messages that relate to the current user 
    // Render the messages in a scrollable flatlist, color-code by sender and recipient 
    return (
        <View>
            <Text>Messaging!</Text>
        </View>
    );
}