<template>
  <div class="create-view-wrapper">
    <div v-if="initialLoading" class="admin-loading">
      <ProgressSpinner />
    </div>

    <form v-else @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Editar Casa Vinícola</h1>
          <p>Actualiza la información y el legado de esta bodega en el catálogo.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.marcas.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Actualizar Bodega" :loading="loading" style="background-color: var(--primary);border: none;"/>
        </div>
      </header>

      <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <Card class="admin-card mb-4 bg-transparent">
            <template #title>Identidad de la Casa</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-6">
                  <label for="nombre" class="admin-label">Nombre de la Bodega</label>
                  <InputText v-model="form.nombre" id="nombre" class="w-full" placeholder="ej. Vega Sicilia" required style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
                <div class="field col-12 md:col-6">
                  <label for="pais" class="admin-label">País de Origen</label>
                  <Select v-model="form.pais" id="pais" :options="paises" class="w-full" placeholder="Buscar país..." filter style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
                <div class="field col-12">
                  <label for="sitio_web" class="admin-label">Sitio Web Oficial</label>
                  <InputText v-model="form.sitio_web" id="sitio_web" type="url" class="w-full" placeholder="https://www.bodega.com" style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card bg-transparent">
            <template #title>Historia y Legado</template>
            <template #content>
              <Textarea v-model="form.descripcion" id="descripcion" rows="7" class="w-full" autoResize placeholder="Cuentanos la historia de esta bodega, sus metodos y filosofia..." style="border: none;background-color: var(--surface-container-low);border-radius: 12px;"/>
            </template>
          </Card>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MarcaController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const route = useRoute()
const notif = useNotificationStore()
const id = route.params.id

const initialLoading = ref(true)
const loading = ref(false)
const error = ref(null)

const paises = [
  'Argentina', 'Australia', 'Austria', 'Chile', 'Espana', 'Estados Unidos',
  'Francia', 'Alemania', 'Italia', 'Nueva Zelanda', 'Portugal', 'Sudafrica',
  'Uruguay', 'Grecia', 'Hungria', 'Costa Rica'
]

const form = reactive({
  nombre: '',
  pais: '',
  sitio_web: '',
  descripcion: ''
})

async function fetchData() {
  try {
    const result = await MarcaController.obtenerMarcaPorId(id)
    if (!result.success) throw new Error(result.message)
    form.nombre = result.marca.nombre
    form.pais = result.marca.pais || ''
    form.sitio_web = result.marca.sitio_web || ''
    form.descripcion = result.marca.descripcion || ''
  } catch (err) {
    error.value = 'No se encontro la marca.'
    console.error(err)
  } finally {
    initialLoading.value = false
  }
}

async function submitForm() {
  loading.value = true
  error.value = null
  try {
    const result = await MarcaController.actualizarMarca(id, form)
    if (!result.success) throw result
    notif.show('Marca actualizada exitosamente.')
    router.push({ name: 'admin.marcas.index' })
  } catch (err) {
    error.value = err.status === 422
      ? err.message || 'Datos inválidos.'
      : 'Ocurrió un error inesperado.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
