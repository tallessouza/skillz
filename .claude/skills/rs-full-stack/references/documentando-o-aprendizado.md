---
name: rs-full-stack-documentando-o-aprendizado
description: "Enforces active learning documentation practices when studying programming with AI assistance. Use when user asks to 'document what I learned', 'create study notes', 'review my code changes', 'explain what was built', or any learning reflection task. Applies PARI methodology (Pergunte, Anote, Revise, Explique) and generates structured documentation for future review. Make sure to use this skill whenever the user is in a learning context and needs to consolidate knowledge from AI-assisted coding sessions. Not for API documentation, README files, or production code documentation."
---

# Documentando o Aprendizado

> Gere documentacao estruturada de cada sessao de codigo para consolidar aprendizado ativo, nunca apenas para arquivar.

## Rules

1. **Documente DURANTE a sessao, nao depois** — peca ao AI para gerar documentacao detalhada do que foi feito enquanto o contexto esta fresco, porque amanha voce nao lembra os detalhes
2. **Documentacao serve para REVISAR, nao para arquivar** — o objetivo e voltar amanha, ler, e tentar explicar com suas palavras antes de continuar, porque isso ativa o recall
3. **Aplique PARI em toda sessao** — Pergunte, Anote, Revise, Explique + Pause — porque metodologia ativa supera leitura passiva
4. **Reescreva o codigo voce mesmo** — entender nao e suficiente, memoria muscular so vem escrevendo, porque e como aprender matematica: nao se pula direto pro calculo
5. **Nao delegue 100% para a IA** — a IA gera, voce entende e reescreve, porque quem so le nunca consegue escrever sozinho
6. **Cada micro-feature merece sua documentacao** — nao espere acumular, documente cada pequena funcionalidade, porque em 2 meses voce precisa entender cada decisao

## Metodologia PARI

### Pergunte (Ask)
Faca perguntas especificas ao AI sobre o que nao entendeu. Nao aceite codigo sem entender.

### Anote (Note)
O codigo sendo escrito e a documentacao gerada sao suas anotacoes. Salve no git.

### Revise (Review)
No dia seguinte, volte no codigo E na documentacao. Leia antes de continuar.

### Explique (Explain)
Tente explicar o que foi feito SEM olhar o codigo. Fale em voz alta ou escreva. Professores aprendem mais porque explicam.

### Pause
Faca pausas intencionais. Caminhe 5 minutos. Durma. Volte no dia seguinte.

## Workflow de documentacao

### Step 1: Ao finalizar uma feature
```
Prompt para o AI (modo agente):
"Faca uma documentacao detalhada do que foi feito aqui,
para que eu possa revisar e aplicar em qualquer outro
momento dos meus estudos."
```

### Step 2: O AI analisa e gera
O AI em modo agente analisa todo o historico, cria a documentacao e salva como arquivo no projeto.

### Step 3: Commit e salve
```bash
git add docs/
git commit -m "docs: documentacao da feature X para revisao"
```

### Step 4: Revisao ativa (dia seguinte)
1. ANTES de ler a documentacao, tente lembrar o que fez
2. Leia a documentacao e compare com sua memoria
3. Tente explicar cada decisao em voz alta
4. Reescreva trechos-chave do codigo sem copiar

## Example

**Antes (aprendizado passivo):**
```
1. Pede pro AI fazer o botao
2. AI faz o botao com CSS
3. Aceita tudo, faz commit
4. Proximo dia: nao lembra nada
5. 2 meses depois: nao entende o proprio codigo
```

**Depois (com PARI aplicado):**
```
1. Pede pro AI fazer o botao
2. AI faz — voce pergunta "por que usou transition aqui?"
3. Pede documentacao detalhada ao AI
4. Faz commit do codigo + documentacao
5. Proximo dia: le a doc, tenta explicar, reescreve o CSS
6. 2 meses depois: entende tudo, doc ajuda a relembrar
```

## Heuristics

| Situacao | Acao |
|----------|------|
| AI gerou codigo que voce nao entende | Pare e pergunte antes de aceitar |
| Terminou uma micro-feature | Peca documentacao imediatamente |
| Vai fechar o editor por hoje | Commit + doc + anote o que falta |
| Voltando no dia seguinte | Leia doc ANTES de pedir mais codigo |
| Preparando para entrevista | Pratique explicar decisoes do projeto |
| Trabalhando em time | Commits explicativos + doc ajudam todos |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Aceitar todo codigo sem ler | Ler, perguntar, entender cada trecho |
| Acumular features sem documentar | Documentar cada micro-feature |
| Ler documentacao passivamente | Tentar explicar ANTES de reler |
| Pular direto para codigo complexo | Dominar fundamentos primeiro (como matematica) |
| Confiar que "entender" basta | Reescrever o codigo voce mesmo |
| Deletar historico de chat | Manter historico como material de revisao |

## Analogia fundamental

Aprender programacao com IA e como aprender matematica: ninguem aprende calculo sem fazer continhas basicas primeiro. A IA gerando tudo e como pular direto pro calculo — voce reprova ate voltar nos fundamentos. Escrever codigo "na mao" treina o cerebro, assim como fazer contas antes de usar calculadora. No futuro voce usara ferramentas para acelerar, mas so porque ja domina os fundamentos.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre PARI, analogia com matematica, e por que reescrever importa
- [code-examples.md](references/code-examples.md) — Exemplos de prompts de documentacao e templates de revisao

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-documentando-o-aprendizado/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-documentando-o-aprendizado/references/code-examples.md)
