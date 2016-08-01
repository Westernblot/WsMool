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

            <View style={styles.space}></View>

       	    <Text style={styles.content}>
             　　劲牌有限公司创建于1953年，历经六十余年的稳步发展，现已成为一家专业化的健康食品企业。
            </Text>

            <Text style={styles.content}>
             　　产品从单一的白酒发展成为以保健酒、白酒和生物医药为三大核心业务的健康产业结构。拥有面积350亩的保健酒工业园、930亩的原酒生态园和1100亩的健康产业园，年生产保健酒的综合能力达到18万吨。         
          2015年，劲牌销售额突破84.99亿元，上交税金逾23.34亿元人民币，直接用于公益慈善事业的投入达1.8亿余元。
            </Text>

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
   space:{
       height:10,
       backgroundColor:'#EEE',
    },
  content:{
  	fontSize:18,
  	margin:5,
  }

  });