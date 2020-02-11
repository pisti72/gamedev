<?php
$filename="skiing.txt";
$fa=fopen($filename,"r");
$hiname=fgets($fa,1024);
$hiname=substr($hiname, 0, strlen($hiname)-2);
$hi=fgets($fa,1024);
fclose($fa);
if($hiname == NULL){
	$hiname='NOBODY';
	$hi=0;
}
if($_POST['hi']){
	//új rekord!!!
	$fa=fopen($filename,"w");
	$hiname=substr(strtoupper(stripslashes($_POST['hiname'])), 0, 8);
	$hi=$_POST['hi'];
	fwrite($fa,"$hiname\r\n$hi");
	fclose($fa);
}	
?>
<body>
		<small style="color:rgb(160,160,160);font-family:arial;font-size:10px;">WRITTEN BY ISTVÁN SZALONTAI 2011</small><br>
		<a id="hi" style="color:rgb(120,120,120);font-family:arial;font-size:20px;">HISCORE BY #####: 0</a><br>
		<a id="score" style="color:rgb(120,120,120);font-family:arial;font-size:30px;">SCORE: 0</a>
		<a id="hero" style="color:rgb(120,120,120);font-family:webdings;font-size:100px;">&#135</a>
		<a id="1" style="color:rgb(210,210,120);font-family:webdings;font-size:60px;">&#145</a>
		<a id="2" style="color:rgb(210,120,120);font-family:webdings;font-size:100px;">w     w</a>
		<img id="3" src="tree.gif">
		<img id="4" src="tree.gif">
		<img id="5" src="tree.gif">
		<img id="6" src="tree.gif">
		<img id="7" src="tree.gif">
		<img id="8" src="tree.gif">
		<img id="9" src="tree.gif">
		<img id="10" src="tree.gif">
		<img id="11" src="tree.gif">
		<img id="12" src="tree.gif">
		<img id="13" src="tree.gif">
		<img id="14" src="tree.gif">
		<img id="15" src="tree.gif">
		<img id="16" src="tree.gif">
		<img id="17" src="tree.gif">
		<img id="18" src="tree.gif">
		<img id="19" src="tree.gif">
		<img id="20" src="tree.gif">
	<script>
		var tree_x = new Array();
		var tree_y = new Array();
		var w = document.body.clientWidth;
		var h = document.body.clientHeight;
		var timer = 0;
		var temp_x = 0;
		var dx = 0;
		var hi = <?=$hi;?>;
		var hiname='<?=$hiname;?>';
		var score;
		var speed;
		var hero_x = 0;
		var hero_y = 100;
		//detecting browser
		var brw = 'IE';
		if (navigator.appName == 'Netscape') brw = 'FF';
		
		if (brw == 'IE') {document.onmousemove = mouseListener;}
		else {window.onmousemove = mouseListener;}
		inicTree();
		
		function mouseListener(e){
			temp_x = hero_x;
			if(brw == 'IE'){
				hero_x = event.clientX-52;
				hero_y = event.clientY-46;
			}
			else
			{
				hero_x = e.clientX-52;
				hero_y = e.clientY-46;
			}
			if(hero_y<0)hero_y=0;
			if(hero_y>h-200)hero_y=h-200;
			dx = temp_x-hero_x;
			document.getElementById('hero').style.position = "absolute";
			document.getElementById('hero').style.left = hero_x;
			document.getElementById('hero').style.top = hero_y;
		}
		
		function inicTree(){
			timer=0;
			score=0;
			dx=0;
			updateScore();
			speed=2;
			for(var i=1;i<=20;i++){
				tree_x[i] = Math.random()*w;
				tree_y[i] = i*h/20+h;
			}
		}
		
		function updateSpeed(){
			timer++;
			if(timer>60){
				speed+=.1;
				timer=0;
			}
		}
		
		function updateScore(){
			document.getElementById('score').innerHTML="SCORE: "+score;
			document.getElementById('hi').innerHTML="HISCORE BY "+hiname+": "+hi;
		}
		
		function collition(x1,y1,w1,h1,x2,y2,w2,h2){
			var b=false;
			if((x1 < x2+w2 && x1 > x2) || (x1+w1 < x2+w2 && x1+w1 > x2)){
				if((y1 < y2+h2 && y1 > y2) || (y1+h1 < y2+h2 && y1+h1 > y2)){
					b=true;
				}
			}
			return b;
		}
		
		function scrollTrees(){
			for(var i=1;i<=20;i++){
				//move trees
				tree_y[i]-=speed+hero_y/50;
				tree_x[i]+=dx;
				if(tree_y[i]<-99){
					tree_x[i]=Math.random()*w;
					tree_y[i]=h;
					if(i==1 || i==2)tree_y[i]=h+Math.random()*h;
					score++;
					updateScore();
				}
				//redraw
				document.getElementById(i).style.position = "absolute";
				document.getElementById(i).style.left = tree_x[i];
				document.getElementById(i).style.top = tree_y[i];
			}
		}
		
		function collitionTrees(){
			for(var i=3;i<=20;i++){
				//collition detection
				if(collition(hero_x+42, hero_y+28, 20, 40, tree_x[i]+27, tree_y[i]+52, 35, 47)){
					alert("Your score: "+score);
					if(score>hi){
						hi=score;
						document.write('<body style=background-color:rgb(210,210,120);color:rgb(100,100,60)>'+
						'<h1>NEW HIGHSCORE: '+hi+' !!!</h1>'+
						'<form method=post>ENTER YOUR NAME:<input type=text name=hiname value='+hiname+' maxlength=8>'+
						'<input type=hidden name=hi value='+hi+'><input type=submit value=SUBMIT></form>'+
						'<a style="color:rgb(255,255,100);font:600px webdings;">%</a></body>');
					}
					inicTree();
				}
			}
		}
		
		function collitionGold(){
			if(collition(hero_x+42, hero_y+28, 20, 40, tree_x[1]+15, tree_y[1]+10, 28, 42)){
				tree_x[1]=Math.random()*w;
				tree_y[1]=h+Math.random()*h;
				score+=50;
				updateScore();
			}
		}
		
		function collitionFlag(){
			if(collition(hero_x+42, hero_y+28, 20, 40, tree_x[2]+50, tree_y[2]+60, 146, 30)){
				score+=10;
				updateScore();
			}
		}
		
		function r(){
			scrollTrees();
			collitionTrees();
			collitionGold();
			collitionFlag();
			updateSpeed();
		}
		setInterval('r()',10);
		r();
	</script>
</body>