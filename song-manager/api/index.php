<?php
require '../vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('/songs', function () {
	echo json_encode(array('bla','blub'));
});

$app->get('/songs/:songId', function ($songId) {
	echo json_encode(array($songId,'bla','blub'));
});

$app->run();
