import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
    BackAndroid,
    ListView
} from 'react-native';

import BackHeader from './BackHeader';
import Line from './Line';

export default class TestList extends Component{
   
   constructor(props) {
        super(props);    
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {       
            data: this._getListData(),	
            dataSource: ds.cloneWithRows(this._getListData()),
            ds:ds,
        };
    }

  //获取数据List
  _getListData(){
  	 var data = ['row 1', 'row 2','row 3', 'row 4','row 5', 'row 6','row 7', 'row 8','row 9', 'row 10','row 11'];
     return data;
  }

  //点击加载更多
  _loadMore(rowID){
  	    //var data = [...this.state.data,'row 12','row 13'];
  	    var data = ['row 1', 'row 2','row 3', 'row 4','row 5', 'row 6','row 7', 'row 8','row 9', 'row 10','row 11','row 12','row 13','row 14'];
        if(rowID==data.length-1){
           ToastAndroid.show('没有更多数据了!', ToastAndroid.SHORT);
           return;
  	    }
        this.setState({
        	   data:data,
               dataSource: this.state.ds.cloneWithRows(data),
               ds:this.state.ds
         });
   }

  //返回上一级菜单
  _back(){
     this.props.navigator.pop();
  }
  
  //单行点击
  _pressRow(rowData,sectionID,rowID){
  	alert(rowData+"-"+sectionID+"-"+rowID);
  }

  //返回一个Row
  _renderRow(rowData: string,sectionID: number, rowID: number){
  	return(
  	  <View>
  	       <TouchableOpacity onPress={this._pressRow.bind(this,rowData,sectionID,rowID)} style={styles.listItem}>
                <Text style={styles.text}>{rowData}</Text>
                <Line />
           </TouchableOpacity>
           {
           	rowID==this.state.data.length-1?
           	 <TouchableOpacity onPress={this._loadMore.bind(this,rowID)} style={styles.pressMore}>
			     <Text style={styles.pressMoreText}>点击加载更多</Text>
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
  	height:40,
  },
  pressMore:{
    height:70,
    backgroundColor:'#EEE',
    alignItems:'center',
  },
  pressMoreText:{
    fontSize:18,
    color:'#CFCFCF'
  }

});