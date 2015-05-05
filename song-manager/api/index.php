<?php
require '_conf.php';
require '../vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

$DB = DriverManager::getConnection($SQL_CREDENTIALS, new \Doctrine\DBAL\Configuration());


$app = new \Slim\Slim();

$app->get('/songs', function () use(&$DB) {
	$songs = $DB->fetchAll("SELECT * FROM songs");
	echo json_encode($songs);
});

$app->get('/songs/:songId', function ($songId) use(&$DB) {
	$song = $DB->fetchAssoc("SELECT * FROM songs WHERE id = ?", array($songId));
	echo json_encode($song);
});

$app->run();
