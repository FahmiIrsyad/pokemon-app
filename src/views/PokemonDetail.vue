<template>
  <div class="container py-4">
    <va-button color="secondary" @click="$router.back()" class="mb-4">
      ← Back to List
    </va-button>

    <div v-if="!selectedPokemon" class="text-center">
      <va-progress-bar indeterminate />
    </div>

    <div v-else>
      <h2 class="text-primary text-capitalize">{{ selectedPokemon.name }} (ID: {{ selectedPokemon.id }})</h2>

      <div class="text-center my-4">
        <img
          :src="selectedPokemon.sprites.other['official-artwork'].front_default"
          alt="Artwork"
          class="img-fluid"
          style="max-height: 200px"
        />
      </div>

      <va-form @submit.prevent="saveEdit">
        <table class="table table-striped table-bordered">
          <tbody>
            <tr>
              <th>Name</th>
              <td><va-input v-model="editData.name" /></td>
            </tr>
            <tr>
              <th>Base Experience</th>
              <td><va-input type="number" v-model.number="editData.base_experience" /></td>
            </tr>
            <tr>
              <th>Height</th>
              <td><va-input type="number" v-model.number="editData.height" /></td>
            </tr>
            <tr>
              <th>Weight</th>
              <td><va-input type="number" v-model.number="editData.weight" /></td>
            </tr>
            <tr>
              <th>Types</th>
              <td>{{ selectedPokemon.types.map(t => t.type.name).join(', ') }}</td>
            </tr>
            <tr>
              <th>Abilities</th>
              <td>{{ selectedPokemon.abilities.map(a => a.ability.name).join(', ') }}</td>
            </tr>
            <tr>
              <th>Stats</th>
              <td>
                <ul>
                  <li v-for="s in selectedPokemon.stats" :key="s.stat.name">
                    {{ s.stat.name }}: {{ s.base_stat }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>Moves</th>
              <td>{{ selectedPokemon.moves.map(m => m.move.name).slice(0, 10).join(', ') }}...</td>
            </tr>
            <tr>
              <th>Species</th>
              <td>{{ selectedPokemon.species.name }}</td>
            </tr>
            <tr>
              <th>Forms</th>
              <td>{{ selectedPokemon.forms.map(f => f.name).join(', ') }}</td>
            </tr>
            <tr>
              <th>Game Indices</th>
              <td>{{ selectedPokemon.game_indices.length }}</td>
            </tr>
            <tr>
              <th>Encounter URL</th>
              <td><a :href="selectedPokemon.location_area_encounters" target="_blank">View Encounters</a></td>
            </tr>
          </tbody>
        </table>

        <va-button :loading="saving" type="submit" color="primary" block>Save Changes</va-button>
      </va-form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemonStore'
import { useToast } from 'vuestic-ui'

const route = useRoute()
const router = useRouter()
const store = usePokemonStore()
const { push } = useToast()
const saving = ref(false)

const selectedPokemon = ref(null)
const loading = ref(true)

// ✅ All editable fields in one object
const editData = ref({
  name: '',
  base_experience: 0,
  height: 0,
  weight: 0,
  // Add more fields as needed
})

// 🔄 Watch for store updates to load the correct Pokémon
watch(
  () => store.pokemons,
  (pokemons) => {
    const id = parseInt(route.params.id)
    const pokemon = pokemons.find(p => p.id === id)
    if (pokemon) {
      selectedPokemon.value = pokemon

      // ✅ Copy values to editable object
      editData.value = {
        name: pokemon.name,
        base_experience: pokemon.base_experience,
        height: pokemon.height,
        weight: pokemon.weight,
      }
    } else {
      router.push('/')
    }
    loading.value = false
  },
  { immediate: true }
)

async function saveEdit() {
  if (!editData.value.name.trim()) return

  saving.value = true
  try {
    // Optional delay for realism
    await new Promise(resolve => setTimeout(resolve, 500))

    const updated = {
      ...selectedPokemon.value,
      name: editData.value.name.trim(),
      base_experience: Number(editData.value.base_experience),
      height: Number(editData.value.height),
      weight: Number(editData.value.weight),
    }

    store.updatePokemon(updated)
    selectedPokemon.value = { ...updated }

    push({
      message: '✅ Pokémon updated successfully!',
      color: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  } finally {
    // ✅ Always turn off the spinner
    saving.value = false
  }
}


</script>

<style scoped>
table {
  width: 100%;
}
th {
  width: 200px;
  background-color: #f5f5f5;
  font-weight: bold;
}
td {
  vertical-align: middle;
}
</style>
