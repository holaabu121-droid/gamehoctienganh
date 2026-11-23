export type RawWordWeb = {
  target: string;
  adjectives: string[];
};

export type WordWebRelation = {
  id: string;
  adjective: string;
  phrase: string;
  translation: string;
};

export type WordWeb = {
  id: string;
  target: string;
  targetSpeech: string;
  relations: WordWebRelation[];
};

export type WordWebProgress = {
  discovered: number;
  total: number;
  complete: boolean;
};

export type WordWebQuestion = { id: string; relation: WordWebRelation; options: WordWebRelation[] };

const TRANSLATIONS: Record<string, Record<string, string>> = {
  hair: { long: "tóc dài", short: "tóc ngắn", blonde: "tóc vàng", curly: "tóc xoăn", black: "tóc đen", straight: "tóc thẳng" },
  eyes: { big: "đôi mắt to", small: "đôi mắt nhỏ", brown: "mắt nâu", blue: "mắt xanh", black: "mắt đen" },
  nose: { big: "mũi to", small: "mũi nhỏ", straight: "mũi thẳng", flat: "mũi tẹt" },
  arms: { long: "cánh tay dài", short: "cánh tay ngắn" },
  legs: { long: "chân dài", short: "chân ngắn" },
};

export function makeDescriptionPhrase(target: string, adjective: string): string {
  return `${adjective} ${target}`;
}

export function getDescriptionTranslation(target: string, adjective: string): string {
  const translation = TRANSLATIONS[target]?.[adjective];
  if (!translation) throw new Error(`Missing translation for ${adjective} ${target}`);
  return translation;
}

export function buildWordWebs(rawWebs: readonly RawWordWeb[]): WordWeb[] {
  const expandedWebs = rawWebs.flatMap((raw) =>
    raw.target === "arms/legs"
      ? ["arms", "legs"].map((target) => ({ target, adjectives: [...raw.adjectives] }))
      : [{ target: raw.target, adjectives: [...raw.adjectives] }],
  );

  return expandedWebs.map((raw, webIndex) => ({
    id: `web-${webIndex}-${raw.target.replace(/[^a-z]+/gi, "-")}`,
    target: raw.target,
    targetSpeech: raw.target,
    relations: raw.adjectives.map((adjective, relationIndex) => ({
      id: `web-${webIndex}-relation-${relationIndex}`,
      adjective,
      phrase: makeDescriptionPhrase(raw.target, adjective),
      translation: getDescriptionTranslation(raw.target, adjective),
    })),
  }));
}

export function getWordWebProgress(
  webs: readonly WordWeb[],
  discoveredIds: ReadonlySet<string>,
): WordWebProgress {
  const relationIds = new Set(webs.flatMap((web) => web.relations.map(({ id }) => id)));
  const discovered = [...discoveredIds].filter((id) => relationIds.has(id)).length;
  return {
    discovered,
    total: relationIds.size,
    complete: relationIds.size > 0 && discovered === relationIds.size,
  };
}

export function getNetworkReplayPhrases(web: WordWeb): string[] {
  return [web.targetSpeech, ...web.relations.map(({ phrase }) => phrase)];
}

export function buildWordWebQuestions(webs: readonly WordWeb[], count = 10): WordWebQuestion[] {
  const relations = webs.flatMap(({ relations }) => relations);
  if (relations.length < count || count < 1) throw new Error("Word Webs needs enough relations for the requested questions");
  return relations.slice(0, count).map((relation, index) => {
    const options = [relation];
    for (let offset = 1; options.length < 4; offset += 1) {
      const candidate = relations[(index + offset * 3) % relations.length];
      if (!options.some(({ id }) => id === candidate.id)) options.push(candidate);
    }
    return { id: `word-web-question-${index + 1}`, relation, options: [options[1], options[3], relation, options[2]] };
  });
}
