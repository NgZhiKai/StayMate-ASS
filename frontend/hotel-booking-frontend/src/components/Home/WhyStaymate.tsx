import React from "react";

const features = [
  {
    title: "Best Price Guarantee",
    desc: "We match the lowest price you can find anywhere.",
  },
  {
    title: "Secure Booking",
    desc: "Your payment and data are fully encrypted and protected.",
  },
  {
    title: "24/7 Support",
    desc: "We're here anytime, anywhere.",
  },
];

const WhyStaymate: React.FC = () => (
  <section className="max-w-7xl mx-auto px-6 py-20 text-center reveal">
    <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
      Why{" "}
      <span className="bg-gradient-to-r from-[#667eea] to-[#f093fb] bg-clip-text text-transparent">
        Staymate?
      </span>
    </h2>

    <p className="text-gray-500 text-lg mb-14 max-w-2xl mx-auto">
      We make booking your perfect stay simple, secure, and affordable.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {features.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 hover:-translate-y-2 transition duration-500"
        >
          <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyStaymate;