import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, Image, Picker, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for storage access
    collection, getDocs,
    doc, addDoc, setDoc,
    query, where, getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function ExploreScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;
    const allProfiles = stateProps.allProfiles; 
    const setAllProfiles = stateProps.setAllProfiles; 
    //const [userProfileDoc, setUserProfileDoc] = useState({}); 
    const userProfileDoc = stateProps.userProfileDoc; 
    const setUserProfileDoc = stateProps.setUserProfileDoc; 
    const userEmail = userProfileDoc.email; 
    const [userContacts, setUserContacts] = useState([]);
    //const userContacts = userProfileDoc.messageContacts; 

    //const [allProfiles, setAllProfiles] = React.useState([]); 
    // State for search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    function onChangeSearch(query) {
        setSearchQuery(query);
    }

    // State for dropdown
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Name (A to Z)', value: 'Name (A to Z)'},
        {label: 'Name (Z to A)', value: 'Name (Z to A)'},
        {label: 'Class Year (Oldest to Youngest)', value: 'Class Year (Oldest to Youngest)'},
        {label: 'Class Year (Youngest to Oldest)', value: 'Class Year (Youngest to Oldest)'},
    ]);
    const [selectedSort, setSelectedSort] = useState('Name (A to Z)');

    /*
    useEffect(() => {
        console.log("userProfileDoc", userProfileDoc);
        console.log("stateProps.userProfileDoc", stateProps.userProfileDoc);  
        if (userProfileDoc) { 
          //props.navigation.navigate("Friendsley"); 
          console.log("USER PROFILE DOC IN EXPLORE", formatJSON(userProfileDoc)); 
          setUserContacts(userProfileDoc.messageContacts);
        }
      }, [userProfileDoc]); // When userProfileDoc changes, this effect is triggered 
      */


    // Get user info when ExploreScreen mounts (when the ExploreScreen loads for the first time)
    useEffect(() => {
        // setAllProfiles([]); 
        console.log("userProfileDoc", userProfileDoc);
        console.log("stateProps.userProfileDoc", stateProps.userProfileDoc);  
        firebaseGetAllProfiles();
        //setUserContacts(userProfileDoc.messageContacts);
        //setUserContacts(stateProps.userProfileDoc.messageContacts); - this doesn't quite work, probably cuz it thinks that the userProfileDoc is null? 
        //console.log("USER PROFILE DOC IN EXPLORE", formatJSON(userProfileDoc)); 
        //setUserContacts(userProfileDoc.messageContacts); // This doesn't quite work, probably cuz it thinks that the userProfileDoc is null? 
    }, []);

    // Adds a person to the user's messageContacts list in Firebase 
    async function addPersonToContacts(email) {
        if (!userContacts.includes(email)) {
            const profileRef = doc(db, 'profiles', userEmail);
            // alert('Submitted');
            const newProfile = {
                messageContacts: [...userContacts, email], 
            }; 
            // Set the new document in Firebase
            await setDoc(profileRef, newProfile, { merge: true });
            //alert("Adding " + email + " to contacts list"); 

            // Get new profile from Firebase, update userProfileDoc in stateProps
            const docRef = doc(db, "profiles", userEmail); 
            const docSnap = await getDoc(docRef); 
            let userDoc = docSnap.data(); 
            console.log("Updated Document data:", userDoc);
            setUserProfileDoc(userDoc);
            console.log(userProfileDoc);
            setUserContacts([...userContacts, email]); 
        }
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
        // console.log("All profiles:", profiles);
    }

    // Filters out the currently logged-in user from allProfiles 
    // Helps ensure that currently logged-in user does not see themselves on the Explore Screen 
    function filterAllProfiles() {
        if (allProfiles.length > 0) {
            // DO NOT call setAllProfiles, since we want the allProfiles state property to reflect ALL users in database
            return allProfiles.filter(profile => profile.email != auth.currentUser.email && 
                profileMatchesQuery(profile)); 
        }
    }

    function profileMatchesQuery(profile) {
        // everything includes the empty string
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
        <ScrollView>
            <SafeAreaView>
                <View style={{margin: 20}}>
                    <Searchbar
                        style={{shadowOpacity: 0, marginBottom: 10}}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    {/* <TouchableOpacity onPress={() => firebaseGetAllProfiles()} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Get All Profiles</Text>
                    </TouchableOpacity>                 */}
                    <DropDownPicker
                        style={{
                            borderColor: 'gray', 
                            fontFamily: 'sans-serif'}}
                        dropDownContainerStyle={{
                            borderColor: 'gray',
                            backgroundColor: 'lightgray'
                          }}
                        placeholder="Sort by"
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
                    {/*If allProfiles isn't empty, render each profile as a Card*/}
                    {allProfiles.length ? (sortProfiles(filterAllProfiles()).map( (user) => {
                        // console.log("Current user", formatJSON(user));
                        return (
                            <View key={user.email}>
                                <Card style={{
                                    alignSelf: 'center', 
                                    width: 275, 
                                    paddingVertical: 20, 
                                    marginVertical: 10,
                                    borderRadius: 20}}>
                                    <Avatar.Image 
                                        style={{alignSelf: 'center', marginVertical: 10}}
                                        size={150}
                                        source={{
                                            uri: 'https://picsum.photos/700'
                                        }}/>
                                    <Card.Content style={{ alignItems: 'center'}}>
                                        <Title style={{marginBottom: 5}}>{user.basics.name}</Title>
                                        <Paragraph>Class of {user.personal.classYear}</Paragraph>
                                        <Paragraph>{user.personal.major}</Paragraph>
                                        <Paragraph>{user.email}</Paragraph>
                                    </Card.Content>
                                    <Card.Actions style={{ alignSelf: 'center'}}>
                                        <Button color='blue' onPress = {() => addPersonToContacts(user.email)}>Message</Button>
                                        <Button color='blue'>Friend</Button>
                                    </Card.Actions>
                                </Card>
                            </View>
                        );
                    })): <View></View>}
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