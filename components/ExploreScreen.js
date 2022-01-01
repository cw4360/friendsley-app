import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for storage access
    collection, getDocs,
    doc, setDoc, getDoc,
    updateDoc, arrayUnion
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ExploreScreen({ navigation }) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    const allProfiles = stateProps.allProfiles; 
    const setAllProfiles = stateProps.setAllProfiles; 
    const userProfileDoc = stateProps.userProfileDoc; 
    const setUserProfileDoc = stateProps.setUserProfileDoc; 

    const userEmail = userProfileDoc.email; 
    const [userContacts, setUserContacts] = useState(userProfileDoc.messageContacts);  

    // State for search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    function onChangeSearch(query) {
        setSearchQuery(query);
    }

    // State for dropdown
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Name (A to Z)', value: 'Name (A to Z)', 
        labelStyle: {
            color: "#fff",
            paddingHorizontal: 10
          }},
        {label: 'Name (Z to A)', value: 'Name (Z to A)',
        labelStyle: {
            color: "#fff",
            paddingHorizontal: 10
          }},
        {label: 'Class Year (Oldest to Youngest)', value: 'Class Year (Oldest to Youngest)',
        labelStyle: {
            color: "#fff",
            paddingHorizontal: 10
          }},
        {label: 'Class Year (Youngest to Oldest)', value: 'Class Year (Youngest to Oldest)',
        labelStyle: {
            color: "#fff",
            paddingHorizontal: 10
          }},
    ]);
    const [selectedSort, setSelectedSort] = useState('Name (A to Z)');

    // Get user info when ExploreScreen mounts (when the ExploreScreen loads for the first time)
    useEffect(() => { 
        firebaseGetAllProfiles();
    }, []);

    // Searches the messageContact objects for a specific email
    function isContact(messageContacts, email) {
        return messageContacts.filter(contact => contact.email === email).length > 0; 
    }

    // Adds a person to the user's messageContacts list in Firebase 
    async function addPersonToContacts(recipentEmail) {
        if (!isContact(userProfileDoc.messageContacts, recipentEmail)) {
            // Create timestamp (first occurred contact between current user and recipient)
            const now = new Date().getTime().toString(); 

            // Get user and recipent's profile documents in Firebase
            const profileRef = doc(db, "profiles", userEmail);
            // User's profile doc is already stored in stateProps as userProfileDoc

            const recipientProfileRef = doc(db, "profiles", recipentEmail); 
            const recipientProfileSnap = await getDoc(recipientProfileRef);
            const recipentProfileDoc = recipientProfileSnap.data();

            // Create contact objects for the user and recipent's messageContacts
            const newContact = {
                'email': recipentEmail, 
                'name': recipentProfileDoc.basics.name,
                'profilePicUri': recipentProfileDoc.profilePicUri,
                'timestamp': now,
            };

            const newRecipientContact = {
                'email': userEmail, 
                'name': userProfileDoc.basics.name,
                'profilePicUri': userProfileDoc.profilePicUri,
                'timestamp': now,
            };

            // Write the new documents in Firebase
            await updateDoc(profileRef, { messageContacts: arrayUnion(newContact) });
            console.log("Updated user's message contacts");

            await updateDoc(recipientProfileRef, { messageContacts: arrayUnion(newRecipientContact) });
            console.log("Updated receipents's message contacts");

            // Update userProfileDoc in stateProps and userContacts
            const docRef = doc(db, "profiles", userEmail); 
            const docSnap = await getDoc(docRef); 
            let userDoc = docSnap.data(); 

            setUserProfileDoc(userDoc);
            setUserContacts([...userContacts, newContact]); 

            // Create new entry in "Messages" collection database
            await setDoc(doc(db, "messages", now), 
                {
                    'messageObjects': [],  
                },     
            );

        }
    }

    // Adds recipients to user's list of contacts (and vice versa), updates recipient state property
    function messageUser(recipientEmail) {
        addPersonToContacts(recipientEmail); 
        // Navigate to View All Chats Screen
        navigation.navigate('Messages', { screen: 'View All Chats'}); 

    }

    // Grabs all profiles from Firebase, sets the "AllProfiles" state property 
    async function firebaseGetAllProfiles() {
        const querySnapShot = await getDocs(collection(db, "profiles")); 
        let profiles = []; 
        if (!querySnapShot.empty) {
            querySnapShot.forEach(doc => {
                profiles.push(doc.data());
            });
        }
        setAllProfiles(profiles); 
    }

    // Filters out the currently logged-in user from allProfiles 
    // Filters search query
    function filterAllProfiles() {
        if (allProfiles.length > 0) {
            return allProfiles.filter(profile => profile.email != auth.currentUser.email && 
                profileMatchesQuery(profile)); 
        }
    }

    function profileMatchesQuery(profile) {
        // Everything includes the empty string, so if search query is '', 
        // all profiles will be displayed
        const lQuery = searchQuery.toLowerCase();
        const bas = profile.basics;
        const pers = profile.personal;
        const acad = profile.academics;
        const car = profile.career;
        return bas.name.toLowerCase().includes(lQuery) 
        || bas.pronouns.toLowerCase().includes(lQuery)
        || bas.bio.toLowerCase().includes(lQuery)
        || profile.email.toLowerCase().includes(lQuery)
        || pers.classYear.toLowerCase().includes(lQuery)
        || pers.major.toLowerCase().includes(lQuery) 
        || pers.minor.toLowerCase().includes(lQuery) 
        || pers.hometown.toLowerCase().includes(lQuery) 
        || pers.residenceHall.toLowerCase().includes(lQuery) 
        || pers.hobbies.toLowerCase().includes(lQuery) 
        || pers.favPlaceOnCampus.toLowerCase().includes(lQuery) 
        || pers.favWellesleyMemory.toLowerCase().includes(lQuery) 
        || pers.clubs.toLowerCase().includes(lQuery) 
        || acad.currentClasses.toLowerCase().includes(lQuery) 
        || acad.plannedClasses.toLowerCase().includes(lQuery)
        || acad.favClasses.toLowerCase().includes(lQuery) 
        || acad.studyAbroad.toLowerCase().includes(lQuery) 
        || car.interestedIndustry.toLowerCase().includes(lQuery) 
        || car.internshipExp.toLowerCase().includes(lQuery) 
        || car.jobExp.toLowerCase().includes(lQuery);
    }

    function sortProfiles(profiles) {
        // Try/catch clause just in case user didn't fill out a field necessary to sort by 
        try {
            if (selectedSort == 'Name (A to Z)') {
                return profiles.sort((a, b) => a.basics.name < b.basics.name ? -1 : 1); 
            }
            else if (selectedSort == "Name (Z to A)") {
                return profiles.sort((a, b) => a.basics.name < b.basics.name ? 1 : -1);
            }
            else if (selectedSort == 'Class Year (Oldest to Youngest)') {
                return profiles.sort((a, b) => a.personal.classYear < b.personal.classYear ? -1 : 1);
            }
            else if (selectedSort == 'Class Year (Youngest to Oldest)') {
                return profiles.sort((a, b) => a.personal.classYear < b.personal.classYear ? 1 : -1);
            }
        } 
        catch(e) {
            console.log(e); 
            return profiles; 
        }
    }

    return (
        <ScrollView style={{backgroundColor: '#FFF0BB'}}>
            <SafeAreaView>
                <View style={{margin: 10}}>
                    <Searchbar
                        style={globalStyles.searchbar}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        selectionColor={'#5971B5'}
                    />
                    <DropDownPicker
                        style={globalStyles.sortDropDown}
                        dropDownContainerStyle={{
                            borderColor: '#5971B5',
                            backgroundColor: '#5971B5',
                            color: 'white',
                          }}
                        placeholder="Sort By"
                        placeholderStyle={{
                            color: 'white',
                            fontFamily: 'DMSans_500Medium',
                            fontSize: 18,
                            marginLeft: 45
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        listMode="SCROLLVIEW"
                        onChangeValue={() => {
                            console.log("Setting sort type to :", value);
                            setSelectedSort(value);
                        }}
                    />
                    {/*If allProfiles isn't empty, render each profile as a Profile Card*/}
                    {allProfiles.length ? (sortProfiles(filterAllProfiles()).map( (user) => {
                        return (
                            <View key={user.email}
                                style={{
                                    shadowColor: 'grey',
                                    shadowOffset: {width: 0, height: 5},
                                    shadowOpacity: .3}}>
                                <Card onPress={() => navigation.navigate('Explore Profile', {
                                    userEmail: user.email })}
                                    style={{
                                    alignSelf: 'center', 
                                    width: 275, 
                                    paddingVertical: 20, 
                                    paddingHorizontal: 5,
                                    marginVertical: 10,
                                    borderRadius: 20
                                    }}>
                                    <Avatar.Image 
                                        style={{alignSelf: 'center', marginVertical: 10}}
                                        size={150}
                                        source={{
                                            uri: user.profilePicUri
                                        }}/>
                                    <Card.Content style={{ alignItems: 'center'}}>
                                        <Title style={globalStyles.cardName}>{user.basics.name}</Title>
                                        <Paragraph style={globalStyles.cardText}>Class of {user.personal.classYear}</Paragraph>
                                        <Paragraph style={globalStyles.cardText}>{user.personal.major}</Paragraph>
                                        <Paragraph style={globalStyles.cardText}>{user.email}</Paragraph>
                                    </Card.Content>
                                    <Card.Actions style={{ 
                                        flex: 1,
                                        alignSelf: 'center', 
                                        marginTop: 10}}>
                                        <TouchableOpacity onPress = {() => messageUser(user.email)}>
                                            <Text style={{
                                                fontFamily: 'RobotoMono_500Medium', 
                                                color: '#5971B5', 
                                                fontSize: 20}}>MESSAGE</Text>
                                        </TouchableOpacity>
                                    </Card.Actions>
                                </Card>
                            </View>
                        );
                    })): <View></View>}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}