# La Carne - Sistema de Pedidos

Projeto acadêmico refatorado de uma hamburgueria fictícia, desenvolvido com HTML, CSS, JavaScript, PHP e MySQL.

A proposta do projeto é simular um fluxo simples de pedidos online, com cardápio, formulário de pedido, jogo promocional de desconto e painel administrativo para listar e remover pedidos registrados no banco de dados.

## Sobre o projeto

Este projeto foi criado originalmente durante a faculdade, em uma fase inicial dos meus estudos em desenvolvimento web. Posteriormente, foi refatorado para melhorar a organização dos arquivos, o visual da interface, a lógica do pedido e a integração com banco de dados.

A refatoração teve como objetivo transformar um projeto acadêmico antigo em uma versão mais limpa, apresentável e útil para portfólio.

## Funcionalidades

* Página inicial com apresentação da hamburgueria
* Cardápio com produtos e preços
* Formulário para realizar pedidos
* Adição de múltiplos itens no pedido
* Cálculo automático do valor final
* Jogo da Sorte com geração de cupom de desconto
* Preenchimento automático do cupom no formulário
* Persistência de pedidos em banco MySQL
* Painel administrativo para listar pedidos
* Exclusão de pedidos pelo painel admin

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* PHP
* MySQL
* XAMPP
* Git e GitHub

## Estrutura do projeto

```txt
PLaCarne-Refatorado/
├── index.html
├── cardapio.html
├── formulario.html
├── galeria.html
├── informacoes.html
├── sorteio.html
├── admin.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── api/
│   ├── config.php
│   ├── salvar-pedido.php
│   ├── listar-pedidos.php
│   └── deletar-pedido.php
├── database/
│   └── schema.sql
├── README.md
└── .github/
```

## Como executar localmente

Para rodar o projeto, é necessário ter o XAMPP instalado com Apache e MySQL ativos.

### 1. Clone o repositório

```bash
git clone https://github.com/Ryluna19/PLaCarne-Refatorado.git
```

### 2. Coloque o projeto no ambiente do XAMPP

O projeto deve estar acessível pelo `htdocs` do XAMPP.

Exemplo:

```txt
C:\Xamp\htdocs\PLaCarne-Refatorado
```

Também é possível usar um junction/atalho apontando para a pasta real do projeto.

### 3. Crie o banco de dados

Abra o phpMyAdmin:

```txt
http://localhost/phpmyadmin
```

Depois importe o arquivo:

```txt
database/schema.sql
```

Esse arquivo cria o banco `banco_restaurante` e a tabela `pedidos`.

### 4. Configure a conexão com o banco

O arquivo de conexão está em:

```txt
api/config.php
```

Configuração padrão usada com XAMPP:

```php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'banco_restaurante';
```

### 5. Acesse o projeto

```txt
http://localhost/PLaCarne-Refatorado/
```

## Rotas principais

### Frontend

```txt
/index.html
/cardapio.html
/formulario.html
/sorteio.html
/galeria.html
/informacoes.html
/admin.html
```

### API PHP

```txt
/api/salvar-pedido.php
/api/listar-pedidos.php
/api/deletar-pedido.php
```

## Observações

Este projeto não possui sistema de login ou pagamento real. O objetivo é demonstrar conceitos de desenvolvimento web, organização de arquivos, manipulação de DOM, integração com PHP e persistência de dados em MySQL.

## Autor

Desenvolvido por Ryan Santos.

* GitHub: https://github.com/Ryluna19
* LinkedIn: https://www.linkedin.com/in/ryan-bulhoes-santos-560b25225/
git 