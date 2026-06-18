<?php

require_once __DIR__ . '/config.php';
// salvar-pedido.php
validarMetodo('POST');

// Lê os dados enviados pelo formulário
$dados = json_decode(file_get_contents('php://input'), true);

if (!is_array($dados)) {
    jsonResponse([
        'success' => false,
        'message' => 'Dados inválidos.'
    ]);
}

$nome = trim($dados['nome'] ?? '');
$telefone = trim($dados['telefone'] ?? '');
$email = trim($dados['email'] ?? '');
$pedidosRecebidos = $dados['pedidos'] ?? [];
$observacao = trim($dados['observacao'] ?? '');
$codigoDesconto = trim($dados['codigoDesconto'] ?? '');

// Produtos e preços definidos no backend
$produtosDisponiveis = [
    'La Carne Atômico' => 50.00,
    'Triplo Cheddar' => 40.00,
    'Clássico Angus' => 30.00,
    'Duplo da Casa' => 25.00
];

// Cupons válidos do Jogo da Sorte
$cuponsDisponiveis = [
    '5555' => 5,
    '1010' => 10,
    '1515' => 15,
    '2020' => 20,
    '2525' => 25,
    '3030' => 30
];

if ($nome === '' || $telefone === '' || $email === '' || empty($pedidosRecebidos)) {
    jsonResponse([
        'success' => false,
        'message' => 'Preencha nome, telefone, email e pelo menos um pedido.'
    ]);
}

if (!is_array($pedidosRecebidos)) {
    jsonResponse([
        'success' => false,
        'message' => 'Formato de pedidos inválido.'
    ]);
}

// Confere os produtos e calcula o total pelo backend
$totalPedido = 0;
$pedidosValidos = [];

foreach ($pedidosRecebidos as $pedido) {
    if (!array_key_exists($pedido, $produtosDisponiveis)) {
        jsonResponse([
            'success' => false,
            'message' => 'Um dos produtos selecionados é inválido.'
        ]);
    }

    $pedidosValidos[] = $pedido;
    $totalPedido += $produtosDisponiveis[$pedido];
}

// Aplica desconto somente para cupons reconhecidos
$percentualDesconto = $cuponsDisponiveis[$codigoDesconto] ?? 0;
$valorDesconto = $totalPedido * ($percentualDesconto / 100);
$valorFinal = $totalPedido - $valorDesconto;

$pedidos = implode(', ', $pedidosValidos);

$sql = "INSERT INTO pedidos (
            nome,
            telefone,
            email,
            pedidos,
            observacao,
            desconto,
            valor_final,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Recebido')";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao preparar pedido.'
    ]);
}

$stmt->bind_param(
    'sssssdd',
    $nome,
    $telefone,
    $email,
    $pedidos,
    $observacao,
    $valorDesconto,
    $valorFinal
);

if (!$stmt->execute()) {
    jsonResponse([
        'success' => false,
        'message' => 'Erro ao salvar pedido.'
    ]);
}

// Retorna os valores calculados pelo servidor
jsonResponse([
    'success' => true,
    'message' => 'Pedido registrado com sucesso.',
    'valorDesconto' => $valorDesconto,
    'valorFinal' => $valorFinal,
    'status' => 'Recebido'
]);
