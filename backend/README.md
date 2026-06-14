# CoopCred API

API REST com interface web simples para Gestão de Ativos de Rede da CoopCred Minas.

## Objetivo da API

Esta aplicação representa o servidor de aplicações da CoopCred Minas na entrega final do Eixo 5. A API permite cadastrar, listar, buscar, atualizar e excluir ativos de rede da infraestrutura simulada do projeto. Também existe um painel web simples em `/` para demonstrar o CRUD.

## Tecnologias utilizadas

- Node.js
- Express
- SQLite
- HTML, CSS e JavaScript puro para o painel web

## Como instalar as dependências

```bash
cd backend
npm install
```

## Como executar localmente

```bash
cd backend
npm start
```

A API roda por padrão em `http://localhost:3000`.

Se a porta 3000 estiver ocupada, use outra porta com variáveis de ambiente:

```bash
PORT=3333 HOST=127.0.0.1 npm start
```

## Como testar no navegador

- Painel web: `http://localhost:3000/`
- Health: `http://localhost:3000/health`
- Ativos: `http://localhost:3000/ativos`

## Rotas disponíveis

- `GET /`
- `GET /health`
- `POST /ativos`
- `GET /ativos`
- `GET /ativos/:id`
- `PUT /ativos/:id`
- `DELETE /ativos/:id`

## Exemplo de JSON para criar um ativo

```json
{
  "nome": "MTZ-AP-01",
  "tipo": "Access Point",
  "ip": "192.168.0.30",
  "localizacao": "Matriz - Uberlandia",
  "sistema_operacional": "N/A",
  "servico": "Wi-Fi Corporativo",
  "status": "Ativo",
  "responsavel": "Infraestrutura"
}
```

## Exemplos de uso com curl

Abrir painel web:

```bash
curl http://localhost:3000/
```

Verificar saúde da API:

```bash
curl http://localhost:3000/health
```

Listar ativos:

```bash
curl http://localhost:3000/ativos
```

Buscar um ativo por ID:

```bash
curl http://localhost:3000/ativos/1
```

Criar um ativo:

```bash
curl -X POST http://localhost:3000/ativos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "FIL01-RT-01",
    "tipo": "Roteador",
    "ip": "192.168.1.1",
    "localizacao": "Filial - Araguari",
    "sistema_operacional": "RouterOS",
    "servico": "Gateway Local",
    "status": "Ativo",
    "responsavel": "Infraestrutura"
  }'
```

Atualizar um ativo:

```bash
curl -X PUT http://localhost:3000/ativos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "MTZ-SRV-AD-01",
    "tipo": "Servidor",
    "ip": "192.168.0.10",
    "localizacao": "Matriz - Uberlandia",
    "sistema_operacional": "Windows Server 2022",
    "servico": "Active Directory",
    "status": "Em manutenção",
    "responsavel": "TI e Seguranca de Dados"
  }'
```

Remover um ativo:

```bash
curl -X DELETE http://localhost:3000/ativos/1
```

## Deploy básico em servidor Ubuntu com npm e pm2

1. Instale Node.js no servidor.
2. Copie o projeto para o servidor.
3. Entre na pasta `backend`.
4. Instale as dependências com `npm install`.
5. Inicie a API localmente com `npm start` para validar o funcionamento.
6. Instale o pm2 com `npm install -g pm2`.
7. Suba a aplicação com `pm2 start server.js --name coopcred-api`.
8. Salve o processo com `pm2 save`.
9. Configure inicialização automática com `pm2 startup`.

## Observacoes

- O banco SQLite é criado automaticamente na primeira execução.
- A tabela `ativos` é criada automaticamente, se necessário.
- A aplicação insere ativos iniciais quando a tabela está vazia.
- Os arquivos do painel web ficam em `backend/public`.
