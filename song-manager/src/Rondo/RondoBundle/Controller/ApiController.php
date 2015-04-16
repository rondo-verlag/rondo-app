<?php

namespace Rondo\RondoBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Rondo\RondoBundle\Entity\Song;

class ApiController extends FOSRestController {

	/**
	 * Get the list of songs
	 *
	 * @return array data
	 */
	public function getSongsAction()
	{
		$fields = array('s.id', 's.title', 's.islicensefree', 's.status');
		$repository = $this->getDoctrine()->getRepository('RondoBundle:Song');
		$entities = $repository->createQueryBuilder('s')->select($fields)->getQuery()->getResult();

		return $this->handleView($this->view($entities, 200));
	}

	/**
	 * Get song data by Id
	 *
	 * @param int $id Song Id
	 * @return array data
	 */
	public function getSongAction($id)
	{
		$repository = $this->getDoctrine()->getRepository('RondoBundle:Song');
		$entity = $repository->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('No Song with ID '.$id);
		}

		return $this->handleView($this->view($entity, 200));
	}

	/**
	 * Put action
	 * @var Request $request
	 * @var integer $id Id of the entity
	 * @return View|array
	 */
	public function putSongAction(Request $request, $id)
	{
		//var_dump($request->request->get('title'), $id);

		$repository = $this->getDoctrine()->getRepository('RondoBundle:Song');
		$em = $this->getDoctrine()->getManager();
		$entity = $repository->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('No Song with ID '.$id);
		}

		// update fields
		$entity->setTitle($request->request->get('title'));
		$entity->setText($request->request->get('text'));
		$entity->setIslicensefree($request->request->get('islicensefree'));

		$em->persist($entity);
		$em->flush();

		return $this->handleView($this->view('ok', 200));
	}

	public function postSongAction($id)
	{
		// todo
	}

	public function deleteSongAction($id)
	{
		// todo
	}

	public function postSongMusicxmlfileAction(Request $request, $id)
	{
		$fileContent = null;
		if (isset($_FILES['file']['tmp_name'])){
			$fileContent = file_get_contents($_FILES['file']['tmp_name']);
		} else {
			$fileContent = $request->getContent();
		}

		$crd = $this->xml2crd($fileContent);

		$repository = $this->getDoctrine()->getRepository('RondoBundle:Song');
		$em = $this->getDoctrine()->getManager();
		$entity = $repository->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('No Song with ID '.$id);
		}

		//var_dump($crd);
		// update text
		$entity->setText($crd);

		$em->persist($entity);
		$em->flush();

		return $this->handleView($this->view($crd, 200));
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