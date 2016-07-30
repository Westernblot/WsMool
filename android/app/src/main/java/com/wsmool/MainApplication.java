package com.wsmool;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.modules.custom.AnToastReactPackage;
import com.modules.version.AnVersionReactPackage;
import com.modules.update.AnUpdateReactPackage;
import com.modules.progressdialog.AnProgressdialogReactPackage;
import com.modules.dialog.AnDialogReactPackage;
import com.modules.scan.AnScanReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
           new AnToastReactPackage(),
           new AnVersionReactPackage(),
           new AnUpdateReactPackage(),
           new AnProgressdialogReactPackage(),
           new AnDialogReactPackage(),
           new AnScanReactPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
