# Raio Som — Diagnóstico por Imagem

Site institucional e de **solicitação de agendamento** da Raio Som
(Gravataí · Cachoeirinha).

> O site **não marca horário**. Ele registra uma solicitação, guarda o pedido
> médico com segurança, devolve um **protocolo** e entrega o paciente no
> WhatsApp da central com a mensagem pronta. Quem fecha o horário é uma
> pessoa, no atendimento. Todo o desenho do backend parte disso.

## Stack

| Camada | Escolha |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Estilo | CSS escrito à mão em `styles/` — sem framework de utilitários |
| Backend | Route handlers do próprio Next (Node.js) |
| Banco | MySQL via Prisma 7 + `@prisma/adapter-mariadb` |
| Arquivos | Disco local fora do webroot (`lib/storage.ts`) |
| Conteúdo | Arquivos TypeScript tipados em `content/` (sem CMS) |

**Sobre o CSS:** o projeto não usa Tailwind. As páginas são HTML semântico com
classes próprias (`.hero`, `.card-exame`, `.upload`), e todo valor de cor,
espaçamento ou tipografia vem de uma variável definida em
[`styles/tokens.css`](styles/tokens.css). React entra só onde existe estado:
formulário, upload, máscaras, menu e toasts.

## Como rodar

```bash
cp .env.example .env     # preencha DATABASE_URL, UPLOADS_DIR e SESSION_SECRET
npm install
npx prisma migrate dev   # cria as tabelas no MySQL
npm run dev              # http://localhost:3000
```

Gere um `SESSION_SECRET` novo com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Crie o primeiro usuário do painel:

```bash
node scripts/criar-usuario-painel.mjs recepcao "Recepção Matriz" umaSenhaBoa
```

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e execução em produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica migrations em produção |
| `npm run db:generate` | Regenera o Prisma Client |
| `npm run db:studio` | Prisma Studio |
| `node scripts/criar-usuario-painel.mjs <usuario> "<Nome>" <senha>` | Cria ou atualiza o acesso de um atendente |
| `node scripts/expurgo-pedidos.mjs [--simular]` | Apaga os pedidos médicos fora do prazo de retenção |
| `node scripts/gerar-catalogo.mjs` | Regera o catálogo de exames a partir dos CSV (ver abaixo) |

## Estrutura

```
app/
  (site)/         páginas públicas — header com menu e rodapé completo
  (fluxo)/        agendamento — cabeçalho enxuto, sem menu (padrão checkout)
  painel/         área interna da central
  api/            endpoints
components/
  ui/             design system (Button, Input, Select, FileUpload, Stepper…)
  site/           header e rodapé
  agendamento/    formulário e tela de confirmação
content/          conteúdo tipado: exames, unidades, convênios, clínica,
                  institucional (história, missão, visão, valores), notícias
content/catalogo/ catálogo gerado (JSON) — não editar à mão
data/             CSV do catálogo de exames e dos sinônimos (fonte)
lib/              prisma, env, storage, validação, sessão, máscaras
styles/           tokens.css, base.css, layout.css, componentes.css + por página
prisma/           schema e migrations
scripts/          tarefas de operação (painel, expurgo, catálogo)
public/           imagens (exames, convênios, marca, unidades)
```

Os dois grupos de rota existem por um motivo de produto: dentro do fluxo de
agendamento o menu some. Cada link de navegação ali é uma chance a mais de o
paciente abandonar a solicitação no meio — fica só o telefone da central.

## Catálogo de exames

A busca de `/exames` usa o catálogo do sistema da clínica: 844 exames reunidos
em 346 grupos. A clínica edita os CSV, o script gera os JSON, o site lê só os
JSON.

| Arquivo | Papel |
| --- | --- |
| `data/catalogo_exames.csv` | Fonte. Uma linha por exame do sistema |
| `data/sinonimos.csv` | Fonte. Como o paciente chama cada modalidade e região |
| `content/catalogo/*.json` | Gerado. Nunca editar à mão |

```bash
node scripts/gerar-catalogo.mjs
```

O script filtra `exibir = SIM`: as linhas com `NAO` são itens internos de
faturamento (taxa de sala, incidência adicional, reconstrução 3D) que o
paciente não deve conseguir pedir. Também traduz os códigos para texto
(`COM` vira “Com contraste”, `DIREITO` vira “Direito”) e descarta
`NAO_INFORMADO`. Rode o script e faça commit dos JSON sempre que os CSV
mudarem: o build não regenera nada sozinho.

