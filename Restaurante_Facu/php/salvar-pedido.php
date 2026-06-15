<?php
require_once __DIR__ . '/config.php';

$dados = json_decode(file_get_contents('php://input'), true);

if (!$dados) {
    jsonResponse([
        'success' => false,
        'message' => 'Dados inválidos.'
    ]);
}

$nome = trim($dados['nome'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$email = trim($dados['email'] ?? '');
$pedidosArray = $dados['pedidos'] ?? [];
$observacao = trim($dados['observacao'] ?? '');
$valorDesconto = floatval($dados['valorDesconto'] ?? 0);
$valorFinal = floatval($dados['valorFinal'] ?? 0);

if ($nome === '' || $telefone === '' || $email === '' || empty($pedidosArray)) {
    jsonResponse([
        'success' => false,
        'message' => 'Preencha nome, telefone, email e pelo menos um pedido.'
    ]);
}

if (!is_array($pedidosArray)) {
    jsonResponse([
        'success' => false,
        'message' => 'Formato de pedidos inválido.'
    ]);
}

$pedidos = implode(', ', $pedidosArray);

$sql = "INSERT INTO pedidos 
        (nome, telefone, email, pedidos, observacao, desconto, valor_final) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao preparar consulta.'
    ]);
}

$stmt->bind_param(
    "sssssdd",
    $nome,
    $telefone,
    $email,
    $pedidos,
    $observacao,
    $valorDesconto,
    $valorFinal
);

if ($stmt->execute()) {
    jsonResponse([
        'success' => true,
        'message' => 'Pedido gravado com sucesso.'
    ]);
}

jsonResponse([
    'success' => false,
    'message' => 'Erro ao gravar pedido.'
]);
?>