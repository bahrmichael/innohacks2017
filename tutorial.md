# Step by Step Tutorial zum Erstellen und bearbeiten von Alexa skills:
  Vorraussetzungen: Du hast einen Amazon Account.

## Step 1:
Logge dich in den Developer account ein unter: https://developer.amazon.com/ (Du kannst deinen normalen Amazon account verwenden)
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step1.PNG?sanitize=true">
</h3>

## Step 2:
Klicke auf Alexa in Navigationsmenu
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step2.PNG?sanitize=true">
</h3>

## Step 3:
Klicke auf "Get Started" unter Alexa Skills Kit
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step3.PNG?sanitize=true">
</h3>

## Step 4:
Klicke auf "Add a new Skill"
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step4.PNG?sanitize=true">
</h3>

## Step 5:
Skill type ist custom interaction model
Invocation name ist der Name, dem man Alexa übergibt, also "Alexa, open testing" um in den Skill zu starten/öffnen
dann auf Save klicken und auf der nächsten Seite einfach auf next klicken.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step5.PNG?sanitize=true">
</h3>

## Step 6:
Man kommt zum Intent Schema: Klicke auf launch Builder und gelangt zur Skill builder app. Bedenke: Alexasprache ist Englisch
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step6.PNG?sanitize=true">
</h3>

## Step 7:
Über Add können wir einen neuen Intent erstellen, als Referenz zu "understand" sind zB. "start", "translate", "next", "repeat" jeweils ein Intent. 
Es ist aber zu beachten, dass alexa nicht auf den Intent namen hört, sondern auf die später kommenden untterance versionen. 
Dieser Intent Name ist jedoch wichtig, weil es den Einsprungspunkt als Funktion in dem später erzeugten JavaScript-Code darstellt.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step7.PNG?sanitize=true">
</h3>

## Step 8:
Man wähle einen Name für den custom intent und klicke auf "create intent"
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step8.PNG?sanitize=true">
</h3>

## Step 9:
Gib eine Beispielhafte Sprechweise an, mitdem der Intent( oder auf JavaScript-Funktion ) gestartet werden kann. WICHTIG: vergiss nicht auf das Plus zu klicken, sonst wird die sample utterance nicht hinzugefügt.
Ich habe hier gleich einen sogenannten "Intent-Slot" eingebaut, mit dem Alexa auf unterschiedliche Wörter im "fast gleichen" Satz reagieren kann.
Somit reagiert Alexa mit der gleichen JavaScript-Funktion auf die Sätze: "what is an alexa tutorial", "what is an alexa skill" und "what is an alexa problem".
In Step 10 bauen wir also erstmal einen slot.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step9.PNG?sanitize=true">
</h3>

## Step 10:
Füge im linken Interaction Model über add einen Slot hinzu und gibt ihm einen Namen. Ich habe hier "type" gewählt, weil ich bereits einen type slot im questioning intent eingebaut habe.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step10.PNG?sanitize=true">
</h3>

## Step 11:
Füge die jeweiligen Ausprägungen des type Slots hinzu.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step11.PNG?sanitize=true">
</h3>

## Step 12:
Nun müssen wir nur noch den Slot "type", den wir gerade erstellt haben, mit dem "Intent-Slot type" in dem questioning intent verknüpfen. Klicke dazu wieder auf den questioning intent. 
Wähle dann "choose a slot type" und dann in der Liste den von uns erstellten "type" slot. Nun sind die Slots verknüpft und Alexa startet die JavaScript-Funktion "questioning" wenn sie 
innerhalb des "testing" Skills die Sätze "what is an alexa tutorial", "what is an alexa skill" oder "what is an alexa problem" hört.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step12.PNG?sanitize=true">
</h3>

## Step 13:
1st Speichere und 2nd baue das Model, dann 3rd öffne den Code Editor.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step13.PNG?sanitize=true">
</h3>

## Step 14:
Kopiere den ganzen Code innerhalb des Code Editors mit STRG + A. STRG + C.   bzw. eurem System entsprechend.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step14.PNG?sanitize=true">
</h3>

