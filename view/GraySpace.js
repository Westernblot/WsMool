import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';


export default class GraySpace extends Component{

    render(){
       return(
       	<View style={styles.space}></View>
        );
    }

}


const styles = StyleSheet.create({  

    space:{
       height:20,
       backgroundColor:'#EEE',
    },
   
});