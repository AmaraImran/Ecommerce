export default function Hero() {
  return (
    <section className="w-full bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between py-20">

        {/* LEFT TEXT */}
        <div className="md:w-1/2 space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
            Unleash Innovation <br /> in Every Byte.
          </h1>

          <p className="text-gray-600 text-lg">
            Explore a World of Cutting-Edge Tech
          </p>

          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-purple-700 transition">
            Shop now
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src="https://www.vecteezy.com/png/26751265-woman-red-dress-waving-flying-silk-fabric-beauty-model-generative-ai"
            alt="hero product"
            className="w-[350px] md:w-[450px] drop-shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}
