# Step by Step Tutorial zum Erstellen und bearbeiten von Alexa skills:

<b>Vorraussetzungen</b>: Du hast einen Amazon Account.

## Step 1:
Logge dich in den Developer account ein unter: https://developer.amazon.com/ (Du kannst deinen normalen Amazon account verwenden)
<Bild Step 1>

## Step 2:
Klicke auf Alexa in Navigationsmenu
<Bild Step 2>

## Step 3:
Klicke auf "Get Started" unter Alexa Skills Kit
<Bild Step 3>

## Step 4:
Klicke auf "Add a new Skill"
<Bild Step 4>

## Step 5:
Skill type ist custom interaction model
Invocation name ist der Name, dem man Alexa �bergibt, also "Alexa, open testing" um in den Skill zu starten/�ffnen
dann auf Save klicken und auf der n�chsten Seite einfach auf next klicken.
<Bild Step 5>

## Step 6:
Man kommt zum Intent Schema: Klicke auf launch Builder und gelangt zur Skill builder app. Bedenke: Alexasprache ist Englisch
<Bild Step 6>

## Step 7:
�ber Add k�nnen wir einen neuen Intent erstellen, als Referenz zu "understand" sind zB. "start", "translate", "next", "repeat" jeweils ein Intent. 
Es ist aber zu beachten, dass alexa nicht auf den Intent namen h�rt, sondern auf die sp�ter kommenden untterance versionen. 
Dieser Intent Name ist jedoch wichtig, weil es den Einsprungspunkt als Funktion in dem sp�ter erzeugten JavaScript-Code darstellt.
<Bild Step 7>

## Step 8:
Man w�hle einen Name f�r den custom intent und klicke auf "create intent"
<Bild Step 8>

## Step 9:
Gib eine Beispielhafte Sprechweise an, mitdem der Intent( oder auf JavaScript-Funktion ) gestartet werden kann. WICHTIG: vergiss nicht auf das Plus zu klicken, sonst wird die sample utterance nicht hinzugef�gt.
Ich habe hier gleich einen sogenannten "Intent-Slot" eingebaut, mit dem Alexa auf unterschiedliche W�rter im "fast gleichen" Satz reagieren kann.
Somit reagiert Alexa mit der gleichen JavaScript-Funktion auf die S�tze: "what is an alexa tutorial", "what is an alexa skill" und "what is an alexa problem".
In Step 10 bauen wir also erstmal einen slot.
<Bild Step 9>

## Step 10:
F�ge im linken Interaction Model �ber add einen Slot hinzu und gibt ihm einen Namen. Ich habe hier "type" gew�hlt, weil ich bereits einen type slot im questioning intent eingebaut habe.
<Bild Step 10>

## Step 11:
F�ge die jeweiligen Auspr�gungen des type Slots hinzu.
<Bild Step 11>

## Step 12:
Nun m�ssen wir nur noch den Slot "type", den wir gerade erstellt haben, mit dem "Intent-Slot type" in dem questioning intent verkn�pfen. Klicke dazu wieder auf den questioning intent. 
W�hle dann "choose a slot type" und dann in der Liste den von uns erstellten "type" slot. Nun sind die Slots verkn�pft und Alexa startet die JavaScript-Funktion "questioning" wenn sie 
innerhalb des "testing" Skills die S�tze "what is an alexa tutorial", "what is an alexa skill" oder "what is an alexa problem" h�rt.
<Bild Step 12>

## Step 13:
1st Speichere und 2nd baue das Model, dann 3rd �ffne den Code Editor.
<Bild Step 13>

## Step 14:
Kopiere den ganzen Code innerhalb des Code Editors mit STRG + A. STRG + C.   bzw. eurem System entsprechend.
<Bild Step 14>

