import React, { Component } from 'react';
import {
	  StyleSheet,
	  View,
	  Text,
	  TextInput,
	  TouchableOpacity,
	  ToastAndroid,
    BackAndroid,
    ListView,
    ProgressBarAndroid,
    ActivityIndicator,
    Alert,
    NativeModules,
    AsyncStorage,
} from 'react-native';

import BackHeader from './BackHeader';
import Line from './Line';

var REQUEST_URL = 'http://xxx/jingpai_app_server/saleorderquery.php';
var DO_URL = 'http://xxx/jingpai_app_server/comfirmsaleorder.php';

var _ShipDepot;
var _OrderNo ;
var _loadMsg= '点击加载更多';
var _data = [];

export default class FydList extends Component{

     constructor(props) {
        super(props);    
        _ShipDepot = this.props.ShipDepot;
        _OrderNo =  this.props.OrderNo;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.state = {
         	   dataSource: ds,
         	   ds:ds,
             loaded: false,
             PageNo:null,
             loadMsg:_loadMsg,          
         };
    }

  //返回上一级菜单
  _back(){
     this.props.navigator.pop();
  }
  
  //首次加载数据
  componentDidMount(){
      
      var params = "ShipDepot="+_ShipDepot+"&OrderNo="+_OrderNo+"&PageNo=1";
      //ToastAndroid.show(params, ToastAndroid.SHORT);
      fetch(REQUEST_URL+"?"+params)
             .then((response) => response.text())
             .then((responseText) => {
                 // ?OrderNo=1100000078&PageNo=1
                 //alert(responseText);
                 var responseData = JSON.parse(responseText);
                 if(responseData.code=='Y'){
                     //ToastAndroid.show(responseData.list, ToastAndroid.SHORT);
                     var data = _data.concat(responseData.list);
                     this.setState({
                         data:data,
                         dataSource: this.state.ds.cloneWithRows(data),
                         loaded: true, 
                         PageNo: 1,
                         ds:this.state.ds,    
                         loadMsg:_loadMsg,             
                      });
                 }else{
                       this.setState({
                        loadMsg:_loadMsg,   
                        loaded:true,
                      });
                     ToastAndroid.show('没有查询到相关数据!', ToastAndroid.SHORT);
                 }               
             })
            .done();
   }
   
   
   //加载更多数据
  async _loadMore(rowID){
        
       NativeModules.ProgressdialogAndroid.showProgressDialog("正在加载中...");
   	   var PageNo = this.state.PageNo+1;
       var params = "ShipDepot="+_ShipDepot+"&OrderNo="+_OrderNo+"&PageNo="+PageNo;
       //ToastAndroid.show(params, ToastAndroid.SHORT);
        fetch(REQUEST_URL+"?"+params)
             .then((response) => response.json())
             .then((responseData) => {
               NativeModules.ProgressdialogAndroid.hideProgressDialog();
               if(responseData.code=='Y'){
                    var data = this.state.data.concat(responseData.list);
                    this.setState({
                        data:data,
                        dataSource: this.state.ds.cloneWithRows(data),
                        loaded: true, 
                        PageNo: PageNo,     
                        ds:this.state.ds,     
                        loadMsg:'点击加载更多',           
                     });
               }else{
                      this.setState({
                        loaded:true,
                        loadMsg:'点击加载更多',      
                      });
                      ToastAndroid.show('没有查询到相关数据!', ToastAndroid.SHORT);
               }
             
             })
            .done();

   }


   //操作发运单
  async _doFy(orderno,amount,rowID){

        var Operator = await AsyncStorage.getItem('userCode');
         //弹出自定义对话框
        NativeModules.DialogAndroid.showAlertDialog(amount,
            (nums)=>{
            //alert(nums);
            var params = "OrderNo="+orderno+"&Operator="+Operator+"&ConfirmAmount="+nums;

             NativeModules.ProgressdialogAndroid.showProgressDialog("正在执行中...");
             fetch(DO_URL+"?"+params)
             .then((response) => response.json())
             .then((responseData) => {
              NativeModules.ProgressdialogAndroid.hideProgressDialog();
               
               if(responseData.code=='1'){
                   ToastAndroid.show('操作成功!', ToastAndroid.SHORT);
                //刷新数据
                if(this.state.data.length==1){
                       var data = [];                 
                }else{
    var data =  this.state.data.slice(0,rowID).concat(this.state.data.slice(rowID+1,this.state.data.length));
                }
                    this.setState({
                        data:data,
                        dataSource: this.state.ds.cloneWithRows(data),
                        loaded: true, 
                        //PageNo: PageNo,     
                        ds:this.state.ds,     
                        loadMsg:'点击加载更多',           
                     });

                }else{
                   ToastAndroid.show('操作失败!', ToastAndroid.SHORT);
                }
             })
            .done();

        });

   }
  

  //返回一个Row
  _renderRow(rowData,sectionID,rowID){
  	return(
  	  <View>
  	       <TouchableOpacity onPress={this._doFy.bind(this,rowData.orderno,rowData.amount,rowID)} style={styles.listItem}>
                <Text style={styles.itemText}>挑库单号：{rowData.assignformno}</Text>
                <Text style={styles.itemText}>发货状态：{rowData.ifsent==0?'未发货':'已发货'}</Text>
                <Text style={styles.itemText}>配送单号：{rowData.orderno}</Text>
                <Text style={styles.itemText}>客户名称：{rowData.cusname}</Text>
                <Text style={styles.itemText}>产品名称：{rowData.cinvname}</Text>
                <Text style={styles.itemText}>挑库日期：{rowData.ddate}</Text>
                <Text style={styles.itemText}>挑库数量：{rowData.amount}</Text>
                <Text style={styles.itemText}>发运说明：{rowData.remark}</Text>
                <Text style={styles.itemText}>目的地：{rowData.eplacename}</Text>
                <Text style={styles.itemText}>物流商：{rowData.nickname}</Text>
                <Text style={styles.itemText}>车牌号：{rowData.carno}</Text>
                
                <Line />
           </TouchableOpacity>
           {
           	rowID==this.state.data.length-1?
           	 <TouchableOpacity onPress={(rowID)=>{this._loadMore(rowID)}} style={styles.pressMore}>
			           <Text style={styles.pressMoreText}>{this.state.loadMsg}</Text>
	           </TouchableOpacity>
	         :null
           }
      </View>
  	);
  }

   render(){

       return (
         
      	<View style={styles.container}>
            <View style={ styles.header }>            
                  <TouchableOpacity onPress={this._back.bind(this)}>
			         <Text style={styles.header_left}>＜</Text>
	              </TouchableOpacity>
                  <Text style={styles.headerText}>查询发运单</Text>
                <Text> </Text>
            </View>
            {
              !this.state.loaded?
               <View style={styles.white}>
   	            <ActivityIndicator  size="large" />
   	           </View>
   	         :null
            }
   
      	 <ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderRow.bind(this)}
              style={styles.listView}
          />

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
  white:{
    backgroundColor:'#FFFFFF'
  },
  text:{
	fontSize:20
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
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  listItem:{
  	margin:10,
  
  },
  pressMore:{
    height:70,
    backgroundColor:'#EEE',
    alignItems:'center',
  },
  pressMoreText:{
    fontSize:18,
    color:'#CFCFCF'
  },
  itemText:{
    fontSize:14,
  }

});