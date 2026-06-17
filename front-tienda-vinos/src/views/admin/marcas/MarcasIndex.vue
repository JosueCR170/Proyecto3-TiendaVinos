<template>
  <div class="index-view">
    <header class="index-header">
      <div class="header-info">
        <h1>Casas y Bodegas</h1>
        <p>Gestiona los productores y casas vinicolas que dan vida a la coleccion.</p>
      </div>
      <router-link :to="{ name: 'admin.marcas.create' }" custom v-slot="{ navigate }">
        <Button label="Nueva Bodega" icon="pi pi-plus" @click="navigate" />
      </router-link>
    </header>

    <Card class="admin-card mb-4">
      <template #content>
        <div class="flex flex-column md:flex-row gap-3 md:align-items-center">
          <IconField class="flex-1">
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchQuery" class="w-full" placeholder="Buscar por nombre o descripcion..." />
          </IconField>
          <IconField class="flex-1">
            <InputIcon class="pi pi-globe" />
            <InputText v-model="searchPais" class="w-full" placeholder="Buscar por pais..." />
          </IconField>
          <Button v-if="searchQuery || searchPais" label="Limpiar filtros" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" />
        </div>
      </template>
    </Card>

    <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

    <DataTable v-else :value="filteredList" :loading="loading" dataKey="id_marca" class="admin-table" stripedRows>
      <template #empty>No se encontraron marcas o bodegas.</template>

      <Column header="Bodega y Origen">
        <template #body="{ data: item }">
          <div class="flex flex-column gap-1">
            <span class="font-bold text-primary">{{ item.nombre }}</span>
            <span class="text-sm text-600">{{ item.pais || 'N/A' }} - {{ item.descripcion || 'Sin descripcion' }}</span>
          </div>
        </template>
      </Column>

      <Column header="Presencia Digital">
        <template #body="{ data: item }">
          <Button v-if="item.sitio_web" as="a" :href="item.sitio_web" target="_blank" label="Visitar Sitio" icon="pi pi-external-link" severity="secondary" text />
          <span v-else class="text-sm text-500">N/A</span>
        </template>
      </Column>

      <Column header="Acciones" bodyClass="text-right">
        <template #body="{ data: item }">
          <div class="flex justify-content-end gap-2">
            <router-link :to="{ name: 'admin.marcas.edit', params: { id: item.id_marca } }" custom v-slot="{ navigate }">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Editar" @click="navigate" />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Eliminar" @click="openDeleteModal(item)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="deleteModal.visible" modal header="Eliminar Marca" :style="{ width: '32rem' }">
      <p class="mb-3">Estas a punto de eliminar <strong>{{ deleteModal.item?.nombre }}</strong>. Esta accion es irreversible.</p>
      <Message severity="warn">Si la marca esta asociada a productos, la eliminacion fallara.</Message>
      <template #footer>
        <Button label="Cancelar" severity="secondary" outlined :disabled="deleteModal.loading" @click="closeDeleteModal" />
        <Button label="Eliminar Permanentemente" severity="danger" :loading="deleteModal.loading" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MarcaController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const notif = useNotificationStore()
const items = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const searchPais = ref('')

const filteredList = computed(() => {
  return items.value.filter(item => {
    const matchName = !searchQuery.value || item.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) || (item.descripcion && item.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchPais = !searchPais.value || (item.pais && item.pais.toLowerCase().includes(searchPais.value.toLowerCase()))
    return matchName && matchPais
  })
})

async function fetchItems() {
  loading.value = true
  try {
    const result = await MarcaController.obtenerMarcas({ per_page: 100 })

    if (!result.success) {
      throw new Error(result.message)
    }

    items.value = result.marcas
  } catch (err) {
    error.value = 'Error al cargar las marcas.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
const deleteModal = ref({ visible: false, item: null, loading: false })

function openDeleteModal(item) {
  deleteModal.value = { visible: true, item, loading: false }
}

function closeDeleteModal() {
  if (deleteModal.value.loading) return
  deleteModal.value = { visible: false, item: null, loading: false }
}

async function confirmDelete() {
  if (!deleteModal.value || !deleteModal.value.item) return
  deleteModal.value.loading = true
  try {
    const result = await MarcaController.eliminarMarca(deleteModal.value.item.id_marca)
    if (!result.success) throw new Error(result.message)
    notif.show('Marca eliminada con exito.', 'success')
    deleteModal.value.loading = false
    closeDeleteModal()
    await fetchItems()
  } catch (err) {
    deleteModal.value.loading = false
    const msg = err.message || 'Error al eliminar la marca. Puede estar en uso.'
    notif.show(msg, 'error')
  }
}

function clearFilters() {
  searchQuery.value = ''
  searchPais.value = ''
}

onMounted(fetchItems)
</script>
