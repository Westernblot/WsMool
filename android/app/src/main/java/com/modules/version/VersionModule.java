package com.modules.version;

import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.app.AlertDialog.Builder;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.DialogInterface.OnClickListener;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;

import java.util.HashMap;
import java.util.Map;

/**
 * 获取APP 的版本号
 */
public class VersionModule extends ReactContextBaseJavaModule {


    public VersionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "VersionAndroid";
    }
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    /**
	 * 该方法用于给JavaScript进行调用
     * [获取应用程序版本名称信息]
     * 
     * @param context
     * @return 当前应用的版本名称
     */
	 @ReactMethod
    public void getVersionName(Callback successBack, Callback errorBack) {
      
         try {
            PackageManager packageManager = getReactApplicationContext().getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    getReactApplicationContext().getPackageName(), 0);
            //Toast.makeText(getReactApplicationContext(), "版本号："+packageInfo.versionName, 0).show();
            String result = packageInfo.versionName;
            successBack.invoke(result);

        } catch (Exception e) {
            //e.printStackTrace();
            errorBack.invoke(e.getMessage());
        }

    }

    /**
     * 这边只是演示相关回调方法的使用,所以这边的使用方法是非常简单的
     * @param errorCallback       数据错误回调函数
     * @param successCallback     数据成功回调函数
     */
    @ReactMethod
    public void measureLayout(Callback errorCallback,
                              Callback successCallback){
        try {
            successCallback.invoke(100, 100, 200, 200);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}