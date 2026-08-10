<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Our Pizzeria Menu</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">Authentic Italian pizzas made with passion and locally sourced ingredients in our historic castle kitchen.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="item in menuItems" :key="item.id" class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div class="relative">
            <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover">
            <div v-if="item.soldOut" class="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              SOLD OUT
            </div>
            <div v-if="item.popular" class="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              POPULAR
            </div>
          </div>
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold">{{ item.name }}</h3>
              <span class="text-xl font-bold text-red-500">€{{ item.price }}</span>
            </div>
            <p class="text-gray-300 mb-4">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in item.dietaryTags" :key="tag" class="px-2 py-1 bg-gray-700 text-xs rounded">
                {{ tag }}
              </span>
            </div>
            <button 
              v-if="!item.soldOut" 
              @click="addToCart(item)"
              class="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300"
            >
              Add to Order
            </button>
            <button 
              v-else 
              disabled
              class="w-full py-2 bg-gray-600 cursor-not-allowed rounded-lg font-semibold"
            >
              Sold Out
            </button>
          </div>
        </div>
      </div>

      <div class="mt-16 bg-gray-800 rounded-xl p-8 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-center">Our Kitchen Philosophy</h2>
        <div class="prose prose-invert max-w-none">
          <p>At Kader Grad Kodeljevo, we believe that great food starts with great ingredients. Our pizzas are made with:</p>
          <ul>
            <li>Fresh, locally sourced vegetables from nearby farms</li>
            <li>Premium mozzarella made in our own cheese factory</li>
            <li>Organic flour milled from regional wheat</li>
            <li>Wood-fired ovens that give our pizzas their distinctive flavor</li>
            <li>Traditional recipes passed down through generations of Italian families</li>
          </ul>
          <p>Every pizza is prepared fresh daily, ensuring the highest quality and taste experience for our guests.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietaryTags: string[];
  popular: boolean;
  soldOut: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Classic tomato sauce, fresh mozzarella, basil',
    price: 12.5,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian', 'Gluten-Free Option'],
    popular: true,
    soldOut: false
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'Tomato sauce, mozzarella, spicy pepperoni',
    price: 14.5,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    popular: true,
    soldOut: false
  },
  {
    id: '3',
    name: 'Quattro Stagioni',
    description: 'Four seasonal toppings: mushrooms, artichokes, olives, ham',
    price: 16.5,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    popular: false,
    soldOut: false
  },
  {
    id: '4',
    name: 'Diavola',
    description: 'Spicy salami, hot peppers, mozzarella',
    price: 15.5,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    popular: true,
    soldOut: true
  },
  {
    id: '5',
    name: 'Caprese',
    description: 'Fresh mozzarella, tomatoes, basil, balsamic glaze',
    price: 13.5,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian', 'Vegan Option'],
    popular: false,
    soldOut: false
  },
  {
    id: '6',
    name: 'Seafood Special',
    description: 'Clams, mussels, shrimp, white wine sauce',
    price: 18.5,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    dietaryTags: [],
    popular: true,
    soldOut: false
  }
]

const addToCart = (item: MenuItem) => {
  console.log('Adding to cart:', item.name)
  // Implementation would integrate with cart system
}
</script>