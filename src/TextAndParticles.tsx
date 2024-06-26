import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

const TextAndParticles = ({ text }) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const myP5 = useRef(null);
  const particles = useRef([]); // Ref to store particles

  useEffect(() => {
    const sketch = (p) => {
      let textParticles = []; // Array to hold particles forming the text

      // Setup function to initialize the canvas and text
      p.setup = () => {
        p.createCanvas(600, 400); // Create canvas
        p.textSize(48); // Set text size
        p.textAlign(p.CENTER, p.CENTER); // Align text to center
        createTextParticles(); // Create particles forming the text
      };

      // Function to create particles forming the text
      const createTextParticles = () => {
        p.background(100); // Set background color
        p.text(text, p.width / 2, p.height / 2); // Draw text on canvas

        // Create a graphics buffer to get text pixel data
        const graphics = p.createGraphics(p.width, p.height);
        graphics.textSize(48);
        graphics.textAlign(p.CENTER, p.CENTER);
        graphics.fill(255);
        graphics.background(50);
        graphics.text(text, p.width / 2, p.height / 2);

        // Loop through pixels and create particles at white pixel positions
        for (let x = 0; x < graphics.width; x += 1) { // Decrease step size for denser particles
          for (let y = 0; y < graphics.height; y += 1) { // Decrease step size for denser particles
            if (graphics.get(x, y)[0] === 255) { // Check if pixel is white
              textParticles.push(new Particle(p, x, y)); // Add particle at this position
            }
          }
        }
        particles.current = textParticles; // Assign particles to ref
      };

      // Draw function called repeatedly to render the canvas
      p.draw = () => {
        p.background(50); // Clear background

        // Update and show each particle
        for (let i = particles.current.length - 1; i >= 0; i--) {
          if (isHovered) {
            particles.current[i].moveRandom(); // Move particle randomly if hovered
          } else {
            particles.current[i].moveToOrigin(); // Move particle back to origin if not hovered
          }
          particles.current[i].show(); // Display particle
        }
      };

      // Function to handle mouse movements and create particles
      p.mouseMoved = () => {
        if (isHovered && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          particles.current.push(new Particle(p, p.mouseX, p.mouseY)); // Add particle at mouse position
        }
      };

      // Particle class to handle individual particle properties and behavior
      class Particle {
        constructor(p, x, y) {
          this.p = p;
          this.x = x;
          this.y = y;
          this.originX = x;
          this.originY = y;
          this.diameter = p.random(20,10); // Set random size
          this.xSpeed = 4;
          this.ySpeed = 4;
          this.color = p.color(p.random(222), p.random(222), p.random(222)); // Set random color
          this.alpha = 120; // Set initial transparency
        }

        // Function to move particle randomly
        moveRandom() {
          this.xSpeed = p.random(-4, 4);
          this.ySpeed = p.random(-3, 3);
          this.x += this.xSpeed;
          this.y += this.ySpeed;
        }

        // Function to move particle back to its original position
        moveToOrigin() {
          this.x += (this.originX - this.x) * 0.1;
          this.y += (this.originY - this.y) * 0.1;
        }

        // Function to display the particle
        show() {
          this.p.noStroke();
          this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha); // Set color with transparency
          this.p.ellipse(this.x, this.y, this.diameter); // Draw particle as an ellipse
        }
      }
    };

    // Create a new p5 instance
    myP5.current = new p5(sketch, canvasRef.current);

    // Cleanup function to remove p5 instance
    return () => {
      myP5.current.remove();
    };
  }, [text, isHovered]); // Dependencies for useEffect

  // Function to handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovered(true); // Set hover state to true
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovered(false); // Set hover state to false
  };

  return (
    <div
      className="canvas-container"
      onMouseEnter={handleMouseEnter} // Attach mouse enter event
      onMouseLeave={handleMouseLeave} // Attach mouse leave event
    >
      <div ref={canvasRef}></div> {/* Reference to the canvas element */}
    </div>
  );
};

export default TextAndParticles;
