<?php

namespace Rondo\RondoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Song
 *
 * @ORM\Table(name="songs")
 * @ORM\Entity
 */
class Song
{
    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="text", type="text", nullable=true)
     */
    private $text;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="blob", nullable=true)
     */
    private $image;

    /**
     * @var integer
     *
     * @ORM\Column(name="pageRondoRed", type="integer", nullable=true)
     */
    private $pagerondored;

    /**
     * @var integer
     *
     * @ORM\Column(name="pageRondoBlue", type="integer", nullable=true)
     */
    private $pagerondoblue;

    /**
     * @var integer
     *
     * @ORM\Column(name="pageRondoGreen", type="integer", nullable=true)
     */
    private $pagerondogreen;

    /**
     * @var boolean
     *
     * @ORM\Column(name="isLicenseFree", type="boolean", nullable=false)
     */
    private $islicensefree;

    /**
     * @var string
     *
     * @ORM\Column(name="copyrightInfo", type="text", nullable=true)
     */
    private $copyrightinfo;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="integer", nullable=false)
     */
    private $status;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;



    /**
     * Set title
     *
     * @param string $title
     * @return Song
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set text
     *
     * @param string $text
     * @return Song
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * Get text
     *
     * @return string 
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set image
     *
     * @param string $image
     * @return Song
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return string 
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set pagerondored
     *
     * @param integer $pagerondored
     * @return Song
     */
    public function setPagerondored($pagerondored)
    {
        $this->pagerondored = $pagerondored;

        return $this;
    }

    /**
     * Get pagerondored
     *
     * @return integer 
     */
    public function getPagerondored()
    {
        return $this->pagerondored;
    }

    /**
     * Set pagerondoblue
     *
     * @param integer $pagerondoblue
     * @return Song
     */
    public function setPagerondoblue($pagerondoblue)
    {
        $this->pagerondoblue = $pagerondoblue;

        return $this;
    }

    /**
     * Get pagerondoblue
     *
     * @return integer 
     */
    public function getPagerondoblue()
    {
        return $this->pagerondoblue;
    }

    /**
     * Set pagerondogreen
     *
     * @param integer $pagerondogreen
     * @return Song
     */
    public function setPagerondogreen($pagerondogreen)
    {
        $this->pagerondogreen = $pagerondogreen;

        return $this;
    }

    /**
     * Get pagerondogreen
     *
     * @return integer 
     */
    public function getPagerondogreen()
    {
        return $this->pagerondogreen;
    }

    /**
     * Set islicensefree
     *
     * @param boolean $islicensefree
     * @return Song
     */
    public function setIslicensefree($islicensefree)
    {
        $this->islicensefree = $islicensefree;

        return $this;
    }

    /**
     * Get islicensefree
     *
     * @return boolean 
     */
    public function getIslicensefree()
    {
        return $this->islicensefree;
    }

    /**
     * Set copyrightinfo
     *
     * @param string $copyrightinfo
     * @return Song
     */
    public function setCopyrightinfo($copyrightinfo)
    {
        $this->copyrightinfo = $copyrightinfo;

        return $this;
    }

    /**
     * Get copyrightinfo
     *
     * @return string 
     */
    public function getCopyrightinfo()
    {
        return $this->copyrightinfo;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return Song
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer 
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
}
