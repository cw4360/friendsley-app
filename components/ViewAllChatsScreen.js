import React, {useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity,  } from 'react-native';
import { Avatar,  Searchbar } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext'; 

export default function ViewAllChatsScreens({ navigation}) {
    const stateProps = useContext(StateContext);

    const userProfileDoc = stateProps.userProfileDoc; 
    const messageContacts = userProfileDoc.messageContacts; 

    // State for search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    function onChangeSearch(query) {
        setSearchQuery(query);
    }

    // Filters search query
    function filterAllContacts() {
        if (messageContacts.length > 0) {
            return messageContacts.filter( user => nameMatchesQuery(user.name)); 
        }
    }

    function nameMatchesQuery(name) {
        const lQuery = searchQuery.toLowerCase();
        return name.toLowerCase().includes(lQuery) 
    }
    
    function messageUser(receipentEmail) {
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
            <View style={{marginTop: 10}}>
                <Searchbar
                    style={[globalStyles.searchbar, {marginHorizontal: 10}]}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    selectionColor={'#5971B5'}
                />
                {/* Loop through the current user's message contacts */}
                {messageContacts.length ? (filterAllContacts().sort((a, b) => a.name < b.name ? -1 : 1).map( (contact) => {
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
                                    uri: contact.profilePicUri
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

