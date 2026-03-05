# Deep Explanation: Senha e Autenticacao em Sistemas Legados

## Por que double-hash funciona

O instrutor explica que quando voce ja tem um banco com hashes SHA-256, voce nao precisa reescrever tudo. A estrategia e:

1. **Migracao em batch:** Aplique Argon2 sobre os hashes SHA-256 existentes. Isso torna o banco imediatamente mais seguro — mesmo que alguem roube o banco, nao consegue usar rainbow tables contra SHA-256 porque agora esta protegido por Argon2.

2. **No login:** Quando o usuario digita a senha, voce tenta primeiro Argon2 direto. Se nao bater, calcula SHA-256 da senha e tenta Argon2 sobre esse SHA-256. Se bater, significa que o usuario ainda esta no formato legado.

3. **Upgrade transparente:** Nesse momento do login, voce tem a senha em texto na memoria. Aproveite para recalcular o hash usando apenas Argon2 (sem o SHA-256 intermediario) e atualize o banco.

4. **Limpeza:** Apos logs confirmarem que todos os usuarios se logaram pelo menos uma vez, remova o codigo de double-hash.

## O problema visual do SHA-256 sem salt

O instrutor demonstra criando dois usuarios (Joaquim e Manuel) com a mesma senha "123mudar". Com SHA-256 puro, os hashes sao identicos no banco. Um atacante que obtenha acesso ao banco imediatamente sabe que esses dois usuarios tem a mesma senha. Apos migrar para Argon2 (que usa salt aleatorio), os hashes ficam diferentes mesmo para a mesma senha.

## O modelo de ameaca da reautenticacao

O instrutor usa um cenario muito concreto: o agressor nao e necessariamente um hacker remoto sofisticado. Pode ser um colega de trabalho que encontrou o computador desbloqueado com a aplicacao logada.

**Cadeia de ataque sem reautenticacao:**
1. Agressor encontra sessao aberta
2. Tenta trocar a senha → se o sistema so pede senha nova, consegue
3. Se trocar senha falha, tenta trocar o e-mail → depois usa "esqueci minha senha" para o novo e-mail
4. Se nao consegue nenhum dos dois, tenta fazer operacoes financeiras (transferencias, compras com envio para outro endereco)

**Por que bancos pedem senha em toda transferencia:** Exatamente por esse modelo de ameaca. Mesmo logado, a reautenticacao protege contra sessoes abandonadas.

## Reautenticacao como defesa contra CSRF

O instrutor menciona que a reautenticacao tambem protege contra Cross-Site Request Forgery (CSRF). Um ataque CSRF pode forjar requisicoes no contexto da sessao do usuario, mas nao consegue fornecer a senha para reautenticacao.

## MFA como evolucao natural

O instrutor posiciona MFA como o proximo passo logico: no mesmo momento em que voce pede reautenticacao (troca de senha, transacao), voce pode pedir um segundo fator (token, TOTP). Isso multiplica a dificuldade para o agressor.

## Ordem pratica de implementacao para sistemas legados

1. Migre os hashes (double-hash batch + upgrade no login)
2. Adicione reautenticacao em operacoes sensiveis
3. Implemente MFA
4. Apos todos migrarem, remova o codigo de double-hash