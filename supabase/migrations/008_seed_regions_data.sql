-- Seed major wine regions
-- Run this after creating the regions table

-- FRANKRIKE - Bordeaux
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('bordeaux', 'Bordeaux', NULL, 'Frankrike', NULL, 'region', 'Maritimt tempererat klimat med mild vinter och varm sommar', 'Sydvästra Frankrike, vid Atlanten. En av världens mest prestigefyllda vinregioner med både vänsterstranden (Left Bank) och högerstranden (Right Bank).', 'Cabernet Sauvignon, Merlot, Cabernet Franc, Petit Verdot, Malbec (röda); Sauvignon Blanc, Sémillon (vita)', 'Assemblage-tradition, kraftfulla röda viner, både torra och söta vita viner', 'Médoc, Pauillac, Margaux, Saint-Émilion, Pomerol, Sauternes', '1855 års klassificering för Médoc och Sauternes, Saint-Émilion Classification', 'Assemblage-tradition, långlivade viner, tydlig terroir-påverkan', 10),

('medoc', 'Médoc', ARRAY['Haut-Médoc'], 'Frankrike', 'bordeaux', 'subregion', 'Maritimt, påverkat av Atlanten', 'Vänsterstranden (Left Bank) i Bordeaux. Cabernet Sauvignon-dominerade viner, kraftfulla och långlivade.', 'Cabernet Sauvignon, Merlot, Cabernet Franc', 'Kraftfulla, tanninrika röda viner med lång lagringsförmåga', 'Pauillac, Margaux, Saint-Julien, Saint-Estèphe', '1855 års klassificering, Cru Bourgeois', 'Grus (graves) ger drainage och värmelagring', 20),

('pauillac', 'Pauillac', NULL, 'Frankrike', 'medoc', 'appellation', 'Maritimt tempererat', 'Hem för flera Premier Cru-slott: Château Lafite Rothschild, Château Latour, Château Mouton Rothschild', 'Cabernet Sauvignon dominant, Merlot, Cabernet Franc', 'Kraftfulla, strukturerade viner med svarta vinbär, cedar och grafit', NULL, 'Tre av fem Premier Cru från 1855', 'Klassisk bordeauxstil, exceptionell lagringspotential', 21),

('saint-emilion', 'Saint-Émilion', NULL, 'Frankrike', 'bordeaux', 'appellation', 'Maritimt med kontinental påverkan', 'Högerstranden (Right Bank). Merlot-dominerade viner med varierande stilar från eleganta till kraftfulla.', 'Merlot, Cabernet Franc, Cabernet Sauvignon', 'Mjukare, fruktigare än Left Bank, sammetslena tanniner', NULL, 'Premier Grand Cru Classé A: Ausone, Cheval Blanc, Angélus, Pavie', 'Kalksten och lera, varierande terroir', 22),

('pomerol', 'Pomerol', NULL, 'Frankrike', 'bordeaux', 'appellation', 'Maritimt tempererat', 'Högerstranden (Right Bank). Liten appellation med några av världens dyraste viner, främst Pétrus.', 'Merlot dominant, Cabernet Franc', 'Sammetslena, lyxiga viner med mörk frukt och tryffel', NULL, 'Ingen officiell klassificering, men Pétrus och Le Pin är ikoniska', 'Lerjord (särskilt blå lera), koncentration och elegans', 23),

('sauternes', 'Sauternes', ARRAY['Barsac'], 'Frankrike', 'bordeaux', 'appellation', 'Maritimt med dimma från floderna', 'Världens finaste söta viner från botrytis-drabbna druvor. Château d''Yquem är mest känd.', 'Sémillon, Sauvignon Blanc, Muscadelle', 'Söta, koncentrerade viner med honung, aprikos och marmelad', NULL, '1855 års klassificering, Château d''Yquem är Premier Cru Supérieur', 'Noble rot (botrytis cinerea), extrem koncentration', 24);

-- FRANKRIKE - Bourgogne (Burgundy)
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('bourgogne', 'Bourgogne', ARRAY['Burgundy'], 'Frankrike', NULL, 'region', 'Kontinentalt klimat, kallare än Bordeaux med stora årsvariationer', 'Östra Frankrike. Hem för världens finaste Pinot Noir och Chardonnay. Komplex terroir och climats-system.', 'Pinot Noir (röda), Chardonnay (vita), lite Gamay och Aligoté', 'Singeldruva-tradition, elegant och terroir-driven', 'Côte de Nuits, Côte de Beaune, Chablis, Beaujolais', 'Grand Cru, Premier Cru, Village, Regional', 'Klimax-systemet, terroir i absolut fokus, små vingårdar', 30),

