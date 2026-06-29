# Psicanalista

Projeto em HTML, CSS e JavaScript puro para site institucional, area do cliente, painel administrativo, prontuario, anamnese, exercicio de 7 dias e controle financeiro.

O frontend usa Supabase diretamente no navegador com chave publica anonima. As regras de seguranca devem ser configuradas no Supabase com RLS. Nunca use uma service role key no frontend.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Supabase

## Como rodar

1. Abra a pasta do projeto no VS Code.
2. Instale a extensao Live Server, se ainda nao tiver.
3. Clique com o botao direito em `index.html` e selecione `Open with Live Server`.
4. Acesse as paginas pelo navegador usando a URL local gerada pelo Live Server.

## Configuracao do Supabase

O arquivo `supabase-client.js` concentra a URL e a chave publica do projeto.

Tabelas usadas:

- `pacientes`
- `fluxo_caixa`

Campos usados em `pacientes` incluem dados cadastrais, acesso do paciente, anamnese, financeiro, agenda, links, notas e respostas do exercicio de 7 dias.

Campos usados em `fluxo_caixa` incluem descricao, valor, moeda, tipo e data.

## Estrutura JavaScript

- `supabase-client.js`: URL, chave publica e client Supabase.
- `auth.js`: login, logout e validacao de acesso administrativo.
- `pacientes.js`: cadastro, listagem e exclusao de pacientes.
- `financeiro.js`: fluxo de caixa e tabelas de sessoes pagas/pendentes.
- `prontuario.js`: detalhes do cliente, agenda, links, anamnese, notas e salvamento.
- `exercicio-7-dias.js`: logica da tarefa de 7 dias.
- `ui.js`: modal, popup, reveal, validacoes e helpers visuais.

Os arquivos `config.js`, `script.js` e `adm-script.js` foram mantidos apenas como legados de compatibilidade, mas as paginas atuais usam os arquivos separados acima.
