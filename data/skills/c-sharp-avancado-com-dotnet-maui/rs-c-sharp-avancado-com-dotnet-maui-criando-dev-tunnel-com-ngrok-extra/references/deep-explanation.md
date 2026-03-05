# Deep Explanation: Dev Tunnel com Ngrok

## Por que um tunnel e necessario

Quando um aplicativo mobile (como .NET MAUI) precisa se comunicar com uma API rodando na maquina do desenvolvedor, `localhost` nao funciona — `localhost` no dispositivo mobile se refere ao proprio dispositivo, nao ao computador do dev.

O tunnel resolve isso criando uma URL publica na internet que redireciona todo o trafego para a maquina local. Funciona em qualquer rede: 3G, 4G, 5G, Wi-Fi.

## Visual Studio DevTunnel vs Ngrok

O Visual Studio tem essa funcionalidade nativamente chamada DevTunnel. Se voce ja usa o Visual Studio, nao precisa do ngrok. O ngrok e a alternativa para quem usa VS Code, Rider, terminal ou qualquer outro editor.

## Limitacoes da versao gratuita

- A URL publica expira apos aproximadamente 30 minutos (o instrutor menciona ter lido isso, embora nao conste explicitamente na tabela de limitacoes)
- Cada vez que o comando e executado, uma URL diferente e gerada
- O terminal deve permanecer aberto — fechar o terminal encerra o tunnel
- Limite de requisicoes existe mas e generoso para desenvolvimento (4000 req/min)

## Interface de monitoramento

O ngrok oferece uma interface web em `http://localhost:4040` que mostra:
- Todas as requisicoes feitas atraves do tunnel
- Headers da requisicao
- Status code da resposta
- Corpo da resposta
- Historico (limitado a ~10 entradas no terminal, mais na interface web)

Isso e util para debugar problemas de comunicacao entre o app e a API sem precisar de ferramentas externas.

## Configuracao no Windows

No Windows, a sintaxe exige `.\ngrok.exe` (com ponto-barra) quando executado no PowerShell, ou `./ngrok.exe` no terminal. O instrutor destaca que o comando da documentacao oficial pode nao funcionar diretamente — e necessario adaptar para a sintaxe do terminal Windows.

Se for usar frequentemente, adicionar o caminho do executavel nas variaveis de ambiente do sistema operacional para poder executar `ngrok` de qualquer diretorio.