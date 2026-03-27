const testimonials = [
  {
    name: "Aisha",
    text: "Absolutely loved the bridal makeup. The look was elegant, soft and premium.",
  },
  {
    name: "Sara",
    text: "Very professional service and the makeup stayed flawless throughout the event.",
  },
  {
    name: "Zoya",
    text: "One of the best makeup experiences. The finishing and styling were just beautiful.",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-tag">Testimonials</p>
          <h2>What clients say about the experience</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p>"{item.text}"</p>
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;