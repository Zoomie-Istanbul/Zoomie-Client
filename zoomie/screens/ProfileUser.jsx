import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../axios'

export default function ProfileUser (props) {
  const user = useSelector(state => state.users.user);

  const dispatch = useDispatch();

  useEffect(_ => {
    async function getUser() {
      try {
        const id = await AsyncStorage.getItem('@id');
        const headers = {
          access_token: await AsyncStorage.getItem('@access_token')
        }
        const { data } = await axios.get('/user/' + id, { headers });
        dispatch({ type: 'user/setUser', payload: data });
      }
      catch (err) {
        console.log(err);
      }
    }

    getUser()
  }, [])

  // ini logic load font
  let [fontsLoaded] = useFonts({
    'Bebes Neue': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });
  if (!fontsLoaded || !user) {
    return <AppLoading />
  }
  // end load font

  function historyBookings () {
    console.log("masuk history Bookings")
    props.navigation.navigate('Bookings History User')
  }

  function logOutBtn () {
    Alert.alert("Logout", "Are you sure to Logout?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "Logout", onPress: () => logOut() }
      ]
    );    
  }

  async function logOut () {
    await AsyncStorage.clear();
    props.navigation.replace('Welcome Page');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
        }}
      />
      <Text style={styles.textUsername}>{user.name}</Text>
      <Text style={styles.textEmail}>{user.email}</Text>
      <View style={styles.btnBox}>
        <View style={styles.capsText}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }} onPress={() => historyBookings()}>History Book</Text>
          <Text style={{ fontSize: 11 }}>Your Recent History Book</Text>
        </View>
      </View>
      <View style={styles.btnBox} >
        <View style={styles.capsText}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }} onPress={() => logOutBtn()}>Logout</Text>
          <Text style={{ fontSize: 11 }}>Logout from App</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    fontFamily: 'Bebes Neue',
    backgroundColor: '#F9F9F9'
  },
  title: {
    left: 41,
    fontFamily: 'Bebes Neue',
    fontSize: 34,
    color: '#222222',
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    left: 41,
    top: 10
  },
  textUsername: {
    left: 113,
    top: -35,
    fontFamily: 'Bebes Neue',
    fontSize: 18,
    color: '#222222'
  },
  textEmail: {
    left: 113,
    top: -35
  },
  btnBox: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 409,
    height: 72,
    borderBottomColor: '#828282',
    borderBottomWidth: 1
  },
  capsText: {
    left: 38
  }
});
