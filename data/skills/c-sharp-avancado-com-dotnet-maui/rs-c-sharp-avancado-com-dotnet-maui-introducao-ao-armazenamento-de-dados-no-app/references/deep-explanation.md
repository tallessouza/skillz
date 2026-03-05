# Deep Explanation: Armazenamento de Dados no .NET MAUI

## Por que duas APIs?

O .NET MAUI oferece duas abstracoes prontas — voce nao precisa reinventar a roda. Por baixo dos panos, ambas usam as APIs nativas de cada plataforma (Android, iOS, Windows) para fazer o armazenamento de forma correta e segura no dispositivo.

## Como classificar: simples vs sensivel

A pergunta fundamental e: **"Se esse dado vazar, alguem consegue se passar pelo usuario?"**

- **Se sim** → SecureStorage (criptografado, em cofre seguro)
- **Se nao** → Preferences (armazenamento simples)

### Por que ID e dado simples?

O instrutor explica com um argumento tecnico preciso: IDs trafegam na rota da URL, e rotas nao sao criptografadas (mesmo com HTTPS, que criptografa apenas o body). O ID tambem esta no payload do JWT, que nao e criptografado (apenas assinado). Portanto, tratar ID como dado sensivel seria security theater — ele ja e exposto por design.

### Por que tokens sao dados sensiveis?

Se alguem obtem o Access Token, pode fazer requisicoes se passando pelo usuario. Se obtem o Refresh Token, pode gerar novos Access Tokens indefinidamente. Isso torna tokens os dados mais criticos para proteger no armazenamento local.

## Tabela comparativa completa

| Caracteristica | Preferences | SecureStorage |
|---------------|-------------|---------------|
| Seguranca | Baixa | Alta (criptografado) |
| Tipos de dados | string, int, bool, DateTime, double, float, long | Apenas string |
| Persistencia | Sim (sobrevive ao fechamento) | Sim (sobrevive ao fechamento) |
| Uso ideal | Configuracoes, preferencias | Tokens, senhas, dados sensiveis |
| Acesso | Sincrono | Assincrono (await) |

## Cenario pratico do curso

O app recebe uma resposta da API (tanto no login quanto no registro) com a classe `ResponseHasterUserJson`:

- `Id` (GUID) → Preferences — usado para identificar o usuario ao criar tarefas e atribuir responsaveis
- `Name` (string) → Preferences — exibido no dashboard ("Bem-vindo, [nome]")
- `Tokens.AccessToken` → SecureStorage — usado para autenticar todas as requisicoes subsequentes
- `Tokens.RefreshToken` → SecureStorage — usado para renovar o AccessToken quando expira

## Por que persistir?

Ambas as APIs persistem dados entre sessoes. Isso significa que quando o usuario fecha e reabre o app, os dados continuam la. Sem persistencia, o usuario teria que fazer login toda vez que abrisse o app.

## Organizacao do projeto

O instrutor organiza dentro de `Data/Storage/`, separando por tipo de armazenamento e por dominio:

```
Data/
├── Network/           # Ja existia (comunicacao com API)
└── Storage/
    ├── Preference/
    │   └── User/      # ID e nome
    └── SecureStorage/
        └── Tokens/    # AccessToken e RefreshToken
```

Essa separacao torna explicito, pela estrutura de pastas, qual tipo de armazenamento cada dado usa.