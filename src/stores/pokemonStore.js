import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemonStore', {
  state: () => ({
    pokemons: [],
    selectedPokemon: null,
    loading: false,
  }),
  actions: {
    async fetchPokemons() {
      this.loading = true
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
      const data = await res.json()
      const detailed = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())))
      this.pokemons = detailed
      this.loading = false
    },
    setSelectedPokemon(pokemon) {
      this.selectedPokemon = pokemon
    },
    updatePokemon(updated) {
      const idx = this.pokemons.findIndex(p => p.id === updated.id)
      if (idx !== -1) {
        this.pokemons[idx] = updated
        // Update selected if it's being viewed
        if (this.selectedPokemon?.id === updated.id) {
          this.selectedPokemon = updated
        }
      }
    }
  }
})
