import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './banner.css';

const Banner = ({ slides }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
    const next = () => setCurrent(c => (c + 1) % slides.length);

    const slide = slides[current];

    return (
        <div className="banner-slider" style={{ background: slide.bg }}>
            <button className="banner-arrow left" onClick={prev}><FaChevronLeft /></button>
            <div className="banner-content">
                {slide.tag && <span className="banner-tag">{slide.tag}</span>}
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="banner-cta">
                    {slide.btn} <FaArrowRight />
                </Link>
            </div>
            <button className="banner-arrow right" onClick={next}><FaChevronRight /></button>
            <div className="banner-dots">
                {slides.map((_, i) => (
                    <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
                ))}
            </div>
        </div>
    );
};

export default Banner;
