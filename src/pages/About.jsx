import { Calendar, Users, Award, Heart } from 'lucide-react';

const About = () => {
  const committeeMembers = [
    { name: 'Rajesh Kumar', role: 'President', image: '👨‍💼' },
    { name: 'Priya Sharma', role: 'Vice President', image: '👩‍💼' },
    { name: 'Amit Das', role: 'Secretary', image: '👨‍💼' },
    { name: 'Anjali Roy', role: 'Treasurer', image: '👩‍💼' },
  ];

  const upcomingEvents = [
    { date: 'Oct 15, 2024', event: 'Mahalaya', description: 'Beginning of Durga Puja season' },
    { date: 'Oct 20, 2024', event: 'Sasthi', description: 'First day of worship' },
    { date: 'Oct 21, 2024', event: 'Saptami', description: 'Second day of worship' },
    { date: 'Oct 22, 2024', event: 'Ashtami', description: 'Third day of worship' },
    { date: 'Oct 23, 2024', event: 'Navami', description: 'Fourth day of worship' },
    { date: 'Oct 24, 2024', event: 'Dashami', description: 'Visarjan - Immersion ceremony' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Our Community</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Celebrating the spirit of Durga Puja with devotion, tradition, and community unity for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                Anjali Connect was established with the vision of bringing together devotees and community members to celebrate the rich traditions of Durga Puja. Our mission is to:
              </p>
              <ul className="space-y-3">
                {[
                  'Organize grand and memorable Durga Puja celebrations',
                  'Preserve and promote Bengali cultural heritage',
                  'Foster community spirit and social bonding',
                  'Provide a platform for cultural and spiritual activities',
                  'Support charitable causes and community welfare'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Users />, title: '500+', subtitle: 'Members' },
                { icon: <Calendar />, title: '15+', subtitle: 'Years' },
                { icon: <Award />, title: '25+', subtitle: 'Events' },
                { icon: <Heart />, title: '₹10L+', subtitle: 'Raised' }
              ].map((stat, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="flex justify-center mb-3 text-primary-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.title}</div>
                  <div className="text-gray-600">{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Committee
            </h2>
            <p className="text-xl text-gray-600">
              Meet the dedicated team leading our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {committeeMembers.map((member, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Schedule Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              2024 Event Schedule
            </h2>
            <p className="text-xl text-gray-600">
              Mark your calendars for our upcoming celebrations
            </p>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="card p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-6">
                  <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-semibold min-w-[120px] text-center">
                    {event.date}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{event.event}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
                <Calendar className="text-primary-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-primary-100 mb-8">
            Have questions or want to learn more about our community? We'd love to hear from you!
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-primary-100">123 Durga Temple Road<br/>Kolkata, West Bengal 700001</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-primary-100">+91 98765 43210</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-primary-100">info@anjaliconnect.org</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
