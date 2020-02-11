/**
 Napló/terv
 2008/12/01h	template --> saját
 2008/12/02k	összes state-nek keyhandlingjének, paintjének a kerete
 2008/12/03s	megfejtés generálás, kiiratás, ellenõrzés --> nem jó még
 2008/12/04c	about és help feltöltése drótozva egyelõre --> kész
 2008/12/05p	a kurzor mozgatásának finomítása, scrollozódás --> scrollozódás nincs meg
 2008/12/06s	grafika felirat(title) ez vasárnapra marad
 2008/12/07v	grafika fõcímképernyõ	
 
 
 
 
 * @dddd
 */
 


import java.util.Random;

import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Font;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.lcdui.game.Sprite;

/**
 * @author iszalontai & jtabanyi
 *
 */
public final class VarosokCanvas extends Canvas implements Runnable {

	private static final VarosokCanvas INSTANCE = new VarosokCanvas();
	protected static final VarosokCanvas getInstance() {
		return INSTANCE;
	}
	
	private static final Font FONT = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_BOLD, Font.SIZE_MEDIUM);
	private static final Font FONTS = Font.getFont(Font.FACE_SYSTEM, Font.STYLE_BOLD, Font.SIZE_SMALL);
	private static final int CURSOR_MODE=1;
	private static final int GAME_MODE=1;
	private static final int MIX_MODE=1;
	private static final int STATE_SPLASH = 0;
	private static final int STATE_MENU = 1;
	private static final int STATE_GAME = 2;
	private static final int STATE_HELP = 3;
	private static final int STATE_ABOUT = 4;
	private static final int STATE_WANTEXIT = 5;
	private static final int STATE_MEGFEJTES = 6;
	private static final int STATE_DONE = 7;
	private static final int STATE_NEXTLEVEL = 8;
	private static final int STATE_INICLEVEL = 9;
	private static final int STATE_INICMENU = 10;
	private static final int STATE_WRONGANSWER = 11;
	private static final int STATE_SPLASH2 = 12;
	private static final int STATE_SELECTSKILL = 13;
	private static final int STATE_SHOWHIGH = 14;
	private static final int STATE_INPUTHIGH = 15;
	private static final int STATE_GAMEOVER = 16;
	
	private static final int SCORE_BEGIN = 50;
	private static final int SCORE_NEXTLEVEL = 50;
	private static final int SCORE_FLIP = -10;
	private static final int SCORE_BADANSWER = -100;
	private static final int SCORE_TIME = 20;
