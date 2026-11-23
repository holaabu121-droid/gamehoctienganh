export type BodyPoint = {
  x: number;
  y: number;
  labelX: number;
  labelY: number;
};

export type BodyLabQuestion = {
  id: number;
  answer: string;
  options: string[];
  point: BodyPoint;
};

export const BODY_PART_POINTS: Readonly<Record<string, BodyPoint>> = {
  hair: { x: 160, y: 48, labelX: 245, labelY: 45 },
  eye: { x: 143, y: 88, labelX: 65, labelY: 74 },
  nose: { x: 160, y: 105, labelX: 245, labelY: 98 },
  cheek: { x: 188, y: 108, labelX: 245, labelY: 130 },
  mouth: { x: 160, y: 128, labelX: 65, labelY: 122 },
  shoulder: { x: 112, y: 180, labelX: 55, labelY: 175 },
  arm: { x: 82, y: 245, labelX: 45, labelY: 235 },
  hand: { x: 60, y: 324, labelX: 45, labelY: 318 },
  leg: { x: 135, y: 405, labelX: 70, labelY: 400 },
  foot: { x: 125, y: 490, labelX: 65, labelY: 486 },
};

export function createBodyLabQuestions(
  rawParts: readonly string[],
  points: Readonly<Record<string, BodyPoint>> = BODY_PART_POINTS,
): BodyLabQuestion[] {
  if (rawParts.length < 4) throw new Error("Body Lab needs at least four body parts");
  if (new Set(rawParts).size !== rawParts.length) throw new Error("Body Lab body parts must be unique");

  const missing = rawParts.filter((part) => !points[part]);
  if (missing.length > 0) throw new Error(`Missing body positions: ${missing.join(", ")}`);

  return rawParts.map((answer, index) => {
    const distractors: string[] = [];
    for (let offset = 1; distractors.length < 3; offset += 1) {
      const candidate = rawParts[(index + offset) % rawParts.length];
      if (candidate !== answer && !distractors.includes(candidate)) distractors.push(candidate);
    }
    const options = [...distractors];
    options.splice(index % 4, 0, answer);
    return { id: index + 1, answer, options, point: points[answer] };
  });
}
