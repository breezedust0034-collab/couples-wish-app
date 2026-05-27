<template>
  <canvas ref="canvasRef" class="bg-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null
let particles = []

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

function createParticle(canvas) {
  const type = Math.random()
  const isWarm = type > 0.5

  return {
    x: randomRange(0, canvas.width),
    y: randomRange(canvas.height * 0.2, canvas.height),
    baseRadius: randomRange(2, 6),
    glowRadius: randomRange(20, 50),
    speedX: randomRange(-0.2, 0.2),
    speedY: randomRange(-0.4, -0.08),
    targetOpacity: randomRange(0.2, 0.5),
    hue: isWarm ? randomRange(335, 360) : randomRange(15, 45),
    saturation: randomRange(60, 85),
    lightness: randomRange(82, 95),
    phase: randomRange(0, Math.PI * 2),
    speed: randomRange(0.003, 0.01),
    amplitude: randomRange(20, 50),
    life: 0,
    maxLife: randomRange(300, 700),
  }
}

function drawParticle(ctx, p) {
  const sway = Math.sin(p.phase + p.life * p.speed) * p.amplitude
  const drawX = p.x + sway
  const drawY = p.y + p.life * p.speedY

  const lifeRatio = p.life / p.maxLife
  let opacity = p.targetOpacity
  if (lifeRatio < 0.15) opacity = p.targetOpacity * (lifeRatio / 0.15)
  if (lifeRatio > 0.85) opacity = p.targetOpacity * (1 - (lifeRatio - 0.85) / 0.15)

  ctx.save()

  const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.glowRadius)
  gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${opacity})`)
  gradient.addColorStop(0.3, `hsla(${p.hue}, ${p.saturation - 15}%, ${p.lightness - 8}%, ${opacity * 0.4})`)
  gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(drawX, drawY, p.glowRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = opacity * 0.7
  ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${Math.min(p.lightness + 5, 100)}%, 0.5)`
  ctx.beginPath()
  ctx.arc(drawX, drawY, p.baseRadius * 0.3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const count = window.innerWidth < 400 ? 12 : window.innerWidth < 768 ? 22 : 30

  while (particles.length < count) {
    const p = createParticle(canvas)
    p.life = randomRange(0, p.maxLife * 0.5)
    particles.push(p)
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles = particles.filter(p => {
    p.life++
    p.x += p.speedX
    drawParticle(ctx, p)
    return p.life < p.maxLife && p.y + p.life * p.speedY > -60 && p.x > -100 && p.x < canvas.width + 100
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => { animate() })
onUnmounted(() => { if (animationId) cancelAnimationFrame(animationId) })
</script>

<style scoped>
.bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
