import React, { useContext } from "react";
import { SafeAreaView, View, Text, Image, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import StateContext from './StateContext';

export default function ProfileScreen(props) {
    const stateProps = useContext(StateContext);
    
    return (
        <ScrollView>
            <SafeAreaView>
                <View>
                    <Text>First Name</Text>
                    <Text>Last Name</Text>
                    <Text>Class Year</Text>
                    <Button title="Go to Explore Screen" onPress={() => props.navigation.navigate('Explore')}/>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}