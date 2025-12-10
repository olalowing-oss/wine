-- Seed wine regions - Part 2 (Spanien, Portugal, Tyskland, USA, Sydamerika, Australien, Nya Zeeland, Sydafrika)

-- SPANIEN - Rioja
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('rioja', 'Rioja', NULL, 'Spanien', NULL, 'region', 'Kontinentalt med atlantisk/medelhavspåverkan', 'Norra Spanien vid Ebro-floden. Tempranillo-dominerat med traditionell amerikansk ek-lagring.', 'Tempranillo, Garnacha, Graciano, Mazuelo', 'Från unga Joven till långlagrade Gran Reserva', 'Rioja Alta (elegant), Rioja Alavesa (fruktig), Rioja Baja (kraftig)', 'Joven, Crianza (2 år, 1 år ek), Reserva (3 år, 1 år ek), Gran Reserva (5 år, 2 år ek)', 'Amerikansk ek traditionellt, dill och vanilj-toner', 110),

('ribera-del-duero', 'Ribera del Duero', NULL, 'Spanien', NULL, 'region', 'Kontinentalt, högt belägen (700-1000m)', 'Centrala Spanien. Tempranillo (lokalt Tinto Fino). Kraftigare än Rioja, modern stil.', 'Tempranillo (Tinto Fino/Tinta del País)', 'Kraftfulla röda viner med intensiv frukt', NULL, 'DO, längre lagring än Rioja för Reserva/Gran Reserva', 'Höjd ger stor temperaturskillnad dag/natt, intensitet', 111),

('priorat', 'Priorat', ARRAY['Priorato'], 'Spanien', NULL, 'region', 'Medelhavsklimat, brant terräng', 'Katalonien, sydöstra Spanien. Garnacha och Cariñena på llicorella (skiffer). Koncentrerade, minerala viner.', 'Garnacha, Cariñena (Carignan), Cabernet Sauvignon, Syrah', 'Koncentrerade, kraftfulla röda med mineral och höga alkoholhalter', NULL, 'DOCa (Denominación de Origen Calificada), högsta nivå', 'Llicorella (skiffer), extremt branta vingårdar, koncentration', 112),

('rias-baixas', 'Rías Baixas', NULL, 'Spanien', NULL, 'region', 'Atlantiskt, fuktigt och svalt', 'Galicien, nordvästra Spanien vid Atlantkusten. Albariño-specialist.', 'Albariño', 'Fräscha, syrliga vita viner med citrus och saltvattenton', NULL, 'DO, fem subzoner', 'Perfekt till skaldjur, granitjord, atlant-påverkan', 113),

('jerez', 'Jerez', ARRAY['Sherry'], 'Spanien', NULL, 'region', 'Medelhavsklimat, varmt och torrt', 'Andalusien, sydvästra Spanien. Sherry-triangeln (Jerez, El Puerto, Sanlúcar).', 'Palomino Fino, Pedro Ximénez, Muscatel', 'Fino, Manzanilla, Amontillado, Oloroso, PX, Cream', NULL, 'Solera-system, VOS/VORS för äldre viner', 'Albariza-jord (vit kalk), flor-jäst, oxidativ lagring', 114);

-- PORTUGAL
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('douro', 'Douro', ARRAY['Porto', 'Port'], 'Portugal', NULL, 'region', 'Extremt varmt och torrt kontinentalt', 'Norra Portugal längs Dourofloden. Hem för portvin och moderna torra bordsviner (Douro DOC).', 'Touriga Nacional, Touriga Franca, Tinta Roriz, Tinta Barroca', 'Portvin (Ruby, Tawny, Vintage, LBV) och torra röda bordsviner', NULL, 'DOC, kategorier A-F för vingårdar, Vintage Port kräver deklaration', 'Skifferterasser, extremt klimat, fortifiering för portvin', 120),

('vinho-verde', 'Vinho Verde', NULL, 'Portugal', NULL, 'region', 'Atlantiskt, fuktigt och svalt', 'Nordvästra Portugal. "Grönt vin" - lätt, fräscht, låg alkohol, ofta lätt mousserande.', 'Alvarinho (Albariño), Loureiro, Trajadura', 'Lätta, fräscha vita viner med låg alkohol (8,5-11,5%)', NULL, 'DOC, Alvarinho från Monção e Melgaço är finaste', 'Hög syra, fräsch, ofta lätt mousserande (agulha)', 121);

