const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databaseDirectory = path.join(__dirname, "data");
const databasePath = path.join(databaseDirectory, "coopcred.sqlite");

const initialAtivos = [
  {
    nome: "MTZ-SRV-AD-01",
    tipo: "Servidor",
    ip: "192.168.0.10",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Windows Server 2022",
    servico: "Active Directory",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-SRV-DNS-01",
    tipo: "Servidor",
    ip: "192.168.0.11",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Windows Server 2022",
    servico: "DNS Interno",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-SRV-DHCP-01",
    tipo: "Servidor",
    ip: "192.168.0.12",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Windows Server 2022",
    servico: "DHCP",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-SRV-FILE-01",
    tipo: "Servidor",
    ip: "192.168.0.13",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Windows Server 2022",
    servico: "Servidor de Arquivos",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-SRV-BKP-01",
    tipo: "Servidor",
    ip: "192.168.0.14",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Linux",
    servico: "Servidor de Backup",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-SRV-APP-01",
    tipo: "Servidor",
    ip: "192.168.0.15",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Ubuntu Server 22.04",
    servico: "Servidor de Aplicacoes",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "FIL01-SW-01",
    tipo: "Switch",
    ip: "192.168.1.2",
    localizacao: "Filial - Araguari",
    sistema_operacional: "N/A",
    servico: "Switch de Acesso",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "FIL02-SW-01",
    tipo: "Switch",
    ip: "192.168.2.2",
    localizacao: "Filial - Monte Carmelo",
    sistema_operacional: "N/A",
    servico: "Switch de Acesso",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "MTZ-RT-WAN-01",
    tipo: "Roteador",
    ip: "192.168.0.1",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "Gateway WAN Dual-Homed",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "MTZ-FW-01",
    tipo: "Firewall",
    ip: "192.168.0.254",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "Firewall Perimetral",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-AP-01",
    tipo: "Access Point",
    ip: "192.168.0.30",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "Wi-Fi Corporativo",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "FIL01-AP-01",
    tipo: "Access Point",
    ip: "192.168.1.30",
    localizacao: "Filial - Araguari",
    sistema_operacional: "N/A",
    servico: "Wi-Fi Corporativo",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "FIL02-AP-01",
    tipo: "Access Point",
    ip: "192.168.2.30",
    localizacao: "Filial - Monte Carmelo",
    sistema_operacional: "N/A",
    servico: "Wi-Fi Corporativo",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "MTZ-IMP-01",
    tipo: "Impressora",
    ip: "192.168.0.40",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "Impressora de Rede",
    status: "Ativo",
    responsavel: "Administracao e Financas"
  },
  {
    nome: "MTZ-CAM-01",
    tipo: "Câmera IP",
    ip: "192.168.0.50",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "CFTV",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-ATM-01",
    tipo: "ATM",
    ip: "192.168.0.60",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "Caixa Eletronico",
    status: "Ativo",
    responsavel: "Operacoes Bancarias"
  },
  {
    nome: "MTZ-TEL-IP-01",
    tipo: "Telefone IP",
    ip: "192.168.0.70",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "VoIP",
    status: "Ativo",
    responsavel: "Infraestrutura"
  },
  {
    nome: "MTZ-SRV-ZBX-01",
    tipo: "Zabbix",
    ip: "192.168.0.16",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "Ubuntu Server 22.04",
    servico: "Monitoramento Zabbix",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  },
  {
    nome: "MTZ-VPN-01",
    tipo: "VPN",
    ip: "192.168.0.253",
    localizacao: "Matriz - Uberlandia",
    sistema_operacional: "N/A",
    servico: "VPN Site-to-Site Matriz-Filiais",
    status: "Ativo",
    responsavel: "TI e Seguranca de Dados"
  }
];

fs.mkdirSync(databaseDirectory, { recursive: true });

const db = new sqlite3.Database(databasePath);

const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes
      });
    });
  });

const get = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });

const all = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });

const createSchema = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS ativos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      ip TEXT NOT NULL,
      localizacao TEXT NOT NULL,
      sistema_operacional TEXT,
      servico TEXT,
      status TEXT NOT NULL,
      responsavel TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const seedDatabase = async () => {
  const result = await get("SELECT COUNT(*) AS total FROM ativos");

  if (result.total > 0) {
    return;
  }

  const insertQuery = `
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
  `;

  for (const ativo of initialAtivos) {
    await run(insertQuery, [
      ativo.nome,
      ativo.tipo,
      ativo.ip,
      ativo.localizacao,
      ativo.sistema_operacional,
      ativo.servico,
      ativo.status,
      ativo.responsavel
    ]);
  }
};

const initializeDatabase = async () => {
  await createSchema();
  await seedDatabase();
};

module.exports = {
  all,
  databasePath,
  get,
  initializeDatabase,
  run
};
