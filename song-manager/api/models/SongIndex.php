<?php

class SongIndex {

	private $DB;

	function __construct($id = null) {
		$this->DB = $GLOBALS['DB'];
	}

	public function getSongIndex(){
		$songs = $this->DB->fetchAll("SELECT 
				 id, title, license, status, copyrightStatusApp, copyrightStatusBook2017, copyrightStatusBook2021, releaseApp2017, releaseBook2017, releaseBook2021,
				 (rawImage IS NOT NULL) AS hasImage,
				 (rawSIB IS NOT NULL) AS hasSIB,
				 (rawMidi IS NOT NULL) AS hasMidi,
				 (rawNotesPDF IS NOT NULL) AS hasNotesPDF
				FROM songs");

		return $songs;
	}

	public function getAppSongIds() {
		return $this->DB->fetchAll("SELECT id
			FROM songs
			WHERE releaseApp2017 = 1
			ORDER BY cast(pageRondo2017 as unsigned) ASC");
	}

	public function getSongIndexForApp(){
		$index = [];
		$slidesFree = [];
		$slidesPaid = [];

		$songs = $this->getAppSongIds();

		foreach($songs as $song_id){
			$model = new Song($song_id['id']);
			$song = $model->getData();
			$alternativeTitles = $song['alternativeTitles'];
			$title_uc = mb_convert_case($song['title'], MB_CASE_UPPER, "UTF-8");

			// accords
			$chords = $model->getClearedChordList();

			$isFree = ($song['license'] == 'LICENSED' && $song['license_type'] != 'FREE' ? false : true);

			$index[] = [
				'id' => $song['id'],
				'title' => $title_uc,
				'pageRondoRed' => $song['pageRondoRed'],
				'pageRondoBlue' => $song['pageRondoBlue'],
				'pageRondoGreen' => $song['pageRondoGreen'],
				'pageRondo2017' => $song['pageRondo2017'],
				'interpret' => $song['interpret'],
				'chords' => $chords,
				'alternative' => false,
				'free' => $isFree,
				'license' => ($song['copyrightInfoApp'] ?: '')
			];

			// alternative titel
			if (strlen($alternativeTitles) > 0){
				$titles = explode("\n", $alternativeTitles);
				foreach($titles as $title){
					$index[] = [
						'id' => $song['id'],
						'title' => $title,
						'pageRondoRed' => $song['pageRondoRed'],
						'pageRondoBlue' => $song['pageRondoBlue'],
						'pageRondoGreen' => $song['pageRondoGreen'],
						'pageRondo2017' => $song['pageRondo2017'],
						'interpret' => $song['interpret'],
						'chords' => $chords,
						'alternative' => true,
						'free' => $isFree,
						'license' => ($song['copyrightInfoApp'] ?: '')
					];
				}
			}

			// slides
			$slidesPaid[] = $song['id'];
			if ($isFree) {
				$slidesFree[] = $song['id'];
			}

		}
		usort($index, function($a, $b) {
			$a['title'] = str_replace(['Ä','Ö','Ü'], ['A','O','U'], $a['title']);
			$b['title'] = str_replace(['Ä','Ö','Ü'], ['A','O','U'], $b['title']);
			if (strtoupper($a['title']) < strtoupper($b['title'])) {
				return -1;
			} else {
				return 1;
			}
		});
		return [
			'slidesFree' => $slidesFree,
			'slidesPaid' => $slidesPaid,
			'list' => $index,
		];
	}
}
