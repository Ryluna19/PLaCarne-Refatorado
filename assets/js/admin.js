// Status disponíveis para atualização do pedido
const statusPermitidos = [
    "Recebido",
    "Em preparo",
    "Saiu para entrega",
    "Concluído",
    "Cancelado"
];

// Formata valores como moeda brasileira
function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Formata a data e hora recebidas do MySQL
function formatarDataHora(valor) {
    if (!valor) {
        return "Não informado";
    }

    const [data, horaCompleta] = String(valor).split(" ");

    if (!data || !horaCompleta) {
        return valor;
    }

    const [ano, mes, dia] = data.split("-");
    const hora = horaCompleta.slice(0, 5);

    return `${dia}/${mes}/${ano} às ${hora}`;
}

// Retorna uma classe CSS específica para cada status
function obterClasseStatus(status) {
    const classes = {
        "Recebido": "status-recebido",
        "Em preparo": "status-em-preparo",
        "Saiu para entrega": "status-em-entrega",
        "Concluído": "status-concluido",
        "Cancelado": "status-cancelado"
    };

    return classes[status] || "status-recebido";
}

// Evita que textos vindos do banco sejam interpretados como HTML
function limparTexto(valor) {
    const texto = String(valor ?? "");

    return texto.replace(/[&<>"']/g, caractere => {
        const caracteresSeguros = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteresSeguros[caractere];
    });
}

// Exibe uma mensagem no container de pedidos
function exibirMensagem(mensagem) {
    const container = document.getElementById("pedidosContainer");
    container.innerHTML = `<p>${mensagem}</p>`;
}

// Monta o select de status de cada pedido
function montarSelectStatus(pedido) {
    const statusAtual = pedido.status || "Recebido";

    const options = statusPermitidos.map(status => {
        const selecionado = status === statusAtual ? "selected" : "";

        return `
            <option value="${status}" ${selecionado}>
                ${status}
            </option>
        `;
    }).join("");

    return `
        <div class="status-area">
            <label for="status-${pedido.id}">Status do pedido</label>

            <div class="status-control">
                <select id="status-${pedido.id}" class="status-select">
                    ${options}
                </select>

                <button
                    type="button"
                    class="button small status-button"
                    onclick="atualizarStatus(${pedido.id})"
                >
                    Salvar Status
                </button>
            </div>
        </div>
    `;
}

// Carrega os pedidos registrados no banco
async function carregarPedidos() {
    const container = document.getElementById("pedidosContainer");

    exibirMensagem("Carregando pedidos...");

    try {
        const response = await fetch("api/listar-pedidos.php", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            exibirMensagem(data.message || "Erro ao carregar pedidos.");
            return;
        }

        if (!Array.isArray(data.pedidos)) {
            throw new Error("A API não retornou uma lista de pedidos válida.");
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

        container.innerHTML = data.pedidos.map(pedido => {
            const statusAtual = pedido.status || "Recebido";
            const classeStatus = obterClasseStatus(statusAtual);

            return `
                <article class="pedido-card">
                    <div class="pedido-topo">
                        <div>
                            <h3 class="pedido-id">Pedido #${pedido.id}</h3>

                            <span class="pedido-status ${classeStatus}">
                                ${limparTexto(statusAtual)}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="button small btn-danger"
                            onclick="deletarPedido(${pedido.id})"
                        >
                            Deletar
                        </button>
                    </div>

                    <p class="pedido-info">
                        <strong>Cliente:</strong> ${limparTexto(pedido.nome)}
                    </p>

                    <p class="pedido-info">
                        <strong>Telefone:</strong> ${limparTexto(pedido.telefone)}
                    </p>

                    <p class="pedido-info">
                        <strong>Email:</strong> ${limparTexto(pedido.email)}
                    </p>

                    <p class="pedido-info">
                        <strong>Pedido:</strong> ${limparTexto(pedido.pedidos || "Não informado")}
                    </p>

                    <p class="pedido-info">
                        <strong>Observação:</strong> ${limparTexto(pedido.observacao || "Nenhuma")}
                    </p>

                    <p class="pedido-info">
                        <strong>Realizado em:</strong> ${formatarDataHora(pedido.data_hora)}
                    </p>

                    <p class="pedido-info">
                        <strong>Desconto:</strong> ${formatarMoeda(pedido.desconto)}
                    </p>

                    <p class="pedido-total">
                        Total: ${formatarMoeda(pedido.valor_final)}
                    </p>

                    ${montarSelectStatus(pedido)}
                </article>
            `;
        }).join("");

    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);

        container.innerHTML = `
            <p>
                Não foi possível exibir os pedidos. Abra o console do navegador
                para verificar o erro detalhado.
            </p>
        `;
    }
}

// Atualiza o status de um pedido
async function atualizarStatus(id) {
    const select = document.getElementById(`status-${id}`);
    const status = select.value;

    try {
        const response = await fetch("api/atualizar-status.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                status
            })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Erro ao atualizar status.");
            return;
        }

        alert("Status atualizado com sucesso!");
        carregarPedidos();

    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Não foi possível atualizar o status.");
    }
}

// Remove um pedido pelo ID
async function deletarPedido(id) {
    const confirmar = confirm(`Deseja deletar o pedido #${id}?`);

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(`api/deletar-pedido.php?id=${id}`, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Erro ao deletar pedido.");
            return;
        }

        alert("Pedido deletado com sucesso!");
        carregarPedidos();

    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        alert("Não foi possível deletar o pedido.");
    }
}

// Carrega os pedidos ao abrir a página
carregarPedidos();

