# Projeto de Infraestrutura de Rede – CoopCred Minas

`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Projeto de Infraestrutura`

`Eixo: 5`

O projeto tem como objetivo desenvolver uma proposta de infraestrutura de rede para a cooperativa financeira fictícia CoopCred Minas, sediada em Uberlândia/MG e com filiais nas cidades de Araguari e Monte Carmelo.

## Integrantes

* Amanda Magalhães Silva
* Gustavo Torres da Rocha Castro
* Luanna Gyovana Rodrigues da Silva
* Milleny Ellen Jodas Ferreira
* Nico Rocha da Costa

## Orientador

* Alexandre Teixeira

## Aplicação Back-end CRUD

Foi criada uma API REST com painel web simples para Gestão de Ativos de Rede da CoopCred Minas.

O código da aplicação está na pasta `backend`.

A aplicação usa Node.js, Express, SQLite, HTML, CSS e JavaScript puro para disponibilizar um CRUD simples de ativos de rede.

Rotas principais:

- `GET /`
- `GET /health`
- `POST /ativos`
- `GET /ativos`
- `GET /ativos/:id`
- `PUT /ativos/:id`
- `DELETE /ativos/:id`

Execução local:

```bash
cd backend
npm install
npm start
```

Painel web:

```text
http://localhost:3000/
```

A aplicação será implantada no servidor de aplicações da CoopCred Minas como parte da entrega final do Eixo 5.
