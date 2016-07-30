import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
  BackAndroid,
  AsyncStorage,
  NativeModules
} from 'react-native';

import MainScreen from './MainScreen';

var _navigator ;
var REQUEST_URL = 'http://xxx/LoginHandler.ashx';
var CK_URL = 'http://xxx/jingpai_app_server/uservalidate.php?EipNo=20791';

export default class Login extends React.Component {
	
	constructor(props) {
		super(props);
    _navigator = this.props.navigator;
		this.state = {
			username: '',
			password: '',
		}
	}

    //用户登录
    async _login(){
     NativeModules.ProgressdialogAndroid.showProgressDialog("正在登录...");
     var username = this.state.username;
     var password = this.state.password;
     var params = "username="+username+"&password="+password;
     
    // _navigator.replace({
    //                   component: MainScreen,
    //                   params: { username: this.state.username}
    //                   });
    // return;

     fetch(REQUEST_URL+"?"+params)
             .then((response) => response.json())
             .then((responseData) => {               
               if(responseData.Flag==1){
                 //ToastAndroid.show('验证成功!', ToastAndroid.SHORT);
                   AsyncStorage.setItem('FLAG','TRUE');
                   AsyncStorage.setItem('username',responseData.FullName);
                   AsyncStorage.setItem('userCode',responseData.UserNumber);

                   //------验证仓库权限-------
                    fetch(CK_URL)
                        .then((response) => response.json())
                        .then((responseData) => {
                           NativeModules.ProgressdialogAndroid.hideProgressDialog();
                           if(responseData.code=='Y'){

                             //保存全局仓库
                             //AsyncStorage.setItem('ckList',responseData.list);

                               _navigator.replace({
                                  component: MainScreen,
                                  params: { 
                                    username: this.state.username,
                                    ckList:responseData.list
                                  }
                               });
                            }else{
                               ToastAndroid.show('验证失败!', ToastAndroid.SHORT);
                            }
                        }).done();
                  //------验证仓库权限-------
                
                }else{
                   NativeModules.ProgressdialogAndroid.hideProgressDialog();
                   ToastAndroid.show('验证失败!', ToastAndroid.SHORT);
                }
             })
            .done();

     // fetch('http://sso.jingpai.com/LoginHandler.ashx?'+params)
     //   .then((response) => response.text())
     //   .then((responseText) => {
     //     console.log(responseText);
     //         var obj = JSON.parse(responseText);
     //         //alert(obj.Flag);
     //         if(obj.Flag==1){
     //             //ToastAndroid.show('验证成功!', ToastAndroid.SHORT);
     //              await AsyncStorage.setItem('FLAG','TRUE');
     //              await AsyncStorage.setItem('username',username);

     //            _navigator.push({
			  //               component: MainScreen,
			  //               params: { username: this.state.username}
		   //                });
     //         }else{
     //         	 ToastAndroid.show('验证失败!', ToastAndroid.SHORT);
     //         }
     //    })
     //   .catch((error) => {
     //      console.warn(error);
     //    });

      
    }

	render() {
		return (
   <View style={ styles.container }>
       <View style={ styles.header }>
            <Text style={styles.headerText}>用户登录</Text>
       </View>
              
       <View style={styles.space}></View>

       <View style={styles.flexContainer}>
            <Text style={styles.cell}> 账号 </Text>
            <TextInput style={styles.cellInput} placeholder="请输入EIP账号"
            defaultValue = {this.state.username}
            onChangeText={username => this.setState({ username })} />
       </View>

       <View style={styles.flexContainer }>
            <Text style={styles.cell}> 密码 </Text>
            <TextInput secureTextEntry={true} style={styles.cellInput} placeholder="请输入EIP密码"
            defaultValue = {this.state.password}
            onChangeText={password => this.setState({ password })} />
       </View>

       <TouchableOpacity onPress={this._login.bind(this)} style={styles.button}>
			     <Text style={styles.text}>登录</Text>
	     </TouchableOpacity>
            
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
  space:{
     height:20,
     backgroundColor: '#EEE'
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
     fontSize:18
  },

  content:{
  	marginTop:20
  },

   header: {
    height: 50,
    backgroundColor: '#778899',
    paddingTop: 20,
    alignItems: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
   singleLine: {
    fontSize: 20,
    padding: 4,
  },
  text:{
     fontSize:20,
     color: '#fff'
  },
  button:{
  	alignItems:'center',
  	height:40,
  	margin:10,
  	backgroundColor:'#FF7F24'
  }

});
