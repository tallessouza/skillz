# Deep Explanation: Deploy de Atualização do Projeto

## Por que commits semânticos importam

O instrutor destaca que commits semânticos são um "padrãozinho para organizar os seus commits" — mas o valor vai além de organização. Quando você olha o histórico do Git no GitHub, cada commit carrega intenção:

- **fix** — indica que algo estava quebrado e foi corrigido. Ferramentas de changelog automático (como semantic-release) usam isso para gerar patch versions.
- **feat** — indica funcionalidade nova. Gera minor version bumps.
- **chore** — mudanças internas que não afetam o comportamento da aplicação (configurações, dependências).
- **doc** — apenas documentação. Não deveria afetar o runtime.

O instrutor chama isso de "commit semântico" porque o prefixo dá significado ao commit antes mesmo de ler a mensagem completa. Num histórico com centenas de commits, isso permite filtrar rapidamente o que interessa.

## O fluxo de auto-deploy

A grande vantagem demonstrada na aula é o deploy automático via integração GitHub → serviço de hosting (no caso, Render):

1. Você faz `git push` para a branch principal
2. O Render (ou Vercel, Railway, etc.) tem um webhook configurado no repositório GitHub
3. O webhook notifica o serviço que houve mudança na branch monitorada
4. O serviço puxa o código atualizado, roda o build, e substitui a versão em produção

O instrutor enfatiza: "Essa é a vantagem de você fazer o deploy com um serviço que pega o teu GitHub ali, o projeto no GitHub como referência." Não precisa SSH no servidor, não precisa rodar build manualmente, não precisa copiar arquivos. O fluxo é: código → commit → push → deploy automático.

## A validação antes do deploy

O exemplo prático do instrutor é revelador: ele percebeu que ao buscar um delivery que não existe, a API retornava `null` em vez de uma mensagem de erro adequada. Isso é um bug sutil — a API não quebra, mas retorna dados sem significado para o cliente.

A correção é simples mas importante:

```typescript
if (!delivery) {
  return response.status(404).json({ message: "Delivery not found" })
}
```

Pontos chave:
- **Status code correto (404)** — não é 200 com body vazio, não é 500. É "not found", que é exatamente o que aconteceu.
- **Mensagem clara** — o cliente sabe exatamente o que deu errado.
- **Validação antes de processar** — o check de existência vem antes de qualquer lógica com o recurso.

## Verificação pós-deploy

O instrutor demonstra o ciclo completo: faz a mudança → commita → push → acompanha no dashboard do Render → testa no Insomnia. Essa última etapa (testar em produção) é crucial. Não basta o build passar — é preciso verificar que o comportamento esperado está de fato disponível na URL de produção.

No caso, ele enviou a mesma request que antes retornava `null` e confirmou que agora retorna `{"message": "Delivery not found"}`.

## Branch principal como trigger

O serviço monitora a branch principal (main/master). Se você fizer push para outra branch, o deploy não é disparado automaticamente (a menos que configure preview deploys). Isso significa que:

- Branches de feature não afetam produção
- Só merge/push para main dispara deploy
- Isso funciona como uma camada básica de proteção