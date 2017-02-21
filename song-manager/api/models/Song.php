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
		$this->data['pageRondo2017'] = (intval($this->data['pageRondo2017']) > 0 ? intval($this->data['pageRondo2017']) : null);

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

	public function getXML(){
		$text = $this->crd2text($this->data['text']);

		$paragraphs = explode(PHP_EOL.PHP_EOL, $text);

		$new_paragraphs = [];
		foreach ($paragraphs as $para) {
			if ($this->startsWithRaw($para, 'Ref.')) {
				$new_paragraphs[] = '<Ref>'.$para.'</Ref>';
			} else {
				$new_paragraphs[] = $para;
			}
		}

		$text = implode(PHP_EOL.PHP_EOL, $new_paragraphs);

		$xml  = '<Titel>'.$this->data['title'].PHP_EOL.'</Titel>'.PHP_EOL;
		$xml .= '<Text>'.$text.'</Text>'.PHP_EOL;
		$xml .= '<Copy>'.$this->data['copyrightInfo'].PHP_EOL.'</Copy>'.PHP_EOL;
		$xml  = '<Lied AlteSeitennummer="'.$this->data['pageRondoGreen'].'" Titel="'.$this->data['title'].'">'.$xml.'</Lied>';
		$xml .= '<Noten><img href="pdf/noten_'.$this->data['id'].'.pdf"/></Noten>'.PHP_EOL;

		$xml = str_replace('&','&amp;',$xml);
		return $xml;
	}

	public function getHtml($export = false){
		if($export || false){
			// only export songtext for the app
			return $this->crd2html($this->data['text']);
		}

		if ($this->data['rawImage']){
			if ($export == true){
				// app export
				$imgurl = 'resources/songs/images/'.$this->data['id'].'.gif?_t='.time();
			} else {
				// song-manager preview
				$imgurl = 'api/index.php/songs/'.$this->data['id'].'/raw/rawImage.gif?_t='.time();
			}
			$image = '<img src="'.$imgurl.'" class="song-image"/>';
		} else {
			$image = '';
		}

		$html = '<div>'.EOL
			.$image.EOL
			.'<div class="padding">'.EOL
			.'  <h3 class="song-title">'.$this->data['title'].'</h3>'.EOL
			.'  <div class="songtext">'.EOL.EOL
			.$this->crd2html($this->data['text']).EOL
			.'  </div>'.EOL
			.'</div>'.EOL
			.'</div>';
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

	private function crd2text($crd_string) {
		try {
			$tokens = CrdParser::run($crd_string);
		} catch(Exception $e){
			return $e->getMessage();
		}
		$text = '';
		foreach($tokens as $idx => $token){
			switch($token['token']){
				case 'T_CHORD':
					break;
				case 'T_NEWLINE':
					$text .= PHP_EOL;
					break;
				case 'T_PARAGRAPH':
					$text .= PHP_EOL;
					$text .= PHP_EOL;
					break;
				case 'T_STRING':
					$text .= $token['match'];
					break;
				case 'T_WHITESPACE':
					$text .= ' ';
					break;
				default:
					$text .= $token['match'];
			}
		}
		return $text;
	}

	private function crd2html($crd_string){
		try {
			$tokens = CrdParser::run($crd_string);
		} catch(Exception $e){
			return $e->getMessage();
		}

		$html  = '<div class="paragraph">'.EOL;
		$html .= '  <div class="line">'.EOL;
		$html .= '    <div class="word">';
		$html .= '<div class="bl">';

		$last_token = null;

		foreach($tokens as $idx => $token){
			//var_dump($token);

			if(isset($tokens[$idx+1])){
				$next_token = $tokens[$idx+1]['token'];
			} else {
				$next_token = null;
			}

			if ($last_token == 'T_CHORD' && $last_token != $token['token']){
				$html .= '</span>';
			}

			switch($token['token']){
				case 'T_CHORD':
					if ($last_token != 'T_CHORD'){
						$html .= '<span class="chord">';
					}
					// remove brackets
					$chord = substr($token['match'],1,-1);
					$html .= '<span>'.$chord.'</span>';
					break;
				case 'T_NEWLINE':
					$html .= '</div>';
					$html .= '</div>'.EOL;
					$html .= '  </div>'.EOL;
					$html .= '  <div class="line">'.EOL;
					$html .= '    <div class="word"><div class="bl">';
					break;
				case 'T_PARAGRAPH':
					$html .= '</div>';
					$html .= '</div>'.EOL;
					$html .= '  </div>'.EOL;
					$html .= '</div>'.EOL;
					$html .= '<div class="paragraph">'.EOL;
					$html .= '  <div class="line">'.EOL;
					$html .= '    <div class="word"><div class="bl">';
					break;
				case 'T_STRING':
					$isWordEnd = ($next_token == 'T_WHITESPACE');
					$emptyToken = ($last_token != 'T_CHORD' ? '<span class="empty-chord"></span>' : '');
					if($isWordEnd){
						$html .= $emptyToken.$token['match'].'&nbsp;</div></div>'.EOL.'    <div class="word"><div class="bl">';
					} else {
						$html .= $emptyToken.$token['match'].'</div><div class="bl">';
					}
					break;
				case 'T_WHITESPACE':
					if($last_token == 'T_CHORD'){
						$html .= ' </div></div>'.EOL.'    <div class="word"><div class="bl">';
					}
					break;
				default:
					$html .= $token['match'];
			}
			$last_token = $token['token'];
		}

		// clean html
		$html = str_replace('    <div class="word"><div class="bl"></div></div>'.EOL,'',$html);
		$html = str_replace('<div class="bl"></div>','',$html);


		$html .= '</div>';
		$html .= '</div>'.EOL;
		$html .= '  </div>'.EOL;
		$html .= '</div>'.EOL;

		return $html;
	}

	public function getChordList(){
		try {
			$tokens = CrdParser::run($this->data['text']);
		} catch(Exception $e){
			return $e->getMessage();
		}

		$list = [];

		foreach($tokens as $token){
			if ($token['token'] == 'T_CHORD'){
				$list[] = substr($token['match'],1,-1);
			}
		}
		$list = array_unique($list);
		sort($list);
		return $list;
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
		if(isset($array['part']['measure'])){
			$measures = $array['part']['measure'];
		} else {
			$measures = $array['part'][0]['measure'];
		}

		$notelyrics = [];
		$textlyrics = [];
		$output = '';

		//var_dump($xml_string);
		if (is_array($measures)){

			foreach ($measures as $measure){

				$current_chord = '';
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
							$current_chord .= '['.$step.$kind.']';
							// add chord to existing lines
							foreach($notelyrics as $lnr => $val){
								$notelyrics[$lnr] .= $current_chord;
							}
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
							// make array if only one lyric is available to process as usual
							if(isset($note['lyric']['syllabic']) or isset($note['lyric']['text'])) {
								$lyrictemp = $note['lyric'];
								$note['lyric'] = [];
								$note['lyric'][0] = $lyrictemp;
							}

							//var_dump($note['lyric']);
							foreach($note['lyric'] as $lyrics){
								$hasSpace = false;
								if (isset($lyrics['syllabic'])) {
									if ($lyrics['syllabic'] == 'single' or $lyrics['syllabic'] == 'end') {
										$hasSpace = true;
									}
								}

								if (isset($lyrics['text'])) {
									$versenr = $lyrics['@attributes']['number'];
									if(!isset($notelyrics[$versenr])){
										// initialize with current chord
										$notelyrics[$versenr] = $current_chord;
									}
									$notelyrics[$versenr] .= $lyrics['text'] . ($hasSpace ? ' ' : '');
								}
							}

							//var_dump($note['lyric']);

						}
					}
				}

				echo '--------------';

				// BARLINE = newline
				if (isset($measure['barline'])){
					foreach($notelyrics as $lnr => $val){
						$notelyrics[$lnr] .= "\n";
					}
					//$output .= "\n";
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
		//var_dump($notelyrics);
		$notesoutput = '';
		foreach($notelyrics as $line){
			$notesoutput .= $line."\n\n";
		}
		$output = $notesoutput.$output;

		// remove tabs
		$output = trim(preg_replace('/\t+/', ' ', $output));
		var_dump($output);

		return $output;
	}
}
