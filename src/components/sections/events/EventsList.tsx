export default function EventsList() {
  const events = [
    {
      id: 1,
      title: "Industrial Manufacturing Expo 2026",
      date: "March 15-18, 2026",
      location: "New Delhi, India",
      description: "Exploring the latest in automation and precision tools.",
    },
    {
      id: 2,
      title: "Global Supply Chain Summit",
      date: "May 10-12, 2026",
      location: "Mumbai, India",
      description: "Networking with global leaders in industrial supply.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {event.title}
                  </h3>
                  <p className="text-blue-600 font-semibold">
                    {event.date} | {event.location}
                  </p>
                </div>
                <button className="mt-4 md:mt-0 bg-blue-900 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-800">
                  Register Now
                </button>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
