<?php

require '../vendor/autoload.php';

require '_conf.php';
require 'models/Song.php';
require 'models/CrdParser.php';


use Doctrine\DBAL\DriverManager;

$DB = DriverManager::getConnection($SQL_CREDENTIALS, new \Doctrine\DBAL\Configuration());


$app = new \Slim\Slim();
$app->config('debug', true);
$app->response->headers->set('Content-Type', 'application/json');

$app->get('/songs', function () use(&$DB) {
	$songs = $DB->fetchAll("SELECT id, title, license, status FROM songs");
	echo json_encode($songs);
});

$app->get('/songs/:songId', function ($songId) {
	$song = new Song($songId);
	$data = $song->getData();

	function startsWithRaw($haystack, $needle = "raw") {
		// search backwards starting from haystack length characters from the end
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}

	foreach($data as $fieldname => $value){
		if (startsWithRaw($fieldname)){
			$data[$fieldname.'Size'] = strlen($data[$fieldname]);
			unset($data[$fieldname]);
		}
	}

	echo json_encode($data);
});

$app->put('/songs/:songId', function ($songId) use ($app) {
	$song = new Song($songId);
	$data = json_decode($app->request->getBody(), true);
	$song->setData($data)->save();
	return true;
});


$app->get('/songs/:songId/html', function ($songId) use ($app) {
	$app->contentType('text/html');
	$song = new Song($songId);
	echo $song->getHtml();
});

// testing only
$app->get('/songs/:songId/crd', function ($songId) use ($app) {
	$app->contentType('text/html');

	$song = new Song($songId);
	$result = CrdParser::run($song->getData()['text']);
	var_dump($result);
});

$app->get('/songs/:songId/raw/:rawType', function ($songId, $rawType) use ($app) {
	$ext = pathinfo($rawType, PATHINFO_EXTENSION);
	$fieldname = pathinfo($rawType, PATHINFO_FILENAME);
	$song = new Song($songId);
	$data = $song->getRawData($fieldname);
	if (!$data){
		header("HTTP/1.0 404 Not Found");
		die();
	} else {
		switch($ext){
			case 'png':
				$app->contentType('image/png');
				break;
			case 'pdf':
				$app->contentType('application/pdf');
				break;
			case 'mid':
			case 'midi':
				$app->contentType('audio/midi');
				break;
			default:
				$app->contentType('application/octet-stream');
		}
		echo $data;
	}
});

$app->post('/songs/:songId/:rawType', function ($songId, $rawType) use ($app) {
	$song = new Song($songId);
	$rawdata = file_get_contents($_FILES['file']['tmp_name']);
	$song->setRawData($rawType, $rawdata);
	$song->save();
});

$app->get('/import', function () use ($app) {
	$app->contentType('text/html');

	$path = '../../data/sibelius_export/converted-xml';
	$files = scandir($path);

	foreach($files as $file){
		if (substr($file, -4) === '.xml'){
			var_dump($file);
			$data = file_get_contents($path.'/'.$file);
			$song = new Song();
			$song->loadFromXml($data);
			$title = trim(str_replace('.xml', '', $file));
			$song->setTitle($title);
			$song->save();
		}
	}
});

// for testing purposes
$app->get('/import/:filename', function ($filename) use ($app) {
	$app->contentType('text/html');

	$path = '../../data/sibelius_export/converted-xml';

	if (substr($filename, -4) === '.xml' && file_exists($path.'/'.$filename)){
		$data = file_get_contents($path.'/'.$filename);
		$song = new Song();
		$song->loadFromXml($data);
		$title = trim(str_replace('.xml', '', $filename));
		$song->setTitle($title);
		$song->save();
	} else {
		throw new Exception('File does not exist: '.$path.'/'.$filename);
	}
});

$app->get('/importsib', function () use ($app, &$DB) {
	$app->contentType('text/html');
	ini_set('max_execution_time', 300);

	$path = '../../data/sibelius_export/all';
	$files = scandir($path);

	foreach($files as $file){
		if (substr($file, -4) === '.sib'){
			$songtitle = substr($file, 0, -4);
			$songtitle = str_replace('_0001','',$songtitle);
			//var_dump($songtitle);
			$ids = $DB->fetchAll("SELECT id FROM songs WHERE title = ?", array($songtitle));
			if(isset($ids[0]['id'])){
				var_dump($ids[0]['id']);
				$data = file_get_contents($path.'/'.$file);
				$song = new Song($ids[0]['id']);
				$song->setRawData('rawSIB', $data);
				$song->save();
			} else {
				var_dump("no song found for $songtitle");
			}
		}
	}
});

