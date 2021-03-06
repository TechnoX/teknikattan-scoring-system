
# Bakgrund: 

Fredrik Löfgren har varit involverad i teknikåttan flera år som moderator och irriterade sig på att det var så mycket papper som skickades runt hela tiden. Vi lever på 2000-talet och det här är en tekniktävling. Det måste gå att digitalisera!! Alltifrån resultathantering (som tidigare faktiskt skedde i excel), till presentationen av frågorna till deltagande lag (som tidigare fick frågorna på papper). Men framförallt hantering av alla svaren som deltagarna producerar, de borde kunna fyllas i digitalt och skickas trådlöst till domarna istället för att springa runt med lösblad i lokalen. 


# Teknisk utrustning för att köra tävlingen

Man kan välja hur många delar man vill använda sig av. Till exempel kan man låta lagen fortfarande svara på papper, men låta frågorna presenteras i båsen på ipads eller datorskärmar, och då bläddras lagens frågetexter fram samtidigt som projektorbilden ändras. Annars kan man välja att lagen svarar på ipads men frågorna kommer på papper, eller så svarar lagen på papper men resultatlistan hanteras via systemet. Möjligheterna är många!


Här nedan beskrivs hur vi brukar använda systemet i Linköping och vilken utrustning som vi använder:


## Till lagen (upprepa nedanstående för varje lag)

 * En ipad / tablet / padda där de fyller i sina svar. Vi köpte den billigaste 10 tums skärmen vi kunde hitta. 
 * En större skärm (ungefär i storlek som 2st A4 papper) där frågetexterna presenteras.
 * Ett bord
 * Tre stolar
 * Kladdpapper



## Till domarna

 * En laptop till varje domare. Bra för att både se svaren som lagen skriver och fylla i rätt poäng. Är smidigt att ha en domare som sköter kontakten med speaker och resterande domare fokuserar på poängen
 * Bord
 * En stol till varje domare
 * Kladdpapper



## Till personen som styr projektorn (och hela tävlingen egentligen)

 * En laptop



## Ljud

 * Mikrofoner till lagen
 * Mikrofon till speaker
 * Mikrofon till domarna
 * Mikrofon som speaker kan använda för att intervjua publiken
 * Ljudutrustning (högtalare, mikrofonmottagare etc.)
 * En laptop för bakgrundsmusik / musik under betänketiden.



## Bild

 * En stationär kamera i varje tävlingsbås, en stationär kamera som filmar domarna, en rörlig kamera, en eller två som tar upp hela scenen, nån som filmar ut mot publiken (om GDPR tillåter). 
 * En dator som bildmixrar, för att kunna klippa in bilder från bås mellan frågorna, även kunna klippa in specialgrafik som prisutdelning och annan information. Körs utan ljudstream
 * En annan dator som styr youtube streamen, för att kunna streama tävlingen till parallellklasserna. Tar in samma bildkällor som ovanstående dator. Ska också ta in ljudstreamen. Kan streama ut vad de säger i båsen till youtube, men det ljudet får inte gå ut i lokalen eftersom då kan de andra lagen höra vad konkurrenterna säger. 



## Övrigt
 * För att slippa ha en dator till varje bås kör vi med en enda dator för alla bås och en HDMI splitter som skickar ut samma bild till alla skärmarna i båsen. Det blir billigare och säkerställer att alla båsen ser exakt samma bild hela tiden. Men har man flera laptops eller stationära dator kan man såklart använda dem i båsen också. Bara man inte exponerar tangentbord och mus för deltagarna, de ska inte kunna använda datorn, det är bara själva skärmen som behövs för att presentera frågorna.
 * Systemet som kör tävlingen ligger på en linux-dator. Förslagsvis på en server som teknikåttan tillhandahåller. Men vill man köra lokalt går det med vilken linux-dator som helst, även en raspberry pi bör fungera. Den sätter upp en lokal webbserver som man ansluter till via datorns IP-address på port 3000. Mer information om hur systemet installeras finns nedan. 


# Beskrivning av hur man använder systemet


Eftersom det är rätt svårt att beskriva hur man använder systemet i text har jag gjort ett antal videoklipp där jag visar och berättar. Tror det är enklare att förstå då. 


## Administration

För de som administrerar tävlingen / tävlingar. Hur man skapar användare. Hur man skapar tävlingar. Lägger in lag. Tar bort lag. Även analys av svaren i efterhand, ta reda på vilka frågor som var svåra eller enkla etc. 

