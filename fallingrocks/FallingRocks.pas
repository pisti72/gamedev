program FallingRocks;
//Development period: 2010-07-24 - 2010-08-06
//Developer: István Szalontai
const
	CHEAT=0;
		
	GAMELOOP=0;
	MENULOOP=1;
	REALLYQUIT=2;
	GAMEOVER=3;
	SPLASH1=4;
	LEVELEND=5;
	GETREADY=6;
	STARTGAME=7;
	NEXTLEVEL=8;
	RESTARTLEVEL=9;
	DEADMAN=10;
	OUTOFTIME=11;
	SELECTLEVEL=12;
	QUITTER=13;
	CONGRATULATION=14;
	RESTARTHERO=15;
	
	MAPMAXWIDTH=128;
	MAPMAXHEIGHT=128;
	TILEMODE=32;
	CHARWIDTH=16;
	MARGIN=48;
	SPEED=6;
	SOFTKEYLEFT=6;
	SOFTKEYRIGHT=7;
var
	herospt:char;
	colblock,colsoil,colbrick:integer;
	offsetx,offsety:integer;
	mapwidth,mapheight,tilewidth:integer;
	res:resource;
	line,variable:string;
	imgchar,imgtile16,imgtile32,imgtitle,imgbg:image;
	exitx,exity,exit,state,rockall:integer;
	deadcounter:integer;
	level,leveldone,maxlevel:integer;
	levelorder:array[1..100]of integer;
	targetx,targety:integer;
	herox,heroy,heroxstored,heroystored,gold,goldall,goldneed:integer;
	time,timeall,lives,counter,flash,flashoff, shake:integer;
	map:array[1..MAPMAXWIDTH,1..MAPMAXHEIGHT]of char;
	map2:array[1..MAPMAXWIDTH,1..MAPMAXHEIGHT]of char;
	mapd:array[1..MAPMAXWIDTH,1..MAPMAXHEIGHT]of char;
	mapo:array[1..MAPMAXWIDTH,1..MAPMAXHEIGHT]of char;
//--------------------------
procedure loadMaxlevel;
	begin
		res:=OpenResource('levels.txt');
		if ResourceAvailable(res) then
			begin
				maxlevel:=0;
				repeat
					line:=ReadLine(res);
					if line<>'eof' then
						begin
							maxlevel:=maxlevel+1;
							levelorder[maxlevel]:=StringToInteger(line);
						end;
				until line='eof';
			end;//endif
		CloseResource(res);
	end;
//--------------------------
procedure loadLeveldone;
	var
		rs:RecordStore;
		nextId:integer;
		index:integer;
	begin
		rs:=OpenRecordStore('LevelDone');
		nextId:=GetRecordStoreNextId(rs);
		if nextId=1 then
			index:=AddRecordStoreEntry(rs,'1');
		leveldone:=StringToInteger(ReadRecordStoreEntry(rs,1));
		CloseRecordStore(rs);
	end;
//--------------------------
procedure saveLeveldone;
	var
		rs:RecordStore;
		nextId:integer;
		index:integer;
	begin
		rs:=OpenRecordStore('LevelDone');
		ModifyRecordStoreEntry(rs,IntegerToString(leveldone),1);
		CloseRecordStore(rs);
	end;
//--------------------------
procedure loadMap(filename:string);
	var
		i,j:integer;
	begin
		res:=OpenResource(filename);
		if ResourceAvailable(res) then
			begin
				j:=1;
				goldall:=0;
				rockall:=0;
				variable:=ReadLine(res);
				if Random(2)=0 then variable:='N';
				goldneed:=StringToInteger(ReadLine(res));
				timeall:=StringToInteger(ReadLine(res));
				colblock:=StringToInteger(ReadLine(res));//block
				colsoil:=StringToInteger(ReadLine(res));//soil
				colbrick:=StringToInteger(ReadLine(res));//brick
				repeat
					line:=ReadLine(res);
					if line<>'eof' then
						begin
							mapwidth:=length(line);
							for i:=1 to mapwidth do
								begin
									map[i,j]:=GetChar(line,i-1);
									if map[i,j]='L' then
										begin
											exitx:=i;
											exity:=j;
										end;
									if map[i,j]='e' then goldall:=goldall+1;
									if map[i,j]='o' then rockall:=rockall+1;
								end;
							j:=j+1;
						end;
				until line='eof';
				mapheight:=j-1;
				CloseResource(res);
			end;
	end;
