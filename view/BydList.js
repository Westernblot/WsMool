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
  NativeModules,
  AsyncStorage,
  Alert
} from 'react-native';

import BackHeader from './BackHeader';
import Line from './Line';

var REQUEST_URL = 'http://crm.mall.jingpai.com/jingpai_app_server/moveorderquery.php';
var DO_URL = 'http://crm.mall.jingpai.com/jingpai_app_server/comfirmmoveorder.php';

var _TargetDepot ;
var _TransportOrderNo ;
var _RequiredDate ;
var _MaterialsCode ;
var _MaterialsName;

var _PageNo = 1;
var _params;
var _loadMsg= '点击加载更多';
var _data = [];

export default class BydList extends Component{
   
   constructor(props) {
        super(props);    
        var _TargetDepot = this.props.TargetDepot;
        var _TransportOrderNo = this.props.TransportOrderNo;
        var _RequiredDate = this.props.RequiredDate;
        var _MaterialsCode = this.props.MaterialsCode;
        var _MaterialsName = this.props.MaterialsName;

        _PageNo = 1;
        _params = "TargetDepot="+_TargetDepot+"&TransportOrderNo="+_TransportOrderNo+"&RequiredDate="+_RequiredDate+"&MaterialsCode="+_MaterialsCode+"&MaterialsName="+_MaterialsName;
        
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
         this.state = {
             dataSource: ds,
             ds:ds,
             loaded: false,
             PageNo:null,
             loadMsg:_loadMsg,          
         };
    }

 //首次加载数据
  componentDidMount(){
      
      //延迟500毫秒加载，解决卡顿的问题
     this.timer = setTimeout(
      () => {
      var params = _params + "&PageNo=1";
      //ToastAndroid.show(params, ToastAndroid.SHORT);
      fetch(REQUEST_URL+"?"+params)
             .then((response) => response.json())
             .then((responseData) => {
                 // ?OrderNo=1100000078&PageNo=1
                 if(responseData.code=='Y'){
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
        },
      500
    );
   }

  //返回上一级菜单
  _back(){
     this.props.navigator.pop();
  }

  //加载更多数据
  async _loadMore(rowID){
        
       NativeModules.ProgressdialogAndroid.showProgressDialog("正在加载中...");
       var PageNo = this.state.PageNo+1;
       var params = _params +"&PageNo="+PageNo;
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
                        loadMsg:_loadMsg,           
                     });
               }else{
                      this.setState({
                        loaded:true,
                        loadMsg:_loadMsg,      
                      });
                      ToastAndroid.show('没有查询到相关数据!', ToastAndroid.SHORT);
               }
             
             })
            .done();
   }
  
  //单行点击
  // _pressRow(rowData,sectionID,rowID){
  // 	alert(rowData+"-"+sectionID+"-"+rowID);
  // }

  //操作搬运单
  async _doBy(TransportOrderNo,Lineid,quantity,rowID){

 var Operator = await AsyncStorage.getItem('userCode');
 var params = "TransportOrderNo="+TransportOrderNo+"&Lineid="+Lineid+"&Operator="+Operator;

           Alert.alert('操作搬运单','确认操作搬运单：【'+TransportOrderNo+"】吗？",[

            {text:'取消'},

            {text:'确定',onPress:()=>
{
             NativeModules.ProgressdialogAndroid.showProgressDialog("正在执行中...");
             fetch(DO_URL+"?"+params)
             .then((response) => response.json())
             .then((responseData) => {
              NativeModules.ProgressdialogAndroid.hideProgressDialog();
               var message = responseData.message;
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
                   ToastAndroid.show("操作失败,"+message, ToastAndroid.SHORT);
                }
             })
            .done();    
     
}
              }

            ]);


 //        var Operator = await AsyncStorage.getItem('userCode');
 //         //弹出自定义对话框
 //        NativeModules.DialogAndroid.showAlertDialog(quantity,
 //            (nums)=>{
 //            //alert(nums);
 // var params = "TransportOrderNo="+TransportOrderNo+"&Lineid="+Lineid+"&Operator="+Operator+"&ConfirmAmount="+nums;
           
 //             NativeModules.ProgressdialogAndroid.showProgressDialog("正在执行中...");
 //             fetch(DO_URL+"?"+params)
 //             .then((response) => response.json())
 //             .then((responseData) => {
 //              NativeModules.ProgressdialogAndroid.hideProgressDialog();
 //               var message = responseData.message;
 //               if(responseData.code=='1'){
 //                   ToastAndroid.show('操作成功!', ToastAndroid.SHORT);
 //                //刷新数据
 //                if(this.state.data.length==1){
 //                       var data = [];                 
 //                }else{
 //    var data =  this.state.data.slice(0,rowID).concat(this.state.data.slice(rowID+1,this.state.data.length));
 //                }
 //                    this.setState({
 //                        data:data,
 //                        dataSource: this.state.ds.cloneWithRows(data),
 //                        loaded: true, 
 //                        //PageNo: PageNo,     
 //                        ds:this.state.ds,     
 //                        loadMsg:'点击加载更多',           
 //                     });

 //                }else{
 //                   ToastAndroid.show("操作失败,"+message, ToastAndroid.SHORT);
 //                }
 //             })
 //            .done();

 //        });

   }

  //返回一个Row
  _renderRow(rowData,sectionID,rowID){
    return(
      <View>
           <TouchableOpacity onPress={this._doBy.bind(this,rowData.reqnumber,rowData.lineid,rowData.quantity,rowID)} style={styles.listItem}>
                <Text style={styles.itemText}>搬运单号：{rowData.reqnumber}</Text>               
                <Text style={styles.itemText}>物料编码：{rowData.materialscode}</Text>
                <Text style={styles.itemText}>物料名称：{rowData.materialsname}</Text>
                <Text style={styles.itemText}>来源仓库编码：{rowData.fromsubcode}</Text>
                <Text style={styles.itemText}>目标仓库编码：{rowData.tosubcode}</Text>
                <Text style={styles.itemText}>单据量：{rowData.quantity}</Text>
                <Text style={styles.itemText}>未处理量：{rowData.quantityentered}</Text>
                <Text style={styles.itemText}>行号：{rowData.lineid}</Text>
                               
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
                  <Text style={styles.headerText}>查询搬运单</Text>
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