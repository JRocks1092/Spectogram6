import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Switch
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from 'firebase';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      light_theme: false,
      isEnabled: true,
      name: '',
      profile_image: ''
    }
  }

  componentDidMount() {
    this.fetchUser();
  }

  toggleSwitch() {
    const previosState = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark' : 'light';
    var updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/current_theme'] = theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previosState, light_theme: previosState });
  }

  fetchUser() {
    let theme, name, image;
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid).on("value", function (snapshot) {
      theme = snapshot.val().current_theme;
      name = `${snapshot.val().first_name} ${snapshot.val().last_name}`
      image = snapshot.val().profile_picture
    });
    this.setState({
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
      profile_image: image,
      name: name
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.state.name}</Text>
        <Image source = {{ uri:this.state.profile_image }} style = {styles.image}/>        
        <Switch
          trackColor={{true:'#555', false:"#333"}}
          thumbColor={this.state.isEnabled ? "#fff" : "#f4f3f4"}
          onValueChange={() => this.toggleSwitch()}
          value={this.state.isEnabled} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1
  },

  touchableOpacity: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderRadius: 50,
  },

  heading: {
    color: '#661111',
    alignSelf: 'center',
    fontSize: 40,
  },

  textInput: {
    borderWidth: 3,
    borderRadius: 20,
    width: 200,
    marginTop: 50,
    alignSelf: 'center',
    textAlign: 'center',
  },

  bg: {
    flex: 1,
    resizeMode: 'cover',
  },

  image: {
    width: 100,
    height: 100,    
    alignSelf:'center',
    marginTop:50,
    borderRadius:20,
    marginBottom:20
  },

  text: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },

  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
});
