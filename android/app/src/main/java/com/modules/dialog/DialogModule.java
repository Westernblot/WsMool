package com.modules.dialog;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import com.wsmool.R;

import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.TextView;

/**
 * 自定义对话框
 */
public class DialogModule extends ReactContextBaseJavaModule {


    public DialogModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "DialogAndroid";
    }

    //---------------------自定义分割线----------------------------
    
    private AlertDialog.Builder builder; // 自定义对话框
    private AlertDialog dialog;          

    // 组件按钮
    private EditText dialog_et_num; // 确认量
    private TextView dialog_tv_yes; // 确认
    private TextView dialog_tv_no; // 取消

    // 初始化组件
    public void initViews(View contentView) {
        dialog_et_num = (EditText) contentView.findViewById(R.id.dialog_et_num);
        dialog_tv_yes = (TextView) contentView.findViewById(R.id.dialog_tv_yes);
        dialog_tv_no = (TextView) contentView.findViewById(R.id.dialog_tv_no);
    }

    /**
	 * 该方法用于给JavaScript进行调用
     * 弹出自定义对话框
     */
	@ReactMethod
    public void showAlertDialog(String nums,final Callback callback) {
        builder = new Builder(getCurrentActivity());
        dialog = builder.create();
        View contentView = View.inflate(getCurrentActivity(), R.layout.dialog_confirm, null);
        initViews(contentView);
        
        dialog_et_num.setText(nums);

        dialog.setView(contentView);
        dialog.show();

        //取消点击事件
        dialog_tv_no.setOnClickListener(new OnClickListener() {     
            @Override
            public void onClick(View view) {
                // TODO Auto-generated method stub
                dialog.dismiss();
            }
        });
        
        //确认点击事件
        dialog_tv_yes.setOnClickListener(new OnClickListener() {
            
            @Override
            public void onClick(View view) {
                // TODO Auto-generated method stub      
                dialog.dismiss();
                String nums = dialog_et_num.getText().toString().trim();
                callback.invoke(nums);
            }
        });
        
    }


      //--------------------------------分割线------------------------------------------

    /**
     * 该方法用于给JavaScript进行调用
     * 弹出选择对话框
     */
    @ReactMethod
    public void showSelectDialog(String strs,final Callback callback) {
        //    指定下拉列表的显示数据
        final String[] arrays = strs.split(",");
        AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
        builder.setTitle("选择仓库");
        //    设置一个下拉的列表选择项
        builder.setItems(arrays, new DialogInterface.OnClickListener()
        {
            @Override
            public void onClick(DialogInterface dialog, int which)
            {
                dialog.dismiss();
                String value = arrays[which];
                callback.invoke(value);
                //Toast.makeText(getCurrentActivity(), "选择的城市为：" + strings[which], Toast.LENGTH_SHORT).show();
            }
        });
        builder.show();
    }
}