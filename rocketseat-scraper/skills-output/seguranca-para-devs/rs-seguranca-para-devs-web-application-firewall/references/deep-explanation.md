# Deep Explanation: Web Application Firewall

## Por que o programador precisa entender WAF

O instrutor enfatiza repetidamente que, mesmo que exista um time de seguranca dedicado, o programador sera envolvido inevitavelmente por dois motivos:

1. **So o programador sabe quais requisicoes sao legitimas** — O time de seguranca nao conhece a aplicacao em detalhe. Quando o WAF bloqueia algo, eles so conseguem ou remover a regra globalmente ou desligar o firewall na rota. Ambas sao "respostas preguicosas" que criam vulnerabilidades.

2. **O problema chega no programador primeiro** — Quando a aplicacao para de funcionar, o suporte aciona o programador, nao o time de seguranca. O programador precisa entender o que esta acontecendo para dar uma resposta tecnica precisa.

## Seguranca em camadas

A analogia do instrutor: "Voce tranca a porta e tambem tranca o portao." Mesmo que sua aplicacao seja segura (valide inputs, previna SQL injection, etc.), voce quer impedir que ataques sequer cheguem nela. O WAF e uma camada adicional que filtra requisicoes maliciosas antes da aplicacao processa-las.

Exemplo concreto: uma pagina HTML estatica nao tem vulnerabilidades, mas ainda assim nao deveria aceitar requisicoes com `?cmd=cat /etc/passwd` na query string. A infraestrutura deve rejeitar isso antes de chegar na aplicacao.

## ModSecurity como referencia

O instrutor escolheu o ModSecurity por ser open source e referencia na area. Ele destaca que os conceitos sao identicos em qualquer plataforma:
- AWS WAF
- Azure Firewall
- Cloudflare WAF
- Qualquer WAF comercial

Os produtos comerciais sao "inspirados ou baseados em produtos open source". O tipo de problema resolvido (falsos positivos, excecoes por rota, analise de logs) e universal.

## O conceito de Anomaly Score

O ModSecurity usa um sistema de pontuacao (anomaly score). Cada regra violada adiciona pontos. Quando o score ultrapassa um threshold (padrao: 5), a requisicao e bloqueada.

No log, as linhas que dizem "Inbound Anomaly Score exceeded" sao apenas o resultado final — o "desconfiometro passou de 5, entao bloqueamos". As linhas importantes sao as de `warning` com `Matched Phrase`, que indicam QUAIS regras especificas foram violadas e seus IDs.

## DetectionOnly vs On

- **DetectionOnly**: Loga tudo mas nao bloqueia. Essencial para aplicacoes ja em producao, onde voce precisa observar o comportamento por um periodo antes de ativar o bloqueio.
- **On**: Bloqueia ativamente. Recomendado para aplicacoes novas onde voce pode ajustar regras durante o desenvolvimento/testes.

## Fluxo real de resolucao de falso positivo

1. Usuario reporta que funcionalidade nao funciona (HTTP 403 Forbidden)
2. Programador verifica o log de auditoria (`modsec_audit.log`)
3. Identifica as regras que dispararam (linhas com `Matched Phrase`)
4. Anota os IDs das regras (ex: 932160 para RCE, 930120 para LFI)
5. Cria excecao cirurgica: `SecRuleRemoveById` dentro de `<Location /rota-especifica>`
6. Habilita a configuracao e restarta o Apache
7. Testa: a rota especifica agora funciona, todas as outras rotas continuam protegidas