import Amplify, {PubSub, Auth, Storage} from 'aws-amplify';
import {AWSIoTProvider} from '@aws-amplify/pubsub/lib/Providers';
import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
} from 'react-native';

class Helper {
  constructor() {
    this.state = {
      user: { 
        id: null,
        phone: null,
        name: null,
        drphone: null,
      },
      dr: null,
      serverSettings: {
        idPool: null,
        pubsub: null,
        region: 'us-east-1',
        bucket: null,
      },
      value: 0,
      needsSettings: true,
    }
    this.checkSettings();
  }
  registerCallback(callback){
    this.callback = callback
  }

  settingsSet() {
    this.callback(this.state.needsSettings);
  }

  needsSettings() {
    return this.state.needsSettings;
  }
  setValue(val){
	this.state.value = val
  }
  async checkSettings() {
    await this.getServerSettings().then(async () => {
      if (!this.needsSettings()) {
        await this.awsBootstrap(this.state.serverSettings).then(() => {
          let timer = setInterval(this.tick, 1000);
      	  this.state.timer = timer
	}).then(() => { this.getUser() });
      }
    });
  }

  async getServerSettings() {
    var tempvals = {};
    var needs = false;
    for (var key in this.state.serverSettings) {
      try {
        await AsyncStorage.getItem('@MediacalIotAWS:' + key).then(value => {
          tempvals[key] = value;
          if (value === null || value == "" || !this.validateSettings(key, value)) {
            needs = true;
          }
        });
      } catch (error) {
        console.log('Error retrieving data' + error);
      }
    }
    this.state.needsSettings = needs;
    this.settingsSet()
    this.state.serverSettings = tempvals;
    return this.state.serverSettings
  }

  async saveServerSettings(vals) {
    entries = Object.entries(vals)
    valid = true
    for (const [key, val] of entries) {
        if (this.validateSettings(key, val)) {
          try {
            await AsyncStorage.setItem('@MediacalIotAWS:' + key, val);
          } catch (error) {
            console.log('Error saving data' + error);
          }
        } else {
	  valid = false
	}
    }
    if (valid) {
      this.state.serverSettings = vals
      Alert.alert(
        'Settings',
        'Saved',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );
      this.checkSettings()
    }
  }

  validateSettings(key, val) {
    const regex = {
      region: new RegExp(/^(?:ap|cn|eu|us)-[a-z]*-[0-9]{1}/g),
      idPool: new RegExp(
        /^(?:ap|cn|eu|us)-[a-z]*-[0-9]{1}\:[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g,
      ),
      pubsub: new RegExp(
        /^[a-z0-9]{14}(-ats)?\.iot\.(?:ap|cn|eu|us)-[a-z]*-[0-9]{1}\.amazonaws.com/g,
      ),
      bucket: new RegExp(
        /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)/,
      ),
    };

    res = regex[key].exec(val);
    if (res === null || val === null || res[0] !== val) {
      this.invalidSetting(key, val);
      return false;
    }
    return true;
  }

  invalidSetting(key, value) {
    Alert.alert(
      key,
      value + ' is an inavlid value',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: true},
    );
  }

  async deleteServerSettings() {
    const entries = Object.entries(this.state.serverSettings);
    for (const [key, val] of entries) {
        try {
          await AsyncStorage.removeItem('@MediacalIotAWS:' + key);
        } catch (error) {
          console.log('Error clearing data' + error);
        }
    }
    this.serverSettings = {
        idPool: null,
        pubsub: null,
        region: 'us-east-1',
        bucket: null,
    }
  }


  async awsBootstrap(config) {
    Amplify.configure({
      Auth: {
        identityPoolId: config.idPool,
        region: config.region,
        mandatorySignIn: false,
      },
      Storage: {
        AWSS3: {
          bucket: config.bucket,
          region: config.region,
        },
      },
    });

    await Auth.currentCredentials().then(info => {
      this.state.id = info._identityId;
      console.log(this.state.id)
    });

    Amplify.addPluggable(
      new AWSIoTProvider({
        aws_pubsub_region: config.region,
        aws_pubsub_endpoint: "wss://" + config.pubsub + "/mqtt",
      }),
    );
  }
  async getUser() {
    Storage.get('config.json', {level: 'private'})
      .then(result =>
        fetch(result)
          .then(function(response) {
		return response.json();
	    })
          .then(responseJson => {
            this.state.user = responseJson;
          })
          .catch(err => console.log(err)),
      )
      .catch(err => console.log(err));
      return this.state.user
  }
  async saveUser(uservals) {
    this.state.user = uservals;
    Storage.put('config.json', JSON.stringify(uservals), {level: 'private'})
      .then(
        Alert.alert(
          'Settings',
          'Saved',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: true},
        ),
      )
      .catch(err => console.log(err));
  }
  tick = async () => {
    value = this.state.value;
    message = {
      PatientId: this.state.id,
      Timestamp: new Date(),
      Value: value,
      Type: 'sugar',
      Unit: 'sugar',
      GeoData: 'none',
    };
    await PubSub.publish('slider', message);
  };
  render() {
    return null
  }
  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }
}

export default new Helper();

