//original generated
package com.hocchat;

// Splash screen related stuff
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "hocchat";
  }
}