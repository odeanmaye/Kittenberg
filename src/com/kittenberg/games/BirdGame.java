package com.kittenberg.games;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebView;

public class BirdGame extends Activity {
	
	WebView view;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_bird_game);
		
		this.view = (WebView) findViewById(R.id.birdGameView);
		this.view.getSettings().setJavaScriptEnabled(true);
		this.view.addJavascriptInterface(new Controller(this), "Controller");
		this.view.loadUrl("file:///android_asset/bird-game.html");
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.bird_game, menu);
		return true;
	}

}
