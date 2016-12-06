<?php

class SongIndex {

	private $DB;

	function __construct($id = null) {
		$this->DB = $GLOBALS['DB'];
	}

	public function getSongIndex(){
		$songs = $this->DB->fetchAll("SELECT 
				 id, title, license, status, copyrightStatusApp, copyrightStatusBook,
				 (rawImage IS NOT NULL) AS hasImage,
				 (rawSIB IS NOT NULL) AS hasSIB,
				 (rawMidi IS NOT NULL) AS hasMidi,
				 (rawNotesPDF IS NOT NULL) AS hasNotesPDF
				FROM songs");

		return $songs;
	}

	public function getSongIndexForApp(){
		$index = [];

		$songs = $this->DB->fetchAll("SELECT id
			FROM songs
			WHERE license = 'FREE'
			AND status = 'DONE'");

		foreach($songs as $song_id){
			$model = new Song($song_id['id']);
			$song = $model->getData();
			$alternativeTitles = $song['alternativeTitles'];
			$title_uc = mb_convert_case($song['title'], MB_CASE_UPPER, "UTF-8");

			// accords
			$uncleaned_chords = $model->getChordList();
			$chords = [];
			foreach ($uncleaned_chords as $chord) {
				$cleaned = preg_replace("/[^A-Za-z0-9]/", '', $chord);
				if (!in_array($cleaned, $chords)){
					$chords[] = $cleaned;
				}
			}

			$index[] = [
				'id' => $song['id'],
				'title' => $title_uc,
				'pageRondoRed' => $song['pageRondoRed'],
				'pageRondoBlue' => $song['pageRondoBlue'],
				'pageRondoGreen' => $song['pageRondoGreen'],
				'pageRondo2017' => $song['pageRondo2017'],
				'interpret' => $song['interpret'],
				'chords' => $chords,
				'alternative' => false
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
						'alternative' => true
					];
				}
			}
		}
		usort($index, function($a, $b) {
			if (strtoupper($a['title']) < strtoupper($b['title'])) {
				return -1;
			} else {
				return 1;
			}
		});
		return $index;
	}
}