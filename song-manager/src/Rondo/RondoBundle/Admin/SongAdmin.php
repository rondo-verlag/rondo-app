<?php

namespace Rondo\RondoBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class SongAdmin extends Admin
{

	//protected $baseRouteName = 'RondoBundle\Admin\SongAdmin';
	//protected $baseRoutePattern = 'song';

	// Fields to be shown on create/edit forms
	protected function configureFormFields(FormMapper $formMapper)
	{
		$formMapper
			->add('title', 'text', array('label' => 'Song Title'))
			->add('text', 'text')
			->add('copyrightInfo', 'text')
			->add('isLicenseFree', 'checkbox')
			->add('status')
		;
	}

	// Fields to be shown on filter forms
	protected function configureDatagridFilters(DatagridMapper $datagridMapper)
	{
		$datagridMapper
			->add('id')
			->add('title')
			//->add('isLicenseFree')
			->add('status')
		;
	}

	// Fields to be shown on lists
	protected function configureListFields(ListMapper $listMapper)
	{
		$listMapper
			->addIdentifier('id')
			->addIdentifier('title')
			->add('isLicenseFree')
			->add('status')
		;
	}
}