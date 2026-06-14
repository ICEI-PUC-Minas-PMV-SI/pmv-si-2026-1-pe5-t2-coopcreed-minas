# CoopCred Minas API de Ativos de Rede

API REST com painel web demonstrativo para Gestão de Ativos de Rede da CoopCred Minas.

## Objetivo da aplicação

Esta aplicação CRUD simples permite cadastrar, listar, consultar, atualizar e excluir ativos de rede da infraestrutura simulada da CoopCred Minas. Além da API REST, existe um painel web simples em `/`, usado para facilitar a validação visual das operações CRUD.

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

## Deploy em nuvem

- Provedor: AWS EC2
- Servidor lógico: `MTZ-SRV-APP-CLOUD-01`
- Sistema operacional: Ubuntu Server
- Aplicação: CRUD de Gestão de Ativos de Rede
- Stack de deploy: Node.js, Express, SQLite, PM2 e Nginx
- Porta interna da aplicação: `3000`
- Porta pública: `80` HTTP
- Elastic IP associado: `52.206.244.45`
- Aplicação publicada: `http://52.206.244.45/`
- Health check público: `http://52.206.244.45/health`
- Listagem pública de ativos: `http://52.206.244.45/ativos`

## Arquitetura do deploy

Fluxo da requisição:

`Cliente/Navegador -> HTTP porta 80 -> Nginx -> 127.0.0.1:3000 -> Node.js/Express -> SQLite`

## Segurança básica do deploy

- A porta `3000` da aplicação não foi exposta diretamente para a internet.
- O acesso público acontece pelo Nginx na porta `80`.
- O processo Node.js fica mantido pelo PM2.
- O Elastic IP foi associado para evitar mudança do endereço público após `stop/start` da instância.

## Exemplos públicos com curl

Verificar saúde da API publicada:

```bash
curl http://52.206.244.45/health
```

Listar ativos publicados:

```bash
curl http://52.206.244.45/ativos
```

## Observações

- O banco SQLite é criado automaticamente na primeira execução.
- A tabela `ativos` é criada automaticamente, se necessário.
- A aplicação insere ativos iniciais quando a tabela está vazia.
- Os arquivos do painel web ficam em `backend/public`.
- O banco SQLite gerado localmente não deve ser versionado.
- Chaves `.pem` e arquivos `.env` não devem ser versionados.
