/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates.
 * Licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
