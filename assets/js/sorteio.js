// Números fixos para manter o jogo previsível no projeto demo
const numerosSorteados = [2, 4, 5, 7, 8, 10];

// Cupons liberados de acordo com a quantidade de acertos
const cuponsPorAcerto = {
    1: { codigo: "5555", desconto: 5 },
    2: { codigo: "1010", desconto: 10 },
    3: { codigo: "1515", desconto: 15 },
    4: { codigo: "2020", desconto: 20 },
    5: { codigo: "2525", desconto: 25 },
    6: { codigo: "3030", desconto: 30 }
};

// Captura os números digitados pelo usuário
function obterNumerosEscolhidos() {
    return Array.from(document.querySelectorAll(".numero-sorte"))
        .map(input => Number(input.value))
        .filter(numero => numero);
}

// Valida se foram escolhidos 6 números únicos entre 1 e 10
function validarNumeros(numeros) {
    const numerosUnicos = new Set(numeros);

    if (numeros.length !== 6) {
        return "Preencha todos os 6 números.";
    }

    if (numerosUnicos.size !== 6) {
        return "Não é permitido repetir números.";
    }

    const foraDoLimite = numeros.some(numero => numero < 1 || numero > 10);

    if (foraDoLimite) {
        return "Escolha apenas números entre 1 e 10.";
    }

    return null;
}

// Calcula quantos números escolhidos existem no resultado sorteado
function calcularAcertos(numeros) {
    return numeros.filter(numero => numerosSorteados.includes(numero)).length;
}

// Exibe o resultado e salva o cupom para usar no formulário
function exibirResultado(acertos) {
    const resultado = document.getElementById("resultado");

    if (acertos === 0) {
        resultado.innerHTML = `
            <h3>Não foi dessa vez</h3>
            <p>Você não acertou nenhum número, mas ainda pode fazer seu pedido normalmente.</p>
            <p><strong>Números sorteados:</strong> ${numerosSorteados.join(", ")}</p>
            <a href="formulario.html" class="button primary">Fazer Pedido</a>
        `;

        resultado.style.display = "block";
        return;
    }

    const cupom = cuponsPorAcerto[acertos];

    localStorage.setItem("lacarneCupom", cupom.codigo);

    resultado.innerHTML = `
        <h3>Você acertou ${acertos} número(s)!</h3>
        <p>Seu desconto é de <strong>${cupom.desconto}%</strong>.</p>
        <p>Use o cupom: <strong>${cupom.codigo}</strong></p>
        <p><strong>Números sorteados:</strong> ${numerosSorteados.join(", ")}</p>
        <a href="formulario.html" class="button primary">Usar Cupom no Pedido</a>
    `;

    resultado.style.display = "block";
}

// Controla o envio do formulário do jogo
document.getElementById("sorteioForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const numerosEscolhidos = obterNumerosEscolhidos();
    const erroValidacao = validarNumeros(numerosEscolhidos);

    if (erroValidacao) {
        alert(erroValidacao);
        return;
    }

    const acertos = calcularAcertos(numerosEscolhidos);

    exibirResultado(acertos);
});
