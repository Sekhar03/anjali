import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState(['all']);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const photos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setGalleryData(photos);
      
      // Extract unique years
      const uniqueYears = ['all', ...new Set(photos.map(p => p.year).sort().reverse())];
      setYears(uniqueYears);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedYear === 'all' 
    ? galleryData 
    : galleryData.filter(img => img.year === selectedYear);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      setSelectedImage(filteredImages[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      setSelectedImage(filteredImages[prevIndex]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-devotional-maroon mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading darshan gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Gallery</h1>
            <p className="text-xl text-primary-100">
              Relive the memories of our beautiful Durga Puja celebrations
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  selectedYear === year
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {year === 'all' ? 'All Years' : year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className="card overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(image)}
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View Image
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{image.category}</span>
                    <span>{image.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft size={48} />
          </button>
          
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-2xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.year} • {selectedImage.category}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
