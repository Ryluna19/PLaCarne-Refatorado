<?php
require_once __DIR__ . '/config.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    jsonResponse([
        'success' => false,
        'message' => 'ID inválido.'
    ]);
}

$sql = "DELETE FROM pedidos WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao preparar exclusão.'
    ]);
}

$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    jsonResponse([
        'success' => true,
        'message' => 'Pedido deletado com sucesso.'
    ]);
}

jsonResponse([
    'success' => false,
    'message' => 'Erro ao deletar pedido.'
]);
?>