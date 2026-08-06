---
title: "Får våra anställda använda Claude, ChatGPT eller Copilot?"
description: "De sex frågor svenska bolag bör reda ut innan de säger nej. Med källor, och utan myter."
date: "2026-05-27"
originalUrl: "https://stardustconsulting.se/blogg/far-vara-anstallda-anvanda-claude-chatgpt-eller-copilot/"
publication: "Stardust Consulting"
---

Var och varannan vecka kommer samma protest, oftast från IT eller legal: "vi vill ha Claude, men datan hamnar i USA", "modellerna tränar på vår information", "det går inte ihop med GDPR". Sedan sparar samma personer ledningsprotokoll i SharePoint, skickar känsliga filer via Teams och låter Copilot sammanfatta strategimötet.

Problemet är inte AI-verktygen. Det är att man lätt blir inkonsekvent; strikt mot Claude samtidigt som man tar SharePoint för givet.

I den här artikeln ger jag svar på de sex vanligaste frågorna svenska bolag har kopplat till att använda AI-verktyg och LLM:er, vad som är viktigt att veta och underlag till att ta beslut. Slutsatsen är inte att alla bolag bör släppa in AI överallt — den är att beslutet bör fattas på rätt grund, inte på myter.

## Fråga 1: Tränar Anthropic, OpenAI eller Microsoft sina AI-modeller på vår data?

Nej, inte om ni använder rätt licens. Och det är där bolag oftast snubblar.

Anthropic, OpenAI och Microsoft har alla tre olika villkor för konsumenter och företag. På företagslicenserna (Claude for Teams / Enterprise, ChatGPT Enterprise och Team, samt Microsoft 365 Copilot) används inte data för modellträning. Det är avtalsmässigt fastställt, inte en inställning som kan glömmas bort.

På konsumentkonton (Claude Free/Pro/Max, ChatGPT Free/Plus, Copilot Free) är bilden mer komplex. Anthropic införde i september 2025 en opt-in-modell där nya konversationer kan användas för träning om användaren tackat ja. ChatGPT har länge erbjudit en toggle. Microsoft 365 Copilot Chat (gratisversionen) följer andra villkor än enterprise-versionen.

För Anthropics del finns dessutom 7 dagars default-retention på API (sänkt från 30 sedan september 2025), och kvalificerade enterprise-kunder kan förhandla Zero Data Retention — då lagras ingenting alls efter att svaret returnerats.

## Fråga 2: Lagras datan i USA och bryter det mot GDPR?

Schrems II-domen från 2020 förbjöd inte överföring av personuppgifter till USA. Den ogiltigförklarade Privacy Shield och krävde att exportören gör en bedömning av mottagarlandet och vidtar lämpliga skyddsåtgärder.

Sedan juli 2023 finns EU-US Data Privacy Framework med ett adekvansbeslut från EU-kommissionen. Personuppgifter kan överföras till DPF-certifierade amerikanska bolag utan ytterligare skyddsåtgärder. EU:s tribunal upprätthöll beslutet i september 2025 efter en första rättslig utmaning. IMY bekräftar i sin egen vägledning från mars 2025 att överföringar till DPF-certifierade organisationer är tillåtna.

Det finns en pågående överklagan och en sannolik utmaning från NOYB framöver. Norska Datatilsynet rekommenderar att ha en exitstrategi om ramverket faller. Det är en klok riskhantering men inte ett förbud.

Som extra säkerhetsbälte har de stora enterprise-leverantörerna även biträdesavtal med EU:s standardavtalsklausuler (SCC Module Two). Anthropics DPA ingår automatiskt i Commercial Terms (uppdaterad januari 2026). Microsoft och OpenAI har motsvarande.

Om ni vill ha datalagring inom EU finns två tydliga vägar för Claude: AWS Bedrock i Frankfurt eller Stockholm, eller Google Vertex AI i EU-regioner. Microsoft 365 Copilot kör på Microsofts EU Data Boundary som slutfördes i februari 2025. OpenAI har via Microsoft Azure samma möjlighet.

**Konkret exempel:** ni kör Google Workspace och Claude Teams. Vad lagras? I Claude Teams sparas era konversationer i upp till 30 dagar på Anthropics infrastruktur innan de raderas automatiskt. Väljer en användare att radera en chatt tidigare tas den bort omedelbart från gränssnittet och rensas från back-end-lagring inom samma 30-dagarsfönster. Er data används aldrig för att träna deras modeller. Har ni aktiverat Projects eller Memory sparas den kontexten tills ni tar bort den, precis som Google Drives filer lever tills ni raderar dem. Default-skyddet i Claude Teams-licensen är alltså inte svagare än vad Google ger er.

## Fråga 3: Hur skiljer detta sig från Microsoft 365 eller Google Workspace som vi redan kör?

Mindre än många tror — men skillnaderna är viktiga att förstå korrekt.

Den 10 juni 2025 satt Microsoft Frankrikechef för juridik och offentlig sektor, Anton Carniaux, under ed inför franska senaten. Frågan: kan ni garantera att data om franska medborgare som lagras i ert moln aldrig lämnas över till amerikanska myndigheter utan franska myndigheters godkännande?