//--------------------------
procedure randomMap;
	var
		i,j,x,y:integer;
	begin
		if variable='V' then
			begin
				//kitöröljük a követ és a kincset
				for j:=1 to mapheight do
					for i:=1 to mapwidth do
						if (map[i,j]='o') or (map[i,j]='e') then map[i,j]:='.';
				//berajzoljuk a követ
				for i:=1 to rockall do
					begin
						repeat
							x:=Random(mapwidth)+1;
							y:=Random(mapheight)+1;
						until map[x,y]='.';
						map[x,y]:='o';
					end;
				//berajzoljuk a kincset
				for i:=1 to goldall do
					begin
						repeat
							x:=Random(mapwidth)+1;
							y:=Random(mapheight)+1;
						until map[x,y]='.';
						map[x,y]:='e';
					end;
			end;//endif
	end;
//--------------------------
procedure storeMap;
	var
		i,j:integer;
	begin
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				mapo[i,j]:=map[i,j];
	end;
//--------------------------
procedure restoreMap;
	var
		i,j:integer;
	begin
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				begin
					map[i,j]:=mapo[i,j];
					mapd[i,j]:='0';
					if map[i,j]='i' then
						begin
							herox:=i;
							heroy:=j;
							heroxstored:=i;
							heroystored:=j;
							targetx:=i;
							targety:=j;
						end;
				end;
		time:=timeall;
	end;
//--------------------------
procedure loadImages;
	begin
		imgtile16:=LoadImage('/tiles16.png');
		imgtile32:=LoadImage('/tiles32.png');
		imgchar:=LoadImage('/charset.png');
		if GetWidth>200 then imgtitle:=LoadImage('/title240.png');
			else imgtitle:=LoadImage('/title176.png');
		imgbg:=LoadImage('/bg.png');
	end;
//--------------------------
procedure SetColor2(c:integer);//block,soil brick
	begin
		if c=0 then SetColor(0,0,0);//black
		if c=1 then SetColor(0,0,208);//blue
		if c=2 then SetColor(208,0,0);//red
		if c=3 then SetColor(208,0,208);//magenta
		if c=4 then SetColor(0,208,0);//green
		if c=5 then SetColor(0,208,208);//cyan
		if c=6 then SetColor(208,208,0);//yellow
		if c=7 then SetColor(208,208,208);//white
		if c=8 then SetColor(208,104,104);//pink
		if c=9 then SetColor(208,104,0);//lightbrown
		if c=10 then SetColor(208,0,104);//lightmagenta
		if c=11 then SetColor(104,104,104);//grey
		if c=12 then SetColor(156,156,156);//lightgrey
	end;
//--------------------------
procedure drawTile(t,x,y:integer);
	begin
		SetClip(x,y,tilewidth,tilewidth);
		FillRect(x,y,tilewidth,tilewidth);
		if tilewidth=16 then drawImage(imgtile16,x-t*tilewidth,y);
		if tilewidth=32 then drawImage(imgtile32,x-t*tilewidth,y);
	end;
//--------------------------
procedure drawChar(t,x,y:integer);
	begin
		SetClip(x,y,CHARWIDTH,CHARWIDTH);
		drawImage(imgchar,x-t*CHARWIDTH,y);
	end;
//--------------------------
procedure drawNumber(n,x,y:integer);
	begin
		if (n>=0) and (n<10) then	drawChar(n mod 10,x,y);
		if (n>9) and (n<100) then
			begin
				drawChar(n/10,x,y);
				n:=n-n/10*10;
				drawChar(n,x+16,y);
			end;
		if (n>99) and (n<1000) then
			begin
				drawChar(n/100,x,y);
				n:=n-n/100*100;
				drawChar(n/10,x+16,y);
				n:=n-n/10*10;
				drawChar(n,x+32,y);
			end;
	end;
//--------------------------
procedure drawGold(gold:integer);
	var
		offset:integer;
	begin
		offset:=0;
		drawChar(12,2,2);
		drawChar(10,18,2);
		drawNumber(gold,28,2);
		if gold>9 then offset:=16;
		if gold>99 then offset:=32;
		drawChar(11,44+offset,2);
		drawNumber(goldneed,60+offset,2);
	end;
