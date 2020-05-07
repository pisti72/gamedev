var data = {
   "room": [
      {
         "id": 0,
         "title": "Ébredés a Deák Ferenc téren",
         "description": "Kábultan ébredsz egy padon. Nem tudod, hogyan kerültél oda,\ncsak annyit látsz hogy sötét van és egy viszkis üveg hever melletted.",
         "direction": {
            "north": 4,
            "south": 1
         }
      },
      {
         "id": 1,
         "title": "Astoria",
         "description": "Kihalt minden. Arra jön egy csöves és megkérdezed, hogy nem \nlátott egy lányt, akit a Keletinél ismertél meg. Azt mondja, hogy sajnos nem.",
         "direction": {
            "north": 6,
            "south": 2,
            "east": 7,
            "west": 22
         }
      },
      {
         "id": 2,
         "title": "Kálvin tér",
         "description": "Távolban szirénázást hallasz. Baljós érzéseid támadnak. \nEszedbe jut, hogy hátha a barátnőd bajban van. Meg kell találnod őt.",
         "direction": {
            "north": 1,
            "south": 3,
            "west": 12
         }
      },
      {
         "id": 3,
         "title": "Ráday utca",
         "description": "Nappal nyüzsög ez a sétáló utca, de ilyenkor csak néhány kábult alak jön-megy. \n Meglátsz egy ismerős alakot, de amikor megindulsz feléje, \nelrohan.",
         "direction": {
            "north": 2
         }
      },
      {
         "id": 4,
         "title": "Szent István Bazilika",
         "description": "Az óriási bazilika mellett aprónak érzed magad. \nFelnézel a tetejére, de csak a Holdat látod megcsillanni a kupoláján.",
         "direction": {
            "north": 5,
            "south": 6
         }
      },
      {
         "id": 5,
         "title": "Nyugati tér",
         "description": "Elhajt előtted egy taxi. Majdnem elütött. \nMeglátsz egy lányt és kérsz tőle egy cigit. \nKérdezősködsz, de ő csak dél felé mutat némán.",
         "direction": {
            "south": 4
         }
      },
      {
         "id": 6,
         "title": "Deák Ferenc tér",
         "description": "Ismét itt vagy. Mintha kicsit hajnalodott volna.\nHűvös szellő fújdogál. Vajon mi történhetett a barátnőddel?",
         "direction": {
            "north": 4,
            "south": 1
         }
      },
      {
         "id": 7,
         "title": "Rákóczi út",
         "description": "Észak felé ismersz egy jó szórakozó helyet. \nHátha ott többet tudnak.",
         "direction": {
            "north": 8,
            "east": 9,
            "west": 1
         }
      },
      {
         "id": 8,
         "title": "Szimpla Kert",
         "description": "Itt még javában mulatoznak az emberek. \nSzól a zene, miközben megkérdezed a csapost, hogy nem látott-e\nerre egy barna hajú lányt, \nde a csapos csak értetlenül néz rád...",
         "direction": {
            "south": 7
         }
      },
      {
         "id": 9,
         "title": "Blaha Lujza tér",
         "description": "Már nagyon fáradtnak érzed magad a sok gyaloglástól. Csak sejted, hogy merre jársz. Déli irányban látsz egy gyors éttermet.",
         "direction": {
            "south": 11,
            "east": 10,
            "west": 7
         }
      },
      {
         "id": 10,
         "title": "Keleti pályaudvar",
         "description": "Itt nem látsz semmi érdekeset. \nAzaz mégsem egy tolvajt látsz szaladni nyomában rendőrökkel. \nÚtközben elhajít egy pénztárcát. Odamész és felveszed.",
         "direction": {
            "west": 9
         }
      },
      {
         "id": 11,
         "title": "Gyors étterem a Blahánál",
         "description": "Bemész. Négyen beszélgetnek egy asztalnál. \nOdamész, és megkérdezed tőlük, hogy nem láttak errefelé egy lányt.\nAz egyikük neked ad egy fülbevalót.",
         "direction": {
            "north": 9
         }
      },
      {
         "id": 12,
         "title": "Fővám tér",
         "description": "Az utcán egy éjszakai busz suhan el. \nA bulizó tömegek már hazafelé igyekeznek. \nOlyan érzésed támad, hogy át kell menned a hídon.",
         "direction": {
            "east": 2,
            "west": 13
         }
      },
      {
         "id": 13,
         "title": "Szabadság híd",
         "description": "Megállsz a híd közepén és rácsodálkozol Budapestre, \nhogy milyen szép ilyenkor éjszaka. \nLenézel a Dunára és gyönyörködsz a hullámok fodrozódásában.",
         "direction": {
            "east": 12,
            "west": 14
         }
      },
      {
         "id": 14,
         "title": "Gellért tér",
         "description": "A Gellért Szálló közelében éppen egy villamos lassít. \nDe jó lenne rá felszállni és leülni egy kicsit.",
         "direction": {
            "east": 13,
            "west": 15
         }
      },
      {
         "id": 15,
         "title": "Villamos",
         "description": "Iszonyatosan hangosan és rázósan süvít az éjszakában \nez az ódon villamos. Már fékez is és meg is állt.",
         "direction": {
            "east": 16
         }
      },
      {
         "id": 16,
         "title": "Gellért hegy",
         "description": "Jó volt a villamosozás, de most már ideje tovább menni.\nÉrzed, hogy közel vagy a célodhoz. \nMost már nem adhatod fel.",
         "direction": {
            "south": 14,
            "east": 17
         }
      },
      {
         "id": 17,
         "title": "Erzsébet híd",
         "description": "Hídon gyalogolni mindig jó.",
         "direction": {
            "east": 18,
            "west": 16
         }
      },
      {
         "id": 18,
         "title": "Ferencziek tere",
         "description": "Napközben itt sokan vannak, de ilyenkor csak néhány külföldi turista járkál. \nMeglátsz egy rendőrt és megkérdezed tőle az időt. \nŐ a Jégbüfé felé mutat.",
         "direction": {
            "north": 19,
            "east": 21,
            "west": 17
         }
      },
      {
         "id": 19,
         "title": "Jégbüfé",
         "description": "Csodálkozol, hogy ilyenkor nyitva van. \nEnnek örülsz, mert nagyon éhes vagy. \nElindulsz a nyugat felé a mosdóhoz, mert már alig bírod ki.\nVagy inkább a másik furcsa ajtón lepsz be?",
         "direction": {
            "north": 0,
            "west": 20
         }
      },
      {
         "id": 20,
         "title": "Jégbüfé mosdója",
         "description": "Véletlenül a női mosdóba nyitottál be, de nem baj, \nmert megpillantod a barátnődet, akinek nagyon megörülsz. \nMegölelitek egymást, és együtt mentek haza :-)",
         "direction": {
            "east": 19
         }
      },
      {
         "id": 21,
         "title": "Útlezárás az Astoria felé",
         "description": "Rendőröket és mentőautót látsz. A házakról visszaverődik a villogók fénye. Erre sajnos nem mehetsz tovább...",
         "direction": {
            "west": 18
         }
      },
      {
         "id": 22,
         "title": "Útlezárás a Ferencziek tere felé",
         "description": "Helyszínelés van. Sok a rendőr és a mentős. \nMindenki nyüzsög. Kíváncsi vagy mi történhetett, \nde itt sajnos nem mehetsz tovább.",
         "direction": {
            "east": 1
         }
      }
   ]
};