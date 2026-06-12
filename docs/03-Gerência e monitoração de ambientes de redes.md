# Gerência de Redes de Computadores 

##  Monitoramento com Zabbix em Ambiente Virtualizado AWS 

### Arquitetura da solução 

Composta por duas instâncias EC2 na AWS: 
- Um servidor Ubuntu responsável pela hospedagem do Zabbix Server e front end web; 
- Um servidor Windows Server com Active Directory e Zabbix Agent 2 instalado. 

O monitoramento ocorre através da comunicação entre o Zabbix Server e o agente instalado no Windows Server utilizando a porta TCP 10050. 

#### EC2 Zabbix 
Foi criada uma instância EC2 Ubuntu na AWS para hospedar o Zabbix Server, banco PostgreSQL e front end web acessado via navegador.  

![alt text](<images/Captura de tela 2026-06-12 142129.png>)

#### Acessando o frontend do zabbix 
Após a instalação e configuração do Nginx, PHP e PostgreSQL, o frontend do Zabbix foi disponibilizado via navegador utilizando o IP público da instância EC2. 

![alt text](<images/Captura de tela 2026-06-12 142216.png>)

#### Instalação do Zabbix Agent 2 no Windows 
Feito acesso via remote desktop, o Zabbix Agent 2 foi instalado no servidor Windows responsável pelo Active Directory, permitindo o envio de métricas e informações do sistema operacional para o Zabbix Server. 

![alt text](<images/Captura de tela 2026-06-12 142223.png>)

![alt text](<images/Captura de tela 2026-06-12 142231.png>)

#### Configuração do Host no Zabbix 
Inicialmente foi utilizada a comunicação via IP privado entre as instâncias EC2. Entretanto, como os servidores estavam configurados em VPCs distintas na AWS, não havia conectividade privada direta entre eles. Dessa forma, foi necessário utilizar o IP público da instância Windows para permitir a comunicação entre o Zabbix Server e o Zabbix Agent através da porta TCP 10050.  

![alt text](<images/Captura de tela 2026-06-12 142238.png>)

#### Validação da comunicação entre Zabbix Server e Agent 
Abaixo temos a validação que o Zabbix Server conseguiu estabelecer comunicação com o agente instalado no Windows Server. 

![alt text](<images/Captura de tela 2026-06-12 142246.png>)

#### Visualização das métricas coletadas 
O painel “Latest Data” apresenta as métricas coletadas em tempo real pelo Zabbix Agent, incluindo uso de CPU, memória, armazenamento e tempo de atividade do servidor. 

![alt text](<images/Captura de tela 2026-06-12 142253.png>)

#### Monitoramento gráfico do servidor Windows 
O Zabbix gera automaticamente gráficos históricos a partir das métricas coletadas, permitindo acompanhar o comportamento do servidor ao longo do tempo. 

![alt text](<images/Captura de tela 2026-06-12 142343.png>)

![alt text](<images/Captura de tela 2026-06-12 142355.png>)

![alt text](<images/Captura de tela 2026-06-12 142404.png>)
 
#### Configuração de conectividade e firewall 
Foram configuradas regras de firewall no Windows Server e Security Groups na AWS permitindo comunicação entre o Zabbix Server e o Zabbix Agent através da porta TCP 10050. 

![alt text](<images/Captura de tela 2026-06-12 142416.png>)
<small>Security group do EC2 Zabbix</small> 

![alt text](<images/Captura de tela 2026-06-12 142424.png>)
<small>Security group do EC2 Windows (Active directory)</small> 

## Monitoramento com Zabbix Local 
 
### Arquitetura da solução 
Para o monitoramento da disponibilidade, funcionalidade e utilização de recursos dos servidores, será utilizado a ferramenta Zabbix. Nos servidores foi instalado e configurado os recursos do protocolo e serviço SNMP, para possibilitar a entrada de pacotes do agente de monitoramento Zabbix. 

A seguir, encontram-se os registros do processo de preparação dos servidores on-premise e cloud para integração com o ambiente de monitoramento. 

### Configuração do SNMP no servidor Linux 

![alt text](<images/Captura de tela 2026-06-12 143052.png>)
<small>Definição da porta udp 161 para pacotes snmp e criação de nova comunidade de acesso no arquivo de configuração snmpd, no servidor web MTZ-SRV-APP-01 (Linux local).</small>  

