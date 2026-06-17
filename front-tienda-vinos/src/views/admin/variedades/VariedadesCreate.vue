<template>
  <div class="create-view-wrapper">
    <form @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Nueva Variedad de Uva</h1>
          <p>Define una nueva cepa para enriquecer el perfil sensorial de los vinos catalogados.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.variedades.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Guardar Variedad" icon="pi pi-save" :loading="loading" />
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
            Cada variedad aporta una estructura unica al vino. Describe su perfil aromatico para guiar la cata.
          </Message>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { VariedadController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notif = useNotificationStore()

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

async function submitForm() {
  loading.value = true
  error.value = null
  try {
    const result = await VariedadController.crearVariedad(form)
    if (!result.success) throw result
    notif.show('Variedad creada exitosamente.')
    router.push({ name: 'admin.variedades.index' })
  } catch (err) {
    error.value = err.status === 422
      ? err.message || 'Datos invalidos.'
      : 'Ocurrio un error inesperado al guardar.'
  } finally {
    loading.value = false
  }
}
</script>
