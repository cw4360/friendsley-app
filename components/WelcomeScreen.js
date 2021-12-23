import React from 'react';
import { SafeAreaView, View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function WelcomeScreen(props) {
    return (
        <View>
            <Text>Welcome to Friendsley!</Text>
            <View>                    
                <Button title="Go to Login Screen" onPress={() => props.navigation.navigate('Login')}/>
            </View>
            <View>                    
                <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate('Explore')}/>
            </View>
        </View>
    );
}