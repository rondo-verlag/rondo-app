<?php

class Song
{
	private $id;
	private $data;
	private $DB;

	function __construct($id = null) {
		$this->DB = $GLOBALS['DB'];
		if (!is_null($id)){
			$this->id = $id;
			$this->data = $this->DB->fetchAssoc("SELECT * FROM songs WHERE id = ?", array($id));
		} else {
			$this->data = array();
		}
	}

	public function getId(){
		return $this->id;
	}

	public function getData(){
		return $this->data;
	}

	public function setData($data){
		$this->data = $data;

		// data validation
		$this->data['pageRondoRed'] = (intval($this->data['pageRondoRed']) > 0 ? intval($this->data['pageRondoRed']) : null);
		$this->data['pageRondoBlue'] = (intval($this->data['pageRondoBlue']) > 0 ? intval($this->data['pageRondoBlue']) : null);
		$this->data['pageRondoGreen'] = (intval($this->data['pageRondoGreen']) > 0 ? intval($this->data['pageRondoGreen']) : null);

		// do not set raw data here, use setRawData()
		foreach($this->data as $fieldname => $val){
			if ($this->startsWithRaw($fieldname)){
				unset($this->data[$fieldname]);
			}
		}

		return $this;
	}

	public function setRawData($fieldname, $data){
		if ($this->startsWithRaw($fieldname)){
			$this->data[$fieldname] = $data;
		}
		return $this;
	}

	public function getRawData($fieldname){
		if(isset($this->data[$fieldname])){
			return $this->data[$fieldname];
		}
		return null;
	}

	public function setTitle($title){
		$this->data['title'] = $title;
		return $this;
	}

	public function getHtml($export = false){
		if ($this->data['rawImage']){
			if ($export == true){
				// app export
				$imgurl = 'resources/songs/images/'.$this->data['id'].'.png?_t='.time();
			} else {
				// song-manager preview
				$imgurl = 'api/index.php/songs/'.$this->data['id'].'/raw/rawImage.png?_t='.time();
			}
			$image = '<img src="'.$imgurl.'" class="song-image"/>';
		} else {
			$image = '';
		}

		$html = '<div>
			'.$image.'
			<div class="padding">
			  <h3 class="song-title">'.$this->data['title'].'</h3>
			  <div class="songtext">'.$this->crd2html($this->data['text']).'</div>
			</div>
		</div>';
		return $html;
	}

	public function save(){
		if(is_null($this->id)){
			$this->DB->insert('songs', $this->data);
			$this->id = $this->DB->lastInsertId();
			return $this;
		} else {
			// prevent image from beeing reset
			if (isset($this->data['rawImage']) && !$this->data['rawImage']){
				unset($this->data['rawImage']);
			}
			$this->DB->update('songs', $this->data, array('id' => $this->id));
			return $this;
		}
	}

	private function startsWithRaw($haystack, $needle = "raw") {
		// search backwards starting from haystack length characters from the end
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
	}

	private function crd2html($crd_string){
		try {
			$tokens = CrdParser::run($crd_string);
		} catch(Exception $e){
			return $e->getMessage();
		}

		$html  = '<div class="paragraph">';
		$html .= '<div class="line">';
		$html .= '<div class="bl">';

		foreach($tokens as $token){
			//var_dump($token);
			switch($token['token']){
				case 'T_CHORD':
					// remove brackets
					$chord = substr($token['match'],1,-1);
					$html .= '<span class="chord">'.$chord.'</span>';
					break;
				case 'T_NEWLINE':
					$html .= '</div></div><div class="line"><div class="bl">';
					break;
				case 'T_PARAGRAPH':
					$html .= '</div></div></div><div class="paragraph"><div class="line"><div class="bl">';
					break;
				case 'T_STRING':
					$html .= '<span class="empty-chord"></span>'.$token['match'].'&nbsp;</div><div class="bl">';
					break;
				case 'T_WHITESPACE':
					break;
				default:
					$html .= $token['match'];
			}
		}

		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';

		return $html;
	}

	public function loadFromXml($xml_string){
		$text = $this->xml2crd($xml_string);
		$this->data['text'] = $text;
		$this->data['rawXML'] = $xml_string;
	}

	private function xml2crd($xml_string){

		$xml = simplexml_load_string($xml_string);
		$json = json_encode($xml);
		$array = json_decode($json,TRUE);

		// Write Debug File
		//file_put_contents(__DIR__ . '/../../../../../data/musicjson/tmp.json', json_encode($array));

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
					//var_dump($measure['note']);
					if(isset($measure['note']['@attributes'])){
						$arr = array($measure['note']);
					} else {
						$arr = $measure['note'];
					}

					foreach ($arr as $note) {
						if (isset($note['lyric'])){
							if(isset($note['lyric']['syllabic']) or isset($note['lyric']['text'])){

								$hasSpace = false;
								if(isset($note['lyric']['syllabic'])){
									if ($note['lyric']['syllabic'] == 'single' or $note['lyric']['syllabic'] == 'end'){
										$hasSpace = true;
									}
								}

								if (isset($note['lyric']['text'])){
									$output .= $note['lyric']['text'] . ($hasSpace?' ':'');
								}
							} else {
								var_dump($note['lyric']);

							}

							var_dump($note['lyric']);

						}
					}
				}

				echo '--------------';

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

		// remove tabs
		$output = trim(preg_replace('/\t+/', ' ', $output));

		return $output;
	}
}
