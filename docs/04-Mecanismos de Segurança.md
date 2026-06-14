# Mecanismos de Segurança da Informação

Foram identificadas vulnerabilidades presentes no ambiente AWS da CoopCred Minas com base no OWASP Top 10 2025. A seguir, são descritas cada uma delas e suas respectivas estratégias de mitigação. 

## A02:2025 Configuração Incorreta de Segurança 
Foi identificado que os Security Groups das três instâncias EC2 foram configurados com regras permissivas, liberando portas sensíveis para qualquer endereço IP de origem (0.0.0.0/0). Entre as exposições identificadas estão a porta 3389 do servidor de Active Directory, a porta 22 dos servidores Linux e as portas 10050 e 10051 utilizadas pelo Zabbix. Isso representa uma vulnerabilidade classificada como Configuração Incorreta de Segurança (A02:2025) pelo OWASP Top 10, pois expõe serviços administrativos críticos diretamente à internet, ampliando a superfície de ataque da cooperativa. Como estratégia de mitigação, recomenda-se restringir as regras dos Security Groups a endereços IP específicos e confiáveis, isolar os serviços de monitoramento em rede privada e adotar o acesso aos servidores exclusivamente por meio de VPN. 

## A01:2025 Quebra de Controle de Acesso 
No ambiente da CoopCred Minas, ao configurar o ambiente de monitoramento com Zabbix, as instâncias EC2 destinadas ao servidor de monitoramento e ao Active Directory foram provisionadas em VPCs distintas na AWS. Como consequência a comunicação precisou ser realizada via endereço IP público, caracterizando uma vulnerabilidade de Quebra de Controle de Acesso (A01:2025), pois recursos que deveriam se comunicar exclusivamente em rede privada tornaram-se acessíveis externamente, contrariando o princípio do menor privilégio. Como estratégia de mitigação, recomenda-se a consolidação das instâncias em uma mesma VPC, utilizando IPs privados para comunicação interna, ou a implementação de VPC Peering entre ambientes distintos. 

## A07:2025 Falhas de Autenticação 
No ambiente da CoopCred Minas, o acesso remoto ao servidor de Active Directory, realizado via protocolo RDP na porta 3389, é protegido apenas por autenticação simples com usuário e senha. Embora o servidor bloqueie tentativas com credenciais incorretas, a ausência de MFA e a exposição da porta RDP para qualquer origem na internet tornam o ambiente suscetível a ataques de força bruta e de preenchimento de credenciais, vulnerabilidade classificada como Falhas de Autenticação (A07:2025) pelo OWASP Top 10. Como estratégia de mitigação, recomenda-se habilitar MFA para acesso remoto, implementar política de bloqueio de conta após tentativas mal sucedidas e restringir o acesso RDP a IPs autorizados 
ou mediante conexão VPN prévia.

# Cartilha de Boas Práticas 

Foi desenvolvido uma cartilha de boas práticas para os colaboradores, com base em suas principais obrigações em relação a preservação da segurança da informação da cooperativa. 

![alt text](<images/4 e 1.png>)

![alt text](<images/2 e 3.png>)