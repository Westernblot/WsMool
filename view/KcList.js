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
} from 'react-native';

import BackHeader from './BackHeader';
import Line from './Line';

var REQUEST_URL = 'http://crm.mall.jingpai.com/jingpai_app_server/onhandquery.php';

var _DepotCode ;
var _StockOrg ;
var _ProductCode ;
var _ProductName ;
var _PageNo = 1;
var _params;
var _loadMsg= '点击加载更多';

export default class KcList extends Component{
   
   constructor(props) {
        super(props);    
        _DepotCode =  this.props.DepotCode;
        _StockOrg =  this.props.StockOrg;
        _ProductCode =  this.props.ProductCode;
        _ProductName =  this.props.ProductName;
        _PageNo = 1;
        _params = "DepotCode="+_DepotCode+"&StockOrg="+_StockOrg+"&ProductCode="+_ProductCode+"&ProductName="+_ProductName;
        
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
                     this.setState({
                         data:responseData.list,
                         dataSource: this.state.ds.cloneWithRows(responseData.list),
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

  //返回一个Row
  _renderRow(rowData,sectionID,rowID){
    return(
      <View>
           <TouchableOpacity  style={styles.listItem}>
                <Text style={styles.itemText}>产品编码：{rowData.materialscode}</Text>               
                <Text style={styles.itemText}>产品名称：{rowData.materialsname}</Text>
                <Text style={styles.itemText}>批次：{rowData.lotnumber}</Text>
                <Text style={styles.itemText}>实时库存量：{rowData.onhandquantity}</Text>
                               
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
                  <Text style={styles.headerText}>查询库存</Text>
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