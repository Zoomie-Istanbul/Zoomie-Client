import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from '@expo-google-fonts/inter';
import { useDispatch, useSelector } from 'react-redux'
import HistoryOrderCard from '../components/HistoryOrderBengkelCard'
import { fetchAllTransactionById } from '../store/actions/transactions'
import HistoryOrderEmpty from '../components/HistoryOrderEmpty'
import { useIsFocused } from '@react-navigation/native'
import axios from '../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderHistoryBengkel (props) {
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.transactions)
  const [dataFilter, setDataFilter] = useState([])
  const [image, setImage] = useState(null);
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(fetchAllTransactionById())
    getGarageImage();
  }, [isFocused])

  useEffect(() => {
    setDataFilter(transactions.filter(transaction => transaction.status === 10))
  }, [transactions])

  async function getGarageImage() {
    try {
      const id = await AsyncStorage.getItem('@id');
      const headers = {
        access_token: await AsyncStorage.getItem('@access_token')
      }
      const { data } = await axios.get('/garage/', { headers });
      const dataFilter = data.filter(garage => +garage.userId === +id)
      // console.log(dataFilter[0], 'filtered data');
      dispatch({ type: 'user/setUser', payload: dataFilter[0] });
      dataFilter[0].image ? setImage(dataFilter[0].image) : setImage('https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg');        
    }
    catch (err) {
      console.log(err);
    }
  }
  
  let [fontsLoaded] = useFonts({
    'Bebes Neue': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>History Orders</Text>
        <Image 
          style={styles.tinyProfPic}
          source={{
            uri: 'https://image.freepik.com/free-photo/adorable-dark-skinned-adult-woman-dressed-yellow-jumper-using-mobile-phone-with-happy-expression_273609-34293.jpg'
          }}
        />
        {
          image && <Image source={{ uri: image }} style={styles.profilPic} />
        }
      </View>
      <ScrollView>
        {
          dataFilter.length === 0 ? <HistoryOrderEmpty /> :
          dataFilter.map((transaction, index) => {
            return <HistoryOrderCard transaction={transaction} key={index}/>
          })
        }
        {/* <Text>{JSON.stringify(dataFilter)} ini filter</Text> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: 60,
    padding: 10,
    marginBottom: 20,
  },
  headerText: {
    fontFamily: 'Bebes Neue',
    fontStyle: 'normal',
    fontSize: 24,
  },
  tinyProfPic: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'flex-end',
    right: 20,
  },
  profilPic:{
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'flex-end',
    right: 20,
  },
  tinyProfPic: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'flex-end',
    right: 20,
  },
  title: {
    left: 14,
    fontFamily: 'Bebes Neue',
    fontStyle: 'normal',
    fontSize: 34,
    marginBottom: 20,
  },
});