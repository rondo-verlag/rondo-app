<?php

namespace Rondo\RondoBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class SongAdmin extends Admin
{

	// Fields to be shown on create/edit forms
	protected function configureFormFields(FormMapper $formMapper)
	{
		$formMapper
			->add('title', 'text', array('label' => 'Titel'))
			->add('text', 'textarea', array(
				'label' => 'Sontext mit Akkorden',
				'attr' => array('rows' => '15'),
				'required' => false
			))
			->add('copyrightInfo', 'text', array('required' => false))
			->add('imageUploaded', 'file', array('required' => false))
			->add('isLicenseFree', 'checkbox', array('required' => false, 'label' => 'Lizenzfrei'))
			->add('status', 'choice', array('choices' => array(1 => 'Neu', 2 => 'In Bearbeitung', 3 => 'Fertig')))
		;
	}

	// Fields to be shown on filter forms
	protected function configureDatagridFilters(DatagridMapper $datagridMapper)
	{
		$datagridMapper
			->add('id')
			->add('title')
		;
	}

	// Fields to be shown on lists
	protected function configureListFields(ListMapper $listMapper)
	{
		$listMapper
			->addIdentifier('id')
			->addIdentifier('title', 'text', array('label' => 'Titel'))
			->add('isLicenseFree', 'boolean', array('label' => 'Lizenzfrei'))
			->add('status')
		;
	}

	public function uploadAction()
	{
		var_dump($this);
	}
}