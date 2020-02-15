<?php
	include 'codebook.php';
	$connect=mysql_connect("127.0.0.1","istvanszalontai","haziko")or die("cannot connect");
	mysql_select_db("istvanszalontai", $connect)or die("cannot select DB");
	/*
	CREATE TABLE `futas`.`heroes` (
`id` INT NOT NULL AUTO_INCREMENT ,
`score` INT NOT NULL ,
`user` VARCHAR( 20 ) NOT NULL ,
`date` TIMESTAMP NOT NULL ,
PRIMARY KEY ( `id` ) 
) ENGINE = InnoDB 
	*/
	$hi=$_REQUEST['hi'];
	$score=$_POST['score'];
	$user=$_POST['user'];
	if($hi)
	{
		$valid=false;
		$i++;
		do
		{
			if($code[$i]==$hi)
			{
				$valid=true;
				$hidecoded=$i;
			}
			$i++;
		}while(!$valid && $i<2000);
	}
	if($user && $score)
	{
		mysql_query("INSERT INTO `heroes` (`id` , `score` , `user` , `date` ) VALUES ( NULL , '$score', '$user', NOW( ));");
	}
?>
<html>
	<head>
		<title>Rémület a temetõben rekordok</title>
	</head>
	<body style="background:url(trailer.png) repeat-x; background-color:890002; font-family:Georgia; color:ffffff;">
		<center>
			<img src="title_hu.png">
		</center>
<?php
	if($hidecoded)
	{
?>
		<h2 align=center>Gratulálok! <?=$hidecoded;?> pontot értél el!</h2>
		<form action="HorrorHiscore.php" method="POST">
			<center>
			Neved: <input type="text" name="user">
			
			<input type="submit" value="Elküld">
			</center>
			<input type="hidden" name="score" value="<?=$hidecoded;?>">
		</form>
<?php
	}
?>
	<center>
			<img src="rekordok.png">
		</center>
	<table align="center">
<?php
	$i=1;
	$result=mysql_query("SELECT `score`,`user`,`date` FROM `heroes` ORDER BY `score` DESC;");
	while( $row=mysql_fetch_array($result) )
	{
?>
			<tr>
				<td width="50"><?=$i;?>.</td>
				<td width="100"><?=$row['score'];?> pont</td>
				<td width="200"><b><?=$row['user'];?></b></td>
				<td width="200"><?=$row['date'];?></td>
			</tr>
<?php
		$i++;
	}
?>	
		</table>
	</body>
</html>
<?php
	mysql_close($connect);
?>