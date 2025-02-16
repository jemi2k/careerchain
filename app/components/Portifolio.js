const Portfolio = () => {
  const projects = Array.from({ length: 6 }).map((_, i) => ({
    img: `/images/portfolio${i + 1}.jpg`,
    category: "Category",
    name: `Project Name ${i + 1}`,
  }));

  return (
    <section id="portfolio" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="relative group">
              <img
                src={project.img}
                alt={project.name}
                className="w-full h-64 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-sm">{project.category}</span>
                <h3 className="text-white text-lg font-bold">{project.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
