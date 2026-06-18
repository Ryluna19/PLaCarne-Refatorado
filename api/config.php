<?php

// Configuração da conexão local com MySQL via XAMPP
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'banco_restaurante';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.'
    ]);
}

$conn->set_charset('utf8mb4');

// Padroniza respostas da API em JSON
function jsonResponse($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}