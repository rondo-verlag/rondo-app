<?php

namespace Rondo\RondoBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WebController extends Controller
{
    public function indexAction()
    {
        return $this->render('RondoBundle:Default:index.html.twig');
    }
}
