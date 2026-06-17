// Formata números como moeda brasileira
function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Evita inserir texto do banco diretamente no HTML
function limparTexto(texto) {
    return String(texto || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Carrega os pedidos salvos no banco
async function carregarPedidos() {
    const container = document.getElementById("pedidosContainer");
    container.innerHTML = "<p>Carregando pedidos...</p>";

    try {
        const response = await fetch("php/listar-pedidos.php");
        const data = await response.json();

        if (!data.success) {
            container.innerHTML = "<p>Erro ao carregar pedidos.</p>";
            return;
        }

        if (data.pedidos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Quando um cliente fizer um pedido, ele aparecerá aqui.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.pedidos.map(pedido => `
            <div class="pedido-card">
                <div class="pedido-topo">
                    <h3 class="pedido-id">Pedido #${pedido.id}</h3>

                    <button class="button small btn-danger" onclick="deletarPedido(${pedido.id})">
                        Deletar
                    </button>
                </div>

                <p class="pedido-info"><strong>Cliente:</strong> ${limparTexto(pedido.nome)}</p>
                <p class="pedido-info"><strong>Telefone:</strong> ${limparTexto(pedido.telefone)}</p>
                <p class="pedido-info"><strong>Email:</strong> ${limparTexto(pedido.email)}</p>
                <p class="pedido-info"><strong>Pedido:</strong> ${limparTexto(pedido.pedidos || "Não informado")}</p>
                <p class="pedido-info"><strong>Observação:</strong> ${limparTexto(pedido.observacao || "Nenhuma")}</p>
                <p class="pedido-info"><strong>Desconto:</strong> ${formatarMoeda(pedido.desconto)}</p>

                <p class="pedido-total">
                    Total: ${formatarMoeda(pedido.valor_final)}
                </p>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
}

// Remove um pedido pelo ID
async function deletarPedido(id) {
    const confirmar = confirm(`Deseja deletar o pedido #${id}?`);

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(`php/listar-pedidos.php?id=${id}`);
        const data = await response.json();

        if (data.success) {
            alert("Pedido deletado com sucesso!");
            carregarPedidos();
            return;
        }

        alert(data.message || "Erro ao deletar pedido.");

    } catch (error) {
        console.error(error);
        alert("Erro ao deletar pedido.");
    }
}

carregarPedidos();
