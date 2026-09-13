# scripts/i18n_data/part5_provenance.py

base_badges = {
    'pl': {
        "sanMarzano": {
            "shortName": "San Marzano",
            "title": "Pomidory Pelati San Marzano dell’Agro Sarnese-Nocerino D.O.P.",
            "origin": "Kampania (Wezuwiusz)",
            "description": "Autentyczne pomidory śliwkowe zbierane ręcznie na wulkanicznych glebach u podnóża Wezuwiusza. Charakterystyczny podłużny kształt, gęsta mięsistość i niska, delikatna kwasowość.",
            "fact": "Certyfikowane unikalnym numerem seryjnym konsorcjum D.O.P."
        },
        "bufala": {
            "shortName": "Bufala Campana",
            "title": "Mozzarella di Bufala Campana D.O.P.",
            "origin": "Caserta i Salerno",
            "description": "100% świeże mleko bawolic z Kampanii. Niezrównana kremowość, sprężysta elastyczność i delikatna kwaskowatość, która ożywa w gorącym piecu.",
            "fact": "Dostarczana na świeżo co tydzień bezpośrednio z Kampanii"
        },
        "fiorDiLatte": {
            "shortName": "Fior di Latte",
            "title": "Fior di Latte dei Monti Lattari d’Agerola",
            "origin": "Wybrzeże Amalfi, Włochy",
            "description": "Ser z masy parzonej z bogatego mleka krów wypasanych na wzgórzach Amalfi. Krojony w paski i odsączony dla idealnie chrupkiego, suchego wierzchu pizzy.",
            "fact": "Optymalne topnienie bez wydzielania nadmiaru wilgoci"
        },
        "ferment48h": {
            "shortName": "Fermentacja 48h",
            "title": "48-Godzinne Dojrzewanie i Fermentacja na Zimno",
            "origin": "Własna produkcja Zamek Kodeljevo",
            "description": "Dwudniowe kontrolowane wyrastanie w chłodni w temperaturze 4°C z minimalną ilością drożdży (< 0,1%). Naturalne enzymy rozkładają złożone skrobie, ułatwiając trawienie.",
            "fact": "Brak uczucia ciężkości w żołądku i nocnego pragnienia"
        },
        "mortadella": {
            "shortName": "Mortadela",
            "title": "Mortadella Bologna I.G.P.",
            "origin": "Emilia-Romania",
            "description": "Tradycyjna emilijska mortadela z Chronionym Oznaczeniem Geograficznym. Drobno mielona łopatka wieprzowa z delikatną słoninką i przyprawami, powoli parzona w piecach.",
            "fact": "Układana obficie w cienkich plastrach do ciepłych kanapek Panuozzo"
        },
        "pistacchio": {
            "shortName": "Pistacje z Bronte",
            "title": "Pistacchio Verde di Bronte D.O.P.",
            "origin": "Bronte, Etna (Sycylia)",
            "description": "Szmaragdowo-zielone pistacje zbierane ręcznie na wulkanicznych zboczach Etny. Głęboki profil aromatyczny, lekko prażone i grubo siekane dla chrupkiego kontrastu.",
            "fact": "Zielone złoto Sycylii opatrzone certyfikatem D.O.P."
        },
        "olioBio": {
            "shortName": "Ekologiczna Oliwa",
            "title": "Ekologiczna Oliwa z Oliwek Extra Virgin",
            "origin": "Tłoczona na zimno",
            "description": "Oliwa z pierwszego tłoczenia na zimno z wczesnych zbiorów, zachowująca wysoką zawartość polifenoli. Skrapiana na surowo po wyjęciu pizzy z pieca dla ziołowej świeżości.",
            "fact": "100% certyfikowane uprawy ekologiczne bez dodatków chemicznych"
        },
        "parma": {
            "shortName": "Szynka Parmeńska 24m",
            "title": "Prosciutto di Parma D.O.P. (24 Miesiące)",
            "origin": "Parma, Emilia-Romania",
            "description": "Dojrzewająca naturalnie przez 24 miesiące w świeżych powiewach wiatru apenińskiego. Wyłącznie włoskie udźce wieprzowe i sól morska, bez konserwantów i azotynów.",
            "fact": "Szlachetna szynka dojrzewająca sygnowana królewską koroną książęcą Parmy"
        },
        "stracciatella": {
            "shortName": "Stracciatella",
            "title": "Świeża Stracciatella i Burrata di Puglia",
            "origin": "Apulia, Włochy",
            "description": "Ręcznie rwane włókna mozzarelli zanurzone w gęstej, świeżej śmietance. Nadziewana do gorących kanapek Panuozzo dla wyjątkowej soczystości.",
            "fact": "Aksamitne serce burraty wytwarzane w 100% z włoskiego mleka"
        },
        "vegetarijansko": {
            "shortName": "Wegetariańskie",
            "title": "Wybór Wegetariański",
            "origin": "Bez mięsa",
            "description": "Danie bezmięsne skomponowane z najwyższej jakości serów rzemieślniczych, warzyw ogrodowych i oliwy z oliwek extra virgin.",
            "fact": "Odpowiednie dla wegetarian"
        },
        "pikantno": {
            "shortName": "Pikantne",
            "title": "Pikantna Specjalność",
            "origin": "Papryczki kalabryjskie",
            "description": "Przygotowane z wyrazistym włoskim salami i ognistymi papryczkami chili z Kalabrii.",
            "fact": "Wyrazisty, pikantny charakter"
        },
        "specialiteta": {
            "shortName": "Specjalność Lokalu",
            "title": "Specjalność Lokalu Zamek Kodeljevo",
            "origin": "Autorski przepis Kader",
            "description": "Unikalne połączenie składników skomponowane przez naszego szefa pizzerii, łączące zamkowy klimat z neapolitańską tradycją.",
            "fact": "Najchętniej polecana pozycja przez gości"
        },
        "fallback": {
            "shortName": "Wyselekcjonowane Składniki",
            "title": "Wyselekcjonowane Składniki",
            "origin": "Wyselekcjonowane Składniki",
            "description": "Najwyższej jakości składnik rzemieślniczy przygotowany zgodnie z tradycją kulinarną.",
            "fact": "Autentyczne doświadczenie kulinarne"
        }
    },
    'cs': {
        "sanMarzano": {
            "shortName": "San Marzano",
            "title": "Rajčata San Marzano dell’Agro Sarnese-Nocerino D.O.P.",
            "origin": "Kampánie (Vesuv)",
            "description": "Autentická soudková rajčata ručně sbíraná na sopečných svazích pod Vesuvem. Typický podlouhlý tvar, hutná dužina a jemná, přirozeně nízká kyselost.",
            "fact": "Certifikováno unikátním sériovým číslem konsorcia D.O.P."
        },
        "bufala": {
            "shortName": "Bufala Campana",
            "title": "Mozzarella di Bufala Campana D.O.P.",
            "origin": "Caserta a Salerno",
            "description": "100% čerstvé buvolí mléko z Kampánie. Bezkonkurenční mléčná krémovost, vláčná pružnost a jemné nakyslé tóny, které ožívají v žáru pece.",
            "fact": "Dováženo čerstvé každý týden přímo z Kampánie"
        },
        "fiorDiLatte": {
            "shortName": "Fior di Latte",
            "title": "Fior di Latte dei Monti Lattari d’Agerola",
            "origin": "Amalfské pobřeží, Itálie",
            "description": "Pařený sýr z plnotučného mléka horských krav z kopců Amalfi. Krájený na proužky a vyzrálý pro křupavý povrch pizzy bez přebytečné vody.",
            "fact": "Optimální tavení bez uvolňování nežádoucí vlhkosti"
        },
        "ferment48h": {
            "shortName": "48h Fermentace",
            "title": "48hodinové Řízené Zrání a Kynutí v Chladu",
            "origin": "Vlastní výroba Hrad Kodeljevo",
            "description": "Dvoudenní řízené kynutí v chladu při 4 °C s minimem droždí (< 0,1 %). Přírodní enzymy předtráví složité škroby pro lehkou stravitelnost.",
            "fact": "Žádný pocit těžkosti v žaludku ani noční žízeň"
        },
        "mortadella": {
            "shortName": "Mortadella",
            "title": "Mortadella Bologna I.G.P.",
            "origin": "Emilia-Romagna",
            "description": "Tradiční emiliánská mortadela s chráněným zeměpisným označením. Jemně mletá vepřová plec s lahodnými kostkami špeku a kořením, zvolna vařená v páře.",
            "fact": "Bohatě kladená ve studených plátcích do teplých sendvičů Panuozzo"
        },
        "pistacchio": {
            "shortName": "Pistácie z Bronte",
            "title": "Pistacchio Verde di Bronte D.O.P.",
            "origin": "Bronte, Etna (Sicílie)",
            "description": "Smaragdově zelené pistácie ručně sbírané na sopečných svazích sopky Etny. Hluboký aromatický profil, lehce pražené a nahrubo sekané pro křupavý kontrast.",
            "fact": "Zelené zlato Sicílie s certifikací D.O.P."
        },
        "olioBio": {
            "shortName": "Bio Olivový Olej",
            "title": "Bio Extra Panenský Olivový Olej",
            "origin": "Lisovaný za studena",
            "description": "Extra panenský olivový olej z časné sklizně lisovaný za studena pro zachování vysokého obsahu polyfenolů. Zakápnutý za syrova na čerstvě upečenou pizzu pro bylinkovou svěžest.",
            "fact": "100% certifikované ekologické zemědělství bez chemických látek"
        },
        "parma": {
            "shortName": "Parmská Šunka 24m",
            "title": "Prosciutto di Parma D.O.P. (24 Měsíců)",
            "origin": "Parma, Emilia-Romagna",
            "description": "Přírodně zrající 24 měsíců ve svěžím vánku apeninských hor. Pouze italská vepřová kýta a mořská sůl, zcela bez konzervantů a dusičnanů.",
            "fact": "Ušlechtilá sušená šunka orazítkovaná královskou vévodskou korunou z Parmy"
        },
        "stracciatella": {
            "shortName": "Stracciatella",
            "title": "Čerstvá Stracciatella a Burrata di Puglia",
            "origin": "Apulie, Itálie",
            "description": "Ručně trhaná vlákna mozzarelly zalitá hustou čerstvou smetanou. Plněná do horkých sendvičů Panuozzo pro neodolatelnou šťavnatost.",
            "fact": "Hedvábné srdce burraty vyrobené ze 100% italského mléka"
        },
        "vegetarijansko": {
            "shortName": "Vegetariánské",
            "title": "Vegetariánský Výběr",
            "origin": "Bez masa",
            "description": "Bezmasý pokrm připravený z prémiových řemeslných sýrů, zahradní zeleniny a extra panenského olivového oleje.",
            "fact": "Vhodné pro vegetariány"
        },
        "pikantno": {
            "shortName": "Pikantní",
            "title": "Pikantní Specialita",
            "origin": "Kalábrijské chilli",
            "description": "Připraveno s výrazným italským salámem a ohnivými feferonkami z Kalábrie.",
            "fact": "Výrazný pikantní charakter"
        },
        "specialiteta": {
            "shortName": "Specialita Podniku",
            "title": "Specialita Podniku Hrad Kodeljevo",
            "origin": "Originální receptura Kader",
            "description": "Autorská kombinace surovin navržená naším šéfem pizzerie, spojující hradní atmosféru s neapolskou tradicí.",
            "fact": "Nejoblíbenější volba našich hostů"
        },
        "fallback": {
            "shortName": "Vybrané Suroviny",
            "title": "Vybrané Suroviny",
            "origin": "Vybrané Suroviny",
            "description": "Prémiová řemeslná surovina zpracovaná podle osvědčených kulinářských tradic.",
            "fact": "Autentický kulinářský zážitek"
        }
    },
    'es': {
        "sanMarzano": {
            "shortName": "San Marzano",
            "title": "Tomates Pelati San Marzano dell’Agro Sarnese-Nocerino D.O.P.",
            "origin": "Campania (Vesubio)",
            "description": "Auténticos tomates pera cosechados a mano en suelos volcánicos a los pies del Vesubio. Forma alargada característica, textura carnosa y acidez sutil y equilibrada.",
            "fact": "Certificado con número de serie único del consorcio D.O.P."
        },
        "bufala": {
            "shortName": "Bufala Campana",
            "title": "Mozzarella di Bufala Campana D.O.P.",
            "origin": "Caserta y Salerno",
            "description": "100% leche fresca de búfala de Campania. Inigualable cremosidad láctea, elasticidad flexible y delicados matices ácidos que despiertan en el horno.",
            "fact": "Traída fresca semanalmente directamente desde Campania"
        },
        "fiorDiLatte": {
            "shortName": "Fior di Latte",
            "title": "Fior di Latte dei Monti Lattari d’Agerola",
            "origin": "Costa Amalfitana, Italia",
            "description": "Mozzarella de pasta hilada elaborada con leche entera de vacas de las colinas de Amalfi. Cortada en tiras y escurrida para una superficie crujiente y sin exceso de agua.",
            "fact": "Fundido óptimo sin liberar humedad residual"
        },
        "ferment48h": {
            "shortName": "Fermentación 48h",
            "title": "Maduración y Fermentación Lenta en Frío de 48 Horas",
            "origin": "Elaboración propia Castillo Kodeljevo",
            "description": "Reposo controlado de dos días a 4 °C con mínima levadura (< 0,1 %). Las enzimas naturales predigieren los almidones para una digestión sumamente ligera.",
            "fact": "Sin sensación de pesadez ni sed durante la noche"
        },
        "mortadella": {
            "shortName": "Mortadela",
            "title": "Mortadella Bologna I.G.P.",
            "origin": "Emilia-Romaña",
            "description": "Tradicional mortadela emiliana con Indicación Geográfica Protegida. Paleta de cerdo finamente picada con delicados dados de tocino y especias, cocida al vapor.",
            "fact": "Servida en abundantes lonchas frías dentro del Panuozzo caliente"
        },
        "pistacchio": {
            "shortName": "Pistacho de Bronte",
            "title": "Pistacchio Verde di Bronte D.O.P.",
            "origin": "Bronte, Etna (Sicilia)",
            "description": "Pistachos verde esmeralda recolectados a mano en las laderas volcánicas del monte Etna. Aroma profundo, ligeramente tostados y picados para un contraste crujiente.",
            "fact": "El oro verde de Sicilia con certificación D.O.P."
        },
        "olioBio": {
            "shortName": "Aceite de Oliva Bio",
            "title": "Aceite de Oliva Virgen Extra Ecológico",
            "origin": "Prensado en frío",
            "description": "Aceite virgen extra de primera cosecha prensado en frío para mantener su alto contenido en polifenoles. Rociado en crudo sobre la pizza recién horneada.",
            "fact": "100% cultivo ecológico certificado sin aditivos químicos"
        },
        "parma": {
            "shortName": "Jamón de Parma 24m",
            "title": "Prosciutto di Parma D.O.P. (24 Meses)",
            "origin": "Parma, Emilia-Romaña",
            "description": "Curación natural durante 24 meses con la brisa pura de los montes Apeninos. Exclusivamente carne de cerdo italiana y sal marina, libre de conservantes y nitritos.",
            "fact": "Noble jamón curado marcado a fuego con la corona ducal de Parma"
        },
        "stracciatella": {
            "shortName": "Stracciatella",
            "title": "Stracciatella Fresca y Burrata di Puglia",
            "origin": "Apulia, Italia",
            "description": "Hebras de mozzarella hiladas a mano y sumergidas en nata láctea fresca y rica. Rellena los sándwiches Panuozzo calientes aportando una jugosidad exquisita.",
            "fact": "El corazón fundente de la burrata elaborado con leche 100% italiana"
        },
        "vegetarijansko": {
            "shortName": "Vegetariano",
            "title": "Selección Vegetariana",
            "origin": "Sin carne",
            "description": "Plato sin carne elaborado con quesos artesanos de primera calidad, verduras de la huerta y aceite de oliva virgen extra.",
            "fact": "Apto para vegetarianos"
        },
        "pikantno": {
            "shortName": "Picante",
            "title": "Especialidad Picante",
            "origin": "Guindilla de Calabria",
            "description": "Elaborado con sabroso salami italiano y ardientes guindillas picantes de Calabria.",
            "fact": "Carácter picante y temperamental"
        },
        "specialiteta": {
            "shortName": "Especialidad de la Casa",
            "title": "Especialidad de la Casa Castillo Kodeljevo",
            "origin": "Receta de autor de Kader",
            "description": "Combinación exclusiva de ingredientes creada por nuestro maestro pizzero, uniendo la magia del castillo con la tradición napolitana.",
            "fact": "La opción preferida y más recomendada por nuestros clientes"
        },
        "fallback": {
            "shortName": "Ingredientes Seleccionados",
            "title": "Ingredientes Seleccionados",
            "origin": "Ingredientes Seleccionados",
            "description": "Ingrediente artesanal de primera calidad preparado según las nobles tradiciones culinarias.",
            "fact": "Auténtica experiencia gastronómica"
        }
    }
}

