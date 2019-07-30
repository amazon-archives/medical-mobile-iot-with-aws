import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import ServerSettingsScreen from './screens/ServerSettingsScreen';
import UserSettingsScreen from './screens/UserSettingsScreen';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  ServerSettings: {screen: ServerSettingsScreen},
  UserSettings: {screen: UserSettingsScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
