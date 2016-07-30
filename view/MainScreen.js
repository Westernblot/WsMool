import React, { Component } from 'react';
import {
	StyleSheet,
	TextInput,
	Image,
	View,
	Text,
	ToastAndroid,
	TouchableOpacity,
	BackAndroid,
  AsyncStorage,
  DatePickerAndroid,
  Alert,
  Picker,
  NativeModules,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator'; 
import AboutJp from './AboutJp'; 
import Login from './Login'; 
import GraySpace from './GraySpace'; 
import LableTextInput from './LableTextInput';

import KcList from './KcList.js';
import FydList from './FydList.js';
import BydList from './BydList.js';

const HOME = '发运单';
const HOME_NORMAL = require('../images/tabs/home_normal.png');
const HOME_FOCUS = require('../images/tabs/home_focus.png');

const CATEGORY = '搬运单';
const CATEGORY_NORMAL = require('../images/tabs/category_normal.png');
const CATEGORY_FOCUS = require('../images/tabs/category_focus.png');

const FAXIAN = '库存';
const FAXIAN_NORMAL = require('../images/tabs/faxian_normal.png');
const FAXIAN_FOCUS = require('../images/tabs/faxian_focus.png');

const PERSONAL = '个人中心';
const PERSONAL_NORMAL = require('../images/tabs/personal_normal.png');
const PERSONAL_FOCUS = require('../images/tabs/personal_focus.png');

var _navigator ;
var _username;
var _userCode;
var _OrderNo = '';
var _ckList;
var _strs = '';  

export default class MainScreen extends React.Component {
	

   constructor(props) {
        super(props);
        _navigator = this.props.navigator;
        _ckList = this.props.ckList;
         this.state = {
          username : null,
          subject : '发运单',
          selectedTab: HOME,

          //库存查询参数
          DepotCode:'',//仓库编码
          StockOrg:'', //库存组织
          ProductCode:'',//产品编码
          ProductName:'',//产品名称

          //发运单查询参数
          ShipDepot:'',
          OrderNo: _OrderNo,

          //搬运单查询参数
            TargetDepot:'',
            TransportOrderNo:'',
            RequiredDate:'', //打开日期选择器
            MaterialsCode:'',
            MaterialsName:'',
        }
    }
    
    //加载完成时赋值全局变量
    async componentDidMount() {
          _username = await AsyncStorage.getItem('username');
          _userCode = await AsyncStorage.getItem('userCode');

          //alert(_ckList[0]['invCode']);
          for(var i=0;i<_ckList.length;i++){
                if(_strs==''){
                   _strs = _ckList[i]['invCode'];
                 }else{
                   _strs = _strs + ","+ _ckList[i]['invCode'];
                 }
            }
       }

    //退出登录
    async _logout(){
       await AsyncStorage.removeItem('FLAG');
       this.props.navigator.resetTo({
       	   title:'Login',
       	   component:Login      	   
       });
    }

    //toast提示
    _toast(msg){
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
    
    //关于劲牌
    _aboutJp(){
    	this.props.navigator.push({ 
    	     title:'AboutJp',          
			     component: AboutJp,
			     params: {
			  content:' 劲牌有限公司创建于1953年，历经六十余年的稳步发展，现已成为一家专业化的健康食品企业。产品从单一的白酒发展成为以保健酒、白酒和生物医药为三大核心业务的健康产业结构。拥有面积350亩的保健酒工业园、930亩的原酒生态园和1100亩的健康产业园，年生产保健酒的综合能力达到18万吨。2015年，劲牌销售额突破84.99亿元，上交税金逾23.34亿元人民币，直接用于公益慈善事业的投入达1.8亿余元。'
		      }
		     });
    }

    //查询库存
    _searchKC(){
       this.props.navigator.push({
       	    title:'KcList',
       	    component:KcList,
       	    params: {
			        DepotCode: this.state.DepotCode,//仓库编码
        	    StockOrg: this.state.StockOrg, //库存组织
        	    ProductCode: this.state.ProductCode,//产品编码
        	    ProductName: this.state.ProductName,//产品名称 
			        }
       });
    }

    //查询发运单
    _searchFyd(){
        var ShipDepot = this.state.ShipDepot;
        var OrderNo =  this.state.OrderNo;
        
        if(ShipDepot=='选择仓库'){
            ShipDepot = '';
        }
        // if(ShipDepot=='' && OrderNo==''){
        //     ToastAndroid.show('不能进行空查询!', ToastAndroid.SHORT);
        //     return;
        // }

        this.props.navigator.push({
            title:'FydList',
            component:FydList,
            params: {
              ShipDepot: ShipDepot, //仓库编码
              OrderNo: OrderNo,     //配送单号
            }
       });
    }

    //查询搬运单
    _searchByd(){
      this.props.navigator.push({
            title:'BydList',
            component:BydList,
            params: {
                TargetDepot : this.state.TargetDepot,
                TransportOrderNo : this.state.TransportOrderNo,
                RequiredDate : this.state.RequiredDate,
                MaterialsCode : this.state.MaterialsCode,
                MaterialsName : this.state.MaterialsName, 
              }
       });
    }

    //选择日期
    _onSelectDate(){
      var thiz = this;
        DatePickerAndroid.open({
            date: new Date(),
            minDate: new Date('1900/01/01'),
            maxDate: new Date('2100/12/12')
        }).done(function(params){
            var content = '';
            if(params.action !== DatePickerAndroid.dismissedAction){
                content = params.year + '-' + (params.month+1) + '-' + params.day;
                thiz.setState({
                        RequiredDate:content,      
                      });
            }else{
                 thiz.setState({
                        RequiredDate:'',      
                      });
            }
        })
    }

    //选择发运单仓库
    _onSelectShipDepot(){
          NativeModules.DialogAndroid.showSelectDialog(_strs,
              (value)=>{
                  this.setState({ 
                    ShipDepot:value
                 });
              }
          );
    }
   
    //选择搬运单仓库
    _onSelectTargetDepot(){
          NativeModules.DialogAndroid.showSelectDialog(_strs,
              (value)=>{
                  this.setState({ 
                    TargetDepot:value
                 });
              }
          );
    }

     //选择库存仓库
    _onSelectDepotCode(){
          NativeModules.DialogAndroid.showSelectDialog(_strs,
              (value)=>{
                  this.setState({ 
                    DepotCode:value
                 });
              }
          );
    }


    //扫描二维码条形码发运单
    _saoMaOrderNo(){
      
    NativeModules.ScanAndroid.startActivityFromJSGetResult("com.modules.scan.ScanCaptureAct",200,
      (value)=>{
         //ToastAndroid.show('value:'+value,ToastAndroid.SHORT);
                 this.setState({ 
                    OrderNo:value
                 });
      },
       (error)=>{
         //ToastAndroid.show('error:'+error,ToastAndroid.SHORT);
    });

    }

    //扫描二维码条形码搬运单
    _saoMaTransportOrderNo(){
      
    NativeModules.ScanAndroid.startActivityFromJSGetResult("com.modules.scan.ScanCaptureAct",200,
      (value)=>{
         //ToastAndroid.show('value:'+value,ToastAndroid.SHORT);
                 this.setState({ 
                    TransportOrderNo:value
                 });
      },
       (error)=>{
         //ToastAndroid.show('error:'+error,ToastAndroid.SHORT);
    });

    }

    //扫描二维码条形码库存
    _saoMaProductCode(){
      
    NativeModules.ScanAndroid.startActivityFromJSGetResult("com.modules.scan.ScanCaptureAct",200,
      (value)=>{
         //ToastAndroid.show('value:'+value,ToastAndroid.SHORT);
                 this.setState({ 
                    ProductCode:value
                 });
      },
       (error)=>{
         //ToastAndroid.show('error:'+error,ToastAndroid.SHORT);
    });

    }


    //----------------------------------华丽的分割线-----------------------------------------------


  _renderTabItem(img, selectedImg, tag, childView) {
        
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => <Image style={styles.tabIcon} source={img}/>}
                renderSelectedIcon={() => <Image style={styles.tabIcon} source={selectedImg}/>}
                onPress={() => this.setState({ 
                	subject : tag,
                	selectedTab: tag , 
                  username : _username,      
                  userCode : _userCode,            
                })}>
                {childView}
            </TabNavigator.Item>
        );
    }

    _createChildView(tag) {

    	if(tag=='发运单'){
           return (
            <View style={styles.ViewContainer}>
                   <GraySpace />
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 仓库编码 </Text>
          <TextInput style={styles.cellInput} placeholder="请输入仓库编码"
                          defaultValue = {this.state.ShipDepot}
                          onChangeText={ShipDepot => this.setState({ ShipDepot })} />

          <TouchableOpacity onPress={()=>this._onSelectShipDepot()} style={styles.date} >
                        <Text style={styles.dateText}>选择</Text>
          </TouchableOpacity>
                    </View>

                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 配送单号 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入配送单号"
                          defaultValue = {this.state.OrderNo}
                          onChangeText={OrderNo => this.setState({ OrderNo })} />
          <TouchableOpacity onPress={()=>this._saoMaOrderNo()} style={styles.date} >
                        <Text style={styles.dateText}>扫码</Text>
          </TouchableOpacity>
                    </View>
                   <GraySpace />
                   <TouchableOpacity onPress={this._searchFyd.bind(this)} style={styles.button}>
			               <Text style={styles.text}>查询发货单</Text>
	               </TouchableOpacity>

    			</View>
            );
    	}else if (tag=='搬运单') {
    		return (
               <View style={styles.ViewContainer}>
                   <GraySpace />
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 仓库编码 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入仓库编码"
                          defaultValue = {this.state.TargetDepot}
                          onChangeText={TargetDepot => this.setState({ TargetDepot })} />
          <TouchableOpacity onPress={()=>this._onSelectTargetDepot()} style={styles.date} >
                        <Text style={styles.dateText}>选择</Text>
          </TouchableOpacity>
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 搬运单号 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入搬运单号"
                          defaultValue = {this.state.TransportOrderNo}
                          onChangeText={TransportOrderNo => this.setState({ TransportOrderNo })} />
          <TouchableOpacity onPress={()=>this._saoMaTransportOrderNo()} style={styles.date} >
                        <Text style={styles.dateText}>扫码</Text>
          </TouchableOpacity>       
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 需求日期 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入需求日期"
                          defaultValue = {this.state.RequiredDate}
                          onChangeText={RequiredDate => this.setState({ RequiredDate })} />

                        <TouchableOpacity onPress={()=>this._onSelectDate()} style={styles.date} >
                        <Text style={styles.dateText}>选择</Text>
                        </TouchableOpacity>                     
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 物料编码 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入物料编码"
                          onChangeText={MaterialsCode => this.setState({ MaterialsCode })} />
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 物料名称 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入物料名称"
                          onChangeText={MaterialsName => this.setState({ MaterialsName })} />
                    </View>
                   <GraySpace />
                   <TouchableOpacity onPress={this._searchByd.bind(this)} style={styles.button}>
			               <Text style={styles.text}>查询搬运单</Text>
	                 </TouchableOpacity>

    			</View>
    		);
    	}else if(tag=='库存'){

    		return(
    			<View style={styles.ViewContainer}>
                   <GraySpace />
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 仓库编码 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入仓库编码"
                          defaultValue = {this.state.DepotCode}
                          onChangeText={DepotCode => this.setState({ DepotCode })} />
          <TouchableOpacity onPress={()=>this._onSelectDepotCode()} style={styles.date} >
                        <Text style={styles.dateText}>选择</Text>
          </TouchableOpacity>
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 库存组织 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入库存组织"
                          onChangeText={StockOrg => this.setState({ StockOrg })} />
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 产品编码 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入产品编码"
                          defaultValue = {this.state.ProductCode}
                          onChangeText={ProductCode => this.setState({ ProductCode })} />
          <TouchableOpacity onPress={()=>this._saoMaProductCode()} style={styles.date} >
                        <Text style={styles.dateText}>扫码</Text>
          </TouchableOpacity>
                    </View>
                    <View style={styles.flexContainer}>
                        <Text style={styles.cell}> 产品名称 </Text>
                        <TextInput style={styles.cellInput} placeholder="请输入产品名称"
                          onChangeText={ProductName => this.setState({ ProductName })} />
                    </View>
                    <GraySpace />
                   <TouchableOpacity onPress={this._searchKC.bind(this)} style={styles.button}>
			               <Text style={styles.text}>查询库存</Text>
	               </TouchableOpacity>

    			</View>
    		 );

    	}else if(tag=='个人中心'){
           return (
            <View style={styles.ViewContainer}>
                   <View style={styles.space}></View>
                   
                   <View style={styles.personInfo}>
                        
                     <View style={styles.personInfo_left}>
                       <Image source={require('../images/user.png')} />
                     </View>

                     <View style={styles.personInfo_right}>
                       <Text style={styles.personInfo_text1}>{this.state.username}</Text>
                       <Text style={styles.personInfo_text2}>{this.state.userCode}</Text>
                     </View>

                   </View>

                   <View style={styles.space}></View>
                   <TouchableOpacity onPress={this._aboutJp.bind(this)} style={styles.pressLine}>
			           <Text style={styles.pressText}>关于劲酒</Text>
	                </TouchableOpacity>
	                <View style={styles.viewLine}></View>

	                <TouchableOpacity onPress={this._toast.bind(this,'清除缓存成功!')} style={styles.pressLine}>
			           <Text style={styles.pressText}>清除缓存</Text>
	                </TouchableOpacity>
	                <View style={styles.viewLine}></View>

	                <TouchableOpacity onPress={this._toast.bind(this,'已是最新版本!')} style={styles.pressLine}>
			           <Text style={styles.pressText}>检查更新</Text>
	                </TouchableOpacity>
	                <View style={styles.viewLine}></View>
	                <View style={styles.space}></View>

                   <TouchableOpacity onPress={this._logout.bind(this)} style={styles.button}>
			           <Text style={styles.text}>退出登录</Text>
	                </TouchableOpacity>
            </View>
            );
    	}else{
    		return (
            <View style={{flex:1,backgroundColor:'#EEE',alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:22}}>{tag}</Text>
            </View>
            );
    	}

        
    }

	 render() {  
        return (  
            <View style={styles.container}>  
                <View style={ styles.header }>
                     <Text style={styles.headerText}>{this.state.subject}</Text>
                </View> 
            <TabNavigator hidesTabTouch={true} tabBarStyle={styles.tab}>
                    {this._renderTabItem(HOME_NORMAL, HOME_FOCUS, HOME, this._createChildView(HOME))}
                    {this._renderTabItem(CATEGORY_NORMAL, CATEGORY_FOCUS, CATEGORY, this._createChildView(CATEGORY))}
                    {this._renderTabItem(FAXIAN_NORMAL, FAXIAN_FOCUS, FAXIAN, this._createChildView(FAXIAN))}
                   
                    {this._renderTabItem(PERSONAL_NORMAL, PERSONAL_FOCUS, PERSONAL, this._createChildView(PERSONAL))}
             </TabNavigator>
            </View>  
        );  
    }  
}


