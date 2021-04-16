import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from "react-redux";
import store from "./store/";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from './screens/Home'
import WelcomePage from './screens/WelcomePage'
import SignupUser from './screens/SignupUser'
import Login from './screens/LogIn'

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome Page">
          <Stack.Screen
            name="Welcome Page"
            component={WelcomePage}
            options={{ 
              title: '', 
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#DB3022',
              },
            }}
          />
          <Stack.Screen
            name="Signup User"
            component={SignupUser}
            options={{
              title: '',
              headerTitleAlign: 'center'
            }}
          />
          <Stack.Screen
            name="Login User"
            component={Login}
            options={{
              title: '',
              headerTitleAlign: 'center'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
