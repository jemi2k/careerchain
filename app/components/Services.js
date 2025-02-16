const Services = () => {
  const services = [
    {
      icon: "bi-link-45deg",
      title: "Blockchain Security",
      desc: "Secure your career data and achievements with the power of decentralized blockchain technology.",
    },
    {
      icon: "bi-robot",
      title: "AI-Powered Recommendations",
      desc: "Get personalized career suggestions based on your skills, interests, and goals.",
    },
    {
      icon: "bi-award",
      title: "Verified Certifications",
      desc: "Earn blockchain-verified certifications to showcase your skills with credibility.",
    },
    {
      icon: "bi-people",
      title: "Career Networking",
      desc: "Connect with like-minded professionals and build valuable career relationships.",
    },
    {
      icon: "bi-graph-up",
      title: "Skill Growth Insights",
      desc: "Track your progress and receive guidance on which skills to improve for career success.",
    },
    {
      icon: "bi-wallet2",
      title: "Incentivized Learning",
      desc: "Earn rewards while learning new skills through a gamified, blockchain-powered system.",
    },
    {
      icon: "bi-briefcase",
      title: "Job Matching",
      desc: "Access job opportunities that match your profile and preferences using advanced AI algorithms.",
    },
    {
      icon: "bi-gear",
      title: "Customizable Profiles",
      desc: "Showcase your achievements and skills with a professional, blockchain-secured profile.",
    },
  ];

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="border-b-4 border-purple-500 w-16"></p>
        </div>

        {/* Services Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition duration-300">
              <i className={`bi ${service.icon} text-purple-700 text-5xl mb-4`}></i>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