//--------------------------
procedure drawTime(t:integer);
	begin
		drawChar(13,2,18);
		drawChar(10,18,18);
		drawNumber(t,28,18);
	end;
//--------------------------
procedure drawLife(l:integer);
	begin
		drawChar(14,2,34);
		drawChar(10,18,34);
		drawNumber(lives,28,34);
	end;
//--------------------------
procedure drawMap;
	var
		i,j,spt,col:integer;
		i0,i1,j0,j1:integer;
		ch:char;
	begin
		i0:=-offsetx/TILEWIDTH+1;
		if i0<1 then i0:=1;
		i1:=i0+GetWidth/TILEWIDTH+1;
		if i1>mapwidth then i1:=mapwidth;
		j0:=-offsety/TILEWIDTH+1;
		if j0<1 then j0:=1;
		j1:=j0+GetHeight/TILEWIDTH+1;
		if j1>mapheight then j1:=mapheight;
		counter:=counter+1;
		if counter>=1024 then counter:=0;
		flash:=flash-1;
		if flash<0 then flash:=0;
		deadcounter:=deadcounter-1;
		if deadcounter<0 then deadcounter:=0;
		//SetColor2(flash);
		//SetClip(0,0,GetWidth,GetHeight);
		//fillRect(0,0,GetWidth,GetHeight);
		for j:=j0 to j1 do
			for i:=i0 to i1 do
				begin
					ch:=map[i,j];
					if ch='M' then begin spt:=0; col:=colblock; end;//block
					if ch='k' then begin spt:=1; col:=colbrick; end;//tégla
					if ch='o' then begin spt:=2; col:=colblock; end;//kő
					if ch='.' then begin spt:=3; col:=colsoil; end;//föld
					if ch='e' then begin spt:=4+(counter mod 9)/3; col:=7; end;//kincs
					if ch=' ' then begin spt:=8; col:=flash; end;//semmi
					if ch='i' then 
						begin
							col:=7;
							spt:=9;
							if (state=GETREADY) and (counter mod 8 < 4) then//induláskor villog a manus
								begin
									col:=0;
									spt:=8;
								end;
						end;//ember
					if ch='h' then begin spt:=10+(counter mod 9)/3; col:=7; end;//emberbal
					if ch='j' then begin spt:=13+(counter mod 9)/3; col:=7; end;//emberjobb
					if (ch='d') and (deadcounter<30) then spt:=19;//ember halott 1
					if (ch='d') and (deadcounter<24) then spt:=20;//ember halott 2
					if (ch='d') and (deadcounter<20) then spt:=21;//ember halott 3
					if (ch='d') and (deadcounter<16) then begin spt:=8; col:=0; end;//ember halott 4
					if ch='v' then begin spt:=16+(counter mod 9)/3; col:=6; end;//szörny
					if ch='L' then
						if exit=0 then begin	spt:=0; col:=colblock; end;//kijarat
							else begin	spt:=(counter mod 8)/4*7; col:=colblock; end;//ki lehet menni
					//if ch<>' ' then
						begin
							SetColor2(col);	
							drawTile(spt,(i-1)*tilewidth+offsetx,(j-1)*tilewidth+offsety);
						end;
				end;
	end;
//--------------------------
procedure inic;
	begin
		exit:=0;
		tilewidth:=32;
		loadMaxlevel;
		loadLeveldone;
		if CHEAT>0 then leveldone:=maxlevel;
		//leveldone:=6;
		state:=MENULOOP;
		level:=1;
		//level:=Random(4)+1;//Random is lehetne
		loadMap('/map'+levelorder[level]+'.txt');
		randomMap;
		storeMap;
		loadImages;
	end;
//--------------------------
procedure procstartgame;
	begin
		flashoff:=0;
		exit:=0;
		gold:=0;
		loadMap('/map'+levelorder[level]+'.txt');
		randomMap;
		storeMap;
		restoreMap;
		lives:=3;
		state:=GETREADY;
	end;
