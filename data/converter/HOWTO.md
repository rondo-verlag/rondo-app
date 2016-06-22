HowTo Convert PDF To Images
===========================

- Aktueller DB Dump lokal einspielen
- Neue Noten PDFs nach data/Dateien_ohne_Texte kopieren
- API endpoint aufrufen: song-manager/api/index.php/importnotespdf (Wenn nirgends "no song found for xx" steht ist alles gut gegangen)
- Alles neu exportieren damit wir die aktuellsten PDFs haben mit ID als Namen: song-manager/api/index.php/export/zip 
- DB Dump wieder hochladen
- Aktuelle Daten in den app/www/resources/songs/ Ordner mergen (und ggf. leeres "notes" verzeichnis erstellen)
- Alle zu konvertierenden PDF's auf "PDF2PNG Converter.app" ziehen per DND - die PNGs werden nun im notes Verzeichnis generiert
- Das script negate_images_in_folder.php in den notes Ordner kopieren und auf der Konsole ausführen: "php negate_images_in_folder.php"
- Alle Bilder im neuen "converted" Ordner rauskopieren und danach den Ordner und script wieder löschen
