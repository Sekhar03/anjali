import { Link } from 'react-router-dom';
import { Calendar, Users, Heart, Image } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: 'Join Our Sangha',
      description: 'Become a devotee and be part of our sacred Durga Puja celebration community.',
      link: '/register',
      linkText: 'Register',
      emoji: '🙏',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Offer Dakshina',
      description: 'Your sacred offerings help us organize divine celebrations and community seva.',
      link: '/payments',
      linkText: 'Contribute',
      emoji: '🪔',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Darshan Gallery',
      description: 'Experience divine moments from our previous Durga Puja celebrations.',
      link: '/gallery',
      linkText: 'View',
      emoji: '📿',
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Puja Calendar',
      description: 'Stay updated with our upcoming pujas, aartis, and celebration schedules.',
      link: '/about',
      linkText: 'Explore',
      emoji: '🌺',
      color: 'from-pink-500 to-red-600'
    }
  ];

  return (
    <div>
      {/* Hero Section - Devotional Theme */}
      <section className="relative bg-gradient-to-br from-devotional-maroon via-devotional-crimson to-devotional-saffron text-white overflow-hidden">
        {/* Traditional Border Pattern */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-devotional-gold via-devotional-amber to-devotional-gold"></div>
        
        {/* Mandala Background Pattern */}
        <div className="absolute inset-0 bg-mandala opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40 relative z-20">
          <div className="text-center">
            {/* Decorative Diya Symbol */}
            <div className="text-6xl mb-4 animate-pulse">🪔</div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
              <span className="text-devotional-gold">॥</span> Anjali Connect <span className="text-devotional-gold">॥</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-2 text-devotional-amber font-semibold">
              जय माँ दुर्गे
            </p>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-amber-50 max-w-3xl mx-auto">
              Your Sacred Digital Hub for Durga Puja Community
            </p>
            
            {/* Decorative Lotus Border */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-3xl">🌺</span>
              <div className="h-px w-20 bg-devotional-gold"></div>
              <span className="text-4xl">🕉️</span>
              <div className="h-px w-20 bg-devotional-gold"></div>
              <span className="text-3xl">🌺</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center max-w-2xl mx-auto relative z-30">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-block bg-devotional-gold text-devotional-maroon px-10 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-devotional-amber hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-double border-devotional-amber text-center cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                🙏 Join Our Sangha
              </Link>
              <Link 
                to="/payments" 
                className="w-full sm:w-auto inline-block bg-white text-devotional-maroon px-10 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-double border-devotional-gold text-center cursor-pointer"
                style={{ pointerEvents: 'auto' }}
              >
                🪔 Offer Dakshina
              </Link>
            </div>
          </div>
        </div>
        
        {/* Traditional Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-devotional-gold via-devotional-amber to-devotional-gold pointer-events-none" style={{ zIndex: 1 }}></div>
      </section>

      {/* Features Grid - Devotional Cards */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-5xl mb-4">🕉️</div>
            <h2 className="text-4xl font-bold text-devotional-maroon mb-4">
              Ways to Participate
            </h2>
            <p className="text-xl text-gray-700">
              Join us in celebrating the divine presence of Maa Durga
            </p>
            <div className="flex justify-center mt-4">
              <div className="h-1 w-32 bg-gradient-to-r from-devotional-saffron via-devotional-gold to-devotional-saffron rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 border-double border-devotional-gold bg-white relative overflow-hidden"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-devotional-gold to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-devotional-saffron to-transparent opacity-30"></div>
                
                <div className="flex justify-center mb-4 text-6xl drop-shadow-lg">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-devotional-maroon mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-6 text-center text-sm">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className={`block text-center bg-gradient-to-r ${feature.color} text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  {feature.linkText} ✨
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Sacred Numbers */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mandala opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-devotional-maroon mb-2">Our Sacred Community</h2>
            <div className="flex justify-center">
              <div className="h-1 w-24 bg-devotional-gold rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-devotional-saffron">
              <div className="text-6xl mb-4">🙏</div>
              <div className="text-5xl font-bold text-devotional-maroon mb-2">500+</div>
              <div className="text-xl text-devotional-crimson font-semibold">Devotees</div>
              <div className="text-sm text-gray-600 mt-2">Blessed Sangha Members</div>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-red-100 via-orange-50 to-red-100 hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-devotional-crimson">
              <div className="text-6xl mb-4">🪔</div>
              <div className="text-5xl font-bold text-devotional-maroon mb-2">15+</div>
              <div className="text-xl text-devotional-crimson font-semibold">Years</div>
              <div className="text-sm text-gray-600 mt-2">Of Divine Celebrations</div>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100 hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-devotional-gold">
              <div className="text-6xl mb-4">🌺</div>
              <div className="text-5xl font-bold text-devotional-maroon mb-2">25+</div>
              <div className="text-xl text-devotional-crimson font-semibold">Sacred Events</div>
              <div className="text-sm text-gray-600 mt-2">Pujas & Celebrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Divine Call to Action */}
      <section className="py-20 bg-gradient-to-br from-devotional-maroon via-devotional-crimson to-devotional-saffron text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mandala opacity-20"></div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-devotional-gold via-devotional-amber to-devotional-gold"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-devotional-gold via-devotional-amber to-devotional-gold"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="text-6xl mb-6 animate-pulse">🕉️</div>
          <h2 className="text-4xl font-bold mb-4 drop-shadow-2xl">
            Join Our Sacred Sangha
          </h2>
          <p className="text-2xl mb-2 text-devotional-gold font-semibold">
            या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता
          </p>
          <p className="text-xl mb-8 text-amber-100">
            Be part of our divine Durga Puja celebrations. Together, we honor Maa Durga with devotion and unity.
          </p>
          
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-3xl">🌺</span>
            <div className="h-px w-16 bg-devotional-gold"></div>
            <span className="text-4xl">🪔</span>
            <div className="h-px w-16 bg-devotional-gold"></div>
            <span className="text-3xl">🌺</span>
          </div>
          
          <Link
            to="/register"
            className="inline-block bg-devotional-gold text-devotional-maroon px-12 py-5 rounded-lg font-bold text-lg hover:bg-devotional-amber hover:scale-110 transition-all duration-300 shadow-2xl border-4 border-double border-amber-300"
          >
            🙏 Register & Join Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
