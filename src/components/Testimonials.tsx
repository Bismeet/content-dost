import React, { useState, useEffect, useRef } from 'react';
import { testimonialsData } from '../data/content';
import type { TestimonialItem } from '../data/content';
import { ChevronLeft, ChevronRight, Quote, Award, RotateCw } from 'lucide-react';

interface TestimonialFlipCardProps {
  item: TestimonialItem;
  index: number;
  position: 'center' | 'left' | 'right';
  isFlipped: boolean;
  onFlip: () => void;
  onSelect: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  isOffscreen: boolean;
}

function TestimonialFlipCard({
  item,
  index,
  position,
  isFlipped,
  onFlip,
  onSelect,
  handleNext,
  handlePrev,
  isOffscreen,
}: TestimonialFlipCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  
  // High-performance direct-DOM animation state refs
  const stateRef = useRef({
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0
  });

  const swipeRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwipeTriggered: false
  });

  // Reset transforms and clear animation loops when position updates
  useEffect(() => {
    if (tiltRef.current) {
      tiltRef.current.style.transform = '';
      tiltRef.current.style.transition = '';
    }
    stateRef.current = {
      targetTiltX: 0,
      targetTiltY: 0,
      currentTiltX: 0,
      currentTiltY: 0
    };
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [position]);

  // Clean up RAF loop on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const updateTilt = () => {
    if (isOffscreen) {
      rafRef.current = null;
      return;
    }
    
    const state = stateRef.current;
    
    // Smooth interpolation (lerp) for card movement
    state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.15;
    state.currentTiltY += (state.targetTiltY - state.currentTiltY) * 0.15;

    if (tiltRef.current) {
      tiltRef.current.style.transform = `rotateX(${state.currentTiltX}deg) rotateY(${state.currentTiltY}deg)`;
    }

    // Stop tracking when motion values settle to prevent continuous RAF loops
    if (
      Math.abs(state.targetTiltX - state.currentTiltX) < 0.01 &&
      Math.abs(state.targetTiltY - state.currentTiltY) < 0.01
    ) {
      state.currentTiltX = state.targetTiltX;
      state.currentTiltY = state.targetTiltY;
      if (tiltRef.current) {
        tiltRef.current.style.transform = state.currentTiltX === 0 && state.currentTiltY === 0
          ? ''
          : `rotateX(${state.currentTiltX}deg) rotateY(${state.currentTiltY}deg)`;
      }
      rafRef.current = null;
    } else {
      rafRef.current = requestAnimationFrame(updateTilt);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (position !== 'center' || isOffscreen) return;

    // Detect touch/hoverless screens and bypass tilt calculation
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Constrain tilt angle to a subtle maximum of 5 degrees
    stateRef.current.targetTiltX = ((yc - y) / yc) * 5;
    stateRef.current.targetTiltY = ((x - xc) / xc) * 5;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateTilt);
    }
  };

  const handleMouseLeave = () => {
    if (position !== 'center') return;
    stateRef.current.targetTiltX = 0;
    stateRef.current.targetTiltY = 0;

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(updateTilt);
    }
  };

  // Touch handlers to support swiping/dragging on mobile with zero rerenders
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (position !== 'center' || isOffscreen) return;
    hasDraggedRef.current = false;

    const touch = e.touches[0];
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isSwipeTriggered: false
    };

    if (tiltRef.current) {
      tiltRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (position !== 'center' || isOffscreen) return;

    const touch = e.touches[0];
    const swipe = swipeRef.current;
    const diffX = touch.clientX - swipe.startX;
    const diffY = touch.clientY - swipe.startY;

    if (!swipe.isSwipeTriggered) {
      // If movement is predominantly vertical, defer to browser scrolling
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }
      // Horizontal swipe detected
      if (Math.abs(diffX) > 8) {
        swipe.isSwipeTriggered = true;
        hasDraggedRef.current = true;
      }
    }

    if (swipe.isSwipeTriggered) {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (tiltRef.current) {
        tiltRef.current.style.transform = `translate3d(${diffX}px, 0, 0)`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (position !== 'center' || isOffscreen) return;

    const swipe = swipeRef.current;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - swipe.startX;
    const timeElapsed = Date.now() - swipe.startTime;

    if (tiltRef.current) {
      tiltRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      tiltRef.current.style.transform = '';
    }

    if (swipe.isSwipeTriggered) {
      const threshold = 50;
      const velocityThreshold = 30;
      const isQuickSwipe = timeElapsed < 250;

      if (diffX < -threshold || (diffX < -velocityThreshold && isQuickSwipe)) {
        handleNext();
      } else if (diffX > threshold || (diffX > velocityThreshold && isQuickSwipe)) {
        handlePrev();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (position === 'center') {
        onFlip();
      } else {
        onSelect();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    if (position === 'center') {
      onFlip();
    } else {
      onSelect();
    }
  };

  return (
    <div
      className={`testimonial-card-tilt position-${position} ${isFlipped ? 'is-flipped' : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Testimonial from ${item.name}. Position ${position}. ${isFlipped ? 'Showing detailed review' : 'Showing summary quote'}.`}
    >
      <div ref={tiltRef} className="testimonial-card-tilt-wrapper">
        <div className="testimonial-card-inner">
          {/* FRONT SIDE */}
          <div className="testimonial-card-face face-front">
            <Quote className="w-10 h-10 card-quote-icon" />
            
            <blockquote className="card-front-quote">
              “{item.shortQuote}”
            </blockquote>

            <div className="card-meta-row">
              <span className="card-number">0{index + 1}</span>
              <span className="card-hint">
                Flip to read <RotateCw className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="testimonial-card-face face-back">
            {/* Flip back controller */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              className="testimonials-arrow"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                width: '2rem',
                height: '2rem',
                zIndex: 10,
              }}
              aria-label="Flip back to front"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <p className="card-back-quote">
              “{item.content}”
            </p>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="card-meta-row">
                <div className="card-client-info">
                  <div className="card-avatar">
                    {item.name.charAt(0)}
                  </div>
                  <div className="card-client-text">
                    <h4>{item.name}</h4>
                    <p>{item.role} @ {item.company}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="card-outcome-badge">
                  <Award className="w-3.5 h-3.5" />
                  <span>{item.achievement}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Stop calculations when the section scrolls out of the viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsOffscreen(!entry.isIntersecting);
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePrev = () => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (idx: number) => {
    setIsFlipped(false);
    setActiveIndex(idx);
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="testimonials-section scroll-mt-20"
      style={{ borderBottom: '1px solid var(--cine-border-soft)' }}
    >
      <div className="container relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-16 select-none">
          <span className="section-eyebrow mb-3">Words From The Other Side</span>
          <h2 className="text-[#FFF7F0] max-w-2xl">
            Hear from the people who have <em className="font-editorial italic text-orange-gradient">experienced the work.</em>
          </h2>
          <p className="text-[#B9AAA0] text-sm mt-4 max-w-md">
            Stories of growth, strategy, and cinematic editing from creators, collaborators, and brands.
          </p>
        </div>

        {/* Cinematic Card stack */}
        <div className="testimonials-viewport">
          {testimonialsData.map((item, idx) => {
            let position: 'center' | 'left' | 'right' = 'center';
            if (idx === activeIndex) {
              position = 'center';
            } else if (idx === (activeIndex - 1 + testimonialsData.length) % testimonialsData.length) {
              position = 'left';
            } else {
              position = 'right';
            }

            return (
              <TestimonialFlipCard
                key={item.id}
                item={item}
                index={idx}
                position={position}
                isFlipped={idx === activeIndex && isFlipped}
                onFlip={() => setIsFlipped((prev) => !prev)}
                onSelect={() => handleSelect(idx)}
                handleNext={handleNext}
                handlePrev={handlePrev}
                isOffscreen={isOffscreen}
              />
            );
          })}
        </div>

        {/* Prev / Next controls and progress indicators */}
        <div className="testimonials-controls select-none">
          <button
            onClick={handlePrev}
            className="testimonials-arrow"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="testimonials-dots" role="tablist" aria-label="Testimonial navigation dots">
            {testimonialsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`testimonials-dot ${idx === activeIndex ? 'is-active' : ''}`}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="testimonials-arrow"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
