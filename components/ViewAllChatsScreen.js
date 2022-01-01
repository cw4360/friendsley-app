/*
TODO: 
- When user clicks "message" on the Explore screen, that person should be added to "messageContacts"
- In messageContacts, should we store the entire person's document as the messageContact, or should we just store the person's email and then extract the document from their email?
*/

import React, {useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { Avatar, List, Title, Paragraph, Searchbar } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext'; 
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ViewAllChatsScreens({ navigation}) {
    const stateProps = useContext(StateContext);
    const db = stateProps.db;  

    const userProfileDoc = stateProps.userProfileDoc; 
    const allProfiles = stateProps.allProfiles;  
    const recipient = stateProps.recipient; 
    const setRecipient = stateProps.setRecipient; 
    // Used to just be const userContacts = stateProps.userProfileDoc.messageContacts, but if you log in an navigate directly to the ViewAllChats screen, this line throws an error (probably thinks that the current profile is null) 
    //const [userContacts, setUserContacts] = useState([]);
    //console.log("CURRENT USER", formatJSON(userProfileDoc)); 
    const messageContacts = userProfileDoc.messageContacts; 

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
    
    function messageUser(receipentEmail) {
        // setRecipient(receipentEmail); 
    //    navigation.navigate('Message'); 
        const chatUID = firebaseGetChatUID(receipentEmail);
        navigation.navigate('Message', { receipentEmail: receipentEmail, chatUID: chatUID });
    }

    function firebaseGetChatUID(receipentEmail) {
        const receipentContact = messageContacts.filter( contact => contact.email === receipentEmail)[0];
        const chatUID = receipentContact.timestamp;
        return chatUID;
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
                {messageContacts ? (messageContacts.map( (contact) => {
                    return (
                        <View key={contact.email} 
                            style={{ flexDirection: 'row', backgroundColor: 'white', 
                                paddingHorizontal: 20, paddingVertical: 10, 
                                borderBottomWidth: 1, borderBottomColor: 'lightgrey', 
                                alignContents: 'center'}}>
                            <Avatar.Image 
                                style={{alignSelf: 'center', marginVertical: 10}}
                                size={65}
                                source={{
                                    uri: 'https://picsum.photos/700'
                                }} 
                            />
                            <TouchableOpacity onPress={() => messageUser(contact.email)}
                                style={{ flex: .8, backgroundColor: 'white', justifyContent: 'center'}}>
                                <Text style={globalStyles.messageName}>{contact.name}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })): <View></View>}
            </View>
        </SafeAreaView>
    </ScrollView>
    );
}

