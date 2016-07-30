import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid
} from 'react-native';


export default class BackHeader extends Component{
  

   constructor(props) {
        super(props);
    }

  //返回上一级菜单
  _back(){
     this.props.navigator.pop();
  }
  
   render(){
   	return(
           <View style={ styles.header }>            
                  <TouchableOpacity onPress={this._back.bind(this)}>
			         <Text style={styles.header_left}>＜</Text>
	              </TouchableOpacity>
                  <Text style={styles.headerText}>{this.props.subject}</Text>
                <Text> </Text>
            </View>
   	);
   }


}


var styles = StyleSheet.create({
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
});