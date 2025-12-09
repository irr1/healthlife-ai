// Reusable animation configurations for Tailwind CSS
// These can be used with className or added to tailwind.config.ts

export const animations = {
  // Fade animations
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  fadeInUp: 'animate-fadeInUp',
  fadeInDown: 'animate-fadeInDown',

  // Scale animations
  scaleIn: 'animate-scaleIn',
  scaleOut: 'animate-scaleOut',
  pulse: 'animate-pulse',

  // Slide animations
  slideInLeft: 'animate-slideInLeft',
  slideInRight: 'animate-slideInRight',
  slideInUp: 'animate-slideInUp',
  slideInDown: 'animate-slideInDown',

  // Bounce animations
  bounce: 'animate-bounce',
  bounceIn: 'animate-bounceIn',

  // Rotate animations
  spin: 'animate-spin',
  spinSlow: 'animate-spinSlow',

  // Shake animation
  shake: 'animate-shake',

  // Glow/shimmer
  shimmer: 'animate-shimmer',
  glow: 'animate-glow',
}

// Animation duration classes
export const durations = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700',
}

// Easing functions
export const easings = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
}

// Combine animation with duration and easing
export const createAnimation = (
  animation: keyof typeof animations,
  duration: keyof typeof durations = 'normal',
  easing: keyof typeof easings = 'inOut'
) => {
  return `${animations[animation]} ${durations[duration]} ${easings[easing]}`
}

// Stagger delay classes for sequential animations
export const stagger = {
  delay1: 'delay-[50ms]',
  delay2: 'delay-[100ms]',
  delay3: 'delay-[150ms]',
  delay4: 'delay-[200ms]',
  delay5: 'delay-[250ms]',
  delay6: 'delay-[300ms]',
}

// Hover animations
export const hoverAnimations = {
  lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
  grow: 'hover:scale-105 transition-transform duration-300',
  glow: 'hover:shadow-xl hover:shadow-purple-500/50 transition-shadow duration-300',
  rotate: 'hover:rotate-3 transition-transform duration-300',
  shine: 'hover:brightness-110 transition-all duration-300',
}
