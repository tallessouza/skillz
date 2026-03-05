# Code Examples: Internet e Web

## Diagrama ASCII — Rede Interna (Intranet)

```
┌──────────────┐         ┌──────────────┐
│  Smartphone  │◄───────►│  Computador  │
│  (sua casa)  │  Wi-Fi  │  (sua casa)  │
└──────────────┘         └──────────────┘
         Rede Interna (Intranet)
```

## Diagrama ASCII — Rede Externa (Internet)

```
┌──────────────┐                              ┌──────────────┐
│  Computador  │         BACKBONE             │  Computador  │
│   (Brasil)   │◄────── Cabos submarinos ────►│    (EUA)     │
└──────────────┘    e subterraneos            └──────────────┘
                    Rede Externa (Internet)
```

## Diagrama ASCII — Teia de Aranha (Web)

```
        ●───────●───────●
       /│\     /│\     /│\
      / │ \   / │ \   / │ \
     ●──●──●──●──●──●──●──●
      \ │ /   \ │ /   \ │ /
       \│/     \│/     \│/
        ●───────●───────●

   Cada ● = um computador (servidor/cliente)
   Cada ─ = uma conexao de rede
   Todos interligados = Web (teia)
```

## Diagrama ASCII — DNS e o caminho de uma requisicao

```
Voce digita: rocketseat.com.br
         │
         ▼
    ┌─────────┐
    │  DNS     │  Converte "rocketseat.com.br" → 104.26.10.78
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │ Roteador│  Seu roteador em casa
    │  Local  │
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │Provedor │  Vivo, Oi, Claro, etc.
    │Internet │
    └────┬────┘
         │
         ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │Central 1│────►│Central 2│────►│Central 3│  (backbone)
    └─────────┘     └─────────┘     └────┬────┘
                                         │
                                         ▼
                                    ┌──────────┐
                                    │ Servidor │  Computador com os
                                    │Rocketseat│  arquivos do site
                                    └────┬─────┘
                                         │
                                         ▼
                                  Devolve arquivos:
                                  ├── index.html
                                  ├── style.css
                                  └── script.js
```

## Analogia do CEP — Comparacao visual

```
MUNDO FISICO                    MUNDO DIGITAL
─────────────                   ──────────────
Nome da rua    ←──────────►     Dominio (rocketseat.com.br)
CEP (01310-100) ←──────────►    IP (104.26.10.78)
Correios        ←──────────►    DNS (Domain Name System)
Casa            ←──────────►    Servidor
Carta/Pacote    ←──────────►    Arquivos (HTML, CSS, JS)
```

## Exemplo pratico — Verificando DNS no terminal

```bash
# Descobrir o IP de um dominio (o que o DNS faz por voce)
nslookup rocketseat.com.br

# Resultado tipico:
# Name:    rocketseat.com.br
# Address: 104.26.10.78

# Traceroute — ver o caminho ate o servidor (os "hops")
traceroute rocketseat.com.br

# Resultado mostra cada "central" por onde sua requisicao passa
# 1  192.168.1.1      (seu roteador)
# 2  10.0.0.1         (provedor)
# 3  ...              (centrais intermediarias)
# N  104.26.10.78     (servidor destino)
```

## Exemplo pratico — Acessando por IP vs Dominio

```bash
# Ambos levam ao mesmo lugar:
curl -I https://rocketseat.com.br      # Pelo dominio (facil de lembrar)
curl -I https://104.26.10.78           # Pelo IP (dificil de lembrar)

# O DNS converte o primeiro no segundo automaticamente
```

## Resumo visual dos conceitos-chave

```
INTERNET (infraestrutura)
├── Cabos submarinos (backbone)
├── Roteadores
├── Provedores
└── Protocolos (IP, DNS, etc.)
    │
    └── WEB (servicos sobre a internet)
        ├── Sites (HTML/CSS/JS)
        ├── Email
        ├── Streaming (audio/video)
        ├── Aplicativos web
        └── APIs
```