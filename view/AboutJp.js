import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';


export default class AboutJp extends Component{
  

  _back(){
  	this.props.navigator.pop();
  }

    render(){      
       return(
         
       	  <View style={styles.container}>
            <View style={ styles.header }>
                  
                  <TouchableOpacity onPress={this._back.bind(this)}>
			         <Text style={styles.header_left}>＜</Text>
	              </TouchableOpacity>

                  <Text style={styles.headerText}>关于劲牌</Text>
                <Text> </Text>
            </View>
       	    <Text style={styles.content}>{this.props.content}</Text>

       	  </View>

       	);
    }



}

var styles = StyleSheet.create({
  container: {
  	flex:1,
    flexDirection: 'column',
    backgroundColor: '#EEE'
  },
  header: {
  	flexDirection:'row',
    height: 50,
    backgroundColor: '#778899',
    paddingTop: 20,
    alignItems: 'center',
    justifyContent:'space-between'
  },
  header_left:{
  	 color: '#fff',
     fontSize: 20,
     fontWeight: 'bold'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  content:{
  	fontSize:18,
  	margin:10,
  }

  });