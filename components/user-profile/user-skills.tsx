import { Body, Heading2 } from "components/typography";
import { Skill } from "lib/airtable/skills";
import { unique } from "lib/utils";
import { useState } from "react";
import styled from "styled-components";

export type SkillBoxProps = {
  /** All available skills */
  allSkills: Skill[];
  /** IDs of the skills selected by user */
  userSkillIds: string[];
  /** Called when selected skills change */
  onChange: (skills: Skill[]) => void;
};

export const SkillBox: React.FC<SkillBoxProps> = ({
  userSkillIds,
  allSkills,
  onChange,
}) => {
  const userSkills = allSkills.filter((skill) =>
    userSkillIds.includes(skill.id)
  );
  const [selectedSkills, setSelectedSkills] = useState(userSkills);
  const fields = unique(allSkills.map((skill) => skill.field));

  const toggleSkill = (skill: Skill) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((other) => other.id !== skill.id)
      : [skill, ...selectedSkills];
    setSelectedSkills(newSkills);
    onChange(newSkills);
  };

  const skillsForField = (field: string) =>
    allSkills
      .filter((skill) => skill.field === field)
      .filter((skill) => skill.name !== "senior" && skill.name !== "mentor")
      .sort((a, b) => a.name.localeCompare(b.name));

  const hasSelectedSkills = (field: string) =>
    skillsForField(field).some((skill) => selectedSkills.includes(skill));

  const handleCheckboxClick = (
    type: "mentor" | "senior",
    field: string,
    checked: boolean
  ) => {
    const skill = allSkills.find((s) => s.name === type && s.field === field);
    if (skill) {
      const newSkills = checked
        ? unique([skill, ...selectedSkills])
        : selectedSkills.filter((other) => other.id !== skill.id);
      setSelectedSkills(newSkills);
      onChange(newSkills);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Body style={{ marginBottom: "20px" }}>
        Co chcete v Česko.Digital dělat? Dejte nám to vědět, ať vám můžeme
        různými kanály nabízet relevantnější příležitosti.
      </Body>

      {fields.map((field) => (
        <div key={field} style={{ marginBottom: "20px" }}>
          <Heading2
            style={{
              marginBottom: "20px",
              display: "inline-block",
              background: hasSelectedSkills(field) ? "#FFF6A3" : "inherit",
            }}
          >
            {field}
          </Heading2>
          <div style={{ lineHeight: "3ex", marginBottom: "10px" }}>
            {skillsForField(field).map((skill) => (
              <SkillPill
                key={skill.id}
                skill={skill}
                onClick={toggleSkill}
                checked={selectedSkills.some((s) => s.id === skill.id)}
              />
            ))}
          </div>
          <div style={{ marginBottom: "25px" }}>
            <Checkbox
              id={`${field}-senior`}
              label="Jsem seniorní"
              onChange={(checked) =>
                handleCheckboxClick("senior", field, checked)
              }
              checked={selectedSkills.some(
                (s) => s.name === "senior" && s.field === field
              )}
            />
            <Checkbox
              id={`${field}-mentor`}
              label="Můžu vést a mentorovat ostatní"
              onChange={(checked) =>
                handleCheckboxClick("mentor", field, checked)
              }
              checked={selectedSkills.some(
                (s) => s.name === "mentor" && s.field === field
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

type SkillPillProps = {
  skill: Skill;
  checked: boolean;
  onClick?: (skill: Skill) => void;
};

const SkillPill: React.FC<SkillPillProps> = ({
  skill,
  checked: checkedInitially,
  onClick = (sender: Skill) => {},
}) => {
  const [checked, setChecked] = useState(checkedInitially);
  const toggle = () => {
    setChecked(!checked);
    onClick(skill);
  };
  return (
    <AnimatedSpan
      onClick={toggle}
      style={{
        display: "inline-block",
        background: checked ? "blue" : "#eee",
        color: checked ? "white" : "black",
        padding: "1ex 2ex 1ex 2ex",
        borderRadius: "8px",
        marginRight: "2ex",
        marginBottom: "2ex",
        cursor: "pointer",
      }}
    >
      {skill.name}
    </AnimatedSpan>
  );
};

type CheckboxProps = {
  id: string;
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
}) => (
  <div>
    <input
      type="checkbox"
      id={id}
      defaultChecked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <label htmlFor={id} style={{ paddingLeft: "1ex" }}>
      {label}
    </label>
  </div>
);

const AnimatedSpan = styled.span`
  transition: transform 0.1s;
  &:active {
    transform: scale(0.9);
  }
`;
