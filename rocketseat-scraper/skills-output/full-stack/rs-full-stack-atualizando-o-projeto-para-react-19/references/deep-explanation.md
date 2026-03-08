# Deep Explanation: Atualizando Versão do React

## Por que atualizar entre versões major?

Versões major do React (18 → 19) trazem melhorias significativas de performance, novas APIs e correções arquiteturais. A atualização é inevitável em projetos de longo prazo — quanto mais tempo adiada, maior o acúmulo de breaking changes entre a versão atual e a alvo.

## Versionamento Semântico (SemVer)

O instrutor reforça o modelo **Major.Minor.Patch**:

- **Major** (primeiro número): Grandes atualizações com possíveis breaking changes. Ex: React 18 → 19
- **Minor** (segundo número): Novas funcionalidades retrocompatíveis
- **Patch** (terceiro número): Correções de bugs

Ao olhar `"react": "^18.2.0"` no `package.json`, o `^` permite atualizações de minor e patch, mas **não** de major. Por isso a atualização major requer instalação explícita com `react@19`.

## A importância da documentação oficial

O instrutor enfatiza: "Sempre a gente vai olhar como referência para a documentação do próprio React." Cada versão major tem um guia de upgrade específico que lista:

1. Breaking changes exatos
2. Codemods automatizados para migrar código
3. APIs depreciadas que foram removidas
4. Novas APIs que substituem as antigas

Esse guia é a fonte de verdade — não confie apenas em posts de blog ou vídeos que podem estar desatualizados.

## Por que atualizar tipagens junto?

Em projetos TypeScript, as tipagens (`@types/react`) definem a shape das APIs disponíveis. Se você atualiza `react` para 19 mas mantém `@types/react` em 18:

- APIs novas do React 19 não terão autocomplete
- APIs removidas no React 19 ainda aparecerão como válidas nas tipagens
- O TypeScript não flagará erros de breaking changes

As tipagens **devem** acompanhar a versão major do runtime.

## O ciclo de update na prática

O instrutor mostra um fluxo limpo e direto:

1. Parar o servidor de desenvolvimento (Ctrl+C)
2. Instalar as dependências de runtime (`react`, `react-dom`)
3. Instalar as dependências de desenvolvimento (`@types/react`, `@types/node`)
4. Sincronizar com `npm install`
5. Reiniciar o servidor com `npm run dev`
6. Verificar no navegador — console limpo = sucesso

Esse fluxo se aplica a qualquer upgrade major de qualquer biblioteca, não apenas React.

## Quando NÃO atualizar

- Se o projeto está em fase crítica de entrega e a atualização não é necessária
- Se bibliotecas essenciais do projeto ainda não suportam a nova versão major
- Se não há tempo para testar adequadamente após a atualização

O instrutor mesmo diz: "Provavelmente você não vai precisar fazer nada disso" — reconhecendo que a atualização é uma decisão estratégica, não uma obrigação imediata.

## Estratégia para projetos grandes

Em projetos grandes, a atualização major pode ser mais complexa:

1. Crie um branch separado para a atualização
2. Rode a suíte de testes completa após o upgrade
3. Verifique cada componente que usa APIs que mudaram
4. Aplique codemods disponíveis antes de corrigir manualmente
5. Faça code review focado em breaking changes documentados