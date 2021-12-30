import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, Image, Picker, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';
//import { NavigationActions } from 'react-navigation';

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
    const [userContacts, setUserContacts] = useState(userProfileDoc.messageContacts);
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
    }, []);

    // Adds a person to the user's messageContacts list in Firebase 
    async function addPersonToContacts(email) {
        console.log("CURRENT USER CONTACTS", userContacts); // Why is this sometimes empty? 
        if (!userContacts.includes(email)) {
            const profileRef = doc(db, 'profiles', userEmail);
            const newProfile = {
                messageContacts: [...userContacts, email], 
            }; 
            // Set the new document in Firebase
            await setDoc(profileRef, newProfile, { merge: true });

            // Get new profile from Firebase, update userProfileDoc in stateProps
            const docRef = doc(db, "profiles", userEmail); 
            const docSnap = await getDoc(docRef); 
            let userDoc = docSnap.data(); 
            //console.log("Updated Document data:", userDoc);
            setUserProfileDoc(userDoc);
            //console.log(userProfileDoc);
            setUserContacts([...userContacts, email]); 
        }
        // HOW TO NAVIGATE TO A SUBTAB?! 
        /* Navigation not defined even I imported? 
        props.navigation.navigate(
            'Friendsley', 
            {}, 
            NavigationActions.navigate({
                routeName: 'Message'
            })
        ); 
        Catherine: You can always navigate to a sub-tab, but 
        not to a higher level tab. I think you only need to 
        replace 'Friendsley' with 'Message', but I could be wrong.
        This is how I navigated to Edit Profile screen:
        () => props.navigation.navigate('Message')
        */
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
        <ScrollView style={{backgroundColor: '#FFF0BB'}}>
            <SafeAreaView>
                <View style={{margin: 20}}>
                    {/* <TouchableOpacity onPress={() => firebaseGetAllProfiles()} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Get All Profiles</Text>
                    </TouchableOpacity>                 */}
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
                    {/*If allProfiles isn't empty, render each profile as a Card*/}
                    {allProfiles.length ? (sortProfiles(filterAllProfiles()).map( (user) => {
                        // console.log("Current user", formatJSON(user));
                        return (
                            <View key={user.email}>
                                <Card style={{
                                    alignSelf: 'center', 
                                    width: 275, 
                                    paddingVertical: 20, 
                                    paddingHorizontal: 5,
                                    marginVertical: 10,
                                    borderRadius: 20}}>
                                    <Avatar.Image 
                                        style={{alignSelf: 'center', marginVertical: 10}}
                                        size={150}
                                        source={{
                                            uri: 'https://picsum.photos/700'
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
                                        <TouchableOpacity onPress = {() => addPersonToContacts(user.email)}>
                                            <Text style={{
                                                fontFamily: 'RobotoMono_500Medium', 
                                                color: '#5971B5', 
                                                fontSize: 20}}>MESSAGE</Text>
                                        </TouchableOpacity>
                                        {/* Have the star change dynamically between filled and unfilled when pressed */}
                                        <TouchableOpacity>
                                            <Image 
                                                style={{ width: 25, height: 25, marginLeft: 30 }}
                                                source={require('../assets/star.png')}
                                            />
                                        </TouchableOpacity>
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