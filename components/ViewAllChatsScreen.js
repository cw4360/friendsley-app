/*
TODO: 
- When user clicks "message" on the Explore screen, that person should be added to "messageContacts"
- In messageContacts, should we store the entire person's document as the messageContact, or should we just store the person's email and then extract the document from their email?
*/

import React, {useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { Avatar, Card, List, Title, Paragraph, Searchbar } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';
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
    const userEmail = auth.currentUser.email; 
    const userProfileDoc = stateProps.userProfileDoc; 
    const allProfiles = stateProps.allProfiles;  
    const recipient = stateProps.recipient; 
    const setRecipient = stateProps.setRecipient; 
    // Used to just be const userContacts = stateProps.userProfileDoc.messageContacts, but if you log in an navigate directly to the ViewAllChats screen, this line throws an error (probably thinks that the current profile is null) 
    //const [userContacts, setUserContacts] = useState([]);
    //console.log("CURRENT USER", formatJSON(userProfileDoc)); 
    const userContacts = userProfileDoc.messageContacts; 

    // Get user's contacts when View All Chats screen mounts
    /*
    useEffect(() => {
        setUserContacts(stateProps.userProfileDoc.messageContacts); 
    }, []);
    */
    
    /* Will work once we pass in allProfiles as a state property */
    function getProfileFromEmail(email) {
        let profile = allProfiles.filter(prof => prof.email == email);
        if (profile.length > 0) {
            return profile[0]; 
        }
    }
    
    function messageUser(email) {
        setRecipient(email); 
        props.navigation.navigate('Message'); 
    }

    return (
    <ScrollView style={{backgroundColor: '#FFF0BB'}}>
        <SafeAreaView>
            <View>
                <Searchbar
                    style={[globalStyles.searchbar, {marginTop: 10, marginHorizontal: 10}]}
                    placeholder="Search"
                    // onChangeText={onChangeSearch}
                    // value={searchQuery}
                />
                {/* Loop through the current user's message contacts */}
                {userContacts ? (userContacts.map( (contact) => {
                    // console.log("Current user", formatJSON(user));
                    return (
                        <View key={contact.email} 
                            style={{ flexDirection: 'row', backgroundColor: 'white', 
                                paddingHorizontal: 20, paddingVertical: 10, 
                                borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}>
                            <Avatar.Image 
                                style={{alignSelf: 'center', marginVertical: 10}}
                                size={50}
                                source={{
                                    uri: 'https://picsum.photos/700'
                                }} 
                            />
                            <TouchableOpacity onPress={() => messageUser(contact.email)}
                                style={{ flex: .8, backgroundColor: 'white'}}>
                                <List.Item 
                                    title={contact.email}
                                    description="Most recent message"
                                    titleStyle={globalStyles.cardName}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                })): <View></View>}

            {/*<Button title="Go to Login Screen" onPress={() => props.navigation.navigate('Login')}/>*/} 
            </View>
            {/* <View>
                <Button title = "Go to Message Screen" onPress={() => props.navigation.navigate('Message')}/>
            </View>
            <View>
                <Button title = "Go to View All Chats Screen" onPress={() => props.navigation.navigate('View All Chats')}/>
            </View> */}
        </SafeAreaView>
    </ScrollView>
    );
}

