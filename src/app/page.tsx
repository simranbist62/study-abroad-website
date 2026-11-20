import Link from "next/link";

const steps = [
  ["01", "Plan your path", "Talk through your goals, budget and timeline with a counsellor."],
  ["02", "Choose your course", "Compare destinations and find a course that fits your plans."],
  ["03", "Apply with confidence", "Get practical guidance with applications and next steps."],
];

const destinations = ["United Kingdom", "Canada", "Australia", "United States", "Germany"];

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Your next chapter starts here</p>
        <h1>Make your study abroad plans feel possible.</h1>
        <p className="lead">Clear, personal guidance for choosing a destination, finding the right course and preparing your application.</p>
        <div className="acts">
          <Link className="btn" href="/book">Book a free session</Link>
          <Link className="btn o" href="/enquiry">Tell us about your plans</Link>
        </div>
        <p className="hero-note">Friendly advice, one step at a time.</p>
      </section>

      <section className="section" id="about">
        <div className="section-head" id="services"><p className="eyebrow">A clearer way forward</p><h2>From first idea to next step</h2></div>
        <div className="grid3">{steps.map(([number, title, description]) => <article className="card step" key={number}>
          <span className="step-number">{number}</span><h3>{title}</h3><p className="mu">{description}</p>
        </article>)}</div>
      </section>

      <section className="section destination-section" id="destinations">
        <div className="section-head"><p className="eyebrow">Explore your options</p><h2>Where could you study?</h2><p className="mu">Every destination has its own courses, costs and application timelines. We’ll help you compare them.</p></div>
        <div className="destination-list">{destinations.map((name) => <span className="destination-chip" key={name}>{name}</span>)}</div>
        <Link className="text-link" href="/enquiry">Ask us about destinations <span aria-hidden="true">→</span></Link>
      </section>

      <section className="cta section" id="stories">
        <span id="blog" />
        <div><p className="eyebrow">Start with a conversation</p><h2>You don’t need every answer yet.</h2><p className="mu">Share what you know so far. We’ll help you work out what comes next.</p></div>
        <div className="acts"><Link className="btn" href="/book">Book a free session</Link><Link className="btn o" href="/enquiry">Send an enquiry</Link></div>
      </section>
    </>
  );
}
