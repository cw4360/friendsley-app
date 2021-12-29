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
import { Avatar, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
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
    // Used to just be const userContacts = stateProps.userProfileDoc.messageContacts, but if you log in an navigate directly to the ViewAllChats screen, this line throws an error (probably thinks that the current profile is null) 
    const [userContacts, setUserContacts] = useState([]);
    //console.log("CURRENT USER", formatJSON(userProfileDoc)); 

    // Get user's contacts when View All Chats screen mounts
    useEffect(() => {
        //setUserContacts(stateProps.userProfileDoc.messageContacts); // When I do setUserContacts(userProfileDoc.messageContacts) it says that userProfileDoc is null  
    }, []);
    
    /* Will work once we pass in allProfiles as a state property */
    function getProfileFromEmail(email) {
        let profile = allProfiles.filter(prof => prof.email == email);
        if (profile.length > 0) {
            return profile[0]; 
        }
    }
    
    /*
    function addPersonToContacts(email) {
        if (!userContacts.includes(email)) {
            setUserContacts([...userContacts, email]); 
        }
    }
    */

    return (
        <ScrollView>
        <SafeAreaView>
            <View style={{margin: 20}}>
                <Searchbar
                    style={{shadowOpacity: 0}}
                    placeholder="Search"
                    // onChangeText={onChangeSearch}
                    // value={searchQuery}
                />
                {/* Loop through the current user's message contacts */}
                {userContacts ? (userContacts.map( (email) => {
                    // console.log("Current user", formatJSON(user));
                    return (
                        <View keyExtractor={email}>
                            <Card style={{alignSelf: 'center', width: 275, paddingVertical: 20, marginVertical: 10}}>
                                <Avatar.Image 
                                    style={{alignSelf: 'center', marginVertical: 10}}
                                    size={150}
                                    source={{
                                        uri: 'https://picsum.photos/700'
                                    }} 
                                />
                                <Card.Content style={{ alignItems: 'center'}}>
                                    <Title style={{marginBottom: 5}}>{getProfileFromEmail(email).basics.name}</Title>
                                    {/* <Paragraph>Class of {user.personal.classYear}</Paragraph> */}
                                    {/* <Paragraph>{user.personal.major}</Paragraph> */}
                                    <Paragraph>{email}</Paragraph>
                                </Card.Content>
                                <Card.Actions style={{ alignSelf: 'center'}}>
                                    <Button title="Message" color='blue'/> 
                                    {/*WHY ISN'T THE WORD 'MESSAGE' SHOWING UP?
                                    Catherine: I placed the word 'Message' into a title attribute! 
                                    I hope this fixes the issue. The reason why Button doesn't work
                                    like normal is because this particular Button is from React-Native-Paper's
                                    API (import statement), not React Native's. There was a bug about 
                                    MessageContacts being null so I wasn't able to check if this was fixed.
                                    Alina: Yee yee got it. Thank you :3 
                                    Catherine: Yay!! Np! */}
                                </Card.Actions>
                            </Card>
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