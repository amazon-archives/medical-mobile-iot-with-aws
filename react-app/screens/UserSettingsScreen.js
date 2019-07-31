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
  Button,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
} from 'react-native';

import Helper from './../Helper';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: {
        name: "",
        phone: "",
        drname: "",
        drphone: "",
      }
    };
    this.getUser = this.getUser.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  static navigationOptions = {
	  title: 'User Settings',
  };

  async componentDidMount() {
    await this.getUser();
  }

  async getUser(){
    await Helper.getUser().then(function(result){
	this.setState({user: result})
	this.setState({isLoading: false});
    }.bind(this));
  }

  handleChange(key, value) {
    tempuser = this.state.user;
    tempuser[key] = value;
    console.log(tempuser)
    this.setState({user: tempuser});
  }
  saveUser() {
    Helper.saveUser(this.state.user)
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
      return (
              <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  selectTextOnFocus={true}
                  style={styles.formInput}
                  value={this.state.user.name}
                  onChangeText={value => this.handleChange("name", value)}
                />
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  selectTextOnFocus={true}
                  style={styles.formInput}
                  value={this.state.user.phone}
                  onChangeText={value => this.handleChange("phone", value)}
                />
                <Text style={styles.formLabel}>Doctor Name</Text>
                <TextInput
                  selectTextOnFocus={true}
                  style={styles.formInput}
                  value={this.state.user.drname}
                  onChangeText={value => this.handleChange("drname", value)}
                />
                <Text style={styles.formLabel}>Dr Phone</Text>
                <TextInput
                  selectTextOnFocus={true}
                  style={styles.formInput}
                  value={this.state.user.drphone}
                  onChangeText={value => this.handleChange("drphone", value)}
                />
                <View style={styles.controlButton}>
                  <Button title="Save" onPress={() => this.saveUser()} />
                </View>
              </KeyboardAvoidingView>
     )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInput: {
    padding: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
  },
  controlButton: {
    padding: 10,
  },
  formLabel: {
    padding: 5,
  },
});