O `nome_interno` é o nome do exame no sistema da clínica. Ele entra no índice
da busca, porque é o que muitos pedidos médicos trazem escrito, mas **nunca
aparece para o paciente** nem chega ao bundle do navegador. Quando o paciente
escolhe uma variação em `/exames/grupo/[grupo]`, o que viaja na URL é o id da
linha (`/agendar/<exame>?exame=462`), e quem resolve o id de volta é o
servidor — na página do agendamento e outra vez na API, que também confere se
a variação pertence mesmo àquela modalidade. O código interno só reaparece no
painel, para a central achar o exame no sistema.

Como o id é a linha do CSV, regerar o catálogo pode reatribuir ids. Por isso a
solicitação grava o código interno e o rótulo da variação junto, e não só o id.

**Uma linha pode ter mais de um código interno**, separados por `|` no
`nome_interno`, quando a clínica fundiu linhas que ficaram idênticas para o
paciente. São 274 hoje. O agendamento usa o primeiro (`codigoDoAgendamento`) e
a ficha do painel mostra a lista inteira, porque qual código cobrar em cada
convênio é decisão da clínica, não do site — a coluna `revisar` do CSV marca
essas linhas.

A escolha da variação acontece em duas etapas em `/exames/grupo/[grupo]`:
primeiro a região, quando o grupo cobre mais de uma, e depois lado, contraste,
detalhe e convênio na mesma tela. Só vira pergunta o campo que de fato separa
as linhas restantes — por isso a maioria dos grupos cai direto no resultado. O
contraste sempre oferece “não sei” quando existe linha sem contraste
informado: boa parte dos pedidos médicos não diz, e o paciente não pode travar
por causa disso.

## Conteúdo que muda com frequência

**Notícias.** Cada notícia é um objeto em `NOTICIAS`, em `content/noticias.ts`
(`slug`, `titulo`, `data` no formato AAAA-MM-DD, `resumo`, `paragrafos` e
`imagem` opcional em `public/`). A lista sai da mais nova para a mais antiga,
a página da notícia e o sitemap são gerados no build, então publicar é editar
o arquivo, fazer commit e publicar o site. Sem nenhuma notícia, `/noticias`
mostra um aviso com os links do Instagram e do Facebook.

**Idade e número de unidades.** Nenhum dos dois é escrito à mão. A idade é
`ano atual − 1974` (`CLINICA.anos`, em `content/clinica.ts`) e vira sozinha na
virada do ano; o total de unidades é `UNIDADES.length + 1` (as unidades de
atendimento mais o prédio administrativo, onde se retiram os exames).

**Pré-agendamento.** O site não marca horário: ele coleta os dados e o pedido
e a central confirma pelo WhatsApp. Por isso os botões e textos usam
“pré-agendamento”, e as instruções de cada exame aparecem como “Orientações”.
A exceção, pedida pela clínica, é o botão do menu: “Agende seu exame”.

**Unidades no pré-agendamento.** O formulário oferece só as unidades que
realizam o exame (`unidades` de cada exame em `content/exames.ts`), e a API
recusa qualquer outra. Por isso a Millenarium aparece apenas na
ultrassonografia, o único exame que ela faz; Solaris e IOG são pontos de
marcação e não aparecem em nenhum.

## Rotas

| Rota | O que é |
| --- | --- |
| `/` | Home |
| `/exames`, `/exames/[slug]` | Busca e página de cada modalidade |
| `/exames/grupo/[grupo]` | Escolha da variação do catálogo |
| `/convenios`, `/unidades`, `/sobre`, `/trabalhe-conosco` | Institucionais |
| `/noticias`, `/noticias/[slug]` | Lista de notícias e página de cada uma |
| `/politica-de-privacidade` | Política de Privacidade e Cookies |
| `/agendar` | Passo 1 do pré-agendamento: escolha do exame |
| `/agendar/[examSlug]` | Passo 2: dados do paciente + upload do pedido |
| `/agendar/[examSlug]/confirmacao` | Passo 3: protocolo e handoff no WhatsApp |
| `POST /api/solicitacoes` | Cria a solicitação, salva o arquivo, devolve o protocolo |
| `GET /api/solicitacoes/[protocolo]` | Consulta interna (exige sessão do painel) |
| `/painel`, `/painel/[protocolo]` | Lista e ficha da solicitação |
| `/painel/[protocolo]/arquivo` | Serve o pedido médico (exige sessão) |

## Banco de dados

`prisma/schema.prisma` define quatro tabelas:

