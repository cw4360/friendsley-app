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

// async function firebaseGetProfiles() {
//     const q = query(collection(db, 'profiles'));
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((profile) => {

//     });
// }

const ProfileCard = props => {
    return (
        <Card style={{alignSelf: 'center', width: 275, paddingVertical: 10}}>
            <Avatar.Image 
                style={{alignSelf: 'center', marginVertical: 10}}
                size={150}
                source={{
                    uri: 'https://picsum.photos/700'
                }} 
            />
            <Card.Content style={{ alignItems: 'center'}}>
                {/* Name */}
                <Title style={{marginBottom: 5}}>props.</Title>
                {/* Class Year */}
                <Paragraph>Class of 2023</Paragraph>
                <Paragraph>Computer Science and Economics</Paragraph>
                <Paragraph>cw4@wellesley.edu</Paragraph>
            </Card.Content>
            <Card.Actions style={{ alignSelf: 'center'}}>
                <Button color='blue'>Message</Button>
                <Button color='blue'>Friend</Button>
            </Card.Actions>
            {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
        </Card>
    );
}

export default function ExploreScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

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
                    

                    <Card style={{alignSelf: 'center', width: 275, paddingVertical: 20, marginVertical: 10}}>
                        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                        {/* <Card.Title style={{paddingVertical: 20}} title="Catherine Wang" subtitle="Class of 2023"/> */}
                        <Avatar.Image 
                            style={{alignSelf: 'center', marginVertical: 10}}
                            size={150}
                            source={{
                                uri: 'https://picsum.photos/700'
                            }} 
                        />
                        <Card.Content style={{ alignItems: 'center'}}>
                            <Title style={{marginBottom: 5}}>Catherine Wang</Title>
                            <Paragraph>Class of 2023</Paragraph>
                            <Paragraph>Computer Science and Economics</Paragraph>
                            <Paragraph>cw4@wellesley.edu</Paragraph>
                        </Card.Content>
                        <Card.Actions style={{ alignSelf: 'center'}}>
                            <Button color='blue'>Message</Button>
                            <Button color='blue'>Friend</Button>
                        </Card.Actions>
                        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                    </Card>

                    <Text>Welcome to the Explore!!</Text>
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