INSERT INTO categoria (nome) VALUES
('Para começar'),
('Entradas'),
('Do mar'),
('Assinaturas do chef'),
('Sobremesas'),
('Adega e copos');

-- produtos de exemplo, troque pelos pratos reais
INSERT INTO produto (nome, descricao, preco, ativo, categoria_id) VALUES
('Pão da casa', 'Pão artesanal com manteiga de ervas', 18.00, TRUE, 1),
('Bolinho de peixe', 'Porção com 6 unidades', 34.00, TRUE, 2),
('Moqueca de peixe', 'Peixe do dia com leite de coco e dendê', 98.00, TRUE, 3),
('Camarão ao alho', 'Camarões grandes salteados no alho', 89.00, TRUE, 3),
('Peixe do chef', 'Prato assinatura do chef', 125.00, TRUE, 4),
('Pudim de leite', 'Pudim com calda de caramelo', 22.00, TRUE, 5),
('Suco natural', 'Sabores do dia', 14.00, TRUE, 6),
('Vinho da casa (taça)', 'Taça de vinho', 32.00, TRUE, 6);