- **`solicitacoes`** — a solicitação de agendamento: paciente, exame, unidade,
  turno, convênio, contato, chave do arquivo do pedido médico, protocolo,
  status e registro do consentimento LGPD.

  No formulário **todo campo é obrigatório menos a foto do pedido médico**: a
  clínica prefere receber a solicitação sem o anexo a perder quem não tem o
  pedido digitalizado na hora — esse paciente leva o papel no dia. Por isso
  `arquivoChave`, `arquivoMime`, `arquivoTamanho` e `arquivoNomeOrigem` são
  nulos quando não houve anexo, que é diferente de terem sido apagados pela
  retenção (`arquivoExpurgoEm`).

  WhatsApp e e-mail têm uma caixa “Não possuo” cada um e podem ficar os dois
  em branco, por decisão da clínica. Quando isso acontece a tela final troca o
  botão do WhatsApp por “Ligar para a central”, e a ficha do painel avisa o
  atendente de que não há por onde procurar o paciente.

  O formulário só oferece as unidades que realizam aquele exame — Solaris e
  IOG são pontos de marcação e não aparecem. A API confere de novo, porque o
  formulário é só a primeira barreira.
- **`contadores_protocolo`** — sequencial por ano, usado para gerar
  `RS-AAAA-NNNNN` sem colisão (incrementado dentro da transação que cria a
  solicitação).
- **`usuarios_painel`** — equipe da central que acessa `/painel` (bcrypt).
- **`logs_acesso_arquivo`** — quem abriu o pedido médico de qual paciente e
  quando.

O nome do exame é gravado junto da solicitação de propósito: o conteúdo vive
em `content/exames.ts` e pode mudar, mas o pedido tem que preservar o que o
paciente viu na hora. Pelo mesmo motivo, quando o paciente escolhe uma
variação na busca, `solicitacoes` guarda `catalogoId`, `catalogoVariacao`,
`catalogoCodigo` e `catalogoCodigos` — todos nulos no fluxo em que ele entra
direto pela página da modalidade. `catalogoCodigos` só vem preenchido quando a
linha tem mais de um código e a clínica ainda precisa dizer qual usar.

## LGPD e segurança

CPF, data de nascimento e a foto do pedido médico são **dados pessoais
sensíveis de saúde**. O que o código garante:

- **Arquivo fora do webroot.** O pedido médico é gravado em `UPLOADS_DIR`
  (ex.: `/var/raiosom-uploads`), nunca em `public/`. O nome é aleatório
  (`crypto.randomUUID()`) e a extensão vem do *magic number* do arquivo, não
  do que o navegador informou — um `.txt` renomeado para `.jpg` é recusado.
  Só a rota autenticada do painel serve o conteúdo.
- **Nada sensível em log.** O Prisma roda com `log: ["warn", "error"]` (sem
  query log, que imprimiria CPF) e o código não escreve CPF, nome do paciente
  nem chave de arquivo em log.
- **CPF mascarado na mensagem do WhatsApp** (`123.***.**9-00`). O CPF completo
  só aparece dentro do painel autenticado, buscado pelo protocolo — ele não
  trafega na URL do `wa.me`, que fica no histórico do navegador.
- **A confirmação não consulta o banco pelo protocolo.** O protocolo é
  sequencial, logo adivinhável; se a página buscasse os dados por ele,
  trocar o número na URL exibiria o nome de outro paciente. A prévia da
  mensagem vem do `sessionStorage`, gravado no envio.
- **Consentimento registrado** com data/hora, o texto exato aceito e o HMAC do
  IP (prova sem armazenar o IP em claro).
- **Trilha de acesso.** Toda abertura do pedido médico pelo painel vira uma
  linha em `logs_acesso_arquivo`.
- **Validação no servidor.** Máscara no formulário é conveniência; a validação
  que vale (CPF com dígito verificador, data real, tipo e tamanho do arquivo)
  roda no route handler.
- **Rate limiting** de 5 solicitações por IP a cada 10 minutos no
  `POST /api/solicitacoes`, e 10 tentativas de login por IP a cada 15 minutos.
  É em memória: se o site passar a rodar em mais de um processo, troque o
  `Map` de `lib/rate-limit.ts` por Redis ou uma tabela.

### Retenção do pedido médico

O arquivo é mantido por **90 dias** (`RETENCAO_PEDIDO_DIAS`) depois que a
solicitação vira `confirmado` ou `cancelado`. Passado o prazo, o arquivo é
apagado e a solicitação guarda só `arquivoExpurgoEm` como registro de que
existiu; os dados de atendimento ficam para histórico.

O expurgo **não roda sozinho** — decisão consciente desta fase. O trabalho
está pronto em `scripts/expurgo-pedidos.mjs` (rode com `--simular` primeiro);
falta agendá-lo no servidor:

```
# Linux, todo dia às 3h
0 3 * * * cd /var/www/raiosom && node scripts/expurgo-pedidos.mjs >> /var/log/raiosom-expurgo.log 2>&1
```

