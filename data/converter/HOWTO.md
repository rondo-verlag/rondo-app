HowTo Import RSM Data
=====================

- Aktueller DB Dump lokal einspielen
- Neue Noten PDFs nach data/Dateien_ohne_Texte kopieren
- API endpoint aufrufen: song-manager/api/index.php/import/notespdf (Wenn nirgends "no song found for xx" steht ist alles gut gegangen)
- Neue MIDIs nach data/sibelius_export/midi kopieren
- API endpoint aufrufen: song-manager/api/index.php/import/midi (Wenn nirgends "no song found for xx" steht ist alles gut gegangen)
- Alles neu exportieren damit wir die aktuellsten PDFs & Midis haben mit ID als Namen: song-manager/api/index.php/export/zip
- DB Dump wieder hochladen
- Aktuelle Daten in den app/www/resources/songs/ Ordner mergen (und ggf. leeres "notes" verzeichnis erstellen)
- Alle zu konvertierenden PDF's auf "PDF2PNG Converter.app" ziehen per DND - die PNGs werden nun im notes Verzeichnis generiert (falls notes Verzeichnis nicht existiert, dieses zuerst erstellen)
