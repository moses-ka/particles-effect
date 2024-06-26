import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const TextAndParticles = ({ text }) => {
  
  const canvasRef = useRef(null);
  let myP5 = useRef(null);
  let particles = [];

  useEffect(() => {
    // Function to initialize p5 sketch
    
    const sketch = (p) => {
      // Setup function runs once
      
      p.setup = () => {
        // Create canvas with dimensions and attach to DOM element
        p.createCanvas(400, 200).parent(canvasRef.current);
        // Set text characteristics
        p.textSize(48);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(255);
      };

      // Draw function runs continuously
      p.draw = () => {
        // Clear previous frame
        p.background(50);
        // Display text in the center of the canvas
        p.text(text, p.width / 2, p.height / 2);

        // Update and display particles
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].show();
          // Remove particles that have faded out
          if (particles[i].isFinished()) {
            particles.splice(i, 1);
          }
        }
      };

      // Mouse moved function to create particles
      p.mouseMoved = () => {
        // Check if mouse is within canvas bounds
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          // Add new particle at mouse position
          particles.push(new Particle(p, p.mouseX, p.mouseY));
        }
      };

      // Particle class definition
      class Particle {
        constructor(p, x, y) {
          this.p = p;
          this.x = x;
          this.y = y;
          this.diameter = p.random(10, 30);
          this.xSpeed = p.random(-1, 1);
          this.ySpeed = p.random(-1, 1);
          this.alpha = 255;
        }

        // Update particle position and transparency
        update() {
          this.x += this.xSpeed;
          this.y += this.ySpeed;
          this.alpha -= 2;
        }

        // Display particle
        show() {
          this.p.noStroke();
          this.p.fill(222, 222, 222, this.alpha);
          this.p.ellipse(this.x, this.y, this.diameter);
        }

        // Check if particle has faded out
        isFinished() {
          return this.alpha < 0;
        }
      }
    };

    // Initialize p5 instance with sketch function
    myP5.current = new p5(sketch);

    // Clean up function to remove p5 instance
    return () => {
      myP5.current.remove();
    };
  }, [text]); // Dependency array to re-render when text changes

  // JSX rendering
  return <div ref={canvasRef}></div>;
};

export default TextAndParticles;
