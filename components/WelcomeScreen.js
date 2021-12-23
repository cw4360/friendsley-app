import React from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function WelcomeScreen(props) {
    return (
        <View>
            <Text>Welcome to Friendsley!</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>                    
                <Button title="Sign Up" onPress={() => props.navigation.navigate('Sign Up')}/>
                <Button title="Log In" onPress={() => props.navigation.navigate('Login')}/>
            </View>
            <View>                    
                <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate('Explore')}/>
            </View>
            {/* <View>
                <Button title = "Go to Message Screen" onPress={() => props.navigation.navigate('Message')}/>
            </View>
            <View>
                <Button title = "Go to View All Chats Screen" onPress={() => props.navigation.navigate('View All Chats')}/>
            </View> */}
        </View>
    );
}