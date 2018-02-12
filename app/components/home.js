/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 2/3/2017
 * Project: React Native Redux Boilerplate
 */

'use strict';

import React, { Component } from 'react';
var {
    StyleSheet,
    ListView,
    View,
    Text,
    ActivityIndicator,
    Alert,
    AppRegistry,
    Button,
    Platform
} = require('react-native');
import Auth0 from 'react-native-auth0';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions'; //Import your actions

var credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);

class Home extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds: ds,
            accessToken: null
        };
    }

    componentDidMount() {
        this.props.getData(); //call our action
    }

    _onLogin = () => {
      auth0.webAuth
        .authorize({
          scope: 'openid profile',
          audience: 'https://' + credentials.domain + '/userinfo'
        })
        .then(credentials => {
          Alert.alert(
            'Success',
            'AccessToken: ' + credentials.accessToken,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
          );
          this.setState({ accessToken: credentials.accessToken });
        })
        .catch(error => console.log(error));
    };

    _onLogout = () => {
      if (Platform.OS === 'android') {
        this.setState({ accessToken: null });
      } else {
        auth0.webAuth
          .clearSession({})
          .then(success => {
            this.setState({ accessToken: null });
          })
          .catch(error => console.log(error));
      }
    };

    render() {
        let loggedIn = this.state.accessToken === null ? false : true;
        return (
          <View style={styles.container}>
            <Text style={styles.header}>Auth0Sample - Login</Text>
            <Text>
              You are {loggedIn ? '' : 'not '}logged in.
            </Text>
            <Button
              onPress={loggedIn ? this._onLogout : this._onLogin}
              title={loggedIn ? 'Log Out' : 'Log In'}
            />
          </View>
        );
    }
};



// The function takes data from the app current state,
// and insert/links it into the props of our component.
// This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
    return {
        loading: state.dataReducer.loading,
        data: state.dataReducer.data
    }
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);

var styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },

    header: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10
    }
});