-- TYSKLAND
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('mosel', 'Mosel', ARRAY['Moselle'], 'Tyskland', NULL, 'region', 'Kallt kontinentalt, branta skiffersluttningar', 'Längs Moselfloden. Världens brantaste vingårdar. Lätt, delikat Riesling med mineraler.', 'Riesling', 'Lätt, delikat, hög syra, låg alkohol, mineralisk (skiffer)', NULL, 'VDP Grosse Lage (Grand Cru), Prädikatswein (Kabinett till TBA)', 'Blå skiffer ger unik mineral, branta sluttningar', 130),

('rheingau', 'Rheingau', NULL, 'Tyskland', NULL, 'region', 'Kontinentalt, optimal södervänd exposition', 'Längs Rhen. 80% Riesling. Elegant, balanserad, fruktigt och mineraliskt.', 'Riesling, Spätburgunder (Pinot Noir)', 'Elegant, balanserad Riesling med frukt och mineral', NULL, 'VDP Grosse Lage, Prädikatswein, Erstes Gewächs', 'Södervänd exposition mot Rhen, balans mellan frukt och syra', 131),

('pfalz', 'Pfalz', ARRAY['Palatinate'], 'Tyskland', NULL, 'region', 'Varmaste tyska regionen, torrt', 'Sydvästra Tyskland. Fylligare Riesling än Mosel, även bra Spätburgunder.', 'Riesling, Spätburgunder (Pinot Noir), Dornfelder', 'Fylligare Riesling, bra röda viner från Spätburgunder', NULL, 'VDP Grosse Lage, Prädikatswein', 'Varmare klimat ger mer kropp och mognad', 132);

-- USA - KALIFORNIEN
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('napa-valley', 'Napa Valley', ARRAY['Napa'], 'USA', NULL, 'region', 'Medelhavsklimat, varmt och torrt', 'Kalifornien. Världsklass Cabernet Sauvignon. Oakville, Rutherford, Stags Leap District är kända AVAs.', 'Cabernet Sauvignon, Merlot, Chardonnay, Sauvignon Blanc', 'Kraftfull, mogen Cabernet med mjuka tanniner och hög alkohol', 'Oakville, Rutherford, Stags Leap District, Howell Mountain, Carneros', 'AVA (American Viticultural Area), inga kvalitetskrav', 'Ikonisk Cabernet, kraftfull stil, höga priser', 140),

('sonoma', 'Sonoma County', ARRAY['Sonoma'], 'USA', NULL, 'region', 'Medelhavsklimat, kallare än Napa med dimma', 'Kalifornien. Mer varierat än Napa. Russian River Valley (Pinot), Dry Creek Valley (Zinfandel).', 'Pinot Noir, Chardonnay, Zinfandel, Cabernet Sauvignon', 'Elegant Pinot Noir, balanserad Chardonnay, kraftfull Zinfandel', 'Russian River Valley, Dry Creek Valley, Alexander Valley, Sonoma Coast', 'AVA-system, många sub-AVAs', 'Kallare än Napa, elegant stil, varierande terroir', 141),

('willamette-valley', 'Willamette Valley', NULL, 'USA', NULL, 'region', 'Kallare, regnigare, maritim påverkan', 'Oregon. Pinot Noir-specialist med burgundisk stil. Elegant med lägre alkohol än Kalifornien.', 'Pinot Noir, Pinot Gris, Chardonnay', 'Elegant, burgundisk stil Pinot Noir med jordig komplexitet', NULL, 'AVA, sex sub-AVAs (Dundee Hills, Yamhill-Carlton)', 'Vulkanisk och sedimentär jord, kallare klimat', 142);

