/**
 * @
 *
 *
 * @author K�r�si Tibor
 * @version 1.00 2008/10/27
 */

import java.awt.*;
import java.applet.*;
import java.util.Random;

public class zabalo extends Applet implements Runnable
{
	// V�ltoz�k inicializ�l�sa
	int x_pos;		// J�t�kos x poz�ci�ja
	int y_pos;		// J�t�kos y poz�ci�ja
	int face=4;		// J�t�kos megjelin�si form�ja, anim�ci�ja
	int x_d;		// J�t�kos x sebess�ge
	int y_d;		// J�t�kos y sebess�ge
	int gyors;		// J�t�kos aktu�lis sebess�ge
	int hatas_timer=0;	// Gy�m�lcs hat�sa a j�t�kosra
	int[] enemy_x=new int[20];	// Sz�rnyek x poz�ci�ja
	int[] enemy_y=new int[20];  //Sz�rnyek y poz�ci�ja
	int[] enemy_face=new int[20];	//Sz�rnyek megjelen�si alakja, anim�ci�ja
	int enemy_gyors;	//Sz�rnyek aktu�lis sebess�ge
	int enemy_hatas_timer=0;	//Gy�m�lcs hat�s�nak az id�tartama a sz�rnyekre
	int gyumi_micsoda;	//Milyen gy�m�lcs, 1P?
	int gyumi_x;	//Gy�m�lcs x poz�ci�ja
	int gyumi_y;	//Gy�m�lcs y poz�ci�ja
	int gyumi_timer=0;	//Meddig l�that� a gy�m�lcs, ha =0 akkor nincs semmi
	int palya=0;	//p�lya sz�ma
	int pont;	//pontsz�m
	int utem=0;	//�ltal�nos �tem, ez szab�lyozza a sebess�geket. Pl.: l�p�s, anim�ci�
	int szornyek;	//sz�rnyek sz�ma-1
	int pressedkey;	//legut�bb lenyomott billenty�. �rt�ke: 1-5
	int elet;	//�leteink sz�ma
	int gamestate=1;	//program vez�rl�shez haszn�lt
	int kaja;	//az aktu�lis p�ly�n l�v� bogy�k sz�ma
	int appletsize_x = 31*20; // Az applet sz�less�ge pixelben
	int appletsize_y = 25*20; // Az applet magass�ga pixelben
	public static final int tile=20; //egy k�pelem sz�less�ge, magass�ga pixelben
	public static final int mapWidth=30; //p�lya sz�less�ge
	public static final int mapHeight=24; //p�lya magass�ga
	public static final int maxpalya=4; //p�ly�k sz�ma
	public static final int seb_lassu=14; //h�rom f�le sebess�ge van a j�t�kosnak
	public static final int seb_normal=8;
	public static final int seb_gyors=4;
	public static final int gyumi_val=980;//gyumi el�t�n�si val�sz�n�s�ge. 1000=lehetetlen
	public static final int gyumi_hatas=300;//gyumi hat�s�nak ideje arra, aki felvette
	int enemy_seb_lassu=seb_lassu+2; //h�rom f�le sebess�ge van a sz�rnyeknek
	int enemy_seb_normal=seb_normal+2;
	int enemy_seb_gyors=seb_gyors+2;
	int KeyCode;
	Random generator = new Random();//elk�sz�tj�k a v�letlensz�m genr�tort
	Image elemek;
	String[][] mapij=new String[31][2500];//ebben a m�trixban t�roljuk az aktu�lis p�ly�t
	String[] map={									//ebben a t�mbben t�roljuk az �sszes p�ly�t
				"1111111111111111111111111111111",
				"1.............1111111........31",
				"1.11111111111.1111111.1111111.1",
				"1.11111111111.1111111.1111111.1",
				"1.11111111111.........1111111.1",
				"1.11111..1111.1111111.........1",
				"1.11111..1111.11111111111.11111",
				"1.............11111111111.11111",
				"1111111.11111111111111111.11111",
				"1111111.11111111111111111.11111",
				"1111111.1111111111111.........1",
				"1111111.1111111111111.111.111.1",
				"111111....21111111111.1111111.1",
				"1111111.1111111111111.1111111.1",
				"1111111.1111111111111.1111111.1",
				"1..........1111111111.1111111.1",
				"1.11111111.1111111111.1111111.1",
				"1.11111111.1111111111.1111111.1",
				"1.11111111.1111111111.1111111.1",
				"1..111111..1111111111.1111111.1",
				"1.11111111............1111111.1",
				"1.11111111.1111111111.1111111.1",
				"1.11111111.1111111111.111.111.1",
				"13.........1111111111.........1",
				"1111111111111111111111111111111",

				"1111111111111111111111111111111",
				"1............................31",
				"1.1111111111111.1111111111111.1",
				"1.1.........................1.1",
				"1.1.11111111111.11111111111.1.1",
				"1.1.13....................1.1.1",
				"1.1.1.111111111.111111111.1.1.1",
				"1.1.1.1.................1.1.1.1",
				"1.1.1.1.1111111.1111111.1.1.1.1",
				"1.1.1.1.1.............1.1.1.1.1",
				"1.1.1.1.1.11111.11111.1.1.1.1.1",
				"1.1.1.1.1.1.........1.1.1.1.1.1",
				"..........1.........1..........",
				"1.1.1.1.1.1.........1.1.1.1.1.1",
				"1.1.1.1.1.11111.11111.1.1.1.1.1",
				"1.1.1.1.1.............1.1.1.1.1",
				"1.1.1.1.1111111.1111111.131.1.1",
				"1.1.1.1.................1.1.1.1",
				"1.1.1.111111111.111111111.1.1.1",
				"1.1.1.....................1.1.1",
				"1.1.11111111111.11111111111.1.1",
				"1.1.........................1.1",
				"1.111111111111121111111111111.1",
				"13............................1",
				"1111111111111111111111111111111",
		
				"1111111111111111111111111111111",
				"13...........................31",
				"1.1111111.............111.111.1",
				"1.1.....1.............1.....1.1",
				"1.....................1.....1.1",
				"1.1.....1.............1.....1.1",
				"1.111 111.............111.111.1",
				"1.............................1",
				"1......                 ......1",
				"1.....     1111 1111     .....1",
				"1....      1.......1      ....1",
				"1...       1 1.2.1.1       ...1",
				"1..        ..11111..        ..1",
				"1..        1.1...1.1        ..1",
				"1..        1.......1        ..1",
				"1...       111111111       ...1",
				"1....        .  .         ....1",
				"1.....      ......       .....1",
				"1.1111111.    1.1    .1111111.1",
				"1.1.......    1.1    .1.....1.1",
				"1.1.......    1.1    .......1.1",
				"1.1.....1.    1.1    .......1.1",
				"1.1111111.    1.1    .1111111.1",
				"13...........................31",
				"1111111111111111111111111111111",
				
				"1111111111111111111111111111111",
				"1..2..............1...........1",
				"1.11111111111.111.1.1.1.11111.1",
				"1.1.........1...1...1.1.1...1.1",
				"1.1.11111.1.111.1.1.1.1.1.3.1.1",
				"1.1.1...1.1.1...1.1.1.1.1...1.1",
				"1.1.1.1.1.111.111111111.11.11.1",
				"1...1.1.1...........1.1.......1",
				"1.1.1.1.11111.11111.1.1.11111.1",
				"1.1.1.......1...1.1.1.1.1.....1",
				"1.1.1111111.1.1.1.1.1.1...111.1",
				"1.1...1.1.1.1.1.1.1.1.11111.1.1",
				"1.111.1.1.1.1.131.1........31.1",
				"1...1.1.1.....1.1.11111111111.1",
				"1.1.1.1.1.1.1.1.1.............1",
				"1.1.131.1.1.1.1.1.111111111.111",
				"1.1.1.1.1.1.1.1.1.1...........1",
				"1.1.1...1.1.1...1.1.111.1.111.1",
				"1.1.1.11111111111.1.1.......1.1",
				"1.1.1.1.1.1.1.1.1.1.1.11.11.1.1",
				"1.1.1.1.1.1.1.1.1...1.1...1.1.1",
				"1...1.............1.1.1...1...1",
				"1.111111111111111.1.111111111.1",
				"1................31....3......1",
				"1111111111111111111111111111111",

				};
	//String c;
	// V�ltoz�k a dupla bufferel�shez
	private Image dbImage;
	private Graphics dbg;

