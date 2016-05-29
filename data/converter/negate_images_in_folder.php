<?php

function negate($im){
	return imagefilter($im, IMG_FILTER_NEGATE);
}

$OUTPUT_PATH = dirname(__FILE__).'/converted';
if(!file_exists($OUTPUT_PATH)){
	mkdir($OUTPUT_PATH);
}


$files = glob(dirname(__FILE__).'/*.{jpg,png}', GLOB_BRACE);
foreach($files as $file) {
	echo 'working with image: '.$file.PHP_EOL;
	$pathinfo = pathinfo($file);

	$format = $pathinfo['extension'];

	switch ($format){
		case 'jpg':
			$im = imagecreatefromjpeg($file);
			break;
		case 'png':
			$im = imagecreatefrompng($file);
			break;
		default:
			throw new Exception('unsupported format: '.$format);
	}

	if($im && negate($im)) {
		echo 'Image successfully converted to negative colors.';

		switch ($format){
			case 'jpg':
				imagejpeg($im, $OUTPUT_PATH.'/'.basename($file), 100);
				break;
			case 'png':
				imagepng($im, $OUTPUT_PATH.'/'.basename($file));
				break;
			default:
				throw new Exception('unsupported format: '.$format);
		}

		imagedestroy($im);
	} else {
		echo 'Converting to negative colors failed.';
	}
}
