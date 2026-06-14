CREATE DATABASE IF NOT EXISTS banco_restaurante
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE banco_restaurante;

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(120) NOT NULL,
    pedidos TEXT NOT NULL,
    observacao TEXT,
    desconto DECIMAL(10,2) DEFAULT 0.00,
    valor_final DECIMAL(10,2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);