package com.modules.update;

import android.widget.Toast;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import net.tsz.afinal.FinalHttp;
import net.tsz.afinal.http.AjaxCallBack;

import org.json.JSONObject;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import android.app.Activity;
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
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;

import java.util.HashMap;
import java.util.Map;

/**
 * 获取APP的版本号
 * 
 */
public class UpdateModule extends ReactContextBaseJavaModule {

    //private static final String DURATION_SHORT="SHORT";
    //private static final String DURATION_LONG="LONG";

    public UpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "UpdateAndroid";
    }
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        //constants.put(DURATION_SHORT, Toast.LENGTH_SHORT);
        //constants.put(DURATION_LONG, Toast.LENGTH_LONG);
        return constants;
    }

    //检查更新
    @ReactMethod
    public void checkUpdate(String version,String url,String description){
        String sysVersion = getVersionName();
        if(!version.equals(sysVersion)){     //判断APP版本进行升级
          showUpdateDialog(url, description);
        }
    }


    //显示升级对话框
    /**
     * 显示升级对话框
     * 
     * @param serverDescription2
     * @param serverUrl
     */
    protected void showUpdateDialog(final String url,
            String description) {
        // TODO Auto-generated method stub
       
        AlertDialog.Builder builder = new Builder(getCurrentActivity());
        builder.setTitle("提示升级");
        builder.setMessage(description);
        builder.setPositiveButton("立即升级", new OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                // TODO Auto-generated method stub
                // 下载apk检查
                if (Environment.getExternalStorageState().equals(
                        Environment.MEDIA_MOUNTED)) {
                    // sd卡空间充足, 下载apk
                    //downFile(url);
                    aFinalDown(url);

                } else {
                    Toast.makeText(getCurrentActivity(), "sd卡空间不足！", 0).show();
                    return;
                }
            }
        });

        builder.setNegativeButton("下次再说", new OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                // TODO Auto-generated method stub
                dialog.dismiss();
            }
        });
        builder.show();
    }


    private ProgressDialog pBar;

    /**
     * 下载APK
     */
    private void aFinalDown(String apkUrl) {
        pBar = new ProgressDialog(getCurrentActivity()); // 进度条，在下载的时候实时更新进度，提高用户友好度
        pBar.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        pBar.setTitle("正在下载");
        pBar.setMessage("请稍候...");
        pBar.setProgress(0);
        pBar.show();
        // aFinal 第三方 android 框架
        FinalHttp finalHttp = new FinalHttp();
  
        finalHttp.download(
                apkUrl,
                Environment.getExternalStorageDirectory().getAbsolutePath()
                        + "/test"
                        + getVersionName()
                        + ".apk", new AjaxCallBack<File>() {

                    @Override
                    public void onFailure(Throwable t, int errorNo,
                            String strMsg) {
                        // TODO Auto-generated method stub
                        t.printStackTrace();
                        Toast.makeText(getCurrentActivity(), "下载失败", 1).show();
                        super.onFailure(t, errorNo, strMsg);
                    }

                    @Override
                    public void onLoading(long count, long current) {
                        // TODO Auto-generated method stub
                        super.onLoading(count, current);
                        // 当前下载进度百分比
                        int progress = (int) current;
                        pBar.setProgress(progress); // 这里就是关键的实时更新进度了！
                    }

                    @Override
                    public void onSuccess(final File t) {
                        // TODO Auto-generated method stub
                        super.onSuccess(t);

                    // 更新UI线程
                    getCurrentActivity().runOnUiThread(new Runnable() {

                        @Override
                        public void run() {
                            // TODO Auto-generated method stub
                            pBar.cancel();
                            installApk(t);
                           }
                       });

                    }

                });

    }

    /**
     * 安装APK
     * 
     * @param t
     */
    private void installApk(File t) {
        // TODO Auto-generated method stub
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        intent.addCategory("android.intent.category.DEFAULT");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // 安装完成后，显示 完成/打开的提示页
        intent.setDataAndType(Uri.fromFile(t),
                "application/vnd.android.package-archive");
        getCurrentActivity().startActivity(intent);
    }

    /**
     * [获取应用程序版本名称信息]
     * 该方法用于给JavaScript进行调用
     * @param context
     * @return 当前应用的版本名称
     */
    public String getVersionName() {
        try {
            PackageManager packageManager = getReactApplicationContext().getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    getReactApplicationContext().getPackageName(), 0);
            //Toast.makeText(getReactApplicationContext(), "版本号："+packageInfo.versionName, 0).show();
            return packageInfo.versionName;

        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
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