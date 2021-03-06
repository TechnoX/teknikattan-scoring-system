# Förslag på kandidatarbete:  Utveckling av system för frågetävlingen teknikåttan


# Bakgrund

Teknikåttan är en tävling för årskurs åtta. 
Tänk er ungefär på spåret, eller vi i femman. Det är lag som sitter i olika "burar" och svarar på frågor för att få poäng. Men det finns också flera inslag av praktiska moment och det händer att det kommer in saker som de ska klämma och känna på för att kunna besvara frågorna. Lagen består av 3 elever vardera, sen har de med sig sin hela klass som sitter i lokalen och följer tävlingen. På vissa orter webb-streamas även tävlingen för att parallellklasser ska kunna följa eventet hemifrån. 
Fyll på mer. 



Tidigare år har det varit mycket papper där deltagarna fått frågorna på papper, deltagarna har skrivit sina svar på papper som sedan skickats till domarna. Känns inte riktigt rätt för en tekniktävling. Så vi valde att 2017 utveckla ett digitalt system för tävlingen. I burarna så får lagen frågorna presenterade för sig på varsin datorskärm, och de kan svara på en ipad / padda / tablet. 





# Översikt över nuvarande system:

Systemet är lite som PowerPoint, fast på stereoider. Allt är webbbaserat för att slippa installera någon speciell mjukvara på datorerna som kör systemet. Många arrangörer har inte adminrättigheter på sina datorer. 

## Det består av flera olika vyer / användargränsnitt: 

 * På projektorn visas en presentation, väldigt likt en powerpoint, med slides som består av bilder, text och video. På vissa slides är det en timer som räknar ned betänketiden. Den här presentationen styrs av en dator som kan bläddra fram nästa slide, eller gå bakåt i presentationen om man råkat klicka fram sig för långt, eller för att gå igenom presentationen med domarna innan tävlingen. Fungerar allt perfekt så är det bara next-next-next under själva tävlingen, men det är nödvändigt att även ha funktionaliteten att backa i presentationen. 


 * De tävlande ser en annan presentation på deras skärmar. Frågorna som de tävlande ser är lite mer utförligt formulerade, dvs de har mer text medan presentationen publiken ser är lite mer övergripande. Det gör att typsnittet för de tävlande är lite mindre, men de sitter ju precis framför varsin datorskärm, medan projektorvyn visar texten i större typsnitt. Båda presentationerna styrs synkront, byts sliden på projektorvyn så byts den för de tävlande samtidigt, de är helt synkade. 

 * På datorn som styr presentationen så ser man nuvarande projektorbild, föregående projektorbild i miniatyr och nästa projektorbild i miniatyr. Det är liknande presentatörsläget i powerpoint som man brukar ha uppe på sin egen dator när man kör en presentation. Dessutom visas nuvarande deltagarvy, föregående deltagarvy och kommande deltagarvy. Det är också i denna vy man har möjlighet att bläddra framåt och bakåt i presentationen. 


 * De tävlande har också en tablet där de kan svara på frågorna. Den ser lite olika ut beroende på aktuell fråga. Är det en flervalsfråga så visas de olika alternativen som "radiobuttons" där lagen får välja ett av flera alternativ. Men det finns också frågor där de ska markera alla svar som stämmer in på frågan. Eller fritextfrågor. Det finns också frågor där man ska dra streck mellan alternativ som hör ihop.  Det finns också frågor som har delfrågor, så till exempel kan det vara på fråga 1 en A-uppgift och en B-uppgift. Vilken fråga som ska ha vilka sorts svar får tävlingskonstuktören välja när han skapar frågan och lägger in den i systemet. 
De tävlande ska kunna fylla i sitt svar under betänketiden, och när tiden är slut så ska de inte längre kunna ändra sitt svar. Den här vyn styrs också synkront med alla andra vyer, så när man är på fråga 4 visas svarsskärmen där de kan fylla i sitt svar på fråga 4 samtidigt. Svaren skickas till servern direkt någon skriver något. Ingen spara knapp, utan det är hela tiden up-to-date. 


 * Domarna kan under tävlingen följa vad lagen svarar i realtid. Även innan betänketiden är slut så har domarna full koll på vad lagen skriver eller klickar på. Domarna kan poängsätta lagen när som helst, men gör det förmodligen efter att betänketiden tar slut. Domarna måste ha möjlighet att ändra poäng på tidigare frågor (om de överlägger någon fråga och väljer att gå vidare med tävlingen innan de tagit ett slutgiltigt beslut, alternativt i sällsynta fall om domarna ändrar ett tidigare taget beslut så ska det vara möjligt). Domarna ska också kunna gå bakåt och se vad lag svarat tidigare, utan att hela presentationen hoppar bakåt. De ska kunna se alla lagens alla svar. 

 * Resultatlista som visar aktuell poängställing. Så fort domarna fyller i en poäng så ska den dyka upp här. Det vore bra någon form av high-lighting eller notering på den cell som uppdateras så att blicken dras dit. Annars är det svårt att se vad som ändras för publiken. 


 * Eventuellt fler vyer som visualiserar annat som kan klippas in i kameraströmmen som går ut live på nätet. Till exempel det deltagarna svarar på aktuell fråga. Men det är verkligen inget krav, utan mer en extra feature. 



 * En fråge-editor där man skapar frågorna. Det blir ju också lite som powerpoint, med en mall som formaterar bakgrundsbild, logga och layout. Friheten man har är att man kan lägga in text, bilder och video, och formatera den, till exempel göra texten centrerad, fet stil, etc. Lite lagom frihet. Är också bra att kunna lägga in tabeller, för det är ganska ofta data presenteras i tabeller som deltagarna ska läsa av och tolka. 
