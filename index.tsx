import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPE DEFINITIONS ---
interface ImageState {
  id: number;
  src: string | null;
}

interface ImageCardProps {
  image: ImageState;
  onImageUpload: (id: number, src: string) => void;
}

type Layout = 'grid' | 'feed';

// --- CONSTANTS ---
const INITIAL_IMAGE_COUNT = 16;
// Populated with placeholder images
const initialImages: ImageState[] = Array.from({ length: INITIAL_IMAGE_COUNT }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/${i + 1}/600/600`,
}));

// --- IMAGE CARD COMPONENT ---
const ImageCard: React.FC<ImageCardProps> = ({ image, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        onImageUpload(image.id, imageUrl);
      } else {
        alert("لطفا یک فایل عکس انتخاب کنید.");
      }
    }
    event.target.value = '';
  };

  return (
    <div
      className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 ease-in-out hover:shadow-cyan-500/50 hover:scale-105"
      onClick={handleCardClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {image.src ? (
        <>
          <img
            src={image.src}
            alt={`Uploaded ${image.id}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-white text-lg">تغییر عکس</p>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400 transition-colors duration-300 group-hover:bg-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span className="text-5xl font-bold">{image.id}</span>
          <p className="text-sm text-gray-500">برای آپلود کلیک کنید</p>
        </div>
      )}
    </div>
  );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [images, setImages] = useState<ImageState[]>(initialImages);
  const [layout, setLayout] = useState<Layout>('grid');

  const handleImageUpdate = useCallback((id: number, src: string) => {
    setImages((currentImages) =>
      currentImages.map((img) => (img.id === id ? { ...img, src } : img))
    );
  }, []);

  const gridClasses = layout === 'grid'
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-6'
    : 'grid grid-cols-1 gap-8 max-w-2xl mx-auto';
    
  // Classes for layout switcher buttons
  const baseButtonClasses = 'p-2 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500';
  const activeButtonClasses = 'bg-cyan-600 text-white';
  const inactiveButtonClasses = 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          گالری عکاسی
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          پروژه درس عکاسی
        </p>
      </header>
      
      {/* Layout Switcher (Inlined) */}
      <div className="flex justify-center gap-4 py-8">
        <button
          onClick={() => setLayout('grid')}
          className={`${baseButtonClasses} ${layout === 'grid' ? activeButtonClasses : inactiveButtonClasses}`}
          aria-label="Grid View"
          title="نمایش شبکه‌ای"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => setLayout('feed')}
          className={`${baseButtonClasses} ${layout === 'feed' ? activeButtonClasses : inactiveButtonClasses}`}
          aria-label="Feed View"
          title="نمایش تکی"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <main className="container mx-auto px-4 pb-16">
        <div className={gridClasses}>
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onImageUpload={handleImageUpdate}
            />
          ))}
        </div>
      </main>

      {/* About Me Section (Inlined) */}
      <section className="border-t border-gray-800 bg-gray-900 py-16">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 text-center md:flex-row md:text-right">
           <img
            src="https://i.pravatar.cc/150?u=sara-rezaei"
            alt="عکس سارا رضایی"
            className="h-32 w-32 flex-shrink-0 rounded-full object-cover border-4 border-gray-700 shadow-lg"
          />
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-white">درباره من</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mt-2">سارا رضایی</h3>
            <p className="mt-4 max-w-2xl text-gray-400 md:mx-0 mx-auto">
              من دانشجوی ترم آخر عکاسی در دانشگاه هنر تهران هستم. از کودکی به ثبت لحظه‌ها و داستان‌سرایی از طریق تصویر علاقه داشتم. تخصص من در عکاسی پرتره و مستند اجتماعی است و سعی می‌کنم در کارهایم، احساسات و واقعیت‌های پنهان زندگی روزمره را به تصویر بکشم. این گالری مجموعه‌ای از بهترین کارهای من در طول دوران تحصیلم است.
            </p>
          </div>
        </div>
      </section>
      
      <footer className="py-6 text-center text-gray-500">
        <p>ساخته شده برای ارائه دانشگاه</p>
      </footer>
    </div>
  );
};

// --- RENDER APPLICATION ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
