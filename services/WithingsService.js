'use strict';

import axios from 'axios';

class WithinsService {

    getWeightMeasurements(token, secret, id) {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:3000/measurement', {
                params: {
                    oauthtoken: token,
                    oauthsecret: secret,
                    userid: id,
                    mtype: 'weight',
                },
            })
            .then(response => (
                resolve(response.data)
            ))
            .catch(error => (
                reject(error)
            ));
        });
    }

    /**
    Returns a link and the corresponding oath tokens
    from which the user can authorize our backend to retrieve measurements from Withings
    */
    getAuthorizeLink() {
        /* Get oauth token */
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:3000/authorizelink')
            .then(response => (
                resolve({
                    auth_link: response.data.url,
                    token: response.data.token,
                    token_secret: response.data.token_secret,
                })
            ))
            .catch(error => (
                reject(error)
            ));
        });
    }

    /**
    Get OAUTH access token needed for getting measurements from Withings
    */
    getAccessToken(token, tokenSecret, oauthVerifier) {
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:3000/accesstoken', {
                params: {
                    token: token,
                    tokensecret: tokenSecret,
                    oauthverifier: oauthVerifier,
                },
            })
            .then((response) => {
                resolve({
                    // user_id: user_id,
                    oauth_access_token: response.data.oauth_access_token,
                    oauth_access_token_secret: response.data.oauth_access_token_secret,
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}

module.exports = new WithinsService();
