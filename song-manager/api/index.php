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
	$songs = $DB->fetchAll("SELECT * FROM songs");
	echo json_encode($songs);
});

$app->get('/songs/:songId', function ($songId) {
	$song = new Song($songId);
	echo json_encode($song->getData());
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

$app->get('/songs/:songId/image.png', function ($songId) use ($app) {
	$app->contentType('image/png');
	$song = new Song($songId);
	$song->printImage();
});

$app->post('/songs/:songId/image.png', function ($songId) use ($app) {
	$song = new Song($songId);
	$imgdata = file_get_contents($_FILES['file']['tmp_name']);
	$song->setImage($imgdata);
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

$app->run();
