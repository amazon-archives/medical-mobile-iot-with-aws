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
import {
  StyleSheet,
  Text,
  View,
  Slider,
  TimerMixin,
  Button,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
  Alert,
} from 'react-native';
import Helper from './../Helper';

export default class HomeScreen extends React.Component {
  state = {
    value: 0,
    needsSettings: true,
    id: null,
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.settingsSet = this.settingsSet.bind(this);
  }

  async componentDidMount() {
    Helper.registerCallback(this.settingsSet)
  }
  static navigationOptions = {
    title: 'Medical Mobile IoT AWS Demo',
  };

  handleChange(value) {
    Helper.setValue(value);
  }

  settingsSet(val) {
    console.log(val)
    this.setState({needsSettings: val})
  }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.needsSettings) {
      return (
        <View style={styles.container}>
          <Text>You need to set the application Server Settings first</Text>

          <Button
            title="Server Settings"
            onPress={() => navigate('ServerSettings')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <React.Fragment>
            <Text>Move the slider to simulate changes in glucose level</Text>
            <Slider
              value={this.state.value}
              style={{width: 200, height: 40}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={value => this.handleChange(value)}
            />
          </React.Fragment>


	<View style={styles.controlButton}>
            <Button
              title="Server Settings"
              onPress={() => navigate('ServerSettings')}
            />
          </View>
          <View style={styles.controlButton}>
            <Button
              title="User Settings"
              onPress={() => navigate('UserSettings')}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    padding: 10,
  },
  formInput: {
    padding: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
  },
  formLabel: {
    padding: 5,
  },
});