	public void init()
	{
		setBackground (Color.GRAY);
		elemek=getImage(getCodeBase(),"sprites_20x20.png");
		Font font = new Font("Arial", Font.BOLD, 20);
        	setFont(font);
	}
	
	public void start ()
	{
		// �j sz�lat hozunk l�tre, amiben a j�t�k fut
		Thread th = new Thread (this);
		// Elind�tjuk a sz�lat
		th.start ();
	}

	public void stop()
	{
		//Ez kell az applethoz
	}

	public void destroy()
	{
		//Ez is kell az applethoz
	}
	//Billenty� lenyom�st �szleli, ezt a met�dust meg se kell h�vni! Ez minden ciklusban lefut.
	public boolean keyDown (Event e, int key)
	{
		switch (key){
			case Event.LEFT:pressedkey=1;break;
			case Event.RIGHT:pressedkey=2;break;
			case Event.UP:pressedkey=3;break;
			case Event.DOWN:pressedkey=4;break;
			case Event.ENTER:pressedkey=5;break;
		}
		return true;
	}
	//sz�rnyek mozgat�sa
	public void move_enemy(){
		for(int i=0;i<szornyek;i++){
			if(utem%enemy_gyors==0){
				boolean lepette=false;
				int x_old=enemy_x[i];
				int y_old=enemy_y[i];
				if ((x_pos>enemy_x[i])&&(!mapij[enemy_x[i]+1][enemy_y[i]].equals("1"))&&(!vaneszorny(enemy_x[i]+1,enemy_y[i]))){
					enemy_x[i]++;
					lepette=true;
					}
				if ((x_pos<enemy_x[i])&&(!mapij[enemy_x[i]-1][enemy_y[i]].equals("1"))&&(!vaneszorny(enemy_x[i]-1,enemy_y[i]))){
					enemy_x[i]--;
					lepette=true;
					}
				if ((y_pos>enemy_y[i])&&(!mapij[enemy_x[i]][enemy_y[i]+1].equals("1"))&&(!lepette)&&(!vaneszorny(enemy_x[i],enemy_y[i]+1))){
					enemy_y[i]++;
					}
				if ((y_pos<enemy_y[i])&&(!mapij[enemy_x[i]][enemy_y[i]-1].equals("1"))&&(!lepette)&&(!vaneszorny(enemy_x[i],enemy_y[i]-1))){
					enemy_y[i]--;
					}
				animation_enemy(i);
			}
		}
	}
	