//--------------------------
procedure procnextlevel;
	begin
		level:=level+1;
		if level>leveldone then
			begin
				leveldone:=level;
				saveLeveldone;
			end;
		lives:=lives+1;
		flashoff:=0;
		exit:=0;
		gold:=0;
		loadMap('/map'+levelorder[level]+'.txt');
		randomMap;
		storeMap;
		restoreMap;
		offsetx:=-herox*TILEWIDTH;
		offsety:=-heroy*TILEWIDTH;
		state:=GETREADY;
	end;
//--------------------------
procedure procrestartlevel;
	begin
		exit:=0;
		gold:=0;
		flashoff:=0;
		restoreMap;
		lives:=lives-1;
		if lives=0 then state:=GAMEOVER else state:=GETREADY;
	end;
//--------------------------
procedure procrestarthero;
	begin
		herox:=heroxstored;
		heroy:=heroystored;
		targetx:=herox;
		targety:=heroy;
		map[herox,heroy]:='i';
		lives:=lives-1;
		if lives=0 then state:=GAMEOVER else state:=GETREADY;
	end;
//--------------------------
procedure killMonster;
	var
		i,j,i2,j2:integer;
	begin
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				begin
					if map[i,j]='v' then
						if mapd[i,j-1]='2' then
						begin
							for j2:=j-1 to j+1 do
								for i2:=i-1 to i+1 do
									if map[i2,j2]<>'M' then
										begin map[i2,j2]:='e'; mapd[i2,j2]:='0'; end;
						end;//endif
				end;//endfor
	end;
//--------------------------
procedure procdeadman;
	var
		i,j:integer;
	begin
		for j:=heroy-1 to heroy+1 do
			for i:=herox-1 to herox+1 do
				if map[i,j]<>'M' then map[i,j]:='d';
		if deadcounter=0 then deadcounter:=30;
		if deadcounter=1 then
			begin
				for j:=heroy-1 to heroy+1 do
					for i:=herox-1 to herox+1 do
						if map[i,j]<>'M' then begin map[i,j]:=' '; mapd[i,j]:='0'; end;
				state:=RESTARTHERO;
			end;
	end;
//--------------------------
procedure follow1;
	begin
		if herox*TILEWIDTH+offsetx>GetWidth-MARGIN then offsetx:=offsetx-SPEED;
		if herox*TILEWIDTH+offsetx<MARGIN+TILEWIDTH then offsetx:=offsetx+SPEED;
		if heroy*TILEWIDTH+offsety>GetHeight-MARGIN then offsety:=offsety-SPEED;
		if heroy*TILEWIDTH+offsety<MARGIN+TILEWIDTH then offsety:=offsety+SPEED;
		if offsetx>0 then offsetx:=0;
		if offsety>0 then offsety:=0;
		if offsetx<-TILEWIDTH*mapwidth+GetWidth then offsetx:=-TILEWIDTH*mapwidth+GetWidth;
		if offsety<-TILEWIDTH*mapheight+GetHeight then offsety:=-TILEWIDTH*mapheight+GetHeight;
	end;
//--------------------------
procedure follow2;
	begin
		if targetx*tilewidth-tilewidth/2+offsetx>GetWidth/2+SPEED then offsetx:=offsetx-SPEED;
		if targetx*tilewidth-tilewidth/2+offsetx<GetWidth/2-SPEED then offsetx:=offsetx+SPEED;
		if targety*tilewidth-tilewidth/2+offsety>GetHeight/2+SPEED then offsety:=offsety-SPEED;
		if targety*tilewidth-tilewidth/2+offsety<GetHeight/2-SPEED then offsety:=offsety+SPEED;
		if offsetx>0 then offsetx:=0;
		if offsety>0 then offsety:=0;
		if offsetx<-tilewidth*mapwidth+GetWidth then offsetx:=-tilewidth*mapwidth+GetWidth;
		if offsety<-tilewidth*mapheight+GetHeight then offsety:=-tilewidth*mapheight+GetHeight;
	end;
//--------------------------
procedure follow3;
	begin
		offsetx:=tilewidth/2+GetWidth/2-tilewidth*herox;
		offsety:=tilewidth/2+GetHeight/2-tilewidth*heroy;
		if offsetx>0 then offsetx:=0;
		if offsety>0 then offsety:=0;
		if offsetx<-tilewidth*mapwidth+GetWidth then offsetx:=-tilewidth*mapwidth+GetWidth;
		if offsety<-tilewidth*mapheight+GetHeight then offsety:=-tilewidth*mapheight+GetHeight;
	end;
