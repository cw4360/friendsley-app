/*
TODO: 
- When user clicks "message" on the Explore screen, that person should be added to "messageContacts"
- In messageContacts, should we store the entire person's document as the messageContact, or should we just store the person's email and then extract the document from their email?
*/

import React, {useContext, useEffect} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
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
    const userContacts = userProfileDoc.messageContacts; 

    /* Will work once we pass in allProfiles as a state property */
    function getProfileFromEmail(email) {

    }



    /*
    let userContacts = []; 

    useEffect(() => {
        // Why doesn't this work? 
        userContacts = (async () => {
            await firebaseGetCurrentContacts(userEmail); 
        })();
        alert("USERCONTACTS", formatJSON(userContacts)); 
        console.log(userContacts); 
    }, []);

    // Grab currently-logged in user's profile (specifically their messageContacts)
    async function firebaseGetCurrentContacts(email) {
        const docRef = doc(db, "profiles", email);
        const docSnap = await getDoc(docRef);
        //alert("BEFORE THE DOCSNAP.EXISTS() CHECK"); 
        if (docSnap.exists()) {
            //alert("Document data:", docSnap.data());
            let contacts = docSnap.data().messageContacts;  
            console.log("CONTACTS", contacts); 
            //alert(contacts); // console logs the correct thing...
            //alert("GOT HERE!", formatJSON(userDoc)); 
            return contacts; 
        } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
            return []; 
        }
    }
    */

    {/* OLD TEST FLATLIST IN RETURN 
        <View>
            <FlatList>
                data = {userProfileDoc.messageContacts}
                renderItem = {contact => 
                    <TouchableOpacity>
                        <View>
                            <Text>{contact}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </FlatList>
        </View>
        */}

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
                    {userContacts ? (userContacts.map( (user) => {
                        // console.log("Current user", formatJSON(user));
                        return (
                            <View keyExtractor={user}>
                                <Card style={{alignSelf: 'center', width: 275, paddingVertical: 20, marginVertical: 10}}>
                                    <Avatar.Image 
                                        style={{alignSelf: 'center', marginVertical: 10}}
                                        size={150}
                                        source={{
                                            uri: 'https://picsum.photos/700'
                                        }} 
                                    />
                                    <Card.Content style={{ alignItems: 'center'}}>
                                        <Title style={{marginBottom: 5}}>{user}</Title> {/*FIND A WAY TO EXTRACT THE NAME*/}
                                        {/* <Paragraph>Class of {user.personal.classYear}</Paragraph> */}
                                        {/* <Paragraph>{user.personal.major}</Paragraph> */}
                                        <Paragraph>{user}</Paragraph>
                                    </Card.Content>
                                    <Card.Actions style={{ alignSelf: 'center'}}>
                                        <Button color='blue'>Message</Button> {/*WHY ISN'T THE WORD 'MESSAGE' SHOWING UP?*/}
                                    </Card.Actions>
                                </Card>
                            </View>
                        );
                    })): <View></View>}
    
                    <Button title="Go to Login Screen" onPress={() => props.navigation.navigate('Login')}/>
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