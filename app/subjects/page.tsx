/* app/subjects/page.tsx */

const subjects = [
  {
    id: "fullstack",
    title: "Full-Stack Development Masterclass",
    description:
      "Complete development roadmap covering frontend, backend, databases, and deployment.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    link: "/subjects/fullstack"
  },
  {
    id: "systemdesign",
    title: "System Design Fundamentals",
    description:
      "Learn to design scalable distributed systems with real-world examples.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    link: "/subjects/systemdesign"
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description:
      "Master DSA concepts essential for technical interviews and problem-solving.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    link: "/subjects/dsa"
  }
];

export default function SubjectsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Your Subjects</h1>
      <p className="text-gray-500 mb-8">
        Select a subject to continue learning.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={subject.image}
              alt={subject.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5">
              <h2 className="font-semibold text-lg mb-2">
                {subject.title}
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                {subject.description}
              </p>

              <a
                href={subject.link}
                className="text-blue-600 font-medium hover:underline"
              >
                Continue Learning →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
