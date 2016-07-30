import React, { Component } from 'react';
import {
	StyleSheet,
	TextInput,
	Image,
	View,
	Text,
	ToastAndroid,
	TouchableOpacity,
	BackAndroid
} from 'react-native';


export default class Line extends Component{

   render(){

   	   return(
          <View style={styles.viewLine}></View>
   	   );
   }

}

var styles = StyleSheet.create({

     viewLine:{
    	backgroundColor:'#EEE',
    	height:1,

    },

});