"Non, je ne peux pas le garantir." Nej, det kan jag inte garantera.

Anledningen är US CLOUD Act från 2018. Den ger amerikanska myndigheter rätt att begära ut data från amerikanska bolag oavsett var datan lagras geografiskt. EU Data Boundary — som Microsoft slutförde i februari 2025 — flyttar var datan ligger. Den ändrar inte vem som juridiskt kontrollerar den. Samma princip gäller Google Workspace Sovereign Controls och i praktiken varje amerikansk molnleverantör.

Det relevanta juridiska ramverket är detsamma (CLOUD Act, DPF, SCC Module Two) och din organisation har redan gjort de centrala avvägningarna om ni kör M365 eller Google Workspace. Skillnaderna handlar om datatyp, integrationsnivå och arkitektur, inte om huruvida USA-exponering föreligger.

Det finns dock verkliga skillnader mellan generativ AI och dokumentlagring som är värda att känna till: en LLM processar fri text i realtid, vilket innebär att vad som matas in i prompten avgör exponeringen på ett annat sätt än när en fil lagras i SharePoint. Det finns också fler subprocessors involverade i ett inferensflöde, och risken för att anställda oavsiktligt inkluderar känslig information i en prompt är reell. Det är inte ett argument mot Claude — det är ett argument för tydlig intern policy om vilken data som får in i vilka verktyg. Mer om det i Fråga 6.

Här är jämförelsen på de faktorer som faktiskt avgör:

| Faktor | Claude Enterprise | ChatGPT Enterprise | M365 Copilot | Claude via Bedrock EU |
|--------|-------------------|-------------------|--------------|----------------------|
| Träning på kunddata | Nej | Nej | Nej | Nej |
| Default lagringsplats | USA | USA | EU Data Boundary | EU (Frankfurt/Stockholm) |
| CLOUD Act-exponering | Ja | Ja | Ja | Ja (AWS = US-bolag) |
| Biträdesavtal (DPA) | Ja, automatiskt | Ja | Ja | Ja, via AWS |
| Zero Data Retention | Förhandlingsbart | Begränsat | Nej | Konfigurerbart |
| ISO 27001 | Ja | Ja | Ja | Ja |
| ISO 42001 (AI-governance) | Ja | Pågående | Pågående | Ja |
| SOC 2 Type II | Ja | Ja | Ja | Ja |
| HIPAA-ready / BAA | Ja | Ja | Ja | Ja |

Skillnaderna handlar inte om "ja eller nej till USA". Det handlar om hur ni sätter upp er lösning.

För verksamheter med högre krav på datakontroll, eller som vill minska strukturellt beroende av amerikanska plattformar, finns idag svenska och europeiska alternativ som Berget AI som löser CLOUD Act-frågan på infrastrukturnivå snarare än avtalsnivå. Det är ett annat arkitekturval, inte ett bättre eller sämre, men rätt för en annan riskaptit.

## Fråga 4: Vi verkar inom en hårt reglerad bransch, får vi verkligen använda AI?

Bolag i reglerade branscher brukar fastna här. Rädsla är den största drivkraften till försiktighet. Det är klokt att vara försiktig, men vad säger reglerna? Saken är den att även de hårdast reglerade bolagen i Sverige har lagstöd för att använda AI. Även verksamheter under DORA implementerar idag AI-lösningar, men med omfattande krav på governance, riskhantering och tredjepartskontroll.

**För finans** gäller DORA sedan 17 januari 2025. Förordningen ersatte Finansinspektionens tidigare cloud-vägledning från 2017 och kräver formell hantering av IKT-risk, dokumenterad outsourcing, exitstrategi och kontroll av kritiska tjänsteleverantörer. AI-leverantörer (Anthropic, OpenAI, Microsoft) kan klassas som kritisk tredjepartsleverantör. Samma logik som ni redan tillämpar på molntjänster.

**För vård** är ramverket bredare: GDPR Artikel 9 för känsliga personuppgifter, Patientdatalagen för patientuppgifter, och från 15 januari 2026 den svenska cybersäkerhetslagen som genomför NIS2-direktivet. Regionerna tolkar molnreglerna olika, vilket är den verkliga blockaden, inte juridiken i sig.

Ingen av dessa lagar förbjuder Claude, ChatGPT eller Copilot. De ställer villkor. Villkor som går att uppfylla och som de flesta redan uppfyller på sin nuvarande Microsoft- eller Google-stack.

## Fråga 5: Vilka andra svenska och europeiska bolag använder redan dessa AI-verktyg?

Den vanligaste frågan en VD ställer är: vilka andra bolag inom vår bransch använder AI?

Enligt Anthropics egna uppgifter i samband med Series G-rundan i februari 2026 använder 70 % av Fortune 100-bolagen Claude och 8 av Fortune 10 är aktiva kunder. Mer än 1 000 enterprise-kunder spenderar över en miljon dollar per år. 80 % av Anthropics intäkter kommer från företagskunder.

Några konkreta exempel i reglerade sektorer:

