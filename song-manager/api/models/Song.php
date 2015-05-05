<?php

class Song
{
	private $id;
	private $data;
	private $DB;

	function __construct($id) {
		$this->id = $id;
		$this->DB = $GLOBALS['DB'];
		$this->data = $this->DB->fetchAssoc("SELECT * FROM songs WHERE id = ?", array($id));
	}

	public function setImage($image){
		// convert to png
		ob_start();
		imagepng(imagecreatefromstring($image));
		$image = ob_get_clean();

		$this->image = $image;
		return $this;
	}

	public function printImage(){
		$img = imagecreatefromstring($this->data['image']);
		imagepng($img);
	}


	public function getId(){
		return $this->id;
	}

	public function getData(){
		return $this->data;
	}

	public function setData($data){
		$this->data = $data;
		return $this;
	}

	public function getHtml(){
		$html = '<div>
			<img src="api/index.php/songs/'.$this->data['id'].'/image.png" class="song-image"/>
			<div class="padding">
			  <h3 class="song-title">'.$this->data['title'].'</h3>
			  <div class="songtext">'.$this->crd2html($this->data['text']).'</div>
			</div>
		</div>';
		return $html;
	}

	public function save(){
		unset($this->data['image']);
		$this->DB->update('songs', $this->data, array('id' => $this->id));
		return $this;
	}

	private function crd2html($crd_string){
		$html = str_replace('[','<span  class="chord">', $crd_string);
		$html = str_replace(']','</span>', $html);
		$html = str_replace("\n",'<br>', $html);

		return $html;
	}

	private function xml2crd($xml_string){

		$xml = simplexml_load_string($xml_string);
		$json = json_encode($xml);
		$array = json_decode($json,TRUE);

		// Write Debug File
		file_put_contents(__DIR__ . '/../../../../../data/musicjson/tmp.json', json_encode($array));

		$song = $array;
		$measures = $array['part']['measure'];

		$output = '';

		//var_dump($xml_string);
		if (is_array($measures)){

			foreach ($measures as $measure){

				// Chords
				if (isset($measure['harmony'])){
					if(isset($measure['harmony']['@attributes'])){
						$arr = array($measure['harmony']);
					} else {
						$arr = $measure['harmony'];
					}

					foreach ($arr as $harmony){
						//var_dump($harmony);
						if (isset($harmony['root']['root-step'])){
							$step = $harmony['root']['root-step'];
							$kind_type = $harmony['kind'];
							$kind = '';
							if ($kind_type == 'minor') {
								$kind = 'm';
							}
							if ($kind_type == 'dominant') {
								$kind = '7';
							}
							$output .= '['.$step.$kind.']';
						}
					}
				}

				// Texte
				if (isset($measure['note'])) {
					if(isset($measure['note']['@attributes'])){
						$arr = array($measure['note']);
					} else {
						$arr = $measure['note'];
					}

					foreach ($arr as $note) {
						if (isset($note['lyric'])){
							$hasSpace = false;
							if(isset($note['lyric']['syllabic'])){
								if ($note['lyric']['syllabic'] == 'single' || $note['lyric']['syllabic'] == 'end'){
									$hasSpace = true;
								}
							}

							if (isset($note['lyric']['text'])){
								$output .= $note['lyric']['text'] . ($hasSpace?' ':'');
							}
							//var_dump($note['lyric']);

						}
					}
				}

				// BARLINE = newline
				if (isset($measure['barline'])){
					$output .= "\n";
				}


				// Lyrics als Text
				if (isset($measure['direction']['direction-type']['words'])){
					$words = $measure['direction']['direction-type']['words'];
					if(is_array($words)){
						$output .= "\n\n".join("\n", $measure['direction']['direction-type']['words']);
					} else {
						$output .= "\n\n".$words;
					}
				}
			}
		}

		return $output;
	}
}
