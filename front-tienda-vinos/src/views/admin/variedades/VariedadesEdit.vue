<template>
  <div class="create-view-wrapper">
    <div v-if="initialLoading" class="admin-loading">
      <ProgressSpinner />
    </div>

    <form v-else @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Editar Variedad de Uva</h1>
          <p>Actualiza la definicion y perfil de esta cepa en la cava.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.variedades.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Actualizar Variedad" icon="pi pi-save" :loading="loading" />
        </div>
      </header>

      <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <Card class="admin-card mb-4">
            <template #title>Perfil de la Variedad</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-6">
                  <label for="nombre" class="admin-label">Nombre de la Variedad</label>
                  <InputText v-model="form.nombre" id="nombre" class="w-full" placeholder="ej. Cabernet Sauvignon" required />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="tipo" class="admin-label">Tipo de Uva</label>
                  <Select v-model="form.tipo" id="tipo" :options="tipoOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Seleccionar..." required />
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card">
            <template #title>Notas de Cepa</template>
            <template #content>
              <Textarea v-model="form.descripcion" id="descripcion" rows="7" class="w-full" autoResize placeholder="Describe las caracteristicas tipicas, aromas y sabores de esta variedad..." />
            </template>
          </Card>
        </div>

        <div class="col-12 lg:col-4">
          <Message severity="info" :closable="false">
            Asegurate de que la descripcion sea fiel a las caracteristicas de la cepa para orientar al consumidor.
          </Message>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VariedadController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const route = useRoute()
const notif = useNotificationStore()
const id = route.params.id

const initialLoading = ref(true)
const loading = ref(false)
const error = ref(null)
const tipoOptions = [
  { label: 'Tinta', value: 'Tinta' },
  { label: 'Blanca', value: 'Blanca' },
  { label: 'Aromatica', value: 'Aromatica' }
]

const form = reactive({
  nombre: '',
  tipo: '',
  descripcion: ''
})

async function fetchData() {
  try {
    const result = await VariedadController.obtenerVariedadPorId(id)
    if (!result.success) throw new Error(result.message)
    form.nombre = result.variedad.nombre
    form.tipo = result.variedad.tipo
    form.descripcion = result.variedad.descripcion || ''
  } catch (err) {
    error.value = 'No se encontro la variedad.'
    console.error(err)
  } finally {
    initialLoading.value = false
  }
}

async function submitForm() {
  loading.value = true
  error.value = null
  try {
    const result = await VariedadController.actualizarVariedad(id, form)
    if (!result.success) throw result
    notif.show('Variedad actualizada exitosamente.')
    router.push({ name: 'admin.variedades.index' })
  } catch (err) {
    error.value = err.status === 422
      ? err.message || 'Datos invalidos.'
      : 'Ocurrio un error inesperado.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
