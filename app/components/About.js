const About = () => {
  return (
    <section id="about" className="bg-purple-500 text-white py-16 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">We’ve Got What You Need!</h2>
        <p className="mt-4 text-lg">
          CareerChain has everything you need to get your career on the right path!
        </p>
        <a
          href="#services"
          className="mt-6 inline-block px-6 py-3 bg-white text-black rounded-full font-bold shadow hover:bg-gray-100 transition"
        >
            GET STARTED!
        </a>
      </div>
    </section>
  );
};

export default About;
