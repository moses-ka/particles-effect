import React, { useRef, useState, useEffect } from 'react';

class Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    density: number;
    size: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.size = 3;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
       
    }
    update(mouse: { x: number; y: number; radius: number }) {
        const dx= mouse.x - this.x;
        const dy= mouse.y - this.y;
        const destance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / destance;
        const forceDirectionY = dy / destance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - destance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;
        if (destance < mouse.radius) {
            this.x -= directionX ;
            this.y -= directionY ;
        }
        else {
           if(this.x !== this.baseX){
               const dx = this.x - this.baseX;
               this.x -= dx / 10;
           }
              if(this.y !== this.baseY){
                const dy = this.y - this.baseY;
                this.y -= dy / 10;
              }
        }
    }
}

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesArrayRef = useRef<Particle[]>([]); // Use ref instead of state
    const [mouse, setMouse] = useState({ x: 0, y: 0, radius: 100 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const  textCords = ctx?.getImageData(0, 0, window.innerWidth, window.innerHeight)

            const init = (): void => { // this func will add particles to the array in rondom positions in canvas
            for (let i = 0; i < 500; i++) { // Set loop to attempt to add up to 1500 particles
            if (particlesArrayRef.current.length < 600) { // Check if less than 1500 particles exist
            const x: number = Math.random() * window.innerWidth;
            const y: number = Math.random() * window.innerHeight;
            particlesArrayRef.current.push(new Particle(x, y)); 
            } else {
            break; // Stop the loop if 1500 particles have been added
             }
            }
            }   ;
            // const init = (): void => {
            //     for (let y = 0, y2 = textCords.height; y < y2; y++) {
            //         for (let x = 0, x2 = textCords.width; x < x2; x++) {
            //             if (textCords.data[(y * 4 * textCords.width) + (x * 4) + 3] > 128) {
            //                 const positionX = x;
            //                 const positionY = y;
            //                 particlesArrayRef.current.push(new Particle(positionX * 10, positionY * 10));
            //             }
                    
            //     }
            // }
            init();

            const animate = () => {
                if (ctx) {
                    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                    particlesArrayRef.current.forEach((particle) => {
                        particle.draw(ctx);
                        particle.update(mouse);
                    });
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }, [mouse]); //  mouse is a dependency 

    const handleMouseMovement = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setMouse({ x: e.clientX, y: e.clientY, radius: 100 });
    };

    return <canvas onMouseMove={handleMouseMovement} ref={canvasRef} id="canvas"></canvas>;
}

export default Canvas;