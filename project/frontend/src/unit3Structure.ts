export type Unit3SectionId = "getting-started" | "closer-look-1" | "closer-look-2" | "communication" | "skills-1" | "skills-2" | "looking-back" | "project" | "bonus";
export type Unit3Section = {
  id: Unit3SectionId;
  title: string;
  title_vi: string;
  lead_vi: string;
  objectives_vi: string[];
};

export type Unit3Structure = {
  unit_id: string;
  unit_number: 3;
  unit_title: string;
  unit_title_vi: string;
  source_status: "designed";
  source_note: string;
  sections: Unit3Section[];
};

export function validateUnit3Structure(data: Unit3Structure): Unit3Structure {
  if (data.unit_number !== 3 || data.unit_title !== "My Friends") throw new Error("Unexpected Unit 3 identity");
  if (data.source_status !== "designed") throw new Error("Unit guidance must be marked designed");
  if (data.sections.length !== 9) throw new Error("Unit 3 navigation needs exactly nine current major sections");
  const expected = new Set<Unit3SectionId>(["getting-started", "closer-look-1", "closer-look-2", "communication", "skills-1", "skills-2", "looking-back", "project", "bonus"]);
  for (const section of data.sections) {
    if (!expected.delete(section.id)) throw new Error(`Unexpected or duplicate section: ${section.id}`);
    if (!section.lead_vi.trim() || section.objectives_vi.length < 3 || section.objectives_vi.length > 4) throw new Error(`Invalid guidance for ${section.id}`);
    if (section.objectives_vi.some((objective) => !objective.trim())) throw new Error(`Empty objective for ${section.id}`);
  }
  return data;
}