	public boolean vaneszorny(int x,int y){
		boolean vaneszorny=false;
		for(int i=0;i<szornyek;i++){
			if((x==enemy_x[i])&&(y==enemy_y[i])){vaneszorny=true;}
		}
		return vaneszorny;
	}
	//J�t�kos mozgat�sa
	public void move_player(){
		int x_d_proba=0;
		int y_d_proba=0;
		if (utem%gyors==0){
				//milyen gombot nyomt�l le?
			switch(pressedkey){
				case 1:x_d_proba=-1;y_d_proba=0;break;	//balra
				case 2:x_d_proba=1;y_d_proba=0;break;	//jobbra
				case 3:y_d_proba=-1;x_d_proba=0;break;	//fel
				case 4:y_d_proba=1;x_d_proba=0;break;	//le
			}
			//mi van, ha a p�lya jobb vagy bal sz�l�n vagyunk?
			if((x_pos==0)&&(x_d_proba==-1))x_d_proba=mapWidth;
			if((x_pos==0)&&(x_d==-1))x_d=mapWidth;
			if((x_pos!=0)&&(x_d==mapWidth))x_d=-1;
			
			if((x_pos==mapWidth)&&(x_d_proba==1))x_d_proba=-mapWidth;
			if((x_pos==mapWidth)&&(x_d==1))x_d=-mapWidth;
			if((x_pos!=mapWidth)&&(x_d==-mapWidth))x_d=1;
			
			//falon nem tudunk �tmenni
			if(!mapij[x_pos+x_d_proba][y_pos+y_d_proba].equals("1")){
				x_d=x_d_proba;
				y_d=y_d_proba;
			}
			//bogy� van el�tt�nk?
			if(mapij[x_pos+x_d][y_pos+y_d].equals(".")){
				mapij[x_pos+x_d][y_pos+y_d]=" ";
				pont+=10;
				kaja--;
			}
			if(mapij[x_pos+x_d][y_pos+y_d].equals(" ")){
				x_pos+=x_d;
				y_pos+=y_d;
				if(x_d==-1){
					if(face==4){face=5;}else{face=4;}
				}
				if(x_d==1){
					if(face==6){face=7;}else{face=6;}
				}
				if((y_d==1)||(y_d==-1))animation();
			}
			
		if(x_pos<0)x_pos=mapWidth;//ha kimegy�nk a bal oldalon, visszaj�v�nk a jobb oldalon
		if(x_pos>mapWidth)x_pos=0;//ha kimegy�nk a jobb oldalon, visszaj�v�nk a bal oldalon
		}
	}
	public void utkozes(){
		boolean utkozes=false;
		for(int i=0;i<szornyek;i++){
			if((x_pos==enemy_x[i])&&(y_pos==enemy_y[i]))utkozes=true;
		}
		if(utkozes){
			elet--;
						//j�t�k v�ge		m�gegyszer inic
			if(elet<0)gamestate=8;else gamestate=6;
		}
	}
	public void gyumikezelo(){
		if ((generator.nextInt()%1000>gyumi_val)&&(gyumi_timer==0)){
			gyumi_micsoda=generator.nextInt()%6;
			if(gyumi_micsoda<0)gyumi_micsoda=-gyumi_micsoda;
			//addig keresg�lj�k a helyet a gy�m�lcsnek, am�g nem a falra dobjuk
			do{
				gyumi_x=generator.nextInt()%mapWidth;
				if(gyumi_x<0)gyumi_x=-gyumi_x;
				gyumi_y=generator.nextInt()%mapHeight;
				if(gyumi_y<0)gyumi_y=-gyumi_y;
			}while(mapij[gyumi_x][gyumi_y].equals("1"));
			gyumi_timer=generator.nextInt()%400+200;
			if(gyumi_timer<0)gyumi_timer=-gyumi_timer;
		}
		//j�t�kos kapja el a gy�m�lcs�t
		if(gyumi_timer>0){
			if((x_pos==gyumi_x)&&(y_pos==gyumi_y)){
				if(gyumi_micsoda==0)elet++;
				if(gyumi_micsoda==1)pont+=1000;
				if(gyumi_micsoda==2){gyors=seb_gyors;hatas_timer=gyumi_hatas;}
				if(gyumi_micsoda==3){gyors=seb_lassu;hatas_timer=gyumi_hatas;}
				if(gyumi_micsoda==4){enemy_gyors=enemy_seb_gyors;enemy_hatas_timer=gyumi_hatas;}
				if(gyumi_micsoda==5){enemy_gyors=enemy_seb_lassu;enemy_hatas_timer=gyumi_hatas;}
				gyumi_timer=0;
			}	
		}
		//sz�rny kapja el a gy�m�lcs�t
		if(gyumi_timer>0){	
			for(int i=0;i<szornyek;i++){
				if((enemy_x[i]==gyumi_x)&&(enemy_y[i]==gyumi_y)){
					if(gyumi_micsoda==2){gyors=seb_gyors;hatas_timer=gyumi_hatas;}
					if(gyumi_micsoda==3){gyors=seb_lassu;hatas_timer=gyumi_hatas;}
					if(gyumi_micsoda==4){enemy_gyors=enemy_seb_gyors;enemy_hatas_timer=gyumi_hatas;}
					if(gyumi_micsoda==5){enemy_gyors=enemy_seb_lassu;enemy_hatas_timer=gyumi_hatas;}
					gyumi_timer=0;
				}
			}	
		}
		//el�bb ut�bb minden j�nak v�ge szakad...
		if(hatas_timer>0)hatas_timer--;else gyors=seb_normal;
		if(enemy_hatas_timer>0)enemy_hatas_timer--;else enemy_gyors=enemy_seb_normal;
		if(gyumi_timer>0)gyumi_timer--;
	}
	public void palyamegcsinalva(){
		if(kaja==0){		//p�ly�t megcsin�ltuk?
			if(palya==maxpalya-1)gamestate=9;else{	//esetleg ez az utols� p�lya volt? --> gratul�ci�
				palya++;
				gamestate=3;//�j p�lya
				}
		}
	}
	public void jatek(){	//gamestate=5
		move_enemy();		//ellens�g mozgat�sa
		move_player();		//j�t�kos mozgat�sa
		utkozes();			//�tk�z�s figyel�se az ellens�ggel
		gyumikezelo();		//gy�m�lcs kihelyez�se, majd a vele val� �tk�z�s figyel�se
		palyamegcsinalva();	//p�lya megcsin�lva?
	}
	public void jatekvege(){//gamestate=8
		if(pressedkey==5){
			pressedkey=0;
			gamestate=1;//f�c�m
		}
	}
	public void megegyszer_inic(){//gamestate=6
		szornyek=0;
		for(int j=0;j<=mapHeight;j++){
			for(int i=0;i<=mapWidth;i++){
				String mapij=(map[j+palya*(mapHeight+1)].substring(i,i+1));
				if(mapij.equals("2")){
					x_pos=i;
					y_pos=j;
				}
				if(mapij.equals("3")){
					enemy_x[szornyek]=i;
					enemy_y[szornyek]=j;
					szornyek++;
				}
			}
		}
		gamestate=7;
	}
	public void megegyszer(){//gamestate=7
		if(pressedkey==5)gamestate=5;//jatek
	}
	public void ujpalya_inic(){		//gamestate=3
		szornyek=0;
		kaja=0;
		gyumi_timer=0;
		for(int j=0;j<=mapHeight;j++){
			for(int i=0;i<=mapWidth;i++){
				mapij[i][j]=(map[j+palya*(mapHeight+1)].substring(i,i+1));//felt�lti a p�lya t�mb�t
				if(mapij[i][j].equals("2")){
					x_pos=i;
					y_pos=j;
					mapij[i][j]=" ";	//kit�rli az emberk�met
				}
				if(mapij[i][j].equals("3")){
					enemy_x[szornyek]=i;
					enemy_y[szornyek]=j;
					mapij[i][j]=".";	//kit�rli a sz�rnyeket
					szornyek++;
				}
				if(mapij[i][j].equals(".")){kaja++;}
			}
		}
		for(int i=0;i<szornyek;i++){
			if(palya%2==0)enemy_face[i]=8+i%2;else enemy_face[i]=18+i%2;//p�ros p�ly�nk�nt m�s a sz�rny
		}
		gamestate=4;
	}
	public void ujpalya(){//gamestate=4
		if((pressedkey==5)||(palya==0))gamestate=5;
	}
	public void gratulalok(){
		if(pressedkey==5){
			pressedkey=0;
			gamestate=1;//f�c�m
		}
	}
	public void focim_inic(){//gamestate=1
		elet=3;
		pont=0;
		szornyek=0;
		kaja=0;
		gamestate=2;
		for(int j=0;j<=mapHeight;j++){
			for(int i=0;i<=mapWidth;i++){
				mapij[i][j]=(map[j+palya*(mapHeight+1)].substring(i,i+1));
				if(mapij[i][j].equals("2")){
					x_pos=i;
					y_pos=j;
					mapij[i][j]=" ";
				}
				if(mapij[i][j].equals("3")){
					enemy_x[szornyek]=i;
					enemy_y[szornyek]=j;
					mapij[i][j]=".";
					szornyek++;
				}
				if(mapij[i][j].equals(".")){kaja++;}
			}
		}
		gyors=seb_normal;
		enemy_gyors=enemy_seb_normal;
		hatas_timer=0;
		enemy_hatas_timer=0;
		gyumi_timer=0;
		for(int i=0;i<szornyek;i++){
			if((i%2)==0)enemy_face[i]=8;else enemy_face[i]=9;
		}
	}
	public void focim(){//2
		if(pressedkey==5){
			gamestate=3;//ujpalya_inic
			palya=0;
		}
	}
	public void run ()
	{
		// Erniedrigen der ThreadPriority um zeichnen zu erleichtern
		Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
		// F�ciklus
		while (true)
		{
			switch(gamestate){
				case 1:focim_inic();break;
				case 2:focim();break;
				case 3:ujpalya_inic();break;
				case 4:ujpalya();break;
				case 5:jatek();break;
				case 6:megegyszer_inic();break;
				case 7:megegyszer();break;
				case 8:jatekvege();break;
				case 9:gratulalok();break;
			}
			utem++;if(utem>=255)utem=0;
			repaint();// �jra rajzolja az appletet
		try
		{
			//id�z�t�s
			Thread.sleep (20);
		}
		catch (InterruptedException ex)
		{
			// semmit nem csin�l
		}
			// Vissza�ll�tja a sz�l fut�s�t maxim�lis �rt�kre
		Thread.currentThread().setPriority(Thread.MAX_PRIORITY);
		}
	}
	/** Update - Met�dus, A dupplabufferel�st val�s�tja meg, hogy elker�lj�k a k�perny� vibr�l�s�t. */
	public void update (Graphics g)
	{
		//Inicializ�lja a duplabuffert
		if (dbImage == null)
		{
			dbImage = createImage (this.getSize().width, this.getSize().height);
			dbg = dbImage.getGraphics ();
		}
		// Let�rli a k�perny�t
		dbg.setColor (getBackground ());
		dbg.fillRect (0, 0, this.getSize().width, this.getSize().height);

		// A let�r�lt h�tteret el�re helyezi
		dbg.setColor (getForeground());
		paint (dbg);

		// Nun fertig gezeichnetes Bild Offscreen auf dem richtigen Bildschirm anzeigen
		g.drawImage (dbImage, 0, 0, this);
	}
	public void paint (Graphics g)
	{
		g.setColor  (Color.white);//Pontsz�m sz�ne
		for(int j=0;j<=mapHeight;j++){//P�lya kirajzol�sa
			for(int i=0;i<=mapWidth;i++){
				if(mapij[i][j].equals("1"))	sprite(g,palya%4,i*tile,j*tile);
				if(mapij[i][j].equals(".")) sprite(g,10,i*tile,j*tile);
			}
		}
		sprite(g,face,x_pos*tile,y_pos*tile);//J�t�kos kirajzol�sa
		for(int i=0;i<szornyek;i++){//Sz�rnyek kirajzol�sa
			sprite(g,enemy_face[i],enemy_x[i]*tile,enemy_y[i]*tile);
		}
		if(gyumi_timer>0){
			sprite(g,gyumi_micsoda+11,gyumi_x*tile,gyumi_y*tile);
		}
		if(gamestate==2){//F�c�m kirajzol�sa
			//ZAB�L� felirat
			g.setClip((appletsize_x-300)/2,150,300,66);
			g.drawImage(elemek,(appletsize_x-300)/2,150-20,this);
			//K�sz�tette...
			g.setClip((appletsize_x-200)/2,220,240,12);
			g.drawImage(elemek,(appletsize_x-200)/2,220-88,this);
			//Ismertet�
			if((utem%4>1&&utem>80)||((utem>100)&&(utem<224))){
				g.setClip(290,260,164,113);
				g.drawImage(elemek,290-207,260-182,this);
				for(int i=0;i<6;i++)
					sprite(g,11+i,260,253+i*20);
			}
		}
		if((gamestate==2)||(gamestate==4)||(gamestate==7)||(gamestate==8)||(gamestate==9)){
			//Kezd�shez...
			if(utem%32>12){
				g.setClip((appletsize_x-257)/2,appletsize_y-20-20,257,20);
				g.drawImage(elemek,(appletsize_x-257)/2,appletsize_y-20-20-100,this);
			}
		}
		if((gamestate==4)&&(palya>0)){//K�vetkez� p�lya felirat
			g.setClip((appletsize_x-300)/2,(appletsize_y-29)/2,300,29);
			g.drawImage(elemek,(appletsize_x-300)/2,(appletsize_y-29)/2-121,this);
		}
		if((gamestate==5)||(gamestate==7)||(gamestate==8)||(gamestate==9)){//j�t�k
			g.setClip(10,10,120,17);//Pont
			g.drawImage(elemek,10-345,10-90,this);
			for(int i=1;i<=elet;i++)//�letek
				sprite(g,17,appletsize_x+(i-elet-1)*26,0);
			g.setClip(0,0,appletsize_x,appletsize_y);
			g.drawString(""+pont,10+65,10+17);//Pontsz�m
		}
		if(gamestate==8){//J�t�k v�ge felirat
			g.setClip((appletsize_x-198)/2,(appletsize_y-29)/2,198,29);
			g.drawImage(elemek,(appletsize_x-198)/2-209,(appletsize_y-29)/2-151,this);
		}
		if(gamestate==9){//Gratul�ci� felirat
			g.setClip((appletsize_x-205)/2,(appletsize_y-83)/2,205,83);
			g.drawImage(elemek,(appletsize_x-205)/2,(appletsize_y-83)/2-152,this);
		}
		g.setClip(0,0,appletsize_x,appletsize_y);//kell ez?
	}
	public void sprite(Graphics g,int n,int x,int y){
		g.setClip(x,y,tile,tile);
		g.drawImage(elemek,x-tile*n,y,this);
	}
	public void animation(){
		switch (face){
			case 4:face=5;break;
			case 5:face=4;break;
			case 6:face=7;break;
			case 7:face=6;break;
		}
	}
	public void animation_enemy(int i){
		switch (enemy_face[i]){
			case 9:enemy_face[i]=8;break;
			case 8:enemy_face[i]=9;break;
			case 19:enemy_face[i]=18;break;
			case 18:enemy_face[i]=19;break;
		}
	}
}
