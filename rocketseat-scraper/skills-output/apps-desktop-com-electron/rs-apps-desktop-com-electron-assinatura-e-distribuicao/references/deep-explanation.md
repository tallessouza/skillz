# Deep Explanation: Assinatura e Distribuição de Apps Electron

## Raciocinio do instrutor (Diego)

### Por que nao certificar no curso

Diego explica que a certificacao so faz sentido quando "o core da sua empresa envolve a aplicacao desktop". Para fins de aprendizado e para a maioria dos projetos, o custo e a burocracia nao se justificam. Ele tem certeza de que "dificilmente voce vai fazer esse processo" — e quando fizer, a documentacao do Electron Builder em Code Signing e suficiente.

### A analogia com Mac

"No Mac, quem usa Mac ja esta muito acostumado com isso, que uma boa parte das aplicacoes que a gente baixa sao assim. E nao e por isso que a gente entende que essas aplicacoes nao sao seguras."

Isso normaliza a distribuicao sem assinatura — nao e amadorismo, e pratica comum mesmo em apps reais.

### Comparacao com mobile

Diego destaca que distribuir apps Electron e "muito diferente de aplicacoes web" e "um pouco diferente de aplicacoes mobile". No mobile, o processo e "bem chato, bem rigoroso" com "um monte de necessidade, de regra, de revisao". No Electron, a menos que voce queira publicar em loja oficial, basta gerar executaveis.

### A solucao pragmatica de auto-update

Em vez de pagar certificacao so para ter Electron Updater, Diego propoe uma alternativa via GitHub Releases API:

1. Versao no `package.json` serve como source of truth local
2. GitHub Releases API como source of truth remota
3. Comparacao de versoes usando semantic versioning (major.minor.patch)
4. Modal informativo — nao e tao elegante quanto auto-update silencioso, mas funciona

Diego admite: "nao tem a melhor usabilidade do mundo para quem esta usando a aplicacao" — mas e gratuito e funcional.

### Stack de distribuicao do curso

- **Electron Builder** para gerar executaveis (macOS, Windows, Linux)
- **GitHub Actions** para CI/CD multiplataforma
- **GitHub Releases** para hospedagem dos binarios e controle de versao
- **Sem certificacao, sem Electron Updater**

### Custo real da certificacao

- Windows: EV Code Signing Certificate — pode variar bastante, a partir de ~R$400
- Renovacao anual (como SSL)
- Empresas certificadoras emitem o certificado
- macOS: conta de desenvolvedor Apple (paga)

### Quando escalar

Diego deixa claro que existe um gradiente:
- Comecou? Sem assinatura, GitHub Releases
- Cresceu? Certificacao + Electron Updater
- Loja? Conta de desenvolvedor + processo de revisao completo

A decisao depende de "o tipo de aplicacao que voce esta desenvolvendo, do nivel, da importancia, da complexidade".