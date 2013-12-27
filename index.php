<?php
function curPageURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}
?>

<?php $this_url = curPageURL(); ?>
<html>
	<head>
		<title>Jorge's Three.js Experiments</title>
		<style>
			html, body {
				margin: 0px;
				padding: 0px;
			}
			body {
				/* fallback */
				background-color: #FF4CE2;
				background-repeat: repeat-x;
				background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#0FE7E7), to(#2F2727));
				background: -webkit-linear-gradient(top, #0FE7E7, #FF4CE2);
				background: -moz-linear-gradient(top, #0FE7E7, #FF4CE2);
				background: -ms-linear-gradient(top, #0FE7E7, #FF4CE2);
				background: -o-linear-gradient(top, #0FE7E7, #FF4CE2);

				font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   				font-weight: 300;
   				color: #fff;
			}
			.container {
				width: 900px;
				margin: 0px auto;
				margin-top: 6em;
			}
			.single img {
				width: 100%;
			}
			a:link, a:visited, a:hover {
				color: #0FE7E7;
				text-decoration: none;
			}
			h1 {
				font-size: 3.5em;
			}
			h2 {
				letter-spacing: 1em; 
			}
			h2 span {
				font-size: 0.5em;
				font-style: italic;
				margin-top: .6em;
				position: absolute;
				margin-left: -0.8em;
				opacity: 0.5em;
			}
			p {
				letter-spacing: 0.07em;
			}
			footer {
				padding: 20px 0px;
			}
		</style>
	</head>
	<body>
		<div class='container'>	
			<h1>Jorge's Three.js Experiments</h1>
			
			<?php for($i = 1; $i < 6; $i++): ?>
			<div class='single'>
				<h2><span>#</span><?php echo $i; ?></h2>
				<a href='<?php echo $this_url; ?><?php echo $i; ?>/'>
					<img src='<?php echo $this_url; ?>imgs/<?php echo $i; ?>.png'>
				</a>
			</div>
			<?php endfor; ?>
			<footer>
				<p>See code on <a href='https://github.com/thejsj/ThreeJsExperiments'>github</a></p>
				<p>jorge.silva@thejsj.com</p>
			</footer>
		</div>
	</body>
</html>