import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import Helper from './../Helper';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverSettings: {
        idPool: null,
        pubsub: null,
        region: 'us-east-1',
        bucket: null,
      },
      isLoading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveKeys = this.saveKeys.bind(this);
    this.getServerSettings = this.getServerSettings.bind(this);
  }

  async componentDidMount() {
	await this.getServerSettings()
  }

  async getServerSettings(){
    await Helper.getServerSettings().then(function(result){
    	console.log(result)
	this.setState({serverSettings: result})
	this.setState({isLoading: false});
    }.bind(this));
  }

  saveKeys() {
	Helper.saveServerSettings(this.state.serverSettings)
  }

  deleteKeys() {
        var noSettings = {
          idPool: null,
          pubsub: null,
          region: 'us-east-1',
          bucket: null,
        }
	this.setState({serverSettings: noSettings});
	Helper.deleteServerSettings(this.state.serverSettings)
  }

  handleChange(key, value) {
    tempset = this.state.serverSettings
    tempset[key] = value
    this.setState({serverSettings: tempset});
  }
  static navigationOptions = {
    title: 'Server Settings',
  };

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
        <Text style={styles.formLabel}>Region</Text>
        <TextInput
          selectTextOnFocus={true}
          style={styles.formInput}
          value={this.state.serverSettings.region}
          onChangeText={value => this.handleChange("region", value)}
        />
        <Text style={styles.formLabel}>IdPool</Text>
        <TextInput
          selectTextOnFocus={true}
          style={styles.formInput}
          value={this.state.serverSettings.idPool}
          onChangeText={value => this.handleChange("idPool", value)}
        />
        <Text style={styles.formLabel}>IotEndpointAddress</Text>
        <TextInput
          selectTextOnFocus={true}
          style={styles.formInput}
          value={this.state.serverSettings.pubsub}
          onChangeText={value => this.handleChange("pubsub", value)}
        />
        <Text style={styles.formLabel}>PatientBucket</Text>
        <TextInput
          selectTextOnFocus={true}
          style={styles.formInput}
          value={this.state.serverSettings.bucket}
          onChangeText={value => this.handleChange("bucket", value)}
        />
        <View style={styles.controlButton}>
          <Button
            title="Save"
            style={styles.controlButton}
            onPress={() => this.saveKeys()}
          />
        </View>
        <View style={styles.controlButton}>
          <Button title="Clear" onPress={() => this.deleteKeys()} />
        </View>
      </KeyboardAvoidingView>
    );
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
