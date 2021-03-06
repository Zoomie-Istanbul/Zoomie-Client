import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from '@expo-google-fonts/inter';
import axios from '../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import starRating from '../helpers/starRating';

const width = Dimensions.get('window').width; 

export default function FavoriteCard(props) {
  const { favorite } = props;
  const [score, setScore] = useState('-')

  useEffect(_ => {
    let mounted = true;
    getReviews();
    
    return function cleanup () {
      mounted = false;
    }
  }, [])

  const getReviews = async () => {
    try {
      const headers = {
        access_token: await AsyncStorage.getItem('@access_token')
      }
      const { data } = await axios.get('/reviews/', { 
          params: { 
            garage: favorite.Garage.id 
          }, 
          headers 
        })
      if (data.length > 0) {
        let temp = data.reduce((n, {score}) => n + score, 0) / data.length;
        setScore(temp.toFixed(1));
      }
    } catch (error) {
      console.log(error);
    }
  }

  let [fontsLoaded] = useFonts({
    'Bebes Neue': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Montserrat': require('../assets/fonts/Montserrat-Medium.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const goToDetail = (garage) => {
    props.props.navigation.navigate('Detail Shop', {
      garage
    })
  }

  const booking = (garage) => {
    props.props.navigation.navigate('Chat', {
      garage
    })
  }
  
  const deleteFavoriteBtn = (id) => {
    Alert.alert("Delete Favorites", "Are you sure to delete?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "Delete", onPress: () => deleteFavorite(id)}
      ]
    );    
  } 

  const deleteFavorite = async (id) => {
    try {
      const headers = {
        access_token: await AsyncStorage.getItem('@access_token')
      }
      const { data } = await axios.delete('/favorites/' + id, { headers });
      props.refetch();
      Alert.alert("Deleted from Favorites!");
    } catch (err) {
      console.log(err.response);
    }
  }
  
  return (
    <View style={styles.card}>
      <View>
        <TouchableOpacity onPress={() => goToDetail(favorite.Garage)}>
          <Image 
            style={styles.cardImg}
            source={{
              uri: favorite.Garage.image
            }}
            onPress={() => goToDetail()}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <View>
          <Text style={styles.cardName} onPress={() => goToDetail(favorite.Garage)}>{favorite.Garage.name}</Text>
          <Text style={styles.cardAddress} onPress={() => goToDetail(favorite.Garage)}>{favorite.Garage.address}</Text>
          <Text onPress={() => goToDetail(garage)}>{starRating(score)}</Text>
        </View>
        <View style={styles.btnGroups}>
          <TouchableOpacity style={styles.btnFavorite}>
            <Text style={styles.btnFavoriteText} onPress={() => deleteFavoriteBtn(favorite.id)}>DELETE FAVORITE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnBook} onPress={() => booking(favorite.Garage)}>
            <Text style={styles.btnFavoriteText}>BOOK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    margin: 20,
    marginBottom: 15,
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    flexDirection: 'row',
    borderRadius: 8,
    borderColor: '#DB3022',
    borderTopWidth:5,
    borderBottomWidth:1,
  },
  cardImg: {
    width: 110,
    height: 110,
    top: -25,
    borderRadius: 10,
  },
  cardInfo: {
    width: width * 0.48,
    marginLeft: 20,
  },
  cardName: {
    fontFamily: 'Bebes Neue',
    fontStyle: 'normal',
    fontSize: 20,
  },
  cardAddress: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontSize: 14,
    color: '#9B9B9B',
  },
  btnGroups: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },
  btnFavorite: {
    width: width * 0.22,
    height: 30,
    marginRight: 15,
    backgroundColor: '#DB3022',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFavoriteText: {
    fontFamily: 'Bebes Neue',
    color: '#ffffff',
    fontSize: 11,
  },
  btnBook: {
    width: width * 0.22,
    height: 30,
    backgroundColor: '#4F4F4F',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBookText: {
    fontFamily: 'Bebes Neue',
    color: '#ffffff',
    fontSize: 11,
  },
});