('cote-de-nuits', 'Côte de Nuits', NULL, 'Frankrike', 'bourgogne', 'subregion', 'Kontinentalt, kallt', 'Norra delen av Côte d''Or. Främst röda viner från Pinot Noir. Hem för några av världens dyraste viner.', 'Pinot Noir', 'Kraftfulla, strukturerade röda viner med stor komplexitet', 'Gevrey-Chambertin, Chambolle-Musigny, Vosne-Romanée, Nuits-Saint-Georges', 'Grand Cru climats: Romanée-Conti, La Tâche, Chambertin', 'Kalksten, öst-vänd exposition, exceptionell terroir', 31),

('cote-de-beaune', 'Côte de Beaune', NULL, 'Frankrike', 'bourgogne', 'subregion', 'Kontinentalt, lite varmare än Côte de Nuits', 'Södra delen av Côte d''Or. Både röda och vita viner, världens finaste Chardonnay.', 'Chardonnay (vita), Pinot Noir (röda)', 'Eleganta Pinot Noir, minerala och rika Chardonnay', 'Puligny-Montrachet, Chassagne-Montrachet, Meursault, Pommard, Volnay', 'Grand Cru: Montrachet, Bâtard-Montrachet, Corton', 'Vita viner med mineral och rik textur, röda eleganta', 32),

('chablis', 'Chablis', NULL, 'Frankrike', 'bourgogne', 'subregion', 'Kallt kontinentalt, risk för frost', 'Norr om Côte d''Or. Stålren, mineralisk Chardonnay på kimmeridgisk kalksten.', 'Chardonnay', 'Torr, mineralisk Chardonnay utan eller minimal ek', 'Grand Cru, Premier Cru, Chablis, Petit Chablis', 'Grand Cru (7 climats), Premier Cru, Village', 'Kimmeridgisk kalksten ger unik mineral karaktär, hög syra', 33),

('beaujolais', 'Beaujolais', NULL, 'Frankrike', 'bourgogne', 'subregion', 'Kontinentalt med påverkan från Saône', 'Söder om Bourgogne. Gamay-druvan på granitjord ger lätta till strukturerade röda viner.', 'Gamay', 'Från lätt och fruktig Beaujolais Nouveau till strukturerad Beaujolais Cru', 'Morgon, Fleurie, Moulin-à-Vent, Brouilly', '10 Crus (Morgon mest kraftfull, Fleurie elegant)', 'Granitjord, kolsyrajäsning (carbonic maceration)', 34);

-- FRANKRIKE - Rhône
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('rhone', 'Rhône', ARRAY['Rhônedalen'], 'Frankrike', NULL, 'region', 'Norra Rhône: Kontinentalt; Södra Rhône: Medelhavsklimat', 'Sydöstra Frankrike, längs Rhônefloden. Delas i Norra Rhône (Syrah) och Södra Rhône (GSM-blends).', 'Norra: Syrah, Viognier; Södra: Grenache, Syrah, Mourvèdre', 'Norra: Elegant Syrah; Södra: Kraftiga blends', 'Côte-Rôtie, Hermitage, Châteauneuf-du-Pape, Gigondas', 'AOC-system, Cru-appellationer', 'Norra = monovarietal Syrah, Södra = GSM-blends', 40),

('cote-rotie', 'Côte-Rôtie', NULL, 'Frankrike', 'rhone', 'appellation', 'Kontinentalt, branta sluttningar', 'Norra Rhône. "Den rostade sluttningen". Elegant Syrah med upp till 20% Viognier co-fermenterat.', 'Syrah, Viognier (max 20%)', 'Elegant, parfymerad Syrah med violer och kryddor', NULL, 'Côte Blonde och Côte Brune', 'Branta granitsluttningar, aromatisk komplexitet', 41),

('hermitage', 'Hermitage', NULL, 'Frankrike', 'rhone', 'appellation', 'Kontinentalt, södervänd sluttning', 'Norra Rhône. Kraftfull, långlivad Syrah. Även vita viner från Marsanne och Roussanne.', 'Syrah (röda), Marsanne, Roussanne (vita)', 'Kraftfulla röda med struktur, rika vita viner', NULL, 'Enkel appellation, olika lieux-dits', 'Granitjord, exceptionell lagringspotential 20-40 år', 42),

