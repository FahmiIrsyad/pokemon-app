<template>
  <div class="container py-4">
    <!-- 🔍 Header & Search -->
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
      <h2 class="mb-0 text-primary fw-bold">Pokémon Explorer</h2>
      <va-input
        v-model="search"
        placeholder="Search Pokémon..."
        clearable
        icon="search"
        size="large"
        class="search-input"
      />
    </div>

    <!-- ⏳ Loading -->
    <va-progress-bar v-if="store.loading" indeterminate class="mb-3" />

    <!-- 📄 Result Count -->
    <div class="text-muted text-center mb-3" v-if="!store.loading">
      Showing {{ filteredPokemons.length }} result(s)
    </div>

    <!-- 🃏 Pokémon Cards -->
    <div class="row g-4">
      <div
        v-for="pokemon in filteredPokemons"
        :key="pokemon.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <va-card class="h-100 cursor-pointer pokemon-card" @click="goToDetail(pokemon)">
          <img
            :src="pokemon.sprites.front_default"
            class="card-img-top p-3 mx-auto"
            style="height: 100px; object-fit: contain;"
            :alt="pokemon.name"
          />
          <va-card-title class="text-capitalize">
            {{ pokemon.name }}
          </va-card-title>
          <va-card-content>
            <div class="small text-muted">
              <div><b>Type:</b> {{ getTypes(pokemon) }}</div>
              <div><b>XP:</b> {{ pokemon.base_experience }}</div>
            </div>
          </va-card-content>
        </va-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useRouter } from 'vue-router'

const store = usePokemonStore()
const router = useRouter()
const search = ref('')

// Fetch Pokémon list on first mount
onMounted(() => {
  if (store.pokemons.length === 0) store.fetchPokemons()
})

// Filter by search input
const filteredPokemons = computed(() =>
  store.pokemons.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

function goToDetail(pokemon) {
  store.setSelectedPokemon(pokemon)
  router.push(`/pokemon/${pokemon.id}`)
}

function getTypes(pokemon) {
  return pokemon.types.map(t => t.type.name).join(', ')
}
</script>

<style scoped>
.pokemon-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}
.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
</style>