-- USA - WASHINGTON
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('columbia-valley', 'Columbia Valley', NULL, 'USA', NULL, 'region', 'Kontinentalt med stora temperatursvängningar', 'Washington State. Stor region med subregioner Walla Walla och Yakima Valley.', 'Cabernet Sauvignon, Merlot, Syrah, Chardonnay, Riesling', 'Kraftfulla röda, balanserade vita med god syra', 'Walla Walla Valley, Yakima Valley, Red Mountain', 'AVA-system', 'Stora temperatursvängningar dag/natt, balans mellan mognad och syra', 143);

-- SYDAMERIKA - CHILE
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('maipo-valley', 'Maipo Valley', NULL, 'Chile', NULL, 'region', 'Medelhavsklimat, varmt', 'Nära Santiago. Klassiskt Cabernet Sauvignon-område. Concha y Toro, Almaviva.', 'Cabernet Sauvignon, Carménère, Merlot', 'Kraftfulla Cabernet med mogna tanniner', NULL, 'DO-system (Denominación de Origen)', 'Andesbergen ger höjdskillnader och svalare mikroklimat', 150),

('colchagua-valley', 'Colchagua Valley', NULL, 'Chile', NULL, 'region', 'Varmt medelhavsklimat', 'Central Valley. Carménère och Cabernet Sauvignon. Premium röda viner.', 'Carménère, Cabernet Sauvignon, Syrah', 'Kraftfulla, fruktig röda viner', NULL, 'DO, sub-regioner Apalta och Los Lingues', 'Carménère-specialist, värme och koncentration', 151),

('casablanca-valley', 'Casablanca Valley', NULL, 'Chile', NULL, 'region', 'Kallt, dimma från Stilla Havet', 'Mellan Santiago och Valparaíso. Kust-influerat. Sauvignon Blanc, Chardonnay, Pinot Noir.', 'Sauvignon Blanc, Chardonnay, Pinot Noir', 'Fräscha vita viner och elegant Pinot Noir', NULL, 'DO', 'Kust-påverkan ger kyla och syra', 152);

-- SYDAMERIKA - ARGENTINA
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('mendoza', 'Mendoza', NULL, 'Argentina', NULL, 'region', 'Kontinentalt, torrt, högt belägen', 'Västra Argentina vid Andesbergen. 70% av argentinsk vinproduktion. Malbec-hjärtat.', 'Malbec, Cabernet Sauvignon, Bonarda, Torrontés', 'Kraftfull Malbec med mogen frukt och mjuka tanniner', 'Luján de Cuyo, Uco Valley, Maipú', 'GI (Geographical Indication), DOC för vissa', 'Höghöjdsvingårdar (900-1700m), intensiv sol, stora temperatursvängningar', 160),

('cafayate', 'Cafayate', NULL, 'Argentina', NULL, 'region', 'Högt belägen (1700-3000m), torrt', 'Salta-provinsen. Världens högst belägna vingårdar. Torrontés (aromatiskt vitt).', 'Torrontés, Malbec, Cabernet Sauvignon', 'Aromatisk Torrontés med blommor och lychee, höghöjds-Malbec', NULL, 'Höjd ger extrem UV-strålning och stor temperaturskillnad', 'Högst belägna vingårdar i världen, aromatisk Torrontés', 161);

-- AUSTRALIEN
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('barossa-valley', 'Barossa Valley', ARRAY['Barossa'], 'Australien', NULL, 'region', 'Medelhavsklimat, varmt', 'Södra Australien. Kraftfull Shiraz från gamla stockar (50-150 år).', 'Shiraz, Grenache, Cabernet Sauvignon', 'Kraftfull, mogen Shiraz med hög alkohol (14,5-15,5%)', NULL, 'GI (Geographical Indication)', 'Gamla vinstockar, kraftfull stil, mogen frukt', 170),

('mclaren-vale', 'McLaren Vale', NULL, 'Australien', NULL, 'region', 'Medelhavsklimat, maritimt', 'Södra Australien söder om Adelaide. Shiraz, Grenache, Cabernet.', 'Shiraz, Grenache, Cabernet Sauvignon', 'Rik, fyllig Shiraz med choklad och kryddor', NULL, 'GI', 'Medelhavsklimat, rik och fyllig stil', 171),

