# Deep Explanation: Build de Preview

## Por que não fazer push direto na main?

A branch `main` é a branch de produção. Quando a Vercel detecta um push na main, ela automaticamente gera uma **build de produção** — ou seja, o que está no ar para todos os usuários muda imediatamente.

Isso é arriscado porque:
- A funcionalidade pode ter bugs que só aparecem em produção
- O time não teve chance de revisar visualmente
- Não há como "desfazer" facilmente — o rollback existe, mas é reativo

## Como a Vercel diferencia builds

A Vercel usa a **branch** do push para classificar a build:

| Branch | Tipo de build | Tag na Vercel | URL |
|--------|--------------|---------------|-----|
| `main` (ou branch configurada como produção) | Production | Current | domínio principal |
| Qualquer outra branch | Preview | Preview | URL única gerada |

Quando você faz push numa feature branch, a Vercel:
1. Detecta o push via webhook do GitHub
2. Identifica que NÃO é a branch de produção
3. Gera uma build de **preview**
4. Fornece uma URL única para testar
5. A build de produção permanece **intacta**

## A analogia do ambiente de staging

O instrutor destaca que essa estratégia é "muito interessante para testar antes, visualizar antes de levar para produção". Essencialmente, cada feature branch se torna um **ambiente de staging temporário** na Vercel, sem custo adicional de infraestrutura.

Diferente de um staging tradicional (que é um ambiente fixo compartilhado), aqui cada branch gera seu próprio ambiente isolado. Isso significa que múltiplas features podem ser testadas em paralelo, cada uma com sua URL de preview.

## Conventional commits na prática

O instrutor usa o padrão `feat:` (abreviação de "feature") na mensagem de commit:

```
feat: shake feedback when user makes a wrong guess
```

Esse padrão é importante porque:
- A mensagem aparece diretamente na Vercel como identificador da build
- Facilita identificar o que cada build contém
- Segue o padrão de conventional commits, compatível com changelogs automatizados

## Fluxo mental do deploy seguro

```
Implementou feature local
  │
  ├─ Está na feature branch? (git branch para confirmar)
  │   ├─ SIM → git add . → git commit -m "feat: ..." → git push origin feature/nome
  │   └─ NÃO → git checkout -b feature/nome ANTES de commitar
  │
  ├─ Verificar no GitHub que o commit está só na feature branch
  │
  ├─ Verificar na Vercel que a build é "Preview" (não "Production")
  │
  ├─ Testar na URL de preview
  │   ├─ Funciona → Merge para main (gera build de produção)
  │   └─ Tem bug → Corrigir na feature branch, novo push, novo preview
  │
  └─ Verificar URL de produção para confirmar que nada mudou
```

## Por que preservar a build em produção

O instrutor enfatiza: "a gente faz numa outra branch para preservar a build que está rodando em produção". Isso é crítico porque:

1. **Usuários reais** estão usando a versão em produção naquele momento
2. Uma build quebrada em produção = downtime real
3. O preview permite validação sem risco
4. A tag "Current" na Vercel sempre mostra qual build está servindo os usuários