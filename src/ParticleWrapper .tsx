import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

const ParticleWrapper = ({ children }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const myP5 = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const gatherTextElements = () => {
      const elements = wrapperRef.current.querySelectorAll('*');
      const texts = [];
      elements.forEach((el) => {
        if (el.textContent.trim()) {
          texts.push(el);
        }
      });
      setTextElements(texts);
    };

    gatherTextElements();
  }, [children]);

  useEffect(() => {
    const sketch = (p) => {
      let textParticles = [];
      let textBounds = [];

      p.setup = () => {
        p.createCanvas(wrapperRef.current.offsetWidth, wrapperRef.current.offsetHeight);
        p.textSize(24);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(255);
        createTextParticles();
      };

      const createTextParticles = () => {
        textParticles = [];
        textBounds = [];
        textElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          textBounds.push(rect);
          const graphics = p.createGraphics(p.width, p.height);
          graphics.textSize(24);
          graphics.textAlign(p.CENTER, p.CENTER);
          graphics.fill(255);
          graphics.background(0, 0, 0, 0);
          graphics.text(el.textContent, rect.x + rect.width / 2, rect.y + rect.height / 2);

          for (let x = rect.x; x < rect.x + rect.width; x += 4) {
            for (let y = rect.y; y < rect.y + rect.height; y += 4) {
              if (graphics.get(x, y)[0] === 255) {
                textParticles.push(new Particle(p, x, y, 2));
              }
            }
          }
        });
        particles.current = textParticles;
      };

      p.draw = () => {
        p.clear();
        for (let i = particles.current.length - 1; i >= 0; i--) {
          if (isHovered) {
            particles.current[i].moveRandom();
          } else {
            particles.current[i].moveToOrigin();
          }
          particles.current[i].show();
        }
      };

      p.mouseMoved = () => {
        let hover = false;
        textBounds.forEach((rect) => {
          if (
            p.mouseX >= rect.left &&
            p.mouseX <= rect.right &&
            p.mouseY >= rect.top &&
            p.mouseY <= rect.bottom
          ) {
            hover = true;
          }
        });
        setIsHovered(hover);
      };

      class Particle {
        constructor(p, x, y, size) {
          this.p = p;
          this.x = x;
          this.y = y;
          this.originX = x;
          this.originY = y;
          this.diameter = size;
          this.xSpeed = 0;
          this.ySpeed = 0;
          this.color = p.color(p.random(255), p.random(255), p.random(255));
          this.alpha = 255;
        }

        moveRandom() {
          this.xSpeed = this.p.random(-1, 1);
          this.ySpeed = this.p.random(-1, 1);
          this.x += this.xSpeed;
          this.y += this.ySpeed;
        }

        moveToOrigin() {
          this.x += (this.originX - this.x) * 0.1;
          this.y += (this.originY - this.y) * 0.1;
        }

        show() {
          this.p.noStroke();
          this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
          this.p.ellipse(this.x, this.y, this.diameter);
        }
      }
    };

    if (wrapperRef.current) {
      myP5.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (myP5.current) {
        myP5.current.remove();
      }
    };
  }, [textElements, isHovered]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      {children}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      ></div>
    </div>
  );
};

export default ParticleWrapper;
