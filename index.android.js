import React, { Component } from 'react';
// import { WebView } from 'react-native';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';

import axios from 'axios';

export default class blazinglean extends Component {

    constructor(props) {
        super(props);

        /* TODO: check if we have auth token */

        this.state = {
            error: undefined,
            auth_link: undefined,
        };

        // Make a request for a user with a given ID
        axios.get('http://localhost:3000/authorizelink')
        .then((response) => {
            this.setState({
                auth_link: response.data.url,
            });
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: error.message,
            });
        });
    }

    render() {
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
                source={{ uri: this.state.auth_link }}
                style={{ marginTop: 20 }}
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
