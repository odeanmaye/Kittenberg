package com.kittenberg.games;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;

public class Controller {
	
  private Context context;
  
  public Controller( Context c )
  {
	  this.context = c;
  }
  
  @JavascriptInterface
  public void openBirdGame()
  {
	  Intent intent = new Intent(this.context, BirdGame.class);
	  this.context.startActivity( intent );
  }
  
}
