import React, { useRef,  useEffect } from 'react';

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
        this.density = Math.random() * 120 + 1;
        this.size = 3;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, Math.PI * 3);
        ctx.closePath();
        ctx.fill();
    }
    update(mouse: { x: number; y: number; radius: number }) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 5;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 5;
            }
        }
    }
}

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesArrayRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, radius: 75 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Draw text
            
            ctx.fillStyle = 'white';
            ctx.font = 'lighter 20px sans-serif ';
            ctx.fillText('Elevating Digital',24, 20);
            ctx.fillText("Experiences",86,40)
            ctx.fillText("Skillfully Crafted ",12,60)
            ctx.fillText(" by a Creative ",70,80)
            ctx.fillText("Web Designer ",120,100)
            ctx.fillText("& developer ",70,120)

            // Get text pixel data
            const textCords = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);

            const init = (): void => {
                particlesArrayRef.current = [];
                const Xoffset = 0;
                const Yoffset = 0;
                for (let y = 0, y2 = textCords.height; y < y2; y++) {
                    for (let x = 0, x2 = textCords.width; x < x2; x++) {
                        if (textCords.data[(y * textCords.width + x) * 4 + 3] > 128) {
                            const positionX = x * 5 + Xoffset;
                            const positionY = y * 5 + Yoffset;
                            particlesArrayRef.current.push(new Particle(positionX , positionY));
                        }
                    }
                }
            };
            init();

            const animate = () => {
                if (ctx) {
                    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                    particlesArrayRef.current.forEach((particle) => {
                        particle.draw(ctx);
                        particle.update(mouseRef.current);
                    });
                    requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }, []);

    const handleMouseMovement = (e: React.MouseEvent<HTMLCanvasElement>) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, radius: 75 };
    };

    return <canvas onMouseMove={handleMouseMovement} ref={canvasRef} id="canvas"></canvas>;
}

export default Canvas;