('chateauneuf-du-pape', 'Châteauneuf-du-Pape', NULL, 'Frankrike', 'rhone', 'appellation', 'Medelhavsklimat, varmt och torrt', 'Södra Rhône. Upp till 13 tillåtna druvor, Grenache-dominerat. Galets roulés (runda stenar) lagrar värme.', 'Grenache, Syrah, Mourvèdre, + 10 andra', 'Kraftfulla, kryddiga röda viner med komplexitet', NULL, '13 tillåtna druvor, olika terroirs', 'Galets roulés-stenar, hög alkohol (14-16%), kraftfull', 43);

-- FRANKRIKE - Champagne
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('champagne', 'Champagne', NULL, 'Frankrike', NULL, 'region', 'Kontinentalt med maritim påverkan, kallt', 'Nordöstra Frankrike. Världens mest prestigefyllda mousserande vin, méthode champenoise.', 'Pinot Noir, Pinot Meunier, Chardonnay', 'Mousserande viner från NV till Vintage och Prestige Cuvée', 'Montagne de Reims, Vallée de la Marne, Côte des Blancs', 'Grand Cru (17 byar), Premier Cru (42 byar), Échelle des Crus', 'Méthode champenoise, sur lie-lagring, kalksten (craie)', 50);

-- FRANKRIKE - Loire
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('loire', 'Loire', ARRAY['Loiredalen'], 'Frankrike', NULL, 'region', 'Varierar från kontinentalt i öst till maritimt i väst', 'Längs Loirefloden, västra Frankrike. Stor variation från Sauvignon Blanc i öst till Muscadet vid kusten.', 'Sauvignon Blanc, Chenin Blanc, Cabernet Franc, Muscadet (Melon de Bourgogne)', 'Vita viner dominant, men även eleganta röda och rosé', 'Sancerre, Pouilly-Fumé, Vouvray, Chinon, Muscadet', 'AOC-system, Cru-beteckning för vissa', 'Kalla klimat, hög syra, mineralitet, fräscha viner', 60),

('sancerre', 'Sancerre', NULL, 'Frankrike', 'loire', 'appellation', 'Kontinentalt, svalt', 'Övre Loire. Krispig Sauvignon Blanc på kalksten och flinta. Även lite Pinot Noir.', 'Sauvignon Blanc, Pinot Noir', 'Krispig, mineralisk Sauvignon Blanc med citrus och flinta', NULL, 'Tre jordar: terres blanches (kalksten), silex (flinta), caillottes', 'Kalksten och flinta ger mineralitet', 61),

('vouvray', 'Vouvray', NULL, 'Frankrike', 'loire', 'appellation', 'Kontinentalt med påverkan från Loire', 'Chenin Blanc i alla stilar: torrt (sec), halvtorrt (demi-sec), sött (moelleux), mousserande.', 'Chenin Blanc', 'Torrt till sött, stilla och mousserande', NULL, 'Tuffeau (kalksten), lång lagringspotential', 'Chenin Blanc-specialist, stor stilvariation, kan lagras 20+ år', 62);

-- FRANKRIKE - Alsace
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('alsace', 'Alsace', NULL, 'Frankrike', NULL, 'region', 'Kontinentalt, torrt (Vogeserna skyddar)', 'Nordöstra Frankrike, vid tyska gränsen. Aromatiska vita viner, singeldruva på etikett.', 'Riesling, Gewürztraminer, Pinot Gris, Muscat, Pinot Noir', 'Aromatiska vita viner, från torrt till sött', NULL, 'Alsace Grand Cru (51 crus), Vendanges Tardives, Sélection de Grains Nobles', 'Singeldruva-tradition, flûte-flaska, torr stil dominant', 70);

-- ITALIEN - Piemonte
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('piemonte', 'Piemonte', ARRAY['Piedmont'], 'Italien', NULL, 'region', 'Kontinentalt med dimmor (nebbia)', 'Nordvästra Italien, vid alperna. Hem för Nebbiolo (Barolo, Barbaresco) och Barbera.', 'Nebbiolo, Barbera, Dolcetto, Moscato, Cortese', 'Kraftfulla, tanninrika Nebbiolo; saftig Barbera; söt Moscato', 'Barolo, Barbaresco, Barbera d''Alba, Gavi, Asti', 'DOCG, DOC, MGA (Menzioni Geografiche Aggiuntive) för singelvingårdar', 'Nebbiolo dominerar, komplex terroir, långa lagringstider', 80),

