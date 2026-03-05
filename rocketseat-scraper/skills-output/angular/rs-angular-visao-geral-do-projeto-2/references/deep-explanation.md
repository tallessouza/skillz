# Deep Explanation: Visao Geral do Projeto AB Filmes

## Filosofia do Projeto

O instrutor posiciona este projeto como um "projeto completo" que integra multiplos conceitos do Angular de forma coesa. A ideia nao e aprender cada conceito isoladamente, mas ver como eles funcionam **de forma integrada em um projeto mais complexo**.

## Decisoes Arquiteturais Importantes

### Signals como Base de Reatividade

O instrutor enfatiza que "tudo isso daqui e feito com signals" ao falar dos filtros. A escolha de signals (em vez de RxJS puro ou state management externo) indica que o projeto usa a API moderna do Angular para estado reativo. Os filtros de nome e categoria sao concatenaveis e reativos — quando o usuario digita, a lista atualiza automaticamente.

### Token no Application Storage

O instrutor mostra explicitamente no DevTools (aba Application) que o token fica armazenado no storage do navegador. No logout, esse token e removido. Isso e fundamental para entender o fluxo de autenticacao:
1. Login → backend retorna token → salva no storage
2. Cada requisicao → interceptor injeta token no header
3. Guard verifica se token existe antes de permitir acesso a rota
4. Logout → remove token → redireciona para login
5. Tentativa de acessar rota protegida sem token → redirecionamento automatico

### Validacao com Reactive Forms

O cadastro demonstra validacoes:
- **Nome obrigatorio** — campo nao pode ser vazio
- **Email valido** — padrao de email verificado
- **Senhas iguais** — validacao cruzada entre senha e confirmacao
- **Botao desabilitado** — enquanto form invalido, botao de criar fica disabled

O instrutor ressalta que isso e feito com "Signo Forms" (Reactive Forms do Angular com signals).

### Sistema de Avaliacao

O backend processa avaliacoes e calcula a media. O frontend:
1. Envia a avaliacao (1-5 estrelas)
2. Recebe de volta as informacoes atualizadas (nova media)
3. Atualiza a UI automaticamente

O instrutor demonstra adicionando varias avaliacoes seguidas e a media vai se ajustando em tempo real.

### Filmes Independentes de Usuario

Na tela Explorar, todos os filmes sao listados independente de quem os adicionou. Isso indica que o backend tem um endpoint que retorna todos os filmes sem filtro por usuario. Ja os favoritos sao por usuario.

## Fluxo de Navegacao

```
Login/Cadastro → Explorar → Detalhes do Filme
                    ↓              ↓
              Adicionar Filme   Avaliar / Favoritar
                    ↓
               Favoritos
                    ↓
                 Logout → Login
```

## Rotas Protegidas

O instrutor demonstra explicitamente: apos fazer logout, tenta acessar `/favorites` diretamente na URL e e redirecionado para a tela de login. Isso confirma que guards estao ativos em TODAS as rotas exceto login/cadastro.