## Step 15:
F�ge den in Step 14 kopierten Code in den Skillinator (https://skillinator.io/) auf der linken Seite ein. Klicke Generate um die Lambda Funktion zu generieren, die sp�ter zum Alexa-f�higen Ger�t hochgeladen wird.
Dieser Generierungsschritt mit dem Skillinator ist "nur" immer dann notwendig, wenn man einen Skill-Intent hinzugef�gt hat. 
Sollte man nur einen neuen Slot oder eine Utterance ver�ndert haben, dann reicht es das Interaction Model zu speichern und neu zu bauen wie in Step 13 mit 1st und 2nd gezeigt.
<Bild Step 15>

## Step 16:
Den Generierten Lambda-Code kopiert ihr wieder und k�nnt ihn im Code-Editor eurer Wahl wie zB Sublime oder Notepad bearbeiten.
Ihr seht relativ weit oben im Code, eine Auflistung von Intents, darunter ist neben den Stop-Intent von Amazon, mit dem ihr aus dem Skill heraus Alexa in den Ruhezustand versetzten k�nnt jetzt auch unser erstellter "questening"-Intent.
Wenn die sample Utterance zutrifft, wird hier die unter "questioning" zugewiesene JavaScript-Funktion aufgerufen.
Dabei ist anfangs noch ein Placeholder Text eingetragen. Siehe: "This is a place holder response for the intent named questioning. This intent has one slot, which is type. "... usw.
Diesen Text kann man jetzt beliebig ver�ndern, damit Alexa mit einem anderen Satz antwortet.
<Bild Step 16>

## Step 17:
Hat man den "questioning"-Intent angepasst, kann man diesen Endlich auf ein Echo-ger�t hochladen �ber den Lambda-Service von Amazon Web Services kurz AWS. 
Dazu hat Michael bereits auf dem Hackathon einen gesharten Account erstellt. Log dich unter https://256608350746.signin.aws.amazon.com/console mit den folgenden Daten ein: 
Account ID or alias
256608350746

IAM user name
innohacks

Password
innohacks2017

<Bild Step 17>

## Step 18:
W�hle den Lambda-Service aus und beachte, dass oben rechts Ireland (EU) ausgew�hlt ist. Sollte aber bereits eingestellt sein.
<Bild Step 18>

## Step 19:
Unter Lambda erstellen wir eine neuen Lambda Function mit "Create Function".
<Bild Step 19>

## Step 20:
Wir klicken "Author from Scratch"
<Bild Step 20>

## Step 21:
Wir w�hlen den Namen. Ich habe hier questening_Konstantin gew�hlt, damit man ihn gut unterscheiden kann. Diese Funktion hat bisher "noch" nichts mit dem Skill zu tun. W�hle die Rolle und klicke auf create Function
<Bild Step 21>

## Step 22:
Wir f�gen den Lambda Code aus dem Skillinator in eine index.js und zippen diese zusammen mit einem node_modules Ordner zu einem Packet, das wir per file updoad hochladen. 
Der node_modules Ordner muss das alexa-sdk enthalten, bzw. alle im Code requirten Libraries.
Hier findet ihr ein funktionierendes Beispielpaket mit dem questioning skill in der index.js: https://www.dropbox.com/s/xpbz61ihs2p8f1r/questioning.zip?dl=0
Jetzt solltest du den gelb markierten ARN Code kopieren, der f�r die Skill Konfiguration ben�tigt wird.
<Bild Step 22>

## Step 22-1:
Klicke wie in Bild 22.1 gezeigt auf den Trigger tab und f�ge einen Trigger hinzu.
Dann klicke wie in Bild 22.2 gezeigt auf das leere Quadrat und f�ge "Alexa Skills Kit" aus der Liste hinzu um der Lambda funktion zu sagen, dass Sie durch den Alexa Skill getriggert werden kann.
Nun klicke auf "Submit".

Klicke Save und Test klicken. Oben rechts.
<Bild Step 22-1>

## Step 23:
Bevor wir in dem aufgepoppten Test-Modal was eingeben, m�ssen wir noch den Skill zuende konfigurieren: Gehe dazu wieder zu dem Developer-account und klicke auf Configuration in deinem Skill. Siehe Bild 23.
w�hle Lambda ARN und f�ge den kopierten ARN Code ein. Klicke dann auf "Next" am Seitenende.
<Bild Step 23>

## Step 24:
Sobald der Skill konfiguriert ist, kann muss man ihn testen. Gibt eine sample utterance unter dem Textfeld and und klicke auf "Ask myNewSkill". 
Es wird eine Anfrage and die verkn�pfte Lambda-Funktion gemacht. Diesen Service Request im linken Fenster unter "Ask myNewSkill" kopierst du komplett und f�gst ihn in das aufgepoppte Test-Modal in der AWS Lambda-Funktion ein.
<Bild Step 24>

## Step 25:
Hier kommt der Test Service-Request rein, mit dem dein Skill getestet wird. Speichern und laufen lassen. Wenn der alert gr�n ist, hat alles geklappt und du kannst den Skill jetzt auf dem Echo testen.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step25.png?sanitize=true">
</h3>



### Aufgabe 1 - Erstelle einen neuen Skill mit der mit happyness ge�ffnet werden kann.
1. Erstelle einen Intent: Ich bin traurig, woraufhin Alexa dich aufmuntert.
2. Erstelle zweiten Intent: Ich bin gl�cklich, woraufhin Alexa sich mit dir freut.
3. Erstelle dritten Intent: Ich bin gelangweilt, woraufhin Alexa dir Aktivit�ten vorschl�gt.
4. Erstelle mit dem Skillinator einen Lambda-Code.
5. Erstelle eine Lambda-funktion unter AWS Lambda und verkn�pfe den Skill �ber eine ARN-Nummer mit der Lambda-Funktion. Vergiss den Trigger nicht.
6. Teste deinen Skill mit einem Service Request aus deinem Skill unter dem Test Reiter, nachdem du den neuen Code als Zip Datei hochgeladen hast.