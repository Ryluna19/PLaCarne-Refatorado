<?php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'banco_restaurante';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao conectar ao banco de dados.'
    ]);
    exit;
}

$conn->set_charset('utf8mb4');

function jsonResponse($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
?>