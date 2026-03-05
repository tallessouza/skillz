# Deep Explanation: Rodando Container Docker

## Modelo mental: Host → Container

Quando voce roda `docker run` sem `-p`, o container fica isolado em sua propria rede. Mesmo que a aplicacao esteja ouvindo na porta 3333 dentro do container, essa porta nao existe no host.

O `-p` cria um tunel:

```
Navegador → localhost:3333 (host) → :3333 (container) → App Node
```

O instrutor usa a analogia de "mapeamento": voce esta dizendo ao Docker "quando alguem bater nessa porta no meu computador, redirecione para dentro da imagem, nessa porta que estou expondo."

## EXPOSE vs -p

O `EXPOSE` no Dockerfile e **documentacional** — ele nao publica a porta automaticamente. E uma declaracao de intencao: "essa imagem usa essa porta." O `-p` no `docker run` e que efetivamente cria o binding.

Isso significa:
- `EXPOSE 3333` sem `-p 3333:3333` = porta inacessivel
- `-p 3333:3333` sem `EXPOSE` = funciona (mas sem documentacao)
- Ambos juntos = correto e bem documentado

## Por que preferir mesma porta?

O instrutor explica que voce **pode** mapear para porta diferente (`-p 5433:3333`), mas prefere usar a mesma porta em ambos os lados. Razoes praticas:

1. **Menos confusao** — a equipe nao precisa lembrar qual porta do host corresponde a qual porta do container
2. **Configuracao consistente** — `.env`, documentacao e scripts usam o mesmo numero
3. **Debug simplificado** — se funciona no container na 3333, funciona no host na 3333

## Rodando por nome vs ID

Ambos sao validos:

```bash
docker run -p 3333:3333 minha-api        # por nome (legivel)
docker run -p 3333:3333 a1b2c3d4e5f6     # por ID (unico)
```

O nome e preferido para scripts e CI/CD. O ID e util quando voce tem multiplas versoes da mesma imagem e precisa ser especifico.

## Logs no terminal

Ao rodar sem `-d`, o container ocupa o terminal e exibe os logs em tempo real. O instrutor demonstra isso: ao acessar `localhost:3333` no navegador, o log da requisicao aparece no terminal. Isso e util para debug, mas para producao voce usaria `-d` (detached mode).