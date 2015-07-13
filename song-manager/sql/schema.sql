CREATE TABLE `songs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `text` longtext,
  `alternativeTitles` longtext,
  `pageRondoRed` int(11) DEFAULT NULL,
  `pageRondoBlue` int(11) DEFAULT NULL,
  `pageRondoGreen` int(11) DEFAULT NULL,
  `isLicenseFree` tinyint(1) NOT NULL DEFAULT '0',
  `copyrightInfo` text,
  `comments` text,
  `status` int(11) NOT NULL DEFAULT '0',
  `updated` int(11) DEFAULT NULL,
  `image` mediumblob,
  `rawXML` longblob,
  `rawSIB` longblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=541 DEFAULT CHARSET=utf8;