('margaret-river', 'Margaret River', NULL, 'Australien', NULL, 'region', 'Medelhavsklimat med maritim påverkan', 'Västra Australien. Cabernet Sauvignon och Chardonnay. Elegant, balanserad stil.', 'Cabernet Sauvignon, Chardonnay, Sauvignon Blanc-Sémillon', 'Elegant Cabernet med balans, rik Chardonnay', NULL, 'GI', 'Maritim påverkan ger elegans och balans', 172),

('yarra-valley', 'Yarra Valley', NULL, 'Australien', NULL, 'region', 'Kallare klimat, nära Melbourne', 'Victoria. Pinot Noir och Chardonnay. Burgundisk stil, även mousserande.', 'Pinot Noir, Chardonnay', 'Elegant, burgundisk stil Pinot, rika mousserande viner', NULL, 'GI', 'Kallare klimat för Australien, elegant stil', 173);

-- NYA ZEELAND
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('marlborough', 'Marlborough', NULL, 'Nya Zeeland', NULL, 'region', 'Maritimt, svalt och soligt', 'Norra Sydön. Världsberömd Sauvignon Blanc med intensiva aromer.', 'Sauvignon Blanc, Pinot Noir, Chardonnay', 'Intensiv Sauvignon Blanc med krusbär, passionsfrukt, krispig syra', NULL, 'GI', 'Sauvignon Blanc-specialist, intensiva aromer, hög syra', 180),

('central-otago', 'Central Otago', NULL, 'Nya Zeeland', NULL, 'region', 'Kontinentalt, kallast av alla nyzeeländska regioner', 'Sydön. Världens sydligaste vinregion. Pinot Noir-specialist.', 'Pinot Noir, Pinot Gris, Riesling', 'Elegant, intensiv Pinot Noir med mörk frukt', NULL, 'GI, sub-regioner som Bannockburn och Gibbston', 'Högt belägen, kontinentalt, elegant och intensiv Pinot', 181),

('hawkes-bay', 'Hawke''s Bay', NULL, 'Nya Zeeland', NULL, 'region', 'Varmare, mer sol än övriga Nya Zeeland', 'Nordön. Bordeaux-blends (Merlot, Cabernet), Syrah, Chardonnay.', 'Merlot, Cabernet Sauvignon, Syrah, Chardonnay', 'Strukturerade röda bordeaux-blends, rika Chardonnay', NULL, 'GI, sub-regioner Gimblett Gravels', 'Gimblett Gravels (grus) ger drainage och värme', 182);

-- SYDAFRIKA
INSERT INTO regions (id, name, alternative_names, country, parent_region, region_type, climate, description, key_grapes, wine_styles, notable_appellations, classification_system, characteristics, display_order) VALUES
('stellenbosch', 'Stellenbosch', NULL, 'Sydafrika', NULL, 'region', 'Medelhavsklimat med påverkan från både Atlanten och Indiska oceanen', 'Western Cape. Sydafrikas premiumregion. Cabernet Sauvignon, Pinotage, Chenin Blanc.', 'Cabernet Sauvignon, Pinotage, Chenin Blanc, Merlot', 'Strukturerade Cabernet, unika Pinotage, Cape Blends', NULL, 'WO (Wine of Origin), wards och districts', 'Varierande terroir, berg och sluttningar', 190),

('constantia', 'Constantia', NULL, 'Sydafrika', NULL, 'region', 'Medelhavsklimat, kallt från Atlanten', 'Nära Kapstaden. Historisk region (1700-talens Constantia Muscat). Elegant Sauvignon Blanc.', 'Sauvignon Blanc, Sémillon, Muscat', 'Elegant Sauvignon Blanc med mineral', NULL, 'WO, historisk appellation', 'Kallt från oceanen, historiskt viktig', 191),

('swartland', 'Swartland', NULL, 'Sydafrika', NULL, 'region', 'Varmt medelhavsklimat', 'Syrah, Chenin Blanc från gamla buskstockar. Naturvinrörelse, minimal intervention.', 'Syrah, Chenin Blanc, Grenache, Cinsault', 'Kraftfulla, terroir-drivna viner med minimal intervention', NULL, 'WO, naturvinrörelse', 'Gamla buskstockar, terroir-fokus, naturvin', 192);
