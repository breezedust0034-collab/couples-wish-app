<template>
  <canvas ref="canvasRef" class="sakura-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null
let petals = []

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

function createPetal(canvas) {
  const size = randomRange(8, 18)
  return {
    x: randomRange(0, canvas.width),
    y: randomRange(-100, -10),
    size,
    speedY: randomRange(0.5, 1.2),
    speedX: randomRange(-0.3, 0.3),
    rotation: randomRange(0, 360),
    rotationSpeed: randomRange(-2, 2),
    opacity: randomRange(0.5, 0.85),
    swayAmp: randomRange(40, 80),
    swayFreq: randomRange(0.005, 0.012),
    swayPhase: randomRange(0, Math.PI * 2),
  }
}

function drawPetal(ctx, petal, time) {
  const sway = Math.sin(time * petal.swayFreq + petal.swayPhase) * petal.swayAmp
  const s = petal.size / 2

  ctx.save()
  ctx.translate(petal.x + sway, petal.y)
  ctx.rotate((petal.rotation * Math.PI) / 180)
  ctx.globalAlpha = petal.opacity

  const gradient = ctx.createRadialGradient(0, -s * 0.3, 0, 0, 0, s * 1.2)
  gradient.addColorStop(0, '#FFF0F5')
  gradient.addColorStop(0.4, '#FADADD')
  gradient.addColorStop(1, '#F0B8C8')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 1.2, -s * 0.6, s * 0.8, s * 0.4, 0, s * 0.8)
  ctx.bezierCurveTo(-s * 0.8, s * 0.4, -s * 1.2, -s * 0.6, 0, -s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const count = window.innerWidth < 400 ? 8 : window.innerWidth < 768 ? 12 : 18
  while (petals.length < count) petals.push(createPetal(canvas))

  const time = Date.now()

  petals = petals.filter(petal => {
    petal.y += petal.speedY
    petal.x += petal.speedX
    petal.rotation += petal.rotationSpeed * 0.5
    drawPetal(ctx, petal, time)
    return petal.y < canvas.height + 50
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => { animate() })
onUnmounted(() => { if (animationId) cancelAnimationFrame(animationId) })
</script>

<style scoped>
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
