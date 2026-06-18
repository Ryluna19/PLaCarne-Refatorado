// Valores usados para calcular o total do pedido
const valoresPedidos = {
    "La Carne Atômico": 50,
    "Triplo Cheddar": 40,
    "Clássico Angus": 30,
    "Duplo da Casa": 25
};

// Cria um novo campo de seleção de pedido
function adicionarPedido() {
    const novoPedido = document.createElement("div");
    novoPedido.classList.add("pedido-item");

    novoPedido.innerHTML = `
        <select name="pedido" class="pedido-dropdown">
            <option value="">Selecione um pedido</option>
            <option value="La Carne Atômico">La Carne Atômico - R$ 50</option>
            <option value="Triplo Cheddar">Triplo Cheddar - R$ 40</option>
            <option value="Clássico Angus">Clássico Angus - R$ 30</option>
            <option value="Duplo da Casa">Duplo da Casa - R$ 25</option>
        </select>

        <button type="button" onclick="adicionarPedido()">+</button>
        <button type="button" onclick="removerPedido(this)">−</button>
    `;

    document.getElementById("pedidoContainer").appendChild(novoPedido);
}

// Remove um item do pedido
function removerPedido(button) {
    const pedidoItem = button.parentElement;
    pedidoItem.remove();
}

// Calcula o desconto com base no código informado
function calcularDesconto(codigoDesconto, totalPedido) {
    const cupons = {
        "5555": 5,
        "1010": 10,
        "1515": 15,
        "2020": 20,
        "2525": 25,
        "3030": 30
    };

    const percentual = cupons[codigoDesconto] || 0;

    return totalPedido * (percentual / 100);
}

// Formata valores em reais
function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Preenche automaticamente o cupom vindo do Jogo da Sorte
function preencherCupomSalvo() {
    const cupomSalvo = localStorage.getItem("lacarneCupom");
    const descontoInput = document.getElementById("desconto");

    if (cupomSalvo && descontoInput) {
        descontoInput.value = cupomSalvo;
    }
}

preencherCupomSalvo();

// Envia o pedido para o PHP e atualiza o resumo na tela
document.getElementById("pedidoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("name").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const descontoCodigo = document.getElementById("desconto").value.trim();
    const observacao = document.getElementById("observacao").value.trim();

    const pedidos = Array.from(document.querySelectorAll(".pedido-dropdown"))
        .map(select => select.value)
        .filter(value => value);

    if (!nome || !telefone || !email || pedidos.length === 0) {
        alert("Preencha nome, telefone, email e pelo menos um pedido.");
        return;
    }

    const totalPedido = pedidos.reduce((total, pedido) => {
        return total + (valoresPedidos[pedido] || 0);
    }, 0);

    const valorDesconto = calcularDesconto(descontoCodigo, totalPedido);
    const valorFinal = totalPedido - valorDesconto;

    fetch("api/salvar-pedido.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome,
            telefone,
            email,
            pedidos,
            observacao,
            valorDesconto,
            valorFinal,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Pedido gravado com sucesso!");
            } else {
                alert(data.message || "Erro ao gravar pedido.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao enviar o pedido.");
        });

    // Atualiza o resumo do pedido na página
    document.getElementById("outputNome").textContent = nome;
    document.getElementById("outputTelefone").textContent = telefone;
    document.getElementById("outputEmail").textContent = email;
    document.getElementById("outputPedido").textContent = pedidos.join(", ");
    document.getElementById("outputPreferencia").textContent = observacao || "Nenhuma";
    document.getElementById("outputDesconto").textContent = formatarMoeda(valorDesconto);
    document.getElementById("outputValorFinal").textContent = formatarMoeda(valorFinal);

    document.getElementById("output").style.display = "block";
});

// Abre o Jogo da Sorte em uma nova aba
function redirecionar() {
    const mensagem = document.getElementById("mensagem");

    mensagem.classList.add("esconder");
    mensagem.classList.add("disabled");

    window.open("sorteio.html", "_blank");

    return false;
}
