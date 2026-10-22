"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import ClosePill from "@/components/ui/ClosePill";
import ActionButton from "@/components/ui/ActionButton";
import { leaveAsSheet } from "@/lib/arrival";
import { afterFonts } from "@/lib/scrub";

/*
 * What a box is, as against what it is called.
 *
 * The name of a box is what the page is wired to: it is what tells a browser
 * to offer the reader's own address or telephone number, and what has an
 * address checked as an address. The studio writes what a box is called and
 * which of these it is; none of the wiring is typed there.
 */
const WIRING = {
  name: { type: "text", autoComplete: "name" },
  company: { type: "text", autoComplete: "organization" },
  designation: { type: "text", autoComplete: "organization-title" },
  email: { type: "email", autoComplete: "email" },
  phone: { type: "tel", autoComplete: "tel" },
  location: { type: "text", autoComplete: "off" },
};

const wiringFor = (name) => WIRING[name] ?? { type: "text" };

/* The sheet as it ships, and what every field falls back to. */
const SHIPPED = {
  headingWords: ["Project", "Enquiries"],
  steps: [
    {
      lead: "Tell us a little bit about yourself and we will get back to you as soon as we can",
      fields: [
        { name: "name", label: "Name" },
        { name: "company", label: "Company" },
        { name: "designation", label: "Designation" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
      ],
      action: "Next",
    },
    {
      lead: "Project details and technical requirements",
      fields: [{ name: "location", label: "Project location", optional: true }],
      action: "Submit",
    },
  ],
  enquiryLegend: "Enquiry type",
  enquiryTypes: [
    "Citrine® Machine",
    "Custom Machinery",
    "Automation and Control System",
    "Technical Partnership",
    "General Enquiry",
  ],
  messageLabel: "Technical requirement / message *",
  attachLabel: "Attach files",
  previousLabel: "Previous",
  requiredFault: "Is a required field",
  formatFault: "Is not a valid entry",
};

const TURN_MS = 400;
const PROBE_PX = 200;
const HEADING_FILL = 0.85;

const FIELD_TYPE =
  "font-display text-[clamp(0.85rem,1.05vw,1.2rem)] font-medium uppercase tracking-[0.06em]";

const SMALL_TYPE =
  "font-display text-[clamp(0.62rem,0.76vw,0.85rem)] font-medium uppercase tracking-[0.12em]";

function Fault({ id, children }) {
  return (
    <span
      id={id}
      className="absolute right-0 top-full mt-1.5 text-[clamp(0.65rem,0.72vw,0.85rem)] tracking-[0.02em] text-[#e12727]"
    >
      {children}
    </span>
  );
}

function FloatingLabel({ children, fault }) {
  return (
    <span
      className={`pointer-events-none absolute left-0 top-7 origin-left transition-[translate,scale,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:-translate-y-6 peer-focus:scale-[0.72] peer-not-placeholder-shown:-translate-y-6 peer-not-placeholder-shown:scale-[0.72] ${FIELD_TYPE} ${fault ? "text-[#e12727]" : "text-black/55 peer-focus:text-black/70"
        }`}
    >
      {children}
    </span>
  );
}

export default function ConnectPanel({ content }) {
  /* Written in the studio, or what the sheet ships with - field by field, so
     one left empty is the wording the page was built with. */
  const headingWords = content?.headingWords?.length
    ? content.headingWords
    : SHIPPED.headingWords;
  const steps = content?.steps?.length ? content.steps : SHIPPED.steps;
  const enquiryLegend = content?.enquiryLegend || SHIPPED.enquiryLegend;
  const enquiryTypes = content?.enquiryTypes?.length
    ? content.enquiryTypes
    : SHIPPED.enquiryTypes;
  const messageLabel = content?.messageLabel || SHIPPED.messageLabel;
  const attachLabel = content?.attachLabel || SHIPPED.attachLabel;
  const previousLabel = content?.previousLabel || SHIPPED.previousLabel;
  const requiredFault = content?.requiredFault || SHIPPED.requiredFault;
  const formatFault = content?.formatFault || SHIPPED.formatFault;

  const router = useRouter();
  const columnRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const turnRef = useRef(null);
  const [step, setStep] = useState(0);
  const [showing, setShowing] = useState(true);
  const [turning, setTurning] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [enquiry, setEnquiry] = useState(null);
  const [ink, setInk] = useState({ "--ink-x": "50%", "--ink-y": "50%" });
  const [files, setFiles] = useState([]);

  useEffect(() => () => window.clearTimeout(turnRef.current), []);

  useEffect(() => {
    const column = columnRef.current;
    const heading = headingRef.current;
    if (!column || !heading) return;

    const fit = () => {
      heading.style.fontSize = `${PROBE_PX}px`;

      const words = Array.from(heading.querySelectorAll(".connect-word"));
      const widest = words.reduce(
        (most, word) => Math.max(most, word.getBoundingClientRect().width),
        0
      );
      if (!widest) return;

      heading.style.fontSize = `${PROBE_PX * ((column.clientWidth * HEADING_FILL) / widest)
        }px`;
    };

    fit();
    afterFonts(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const clear = (name) =>
    setErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current
    );

  const turn = (next) => {
    const form = formRef.current;
    if (form) {
      const typed = {};
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") typed[key] = value;
      });
      setValues((current) => ({ ...current, ...typed }));
    }

    setErrors({});
    setTurning(true);
    setShowing(false);

    turnRef.current = window.setTimeout(() => {
      setStep(next);
      setShowing(true);
      turnRef.current = window.setTimeout(() => setTurning(false), TURN_MS);
    }, TURN_MS);
  };

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const faults = {};
    const check = (name) => {
      const input = form.elements[name];
      if (!input) return;
      if (!input.value.trim()) faults[name] = requiredFault;
      else if (!input.checkValidity()) faults[name] = formatFault;
    };

    steps[step].fields.forEach((field) => {
      if (!field.optional) check(field.name);
    });
    if (step === 1) check("message");

    setErrors(faults);

    const first = Object.keys(faults)[0];
    if (first) {
      form.elements[first]?.focus();
      return;
    }

    if (step === 0) {
      turn(1);
      return;
    }

  };

  const pick = (event, type) => {
    const box = event.currentTarget.getBoundingClientRect();
    setInk({
      "--ink-x": `${((event.clientX - box.left) / box.width) * 100}%`,
      "--ink-y": `${((event.clientY - box.top) / box.height) * 100}%`,
    });
    setEnquiry((current) => (current === type ? null : type));
  };

  const close = () => {
    leaveAsSheet();

    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const grow = (event) => {
    const box = event.currentTarget;
    box.style.height = "auto";
    box.style.height = `${box.scrollHeight}px`;
  };

  const current = steps[step];

  return (
    <div className="grid min-h-svh w-full grid-cols-1 md:grid-cols-2">
      <div className="connect-heading order-2 flex flex-col justify-end px-[3vw] pb-[6vh] md:order-1">
        <div ref={columnRef}>
          <h1
            ref={headingRef}
            className="font-display text-[10vw] font-medium uppercase leading-[0.9] tracking-[-0.035em]"
          >
            {headingWords.map((word) => (
              <span key={word} className="block">

                <span className="connect-word inline-block whitespace-nowrap">
                  {word}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div className="connect-form order-1 flex flex-col px-[3vw] pb-[6vh] pt-[4vh] md:order-2">
        <div className="connect-close flex justify-end">
          <ClosePill onClick={close} />
        </div>

        <div
          className={`flex flex-1 flex-col ${turning ? "transition-opacity ease-out" : ""
            } ${showing ? "opacity-100" : "opacity-0"}`}
          style={turning ? { transitionDuration: `${TURN_MS}ms` } : undefined}
        >
          <h2 className="connect-lead mt-[6vh] font-display text-[clamp(1.1rem,1.9vw,2.2rem)] font-medium uppercase leading-[1.18] tracking-[-0.01em]">
            {current.lead}
          </h2>

          <form
            ref={formRef}
            noValidate
            onSubmit={submit}
            className="connect-form-body mt-[7vh] flex flex-1 flex-col"
          >
            <div className="connect-fields flex flex-col gap-[3.4vh]">
              {current.fields.map((field) => {
                const fault = errors[field.name];

                const wiring = wiringFor(field.name);

                return (
                  <label key={field.name} className="relative block">
                    <input
                      name={field.name}
                      type={wiring.type}
                      autoComplete={wiring.autoComplete}
                      required={!field.optional}
                      placeholder=" "
                      defaultValue={values[field.name] ?? ""}
                      aria-invalid={fault ? "true" : undefined}
                      aria-describedby={
                        fault ? `${field.name}-fault` : undefined
                      }
                      onInput={() => clear(field.name)}
                      className={`peer w-full border-b bg-transparent pb-3 pt-7 outline-none transition-colors duration-300 ${FIELD_TYPE} ${fault
                          ? "border-[#e12727] text-[#e12727]"
                          : "border-black/25 text-black focus:border-black"
                        }`}
                    />

                    <FloatingLabel fault={fault}>
                      {field.label}
                      {field.optional ? "" : " *"}
                    </FloatingLabel>

                    {fault ? (
                      <Fault id={`${field.name}-fault`}>{fault}</Fault>
                    ) : null}
                  </label>
                );
              })}

              {step === 1 ? (
                <>
                  <fieldset className="pt-2">
                    <legend className={`${SMALL_TYPE} text-black/55`}>
                      {enquiryLegend}
                    </legend>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {enquiryTypes.map((type) => {
                        const chosen = enquiry === type;

                        return (
                          <button
                            key={type}
                            type="button"
                            aria-pressed={chosen}
                            onClick={(event) => pick(event, type)}
                            style={ink}
                            className={`pill-line relative isolate cursor-pointer rounded-full border border-transparent px-5 py-2.5 transition-[color,scale] duration-500 active:scale-[0.97] ${SMALL_TYPE} ${chosen ? "text-black" : "text-black/70 hover:text-black"
                              }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`pill-ink absolute inset-0 -z-10 rounded-full bg-black ${chosen ? "pill-ink-on" : ""
                                }`}
                            />

                            <span className="relative block overflow-hidden">
                              <span
                                className={`block transition-[translate] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${chosen ? "-translate-y-full" : ""
                                  }`}
                              >
                                {type}
                              </span>

                              <span
                                aria-hidden="true"
                                className={`absolute inset-0 block text-bone transition-[translate] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${chosen ? "" : "translate-y-full"
                                  }`}
                              >
                                {type}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <input type="hidden" name="enquiryType" value={enquiry ?? ""} />
                  </fieldset>

                  <label className="relative block">
                    <textarea
                      name="message"
                      rows={1}
                      required
                      placeholder=" "
                      defaultValue={values.message ?? ""}
                      ref={(box) => {
                        if (!box) return;
                        box.style.height = "auto";
                        box.style.height = `${box.scrollHeight}px`;
                      }}
                      onInput={(event) => {
                        clear("message");
                        grow(event);
                      }}
                      aria-invalid={errors.message ? "true" : undefined}
                      aria-describedby={
                        errors.message ? "message-fault" : undefined
                      }
                      className={`peer w-full resize-none overflow-hidden border-b bg-transparent pb-3 pt-7 leading-normal outline-none transition-colors duration-300 ${FIELD_TYPE} ${errors.message
                          ? "border-[#e12727] text-[#e12727]"
                          : "border-black/25 text-black focus:border-black"
                        }`}
                    />

                    <FloatingLabel fault={errors.message}>
                      {messageLabel}
                    </FloatingLabel>

                    {errors.message ? (
                      <Fault id="message-fault">{errors.message}</Fault>
                    ) : null}
                  </label>

                  <label className="group inline-flex w-fit cursor-pointer items-center gap-3 pt-2 text-black/60 transition-colors duration-300 hover:text-black">
                    <Paperclip
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 -rotate-45"
                    />

                    <span className={SMALL_TYPE}>
                      {files.length
                        ? files.join(", ")
                        : attachLabel}
                    </span>

                    <input
                      type="file"
                      name="documents"
                      multiple
                      className="hidden"
                      onChange={(event) =>
                        setFiles(
                          Array.from(event.currentTarget.files ?? []).map(
                            (file) => file.name
                          )
                        )
                      }
                    />
                  </label>
                </>
              ) : null}
            </div>

            <div className="connect-actions mt-auto flex items-center justify-between gap-6 pt-[6vh]">

              <ActionButton
                onClick={() => turn(step - 1)}
                aria-hidden={step === 0 ? "true" : undefined}
                tabIndex={step === 0 ? -1 : undefined}
                className={`cursor-pointer ${step === 0 ? "invisible" : ""
                  }`}
              >
                {previousLabel}
              </ActionButton>

              <ActionButton type="submit" className="cursor-pointer">
                {current.action}
              </ActionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
