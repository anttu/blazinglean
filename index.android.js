import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';

import axios from 'axios';
import DeviceStorage from 'react-native-simple-store';

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
                /* Get data */
                this.state = {
                    profile: profile,
                };
                console.log(JSON.stringify(profile));
            } else {
                /* Get oauth token */
                axios.get('http://localhost:3000/authorizelink')
                .then((response) => {
                    this.setState({
                        auth_link: response.data.url,
                        token: response.data.token,
                        token_secret: response.data.token_secret,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        error: error.message,
                    });
                });
            }
            console.log('User profile: ' + JSON.stringify(profile));
        });
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

    onBridgeMessage(message) {
        console.log('Received bridged message: ' + message.nativeEvent.data);
        const user = JSON.parse(message.nativeEvent.data);

        const oauth_verifier = user.verifier;
        const user_id = user.user_id;

        console.log("User ID:" + user_id);
        console.log("Verifier:" +oauth_verifier);

        axios.get('http://localhost:3000/accesstoken', {
            params: {
                token: this.state.token,
                tokensecret: this.state.token_secret,
                oauthverifier: oauth_verifier,
            },
        })
        .then((response) => {
            const profile = {
                user_id: user_id,
                oauth_access_token: response.data.oauth_access_token,
                oauth_access_token_secret: response.data.oauth_access_token_secret,
            };

            DeviceStorage.update(USER_PROFILE_TABLE_NAME, profile).then(() => {
                console.log('User profile stored');
            });

            this.setState(profile);
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: error.message,
            });
        });
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