('barolo', 'Barolo', NULL, 'Italien', 'piemonte', 'appellation', 'Kontinentalt, dimmigt', '"Vinernas kung". Nebbiolo med minimum 3 års lagring (5 år för Riserva). 11 kommuner.', 'Nebbiolo', 'Kraftfullt, tanninrikt, rosor, tjära, körsbär. Kräver lagring.', NULL, 'DOCG, 11 kommuner (Barolo, La Morra, Serralunga, Monforte)', 'Kalksten och sandsten, MGA-system för vingårdar', 81),

('barbaresco', 'Barbaresco', NULL, 'Italien', 'piemonte', 'appellation', 'Kontinentalt, lite varmare än Barolo', 'Elegantare Nebbiolo än Barolo. Minimum 2 års lagring. Tre huvudbyar.', 'Nebbiolo', 'Elegant, parfymerad, mindre tanninrikt än Barolo', NULL, 'DOCG, tre byar: Barbaresco, Neive, Treiso', 'Kallksten, tidigare mognad än Barolo', 82);

-- ITALIEN - Toscana (Tuscany)
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('toscana', 'Toscana', ARRAY['Tuscany'], 'Italien', NULL, 'region', 'Medelhavsklimat, varmt och torrt', 'Centrala Italien. Sangiovese-hjärtat med Chianti, Brunello och Super Tuscans.', 'Sangiovese, Cabernet Sauvignon, Merlot, Trebbiano', 'Sangiovese-dominerade röda, från lättare Chianti till kraftig Brunello', 'Chianti Classico, Brunello di Montalcino, Bolgheri, Vino Nobile', 'DOCG, DOC, IGT (Super Tuscans)', 'Sangiovese central, Super Toscans introducerade internationella druvor', 90),

('chianti-classico', 'Chianti Classico', NULL, 'Italien', 'toscana', 'appellation', 'Medelhavs-kontinentalt', 'Hjärtat av Chianti mellan Florens och Siena. Svart tupp-symbol (Gallo Nero).', 'Sangiovese (min 80%), kan blandas med Canaiolo och internationella', 'Annata (grundnivå), Riserva, Gran Selezione (högsta)', NULL, 'DOCG, Gran Selezione från 2014', '8 kommuner, högt belägen, sangiovese-driven', 91),

('brunello-di-montalcino', 'Brunello di Montalcino', NULL, 'Italien', 'toscana', 'appellation', 'Medelhavsklimat, varmt', '100% Sangiovese (Brunello-klon). 5 års lagring (6 år för Riserva). Rosso di Montalcino är yngre version.', 'Sangiovese (Brunello)', 'Kraftfull, koncentrerad, lång lagringsförmåga 20-40 år', NULL, 'DOCG, 5 års minimum lagring', 'Klon av Sangiovese, mycket kraftfull', 92);

-- ITALIEN - Veneto
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('veneto', 'Veneto', NULL, 'Italien', NULL, 'region', 'Kontinentalt med påverkan från Adriatiska havet', 'Nordöstra Italien. Hem för Prosecco, Valpolicella, Amarone och Soave.', 'Corvina, Glera, Garganega, Pinot Grigio', 'Allt från Prosecco till Amarone, stor variation', 'Valpolicella, Amarone, Soave, Prosecco', 'DOCG, DOC', 'Appassimento-teknik för Amarone, prisvärd kvalitet', 100),

('valpolicella', 'Valpolicella', NULL, 'Italien', 'veneto', 'appellation', 'Kontinentalt', 'Corvina-baserade viner i olika stilar: Valpolicella, Ripasso, Amarone, Recioto.', 'Corvina, Rondinella, Molinara', 'Valpolicella: lätt. Ripasso: medel. Amarone: kraftfull (15-17%). Recioto: söt.', NULL, 'DOC för Valpolicella, DOCG för Amarone och Recioto', 'Appassimento (torkning) för Amarone/Recioto', 101);

-- Fler regioner följer... (Detta är första delen)