//--------------------------
procedure gravity;//sokkal egyszerűbb lesz
	var
		ch:char;
		i,j,k:integer;
	begin
	//lemásoljuk
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
					map2[i,j]:=map[i,j];//jövő=múlt
	//dolgozunk vele
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				begin
					ch:=map[i,j];
					if (ch='o') or (ch='e') then//ha zuhanós cuccot találunk
						begin
							k:=0;//tegyük fel, hogy nem mozdul
							//ha van alatta üres
							if map[i,j+1]=' ' then
								begin
									map2[i,j]:=' ';
									map2[i,j+1]:=map[i,j];
									mapd[i,j]:='0';
									mapd[i,j+1]:='1';//ez mozgásban van
									k:=1;//mozdult
								end;
							//vagy van alatta kő
							if (map[i,j+1]='o') or (map[i,j+1]='e') or (map[i,j+1]='k') then
								//és balra mellette és alatta üres
								if (map[i-1,j+1]=' ') and (map[i-1,j]=' ') and (map2[i-1,j]=' ') then
									begin
										map2[i,j]:=' ';
										map2[i-1,j]:=map[i,j];//balra beteszi a követ vagy a gyémántot
										mapd[i,j]:='0';
										mapd[i-1,j]:='1';//ez mozgásban van
										k:=1;//mozdult
									end;
								//vagy jobbra mellette és alatta üres
								else if (map[i+1,j+1]=' ') and (map[i+1,j]=' ') and (map2[i+1,j]=' ') then
									begin
										map2[i,j]:=' ';
										map2[i+1,j]:=map[i,j];//jobbra beteszi a követ vagy a gyémántot
										mapd[i+1,j]:='1';//ez mozgásban van
										k:=1;//mozdult
									end;
								//megállt a mozgásból?
								if (k=0) then
									if (mapd[i,j]='1') then 
										begin
											mapd[i,j]:='2';
											shake:=16;//rázkódás
										end else mapd[i,j]:='0';
						end;
				end;
	// visszamásoljuk
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				map[i,j]:=map2[i,j];
	end;
//--------------------------
procedure heroMonsters;
	var
		i,j,done:integer;
		ch:char;
	begin
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				begin
					if map[i,j]='v' then
						begin
							ch:=mapd[i,j];
							done:=0;
							if (ch='4') and (i+1=herox) and (j=heroy) then done:=1;
							if (ch='5') and (i=herox) and (j-1=heroy) then done:=1;
							if (ch='6') and (i-1=herox) and (j=heroy) then done:=1;
							if (ch='7') and (i=herox) and (j+1=heroy) then done:=1;
							if (ch='4') and (i=herox) and (j-1=heroy) then done:=1;
							if (ch='5') and (i-1=herox) and (j=heroy) then done:=1;
							if (ch='6') and (i=herox) and (j+1=heroy) then done:=1;
							if (ch='7') and (i+1=herox) and (j=heroy) then done:=1;
							if done=1 then state:=DEADMAN;
						end;
				end;
	end;
