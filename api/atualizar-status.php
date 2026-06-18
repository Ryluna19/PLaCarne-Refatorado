<?php

require_once __DIR__ . '/config.php';
// atualizar-status.php
validarMetodo('POST');

// Lê os dados enviados pelo painel administrativo
$dados = json_decode(file_get_contents('php://input'), true);

if (!is_array($dados)) {
    jsonResponse([
        'success' => false,
        'message' => 'Dados inválidos.'
    ]);
}

$id = isset($dados['id']) ? (int) $dados['id'] : 0;
$status = trim($dados['status'] ?? '');

// Define os status aceitos pelo sistema
$statusPermitidos = [
    'Recebido',
    'Em preparo',
    'Saiu para entrega',
    'Concluído',
    'Cancelado'
];

if ($id <= 0) {
    jsonResponse([
        'success' => false,
        'message' => 'ID do pedido inválido.'
    ]);
}

if (!in_array($status, $statusPermitidos, true)) {
    jsonResponse([
        'success' => false,
        'message' => 'Status inválido.'
    ]);
}

// Atualiza o status do pedido
$sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
$stmt = $conn->prepare($sql);

if (!$stmt) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao preparar atualização.'
    ]);
}

$stmt->bind_param('si', $status, $id);

if (!$stmt->execute()) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao atualizar status.'
    ]);
}

if ($stmt->affected_rows === 0) {
    jsonResponse([
        'success' => false,
        'message' => 'Pedido não encontrado ou status já está atualizado.'
    ]);
}

jsonResponse([
    'success' => true,
    'message' => 'Status atualizado com sucesso.'
]);

