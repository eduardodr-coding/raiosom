/**
 * Gera os JSON do catálogo de exames a partir dos CSV que a clínica edita.
 *
 *   node scripts/gerar-catalogo.mjs
 *
 * Entrada:  data/catalogo_exames.csv, data/sinonimos.csv
 * Saída:    content/catalogo/catalogo-exames.json, content/catalogo/sinonimos.json
 *
 * O catálogo de saída traz só as linhas com exibir = SIM. As linhas com NAO são
 * itens internos de faturamento (taxa de sala, incidência adicional,
 * reconstrução 3D) que o paciente não deve conseguir pedir.
 *
 * Os códigos viram texto aqui, e não na tela, para que exista um lugar só onde
 * COM/SEM/DIREITO são traduzidos. NAO_INFORMADO e campos vazios saem do JSON:
 * dizer "contraste não informado" para o paciente não ajuda ninguém, quem
 * define isso é o pedido médico.
 *
 * `nome_interno` pode trazer VÁRIOS códigos separados por " | ": são linhas do
 * sistema que ficaram idênticas para o paciente e a clínica fundiu numa opção
 * só. Viram a lista `codigos`. O agendamento usa o primeiro; a ficha do painel
 * mostra todos, porque é a central que sabe qual cobrar em cada convênio.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = join(RAIZ, "content", "catalogo");

const CONTRASTE = { COM: "Com contraste", SEM: "Sem contraste" };
const LADO = {
  DIREITO: "Direito",
  ESQUERDO: "Esquerdo",
  BILATERAL: "Bilateral",
  UNILATERAL: "Unilateral",
};

function lerCsv(caminho) {
  return parse(readFileSync(join(RAIZ, caminho), "utf8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
}

function escrever(nome, dados) {
  mkdirSync(SAIDA, { recursive: true });
  writeFileSync(join(SAIDA, nome), `${JSON.stringify(dados, null, 2)}\n`, "utf8");
  return dados.length;
}

// ── Catálogo ──────────────────────────────────────────────────────────────

const linhas = lerCsv("data/catalogo_exames.csv");
const ocultas = linhas.filter((linha) => linha.exibir !== "SIM");
const semNome = [];

const catalogo = linhas
  .filter((linha) => linha.exibir === "SIM")
  .filter((linha) => {
    // Sem nome_paciente não há como listar o exame sem expor o nome interno.
    if (linha.nome_paciente) return true;
    semNome.push(`${linha.id} ${linha.nome_interno}`);
    return false;
  })
  .map((linha) => ({
    id: Number(linha.id),
    // Lista, não string: 274 linhas carregam mais de um código interno.
    codigos: linha.nome_interno
      .split("|")
      .map((codigo) => codigo.trim())
      .filter(Boolean),
    nomePaciente: linha.nome_paciente,
    modalidade: linha.modalidade,
    regiao: linha.regiao || null,
    contraste: CONTRASTE[linha.contraste] ?? null,
    lado: LADO[linha.lado] ?? null,
    detalhe: linha.detalhe || null,
    convenio: linha.convenio || null,
  }));

// ── Sinônimos ─────────────────────────────────────────────────────────────

const sinonimos = lerCsv("data/sinonimos.csv")
  .map((linha) => ({
    termo: linha.termo,
    canonico: linha.canonico,
    tipo: linha.tipo,
  }))
  // Os de mais palavras primeiro: "ressonancia magnetica" precisa ser trocado
  // antes que "ressonancia" consuma a primeira palavra sozinha.
  .sort((a, b) => b.termo.split(" ").length - a.termo.split(" ").length);

const grupos = new Set(catalogo.map((item) => item.nomePaciente)).size;
const multiplos = catalogo.filter((item) => item.codigos.length > 1).length;

console.log(`catálogo: ${escrever("catalogo-exames.json", catalogo)} exames em ${grupos} grupos`);
console.log(`sinônimos: ${escrever("sinonimos.json", sinonimos)} termos`);
console.log(`ocultos (exibir = NAO): ${ocultas.length}`);
// Não é erro: é uma decisão que a clínica ainda vai tomar linha a linha.
console.log(
  `com mais de um código interno (o agendamento usa o primeiro): ${multiplos}`,
);
if (semNome.length) {
  console.log(`sem nome_paciente, fora do site: ${semNome.join(" | ")}`);
}
