<template>
  <div class="index-view">
    <header class="index-header">
      <div class="header-info">
        <h1>Variedades de Uva</h1>
        <p>Gestiona las cepas y variedades que definen el caracter de cada botella.</p>
      </div>
      <router-link :to="{ name: 'admin.variedades.create' }" custom v-slot="{ navigate }">
        <Button label="Nueva Variedad" icon="pi pi-plus" @click="navigate" />
      </router-link>
    </header>

    <Card class="admin-card mb-4">
      <template #content>
        <div class="flex flex-column md:flex-row gap-3 md:align-items-center">
          <IconField class="flex-1">
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchQuery" class="w-full" placeholder="Buscar por nombre o tipo..." />
          </IconField>
          <Button v-if="searchQuery" label="Limpiar filtros" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearSearch" />
        </div>
      </template>
    </Card>

    <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

    <DataTable v-else :value="filteredList" :loading="loading" dataKey="id_variedad" class="admin-table" stripedRows>
      <template #empty>No se encontraron variedades.</template>

      <Column header="Variedad">
        <template #body="{ data: item }">
          <div class="flex flex-column gap-1">
            <span class="font-bold text-primary">{{ item.nombre }}</span>
            <span class="text-sm text-600">Variedad de tipo {{ item.tipo || 'N/A' }}</span>
          </div>
        </template>
      </Column>

      <Column header="Tipo">
        <template #body="{ data: item }">
          <Tag :value="item.tipo || 'N/A'" :severity="tipoSeverity(item.tipo)" />
        </template>
      </Column>

      <Column header="Acciones" bodyClass="text-right">
        <template #body="{ data: item }">
          <div class="flex justify-content-end gap-2">
            <router-link :to="{ name: 'admin.variedades.edit', params: { id: item.id_variedad } }" custom v-slot="{ navigate }">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Editar" @click="navigate" />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Eliminar" @click="openDeleteModal(item)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="deleteModal.visible" modal header="Eliminar Variedad" :style="{ width: '32rem' }">
      <p class="mb-3">Estas a punto de eliminar <strong>{{ deleteModal.item?.nombre }}</strong>. Esta accion es irreversible.</p>
      <Message severity="warn">Si la variedad esta asociada a productos, la eliminacion fallara.</Message>
      <template #footer>
        <Button label="Cancelar" severity="secondary" outlined :disabled="deleteModal.loading" @click="closeDeleteModal" />
        <Button label="Eliminar Permanentemente" severity="danger" :loading="deleteModal.loading" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { VariedadController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const notif = useNotificationStore()
const items = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredList = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(item =>
    item.nombre.toLowerCase().includes(q) ||
    (item.tipo && item.tipo.toLowerCase().includes(q))
  )
})

async function fetchItems() {
  loading.value = true
  try {
    const result = await VariedadController.obtenerVariedades({ per_page: 100 })

    if (!result.success) {
      throw new Error(result.message)
    }

    items.value = result.variedades
  } catch (err) {
    error.value = 'Error al cargar las variedades.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
const deleteModal = ref({ visible: false, item: null, loading: false })

function tipoSeverity(tipo) {
  if (tipo === 'Tinta') return 'danger'
  if (tipo === 'Blanca') return 'warn'
  if (tipo === 'Aromatica') return 'info'
  return 'secondary'
}

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
    const result = await VariedadController.eliminarVariedad(deleteModal.value.item.id_variedad)
    if (!result.success) throw new Error(result.message)
    notif.show('Variedad eliminada con exito.', 'success')
    deleteModal.value.loading = false
    closeDeleteModal()
    await fetchItems()
  } catch (err) {
    deleteModal.value.loading = false
    const msg = err.message || 'Error al eliminar la variedad. Puede estar en uso.'
    notif.show(msg, 'error')
  }
}

function clearSearch() { searchQuery.value = '' }

onMounted(fetchItems)
</script>