const styles = StyleSheet.create({  
	container: {
  	     flex:1,
         flexDirection: 'column',
         backgroundColor: '#EEE'
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
    tab: {  
        height: 52,  
        backgroundColor: '#FFFFFF',  
        alignItems: 'center'  
    },
    tabIcon: {
        width: 30,
        height: 35,
        resizeMode: 'stretch',
        marginTop: 10
    },
     
    ViewContainer:{
      	flex:1,
        flexDirection: 'column',
        backgroundColor: '#EEE'
    },
    button:{
  	    alignItems:'center',
  	    height:40,
  	    margin:10,
  	    marginTop:10,
  	    backgroundColor:'#FF7F24'
    },
    text:{
     fontSize:20,
     color: '#fff'
    },
    pressLine:{
  	    height:50,
  	    backgroundColor:'#FFFFFF'
    },
     pressText:{
     	margin:10,
     	padding:8,
        fontSize:20,
    },
    space:{
       height:20,
       backgroundColor:'#EEE',
    },
    viewLine:{
    	backgroundColor:'#EEE',
    	height:1,

    },
    personInfo:{
    	height:80,
    	backgroundColor:'#FFF',
    	flexDirection:'row',
    },
    personInfo_left:{
    	margin:10,
       flex:1,
    },
    personInfo_right:{
    	margin:10,
       flex:2.5,
    },
    personInfo_text1:{
       fontSize:17,
      fontWeight: 'bold'
    },
    personInfo_text2:{
      marginTop:10,
      fontSize:14,
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
     flex:3,
     fontSize:18,
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
  },
  date:{
     height:40,
     alignSelf : 'flex-end',
     margin:10,
     paddingTop:5,
     alignItems:'center',
     flex:1,
     backgroundColor:'#D1D1D1'
  },
  dateText:{
    fontSize:18,
  }


}); 
