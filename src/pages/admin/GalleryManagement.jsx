import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import toast from 'react-hot-toast';
import { Upload, Trash2, Image as ImageIcon, X } from 'lucide-react';

const GalleryManagement = () => {
  const [galleries, setGalleries] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear().toString(),
    category: 'Puja',
    file: null
  });

  const categories = ['Puja', 'Decoration', 'Events', 'Cultural', 'Community'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const galleryData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleries(galleryData.sort((a, b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0)));
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);

    try {
      // Upload image to Firebase Storage
      const fileName = `gallery/${Date.now()}_${formData.file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, formData.file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'gallery'), {
        title: formData.title,
        year: formData.year,
        category: formData.category,
        url: downloadURL,
        storagePath: fileName,
        uploadedAt: serverTimestamp()
      });

      toast.success('Photo uploaded successfully!');
      setShowUploadModal(false);
      setFormData({
        title: '',
        year: new Date().getFullYear().toString(),
        category: 'Puja',
        file: null
      });
      fetchGallery();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (galleryItem) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      // Delete from Storage
      const storageRef = ref(storage, galleryItem.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', galleryItem.id));

      setGalleries(galleries.filter(item => item.id !== galleryItem.id));
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-devotional-maroon mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-devotional-maroon">Gallery Management</h1>
            <p className="text-gray-600 mt-2">Upload and manage celebration photos</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-devotional-saffron text-white px-6 py-3 rounded-lg font-semibold hover:bg-devotional-gold transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Photo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-devotional-saffron">
            <p className="text-sm text-gray-600">Total Photos</p>
            <p className="text-3xl font-bold text-devotional-maroon">{galleries.length}</p>
          </div>
          {categories.map(cat => (
            <div key={cat} className="card p-6">
              <p className="text-sm text-gray-600">{cat}</p>
              <p className="text-2xl font-bold text-gray-900">
                {galleries.filter(g => g.category === cat).length}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        {galleries.length === 0 ? (
          <div className="card p-12 text-center">
            <ImageIcon className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Photos Yet</h3>
            <p className="text-gray-500">Upload your first photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleries.map(item => (
              <div key={item.id} className="card overflow-hidden group">
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all transform hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="bg-devotional-saffron bg-opacity-20 text-devotional-maroon px-2 py-1 rounded text-xs font-semibold">
                      {item.category}
                    </span>
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-devotional-maroon">Upload Photo</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="label">Photo Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                    placeholder="e.g., Maha Ashtami Celebration"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="input-field"
                      required
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Photo File * (Max 5MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-field"
                    required
                  />
                  {formData.file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.file.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-devotional-saffron text-white px-6 py-3 rounded-lg font-semibold hover:bg-devotional-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
