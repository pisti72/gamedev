<!--
Készítette:			Szalontai István
Projekt neve: 		FELHAJTÁS
Fejlesztés kezdete:	2011-11-25
Fejlesztés vége:	2012-01-09
Téma:				Minigame világvége
http://yscik.com/jf/mgeowlist.php
http://yscik.com/jf/res/mgeow.png

js csomagolók:
http://javascriptcompressor.com/
http://jscompress.com/
http://www.dafont.com/
http://www.dafont.com/sf-funk-master.font 

html5:
http://diveintohtml5.info/
http://billmill.org/static/canvastutorial/index.html

-->
<head>
	<link rel="stylesheet" type="text/css" href="style.css" />
	<script type="text/javascript" src="main.js"></script>
	<script type="text/javascript" src="data.js"></script>
	<title>---== F E L H A J T Á S ==---</title>
</head>
<body onLoad="start()">
	<div id="container">
		<div id="titlepng"></div>
		<canvas id="display" width="900px" height="400px" >Your browser does not support the canvas element.</canvas><br><br>
		<img src="gfx/links.png" usemap="#links" border="0">
		<map name="links">
			<area shape="rect" coords="0,0,25,27" href="http://istvanszalontai.atw.hu/games.html" target="_blank"/>
			<area shape="rect" coords="35,0,60,27" href="readme.htm" target="_blank"/>
			<area shape="rect" coords="71,0,98,27" href="http://yscik.com/jf/mgeowlist.php" target="_blank"/>
			<area shape="rect" coords="109,0,136,27" href="felhajtas.zip" target="_blank"/>
			<area shape="rect" coords="147,0,174,27" href="http://www.w3schools.com/" target="_blank"/>
			<area shape="rect" coords="185,0,212,27" href="http://www.blender.org/" target="_blank"/>
		</map>
		<br><br>Látogatók száma:&nbsp;
<?php
$count_my_page = ("hitcounter.txt");
$hits = file($count_my_page);
$hits[0] ++;
$fp = fopen($count_my_page , "w");
fputs($fp , "$hits[0]");
fclose($fp);
echo $hits[0];
?>
		<div id="r"></div>
	</div>
</body>