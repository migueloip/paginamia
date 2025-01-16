class ParticleNetwork {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { 
      x: null, 
      y: null, 
      radius: 150
    };
    
    this.init();
    this.animate();
    this.handleResize();
    this.addEventListeners();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    // Start particle spawning loop
    this.spawnParticlesOverTime();
  }

  spawnParticlesOverTime() {
    const spawnInterval = 200; // Spawn a new particle every 200ms
    setInterval(() => {
      if (this.particles.length < this.getMaxParticles()) {
        this.addParticle();
      }
    }, spawnInterval);
  }

  getMaxParticles() {
    return Math.floor((this.canvas.width * this.canvas.height) / 9000);
  }

  addParticle() {
    const size = Math.random() * 2 + 1;
    const margin = 20;
    const x = margin + Math.random() * (this.canvas.width - 2 * margin);
    const y = margin + Math.random() * (this.canvas.height - 2 * margin);
    const directionX = Math.random() * 1 - 0.5;
    const directionY = Math.random() * 1 - 0.5;
    const baseSpeed = 0.5;
    const lifespan = 5000 + Math.random() * 5000; // Random lifespan between 5-10 seconds
    const birthTime = Date.now();
    
    this.particles.push({
      x,
      y,
      size,
      directionX: directionX * baseSpeed,
      directionY: directionY * baseSpeed,
      baseDirectionX: directionX * baseSpeed,
      baseDirectionY: directionY * baseSpeed,
      lifespan,
      birthTime,
      opacity: 1
    });
  }

  resizeCanvas() {
    const contentSide = this.canvas.parentElement;
    this.canvas.width = contentSide.offsetWidth;
    this.canvas.height = contentSide.offsetHeight;
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
  }

  addEventListeners() {
    document.querySelector('.content-side').addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    document.querySelector('.content-side').addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  createParticles() {
    this.particles = [];
    const numberOfParticles = this.getMaxParticles();
    
    // Initialize with a few particles
    for (let i = 0; i < numberOfParticles / 3; i++) {
      this.addParticle();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const currentTime = Date.now();
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Calculate particle age and fade
      const age = currentTime - particle.birthTime;
      const fadeInDuration = 1000;
      const fadeOutStart = particle.lifespan - 1000;
      
      // Handle fade in
      if (age < fadeInDuration) {
        particle.opacity = age / fadeInDuration;
      }
      // Handle fade out
      else if (age > fadeOutStart) {
        particle.opacity = 1 - ((age - fadeOutStart) / 1000);
      }
      
      // Remove dead particles
      if (age >= particle.lifespan) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Draw particle with opacity
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(116, 185, 255, ${particle.opacity * 0.5})`;
      this.ctx.fill();
      
      // Reset particle direction to base direction
      particle.directionX = particle.baseDirectionX;
      particle.directionY = particle.baseDirectionY;
      
      // Mouse interaction
      if (this.mouse.x != null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          particle.directionX -= Math.cos(angle) * force * 0.5;
          particle.directionY -= Math.sin(angle) * force * 0.5;
        }
      }
      
      // Edge repulsion
      const margin = 50;
      const repulsionForce = 0.5;
      
      // Left edge
      if (particle.x < margin) {
        particle.directionX += repulsionForce * (1 - particle.x / margin);
      }
      // Right edge
      if (particle.x > this.canvas.width - margin) {
        particle.directionX -= repulsionForce * (1 - (this.canvas.width - particle.x) / margin);
      }
      // Top edge
      if (particle.y < margin) {
        particle.directionY += repulsionForce * (1 - particle.y / margin);
      }
      // Bottom edge
      if (particle.y > this.canvas.height - margin) {
        particle.directionY -= repulsionForce * (1 - (this.canvas.height - particle.y) / margin);
      }
      
      // Update position
      particle.x += particle.directionX;
      particle.y += particle.directionY;
      
      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Connect particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle2 = this.particles[j];
        const dx = particle.x - particle2.x;
        const dy = particle.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = (1 - distance/100) * Math.min(particle.opacity, particle2.opacity);
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(116, 185, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle network when the page loads
window.addEventListener('load', () => {
  new ParticleNetwork();
});