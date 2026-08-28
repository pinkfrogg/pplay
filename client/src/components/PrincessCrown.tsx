type PrincessCrownProps = { className?: string };

/** A small three-point crown inspired by the Princess-and-the-Pauper shoulder tattoo reference. */
export default function PrincessCrown({ className = "" }: PrincessCrownProps) {
  return <svg className={`princess-crown ${className}`} viewBox="0 0 28 20" role="img" aria-label="Princess crown"><path d="M3.4 15.8c5-1.8 16.2-1.8 21.2 0l1.1-5.2c.2-1.1-.8-1.7-1.6-.9l-2.5 2.2-1.9-7.1c-.3-1.2-1.7-1.4-2.2-.3L14 10.2l-3.4-5.7c-.5-1.1-1.9-.9-2.2.3l-1.9 7.1-2.5-2.2c-.8-.8-1.8-.2-1.6.9l1 5.2Z" /><path className="princess-crown-band" d="M4.4 15.5c4.7-1.1 14.5-1.1 19.2 0" /></svg>;
}
