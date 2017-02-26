import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';

import DeviceStorage from 'react-native-simple-store';
import WithinsService from './services/WithingsService.js';

import LineChart from './src/components/LineChart.js';

const USER_PROFILE_TABLE_NAME = 'PROFILE';

export default class blazinglean extends Component {

    constructor(props) {
        super(props);

        this.onBridgeMessage = this.onBridgeMessage.bind(this);

        this.state = {
            error: undefined,
            auth_link: undefined,
        };

        this.getUserProfile().then((profile) => {
            if (profile) {
                this.state = {
                    profile: profile,
                };
                WithinsService.getWeightMeasurements(profile.oauth_access_token, profile.oauth_access_token_secret, profile.user_id);
            } else {
                this.getAuthorizeLink();
            }
            console.log('User profile: ' + JSON.stringify(profile));
        });
    }

    async getAuthorizeLink() {
        try {
            this.setState(await WithinsService.getAuthorizeLink());
        } catch (error) {
            console.log(error);
            this.setState({ error: error.message });
        }
    }

    handleCallback(profile) {
        DeviceStorage.update(USER_PROFILE_TABLE_NAME, profile).then(() => {
            console.log('User profile stored');
        });
    }

    async getUserProfile() {
        return DeviceStorage.get(USER_PROFILE_TABLE_NAME)
        .then(profile => profile || false);
    }

    async onBridgeMessage(message) {
        console.log('Received bridged message: ' + message.nativeEvent.data);
        const user = JSON.parse(message.nativeEvent.data);

        const oauth_verifier = user.verifier;
        const userID = user.user_id;

        console.log("User ID:" + userID);
        console.log("Verifier:" +oauth_verifier);

        try {
            const profile = await WithinsService.getAccessToken(this.state.token, this.state.token_secret, oauth_verifier);
            profile.user_id = userID;

            DeviceStorage.update(USER_PROFILE_TABLE_NAME, profile).then(() => {
                console.log('User profile stored');
            });

            this.setState(profile);
        } catch (error) {
            console.log(error);
            this.setState({
                error: error.message,
            });
        }
    }

    inject =
    `
    setTimeout(function(){
        if (window.location.href.includes('/callback') && typeof verifier !== 'undefined') {
            window.postMessage(JSON.stringify({ verifier: verifier, user_id: user_id }));
        }
    }, 0);
    `

    render() {
        return (
            <LineChart />
        );

        if (this.state.profile) {
            return (
                <View />
            );
        }

        if (!this.state.auth_link) {
            return (
                <View>
                    <Text>
                        {this.state.error || 'Getting the authorization link...'}
                    </Text>
                </View>
            );
        }

        return (

            <WebView
                javaScriptEnabled
                onMessage={this.onBridgeMessage}
                injectedJavaScript={this.inject}
                source={{ uri: this.state.auth_link }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('blazinglean', () => blazinglean);
