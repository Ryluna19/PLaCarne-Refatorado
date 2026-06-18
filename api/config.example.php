<?php

// Copie este arquivo como config.php e ajuste os dados do banco local
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'banco_restaurante';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.'
    ], 500);
}

$conn->set_charset('utf8mb4');

// Retorna uma resposta padronizada em JSON
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

// Garante que cada endpoint aceite apenas o método HTTP esperado
function validarMetodo($metodoEsperado) {
    if ($_SERVER['REQUEST_METHOD'] !== $metodoEsperado) {
        jsonResponse([
            'success' => false,
            'message' => 'Método não permitido.'
        ], 405);
    }
}