//--------------------------
procedure moveMonsters;
	var
		i,j,done:integer;
		ch:char;
	begin
		//lemásoljuk
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				map2[i,j]:=map[i,j];//jövő=múlt
					
		//dolgozunk vele
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				begin
					ch:=map[i,j];
					if ch='v' then
						begin
							if mapd[i,j]='0' then mapd[i,j]:='4';//kezdeti mozgás
							done:=0;
							if mapd[i,j]='4' then//jobbra menős
								if (map[i,j-1]=' ') and (map2[i,j-1]=' ') then//felülre vizsgál
									begin
										map2[i,j]:=' ';
										map2[i,j-1]:='v';
										mapd[i,j]:='0';//sikerült felülre menni
										mapd[i,j-1]:='5';//felülre menős
										done:=1;
									end
							else if (map[i+1,j]=' ') and (map2[i+1,j]=' ') then//jobbra vizsgál
									begin
										map2[i,j]:=' ';
										map2[i+1,j]:='v';
										mapd[i,j]:='0';//sikerült jobbra menni
										mapd[i+1,j]:='4';
										done:=1;
									end else begin mapd[i,j]:='7'; done:=1; end;//akkor viszont lefelé

						if (mapd[i,j]='5') and (done=0) then//felülre menős
								if (map[i-1,j]=' ') and (map2[i-1,j]=' ') then//balra vizsgál
									begin
										map2[i,j]:=' ';
										map2[i-1,j]:='v';
										mapd[i,j]:='0';//sikerült balra menni
										mapd[i-1,j]:='6';//balra menős
										done:=1;
									end
							else if (map[i,j-1]=' ') and (map2[i,j-1]=' ') then//felülre vizsgál
									begin
										map2[i,j]:=' ';
										map2[i,j-1]:='v';
										mapd[i,j]:='0';//sikerült felülre menni
										mapd[i,j-1]:='5';
										done:=1;
									end else begin mapd[i,j]:='4'; done:=1; end;//akkor viszont jobbra

						if (mapd[i,j]='6') and (done=0) then//balra menős
								if (map[i,j+1]=' ') and (map2[i,j+1]=' ') then//lefelé vizsgál
									begin
										map2[i,j]:=' ';
										map2[i,j+1]:='v';
										mapd[i,j]:='0';//sikerült lefelé menni
										mapd[i,j+1]:='7';//lefelé menős
										done:=1;
									end
							else if (map[i-1,j]=' ') and (map2[i-1,j]=' ') then//balra vizsgál
									begin
										map2[i,j]:=' ';
										map2[i-1,j]:='v';
										mapd[i,j]:='0';//sikerült felülre menni
										mapd[i-1,j]:='6';
										done:=1;
									end else begin mapd[i,j]:='5'; done:=1; end;//akkor viszont felfelé

						if (mapd[i,j]='7') and (done=0) then//lefelé menős
								if (map[i+1,j]=' ') and (map2[i+1,j]=' ') then//jobbra vizsgál
									begin
										map2[i,j]:=' ';
										map2[i+1,j]:='v';
										mapd[i,j]:='0';//sikerült jobbra menni
										mapd[i+1,j]:='4';//jobbra menős
										done:=1;
									end
							else if (map[i,j+1]=' ') and (map2[i,j+1]=' ') then//lefelé vizsgál
									begin
										map2[i,j]:=' ';
										map2[i,j+1]:='v';
										mapd[i,j]:='0';//sikerült lefelé menni
										mapd[i,j+1]:='7';
										done:=1;
									end else begin mapd[i,j]:='6'; done:=1; end;//akkor viszont balra

						end;//endif
				end;//end for
		// visszamásoljuk
		for j:=1 to mapheight do
			for i:=1 to mapwidth do
				map[i,j]:=map2[i,j];
	end;
//--------------------------
procedure shaker;
	begin
		shake:=shake-1;
		if shake<0 then shake:=0;
		offsety:=offsety+(shake mod 4)*shake/4;
	end;
//--------------------------
procedure drawLeftSoft;
	begin
		drawChar(15,2,GetHeight-CHARWIDTH-2);
	end;
//--------------------------
procedure drawRightSoft;
	begin
		drawChar(16,GetWidth-CHARWIDTH-2,GetHeight-CHARWIDTH-2);
	end;
//--------------------------
procedure drawLupe;
	begin
		drawChar(20,2,GetHeight-CHARWIDTH-2);
	end;
//--------------------------
procedure drawTitle;
	var
		x,y,w,h,i,j:integer;
	begin
		w:=GetImageWidth(imgtitle);
		h:=GetImageHeight(imgtitle);
		x:=(GetWidth-w)/2;
		y:=(GetHeight-h)/2;
		if GetWidth>200 then SetClip(x,y,w,100);
			else SetClip(x,y,w,66);
		for j:=0 to h/CHARWIDTH do
			for i:=0 to w/CHARWIDTH do
				drawImage(imgbg,x+i*CHARWIDTH,y+j*CHARWIDTH-counter mod 8);
		SetClip(x,y,w,h);
		drawImage(imgtitle,x,y);
	end;
//--------------------------
procedure drawText(c:string;x,y:integer);
	var
		i,ch:integer;
	begin
		i:=0;
		repeat
			ch:=Ord(GetChar(c,i));
			if ch<>32 then drawChar(ch-43,x,y);
			x:=x+CHARWIDTH;
			i:=i+1;
		until i=Length(c);
	end;
