const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] text-white pt-28 pb-32 px-6 mb-10">
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
        Manage{" "}
        <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
          Users
        </span>
      </h1>
      <p className="text-lg sm:text-xl font-light opacity-90 max-w-2xl">
        Add, edit and manage admins and users efficiently.
      </p>
    </div>
  </section>
);

export default HeroSection;