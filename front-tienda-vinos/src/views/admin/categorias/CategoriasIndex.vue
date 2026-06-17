<template>
  <div class="index-view">
    <header class="index-header">
      <div class="header-info">
        <h1>Arquitectura de Coleccion</h1>
        <p>Gestiona las categorías editoriales que estructuran la cava digital.</p>
      </div>
      <router-link :to="{ name: 'admin.categorias.create' }" custom v-slot="{ navigate }">
        <Button label="Nueva Categoria Principal" icon="pi pi-plus" @click="navigate" style="background-color: var(--primary);border: none;"/>
      </router-link>
    </header>

    <Card class="admin-card mb-4 bg-transparent">
      <template #content>
        <div class="flex flex-column md:flex-row gap-3 md:align-items-center">
          <IconField class="flex-1">
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchQuery" class="w-full" placeholder="Buscar categorías..." />
          </IconField>
          <Button v-if="searchQuery" label="Limpiar filtros" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearSearch" />
        </div>
      </template>
    </Card>

    <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

    <DataTable v-else :value="displayCategorias" :loading="loading" dataKey="id_categoria" class="admin-table" stripedRows>
      <template #empty>No se encontraron categorías.</template>

      <Column header="Estructura de Categoría">
        <template #body="{ data: cat }">
          <div class="flex align-items-center gap-3" :style="{ paddingLeft: cat.nivel > 1 ? '2rem' : '0' }">
            <i :class="cat.nivel === 1 ? 'pi pi-folder' : 'pi pi-angle-right text-500'"></i>
            <span class="font-bold product-name">{{ cat.nombre }}</span>
          </div>
        </template>
      </Column>

      <Column header="Nivel">
        <template #body="{ data: cat }">
          <Tag :value="cat.nivel === 1 ? 'Principal' : 'Subnivel'" :severity="cat.nivel === 1 ? 'success' : 'secondary'" />
        </template>
      </Column>

      <Column header="Padre">
        <template #body="{ data: cat }">{{ cat.padre ? cat.padre.nombre : 'Raiz' }}</template>
      </Column>

      <Column header="Acciones" bodyClass="text-right">
        <template #body="{ data: cat }">
          <div class="flex justify-content-end gap-2">
            <router-link v-if="cat.nivel === 1" :to="{ name: 'admin.categorias.create', query: { parent_id: cat.id_categoria } }" custom v-slot="{ navigate }">
              <Button icon="pi pi-plus-circle" severity="secondary" text rounded aria-label="Agregar subcategoria" @click="navigate" />
            </router-link>
            <router-link :to="{ name: 'admin.categorias.edit', params: { id: cat.id_categoria } }" custom v-slot="{ navigate }">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Editar" @click="navigate" />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Eliminar" @click="openDeleteModal(cat)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="deleteModal.visible" modal header="Eliminar Categoría" :style="{ width: '32rem' }">
      <p class="mb-3">Estás a punto de eliminar <strong>{{ deleteModal.categoria?.nombre }}</strong>. Esta acción es irreversible.</p>
      <Message severity="warn">Si la categoría esta en uso por productos, la eliminación fallará.</Message>
      <template #footer>
        <Button label="Cancelar" severity="secondary" outlined :disabled="deleteModal.loading" @click="closeDeleteModal" />
        <Button label="Eliminar Permanentemente" severity="danger" :loading="deleteModal.loading" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CategoriaController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const notif = useNotificationStore()
const categorias = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const displayCategorias = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  const matches = (c) => {
    if (!q) return true
    return c.nombre.toLowerCase().includes(q) || (c.descripcion && c.descripcion.toLowerCase().includes(q))
  }

  if (q) {
    return categorias.value
      .filter(matches)
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  const parents = categorias.value.filter(c => c.nivel === 1).sort((a, b) => a.nombre.localeCompare(b.nombre))
  const children = categorias.value.filter(c => c.nivel !== 1)

  const mapChildren = {}
  children.forEach(ch => {
    const pid = ch.padre ? ch.padre.id_categoria : null
    if (!mapChildren[pid]) mapChildren[pid] = []
    mapChildren[pid].push(ch)
  })

  const result = []
  parents.forEach(p => {
    result.push(p)
    const chs = mapChildren[p.id_categoria] || []
    chs.sort((a, b) => a.nombre.localeCompare(b.nombre))
    chs.forEach(c => result.push(c))
  })

  const parentIds = new Set(parents.map(p => p.id_categoria))
  categorias.value.forEach(c => {
    if (c.nivel !== 1 && (!c.padre || !parentIds.has(c.padre.id_categoria))) {
      result.push(c)
    }
  })

  return result
})

async function fetchCategorias() {
  loading.value = true
  try {
    const result = await CategoriaController.obtenerCategorias({ per_page: 100 })

    if (!result.success) {
      throw new Error(result.message)
    }

    categorias.value = result.categorias
  } catch (err) {
    error.value = 'Error al cargar las categorías.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
const deleteModal = ref({ visible: false, categoria: null, loading: false })

function openDeleteModal(cat) {
  deleteModal.value = { visible: true, categoria: cat, loading: false }
}

function closeDeleteModal() {
  if (deleteModal.value.loading) return
  deleteModal.value = { visible: false, categoria: null, loading: false }
}

async function confirmDelete() {
  if (!deleteModal.value || !deleteModal.value.categoria) return
  deleteModal.value.loading = true
  try {
    const result = await CategoriaController.eliminarCategoria(deleteModal.value.categoria.id_categoria)
    if (!result.success) throw new Error(result.message)
    notif.show('Categoría eliminada con éxito.', 'success')
    deleteModal.value.loading = false
    closeDeleteModal()
    await fetchCategorias()
  } catch (err) {
    deleteModal.value.loading = false
    const msg = err.message || 'Error al eliminar la categoría.'
    notif.show(msg, 'error')
  }
}

function clearSearch() {
  searchQuery.value = ''
}

onMounted(fetchCategorias)
</script>