När man skapar frågorna i editorn ska man också välja hur svarsskärmen ska se ut på tableten, beroende på vilken frågetyp det är. Om det är flervalsfråga ska man lägga in de olika alternativen, om det är en para-ihop fråga så lägger man in de olika paren. Är det sant-eller-falskt fråga så ska man lägga in de olika påståendena. Vissa frågor är praktiska och söker inget svar alls på tableten. Vissa frågor består av flera slides. Man ska också fylla i hur lång betänketiden är, om frågan har en betänketid.  


 * Analysverktyg. Se vilka frågor som var svåra eller enkla (dvs jämföra vad alla lagen fick för poäng i hela sverige). Kunna se skillnader i landet, vilken ort presterar bättre än en annan ort? Jämföra vad lagen svarar på en specifik fråga. Etc. 


 * Admingränsnitt där man kan hantera tävlingar, användarkonton, tävlingsorter, deltagande lag, m.m. Med hantera menar jag skapa, ändra och ta bort. Det är förmodligen bara ett user interface över databasen för att kunna manipulera entries. Bra att kunna skapa en tävling och lägga in alla frågor, för att sen exportera den till alla orter i Sverige för dem att göra lokala ändringar i frågematerialet. Typ som att kopiera upp en powerpoint och skicka ut den till alla tävlingsorter och de får eget ansvar för den och kan göra egna anpassningar. 



## Kommentarer: 

 * Vissa orter kommer kanske köra utan tablets och fortfarande låta lagen svara på papper. Det ska vara möjligt att använda systemet även för dem för att synkront leverera frågor till både deltagare och publiken. 




## Frågetyper: 


Jag har identifierat några olika typer av frågor: 

1. Quiz: Består av 10-20 frågor á 10 sekunder vardera. Med ett fixt antal svarsalternativ, typ 1. X. 2. Eller A, B, C, D.  Lagen svarar och sen går man vidare till nästa fråga. Jobbigt för domarna att rätta så viktigt med automaträttning. 
2. Ledtrådsfråga: Många påståenden som ska leda fram till ett och samma ord. Antal påståenden kan variera mellan tävlingar, men vanligt kring 5 påståenden, då har laget 5 rader att skriva sina svar på. Först har de bara ett enda påstående som är rätt svårt, sen får de se fler och fler påståenden. Och för varje nytt påstående så låses motsvarande rad på de tävlandes skärmar, så de kan inte ändra tidigare angivna svar. De får lika många poäng som de skrivit rätt svar på sina rader. 
3. Sant-eller-falskt: Lagen presenteras återigen för ett gäng påståenden, men här ska de avgöra om de är sanna eller falska. Vissa orter använder gröna och röda flaggor som lagen ska hålla upp om de tror att påståendet är sant respektive falskt. Annars så kan de trycka på tableten på ett rött eller grönt fält och det visualiseras på projektorn ovanför dem så publiken ser vad de svarar. 
5. Para-ihop: Lagen ska para ihop alternativ, typ en kolumn med länder och en annan kolumn med huvudstäder och de ska dra streck mellan alternativen som passar ihop. Det finns frågor där det alltid är en ett-till-ett matching mellan kolumnerna (som i fallet med huvudstäder) men det finns också fall där det är en en-till-många relation, eller många-till-en relation mellan kolumnerna.
6. Praktisk fråga: Inget digitalt svar söks på tableten. Däremot ska domarna fortfarande kunna fylla i poäng på den frågan. 
7. Resterande frågor (dessa kan bestå av flera delfrågor): 
  7.1. Ett numeriskt svar söks
  7.2. Ett kort textsvar söks (tänk htmls input)
  7.3. Ett längre textsvar söks (tänk htmls textarea)
  7.4. Ett (eller flera) av flera alternativ söks (tänk htmls radiobuttons eller checkboxar)




# Teknisk info och framtida jobb: 

Då vi inte är programmerare är inte systemet byggt med de senaste teknikerna, och strukturen på koden har lite kvar att önska. Dessutom finns det fler funktioner som vi skulle vilja lägga till, men inte haft möjlighet att göra. 