![alt text](<images/Captura de tela 2026-06-12 143104.png>)
<small>Perfil de regra do firewall para o serviço SNMP, porta permitida: 161/udp. Servidor web MTZ-SRV-APP-01 (Linux local).</small> 

### Configuração do SNMP no servidor Windows 
 
![alt text](<images/Captura de tela 2026-05-20 000452.png>) ![alt text](<images/Captura de tela 2026-05-20 000555.png>)
<small>Definição de nova comunidade de acesso, permissão de pacotes SNMP e informação de contato após instalação do serviço SNMP. Servidor MTZ-SRV-AD-DNS-01 (Windows AWS).</small>  

![alt text](<images/Captura de tela 2026-05-20 001225.png>)
<small>Criação de regra no grupo de segurança no ambiente AWS da cooperativa para permitir pacotes SNMP na porta 161 - 162. Servidor MTZ-SRV-AD-DNS-01 (Windows AWS).</small> 

#### Configuração do Zabbix  
Após a configuração do servidor Zabbix, foram adicionados os hosts responsáveis pelos serviços web e AD/DNS para monitoramento contínuo. 

![alt text](<images/Captura de tela 2026-05-20 010525.png>)
<small>Página de host da aplicação Zabbix, com os servidores Web e AD/DNS disponíveis.</small> 

#### Monitoramento dos Servidores 
Foi registrado, durante um período de tempo, o monitoramento dos servidores e serviços. Através dos gráficos disponíveis para cada host, é possível visualizar a utilização de recursos, como CPU, memória, tráfego, entre outros. 
 
##### Monitoramento do servidor AD/DNS 

![alt text](<images/Captura de tela 2026-05-20 005411.png>)
<small>Chart de utilização de espaço.</small>  

![alt text](<images/Captura de tela 2026-05-20 005504.png>)
<small>Gráfico de utilização de memória física.</small> 

![alt text](<images/Captura de tela 2026-05-20 005428.png>)
<small>Gráfico do tráfego da rede.</small> 

![alt text](<images/Captura de tela 2026-05-20 005348.png>)
<small>Gráfico de utilização da CPU.</small> 

##### Monitoramento do servidor Web 

![alt text](<images/Captura de tela 2026-05-20 151005.png>)
<small>Gráfico de utilização da memória.</small> 

![alt text](<images/Captura de tela 2026-05-20 150745.png>)
<small>Gráfico de utilização da CPU.</small>

![alt text](<images/Captura de tela 2026-05-20 150814.png>)
<small>Gráfico do tráfego da rede.</small>

#### Mapa de Monitoramento da Rede 
Na ferramenta Zabbix também foi desenvolvido um mapa de monitoramento da infraestrutura, permitindo visualizar o estado atual dos servidores e suas conexões lógicas dentro do ambiente da cooperativa. 

![alt text](<images/Captura de tela 2026-05-20 010536.png>)
<small>Mapa da rede da cooperativa, com os servidores Web,  AD/DNS, ambiente AWS e servidor Zabbix.</small> 

###  Monitoramento CPU

![alt text](<images/Captura de tela 2026-06-12 144306.png>)
<small>Gráficos: CPU system time, CPU user time e CPU utilization</small>
 
###  Monitoramento memória 

![alt text](<images/Captura de tela 2026-06-12 144322.png>)
<small>Gráficos: Memory usage e Memory utilization</small>

###  Criação de triggers 
Foram criadas duas triggers, para identificar o consumo de CPU e disponibilidade de 
memória.

![alt text](<images/Captura de tela 2026-06-12 144333.png>)
<small>Triggers: AltoUsoCpu e Disponibilidade</small>

![alt text](<images/Captura de tela 2026-06-12 144341.png>)
<small>Configuração para elevar a CPU e realizar teste de trigger</small>

![alt text](<images/Captura de tela 2026-06-12 144401.png>)
<small>Acionamento de gatilho </small>


###  Criação de dashboard 
Foi criado um dashboard com os gráficos de Conectividade, utilização de CPU, utilização de memória e latência e disponibilidade. 

![alt text](<images/Captura de tela 2026-06-12 144415.png>)
<small>Dashboard </small>
