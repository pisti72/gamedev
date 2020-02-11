<html>
	<head>
		<title>ROULETTE SZIMULÁTOR</title>
		<style>
		body{
			font-family:Verdana;
			color:#007700;
		}
		td{
			font-size:11px;
			border:1px dotted gray;
		}
		#m{
			border: none; float: left; margin: 0; padding: 0; width: 50%;
		}
		#r{
			border: none; float: right; margin: 0; padding: 0; width: 50%;
		}
		#pic{
			width:424px;
			height:319px;
			background:url('http://kaszinostrategiak.info/images/roulette-tab.gif');
		}
		</style>
	</head>
	<body>
		<h1>ROULETTE szimuláció</h1>
		<div id="m">
			<div id="pic"></div>
			<h2>Fekete a nyerõ!</h2>
			Egyenleg:<input id="s" type="text" value="1000" size="5"/>
			&nbsp;&nbsp;Tét:<input id="b" type="text" value="10" size="5"/>
			&nbsp;&nbsp;Nyerési többlet:<input id="w" type="text" value="10" size="5"/>
			&nbsp;&nbsp;Óvatoska:<input id="o" type="checkbox" ><br>
			&nbsp;&nbsp;<button onclick="dropn(1)">Dobás</button>
			&nbsp;&nbsp;<button onclick="dropn(10)">Dobás 10x</button>
			&nbsp;&nbsp;<button onclick="dropn(100)">Dobás 100x</button>
			&nbsp;&nbsp;<button onclick="dropn(300)">Dobás 300x</button></br>
			<div id="k"></div>
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
		</div>
		<div id="r"></div>
		<script>
		//http://www.rulettstrategiak.eu/150_strategia.php
		var i;
		var f;
		var bn,rn;
		var bmax,rmax;
		var drops=[];
		var dropsc=[];
		var account=[];
		var bet=[];
		account[i]=document.getElementById('s').value*1;
		var lose,lost;
		inic();
		function drop()
		{
			var a='';
			var win=document.getElementById('w').value*1;
			var descr='';
			if(document.getElementById('b').value>document.getElementById('s').value*1)
			{
				alert('Tét nem lehet nagyobb mint a pénzed!');
				bet[i]=document.getElementById('s').value*1;
				document.getElementById('b').value=bet[i];
			}
			drops[i]=Math.floor(Math.random()*37);
			//drops[i]=0;
			if(drops[i]==2 || drops[i]==4 || drops[i]==6 || drops[i]==8 || drops[i]==10 || 
			drops[i]==11 || drops[i]==13 || drops[i]==15 || drops[i]==17 || drops[i]==20 || 
			drops[i]==22 || drops[i]==24 || drops[i]==26 || drops[i]==28 || drops[i]==29 || 
			drops[i]==31 || drops[i]==33 || drops[i]==35){dropsc[i]='b';}else{dropsc[i]='r';}
			if(drops[i]==0){dropsc[i]='g';}
			
			bet[i]=document.getElementById('b').value*1;
			account[i]=document.getElementById('s').value*1-bet[i];
			var ovatos=document.getElementById('o').checked;
			var bet2;
			if(dropsc[i]=='b')
			{
				//win
				lose=0;
				account[i]+=bet[i]*2;
				bet2=win;//az új tét
				f++;
				bn++;if(bn>bmax)bmax=bn;
				rn=0;
			}else
			{
				//lose
				lose+=bet[i];
				if(!ovatos)bet2=bet[i]*2;//duplázzuk a tétet
				if(ovatos)bet2=lose;
				bn=0;
				rn++;if(rn>rmax)rmax=rn;
			}
			
			document.getElementById('s').value=account[i];
			document.getElementById('b').value=bet2;
			i++;
			
			
			
			a+='<table><th><td><b>SZÁM</b></td><td><b>TÉT</b></td><td><b>EGYENLEG</b></td></th>';
			var listb=i-32;if(listb<0)listb=0;
			for(var j=listb;j<i;j++)
			{
				a+='<tr>';
				a+='<td>'+(j+1)+'.</td>';
				if(dropsc[j]=='b')a+='<td style=background:black;color:white;font-weight:bold>'+drops[j]+'</td>';
				if(dropsc[j]=='r')a+='<td style=background:red;color:white;font-weight:bold>'+drops[j]+'</td>';
				if(dropsc[j]=='g')a+='<td style=background:green;color:white;font-weight:bold>'+drops[j]+'</td>';
				a+='<td>'+bet[j]+'</td>';	
				a+='<td>'+account[j]+'</td>';
				a+='</tr>';
			}
			a+='</table>';
			
			document.getElementById('r').innerHTML=a;
			document.getElementById('k').innerHTML='Fekete ('+Math.floor(f/i*100)+'%):'+f+' db, '
				+bmax+' sor&nbsp;&nbsp;|&nbsp;&nbsp;Piros('
				+Math.floor((i-f)/i*100)+'%):'+(i-f)+' db, '
				+rmax+' sor';
			if(account[i-1]<=0)
			{
				alert('Vesztettél!!');
				lost=true;
				inic();
			}
		}
		function inic()
		{
			lose=0;
			i=0;
			f=0;
			bn=0;
			rn=0;
			bmax=0;
			rmax=0;
		}
		function dropn(n)
		{
			lost=false;
			var i=0;
			do
			{
				drop();
			}while(++i<n && !lost);
		}
	</script>
	</body>
</html>