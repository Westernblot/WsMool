import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	AsyncStorage,
	Platform,
	BackAndroid,
	NativeModules,
  ToastAndroid,
  Alert,
  Linking
} from 'react-native';

import Login from './Login';
import MainScreen from './MainScreen';

var _navigator;
var REQUEST_URL = "http://crm.mall.jingpai.com/jingpai_app_server/version.php";

export default class Splash extends React.Component {
  
  constructor(props) {
		super(props);
        _navigator = this.props.navigator;
      this.state = {
       version: null,
      }
	}

    //处理物理后退键
    componentWillMount() {
    	 BackAndroid.addEventListener('hardwareBackPress', function() {  

           //普通页面返回
           if (_navigator && _navigator.getCurrentRoutes().length > 1) {
               _navigator.pop();
               return true;
           }

            //root页面返回,双击2次退出
           if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
               //最近2秒内按过back键，可以退出应用。
                return false;
           }else{
               this.lastBackPressed = Date.now();
               ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
               return true;
           }
         
           return false;
        });
    }

 async componentDidMount() {
  	//var value = await AsyncStorage.getItem('FLAG');
    
    //获取系统版本号
    NativeModules.VersionAndroid.getVersionName(
      (version)=>{
       //ToastAndroid.show('接收数据为：'+msg,ToastAndroid.SHORT);
          this.setState({
            version:version,
         });
      },
       (error)=>{
         //ToastAndroid.show('error:'+error,ToastAndroid.SHORT);
    });
    
    //return;

    //判断是否升级app
    fetch(REQUEST_URL)
             .then((response) => response.json())
             .then((responseData) => {
              var version = responseData.version;
              var url = responseData.serverUrl;
              var description = "有新版本发布了，请及时升级!";
              
              //ToastAndroid.show(url,ToastAndroid.SHORT);       
              NativeModules.UpdateAndroid.checkUpdate(version,url,description);
                
             })
            .done();
    
     
    //2秒后页面跳转
    this.timer = setTimeout(
      () => {
         this.props.navigator.replace({
			      title: 'Login',
			      component: Login
		     })
      },
      2000
    );
  }
   
   // //自定义toast
   // _meToast(){
   //   NativeModules.ToastCustomAndroid.show("我是ToastCustomAndroid弹出消息",NativeModules.ToastCustomAndroid.SHORT);
   // }


   // //Alert实例
   // _alertMsg(){
   //        Alert.alert('温馨提醒','确定退出吗?',[

   //          {text:'取消',onPress:()=>ToastAndroid.show('你点击了取消~',ToastAndroid.SHORT)},

   //          {text:'确定',onPress:()=>ToastAndroid.show('你点击了确定~',ToastAndroid.SHORT)}

   //          ]);
   // }

   //打开外部链接下载
   // _openLink(){
   //      Linking.canOpenURL(_url).then(supported => {
   //         if (supported) {
   //             Linking.openURL(_url);
   //         } else {
   //            console.log('无法打开该URI: ' + _url);
   //         }
   //      })
   // }

   //验证升级
   _chUpdate(){
    NativeModules.UpdateAndroid.checkUpdate('3.1','http://ddyc.applinzi.com/1.apk','发现新版本，请升级！');
   }
   
   //去登录页面
	_toLoginPage() {
		this.props.navigator.replace({
			title: 'Login',
			component: Login
		})
	}

  //打开二维码扫描
  _saoma(){
    //NativeModules.ScanAndroid.startActivityFromJS("com.modules.scan.ScanCaptureAct","我是从JS传过来的参数信息.456");
    

     NativeModules.ScanAndroid.startActivityFromJSGetResult("com.modules.scan.ScanCaptureAct",200,
      (msg)=>{
         //alert(msg);
         ToastAndroid.show('msg:'+msg,ToastAndroid.SHORT);
      },
       (error)=>{
         //ToastAndroid.show('error:'+error,ToastAndroid.SHORT);
    });


  }

	render() {
		return (
			<View style={styles.container}>
			    <Image
                  source={require('../images/icon.png')}
			    />
				<TouchableOpacity onPress={this._toLoginPage.bind(this)} style={styles.padd}>
					<Text style={styles.text}>劲牌移动仓储</Text>
				</TouchableOpacity>
         <Text>版本号：{this.state.version}</Text>
			</View>
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
  padd:{
    paddingTop:20,
  },
text:{
	  justifyContent: 'center',
    alignItems: 'center',
	  fontSize:26,
},
 versionText:{
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:18,
 }

});

