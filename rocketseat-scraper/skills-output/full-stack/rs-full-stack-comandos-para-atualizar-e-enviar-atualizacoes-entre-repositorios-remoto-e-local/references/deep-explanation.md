# Deep Explanation: Git Pull e Push

## Modelo mental: Repositório Remoto vs Local

O Git trabalha com dois repositórios separados: o **local** (na sua máquina) e o **remoto** (GitHub, GitLab, etc.). Eles não se sincronizam automaticamente — você precisa de comandos explícitos.

Pense assim:
- **`git pull`** = "me traga o que mudou lá fora" (remoto → local)
- **`git push`** = "envie o que eu fiz aqui" (local → remoto)

## Por que pull antes de push?

Quando você trabalha em equipe, outras pessoas enviam modificações para o repositório remoto. Se você tenta fazer `push` sem antes trazer essas modificações, o Git rejeita porque seu histórico local divergiu do remoto.

O fluxo seguro é:
1. `git pull` — traz tudo que mudou no remoto
2. Resolve conflitos (se houver)
3. `git push` — envia suas alterações

## Gestão de conflitos

O instrutor destaca que o Git tem maneiras de gerenciar conflitos mesmo quando duas pessoas editam a mesma linha de código. Isso acontece durante o `pull`:

- O Git tenta fazer merge automático
- Se a mesma linha foi modificada por duas pessoas, ele marca o conflito no arquivo
- Você resolve manualmente escolhendo qual versão manter
- Depois faz commit da resolução

Conflitos não são erros — são parte normal do trabalho em equipe. O importante é resolver localmente antes de enviar.

## Segurança do fluxo

O instrutor enfatiza: "é seguro que você primeiro puxe as modificações que tem no repositório remoto." A palavra chave é **seguro**. Puxar primeiro garante que:

- Você vê o que mudou antes de enviar
- Conflitos são resolvidos no seu ambiente, sem afetar outros
- O histórico do remoto permanece linear e limpo