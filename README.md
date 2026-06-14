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

## Documentação

1. [Análise, Planejamento e Prototipação](docs/01-An%C3%A1lise%2C%20Planejamento%20e%20Prototipa%C3%A7%C3%A3o.md)
2. [Preparação do ambiente em nuvem e local](docs/02-Prepara%C3%A7%C3%A3o%20do%20ambiente%20em%20nuvem%20e%20local.md)
3. [Gerência e monitoração de ambientes de redes](docs/03-Ger%C3%AAncia%20e%20monitora%C3%A7%C3%A3o%20de%20ambientes%20de%20redes.md)
4. [Mecanismos de Segurança](docs/04-Mecanismos%20de%20Seguran%C3%A7a.md)
5. [Apresentação Final](docs/05-Apresenta%C3%A7%C3%A3o%20Final.md)

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
