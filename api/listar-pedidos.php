<?php

require_once __DIR__ . '/config.php';

// listar-pedidos.php
validarMetodo('GET');

// Busca todos os pedidos registrados no banco
$sql = "SELECT 
            id,
            nome,
            telefone,
            email,
            pedidos,
            observacao,
            desconto,
            valor_final,
            status,
            data_hora
        FROM pedidos
        ORDER BY id DESC";

$result = $conn->query($sql);

if (!$result) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao carregar pedidos.'
    ]);
}

$pedidos = [];

while ($row = $result->fetch_assoc()) {
    $row['id'] = (int) $row['id'];
    $row['desconto'] = (float) $row['desconto'];
    $row['valor_final'] = (float) $row['valor_final'];

    $pedidos[] = $row;
}

jsonResponse([
    'success' => true,
    'pedidos' => $pedidos
]);