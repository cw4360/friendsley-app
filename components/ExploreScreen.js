import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import { globalStyles } from "../styles/globalStyles";
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

export default function ExploreScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    const [allProfiles, setAllProfiles] = React.useState([]); 
    // State for search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    // Get user info when ExploreScreen mounts.
    useEffect(() => {
        // setAllProfiles([]); 
        firebaseGetAllProfiles();
    }, []);

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
                        style={{shadowOpacity: 0}}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <Text>Sort by: </Text>
                    {/* <TouchableOpacity onPress={() => firebaseGetAllProfiles()} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Get All Profiles</Text>
                    </TouchableOpacity>                
                         
                    <TouchableOpacity onPress={() => alert(formatJSON(allProfiles))} 
                        style={globalStyles.editProfileButton}>
                        <Text style={{color: 'black'}}>Test</Text>
                    </TouchableOpacity>  */}

                    {allProfiles.length ? (allProfiles.map( (user) => {
                        // console.log("Current user", formatJSON(user));
                        return (
                            <View keyExtractor={user.email}>
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
                                        <Button color='blue'>Message</Button>
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