[![Videotutorial om administration](http://img.youtube.com/vi/B6QhVMz9uAc/0.jpg)](http://www.youtube.com/watch?v=B6QhVMz9uAc "Hur man administrerar systemet")

## Lägga in frågor

För de som lägger in frågorna. Det behövs oftast bara göras nationellt och sen kan alla frågor kopieras ut till alla tävlingsorter. Men om lokala arrangörer vill ändra något i sina frågor kan det vara värt att titta på den här videon ändå.

[![Videotutorial om frågehantering](http://img.youtube.com/vi/s_s_JCi80Ag/0.jpg)](https://www.youtube.com/watch?v=s_s_JCi80Ag "Redigera, ta bort och lägg till frågor")


## Under tävlingsdagen, för den som bläddrar fram presentationen

Att bläddra fram rätt fråga, starta tidtagaruret, bläddra bakåt i presentationen om något gått fel. Ha koll på de olika frågetyperna. Starta betänketidsmusik separat. 

[![Videotutorial för hur man styr tävlingen](http://img.youtube.com/vi/E9FPklAl4Fk/0.jpg)](http://www.youtube.com/watch?v=E9FPklAl4Fk "Att styra tävlingen, bläddrar mellan frågor och starta nedräkning")

## Under tävlingsdagen, för lagen att svara på frågor och domarna att bedöma

Hur deltagarna svarar på de olika typerna av frågor. Vara beredd på att frågor låses när tiden tar slut och då kan man inte svara något mer, allt måste svaras inom betänketiden. Vad domarna ska fylla i och hur de ser lagens svar.

[![Videotutorial för deltagarna att svara och domarna att bedömma svar](http://img.youtube.com/vi/nUAvKJ7yEUM/0.jpg)](http://www.youtube.com/watch?v=nUAvKJ7yEUM "Vyn för deltagare där de svarar, och för domarna där de poängsätter")







# Installation:

## Förutsättningar
 * git
 * npm


## Steg-för-steg

 * Börja med att dra ned repot:

         git clone https://github.com/TechnoX/teknikattan-scoring-system.git

 * Ställ dig i mappen som du nyss laddade ned:

         cd teknikattan-scoring-system
         
 * Skapa en lokal kopia av config filen:

         cp config_git.js config.js

 * Öppna filen `config.js` och ändra frasen passwd till något längre och hemligare.

 * Dra ned alla backend-dependencies:

         npm install

 * Starta mongodb

         sudo systemctl start mongod

 * Skapa någon default användare som du sen kan använda för att logga in i systemet

         mongoimport --db teknikattan --collection users --file example_users.json

 * Slutligen kan vi starta systemet med

         pm2 start server.js

 * Öppna webbläsaren och besök http://localhost:3000/ om allt gått rätt ska du nu kunna logga in på systmet med användarnamn Fredrik och lösenord ASDF
 
 * Glöm inte att byta lösenord det första du gör på exempelanvändaren. Alternativt skapa en ny användare och ta bort den första.
 
 * För att starta om vid någon ändringar använder jag

         pm2 restart server.js

 * För att se loggar live använder jag

         pm2 monit


Läs mer i pm2's dokumentation: https://pm2.keymetrics.io/ 






# Teknisk specifikation och detaljer: 




## Backend

Serverns entry-point är i server.js, där sätts allt upp. 


Backenden är skriven i NodeJS med express för routing, ett REST-API finns exposat under /api (alla endpoints utom login finns i rest.js). 

Att login ligger separat handlar om att allt annat kräven en auth-token för att laddas in, Jag använder mig av npm paketet jsonwebtoken för authensiering (se auth.js). På front-enden använder jag ett angular-addon för jsonwebtoken som skickar med token i varje anrop. Sparar token i localwebstorag (se public/js/init.js längst ned, samt public/js/loginCtrl.js för mer info). 

För att ladda upp media använder jag mig av connect-multiparty. Det finns mer info i rest.js under endpointen /api/upload (post för att ladda upp, och delete för att radera). 

Socket.io används för att pusha ut ändringar till klienter utan att behöva polla servern hela tiden. Till exempel när presentationen och svarsskärmen ska bläddra vidare till nästa slide. Eller när domarna uppdaterar poängställningen så pushas de ändringarna ut till resultatlistan med socket.io. 

Backenden är uppdelad i ett antal filer: 
 * `server.js`

   Huvudfilen som startar servern. Hanterar default endpoint som serverar index.html, samt /api/login endpointen. 
 * `rest.js`

   Innehåller alla /api-endpoints
 * `db.js`

   Innehåller alla läsningar och skrivningar till databasen. 
 * `socket.js` 

   Innehåller alla asynkrona saker som skickas till klienten dynamiskt. Huvudsakligen: Bläddra framåt och bakåt i presentationen, starta och stoppa timer samt publicera poäng till resultatlista, och svaren som lagen skriver till domarna. 
 * `auth.js`

   Innehåller autensiering och säkerhet. 
 * `config.js`

   Ligger inte på git. Innehåller token för att signera och verifiera tokens. Kolla config_git.js för ett exempel. 
 * `fsm.js`

   Är en finate state machine, som simulerar en hel tävling och genererar slideshow collection i databasen. Man skulle kunna se den här filen som en kompilator som kompilerar ihop en tävling utifrån ändringarna gjorda i fråge-editorn. 







För att starta systemet brukar jag använda pm2 som installeras med `npm install pm2`: 

    pm2 start server

Eller om den redan är igång: 

    pm2 restart server



## Front-end 

Systemet byggdes från början med jQuery (2018), men det övergavs snabbt eftersom det blandade logik och presentation. Det användes på regionfinalen i Linköping 2018. Sen skrevs systemet om med AngularJS och det används fortfarande. Borde egentligen uppdatera till någon mer modern teknik, som Angular 7, eller React. Men inte fått tid till det. 


All front-end ligger i public mappen, och den exposas också av express, så alla filer i public-mappen är åtkomliga utan lösenord eller autensiering. 

Systemet använder angular-routing för navigering mellan sidorna. Alla endpoints finns listade i public/js/init.js. Den enda HTML-fil som laddas in är public/index.html, resten laddas in med angular. Mycket hämtas från /api endpointen. 


I public finns 6 mappar: 
 * **css**

   Innehåller två filer, dels reset.css som nollställer alla elements formatering för att få lika start i alla webbläsare, och dels main.css som innehåller all formatering för teknikåttan. Kanske borde göras om med sass eller nått... 
 * **images**

   Innehåller statiska bilder som tävlingen nyttjar. Innehåller inte så mycket då de flesta ikoner är tagna från font-awesome och läggs in med css-klasser istället. 
 * **uploads**

   User-content, saker som användare laddat upp. Observera att denna mapp inte ligger på git, utan den måste skapas manuellt. Viktigt att den skapas för att man ska kunna ladda upp media!
 * **js**

   All javascript, återkommer till det
 * **templates**

   Angular-templates, för till exempel olika modals som öppnas, men också för tag-specifika direktiv, som tävlingsvyn eller projektorvyn. De används bland annat av kontrolldatorn som ser både föregående, nuvarande och nästa vy. 
 * **view**

   Angular-views, saker som ska laddas in av angular-routingen


### Olika javascriptfiler: 

 Till varje view hör en controller. De syns listade i public/js/init.js, några exempel: 

 * `managementCtrl.js`

   Styr alla tråkiga html-formulär och tabeller, mycket slussa data fram och tillbaka. Till exempel användare, tävlingsorter och lista över alla tävlingar. 
 * `neweditorCtrl.js`

   Frågeeditorn, ganska komplex. Detta är den nya versionen, fanns en tidigare som hette editorCtrl.js förut, största skillnden var att i gamla editorn kunde man se både projektorvyn och deltagarvyn bredvid varandra samtidigt, medan man i den nya editorn bläddrar mellan de olika vyerna. 
 * `loginCtrl.js`

   Hanterar inloggning och utloggning.
 * `resultCtrl.js`

   Innehåller dels result controllern, men också ett highlighter direktiv som lyser upp cellen som ändras i resultatlistan. Result controllern lyssnar på "scoring" event som kommer med socket.io och uppdaterar poäng, kontrollern räknar också ut totalsumman för varje lag. 
 * `judgeCtrl.js`

   Används för att visa vad lagen svarar, samt fylla i poäng för lagen. Borde kanske separeras i två olika kontrollers. Svaren kommer via socket.io eventet "answer" och de formateras enligt nuvarande fråga, dvs om det är en sant-eller falskt, ledtråd eller fritext så presenteras lagets svar på olika sätt. Vilken fråga som är aktuell just nu kommer via socket.io eventet "view_changed". Poängställningen uppdateras på servern med ett post-anrop till /api/team. Poängen summeras med en likadan funktion som användes i resultCtrl.js.
 * `controlCtrl.js`

   Bläddrar mellan olika slides, både framåt och bakåt. Antingen genom knappar eller genom att använda tangentbordet. Minns inte riktigt varför jag använder socket.io emit för att skicka knapptryckningar till servern, borde gå med vanliga post anrop också. Det emittas "next" för att gå framåt och "prev" för att gå bakåt. 
Den här vyn har också koll på tiden och när tiden tar slut så spelas ett ljud upp på den här vyn. Aktuell tid kommer med socket.io eventet "time" så alla vyer delar en och samma klocka som ligger på backenden. När tiden tar slut kommer eventet "timesUp". 
Lyssnar också på socket.io eventet "view_changed" och uppdaterar vyn i så fall, så ska gå att ha flera webbläsarfönster uppe med controllern samtidigt och de är ändå synkade mellan varandra. 
 * `questionCtrl.js`

   Laddar in nuvarande fråga och uppdaterar vyn när det kommer ett event på "view_changed". Lyssnar också på "time" för att kunna uppdatera tiden kontinuerligt. Denna kontroller används av projektorvyn, deltagarvyn och nedräkningsvyn. 
 * `answerCtrl.js`

   Innhåller all login för svarsskärmen, både answercontrollern, men också ett gäng direktiv: 
   * **multipleChoices:** Används för att flervalsfrågor ska kunna göras om till en semikolonseparerad lista som den sparas i databasen som, vore bättre med en annan struktur där. Men alla svar på delfrågor är idag strängar. Så måste packas ihop och packas upp med detta direktiv. 
   * **stringTonumber:** Gör om sträng till tal, och vice versa för de frågor där ett tal efterfrågas. 
   * **setFocus:** Sätter fokus på den ledtrådsrad som är aktuell just nu. Hoppar automatiskt ned en rad med markören när tiden tar slut och föregående rad låses. 

   I övrigt så innehåller answer controllern socket.io eventet "view_changed" som uppdaterar hur sidan ska se ut, vilken sorts svar som efterfrågas, samt om laget redan svarat tidigare så laddas även det svaret in. Socket.io eventet "timesUp" används för att låsa svarsskärmen så inte laget kan fylla i något mer. Så fort laget ändrar något så ska det postas till servern, det görs med en angular $watch eftersom datastrukturen för answers är olika beroende på fråga. Filen innehåller också en del för logiken när man drar streck mellan alternativ (med hjälp av biblioteket jsPlumb). 
 * `analyticsCtrl.js`

   Visar svar från många olika tävlingar samtidigt. Använder inte någon socket.io idag, utan måste laddas om manuellt om svaren uppdateras. Sidan är tänkt att användas i efterhand för att analysera svaren. 





## Databas
Databasen är mongodb, databasen heter "teknikattan". 

De collections som finns är: 

 * **cities**

   Tävlingsorter, typ Linköping eller Borlänge. 

   Fält: ID och namn.
 * **competitions**

   Tävlingar, typ Riksfinal i Linköping 2019, eller Regionsemifinal i Lund 2017. 

   Fält: ID, Namn, ort och år. Även senast ändrad, men funderar på att ta bort. OBS! Innehåller inte frågedata.
 * **media**

   Innehåller alla videoklipp och bilder som laddats upp till servern. För att kunna återanvända media mellan flera tävlingar, och för att kunna ta bort media som inte längre används. 

   Fält: ID, filnamn och huruvida det är en bild eller videoklipp
 * **questions**

   All frågeinformation. I redigerbart skick för frågeeditorn. 
 * **slideshow**

   All frågeinformation duplicerad. Detta är mer som en kompilerad version av questions collectionen. Den här genereras automatiskt så fort man sparar något i fråge-editorn. 
 * **teams**

   Alla deltagande lag och deras poäng, och vad de svarat på varje fråga. 

   Fält: ID, tävling, namn, poäng som en array, svar som en array av arrayer (eftersom vissa frågor innehåller flera delfrågor). 
 * **users**

   Användare som kan hantera systemet. De har olika access-nivåer beroende på vilken stad de tillhör. Där de som tillhör "Sverige" ser allt. 

   Fält: ID, namn, lösenord och stad som de har rätt att se. OBS! Lösenordet sparas i klartext. Borde verkligen hasha det. 


Har lagt upp exporterade collections som json-filer på git. Ta gärna en titt på dem för mer info! 


