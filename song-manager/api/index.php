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
	$songs = $DB->fetchAll("SELECT id, title, isLicenseFree, status FROM songs");
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

	$path = '../../data/sibelius/converted-xml';
	$files = scandir($path);

	foreach($files as $file){
		if (substr($file, -4) === '.xml'){
			$data = file_get_contents($path.'/'.$file);
			$song = new Song();
			$song->loadFromXml($data);
			$song->setTitle(trim($file, '.xml'));
			$song->save();
		}
	}
});

// for testing purposes
$app->get('/import/:filename', function ($filename) use ($app) {
	$app->contentType('text/html');

	$path = '../../data/sibelius/converted-xml';

	if (substr($filename, -4) === '.xml' && file_exists($path.'/'.$filename)){
		$data = file_get_contents($path.'/'.$filename);
		$song = new Song();
		$song->loadFromXml($data);
		$song->save();
	} else {
		throw new Exception('File does not exist: '.$path.'/'.$filename);
	}

});

// export json index for app
$app->get('/export/index', function () use ($app, &$DB) {
	$path = '../../data/export/song-index.json';
	$index = [];

	$songs = $DB->fetchAll("SELECT id, title, alternativeTitles, pageRondoRed, pageRondoBlue, pageRondoGreen FROM songs");

	foreach($songs as $song){
		$alternativeTitles = $song['alternativeTitles'];
		$song['title'] = strtoupper($song['title']);
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
	file_put_contents($path, $json);
	echo $json;
});

// export json index for app
$app->get('/export/html', function () use ($app, &$DB) {
	$path = '../../data/export/';

	$songIds = $DB->fetchAll("SELECT id FROM songs");

	foreach($songIds as $songId){
		$song = new Song($songId['id']);

		// generate html
		$html = $song->getHtml(true);
		file_put_contents($path.'html/'.$songId['id'].'.html', $html);

		// generate image
		$data = $song->getData();
		if ($data['rawImage']){
			// convert to png
			ob_start();
			imagepng(imagecreatefromstring($data['rawImage']));
			$image = ob_get_clean();
			file_put_contents($path.'images/'.$songId['id'].'.png', $image);
		}
	}
});

$app->run();
