import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createServer } from 'vite';

const outputRootArg = process.argv[2];
if (!outputRootArg) {
  throw new Error('Usage: npm run audit:community -- <generated-sheets-directory>');
}

const outputRoot = path.resolve(outputRootArg);
const reportsDirectory = path.join(outputRoot, 'reports');
const resultsPath = path.join(reportsDirectory, 'resultados-detalhados.json');
const vite = await createServer({
  root: process.cwd(),
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

const formatDelta = (value) => `${value >= 0 ? '+' : ''}${value}`;
const markdownText = (value) => String(value).replaceAll('|', '\\|');
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

function countFeatureFallbacks(power) {
  const components = [
    ...power.components,
    ...power.alternateEffects.flatMap((alternateEffect) => alternateEffect.components),
  ];
  return components.filter((component) => component.effectId === 'feature').length;
}

function isStandaloneImperviousNotation(power) {
  if (!/impervious toughness/i.test(power.name)) return false;
  if (!/original notation:\s*impervious toughness\s+\d+/i.test(power.notes ?? '')) return false;
  if (power.components.length !== 1 || power.alternateEffects.length !== 0) return false;

  return power.components[0].modifiers.length === 0;
}

function promoteStandaloneImpervious(power) {
  if (!isStandaloneImperviousNotation(power)) return false;

  const [component] = power.components;
  if (component.effectId !== 'feature') return false;

  component.effectId = 'impervious-resistance';
  component.fieldValues = { ...component.fieldValues, resistance: 'toughness' };
  return true;
}

function isStructuredStandaloneImpervious(power) {
  return isStandaloneImperviousNotation(power)
    && power.components[0].effectId === 'impervious-resistance'
    && power.components[0].fieldValues?.resistance === 'toughness';
}

function resultStatus(result) {
  const sourceTotal = result.sourceParsedTotal;
  const appTotal = result.calculated.total;
  if (sourceTotal === null || sourceTotal === undefined) {
    return appTotal === result.nominalPP
      ? 'OK PARCIAL — fonte incompleta'
      : 'REVISÃO — fonte incompleta';
  }
  if (appTotal === sourceTotal) {
    return appTotal === result.nominalPP ? 'OK' : 'FONTE FORA DO ORÇAMENTO';
  }
  return appTotal === result.nominalPP
    ? 'APP NO ORÇAMENTO; DIFERE DA FONTE'
    : 'DIVERGÊNCIA APP × FONTE';
}

function buildCsv(results) {
  const rows = [[
    'Categoria', 'Personagem', 'PP nominal', 'PP app', 'Delta', 'Abilities',
    'Defenses', 'Skills', 'Advantages', 'Powers', 'Soma fonte', 'Alertas',
  ]];
  for (const result of results) {
    rows.push([
      result.category,
      result.character,
      result.nominalPP,
      result.calculated.total,
      result.calculated.total - result.nominalPP,
      result.calculated.abilities,
      result.calculated.defenses,
      result.calculated.skills,
      result.calculated.advantages,
      result.calculated.powers,
      result.sourceParsedTotal ?? '',
      result.warnings.length + result.validationErrors.length,
    ]);
  }
  return `${rows.map((row) => row.map(csvCell).join(';')).join('\n')}\n`;
}

function buildReport(results, structuralImperviousCount) {
  const complete = results.filter((result) => result.sourceParsedTotal !== null && result.sourceParsedTotal !== undefined);
  const exactBudget = results.filter((result) => result.calculated.total === result.nominalPP).length;
  const appSourceMatches = complete.filter((result) => result.calculated.total === result.sourceParsedTotal).length;
  const sourceBudgetMatches = complete.filter((result) => result.sourceParsedTotal === result.nominalPP).length;
  const allMatch = complete.filter((result) =>
    result.calculated.total === result.sourceParsedTotal
    && result.calculated.total === result.nominalPP
  ).length;
  const unresolvedFallbacks = results.reduce((total, result) =>
    total + result.powers.reduce((powerTotal, power) => powerTotal + power.fallbackCount, 0), 0);
  const structurallyValid = results.filter((result) => result.validationErrors.length === 0).length;
  const appSourceDivergences = complete.length - appSourceMatches;

  const lines = [
    '# Auditoria de PP — fichas da comunidade',
    '',
    `Recalculado em 2026-08-30 a partir de ${results.length} fichas JSON. Todos os custos do lado “app” usam \`calculateCharacterPointSummary()\`, o mesmo motor central da ficha, Power Builder, PDF e planilha na v1.11.0 (revisão de cálculo 4).`,
    '',
    '## Resultado executivo',
    '',
    `- ${structurallyValid}/${results.length} JSONs passaram na validação estrutural e semântica.`,
    `- ${exactBudget}/${results.length} chegaram exatamente ao orçamento nominal indicado pela ficha.`,
    `- ${complete.length}/${results.length} tinham custos publicados suficientes para reconstruir uma soma independente.`,
    `- ${appSourceMatches}/${complete.length} fichas completas tiveram concordância entre o motor corrigido e a soma publicada.`,
    `- ${sourceBudgetMatches}/${complete.length} fontes completas somam o orçamento nominal pela própria notação; em ${allMatch} casos fonte, app e orçamento concordam simultaneamente.`,
    `- ${structuralImperviousCount} usos inequívocos de “Impervious Toughness” estão representados pelo efeito estrutural Impervious Resistance; restam ${unresolvedFallbacks} trechos preservados como Feature.`,
    '',
    'Uma diferença no total não prova sozinha que a ficha-fonte ou o app está errado. Ela pode vir de custo omitido na fonte, shorthand ambíguo, estrutura composta achatada na conversão ou diferença real na regra. Os detalhes abaixo mantêm essas situações separadas.',
    '',
    '## Conclusões priorizadas',
    '',
    '### Correções implementadas e cobertas por regressão',
    '',
    '- Affliction agora custa sempre 1 PP/rank; os graus representam resultados de falha, não faixas de custo.',
    '- Increased Mass de Teleport cobra todos os ranks comprados.',
    '- Action de Variable distingue Move (+1/rank), Free (+2/rank) e Reaction (+3/rank), inclusive nos JSONs legados que codificavam a opção por ranks.',
    '- Modificadores per-rank só multiplicam aplicações quando a definição declara que são repetíveis.',
    '- Impervious comprado diretamente sobre uma resistência possui representação própria de 1 PP/rank e não aumenta o valor da defesa.',
    '- Cada habilidade ausente custa −10 PP e contribui com rank efetivo 0 para perícias, defesas e ataques.',
    '- Increased Duration é uma aplicação única: Instant vira Concentration e Sustained vira Continuous.',
    '',
    '### Divergências remanescentes exigem revisão da ficha, não ajuste cego do motor',
    '',
    `${appSourceDivergences} das ${complete.length} fichas completas ainda divergem da soma publicada. Parte dessas diferenças vem de custos escritos que não correspondem aos próprios efeitos/modifiers listados ou de decisões de construção que dependem do mestre.`,
    '',
    '### Muitas fontes já estão fora do orçamento nominal',
    '',
    `Somente ${sourceBudgetMatches}/${complete.length} fontes completas somam o orçamento nominal por sua própria notação. Quando o app reproduz essa soma, o relatório classifica o caso como “FONTE FORA DO ORÇAMENTO”, não como erro do motor.`,
    '',
    '## Metodologia',
    '',
    '1. Leitura de cada JSON importável e validação pelo schema e catálogo semântico atuais.',
    '2. Cálculo de abilities, defesas, perícias, vantagens e poderes pelo motor central.',
    '3. Recalculo independente de cada power para localizar a origem de diferenças.',
    '4. Comparação com o orçamento nominal e com a soma publicada já transcrita.',
    '',
    '## Legenda do breakdown',
    '',
    '`Abilities/Defenses/Skills/Advantages/Powers`. Equipment Points não entram novamente no total de PP: eles são limitados pelos ranks da vantagem Equipment.',
    '',
    '## Panorama completo',
    '',
    '| Categoria | Personagem | PP nominal | PP app | Δ orçamento | Soma fonte | Δ app×fonte | A/D/S/Adv/Pow | Status |',
    '|---|---|---:|---:|---:|---:|---:|---:|---|',
  ];

  for (const result of results) {
    const sourceTotal = result.sourceParsedTotal;
    const sourceLabel = sourceTotal ?? 'incompleto';
    const appSourceDelta = sourceTotal === null || sourceTotal === undefined
      ? '—'
      : formatDelta(result.calculated.total - sourceTotal);
    const breakdown = [
      result.calculated.abilities,
      result.calculated.defenses,
      result.calculated.skills,
      result.calculated.advantages,
      result.calculated.powers,
    ].join('/');
    lines.push(`| ${markdownText(result.category)} | [${markdownText(result.character)}](../${result.jsonPath}) | ${result.nominalPP} | ${result.calculated.total} | ${formatDelta(result.calculated.total - result.nominalPP)} | ${sourceLabel} | ${appSourceDelta} | ${breakdown} | ${resultStatus(result)} |`);
  }

  lines.push(
    '',
    '## Limitações conhecidas desta conversão',
    '',
    '- Fichas sem custos individuais completos continuam inconclusivas para comparação independente.',
    '- Dispositivos com vários arrays internos foram achatados em um único power container. O custo é preservado, mas parte da hierarquia visual original não é recuperável automaticamente.',
    '- Quando a fonte omite rank ou parâmetro obrigatório, a conversão usa o mínimo estrutural e mantém um alerta.',
    '- Features restantes preservam literalmente notações sem equivalente inequívoco; elas não devem ser convertidas automaticamente sem revisão das fichas.',
    '',
    '## Detalhes por personagem',
  );

  for (const result of results) {
    const sourceTotal = result.sourceParsedTotal;
    const interestingPowers = result.powers.filter((power) => power.delta !== 0 || power.fallbackCount > 0);
    lines.push(
      '',
      `### ${markdownText(result.category)} / ${markdownText(result.character)}`,
      '',
      `- Fonte: \`${result.sourcePath}\``,
      `- JSON: [abrir ficha](../${result.jsonPath})`,
      `- PP nominal: ${result.nominalPP}; PP calculado pelo app: ${result.calculated.total}; saldo: ${result.calculated.remaining}.`,
      `- Breakdown central: Abilities ${result.calculated.abilities}, Defenses ${result.calculated.defenses}, Skills ${result.calculated.skills}, Advantages ${result.calculated.advantages}, Powers ${result.calculated.powers}.`,
      sourceTotal === null || sourceTotal === undefined
        ? '- Soma independente da notação publicada: incompleta.'
        : `- Soma reconstruída da notação publicada: ${sourceTotal}.`,
      `- Validação estrutural/semântica: ${result.validationErrors.length === 0 ? 'aprovada' : 'reprovada'}.`,
      '',
      'Diferenças de poderes:',
      '',
    );

    if (interestingPowers.length === 0) {
      lines.push('- Nenhuma diferença por power com custo publicado.');
    } else {
      for (const power of interestingPowers) {
        const sourceExpected = power.sourceExpected ?? 'incompleto';
        const fallback = power.fallbackCount > 0
          ? `; ${power.fallbackCount} trecho(s) preservado(s) como Feature`
          : '';
        lines.push(`- ${markdownText(power.name)}: fonte ${sourceExpected} PP; app ${power.appCalculated} PP; diferença ${formatDelta(power.delta)}${fallback}.`);
      }
    }

    lines.push('', 'Alertas de transcrição:', '');
    if (result.warnings.length === 0) {
      lines.push('- Nenhum alerta de transcrição.');
    } else {
      lines.push(...result.warnings.map((warning) => `- ${markdownText(warning)}`));
    }
    if (result.validationErrors.length > 0) {
      lines.push(...result.validationErrors.map((error) => `- ERRO: ${markdownText(error)}`));
    }
  }

  return `${lines.join('\n')}\n`;
}

try {
  const [pointSummaryModule, gameDataModule, schemasModule, validationModule, normalizeModule] = await Promise.all([
    vite.ssrLoadModule('/src/shared/lib/pointSummary.ts'),
    vite.ssrLoadModule('/src/entities/gameDataLoaders.ts'),
    vite.ssrLoadModule('/src/entities/schemas.ts'),
    vite.ssrLoadModule('/src/shared/lib/semanticValidation.ts'),
    vite.ssrLoadModule('/src/services/character-file/normalizeCharacter.ts'),
  ]);
  const results = JSON.parse(await fs.readFile(resultsPath, 'utf8'));
  let promotedThisRun = 0;
  let structuralImperviousCount = 0;

  for (const result of results) {
    const characterPath = path.join(outputRoot, result.jsonPath);
    const characterFile = JSON.parse(await fs.readFile(characterPath, 'utf8'));
    let characterPromoted = false;
    for (const power of characterFile.character.powers) {
      if (promoteStandaloneImpervious(power)) {
        promotedThisRun += 1;
        characterPromoted = true;
      }
      if (isStructuredStandaloneImpervious(power)) structuralImperviousCount += 1;
    }

    const schemaResult = schemasModule.CharacterFileSchema.safeParse(characterFile);
    const validationErrors = schemaResult.success
      ? []
      : schemaResult.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    const character = normalizeModule.normalizeCharacter(characterFile.character);
    const semanticErrors = validationModule.validateCharacterSemantics(character, {
      powerDefs: gameDataModule.POWER_DEFS,
      modifierDefs: gameDataModule.MODIFIER_DEFS,
      skillDefs: gameDataModule.SKILL_DEFS,
      advantageDefs: gameDataModule.ADVANTAGE_DEFS,
    }).filter((issue) => issue.severity === 'error');
    validationErrors.push(...semanticErrors.map((issue) => `${issue.path}: ${issue.message}`));

    const summary = pointSummaryModule.calculateCharacterPointSummary(
      character,
      [],
      gameDataModule.POWER_DEFS,
      gameDataModule.MODIFIER_DEFS,
    );
    if (result.powers.length !== character.powers.length) {
      throw new Error(`${result.character}: report has ${result.powers.length} powers, JSON has ${character.powers.length}`);
    }

    result.calculated = {
      abilities: summary.abilitiesCost,
      defenses: summary.defensesCost,
      skills: summary.skillsCost,
      advantages: summary.advantagesCost,
      powers: summary.powersCost,
      total: summary.totalSpent,
      available: summary.totalAvailable,
      remaining: summary.remaining,
      equipmentEPUsed: summary.totalEPUsed,
      equipmentEPLimit: summary.equipmentEPLimit,
    };
    result.validationErrors = validationErrors;
    result.powers = result.powers.map((powerResult, index) => {
      const power = character.powers[index];
      const appCalculated = summary.powerPricing[index].total;
      return {
        ...powerResult,
        appCalculated,
        delta: powerResult.sourceExpected === null || powerResult.sourceExpected === undefined
          ? 0
          : appCalculated - powerResult.sourceExpected,
        fallbackCount: countFeatureFallbacks(power),
      };
    });

    if (characterPromoted) {
      await fs.writeFile(characterPath, `${JSON.stringify(characterFile, null, 2)}\n`, 'utf8');
    }
  }

  await fs.writeFile(resultsPath, `${JSON.stringify(results, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(reportsDirectory, 'resumo.csv'), buildCsv(results), 'utf8');
  await fs.writeFile(
    path.join(reportsDirectory, 'RELATORIO-AUDITORIA-PP.md'),
    buildReport(results, structuralImperviousCount),
    'utf8',
  );
  await fs.writeFile(
    path.join(outputRoot, 'README.md'),
    `# MM3e Character Builder Sheets\n\nConversão de ${results.length} fichas para o formato JSON importável do MM3e Builder v1.11.0, recalculada com a revisão de cálculo 4.\n\n- \`characters/\`: fichas organizadas pelas categorias originais.\n- \`reports/RELATORIO-AUDITORIA-PP.md\`: relatório humano completo.\n- \`reports/resultados-detalhados.json\`: dados da auditoria para processamento.\n- \`reports/resumo.csv\`: panorama compacto para planilha.\n\nCada JSON preserva a notação-fonte completa em Notes. Importe uma ficha individual pela ação Import da aba de personagens.\n`,
    'utf8',
  );

  console.log(`Recalculated ${results.length} character sheets; ${structuralImperviousCount} structured Impervious entries (${promotedThisRun} promoted this run).`);
} finally {
  await vite.close();
}
