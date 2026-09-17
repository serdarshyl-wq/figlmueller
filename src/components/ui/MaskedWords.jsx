/**
 * @param {object} props
 * @param {string} props.text
 * @param {string} [props.wordClassName] - hook for the GSAP selector.
 */
export default function MaskedWords({ text, wordClassName = "reveal-word" }) {
  const words = text.trim().split(/\s+/);

  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className={`mb-[-0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom ${index < words.length - 1 ? "mr-[0.24em]" : ""
        }`}
    >
      <span className={`inline-block will-change-transform ${wordClassName}`}>
        {word}
      </span>
    </span>
  ));
}
