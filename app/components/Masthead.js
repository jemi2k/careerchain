import Link from "next/link";

const Hero = () => {
  return (
    <header className="text-center mt-44 px-6 md:px-20 w-[90vw] md:w-[80vw] mx-auto">
      <div className="flex flex-col gap-4 items-center">
        {/* Main Heading */}
        <div className="text-5xl md:text-6xl font-bold text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Discover your ideal</h1>
         <div className="flex flex-col items-center gap-4 mt-3">
            <h1 className="text-3xl md:text-4xl font-bold ">Career</h1>
            <p className=" border-b-4 border-purple-500 w-16"></p>
        </div>
        </div>

        {/* Subtext */}
        <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-3xl">
          Take control of your career journey with personalized guidance, AI-powered recommendations, and blockchain security.
        </p>

        {/* Call-to-Action Button */}
        <Link
          href="#about"
          className="inline-block rounded-xl mt-6 px-8 py-3 bg-purple-600 text-white font-medium rounded-full shadow hover:opacity-90 transition-all duration-300"
        >
          FIND OUT MORE
        </Link>
      </div>
    </header>
  );
};

export default Hero;
