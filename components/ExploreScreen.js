import React from 'react';
import { SafeAreaView, View, Text, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';


export default function ExploreScreen(props) {
    return (
        <View>
            <Text>Welcome to the Explore!</Text>
            <Button title="Go to Login Screen" onPress={() => props.navigation.navigate('Login')}/>
        </View>
    );
}