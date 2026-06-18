<?php

require_once __DIR__ . '/config.php';
// Permite exclusão apenas por requisição POST
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

if ($id <= 0) {
    jsonResponse([
        'success' => false,
        'message' => 'ID do pedido inválido.'
    ]);
}

// Remove apenas o pedido informado
$sql = 'DELETE FROM pedidos WHERE id = ?';
$stmt = $conn->prepare($sql);

if (!$stmt) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao preparar exclusão.'
    ]);
}

$stmt->bind_param('i', $id);

if (!$stmt->execute()) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao deletar pedido.'
    ]);
}

if ($stmt->affected_rows === 0) {
    jsonResponse([
        'success' => false,
        'message' => 'Pedido não encontrado.'
    ]);
}

jsonResponse([
    'success' => true,
    'message' => 'Pedido deletado com sucesso.'
]);