def build_provenance_dict(loc):
    base = base_badges[loc]
    badges = {}
    alias_map = {
        'san-marzano': 'sanMarzano',
        'fior-di-latte': 'fiorDiLatte',
        'ferment-48h': 'ferment48h',
        'olio-bio': 'olioBio'
    }
    
    # In sl: badges keys order:
    # sanMarzano, san-marzano, bufala, fiorDiLatte, fior-di-latte, ferment48h, ferment-48h,
    # mortadella, pistacchio, olioBio, olio-bio, parma, stracciatella, vegetarijansko,
    # pikantno, specialiteta, fallback
    order = [
        'sanMarzano', 'san-marzano', 'bufala', 'fiorDiLatte', 'fior-di-latte',
        'ferment48h', 'ferment-48h', 'mortadella', 'pistacchio', 'olioBio',
        'olio-bio', 'parma', 'stracciatella', 'vegetarijansko', 'pikantno',
        'specialiteta', 'fallback'
    ]
    
    for b_key in order:
        source_key = alias_map.get(b_key, b_key)
        item = base[source_key]
        badges[b_key] = {
            "shortName": item["shortName"],
            "short": item["shortName"],
            "title": item["title"],
            "origin": item["origin"],
            "description": item["description"],
            "desc": item["description"],
            "fact": item["fact"]
        }
    return {"badges": badges}

provenance_translations = {
    'pl': build_provenance_dict('pl'),
    'cs': build_provenance_dict('cs'),
    'es': build_provenance_dict('es')
}
