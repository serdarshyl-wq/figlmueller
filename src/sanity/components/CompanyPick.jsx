"use client";

import { useCallback } from "react";
import { Select } from "@sanity/ui";
import { set, unset, useFormValue } from "sanity";

/*
 * Which company a pass of the slider belongs to.
 *
 * A pass is not a company - it is the field of pictures that flies past one of
 * the companies written above it. So its title is not typed: it is taken from
 * that list, which is the only way the two stay the same. A name that is
 * already spoken for is offered greyed out, because a company passes once.
 *
 * It writes one string, its own, and reads everything else. Nothing here
 * touches the pictures or the list of companies.
 */
export function CompanyPick(props) {
  const { value = "", onChange, path, elementProps, readOnly } = props;

  const companies = useFormValue(["companies"]) || [];
  const passes = useFormValue(["passes"]) || [];

  /* ["passes", {_key}, "company"]: the pass this field is sitting in. */
  const mine = path.find((step) => step && step._key)?._key;
  const spoken = new Set(
    passes
      .filter((pass) => pass?._key !== mine)
      .map((pass) => pass?.company)
      .filter(Boolean)
  );

  const pick = useCallback(
    (event) => {
      const picked = event.currentTarget.value;
      onChange(picked ? set(picked) : unset());
    },
    [onChange]
  );

  /* A company that was renamed or removed after this pass was written. It is
     kept in the list so the pass still reads as something, and the field's own
     validation is what says it has to be picked again. */
  const orphaned = value && !companies.some((company) => company?.name === value);

  return (
    <Select
      {...elementProps}
      value={value}
      onChange={pick}
      disabled={readOnly}
    >
      <option value="">Pick one of the companies above</option>

      {companies.map((company, index) => {
        const name = company?.name;
        if (!name) return null;

        const taken = spoken.has(name) && name !== value;

        return (
          <option key={company._key || index} value={name} disabled={taken}>
            {taken ? `${name} - already has a pass` : name}
          </option>
        );
      })}

      {orphaned ? (
        <option value={value}>{value} - no longer a company</option>
      ) : null}
    </Select>
  );
}