- **Bristol Myers Squibb** (pharma, global spelare inkl. kontor i Stockholm): meddelade 20 maj 2026 att de rullar ut Claude Enterprise till 30 000 anställda globalt för drug discovery, kliniska prövningar, tillverkning och commercial operations.
- **Banner Health, Stanford Healthcare, Novo Nordisk, Sanofi, AbbVie, Genmab**: Claude i kliniska eller life sciences-flöden.
- **SAP**: integrerar Claude i sin Business AI-plattform. Genom SAP når Claude redan svenska storkunder som Ericsson och Volvo.
- **BMW**: Claude för dataanalys.
- **SNCF** (Frankrike, statligt järnvägsbolag): Claude till 150 kundtjänstagenter.
- **Spotify**: Claude i intern utvecklingsplattform. Engineering-tiden har sjunkit med upp till 90 procent för vissa flöden.
- **Tandem Health**: AI medical scribe byggd på Microsoft Azure inom EU. ISO 27001-certifierad, CE-märkt som medicinteknisk produkt enligt MDR, ISO 13485-certifierad. Används av över 1 000 vårdorganisationer i Europa.
- **Klarna**: ChatGPT Enterprise sedan 2024.

## Fråga 6: Vad ska vi göra för att kunna ta beslut?

Åtta steg som löser merparten av riskbilden:

1. **Klassificera er data.** Vilka kategorier hamnar i AI-verktyget? Persondata? Patientdata? Affärshemligheter? Riskbedömningen börjar där.

2. **Välj arkitektur efter datakategori.** Allmän affärsdata: Claude Teams/Enterprise fungerar, det är juridiskt i paritet med M365 och Google Workspace. Patientdata, finansiell transaktionsdata eller data som är reglerat i din bransch: kör Claude via AWS Bedrock (Stockholm/Frankfurt) eller Google Vertex AI EU. Men om M365/SharePoint redan är er plattform och ni lagt Claude ovanpå den infrastrukturen har ni redan gjort det valet.

3. **Aktivera Zero Data Retention vid behov.** Det är en förhandlad option i Anthropics enterprise-avtal, men inte relevant för de flesta SME. För ett bolag på 20–200 anställda är Claude Teams- eller Enterprise-licensen tillräcklig: ingen träning, upp till 30-dagars retention. ZDR är för verksamheter med specifika regulatoriska krav på att inga uppgifter lagras alls.

4. **Kontrollera att DPA:n är på plats.** Anthropics biträdesavtal (DPA) med EU:s standardklausuler ingår automatiskt i deras Commercial Terms — ni behöver inte förhandla separat. Undantaget: bygger ni ett eget AI-verktyg som ni sedan levererar till era kunder och deras data passerar Claude, behöver ni ett eget biträdesavtal med den kunden.

5. **Gör en konsekvensbedömning (DPIA).** En DPIA är ett dokument ni tar fram innan ni börjar behandla känsliga personuppgifter. Ni skriver ner: vilken data, varför, vad som kan gå fel och hur ni hanterar det. GDPR Artikel 35 kräver det när behandlingen sannolikt innebär hög risk. AI-verktyg som hanterar persondata triggar det nästan alltid.

6. **Dataminimera i prompten.** Ge modellen den data den behöver, inte mer. Kör ni redan all kunddata i M365 eller Google Workspace är den marginella risken liten då ni redan har accepterat CLOUD Act-exponeringen. Men att pseudonymisera identifierare i Claude-prompten kostar ingenting och minskar scope om något läcker.

7. **Sätt en intern styrningsmodell för AI-användning.** Fyra saker att besluta om:
   - *Dataklassificering kopplad till verktyg.* Vilken data får matas in i Claude Teams, vilken kräver Bedrock EU, och vilken ska aldrig in i ett AI-verktyg överhuvudtaget?
   - *Godkännandeprocess för nya use cases.* Utan en tydlig ägare sprids shadow AI — anställda kör konsumentkonton för att komma runt restriktioner.
   - *Tillgångskontroll och audit logging.* Claude Enterprise och Teams har en admin-konsol. Använd den.
   - *Exitprocess per användare.* Vad händer med Projects och sparad kontext när en anställd slutar?

8. **Dokumentera en exitstrategi.** Skriv ner vad ni gör om EU-US Data Privacy Framework ogiltigförklaras av en domstol. Ni behöver inte byta system. Ni behöver visa att ni vet vad alternativet är. En halv A4 räcker för många organisationer.

## Bottom line

Att bortse från möjligheterna för verksamheten att använda Claude, ChatGPT eller Copilot av säkerhetsskäl, samtidigt som ett bolag använder Microsoft 365 eller Google Workspace, är inte konsekvent. Den juridiska exponeringen följer samma ramverk. CLOUD Act bryr sig inte om det är en LLM eller en delad mapp i SharePoint.

Den verkliga frågan är inte om ni får använda AI, det är vilken data ni släpper in i vilka system och vilken arkitektur ni väljer.

Och kanske den viktigaste frågan: har ni råd att inte implementera AI i verksamheten för att få full utväxling i organisationen och framtidssäkra affärerna?

*Ps. På Stardust använder vi Claude Team Plan.*