Systemet är skrivet i AngularJS som egentligen är en föråldrad webbteknik, men vi hade inte möjlighet att sätta oss in i React eller nya Angular 7. Jag skulle rekommendera att skriva om systemet med en nyare teknik, och jag har lite förkärlek till Angular. Men det spelar egentligen ingen roll om React väljs. 

Backenden är skriven i nodejs och jag skulle rekommendera att använda det, men även django eller php eller nått annat är okej. Vore trevligt om man kunde få en integration mot wordpress för att nyttja dess WYSIWYG editor och wordpress är ju php baserat. Dessutom ligger teknikåttans resterande sida under wordpress. Så kanske det vore lämpligt att skapa ett plugin till wordpress? 

Se readme filen för mer info!



# Förslag på förbättringar: 

Jag tänker att systemet ska skrivas om från grunden med nya tekniker och uppdatera det allmänt. Just nu används till exempel inte något system för pakethantering på front-enden. Något liknande bower vore trevligt. Vissa bibliotek är direktlänkade till nån CDN och vissa ligger versionshanterade här under git. Det är inte hållbart eller bra.

Förutom nuvarande funktionalitet vore ny-utveckling av följande intressant: 

1. Visa live på projektorn vad lagen svarar samtidigt som de är aktiva. För att få mer spänning och mer interaktivitet med publiken. Det vore kul att kunna hänga med mer vad som händer. 

2. Automaträttning i de fall det inte är fritextsvar. Alla dra-streck-frågor, sant-eller-falskt, flervalsalternativfrågor etc. borde gå att automatiskt rätta eftersom svaret är entydigt. 

3. Bättre wysiwyg editor. Idag är den baserad på tinyMCE, men den är rätt begränsad (och buggig tycker jag). Bättre att nyttja wordpress editor som är riktigt kraftfull. Kanske skapa frågorna som sidor och så genereras resten utifrån dem? Om det går? 

4. Bättre mediahantering för att ladda upp bilder och videoklipp till frågor. Vore bra att nyttja wordpress inbyggda mediahanteringsfunktionalitet. 

5. Vore bra att kunna ändra template / mall för hur frågorna presenteras och visas på projektor och tävlingsskärm. olika orter kanske har deras olika mallar. Eller så vill man ändra från år till år. Idag är det en hårdkodad CSS. Kanske vore bra med ett template-system likt det som finns i powerpoint där man kan välja en mall när man skapar sin presentation. Det är inte bara av estiska skäl, utan ibland så är tävlingsbåsen så höga så att inte hela projektorvyn syns, då vore det bra att kunna ha en mall där all info fortfarande syns, men lite mer ihoptryckt i höjdled. 

6. Vore bra med en exportera funktion som kan exportera alla frågor till PDF-filer för att kunna skriva ut papperskopior som backup, även exportera presentationen som en gammal tråkig powerpoint vore bra. Och kunna exportera frågeledarens texter som pdf också. 

7. Vore bra att kunna lägga in mellan-slides som inte tillhör någon fråga alls. Till exempel "Nu är det 10 minuters paus, fika finns att köpa i entrén", eller "Tack till våra sponsorer X, Y , Z". 

8. Utveckla analysverktyget. Det finns massa statistik om frågorna som vore intressant att tydliggöra. Kanske med nått coolt javascript bibliotek för statistik. 

9. Hantera en testfråga som inte ger poäng och inte ska synas i resultatlistan. Men för att lagen innan tävlingen börjar ska få testa på utrustningen och se hur allting fungerar med betänketid och att svaren låses. 

10. Klassuppgiften är lite utanför själva frågesporten, men poängen från den måste gå att fylla i någonstans och den bör vara synlig i resultatlistan och lagens totalpoäng. 

11. Lägga in även tävlingsledarens texter i systemet. Tävlingledaren har idag ett word-dokument (ofta printat på papper) med lite mer information som hen kan läsa ifrån under betänketiden och använda som stöd under tävlingen. Innehåller en del extra fakta och kul sidosaker som kan användas för att underhålla publiken medan lagen jobbar. Anledningen till att lägga in detta i fråge-editorn är att få allt samlat på ett ställe, och för att kunna exportera alla dokument med en knapp. Enklare att hålla alla dokument i synk med varandra om man skulle behöva ändra någon bild eller textdetalj om det är ett enda ställe det behöver ändras. 


12. Trevligt om man kan lägga in musik som automatiskt går igång i betänketiden så slipper någon tänka på det. I dagsläget är det ofta en kille som sitter och sköter ljudet med en spotifylista som startar musik när betänketiden startar, och sen stänger av ljudet när betänketiden är slut. 

13. En vy för att se aktuell poängställing i hea sverige vore trevligt. Tävlingen arrangeras på många orter runt om i Sverige, på exakt samma datum. Vore kul att kunna uppmärksamma eleverna som deltar att de är del av något större. Det är inte bara i den här salen som tävlingen pågår utan det händer runt om i sverige, samtidigt. 

