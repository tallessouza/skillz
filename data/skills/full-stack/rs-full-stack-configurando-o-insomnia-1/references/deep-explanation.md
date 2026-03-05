# Deep Explanation: Configurando o Insomnia

## Por que usar variáveis de ambiente?

O instrutor enfatiza um princípio fundamental: **não ficar repetindo**. Quando você digita `localhost:3333` em cada request, cria dois problemas:

1. **Manutenção**: Se a porta muda, você precisa alterar em todos os lugares
2. **Inconsistência**: Fácil esquecer de atualizar uma request e debugar erros fantasma

A variável `base_url` resolve ambos — mude em um lugar, reflete em todos.

## Escopo de variáveis: Base Environment vs Folder Environment

O Insomnia tem dois níveis de escopo para variáveis:

### Base Environment (global)
- Acessível por **todas** as pastas e requests da collection
- Ideal para: `base_url`, tokens de autenticação, headers comuns
- Configurado via engrenagem no topo

### Folder Environment (local)
- Acessível **apenas** dentro daquela pasta
- Ideal para: `resource` (rota específica do recurso)
- Configurado clicando na própria pasta

O instrutor demonstra isso criando uma pasta `Test` e mostrando que a variável `resource` definida em `Products` **não aparece** no autocompletar da pasta `Test`. Isso prova que o escopo é isolado.

### Analogia prática

Pense no Base Environment como variáveis globais de um programa e no Folder Environment como variáveis locais de uma função. O mesmo princípio de encapsulamento se aplica.

## Múltiplos ambientes

O instrutor menciona que você pode criar vários ambientes (Dev, Produção). Cada um tem:
- **Nome descritivo** (Dev, Staging, Prod)
- **Cor identificadora** (verde, amarelo, vermelho) — visual imediato de qual ambiente está ativo
- **Valores diferentes** para as mesmas variáveis

Trocar de ambiente muda todas as URLs de uma vez. Útil quando sua API está em `localhost:3333` em dev mas em `https://api.meusite.com` em produção.

## Organização por recurso

A convenção é uma pasta por recurso da API:
- `Products/` → tudo relacionado a produtos
- `Users/` → tudo relacionado a usuários
- `Orders/` → tudo relacionado a pedidos

Cada pasta contém as operações CRUD daquele recurso. A variável `resource` na pasta garante que o path base está sempre correto.

## Por que não usar o navegador?

O instrutor abre a aula dizendo "para não ficar usando o navegador". O navegador limita testes de API porque:
- Só faz GET nativamente (sem POST, PUT, DELETE)
- Não permite headers customizados facilmente
- Não salva histórico organizado de requests
- Não tem variáveis de ambiente