$app->get('/importpng', function () use ($app, &$DB) {
	$app->contentType('text/html');
	ini_set('max_execution_time', 300);

	$path = '../../data/sibelius_export/converted-png';
	$files = scandir($path);

	foreach($files as $file){
		if (substr($file, -4) === '.png'){

			$songtitle = substr($file, 0, -4);
			$songtitle = str_replace('_0001','',$songtitle);
			//var_dump($songtitle);
			$ids = $DB->fetchAll("SELECT id FROM songs WHERE title = ?", array($songtitle));
			if(isset($ids[0]['id'])){
				var_dump($ids[0]['id']);
				$second_file = str_replace('_0001','_0002',$file);
				if ($file != $second_file && file_exists($path.'/'.$second_file)){

					// concat image 0001 and 0002 into a single image
					$image1 = imagecreatefrompng($path.'/'.$file);
					$image2 = imagecreatefrompng($path.'/'.$second_file);

					$w1 = imagesx($image1);
					$h1 = imagesy($image1);
					$w2 = imagesx($image2);
					$h2 = imagesy($image2);

					$newWidth = max($w1, $w2);
					$newHeight = $h1 + $h2;
					$newImage = imagecreatetruecolor($newWidth, $newHeight);
					$white = imagecolorallocate($newImage, 255, 255, 255);
					imagefill($newImage, 0, 0, $white);

					imagecopyresampled($newImage, $image1, 0, 0, 0, 0, $w1, $h1, $w1, $h1);
					imagecopyresampled($newImage, $image2, 0, $h1, 0, 0, $w2, $h2, $w2, $h2);

					ob_start();
					imagejpeg($newImage);
					$data = ob_get_clean();

				} else {
					$data = file_get_contents($path.'/'.$file);
				}

				$song = new Song($ids[0]['id']);
				$song->setRawData('rawNotesPNG', $data);
				$song->save();
			} else {
				var_dump("no song found for $songtitle");
			}
		}
	}
});

// export json index for app
$app->get('/export/index', function () use ($app, &$DB) {
	$path = '../../app/www/resources/songs/song-index.json';
	$index = [];

	$songs = $DB->fetchAll("SELECT id, title, alternativeTitles, pageRondoRed, pageRondoBlue, pageRondoGreen
		FROM songs
		WHERE license = 'FREE'
		/*AND status = 'DONE'*/");

	foreach($songs as $song){
		$alternativeTitles = $song['alternativeTitles'];
		$song['title'] = mb_convert_case($song['title'], MB_CASE_UPPER, "UTF-8");
		unset($song['alternativeTitles']);
		$index[] = $song;

		// alternative titel
		if (strlen($alternativeTitles) > 0){
			$titles = explode("\n", $alternativeTitles);
			foreach($titles as $title){
				$song['title'] = $title;
				$index[] = $song;
			}
		}
	}

	$json = json_encode($index, JSON_PRETTY_PRINT);
	umask(0);
	file_put_contents($path, $json);
	chmod($path, 0777);
	echo $json;
});

// export html files & images for app
$app->get('/export/html', function () use ($app, &$DB) {
	umask(0);
	$path = '../../app/www/resources/songs/';

	$songIds = $DB->fetchAll("SELECT id FROM songs
		WHERE license = 'FREE'
		/*AND status = 'DONE'*/");

	foreach($songIds as $songId){
		$song = new Song($songId['id']);

		// generate html
		$html = $song->getHtml(true);
		$filepath = $path.'html/'.$songId['id'].'.html';
		file_put_contents($filepath, $html);
		chmod($filepath, 0777);

		// generate image
		$data = $song->getData();
		if ($data['rawImage']){
			// convert to png
			ob_start();
			imagepng(imagecreatefromstring($data['rawImage']));
			$image = ob_get_clean();
			$imagepath = $path.'images/'.$songId['id'].'.png';
			file_put_contents($imagepath, $image);
			chmod($imagepath, 0777);
		}
	}
	echo count($songIds)." Songs exportiert.";
});

$app->run();
