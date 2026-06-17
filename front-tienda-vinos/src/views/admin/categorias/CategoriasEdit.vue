<template>
  <div class="create-view-wrapper">
    <div v-if="initialLoading" class="admin-loading">
      <ProgressSpinner />
    </div>

    <form v-else @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Editar Categoría Editorial</h1>
          <p>Ajusta la definición y posición jerárquica de esta categoría.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.categorias.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Actualizar Categoría" :loading="loading" style="background-color: var(--primary);border: none;" />
        </div>
      </header>

      <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

      <div class="grid">
        <div class="col-12 lg:col-8">
          <Card class="admin-card mb-4 bg-transparent">
            <template #title>Identidad de la Categoría</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-6">
                  <label for="nombre" class="admin-label">Nombre de la Categoría</label>
                  <InputText v-model="form.nombre" id="nombre" class="w-full" placeholder="ej. Tintos de Guarda" required style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
                <div class="field col-12 md:col-6">
                  <label for="nivel_display" class="admin-label">Nivel Jerárquico</label>
                  <Select v-model="form.nivel" id="nivel_display" :options="nivelOptions" optionLabel="label" optionValue="value" class="w-full" disabled style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
                <div class="field col-12">
                  <label for="nombre_padre" class="admin-label">Categoría Padre</label>
                  <InputText v-if="form.nivel === 1" modelValue="Ninguna (Raiz)" class="w-full" disabled style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                  <Select v-else v-model="form.nombre_padre" id="nombre_padre" :options="categoriasPrincipales" optionLabel="nombre" optionValue="id_categoria" class="w-full" placeholder="Seleccione una categoria superior" required style="border: none;border-bottom: 1px solid var(--outline-variant);background: transparent;border-radius: 0;"/>
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card bg-transparent">
            <template #title>Descripción Editorial</template>
            <template #content>
              <Textarea v-model="form.descripcion" id="descripcion" rows="7" class="w-full" autoResize placeholder="Define el propósito y carácter de esta categoría..." style="border: none;background-color: var(--surface-container-low);border-radius: 12px;"/>
            </template>
          </Card>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CategoriaController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const route = useRoute()
const notif = useNotificationStore()

const id = route.params.id
const loading = ref(false)
const initialLoading = ref(true)
const error = ref(null)
const todasCategorias = ref([])
const nivelOptions = [
  { label: 'Nivel 1 (Principal)', value: 1 },
  { label: 'Nivel 2 (Subcategoria)', value: 2 }
]

const form = reactive({
  nombre: '',
  nivel: 1,
  nombre_padre: '',
  descripcion: ''
})

const categoriasPrincipales = computed(() =>
  todasCategorias.value.filter(c => c.nivel === 1 && c.id_categoria != id)
)

async function fetchData() {
  initialLoading.value = true
  try {
    const result = await CategoriaController.obtenerCategorias({ per_page: 100 })
    if (!result.success) throw new Error(result.message)
    todasCategorias.value = result.categorias
    const cat = result.categorias.find(c => c.id_categoria == id)
    if (cat) {
      form.nombre = cat.nombre
      form.nivel = cat.nivel
      form.nombre_padre = cat.nombre_padre || ''
      form.descripcion = cat.descripcion || ''
    } else {
      error.value = 'No se encontro la categoria solicitada.'
    }
  } catch (err) {
    error.value = 'Error al cargar los datos de la categoria.'
    console.error(err)
  } finally {
    initialLoading.value = false
  }
}

async function submitForm() {
  loading.value = true
  error.value = null
  try {
    const payload = { ...form }
    if (payload.nivel === 1) payload.nombre_padre = null
    const result = await CategoriaController.actualizarCategoria(id, payload)
    if (!result.success) throw result
    notif.show('Categoria actualizada exitosamente.')
    router.push({ name: 'admin.categorias.index' })
  } catch (err) {
    error.value = err.status === 422
      ? err.message || 'Datos invalidos. Verifica el formulario.'
      : 'Ocurrio un error inesperado al actualizar la categoria.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