## Step 15:
Füge den in Step 14 kopierten Code in den Skillinator (https://skillinator.io/) auf der linken Seite ein. Klicke Generate um die Lambda Funktion zu generieren, die später zum Alexa-fähigen Gerät hochgeladen wird.
Dieser Generierungsschritt mit dem Skillinator ist "nur" immer dann notwendig, wenn man einen Skill-Intent hinzugefügt hat. 
Sollte man nur einen neuen Slot oder eine Utterance verändert haben, dann reicht es das Interaction Model zu speichern und neu zu bauen wie in Step 13 mit 1st und 2nd gezeigt.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step15.PNG?sanitize=true">
</h3>

## Step 16:
Den Generierten Lambda-Code kopiert ihr wieder und könnt ihn im Code-Editor eurer Wahl wie zB Sublime oder Notepad bearbeiten.
Ihr seht relativ weit oben im Code, eine Auflistung von Intents, darunter ist neben den Stop-Intent von Amazon, mit dem ihr aus dem Skill heraus Alexa in den Ruhezustand versetzten könnt jetzt auch unser erstellter "questening"-Intent.
Wenn die sample Utterance zutrifft, wird hier die unter "questioning" zugewiesene JavaScript-Funktion aufgerufen.
Dabei ist anfangs noch ein Placeholder Text eingetragen. Siehe: "This is a place holder response for the intent named questioning. This intent has one slot, which is type. "... usw.
Diesen Text kann man jetzt beliebig verändern, damit Alexa mit einem anderen Satz antwortet.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step16.PNG?sanitize=true">
</h3>

## Step 17:
Hat man den "questioning"-Intent angepasst, kann man diesen Endlich auf ein Echo-gerät hochladen über den Lambda-Service von Amazon Web Services kurz AWS. 
Dazu hat Michael bereits auf dem Hackathon einen gesharten Account erstellt. Log dich unter https://256608350746.signin.aws.amazon.com/console mit den folgenden Daten ein: 
Account ID or alias
256608350746

IAM user name
innohacks

Password
innohacks2017
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step17.PNG?sanitize=true">
</h3>

## Step 18:
Wähle den Lambda-Service aus und beachte, dass oben rechts Ireland (EU) ausgewählt ist. Sollte aber bereits eingestellt sein.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step18.PNG?sanitize=true">
</h3>

## Step 19:
Unter Lambda erstellen wir eine neuen Lambda Function mit "Create Function".
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step19.PNG?sanitize=true">
</h3>

## Step 20:
Wir klicken "Author from Scratch"
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step20.PNG?sanitize=true">
</h3>

## Step 21:
Wir wählen den Namen. Ich habe hier questening_Konstantin gewählt, damit man ihn gut unterscheiden kann. Diese Funktion hat bisher "noch" nichts mit dem Skill zu tun. Wähle die Rolle und klicke auf create Function
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step21.PNG?sanitize=true">
</h3>

## Step 22:
Wir fügen den Lambda Code aus dem Skillinator in eine index.js und zippen diese zusammen mit einem node_modules Ordner zu einem Packet, das wir per file updoad hochladen. 
Der node_modules Ordner muss das alexa-sdk enthalten, bzw. alle im Code requirten Libraries.
Hier findet ihr ein funktionierendes Beispielpaket mit dem questioning skill in der index.js: https://www.dropbox.com/s/xpbz61ihs2p8f1r/questioning.zip?dl=0
Jetzt solltest du den gelb markierten ARN Code kopieren, der für die Skill Konfiguration benötigt wird.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step22.PNG?sanitize=true">
</h3>

## Step 22-1:
Klicke wie in Bild 22.1 gezeigt auf den Trigger tab und füge einen Trigger hinzu.
Dann klicke wie in Bild 22.2 gezeigt auf das leere Quadrat und füge "Alexa Skills Kit" aus der Liste hinzu um der Lambda funktion zu sagen, dass Sie durch den Alexa Skill getriggert werden kann.
Nun klicke auf "Submit".

Klicke Save und Test klicken. Oben rechts.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step22-1.PNG?sanitize=true">
</h3>
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step22-2.PNG?sanitize=true">
</h3>

## Step 23:
Bevor wir in dem aufgepoppten Test-Modal was eingeben, müssen wir noch den Skill zuende konfigurieren: Gehe dazu wieder zu dem Developer-account und klicke auf Configuration in deinem Skill. Siehe Bild 23.
wähle Lambda ARN und füge den kopierten ARN Code ein. Klicke dann auf "Next" am Seitenende.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step23.PNG?sanitize=true">
</h3>

## Step 24:
Sobald der Skill konfiguriert ist, kann muss man ihn testen. Gibt eine sample utterance unter dem Textfeld and und klicke auf "Ask myNewSkill". 
Es wird eine Anfrage and die verknüpfte Lambda-Funktion gemacht. Diesen Service Request im linken Fenster unter "Ask myNewSkill" kopierst du komplett und fügst ihn in das aufgepoppte Test-Modal in der AWS Lambda-Funktion ein.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step24.PNG?sanitize=true">
</h3>

## Step 25:
Hier kommt der Test Service-Request rein, mit dem dein Skill getestet wird. Speichern und laufen lassen. Wenn der alert grün ist, hat alles geklappt und du kannst den Skill jetzt auf dem Echo testen.
<h3 align="center">
    <img src="https://raw.githubusercontent.com/bahrmichael/innohacks2017/master/images/step25.PNG?sanitize=true">
</h3>



### Aufgabe 1 - Erstelle einen neuen Skill mit der mit happyness geöffnet werden kann.
0. Erstelle einen neuen Skill mit einem neuen Interaction Model.
1. Erstelle einen Intent: Ich bin traurig, woraufhin Alexa dich aufmuntert.
2. Erstelle zweiten Intent: Ich bin glücklich, woraufhin Alexa sich mit dir freut.
3. Erstelle dritten Intent: Ich bin gelangweilt, woraufhin Alexa dir Aktivitäten vorschlägt.
4. Erstelle mit dem Skillinator einen Lambda-Code.
5. Erstelle eine Lambda-funktion unter AWS Lambda und verknüpfe den Skill über eine ARN-Nummer mit der Lambda-Funktion. Vergiss den Trigger nicht.
6. Teste deinen Skill mit einem Service Request aus deinem Skill unter dem Test Reiter, nachdem du den neuen Code als Zip Datei hochgeladen hast.