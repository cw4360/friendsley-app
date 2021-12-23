import React, {useState, useEffect} from "react";
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
    margin: 'auto',
  },
  editProfileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'lightgrey',
    marginTop: 10,
  },
  infoField: {
    flexDirection: 'row', 
    // justifyContent: 'space-around',
    // borderWidth: 1,
    // borderColor: 'red',
    marginBottom: 15,
    // height: 45,
  },
  profileText: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 15,
    fontSize: 15,
    color: 'black',
  },
  profileField: {
    flexDirection: 'row', 
    // justifyContent: 'space-around',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    // borderColor: 'red',
    marginBottom: 20,
    // height: 45,
  },
  textType: {
    flex: 0.6,
    alignSelf: 'center',
    marginVertical: 'auto',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textInput: {
    flex: 1,
    alignSelf: 'center',
    // marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 15,
    fontSize: 15,
    color: 'grey',
  },
  submitButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginTop: 25,
  },
  submitButtonTitle: {
    fontSize: 18,
    // lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  hidden: {
      display: 'none',
  },
});