//kezdetben 50 pont
//fordításnál -10 pont
//jó megfejtésnél 50 pont
//rossz megfejtésnél -100 pont
//mindenegyes másodperc	-1 pont
	
	private static final String [] Varosok =
		{"Siklós","Debrecen","Pécs","Eger","Szeged","Sopron","Budapest",
		"Székesfehérvár","Esztergom","Pannonhalma","Szentendre","Keszthely"};
	private static final String [] About ={//ezeket majd fájlból olvasom be, ha lesz idõm
		"Készítette a",
		"AFF Kft.",
		"a Magyar",
		"Turizmus Zrt.",
		"megbízásából.",
		"© 2008",
		"Minden jog",
		"fenntartva!"
		};
	private static final String [] Help ={
		"Játékmenet:",
		"",
		"A játékban egy",
		"szétdarabolt,",
		"lefordított",
		"képrõl kell kitalálni",
		"a részletekbõl, hogy",
		"melyik magyar várost",
		"ábrázolja a kép."
		};
		
	private static final int charHeight = 18;
	private static final int cursorPush=4;
		
	private static final int [] sinus ={1000,940,766,500,174,174,500,766,940,1000};
	private static final int [] sinusDetailed ={87,173,258,342,422,500,573,642,
				707,766,819,866,906,939,965,984,996};
	
	
	private int state = STATE_SPLASH;
	
	private static final int [] SKILLSPLIT ={3,5,6};
	
	private static final int COLOR_FOCUSED=0x00FFFF00;
	private static final int COLOR_NORMAL=0x00FFFFFF;
	
  int tile_x_max;
	int tile_y_max;
	private static final int step=8;
	private static final int step_scroll=2;
	private static final int margin_left=50;
	private static final int margin_top=50;
	private static final int gap=2;
	
	
	
	/**
	 * 
	 */
	private VarosokCanvas() {
		// TODO Auto-generated constructor stub
		setFullScreenMode(true);
	}
	
	Image logo2009;
	Image magyar;
	Image cursors;
	Image picture, pattern, digits, chars, arrows;
	Image title_city, title_top, title_top128, title_turist, title_turist128,title_light;
	int cursor_x;
	int cursor_y;
	int xv;
	int yv;
	int xa;
	int ya;
	int cursor_x_grid;
	int cursor_y_grid;
	int offset_x;
	int offset_y;
	int margin_right;
	int margin_bottom;
	int delay;
	int [][] tile = new int [20][20];
	int [] MEGFEJTES = new int [4];
	//int [] levelOrder = new int [Varosok.length];
	int [] levelOrder = new int [12];
	int score;
	int scoreDisplay;
	int scoreCounter;
	int hanyadiklettem;
	String playername="HUN";
	int skill;
	int tile_width;
	int tile_height;
	int tile_x;
	int tile_y;
	int pict_top;
	int pict_left;
	int level;
	int maxlevel;
	int jovalasz;
	int rotate=20;
	String [] highName = {"HUN","HUN","HUN","HUN","HUN"};
	int [] highScore = {100,70,60,40,30};
	String highChars ="AÁBCDEÉFGHIÍJKLMNOÓÖÕPQRSTUÚÜÛVWXYZ"; 
	Random generator = new Random();//elkészítjük a véletlenszám generátort
																	//kész vagyok ettõl a javatól ÁÁÁÁÁÁÁÁÁÁÁÁ
	
	protected void init() {
		
		maxlevel = Varosok.length;
		
		try {
			logo2009 = Image.createImage("/logo2009.png");
			cursors = Image.createImage("/cursors.png");
			magyar = Image.createImage("/magyar.png");
			title_city = Image.createImage("/title_city.png");
			title_top = Image.createImage("/title_top.png");
			title_top128 = Image.createImage("/title_top128.png");
			title_turist = Image.createImage("/title_turist.png");
			title_turist128 = Image.createImage("/title_turist128.png");
			title_light = Image.createImage("/title_toplight.png");
			digits = Image.createImage("/digits.png");
			chars = Image.createImage("/char_hu.png");
			arrows = Image.createImage("/arrows.png");
		} catch (Throwable t) {
			t.printStackTrace();
		}
	}

	private Thread thread;
	protected void start() {
		if(thread == null) {
			thread = new Thread(this);
			thread.start();
		}
	}

	private long lastShowNotifyTime;
	protected void showNotify() {
		// TODO Auto-generated method stub
		super.showNotify();
		lastShowNotifyTime = System.currentTimeMillis();
	}
	//main loop
	public void run() {
		try {
			while(thread != null) {
				//work
				work();
				//handle key events
				handleKeyEvents();
				//refresh screen
				repaint();
				serviceRepaints();
				//wait
				Thread.sleep(50);//20 fps
			}
		} catch (Throwable e) {
			e.printStackTrace();
		} finally {
			VarosokMidlet.getInstance().notifyDestroyed();
		}
	}
	
	protected void setDelay(int hello){
		if(delay==0)delay=hello;
		delay--;
		if(delay<0)delay=0;
	}
	
	protected void stop() {
		thread = null;//Ezzel van a gebasz!!! A kiszállás nem ilyen egyszerû!!! 
		//A Midlet osztály destroyApp(null) metódusával is tudatni kell ezt !!!
	}
	
	protected int Rnd(int limit){
		int i=generator.nextInt()%limit;
				if(i<0)i=-i;
		return 	i;
	}
	
	private void work() {
		switch(state) {
		case STATE_SPLASH :
			setDelay(40);
			if(delay==0){ 
				setState(STATE_SPLASH2);
			}
			break;
		case STATE_SPLASH2 :
			setDelay(40);
			if(delay==0){ 
				setState(STATE_INICMENU);
			}
			break;
		case STATE_GAME :
			GameLogic();
			break;
		case STATE_INICLEVEL:
			InicLevel();
			break;
		case STATE_NEXTLEVEL:
			NextLevel();
			break;
		case STATE_INICMENU:
			InicMenu();
			break;
		}
	}

	private void GameLogic(){
		moveCursor();
		handleTiles();
		scrollIt();
		followScore();
		if(scoreDisplay<=0){
			setState(STATE_GAMEOVER);
		}
	}
	
	private void followScore(){
		if(scoreCounter<=SCORE_TIME){
			scoreCounter++;
		}else{
			scoreCounter=0;
			score--;
		}
		if(score>scoreDisplay)scoreDisplay++;
		if(score<scoreDisplay)scoreDisplay--;
	}
	
	private void NextLevel(){
		if(rotate>=5000)rotate=-1;
		if(rotate<sinusDetailed.length)rotate++;
	}
	
	private void InsertHigh(){//ezt csak akkor hívja meg,ha valakinél találat volt
		hanyadiklettem=0;
		while(highScore[hanyadiklettem]>scoreDisplay){hanyadiklettem++;}
		int i=highScore.length-1;
		while(i>hanyadiklettem){
			highScore[i]=highScore[i-1];
			highName[i]=highName[i-1];
			i--;
		}
		highScore[hanyadiklettem]=scoreDisplay;
		highName[hanyadiklettem]=playername;
		
		focus=0;
	}
	
	private void handleTiles(){
		for(int j=0;j<=tile_y_max;j++){
			for(int i=0;i<=tile_x_max;i++){
				if(tile[i][j]!=0&&tile[i][j]!=9)tile[i][j]++;
			}
		}
	}
	
	private void moveCursor(){
		int cursor_xt=tile_x*tile_width+tile_width/2+pict_left;
		int cursor_yt=tile_y*tile_height+tile_height/2+pict_top;
		if(cursor_x>cursor_xt){
			if(cursor_x-cursor_xt<step)xv=-1;else xv=-step;
		}
		if(cursor_x<cursor_xt){
			if(cursor_xt-cursor_x<step)xv=1;else xv=step;
		}
		if(cursor_x==cursor_xt)xv=0;
		
		if(cursor_y>cursor_yt){
			if(cursor_y-cursor_yt<step)yv=-1;else yv=-step;
		}
		if(cursor_y<cursor_yt){
			if(cursor_yt-cursor_y<step)yv=1;else yv=step;
		}
		if(cursor_y==cursor_yt)yv=0;
		
		cursor_x+=xv;
		cursor_y+=yv;
	}
	
	private void scrollIt(){
		if(offset_x+cursor_x<margin_left)offset_x+=step_scroll;
		if(offset_x+cursor_x>margin_right)offset_x-=step_scroll;
		if(offset_y+cursor_y<margin_top)offset_y+=step_scroll;
		if(offset_y+cursor_y>margin_bottom)offset_y-=step_scroll;
	}
	
	private void InicLevel(){
		try {
			picture=Image.createImage("/lvl"+levelOrder[level-1]+".png");
			pattern=Image.createImage("/pattern1.png");
		} catch (Throwable t) {
			t.printStackTrace();
		}
		int width = getWidth();
		int height = getHeight();
		pict_top=(height-picture.getHeight())/2;
		pict_left=(width-picture.getWidth())/2;
		tile_x_max=SKILLSPLIT[skill];
		tile_y_max=tile_x_max;
		tile_width=picture.getWidth()/(tile_x_max+1);
		tile_height=picture.getHeight()/(tile_y_max+1);
		cursor_x_grid=tile_width;
		cursor_y_grid=tile_height;
		tile_x=tile_x_max/2;
		tile_y=tile_y_max/2;
		cursor_x=tile_x*tile_width+tile_width/2+pict_left;
		cursor_y=tile_y*tile_height+tile_height/2+pict_top;
		
		rotate=6000;
		xv=0;
		yv=0;
		xa=0;
		ya=0;
		for(int j=0;j<=tile_y_max;j++){
			for(int i=0;i<=tile_x_max;i++){
				tile[i][j]=0;
			}
		}
		margin_right=width-margin_left;
		margin_bottom=height-margin_top;
		offset_x=0;
		offset_y=0;
		if(offset_x+cursor_x<margin_left)offset_x = margin_left-cursor_x;
		if(offset_y+cursor_y<margin_top)offset_y = margin_top-cursor_y;
		fillMegfejtes();
		setState(STATE_GAME);
	}
	
	private void InicMenu(){
		level=1;
		focus=0;
		focus_x=0;
		score=SCORE_BEGIN;
		scoreDisplay=score-10;
		mixLevel();
		setState(STATE_MENU);
	}
	
	private void mixLevel(){
		for(int i=0;i<Varosok.length;i++){
			levelOrder[i]=i+1;
		}
		if(MIX_MODE==1){
			for(int j=0;j<100;j++){
				int a = Rnd(Varosok.length);
				int temp = levelOrder[0];
				levelOrder[0]=levelOrder[a];
				levelOrder[a]=temp;
			}
		}
	}
	
	private void fillMegfejtes(){
		jovalasz=Rnd(MEGFEJTES.length);//Hányadik legyen a jó válasz? 0-3
		boolean vanilyen;
		for(int i=0;i<MEGFEJTES.length;i++){//i=0,1,2,3
			if(i==jovalasz){
				MEGFEJTES[i]=levelOrder[level-1];
			}else{
					do{
						vanilyen=false;
						MEGFEJTES[i] = levelOrder[Rnd(levelOrder.length)];
						if(MEGFEJTES[i]==levelOrder[level-1])vanilyen=true;
						for(int j=0;j<i;j++){
							if(MEGFEJTES[i]==MEGFEJTES[j])vanilyen=true;
						}//addig ciklusban maradunk, amíg ez igaz
					}while(vanilyen);//kilép ha hamis
			}
		}
	}
	
	private void flipTile(){
		score+=SCORE_FLIP;
		if(GAME_MODE==0){
			if(tile[tile_x][tile_y]==0)tile[tile_x][tile_y]=9;
				else tile[tile_x][tile_y]=0;
		}
		if(GAME_MODE==1){
			if(tile[tile_x][tile_y]==0)tile[tile_x][tile_y]=1;
		}
		if(GAME_MODE==2){
			for(int j=0;j<=tile_y_max;j++){
				for(int i=0;i<=tile_x_max;i++){
					tile[i][j]=0;
				}
			}
			if(tile[tile_x][tile_y]==0)tile[tile_x][tile_y]=9;
		}
	}
	
	private void handleKeyEvents() {
		switch (state) {
		case STATE_MENU:
			handleMenuKeyEvents();
			break;
		case STATE_GAME:
			handleGameKeyEvents();
			break;
		case STATE_HELP:
			handleHelpKeyEvents();
			break;
		case STATE_ABOUT:
			handleAboutKeyEvents();
			break;
		case STATE_WANTEXIT:
			handleWantExitKeyEvents();
			break;
		case STATE_MEGFEJTES:
			handleMegfejtesKeyEvents();
			break;
		case STATE_DONE:
			handleDoneKeyEvents();
			break;
		case STATE_NEXTLEVEL:
			handleNextLevelKeyEvents();
			break;
		case STATE_WRONGANSWER:
			handleWrongAnswerKeyEvents();
			break;
		case STATE_SELECTSKILL:
			handleSelectSkillKeyEvents();
			break;
		case STATE_SHOWHIGH:
			handleShowHighKeyEvents();
			break;
		case STATE_INPUTHIGH:
			handleInputHighKeyEvents();
			break;
		case STATE_GAMEOVER:
			handleGameOverKeyEvents();
			break;
		default:
			break;
		}
	}
	
	private void handleMenuKeyEvents() {
		if(isUpKeyPressed) {
			if(focus > 0) {
				setFocus(focus - 1);
			} else {
				setFocus(MENU.length - 1);
			}
		} else if(isDownKeyPressed) {
			if(focus < MENU.length -1) {
				setFocus(focus + 1);
			} else {
				setFocus(0);
			}
		} else if(isFireKeyPressed) {//select
			menuItemSelected(focus);
		} else if(isRightSoftKeyPressed) {//exit
			state = STATE_WANTEXIT;
		} else if(isLeftSoftKeyPressed) {//select
			menuItemSelected(focus);
		}
	}
	
	private void handleGameKeyEvents() {
		
		if(isLeftKeyPressed) {
			isLeftKeyPressed=false;
			tile_x--;
			if(tile_x<0)tile_x=tile_x_max;
		} else if(isRightKeyPressed) {
			isRightKeyPressed=false;
			tile_x++;
			if(tile_x>tile_x_max)tile_x=0;
		}
		if(isUpKeyPressed) {
			isUpKeyPressed=false;
			tile_y--;
			if(tile_y<0)tile_y=tile_y_max;
		} else if(isDownKeyPressed) {
			isDownKeyPressed=false;
			tile_y++;
			if(tile_y>tile_y_max)tile_y=0;
		}
		if(isFireKeyPressed) {
			flipTile();
			isFireKeyPressed=false;
		}
		
		if(isLeftSoftKeyPressed) {
			setState(STATE_MEGFEJTES);
		}
		if(isRightSoftKeyPressed) {
			boolean ujrekord=false;
			for(int i=0;i<highName.length;i++){
				if(scoreDisplay>highScore[i])ujrekord=true;
			}
			if(ujrekord){
				InsertHigh();
				setState(STATE_INPUTHIGH);
			}else{
				setState(STATE_INICMENU);
			}
		}
	}
	
	private void handleHelpKeyEvents() {
		if(isRightSoftKeyPressed) {
			setState(STATE_MENU);
		}
	}
	
	private void handleAboutKeyEvents() {
		if(isRightSoftKeyPressed) {
			setState(STATE_MENU);
		}
	}
	
	private void handleWantExitKeyEvents() {
		if(isLeftSoftKeyPressed) {
			stop();//Ez itt túl gyorsan kilép, JVM-nél oda lépek vissza honnan kiléptem,
			//rendes telefonon ez nem probléma
		  //VarosokMidlet.VarosokMidlet.destroyApp(true);
		  //FW.fw.destroyApp(true);  MidletPascal-ban valami ilyesmi volt
    }
		if(isRightSoftKeyPressed) {
			setState(STATE_MENU);
		}
	}
	
	private void handleMegfejtesKeyEvents() {
		if(isUpKeyPressed) {
			if(focus > 0) {
				setFocus(focus - 1);
			} else {
				setFocus(MEGFEJTES.length - 1);
			}
		} else if(isDownKeyPressed) {
			if(focus < MEGFEJTES.length -1) {
				setFocus(focus + 1);
			} else {
				setFocus(0);
			}
		} else if(isFireKeyPressed) {//select
			megfejtesItemSelected(focus);
		} else if(isRightSoftKeyPressed) {//exit
			setState(STATE_GAME);
		} else if(isLeftSoftKeyPressed) {//select
			megfejtesItemSelected(focus);
		}
	}
	
	private void handleDoneKeyEvents() {
		if(isRightSoftKeyPressed) {
			boolean ujrekord=false;
			for(int i=0;i<highName.length;i++){
				if(scoreDisplay>highScore[i])ujrekord=true;
			}
			if(ujrekord){
				InsertHigh();
				setState(STATE_INPUTHIGH);
			}else{
				setState(STATE_INICMENU);
			}
		}
	}
	
	private void handleNextLevelKeyEvents() {
		if(isRightSoftKeyPressed) {
		  setState(STATE_INICLEVEL);
		}
	}
	
	private void handleWrongAnswerKeyEvents() {
		if(isRightSoftKeyPressed) {
		  setState(STATE_GAME);
		}
	}
	
	private void handleSelectSkillKeyEvents() {
		if(isUpKeyPressed) {
			if(focus > 0) {
				setFocus(focus - 1);
			} else {
				setFocus(SKILL.length - 1);
			}
		} else if(isDownKeyPressed) {
			if(focus < SKILL.length -1) {
				setFocus(focus + 1);
			} else {
				setFocus(0);
			}
		}
		if(isLeftSoftKeyPressed||isFireKeyPressed) {
			skill=focus;
			setState(STATE_INICLEVEL);
		}
		if(isRightSoftKeyPressed) {
		  
		  setState(STATE_MENU);//nem kell inic menu
		}
	}
	
	private void handleShowHighKeyEvents() {
		if(isLeftSoftKeyPressed) {
			//deleteHigh()
		  setState(STATE_MENU);
		}
		if(isRightSoftKeyPressed) {
		  setState(STATE_MENU);
		}
	}
	
	private void handleInputHighKeyEvents() {
		if(isLeftKeyPressed) {
			if(focus > 0) {
				setFocus(focus - 1);
			} else {
				setFocus(highName[1].length() - 1);
			}
		} else if(isRightKeyPressed) {
			if(focus < highName[1].length() -1) {
				setFocus(focus + 1);
			} else {
				setFocus(0);
			}
		} else if(isUpKeyPressed){
			focus_x--;
			if(focus_x <= 0)focus_x = highChars.length()-1;
			if(focus==0)highName[hanyadiklettem]=highChars.substring(focus_x,focus_x+1)+highName[hanyadiklettem].substring(1,3);
			if(focus==1)highName[hanyadiklettem]=highName[hanyadiklettem].substring(0,1)+highChars.substring(focus_x,focus_x+1)+highName[hanyadiklettem].substring(2,3);
			if(focus==2)highName[hanyadiklettem]=highName[hanyadiklettem].substring(0,2)+highChars.substring(focus_x,focus_x+1);
			playername=highName[hanyadiklettem];
		} else if(isDownKeyPressed){
			focus_x++;
			if(focus_x >= highChars.length()-1)focus_x = 0;
			if(focus==0)highName[hanyadiklettem]=highChars.substring(focus_x,focus_x+1)+highName[hanyadiklettem].substring(1,3);
			if(focus==1)highName[hanyadiklettem]=highName[hanyadiklettem].substring(0,1)+highChars.substring(focus_x,focus_x+1)+highName[hanyadiklettem].substring(2,3);
			if(focus==2)highName[hanyadiklettem]=highName[hanyadiklettem].substring(0,2)+highChars.substring(focus_x,focus_x+1);
			playername=highName[hanyadiklettem];
		} else if(isFireKeyPressed) {//jobbralép
			
		} else if(isRightSoftKeyPressed) {//torol
			
		} else if(isLeftSoftKeyPressed) {//bevitel vege
			setState(STATE_INICMENU);
		}
	}
	
	private void handleGameOverKeyEvents() {
		if(isRightSoftKeyPressed) {
		  setState(STATE_INICMENU);
		}
	}
	
	private void menuItemSelected(int focus) {
		if(focus==0) {
			//setState(STATE_INICLEVEL);//kezdés
			setState(STATE_SELECTSKILL);
		} else if(focus==1) {
			setState(STATE_SHOWHIGH); //rekord
		} else if(focus==2) {
			setState(STATE_HELP); //segítség
		} else if(focus==3) {
			setState(STATE_ABOUT); //játékról
		}
	}
	
	private void megfejtesItemSelected(int focus) {
		if (jovalasz==focus){
		  	if(level<maxlevel){
		  	   setState(STATE_NEXTLEVEL);
			     level++;
			     score+=SCORE_NEXTLEVEL;
			   } else {setState(STATE_DONE);}
		} else {
			score+=SCORE_BADANSWER;
			setState(STATE_WRONGANSWER);
		}
	}
	
	private long lastSetFocusTime;
	private void setFocus(int focus) {
		long time = System.currentTimeMillis();
		if(time - lastSetFocusTime < 250) {
			return;
		}
		lastSetFocusTime = time;
		this.focus = focus;
	}
	
	public int getGameAction(int keyCode) {
		try {
			keyCode = super.getGameAction(keyCode);
		} catch (Throwable e) {
			keyCode = Integer.MIN_VALUE;
		}
		return keyCode;
	}

	
	protected void keyPressed(int keyCode) {
		super.keyPressed(keyCode);
		int gameAction = getGameAction(keyCode);
		setKeyPressed(keyCode, gameAction, true);
	}

	protected void keyReleased(int keyCode) {
    super.keyReleased(keyCode);
		int gameAction = getGameAction(keyCode);
		setKeyPressed(keyCode, gameAction, false);
	}

	private boolean isUpKeyPressed;
	private boolean isDownKeyPressed;
	private boolean isLeftKeyPressed;
	private boolean isRightKeyPressed;
	
	private boolean isFireKeyPressed;
	private boolean isLeftSoftKeyPressed;
	private boolean isRightSoftKeyPressed;
	private void setKeyPressed(int keyCode, int gameAction, boolean isKeyPressed) {
		if(gameAction == Canvas.UP) {
			isUpKeyPressed = isKeyPressed;
		} else if(gameAction == Canvas.DOWN) {
			isDownKeyPressed = isKeyPressed;
		} else if(gameAction == Canvas.LEFT) {
			isLeftKeyPressed = isKeyPressed;
		} else if(gameAction == Canvas.RIGHT) {
			isRightKeyPressed = isKeyPressed; 
		} else if(gameAction == Canvas.FIRE) {
			isFireKeyPressed = isKeyPressed;
		} else if(keyCode == LSK) {
			isLeftSoftKeyPressed = isKeyPressed;
		} else if(keyCode == RSK) {
			isRightSoftKeyPressed = isKeyPressed;
		}
	}
	
	private void setState(int newstate){
    state=newstate;
    isFireKeyPressed=false;
    isLeftSoftKeyPressed=false;
    isRightSoftKeyPressed=false;
  }
	
	/* (non-Javadoc)
	 * @see javax.microedition.lcdui.Canvas#paint(javax.microedition.lcdui.Graphics)
	 */
	protected void paint(Graphics g) {
		int width = getWidth();
		int height = getHeight();
		switch (state) {
		case STATE_SPLASH:
			paintSplash(g, width, height);
			break;
		case STATE_MENU:
			paintMenu(g, width, height);
			break;
		case STATE_GAME:
			paintGame(g, width, height);
			break;
		case STATE_HELP:
			paintHelp(g, width, height);
			break;
		case STATE_ABOUT:
			paintAbout(g, width, height);
			break;
		case STATE_WANTEXIT:
			paintWantExit(g, width, height);
			break;
		case STATE_MEGFEJTES:
			paintMegfejtes(g, width, height);
			break;
		case STATE_DONE:
			paintDone(g, width, height);
			break;
		case STATE_NEXTLEVEL:
			paintNextLevel(g, width, height);
			break;
		case STATE_WRONGANSWER:
			paintWrongAnswer(g, width, height);
			break;
		case STATE_SPLASH2:
			paintSplash2(g, width, height);
			break;
		case STATE_SELECTSKILL:
			paintSelectSkill(g, width, height);
			break;
		case STATE_SHOWHIGH:
			paintShowHigh(g, width, height);
			break;
		case STATE_INPUTHIGH:
			paintInputHigh(g, width, height);
			break;
		case STATE_GAMEOVER:
			paintGameOver(g, width, height);
			break;
		default:
			break;
		}
		paintSoftCommands(g, width, height);//ezt úgyis mindig ki kell rajzolni
	}	
	
	private static final String [][] SOFT_COMMANDS = {
		{null, null},//splash=0
		{"Kiválaszt", "Kilép"},//menu=1
		{"Megfejtés", "Felad"},//game=2
		{null,"Vissza"},//help=3
		{null,"Vissza"},//about=4
		{"Igen","Nem"},//want exit=5
		{"Kiválaszt","Vissza"},//megfejtés=6
		{null,"Tovább"},//done=7
		{null,"Tovább"},//next level=8
		{null,null},//inic level=9
		{null,null},//inic menu=10
		{null,"Tovább"},//wrong answer=11
		{null, null},//splash2=12
		{"Kiválaszt","Vissza"},//selectskill=13
		{"Töröl","Vissza"},//showhigh=14
		{"Bevitel vége","Töröl"},//inputhigh=15
		{null,"Tovább"}//gameover=16
		};
	
	private void drawString2(Graphics g,String k, int x, int y, int align, int Color){
		g.setColor(0x00000000);
		g.drawString(k,x+1,y,align);
		g.drawString(k,x-1,y,align);
		g.drawString(k,x,y+1,align);
		g.drawString(k,x,y-1,align);
		g.setColor(Color);
		g.drawString(k,x,y,align);
	}
	
	private void paintSoftCommands(Graphics g, int width, int height) {
		//g.setFont(FONT);
		//g.setClip(0,0,width,height);
		String [] commands = SOFT_COMMANDS[state];
		if(commands[0] != null) {//left
			//g.drawString(commands[0], 3, height - 3, Graphics.LEFT | Graphics.BOTTOM);
			//drawString2(g,commands[0], 3, height - 3,Graphics.LEFT | Graphics.BOTTOM, 0x00FFFFFF);
			paintString(g,commands[0],3,height-charHeight-3);
		}
		if(commands[1] != null) {//right
			//g.drawString(commands[1], width - 3, height - 3, Graphics.RIGHT | Graphics.BOTTOM);
			//drawString2(g,commands[1], width - 3, height - 3, Graphics.RIGHT | Graphics.BOTTOM, 0x00FFFFFF);
			paintString(g,commands[1],width-3-getStringWidth(commands[1]),height-charHeight-3);
		}
	}
	
	private void ClearScreen(Graphics g, int Color, int width, int height){
		g.setColor(Color);
		g.setClip(0,0,width,height);
		g.fillRect(0,0,width,height);
	}
	
	private void paintSplash(Graphics g, int width, int height) {
		ClearScreen(g,0x00FFFFFF,width,height);//white
		int left = (width - logo2009.getWidth()) / 2;
		int top = (height - logo2009.getHeight()) / 2;
		g.drawImage(logo2009, left, top, Graphics.LEFT | Graphics.TOP);
	}
	
	private void paintSplash2(Graphics g, int width, int height) {
		ClearScreen(g,0x00FFFFFF,width,height);//white
		int left = (width - magyar.getWidth()) / 2;
		int top = (height - magyar.getHeight()) / 2;
		g.drawImage(magyar, left, top, Graphics.LEFT | Graphics.TOP);
	}
	
	private void drawImage2(Graphics g, Image Img, int x, int y, int newWidth){
		int imgWidth=Img.getWidth();
		int imgHeight=Img.getHeight();
		for(int i=0; i<=newWidth; i++) {
			g.setClip(i+x, y, 1, imgHeight);
    	g.drawImage(Img, -i*imgWidth/newWidth+i+x,y, Graphics.LEFT | Graphics.TOP);
		}
	}

	
	private static final String [] MENU = {
		"Kezdés",
		"Rekord",
		"Segítség",
		"Játékról",
	};
	
	private int focus;
	private int focus_x;
	
	private void paintTitle(Graphics g, int width, int height){
		g.drawImage(title_city,0,height,Graphics.LEFT | Graphics.BOTTOM);
		if (width<200){
			g.drawImage(title_turist128,width,height,Graphics.RIGHT | Graphics.BOTTOM);
			g.drawImage(title_top128,width/2,0,Graphics.HCENTER | Graphics.TOP);
		} else {
			g.drawImage(title_turist,width,height,Graphics.RIGHT | Graphics.BOTTOM);
			g.drawImage(title_top,width/2,0,Graphics.HCENTER | Graphics.TOP);
		}
	}
	
	private void paintTitleT(Graphics g, int width, int height){
		g.drawImage(title_light,width/2,20,Graphics.HCENTER | Graphics.TOP);
	}
	
	private void paintMenu(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitle(g,width,height);
		int menuItemHeight = charHeight;
		int menuHeight = MENU.length * menuItemHeight;
		int top = (height - menuHeight) / 2;
		for(int i = 0; i < MENU.length; i++) {
			paintMenuItem(g, MENU[i], top, width, i == focus);
			top += menuItemHeight;
		}
	}
	
	private void paintMenuItem(Graphics g, String item, int top, int width, boolean isFocused) {
		int itemWidth = getStringWidth(item);
		int left = (width - itemWidth) / 2;
		if(isFocused) {
			paintCursor(g,left+itemWidth,top+charHeight/2);
			paintString(g,item,left-cursorPush, top);
		}else{paintString(g,item,left, top);}
	}
		
	private void paintTiles(Graphics g){
		for(int j=0;j<=tile_y_max;j++){
			for(int i=0;i<=tile_x_max;i++){
				g.setClip(i*tile_width+pict_left+offset_x,j*tile_height+pict_top+offset_y,tile_width-gap,tile_height-gap);
				//g.setColor(0x00000000);
				if(tile[i][j]==9){
					g.drawImage(picture,pict_left+offset_x,pict_top+offset_y,Graphics.TOP | Graphics.LEFT);
				}
				if(tile[i][j]==0) {
					g.drawImage(pattern, i*tile_width+pict_left+offset_x+tile_width/2, j*tile_height+pict_top+offset_y+tile_height/2, Graphics.HCENTER | Graphics.VCENTER);
					//g.drawRect(i*tile_width+pict_left+offset_x, j*tile_height+pict_top+offset_y,tile_width-gap-1,tile_height-gap-1);
				}
				if(tile[i][j]!=9&&tile[i][j]!=0){
					if(tile[i][j]<5){
						Image z=Image.createImage(pattern,(100-tile_width)/2,(100-tile_height)/2,tile_width-gap,tile_height-gap,Sprite.TRANS_NONE);
						drawImage2(g, z, i*tile_width+pict_left+offset_x+(tile_width-sinus[tile[i][j]]*tile_width/1000)/2, j*tile_height+pict_top+offset_y, sinus[tile[i][j]]*tile_width/1000);
						//g.drawRect(i*tile_width+pict_left+offset_x+(tile_width-sinus[tile[i][j]]*tile_width/1000)/2, j*tile_height+pict_top+offset_y, sinus[tile[i][j]]*tile_width/1000-1,tile_height-gap-1);
					}else{
						Image z=Image.createImage(picture,i*tile_width,j*tile_height,tile_width-gap,tile_height-gap,Sprite.TRANS_NONE);
						drawImage2(g, z, i*tile_width+pict_left+offset_x+(tile_width-sinus[tile[i][j]]*tile_width/1000)/2, j*tile_height+pict_top+offset_y, sinus[tile[i][j]]*tile_width/1000);
					}
				}
			}
		}
	}
	
	private void paintPicture(Graphics g){
		}
	
	
	private void paintCursor(Graphics g, int x, int y){
		if(CURSOR_MODE==0){
			g.setClip(x, y, 16,16);
			g.drawImage(cursors,x, y, Graphics.LEFT | Graphics.TOP);
		}
		if(CURSOR_MODE==1){
			g.setClip(x, y, 16,16);
			g.drawImage(cursors,x-16, y, Graphics.LEFT | Graphics.TOP);
		}
		if(CURSOR_MODE==2){
			g.setClip(x, y, 17,22);
			g.drawImage(cursors, x-34, y, Graphics.LEFT | Graphics.TOP);
		}
	}
	
	private void paintScore(Graphics g, int number){
		int [] ten={10000,1000,100,10,1};
		int pos=4;
		boolean drawnull=false;
		for (int i=0; i<ten.length; i++){
			if(number/ten[i]>0||drawnull){
				g.setClip(pos,4,16,17);
				g.drawImage(digits, pos-number/ten[i]*16, 4, Graphics.LEFT | Graphics.TOP);
				pos+=18;
				number=number-(number/ten[i])*ten[i];
				drawnull=true;
			}
		}
	}
	
	private static final int [] charPos = {0,7,14,21,32,41,51,61,71,81,91,101,111,122,
	130,139,151,164,176,189,200,212,224,237,245,255,268,279,294,308,321,333,346,359,
	370,382,394,406,421,433,445,456,465,476,485,495,505,513,523,534,541,550,561,569,
	583,594,603,614,624,633,642,650,660,669,682,692,702,712,729,742,755,767,779,793,
	807,820,832,844,856,866,874,884,892,902,912,922,933,944,954
	};
	
	private static final int [] charX = {33,33,0, 44,44,1, 46,46,2, 48,58,3,
	63,63,14, 65,90,15,	97,122,41, 153,153,67, 169,169,68, 174,174,69, 193,193,70,
	201,201,71, 205,205,79, 211,211,72, 214,214,74, 218,220,75, 225,225,78,
	233,233,80, 237,237,81, 243,243,82, 246,246,84, 250,252,85, 336,336,73,
	337,337,83, 368,368,76, 369,369,86
	};
	
	private void paintString(Graphics g, String text, int x, int y){
		int k=0;
		int n;
		int width;
		for(int i=0;i<text.length();i++)
		{
			int j=text.substring(i,i+1).hashCode();
			n=-3;
			do{
				n+=3;
			}while(!(j<=charX[n+1]));
			k=-charX[n]+charX[n+2];
			if(j!=32){
				width=charPos[k+j+1]-charPos[k+j]-2;
				g.setClip(x,y,width+2,18);
				g.drawImage(chars,x-charPos[k+j],y,Graphics.LEFT | Graphics.TOP);
			} else {width=5;}
			x+=width;
		}
	}
	
	private int getStringWidth(String text){
		int k=0;
		int n;
		int width=0;
		int x=0;
		for(int i=0;i<text.length();i++)
		{
			int j=text.substring(i,i+1).hashCode();
			n=-3;
			do{
				n+=3;
			}while(!(j<=charX[n+1]));
			k=-charX[n]+charX[n+2];
			if(j!=32){
				width=charPos[k+j+1]-charPos[k+j]-2;
			} else {width=5;}
			x+=width;
		}
		return x;
	}
	
	private void paintGame(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTiles(g);
		paintCursor(g, cursor_x+offset_x, cursor_y+offset_y);
		paintScore(g, scoreDisplay);
	}
	
	private void paintHelp(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitleT(g,width,height);
		String s="SEGÍTSÉG";
		paintString(g,s, (width-getStringWidth(s))/2, 10);
		int top = (height-charHeight*Help.length)/2;
		for(int i=0;i<Help.length;i++){
			s=Help[i];
			paintString(g,s,(width-getStringWidth(s))/2,top);
			top+=charHeight;
		}
	}
	
	private void paintAbout(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitleT(g,width,height);
		String s="JÁTÉKRÓL";
		paintString(g,s, (width-getStringWidth(s))/2, 10);
		int top = (height-charHeight*About.length)/2;
		for(int i=0;i<About.length;i++){
			s=About[i];
			paintString(g,s,(width-getStringWidth(s))/2,top);
			top+=charHeight;
		}
	}
	
	private void paintShowHigh(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitleT(g,width,height);
		String s="REKORD";
		String pontok=".....";
		paintString(g,s, (width-getStringWidth(s))/2, 10);
		int top = (height-charHeight*highName.length)/2;
		int left = (width-getStringWidth(pontok))/2;
		int top_arrows=top;
		for(int i=0;i<highName.length;i++){
			s=highName[i]+pontok+highScore[i];
			paintString(g,s,left-getStringWidth(highName[i]),top);
			if(i==hanyadiklettem)top_arrows=top-5;
			top+=charHeight;
		}
	}
	
	private void paintWantExit(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitle(g,width,height);
		String s="Valóban kilép?";
		paintString(g,s, (width-getStringWidth(s))/2, height/2);
	}
	
	private void paintMegfejtes(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		int menuItemHeight = charHeight;
		int menuHeight = MEGFEJTES.length * menuItemHeight;
		int top = (height - menuHeight) / 2;
		paintTiles(g);
		for(int i = 0; i < MEGFEJTES.length; i++) {		
			int itemWidth = getStringWidth(Varosok[MEGFEJTES[i]-1]);
			int left = (width - itemWidth) / 2;
			if(i==focus) {
				paintCursor(g,left+itemWidth,top+charHeight/2);
				paintString(g,Varosok[MEGFEJTES[i]-1],left-cursorPush, top);
			}else{
				paintString(g,Varosok[MEGFEJTES[i]-1],left, top);
			}
			top += menuItemHeight;
		}
		paintScore(g, scoreDisplay);
	}
	
	private void paintDone(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		String s="GRATULÁLOK!!!";
		paintString(g,s, (width-getStringWidth(s))/2, height/2-charHeight);
		s="Az összes várost";
		paintString(g,s, (width-getStringWidth(s))/2, height/2);
		s="megfejtetted!!!";
		paintString(g,s, (width-getStringWidth(s))/2, height/2+charHeight);
	}
	
	private static final String [] SKILL = {
		"Könnyû",//Könnyû
		"Közepes",
		"Nehéz",
	};
	
	private void paintSelectSkill(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		int menuItemHeight = charHeight;
		int menuHeight = SKILL.length * menuItemHeight;
		int top = (height - menuHeight) / 2;
		paintTitle(g,width,height);
		for(int i = 0; i < SKILL.length; i++) {		
			int itemWidth = getStringWidth(SKILL[i]);
			int left = (width - itemWidth) / 2;
			if(i==focus) {
				paintCursor(g,left+itemWidth,top+charHeight/2);
				paintString(g,SKILL[i],left-cursorPush, top);
			}else{
				paintString(g,SKILL[i],left, top);
			}
			top += menuItemHeight;
		}
	}
	
	private void paintInputHigh(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTitleT(g,width,height);
		String s="ÚJ REKORD!!!";
		String pontok=".....";
		paintString(g,s, (width-getStringWidth(s))/2, 10);
		int top = (height-charHeight*highName.length)/2;
		int left = (width-getStringWidth(pontok))/2;
		int top_arrows=top;
		for(int i=0;i<highName.length;i++){
			s=highName[i]+pontok+highScore[i];
			paintString(g,s,left-getStringWidth(highName[i]),top);
			if(i==hanyadiklettem)top_arrows=top-5;
			top+=charHeight;
		}
		s=highName[hanyadiklettem]+pontok+highScore[hanyadiklettem];
		left = left-getStringWidth(highName[hanyadiklettem]);
		g.setClip(0,0,width,height);
		g.drawImage(arrows, left+getStringWidth(s.substring(0,focus+1)), top_arrows, Graphics.TOP | Graphics.RIGHT);
		//paintString(g,""+focus_x,10,10);
		
	}
	
	private void paintGameOver(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTiles(g);
		String s="JÁTÉK VÉGE";
		paintString(g,s, (width-getStringWidth(s))/2, height/2);
		paintScore(g, scoreDisplay);
	}
	
	private void paintNextLevel(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		if(rotate<sinusDetailed.length){
			drawImage2(g,picture,pict_left+(picture.getWidth()-sinusDetailed[rotate]*picture.getWidth()/1000)/2,pict_top,sinusDetailed[rotate]*picture.getWidth()/1000);
		}else{
			g.drawImage(picture,pict_left,pict_top,Graphics.TOP | Graphics.LEFT);
		}
		String s="A VÁLASZOD";
		paintString(g,s, (width-getStringWidth(s))/2, height/2);
		s="HELYES!!!";
		paintString(g,s, (width-getStringWidth(s))/2, height/2+charHeight);
		paintScore(g,scoreDisplay);
		
	}
	
	private void paintWrongAnswer(Graphics g, int width, int height) {
		ClearScreen(g,0x00AAAAFF,width,height);//lightblue
		paintTiles(g);
		String s="Helytelen megoldás!";
		paintString(g,s, (width-getStringWidth(s))/2, height/2);
		s="Próbáld újra!";
		paintString(g,s, (width-getStringWidth(s))/2, height/2+charHeight);
		paintScore(g,scoreDisplay);
	}
	
	private final int LSK = getSoftKey("left", "1", -6);
	private final int RSK = getSoftKey("right", "2", -7);
    private int getSoftKey(String side, String number, int def) {
    	for(int i = 128; i >= -128; i--) {
			String keyName = null;
			try {
				keyName = getKeyName(i).toLowerCase();
			} catch(Exception e) {
				continue;
			}
			
			if(keyName.indexOf("soft") > -1 ||
			   keyName.indexOf("selection") > -1) {
				if(keyName.indexOf(side) > -1 ||
				   keyName.indexOf(number) > -1) {
					return i;
				}
			}
		}
    	return def;
    }	
	
}
