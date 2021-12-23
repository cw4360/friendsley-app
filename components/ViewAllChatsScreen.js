import React, {useContext, useState} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import StateContext from './StateContext'; 
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
    // Lyn sez: replacing \n by <br/> not necesseary if use this CSS:
    //   white-space: break-spaces; (or pre-wrap)
    // let replacedNewlinesByBRs = prettyPrintedVal.replace(new RegExp('\n', 'g'), '<br/>')
    //console.log(JSON.stringify(jsonVal, null, 2)); 
    return JSON.stringify(jsonVal, null, 2);
}

export default function ViewAllChatsScreens(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth; 
    const db = stateProps.db; 
    return (
        <View>
            <Text>{formatJSON(db)}</Text>
        </View>
    );
}