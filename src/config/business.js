// Business Configuration
// This file contains all the customizable settings for the website
// Change these values to adapt the template for different businesses

export const businessConfig = {
  // Brand Identity
  brandName: "StyleHub",
  tagline: "Discover. Shop. Shine.",
  
  // Hero Section
  heroTitle: "Your Style, Your Story",
  heroSubtitle: "Discover premium products curated just for you. From trending essentials to timeless classics.",
  heroImage: "/hero.jpeg", // Path to hero background image
  
  // Theme Colors (can be changed for different business types)
  colors: {
    primary: "#6366f1",     // Indigo - main brand color
    secondary: "#f59e0b",   // Amber - accent color  
    accent: "#10b981",      // Emerald - success/positive actions
    danger: "#ef4444",      // Red - errors/warnings
    dark: "#1f2937",        // Dark gray - text/dark elements
  },
  
  // Features Section (generic benefits that apply to most businesses)
  features: [
    {
      icon: "✨",
      title: "Quality Products",
      description: "Carefully curated selection"
    },
    {
      icon: "🔒", 
      title: "Secure Shopping",
      description: "Safe and protected"
    },
    {
      icon: "🚀",
      title: "Fast Delivery", 
      description: "Quick and reliable"
    },
    {
      icon: "💬",
      title: "Customer Support",
      description: "We're here to help"
    }
  ],
  
  // Contact Information
  contact: {
    phone: "+2160675986988",
    email: "contact@stylehub.com",
    address: "123 Business Street, City, Country"
  },
  
  // Social Media Links
  socialLinks: {
    instagram: "https://instagram.com/zi__punisher/",
    facebook: "",
    twitter: "",
    tiktok: "",
    youtube: ""
  },
  
  // Newsletter Settings
  newsletter: {
    enabled: true,
    title: "Stay in the Loop",
    description: "Get the latest updates on new products, exclusive deals, and style tips"
  },
  
  // SEO Meta Information
  seo: {
    title: "StyleHub - Premium Fashion & Lifestyle",
    description: "Discover premium products curated just for you. From trending essentials to timeless classics.",
    keywords: "fashion, style, clothing, accessories, premium, quality"
  },
  
  // Business Type Presets (uncomment one to use)
  // You can quickly switch between different business types
  
  // Fashion/Clothing Store
  // brandName: "StyleHub",
  // heroTitle: "Your Style, Your Story",
  // features: [/* fashion-specific features */]
  
  // Electronics Store  
  // brandName: "TechZone",
  // heroTitle: "Innovation Meets Excellence", 
  // features: [/* tech-specific features */]
  
  // Home & Garden
  // brandName: "HomeBloom",
  // heroTitle: "Transform Your Space",
  // features: [/* home-specific features */]
  
  // Sports & Fitness
  // brandName: "FitPro",
  // heroTitle: "Unleash Your Potential",
  // features: [/* fitness-specific features */]
  
  // Beauty & Cosmetics
  // brandName: "GlowUp",
  // heroTitle: "Beauty Redefined",
  // features: [/* beauty-specific features */]
}

// Helper functions for theme customization
export const getThemeColors = () => businessConfig.colors

export const updateBusinessConfig = (newConfig) => {
  Object.assign(businessConfig, newConfig)
}

// Business type templates for quick setup
export const businessTemplates = {
  fashion: {
    brandName: "StyleHub",
    tagline: "Discover. Shop. Shine.",
    heroTitle: "Your Style, Your Story",
    heroSubtitle: "Discover premium fashion curated just for you. From trending essentials to timeless classics.",
    colors: {
      primary: "#6366f1",
      secondary: "#f59e0b", 
      accent: "#10b981"
    },
    features: [
      { icon: "✨", title: "Latest Trends", description: "Always in fashion" },
      { icon: "🔒", title: "Secure Shopping", description: "Safe and protected" },
      { icon: "🚀", title: "Fast Delivery", description: "Quick and reliable" },
      { icon: "💬", title: "Customer Support", description: "We're here to help" }
    ]
  },
  
  electronics: {
    brandName: "TechZone",
    tagline: "Innovation. Quality. Performance.",
    heroTitle: "Innovation Meets Excellence",
    heroSubtitle: "Discover cutting-edge technology and electronics. From latest gadgets to professional equipment.",
    colors: {
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#8b5cf6"
    },
    features: [
      { icon: "⚡", title: "Latest Tech", description: "Cutting-edge products" },
      { icon: "🔒", title: "Secure Shopping", description: "Safe and protected" },
      { icon: "🚀", title: "Fast Delivery", description: "Quick and reliable" },
      { icon: "🔧", title: "Tech Support", description: "Expert assistance" }
    ]
  },
  
  home: {
    brandName: "HomeBloom",
    tagline: "Create. Comfort. Inspire.",
    heroTitle: "Transform Your Space",
    heroSubtitle: "Beautiful home decor and furniture to create your perfect living space. Quality meets affordability.",
    colors: {
      primary: "#059669",
      secondary: "#d97706",
      accent: "#dc2626"
    },
    features: [
      { icon: "🏠", title: "Home Design", description: "Beautiful selections" },
      { icon: "🔒", title: "Secure Shopping", description: "Safe and protected" },
      { icon: "🚀", title: "Fast Delivery", description: "Quick and reliable" },
      { icon: "💬", title: "Customer Support", description: "We're here to help" }
    ]
  }
}