//--------------------------
procedure drawTextM(c:string;y:integer);
	var
		i,ch,x:integer;
	begin
		x:=(GetWidth-Length(c)*CHARWIDTH)/2;
		drawText(c,x,y);
	end;
//--------------------------
procedure drawLevel;
	begin
		drawTextM('CAVE',GetHeight/2-2*CHARWIDTH);
		if level<10 then	drawNumber(level,(GetWidth-CHARWIDTH)/2, GetHeight/2-CHARWIDTH);
		if level>9 then drawNumber(level,(GetWidth-CHARWIDTH*2)/2, GetHeight/2-CHARWIDTH);
	end;
//--------------------------
procedure drawSelectLevel;
	begin
		drawTextM('SELECT',GetHeight/2-3*CHARWIDTH);
		if level>1 then	drawChar(17,GetWidth/2-3*CHARWIDTH,GetHeight/2-CHARWIDTH);
		if level<maxlevel then drawChar(18,GetWidth/2+2*CHARWIDTH,GetHeight/2-CHARWIDTH);
		drawLevel;
		if (level>leveldone) and (counter mod 8 < 6) then drawChar(19,(GetWidth-CHARWIDTH)/2,GetHeight/2);
	end;
//--------------------------
procedure game;
	var
		ch:char;
		key,keya,keyc,keyca:integer;
		xd,yd,d:integer;
		bgxd,bgyd:integer;
	begin
		d:=0;
		repeat
			if state=STARTGAME then procstartgame;
			if state=RESTARTLEVEL then procrestartlevel;
			if state=RESTARTHERO then procrestarthero;
			if state=NEXTLEVEL then procnextlevel;
			if state=DEADMAN then procdeadman;
			key:=GetKeyPressed;
			keya:=KeyToAction(key);
			keyc:=GetKeyClicked;
			keyca:=KeyToAction(keyc);
			//if (state=REALLYQUIT) and (keyc=-SOFTKEYRIGHT) then state:=MENULOOP;
			//if (state=REALLYQUIT) and (keyc=-SOFTKEYLEFT) then stop:=1;
			//if (state=MENULOOP) and (keyc=-SOFTKEYRIGHT) then state:=REALLYQUIT;
			if (state=MENULOOP) and (keyc=-SOFTKEYRIGHT) then state:=QUITTER;
			//lupe
			if (state=GAMELOOP) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then
				begin
					if tilewidth=32 then
						begin
							tilewidth:=16;
							follow3;
						end
						else if tilewidth=16 then
							begin
								tilewidth:=32;
								follow3;
							end;
				end;
			if (state=GETREADY) and (keyc=-SOFTKEYRIGHT) then state:=MENULOOP;
			if (state=GETREADY) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then state:=GAMELOOP;
			if (state=SELECTLEVEL) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE))
				and (level<=leveldone) then state:=STARTGAME;
			if (state=MENULOOP) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then state:=SELECTLEVEL;
			if (state=SELECTLEVEL) and (keyc=-SOFTKEYRIGHT) then state:=MENULOOP;
			if (state=GAMELOOP) and (keyc=-SOFTKEYRIGHT) then state:=RESTARTLEVEL;
			if (state=CONGRATULATION) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then state:=MENULOOP;
			if (state=GAMEOVER) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then state:=MENULOOP;
			if (state=OUTOFTIME) and ((keyc=-SOFTKEYLEFT) or (keyca=GA_FIRE)) then state:=RESTARTLEVEL;
			
			//player control
			if (counter mod 4=0) and (state=GAMELOOP) then
				begin	
					gravity;
					moveMonsters;
					heroMonsters;
					killMonster;
					if counter mod 32=0 then
						begin
							time:=time-1;
							if time<0 then time:=0;
						end;
					if keya=GA_RIGHT then begin xd:=1; d:=0; end;
					if keya=GA_LEFT then begin xd:=-1; d:=1; end;
					if keya=GA_DOWN then yd:=1;
					if keya=GA_UP then yd:=-1;
					herospt:='i';
					if yd<>0 then 
							if d=0 then herospt:='j' else herospt:='h';
					if xd=1 then herospt:='j';
					if xd=-1 then herospt:='h';
					map[herox,heroy]:=' ';
					ch:=map[herox+xd,heroy+yd];
					//csak ekkorf tudunk előre menni
					if (ch=' ') or (ch='.') or (ch='e')
						or (ch='v') or ((ch='L') and (exit=1)) then
						begin
							if (ch='e') then gold:=gold+1;
							if (ch='v') then state:=DEADMAN;
							herox:=herox+xd;
							heroy:=heroy+yd;
						end;
					//tud követ tolni
					else if xd<>0 then
						if (map[herox+xd,heroy]='o') then
							if (map[herox+xd+xd,heroy]=' ') and (Random(2)=1) then
								begin
									map[herox+xd+xd,heroy]:='o';
									herox:=herox+xd;
									heroy:=heroy+yd;
								end;
					map[herox,heroy]:=herospt;
					targetx:=herox+3*xd;
					targety:=heroy+3*yd;
					xd:=0;
					yd:=0;
					if gold>=goldneed then exit:=1;
					if (flashoff=0) and (exit=1) then begin flash:=8; flashoff:=1; end;
					if (herox=exitx) and (heroy=exity) and (level<maxlevel) then state:=NEXTLEVEL;
					if (herox=exitx) and (heroy=exity) and (level=maxlevel) then state:=CONGRATULATION;
					if mapd[herox,heroy-1]='2' then state:=DEADMAN;//ráesett valami 
					if time=0 then state:=OUTOFTIME;
				end;//state=GAMELOOP
			if (state=SELECTLEVEL) and (counter mod 4=0) then
				begin
					if keya=GA_RIGHT then level:=level+1;
					if keya=GA_LEFT then level:=level-1;
					if level<1 then level:=1;
					if level>MAXLEVEL then level:=MAXLEVEL;
				end;//endif
			//smooth scroll
			if (state=MENULOOP) or  (state=SELECTLEVEL) then
				begin
					if bgxd=0 then bgxd:=-2;
					if bgyd=0 then bgyd:=-1;
					offsetx:=offsetx+bgxd;
					if (offsetx>0) or (offsetx<-TILEWIDTH*mapwidth+GetWidth) then bgxd:=-bgxd;
					offsety:=offsety-bgyd;
					if (offsety>0) or (offsety<-TILEWIDTH*mapheight+GetHeight) then bgyd:=-bgyd;
				end else follow2;
			shaker;
			drawMap;
			if (state=GAMELOOP) or (state=GETREADY)
				or (state=DEADMAN) or (state=OUTOFTIME) then
				begin
					drawGold(gold);
					drawTime(time);
					drawLife(lives);
				end;
			if state=GAMELOOP then drawLupe;
			if (state=MENULOOP) or (state=GETREADY) or (state=GAMEOVER)
				or (state=OUTOFTIME) or (state=REALLYQUIT) or (state=CONGRATULATION)
				or ((state=SELECTLEVEL) and (level<=leveldone)) then drawLeftSoft;
			if (state=MENULOOP) or (state=GAMELOOP) or (state=GETREADY)
				or (state=REALLYQUIT) or (state=SELECTLEVEL) then drawRightSoft;
			if state=MENULOOP then drawTitle;
			if state=GAMEOVER then drawTextM('GAME OVER',(GetHeight-CHARWIDTH)/2);
			if state=REALLYQUIT then drawTextM('REALLY QUIT',(GetHeight-CHARWIDTH)/2);
			if state=GETREADY then drawLevel;
			if (state=CONGRATULATION) and (counter mod 16 < 8) then drawTextM('YOU MADE IT',(GetHeight-CHARWIDTH)/2);
			if (state=GETREADY) and (counter mod 10 < 5) then drawTextM('GET READY',GetHeight/2+CHARWIDTH);
			if (state=OUTOFTIME) and (counter mod 16 < 8) then drawTextM('OUT OF TIME',(GetHeight-CHARWIDTH)/2);
			if state=SELECTLEVEL then drawSelectLevel;
			if (cheat=1) and (counter mod 16<12) then drawText('DEMO',GetWidth-64-2,2);
			repaint;
			delay(20);
		until state=QUITTER;
	end;
//--------------------------
begin
	inic;
	game;	
end.
 