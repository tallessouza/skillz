# Deep Explanation: Testando Projeto em Produção

## Por que testar em produção é uma etapa obrigatória

O deploy bem-sucedido (build sem erros) não garante que a aplicação funciona corretamente em produção. Diferenças de ambiente, variáveis de ambiente ausentes, problemas de CORS, ou assets não encontrados só se manifestam quando a aplicação roda no servidor real.

## O dashboard da Vercel como fonte de verdade

O instrutor enfatiza que o dashboard centraliza todas as informações críticas do deploy:

- **Nome do projeto** — identifica qual repositório está associado
- **Preview** — permite visualização rápida sem abrir a URL
- **Branch e commit** — rastreabilidade completa entre código e deploy
- **Status** — indica se o deploy está pronto para uso
- **Timestamp** — quando o deploy foi criado

### Dois caminhos para o dashboard

1. **Pós-deploy direto:** O botão "Continue to Dashboard" aparece imediatamente após o deploy finalizar. É o caminho mais rápido.

2. **Via Overview:** Na página principal da Vercel, todos os projetos são listados. Se o projeto é recém-criado, pode ser necessário recarregar a página para que ele apareça. Ambos os caminhos levam ao mesmo lugar.

## Rastreabilidade de commits

O instrutor destaca a importância de comparar o commit exibido no dashboard com o histórico do repositório Git. Isso garante que:

- O código em produção é exatamente o que você espera
- Não houve problema de sincronização entre push e deploy
- Você pode identificar qual versão do código está rodando

O hash do commit (identificador) e a mensagem devem ser idênticos nos dois lugares.

## Teste em múltiplos dispositivos e redes

A aplicação rodando em `localhost` só é acessível na máquina local. Em produção, ela roda em uma URL pública (`https://{projeto}.vercel.app`), o que significa:

- Qualquer pessoa com o link pode acessar
- O comportamento pode variar entre dispositivos (responsividade)
- Latência de rede real entra em jogo
- APIs externas podem se comportar diferentemente (CORS, rate limits)

O instrutor sugere enviar o link para amigos como forma de validação real — um teste de usabilidade informal mas valioso.

## Ciclo contínuo: deploy → teste → incremento

O instrutor incentiva não apenas testar, mas também incrementar funcionalidades e re-deployar. Na Vercel, cada push para a branch configurada (geralmente `main`) dispara automaticamente um novo deploy, criando um ciclo natural:

```
Desenvolver → Commit → Push → Deploy automático → Testar em produção → Repetir
```