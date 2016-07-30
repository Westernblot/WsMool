import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';


export default class LableTextInput extends Component{

    render(){
       return(
          <View style={styles.flexContainer}>
            <Text style={styles.cell}> 仓库编码 </Text>
            <TextInput style={styles.cellInput} placeholder="请输入仓库编码"
              onChangeText={username => this.setState({ username })} />
          </View>
        );
    }

}


const styles = StyleSheet.create({  

  space:{
       height:20,
       backgroundColor:'#EEE',
    },
  flexContainer:{
    flexDirection:'row'
  },
  cell:{
     margin :4,
     alignSelf : 'flex-end',
     height:40,
     fontSize:20
  },

  cellInput:{
    alignSelf : 'flex-end',
     flex:1,
     fontSize:20
  },
   
});