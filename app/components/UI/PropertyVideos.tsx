'use client';

import { useState, useEffect, useRef } from 'react';

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    youtubeId: string;
}

export default function PropertyVideos() {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Sample videos - In production, these would come from an API or CMS
    const videos: Video[] = [
        {
            id: '1',
            title: 'Luxury Apartment Tour in Kathmandu',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: '2',
            title: 'Modern House in Pokhara',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: '3',
            title: 'Commercial Space in Lalitpur',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            youtubeId: 'dQw4w9WgXcQ'
        },
        {
            id: '4',
            title: 'Villa with Mountain View',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            youtubeId: 'dQw4w9WgXcQ'
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const closeModal = () => {
        setSelectedVideo(null);
    };

    return (
        <section ref={sectionRef} className="py-16 sm:py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Section Header */}
            <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    Property <span className="bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent">Video Tours</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                    Take a virtual tour of our featured properties from the comfort of your home
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Video Grid */}
            <div className="max-w-7xl mx-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {videos.map((video, index) => (
                        <div
                            key={video.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedVideo(video)}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#9ac842] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Duration Badge */}
                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                                    5:30
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#9ac842] transition-colors">
                                    {video.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        12K views
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110"
                        >
                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video Player */}
                        <div className="relative aspect-video bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>

                        {/* Video Info */}
                        <div className="p-6 bg-white">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
                            <p className="text-gray-600">
                                Watch our full property tour and discover all the amazing features this property has to offer.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* View All Button */}
            <div className={`text-center mt-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button className="px-8 py-4 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] hover:opacity-90 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200">
                    View All Videos
                </button>
            </div>
        </section>
    );
}

