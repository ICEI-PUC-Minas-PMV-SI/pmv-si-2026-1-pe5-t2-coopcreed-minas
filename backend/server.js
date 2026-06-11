const path = require("path");
const express = require("express");
const { all, get, initializeDatabase, run } = require("./database");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;
const REQUIRED_FIELDS = ["nome", "tipo", "ip", "localizacao", "status"];

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const asyncHandler = (handler) => async (request, response, next) => {
  try {
    await handler(request, response, next);
  } catch (error) {
    next(error);
  }
};

const validateAtivoPayload = (payload = {}) => {
  const missingFields = REQUIRED_FIELDS.filter((fieldName) => {
    const value = payload[fieldName];
    return typeof value !== "string" || value.trim() === "";
  });

  return missingFields;
};

const normalizeOptionalField = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue === "" ? null : normalizedValue;
};

const mapAtivoPayload = (payload) => ({
  nome: payload.nome.trim(),
  tipo: payload.tipo.trim(),
  ip: payload.ip.trim(),
  localizacao: payload.localizacao.trim(),
  sistema_operacional: normalizeOptionalField(payload.sistema_operacional),
  servico: normalizeOptionalField(payload.servico),
  status: payload.status.trim(),
  responsavel: normalizeOptionalField(payload.responsavel)
});

app.get("/health", (_request, response) => {
  response.json({
    status: "online",
    service: "coopcred-api"
  });
});

app.post(
  "/ativos",
  asyncHandler(async (request, response) => {
    const missingFields = validateAtivoPayload(request.body);

    if (missingFields.length > 0) {
      response.status(400).json({
        message: `Campos obrigatorios ausentes ou invalidos: ${missingFields.join(", ")}.`
      });
      return;
    }

    const ativo = mapAtivoPayload(request.body);
    const result = await run(
      `
        INSERT INTO ativos (
          nome,
          tipo,
          ip,
          localizacao,
          sistema_operacional,
          servico,
          status,
          responsavel
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ativo.nome,
        ativo.tipo,
        ativo.ip,
        ativo.localizacao,
        ativo.sistema_operacional,
        ativo.servico,
        ativo.status,
        ativo.responsavel
      ]
    );

    const createdAtivo = await get("SELECT * FROM ativos WHERE id = ?", [result.lastID]);

    response.status(201).json(createdAtivo);
  })
);

app.get(
  "/ativos",
  asyncHandler(async (_request, response) => {
    const ativos = await all("SELECT * FROM ativos ORDER BY id ASC");
    response.json(ativos);
  })
);

app.get(
  "/ativos/:id",
  asyncHandler(async (request, response) => {
    const ativo = await get("SELECT * FROM ativos WHERE id = ?", [request.params.id]);

    if (!ativo) {
      response.status(404).json({
        message: "Ativo de rede nao encontrado."
      });
      return;
    }

    response.json(ativo);
  })
);

app.put(
  "/ativos/:id",
  asyncHandler(async (request, response) => {
    const existingAtivo = await get("SELECT * FROM ativos WHERE id = ?", [request.params.id]);

    if (!existingAtivo) {
      response.status(404).json({
        message: "Ativo de rede nao encontrado."
      });
      return;
    }

    const missingFields = validateAtivoPayload(request.body);

    if (missingFields.length > 0) {
      response.status(400).json({
        message: `Campos obrigatorios ausentes ou invalidos: ${missingFields.join(", ")}.`
      });
      return;
    }

    const ativo = mapAtivoPayload(request.body);

    await run(
      `
        UPDATE ativos
        SET
          nome = ?,
          tipo = ?,
          ip = ?,
          localizacao = ?,
          sistema_operacional = ?,
          servico = ?,
          status = ?,
          responsavel = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        ativo.nome,
        ativo.tipo,
        ativo.ip,
        ativo.localizacao,
        ativo.sistema_operacional,
        ativo.servico,
        ativo.status,
        ativo.responsavel,
        request.params.id
      ]
    );

    const updatedAtivo = await get("SELECT * FROM ativos WHERE id = ?", [request.params.id]);

    response.json(updatedAtivo);
  })
);

app.delete(
  "/ativos/:id",
  asyncHandler(async (request, response) => {
    const existingAtivo = await get("SELECT * FROM ativos WHERE id = ?", [request.params.id]);

    if (!existingAtivo) {
      response.status(404).json({
        message: "Ativo de rede nao encontrado."
      });
      return;
    }

    await run("DELETE FROM ativos WHERE id = ?", [request.params.id]);

    response.json({
      message: "Ativo de rede removido com sucesso.",
      id: Number(request.params.id)
    });
  })
);

app.use((request, response) => {
  response.status(404).json({
    message: `Rota nao encontrada: ${request.method} ${request.originalUrl}.`
  });
});

app.use((error, request, response, _next) => {
  console.error("Erro interno na API", {
    method: request.method,
    path: request.originalUrl,
    error: error.message
  });

  response.status(500).json({
    message: "Erro interno do servidor."
  });
});

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`CoopCred API online em http://${HOST}:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Falha ao iniciar a aplicacao", error);
  process.exit(1);
});

module.exports = app;
