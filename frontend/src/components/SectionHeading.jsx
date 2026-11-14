export default function SectionHeading({ number, tag, title, children }) {
  return <div className="section-heading"><div><p className="section-label"><span>{number}</span> / {tag}</p><h2>{title}<span className="accent">.</span></h2></div>{children && <p>{children}</p>}</div>;
}

