import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, Image, Picker, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
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
    const [userProfileDoc, setUserProfileDoc] = useState({}); 
    const [userContacts, setUserContacts] = useState([]); // I also have this hook in the View All Chats screen - is that bad 
    // To fix the problem in useEffect relating to setUserContacts, does there also need to be a "getProfile" type of function to directly get the current user's profile
    // I thought this problem would've been handled by the login screen (since it should populate the userProfileDoc state property but I guess not, since it's turning up null..?)

    //const [allProfiles, setAllProfiles] = React.useState([]); 
    // State for search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    // State for dropdown
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Name (Ascending)', value: 'nameUp'},
        {label: 'Name (Descending)', value: 'nameDown'},
        {label: 'Class Year (Ascending)', value: 'yearUp'},
        {label: 'Class Year (Descending)', value: 'yearDown'},


    ]);

    // Get user info when ExploreScreen mounts.
    useEffect(() => {
        // setAllProfiles([]); 
        firebaseGetAllProfiles();
        //setUserContacts(stateProps.userProfileDoc.messageContacts); - this doesn't quite work, probably cuz it thinks that the userProfileDoc is null? 
    }, []);

    // Adds a person to the user's contacts 
    function addPersonToContacts(email) {
        if (!userContacts.includes(email)) {
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
    function filterOutSelfFromAllProfiles() {
        if (allProfiles.length > 0) {
            // DO NOT call setAllProfiles, since we want the allProfiles state property to reflect ALL users in database
            return allProfiles.filter(profile => profile.email != auth.currentUser.email); 
        }
    }


    
    // Question for Lyn: How to integrate Profile Card in code? Error: props.basics.name is undefined
    // const ProfileCard = props => {
    //     return (
    //         <Card style={{alignSelf: 'center', width: 275, paddingVertical: 10}}>
    //             <Avatar.Image 
    //                 style={{alignSelf: 'center', marginVertical: 10}}
    //                 size={150}
    //                 source={{
    //                     uri: 'https://picsum.photos/700'
    //                 }} 
    //             />
    //             <Card.Content style={{ alignItems: 'center'}}>
    //                 <Title style={{marginBottom: 5}}>{props.basics.name}</Title>
    //                 <Paragraph>{props.personal.classYear}</Paragraph>
    //                 <Paragraph>{props.personal.major}</Paragraph>
    //                 <Paragraph>{props.email}</Paragraph>
    //             </Card.Content>
    //             <Card.Actions style={{ alignSelf: 'center'}}>
    //                 <Button color='blue'>Message</Button>
    //                 <Button color='blue'>Friend</Button>
    //             </Card.Actions>
    //         </Card>
    //     );
    // }

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
                    </TouchableOpacity>                
                         
                    <TouchableOpacity onPress={() => alert(formatJSON(allProfiles))} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Test</Text>
                    </TouchableOpacity>  */}
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
                    />
                    {/*If allProfiles isn't empty, render each profile as a Card*/}
                    {allProfiles.length ? (filterOutSelfFromAllProfiles().map( (user) => {
                        // console.log("Current user", formatJSON(user));
                        return (
                            <View key={user.email}>
                                <Card style={{alignSelf: 'center', width: 275, paddingVertical: 20, marginVertical: 10}}>
                                    <Avatar.Image 
                                        style={{alignSelf: 'center', marginVertical: 10}}
                                        size={150}
                                        source={{
                                            uri: 'https://picsum.photos/700'
                                        }} 
                                    />
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