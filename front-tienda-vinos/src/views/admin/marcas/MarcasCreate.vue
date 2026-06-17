<template>
  <div class="create-view-wrapper">
    <form @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Nueva Casa Vinicola</h1>
          <p>Registra una nueva bodega para catalogar sus creaciones en la tienda.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.marcas.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Guardar Bodega" icon="pi pi-save" :loading="loading" />
        </div>
      </header>

      <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <Card class="admin-card mb-4">
            <template #title>Identidad de la Casa</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-6">
                  <label for="nombre" class="admin-label">Nombre de la Bodega</label>
                  <InputText v-model="form.nombre" id="nombre" class="w-full" placeholder="ej. Vega Sicilia" required />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="pais" class="admin-label">Pais de Origen</label>
                  <Select v-model="form.pais" id="pais" :options="paises" class="w-full" placeholder="Buscar pais..." filter />
                </div>
                <div class="field col-12">
                  <label for="sitio_web" class="admin-label">Sitio Web Oficial</label>
                  <InputText v-model="form.sitio_web" id="sitio_web" type="url" class="w-full" placeholder="https://www.bodega.com" />
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card">
            <template #title>Historia y Legado</template>
            <template #content>
              <Textarea v-model="form.descripcion" id="descripcion" rows="7" class="w-full" autoResize placeholder="Cuentanos la historia de esta bodega, sus metodos y filosofia..." />
            </template>
          </Card>
        </div>

        <div class="col-12 lg:col-4">
          <Message severity="info" :closable="false">
            La historia de la bodega es tan importante como el vino mismo. Resalta tradicion, origen e innovacion.
          </Message>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { MarcaController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notif = useNotificationStore()

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

async function submitForm() {
  loading.value = true
  error.value = null
  try {
    const result = await MarcaController.crearMarca(form)
    if (!result.success) throw result
    notif.show('Marca creada exitosamente.')
    router.push({ name: 'admin.marcas.index' })
  } catch (err) {
    error.value = err.status === 422
      ? err.message || 'Datos invalidos.'
      : 'Ocurrio un error inesperado al guardar.'
  } finally {
    loading.value = false
  }
}
</script>