### HTTPS

**Obrigatório em produção** — o formulário trafega CPF e documento de saúde.
Isso não se resolve no código: configure TLS no servidor web / proxy reverso
(Nginx, Apache ou Cloudflare) e redirecione todo `http://` para `https://`.
O cookie de sessão do painel usa `Secure` fora de desenvolvimento, então o
painel simplesmente não loga sem HTTPS.

O rate limiting e o hash do IP leem `X-Forwarded-For`. Garanta que o proxy
reverso reescreva esse cabeçalho; sem proxy na frente, ele é forjável.

## Acessibilidade

- Contraste conferido contra o WCAG 2.1 AA. Dois tokens foram ajustados em
  relação à paleta original e o motivo está comentado em `styles/tokens.css`:
  `--texto-tenue` (o `neutro-400` dava 2,6:1 no branco) e
  `--cor-acao-sobre-claro` (o `agua-600` sobre `agua-100` dava 4,1:1).
- Todo campo tem `<label>`, e erro e dica ligados por `aria-describedby`.
- Foco visível padronizado em `:focus-visible`; link "pular para o conteúdo".
- `prefers-reduced-motion` desliga as animações de entrada.
- As seções com efeito de revelação aparecem mesmo sem JavaScript
  (`<noscript>` no layout raiz).

## Pendências com a clínica

- **Nomes dos convênios.** Os nomes usados hoje vieram do Figma aprovado
  (Unimed, IPE Saúde, Bradesco, Amil, Cabergs, SulAmérica, IPERGS, Doctor
  Clin, GEAP, Cassi, Postal Saúde) e são plausíveis, mas **não foram
  confirmados pela clínica**, nem o pareamento com os 30 logos de
  `public/convenios/`. Está marcado com `// TODO` em `content/convenios.ts`.
  Por isso a Home e a página `/convenios` mostram nomes e logos em blocos
  separados: nenhuma das duas afirma qual logo é qual plano.
- **`public/convenios/31.png` está em branco** — o arquivo existe, mas não tem
  logo nenhum dentro. Ficou fora da lista em `content/convenios.ts`; é só
  devolver o número quando a arte certa chegar. Hoje são 26 logos exibidos;
  o 33 (VerteMed) é o único com nome e logo confirmados pela clínica.
- **Duas fotos de exame estavam trocadas no material de briefing.** `do.jpg` é
  o densitômetro GE Lunar (Densitometria Óssea) e `radio.jpg` é o aparelho
  panorâmico (Radiologia Odontológica) — o documento associava `do.jpg` à
  odontológica e dizia que a densitometria não tinha foto. Corrigido em
  `content/exames.ts`; vale confirmar com a clínica.
- **“Exames Cardiológicos”.** A frase-resumo do Figma cita ECG e ergometria; o
  conteúdo do site antigo só menciona o ecocardiograma. Confirmar o que a
  clínica realiza.
- **Seção nova da Política de Privacidade.** O texto das seções 1 a 14 é o
  documento vigente da clínica (dezembro/2021). A seção "Solicitação de
  agendamento pelo site" foi escrita agora para declarar o novo tratamento
  (upload do pedido, protocolo, retenção de 90 dias) e precisa passar pela
  Encarregada de Proteção de Dados antes de publicar.
- **Logo sem o número de aniversário.** O `public/marca/logo.png` tinha a
  faixa “50 anos”; ela foi apagada e o resto da arte ficou intacto. Uma versão
  “52 anos” precisa vir do designer da clínica.
- **Biópsia no catálogo.** A página da biópsia mostra só mamas, próstata e
  tireoide, guiadas por ultrassom. O `data/catalogo_exames.csv` ainda tem os
  grupos de tórax, períneo e vasos/órgãos e as linhas guiadas por tomografia,
  que aparecem na busca. Para tirá-las, basta marcar `exibir = NAO` e rodar o
  script do catálogo.
- **Raios X.** O site antigo diz que é por ordem de chegada; o conteúdo atual
  diz que tem agendamento prévio. Confirmar qual vale.
- **Horário de retirada de exames.** O site diz a partir das 7h30; o site
  antigo dizia 8h e incluía sábado, das 8h às 12h.
- **Corpo clínico.** As listas de médicos do site antigo não batem entre as
  páginas “Sobre” e “Corpo clínico”, então nenhuma lista foi publicada.
- **Data da primeira notícia.** Está com a data de hoje; trocar pela data real
  de lançamento do site.


Para rodar local:
cd "C:\Users\eduardo.dorneles\Desktop\site(novo)\raiosom-site"
npm install
npm run dev
