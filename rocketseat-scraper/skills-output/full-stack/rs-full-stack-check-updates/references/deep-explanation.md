# Deep Explanation: Check Updates

## Por que usar npm-check-updates em vez de npm update?

O `npm update` atualiza pacotes silenciosamente dentro dos ranges definidos no `package.json` (respeitando `^` e `~`). O problema é que você não tem visibilidade sobre o que mudou. O `npm-check-updates` resolve isso mostrando uma tabela clara com versão atual vs. versão recomendada, com cores indicando o tipo de mudança.

## O papel do npx

O instrutor destaca o uso de `npx` como **package runner** do npm. A vantagem é que o `npm-check-updates` é instalado temporariamente — ele não polui o projeto nem fica nas dependências. É uma ferramenta de auditoria, não de runtime.

Fluxo do npx:
1. Verifica se o pacote existe localmente
2. Se não existe, pergunta se quer instalar temporariamente
3. Usuário confirma com `y`
4. Executa o comando
5. Pacote não fica instalado permanentemente

## Versionamento Semântico (SemVer) — A chave para interpretar o output

O instrutor faz uma pausa pedagógica para o aluno pensar: "O que está vindo nessa atualização?" A resposta está no versionamento semântico:

### Formato: MAJOR.MINOR.PATCH

- **PATCH** (ex: 9.0.0 → 9.0.2): Duas atualizações de patch significam que houve correções de bugs ou melhorias internas. O instrutor explica: "não necessariamente só dois bugs, mas duas atualizações que podem ter corrigido ou melhorado alguma coisa."

- **MINOR** (ex: 4.18.2 → 4.19.2): Inclui novas funcionalidades mantendo retrocompatibilidade. O instrutor menciona: "além de um bug, aqui também tem melhoria de funcionalidades."

- **MAJOR**: Breaking changes — pode exigir alterações no seu código.

### Sistema de cores

A ferramenta usa cores diferentes para facilitar a identificação visual do tipo de mudança. O instrutor destaca: "O legal é que ele também deixa cores diferentes, para também ficar fácil de você identificar o que está vindo na atualização."

Isso transforma a atualização de dependências de uma operação cega para uma decisão informada.

## Quando usar esta ferramenta

- **Rotina semanal/quinzenal**: verificar atualizações disponíveis
- **Antes de releases**: garantir que patches de segurança estão aplicados
- **Ao retomar projeto antigo**: visualizar o gap de versões acumulado
- **Auditoria de segurança**: patches frequentemente corrigem vulnerabilidades

## Estratégia de atualização segura

1. Rodar `npx npm-check-updates` para visualizar
2. Atualizar patches primeiro (menor risco)
3. Atualizar minors em seguida (risco baixo)
4. Atualizar majors um por vez (risco potencial)
5. Rodar testes após cada lote
6. Commitar após cada lote bem-sucedido