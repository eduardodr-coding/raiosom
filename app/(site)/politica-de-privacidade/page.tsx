import type { Metadata } from "next";
import Link from "next/link";
import { Aviso } from "@/components/ui/Aviso";
import { CLINICA } from "@/content/clinica";

import "@/styles/exames.css";

export const metadata: Metadata = {
  title: "Política de Privacidade e Cookies",
  description:
    "Como a Raio Som coleta, usa, armazena e protege os dados pessoais e os dados de saúde dos pacientes, conforme a LGPD.",
};

/**
 * Política de Privacidade e Cookies.
 *
 * O texto das seções 1 a 14 é o documento vigente da clínica (formulado em
 * dezembro de 2021), transposto do site antigo sem alteração de conteúdo — é
 * documento jurídico, não copy de site.
 *
 * A seção "Solicitação de agendamento pelo site" é NOVA: descreve o
 * tratamento que este site passou a fazer (upload do pedido médico, protocolo
 * e prazo de retenção). Tratamento novo precisa estar declarado, então ela
 * está aqui desde o primeiro dia.
 *
 * TODO: submeter a seção nova à Encarregada de Proteção de Dados antes de
 * publicar, e atualizar a data da política quando ela aprovar.
 */
export default function PaginaPrivacidade() {
  return (
    <>
      <div className="pagina-topo">
        <div className="container">
          <ol className="trilha">
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>Política de Privacidade e Cookies</li>
          </ol>
          <h1>Política de Privacidade e Cookies</h1>
          <p className="pagina-topo__texto">
            Na RAIO SOM, privacidade e segurança são prioridades e nos comprometemos com a
            transparência do tratamento de dados pessoais dos nossos usuários/pacientes e
            visitantes.
          </p>
        </div>
      </div>

      <section className="secao">
        <div className="container texto-longo">
          <p>
            Esta Política de Privacidade aplica-se a todos os usuários/pacientes e visitantes do
            website raiosom.com.br e do aplicativo RAIO SOM (que em conjunto denominamos
            “Plataforma”) e esclarece quais dados são coletados, por qual finalidade, a razão pela
            qual são coletados, como a coleta pode afetá-lo e como os dados são protegidos, tudo em
            conformidade com a legislação brasileira atualmente em vigor em matéria de privacidade
            e proteção de dados pessoais, incluindo, mas não se limitando à Lei nº 12.965, de 23 de
            abril de 2014 e Decreto nº 8.771, de 11 de maio de 2016 (“Marco Civil da Internet”) e à
            Lei nº 13.709, de 14 de agosto de 2018 (“Lei Geral de Proteção de Dados” ou “LGPD”).
          </p>
          <p>
            Para efeitos desta Política, a RAIO SOM é qualificada como Controlador, uma vez que
            realiza o armazenamento das informações pessoais coletadas, competindo a ela as
            decisões referentes ao tratamento desses dados.
          </p>
          <p>
            A RAIO SOM é um centro clínico especializado em oferecer exames e diagnósticos por
            imagens de forma prática e acessível, permitindo o agendamento e o acesso aos
            resultados dos exames por intermédio de sua Plataforma, conforme descrito neste
            documento.
          </p>
          <p>
            Ao se cadastrar em nossa Plataforma para usufruir de nossos Serviços, você (“Usuário”)
            manifesta de maneira livre, informada, inequívoca, expressa e integral a sua
            concordância com nossa Política de Privacidade, motivo pelo qual recomendamos a sua
            leitura com atenção. Caso não concorde com nossa Política de Privacidade, por favor não
            dê continuidade ao seu cadastro e não faça uso da área logada de nossa Plataforma.
          </p>

          <h2>Solicitação de agendamento pelo site</h2>
          <Aviso tipo="info">
            Esta seção descreve especificamente o que acontece quando você usa o formulário de
            solicitação de agendamento deste site.
          </Aviso>
          <p>
            Para preparar a sua solicitação de exame, coletamos <strong>nome completo, CPF, data de
            nascimento e número de WhatsApp</strong> do paciente, o <strong>convênio</strong> (ou a
            informação de que o atendimento é particular) e as suas preferências de unidade e
            turno. Coletamos também a <strong>foto ou o PDF do pedido médico</strong>, que é dado
            pessoal sensível referente à saúde.
          </p>
          <p>
            Esses dados são usados para uma única finalidade: permitir que a nossa central confira
            o pedido médico, verifique a cobertura do convênio e feche o horário do exame com você.
            Nenhum desses dados é usado para publicidade nem compartilhado com terceiros fora das
            hipóteses descritas na seção 7.
          </p>
          <ul>
            <li>
              O pedido médico é <strong>armazenado fora da área pública do site</strong>, com nome
              de arquivo aleatório, e só pode ser aberto por um atendente autenticado no sistema
              interno. Cada abertura do documento fica registrada com o usuário e o horário.
            </li>
            <li>
              Na mensagem que abre no WhatsApp, <strong>o CPF aparece parcialmente mascarado</strong>{" "}
              (por exemplo, 123.***.**9-00). O número completo fica apenas no nosso sistema
              interno, acessível pelo protocolo.
            </li>
            <li>
              O arquivo do pedido médico é <strong>apagado 90 dias</strong> depois que a
              solicitação é concluída ou cancelada. Os dados de atendimento (protocolo, exame e
              status) permanecem para histórico, conforme a seção 5.
            </li>
            <li>
              Registramos a data, a hora e o texto do consentimento que você aceitou ao enviar o
              formulário, como prova de que a autorização foi dada.
            </li>
          </ul>
          <p>
            Você pode solicitar a exclusão da sua solicitação e do pedido médico anexado a qualquer
            momento, informando o número do protocolo para{" "}
            <a href={`mailto:${CLINICA.emails.privacidade}`}>{CLINICA.emails.privacidade}</a>.
          </p>

          <h2>1. Quais dados coletamos sobre você e como nós os utilizamos?</h2>
          <p>
            A RAIO SOM, ao solicitar dados, tanto pessoais quanto sensíveis, está agindo no
            cumprimento de obrigações legais e regulatórias, bem como para tutela da saúde. De
            qualquer forma, sempre que necessário, poderá ser solicitado o consentimento específico
            do usuário.
          </p>
          <h3>Dados pessoais coletados</h3>
          <ul>
            <li>
              <strong>Dados cadastrais:</strong> nome completo, e-mail, telefone, data de
              nascimento.
            </li>
            <li>
              <strong>Dados sensíveis:</strong> informações sobre histórico de agendamentos,
              especialidade do profissional da saúde, exames que o Usuário pode agendar,
              questionários e/ou detalhes adicionais relacionados à saúde.
            </li>
          </ul>
          <h3>Finalidades da coleta</h3>
          <ul>
            <li>Contato com nosso atendimento ao usuário/paciente.</li>
            <li>
              Contato, por nossos atendentes, via e-mail, telefone e mensagens de texto para fazer
              agendamento de exames.
            </li>
            <li>Cumprimento de nossas obrigações legais, regulatórias e fiscais.</li>
            <li>Prestação de cuidados integrados à saúde.</li>
            <li>Agendamento e solicitação de exames de imagem.</li>
            <li>Tutela da saúde.</li>
          </ul>
          <p>
            Informamos que é de responsabilidade do usuário, ou de seus pais e/ou representantes
            legais (no caso de o titular ser menor de 18 anos), o correto preenchimento dos dados,
            bem como a manutenção de suas informações cadastrais atualizadas, sob pena de não poder
            utilizar os recursos oferecidos pela Plataforma. A RAIO SOM não se responsabiliza por
            erros ou equívocos no preenchimento do cadastro do Usuário.
          </p>
          <p>
            Ao autorizar o usuário menor de idade a utilizar a Plataforma, o pai e/ou representante
            legal do Usuário dá seu consentimento para que as informações do Usuário sejam
            coletadas pela Plataforma, tratadas e utilizadas para a realização dos Serviços
            previstos nestes termos.
          </p>

          <h2>2. Como coletamos os seus dados?</h2>
          <p>
            Nós coletamos seus dados pessoais através de informações fornecidas diretamente por
            você, das seguintes fontes:
          </p>
          <ul>
            <li>Website: raiosom.com.br</li>
            <li>App: Raio Som</li>
            <li>Correio eletrônico</li>
            <li>Presencialmente, no dia da realização do exame</li>
            <li>Sistemas de troca de mensagens instantâneas</li>
          </ul>

          <h2>3. Quais são os seus direitos?</h2>
          <p>
            A RAIO SOM assegura a seus usuários/pacientes e visitantes seus direitos de titular
            previstos no artigo 18 da Lei Geral de Proteção de Dados. Dessa forma, você pode, de
            maneira gratuita e a qualquer tempo:
          </p>
          <ul>
            <li>
              Confirmar a existência de tratamento de dados, de maneira simplificada ou em formato
              claro e completo.
            </li>
            <li>
              Acessar seus dados, podendo solicitá-los em uma cópia legível sob forma impressa ou
              por meio eletrônico, seguro e idôneo.
            </li>
            <li>Corrigir seus dados, ao solicitar a edição, correção ou atualização destes.</li>
            <li>
              Limitar seus dados quando desnecessários, excessivos ou tratados em desconformidade
              com a legislação, através da anonimização, bloqueio ou eliminação.
            </li>
            <li>
              Solicitar a portabilidade de seus dados, através de um relatório de dados cadastrais
              que a Raio Som trata a seu respeito.
            </li>
            <li>
              Eliminar seus dados tratados a partir de seu consentimento, exceto nos casos
              previstos em lei.
            </li>
            <li>Revogar seu consentimento, desautorizando o tratamento de seus dados.</li>
            <li>
              Informar-se sobre a possibilidade de não fornecer seu consentimento e sobre as
              consequências da negativa.
            </li>
          </ul>

          <h2>4. Como você pode exercer seus direitos de titular?</h2>
          <p>
            O titular de dados poderá exercer seus direitos mediante pedido escrito dirigido ao
            e-mail <a href={`mailto:${CLINICA.emails.privacidade}`}>{CLINICA.emails.privacidade}</a>.
            O seu requerimento será analisado com a maior brevidade possível, considerando os
            prazos e os termos previstos na legislação aplicável. Caso não seja possível atender
            imediatamente à sua requisição, indicaremos as razões de fato e de direito que nos
            impedem.
          </p>
          <p>
            A RAIO SOM não se responsabiliza pela correção, veracidade, autenticidade, completude e
            atualização dos dados prestados pelo titular, nem mesmo pelo eventual uso indevido de
            informações por ele publicadas ou por fraudes decorrentes da violação de senhas
            pessoais.
          </p>
          <p>
            É de exclusiva responsabilidade do titular prestar informações corretas, verdadeiras,
            autênticas, completas e atualizadas, bem como zelar pelo sigilo de sua senha, quando
            aplicável, não a divulgando a terceiros.
          </p>
          <p>
            De forma a garantir a sua correta identificação como titular dos dados pessoais objeto
            da solicitação, é possível que solicitemos documentos ou demais comprovações que possam
            comprovar sua identidade. Nessa hipótese, você será informado previamente.
          </p>

          <h2>5. Como e por quanto tempo seus dados serão armazenados?</h2>
          <p>
            Seus dados pessoais coletados pela RAIO SOM serão utilizados e armazenados pelo período
            estritamente necessário para cada uma das finalidades descritas nesta Política de
            Privacidade e/ou de acordo com os prazos legais e regulatórios vigentes:
          </p>
          <ul>
            <li>Pelo tempo exigido por lei.</li>
            <li>Até o término do tratamento de dados.</li>
            <li>Pelo tempo necessário a preservar o legítimo interesse do controlador.</li>
            <li>
              Pelo tempo necessário para resguardar o exercício regular de direitos da Raio Som em
              processo judicial, administrativo ou arbitral.
            </li>
            <li>
              Transferência a terceiro, desde que respeitados os requisitos de tratamento de dados
              dispostos na Lei.
            </li>
          </ul>
          <p>
            O armazenamento de dados coletados pela RAIO SOM reflete o nosso compromisso com a
            segurança e privacidade dos seus dados. Empregamos medidas e soluções técnicas de
            proteção aptas a garantir a confidencialidade, integridade e inviolabilidade dos seus
            dados. Além disso, também contamos com medidas de segurança apropriadas aos riscos e
            com controle de acesso às informações armazenadas.
          </p>

          <h2>6. Quais medidas de segurança adotamos para resguardar seus dados pessoais?</h2>
          <p>
            Para mantermos suas informações pessoais seguras, usamos ferramentas físicas,
            eletrônicas e gerenciais orientadas para a proteção da sua privacidade.
          </p>
          <p>
            Nesse sentido, cabe referir que a RAIO SOM mantém em ambiente controlado e de segurança
            os dados pessoais e dados pessoais sensíveis coletados, visando atender à finalidade
            específica da coleta. Os dados pessoais e dados pessoais sensíveis coletados são
            mantidos em sigilo, com controle estrito de acesso, mediante mecanismos de
            autenticação.
          </p>
          <p>
            Além disso, a RAIO SOM afirma que mantém em funcionamento todas as medidas de segurança
            e administrativas, bem como todos os meios técnicos ao seu alcance, para evitar a
            perda, má utilização, alteração, acesso não autorizado e apropriação indevida dos dados
            pessoais e dados pessoais sensíveis de seus usuários.
          </p>
          <p>
            Contudo, é necessário destacar que nenhuma página virtual é inteiramente segura e livre
            de riscos. É possível que, apesar de todos os nossos protocolos de segurança, problemas
            de culpa exclusivamente de terceiros ocorram, como ataques cibernéticos de hackers, ou
            também em decorrência do mau uso do próprio usuário/paciente ou visitante.
          </p>

          <h2>7. Com quem seus dados podem ser compartilhados?</h2>
          <p>
            A RAIO SOM poderá transmitir os seus dados a entidades contratadas que, de alguma
            forma, precisem atuar colaborando para sua melhor experiência (por exemplo: instituições
            de referência assistencial, médicos contratados PJ e PF, laboratórios de análises
            clínicas e outros), também regidos por suas regulamentações.
          </p>
          <p>
            Ainda, pode transmitir dados pessoais dos usuários a terceiros quando tais comunicações
            de dados se tornem necessárias ou adequadas:
          </p>
          <ul>
            <li>à luz da lei aplicável;</li>
            <li>no cumprimento de obrigações legais ou ordens judiciais;</li>
            <li>
              por determinação da Autoridade Nacional de Proteção de Dados ou de outra autoridade
              de controle competente; ou
            </li>
            <li>para responder a solicitações de autoridades públicas ou governamentais.</li>
          </ul>

          <h2>8. Uso de cookies</h2>
          <p>
            Os cookies são pequenos arquivos de texto que podem ser colocados no seu computador ou
            dispositivo portátil por sites ou serviços visitados na web. São utilizados para
            garantir o bom funcionamento de sites e demais serviços online.
          </p>
          <p>
            Na RAIO SOM, os cookies são utilizados para análise estatística da navegação, para
            melhorar o desempenho da nossa Plataforma e entender como você interage com os nossos
            serviços.
          </p>
          <p>
            Ao acessar nossa Plataforma e consentir com o uso de cookies, você manifesta conhecer e
            aceitar a utilização de um sistema de coleta de dados de navegação com o uso de cookies
            em seu dispositivo. A RAIO SOM utiliza os seguintes cookies:
          </p>
          <ul>
            <li>
              <strong>Cookies estritamente necessários:</strong> são os cookies estritamente
              necessários para fornecer nossos serviços e para que o nosso site funcione
              corretamente, garantindo a segurança da navegação, o correto dimensionamento do
              conteúdo e o cumprimento de obrigações legais pela RAIO SOM. Esses cookies não
              armazenam qualquer tipo de informação pessoal que identifique seu titular.
            </li>
            <li>
              <strong>Cookies de funcionalidade e desempenho:</strong> utilizados para aprimorar o
              funcionamento da Plataforma, coletando dados como páginas visitadas, mensagens de
              erro e outras informações relevantes para o desempenho do site/App. Esse tipo de
              cookie não coleta informações de identificação pessoal.
            </li>
            <li>
              <strong>Cookies analíticos:</strong> utilizados para entender como você interage com
              a Plataforma. Todas as informações que esses cookies coletam são agregadas de forma
              anônima.
            </li>
          </ul>

          <h2>9. Gestão de cookies</h2>
          <p>
            Você pode, a qualquer tempo e sem nenhum custo, alterar as permissões, bloquear ou
            recusar os cookies. Todavia, a revogação do consentimento de determinados cookies pode
            inviabilizar o funcionamento correto de alguns recursos da Plataforma. Para gerenciar
            os cookies do seu navegador, basta fazê-lo diretamente nas configurações do navegador,
            na área de gestão de cookies.
          </p>

          <h2>10. Conteúdo do site e sua utilização</h2>
          <p>
            Todo o conteúdo existente em nossa Plataforma é de propriedade da RAIO SOM e sua
            reprodução — total ou parcial — para uso comercial ou editorial, ou republicação na
            internet, deverá ser realizada de forma autorizada e obrigatoriamente citando a fonte e
            incluindo o link do site para o original.
          </p>
          <p>
            Dessa forma, a Plataforma, no todo ou em cada uma das suas abas e seções, poderá ser
            encerrada, suspensa ou interrompida unilateralmente pela RAIO SOM, a qualquer momento e
            sem necessidade de prévio aviso, caso em que será comunicado onde serão disponibilizadas
            as informações dela constantes, cujo acesso seja direito do usuário em conformidade com
            a legislação em vigor.
          </p>

          <h2>11. Responsabilidade</h2>
          <p>
            A RAIO SOM prevê a responsabilidade dos agentes que atuam nos processos de tratamento
            de dados, em conformidade com os artigos 42 ao 45 da Lei Geral de Proteção de Dados.
          </p>
          <p>
            Nos comprometemos em manter esta Política de Privacidade atualizada, observando suas
            disposições e zelando por seu cumprimento. Além disso, também assumimos o compromisso
            de buscar condições técnicas e organizativas seguramente aptas a proteger todo o
            processo de tratamento de dados.
          </p>
          <p>
            Caso a Autoridade Nacional de Proteção de Dados exija a adoção de providências em
            relação ao tratamento de dados realizado pela RAIO SOM, comprometemo-nos a segui-las.
          </p>

          <h2>12. Alteração desta Política de Privacidade e Cookies</h2>
          <p>
            A RAIO SOM poderá atualizar ou alterar esta Política de Privacidade de Dados e Uso de
            Cookies a qualquer momento. Estas atualizações e/ou alterações serão devidamente
            disponibilizadas e, caso representem uma alteração substancial relativamente à forma
            como os seus dados são tratados, serão informadas com destaque em nosso site.
          </p>
          <p>
            A atual versão da Política de Privacidade foi formulada e atualizada pela última vez em{" "}
            {CLINICA.politicaAtualizadaEm}.
          </p>

          <h2>13. Encarregada de Proteção de Dados</h2>
          <p>
            Caso tenha dúvidas sobre esta Política de Privacidade ou sobre os dados pessoais que
            tratamos, você pode entrar em contato com a nossa Encarregada de Proteção de Dados
            Pessoais:
          </p>
          <p>
            {CLINICA.encarregadaDados.nome} —{" "}
            <a href={`mailto:${CLINICA.encarregadaDados.email}`}>
              {CLINICA.encarregadaDados.email}
            </a>
          </p>

          <h2>14. Lei e foro</h2>
          <p>
            Todo o contido nesta Política de Privacidade é regido e interpretado pelas Leis da
            República Federativa do Brasil, ficando eleita a Comarca de Gravataí, Estado do Rio
            Grande do Sul, para dirimir quaisquer controvérsias e disputas relacionadas,
            renunciando a qualquer outro foro, por mais privilegiado que seja.
          </p>
        </div>
      </section>
    </>
  );
}
