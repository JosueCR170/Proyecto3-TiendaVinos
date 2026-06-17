<template>
  <div class="index-view">
    <header class="index-header">
      <div class="header-info">
        <h1>Inventario de Productos</h1>
        <p>Gestiona la selección editorial de licores finos y vinos de cosecha.</p>
      </div>
      <router-link :to="{ name: 'admin.productos.create' }" custom v-slot="{ navigate }">
        <Button label="Nuevo Producto" icon="pi pi-plus" @click="navigate" style="background-color: var(--primary);border: none;"/>
      </router-link>
    </header>

    <Card class="admin-card mb-4 bg-transparent">
      <template #content>
        <div class="grid formgrid">
          <div class="field col-12 md:col-6 lg:col-3">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters.search" class="w-full" placeholder="Buscar producto..." @keyup.enter="applyFilters" />
            </IconField>
          </div>
          <div class="field col-12 md:col-6 lg:col-3">
            <Select v-model="filters.categoria" :options="categoriaOptions" optionLabel="nombre" optionValue="id_categoria" class="w-full" placeholder="Todas las categorías" />
          </div>
          <div class="field col-12 md:col-6 lg:col-3">
            <Select v-model="filters.marca" :options="marcaOptions" optionLabel="nombre" optionValue="id_marca" class="w-full" placeholder="Todas las marcas" />
          </div>
          <div class="field col-12 md:col-6 lg:col-3">
            <Select v-model="filters.pais" :options="paisOptions" class="w-full" placeholder="Todos los países" filter />
          </div>
        </div>
        <div class="flex flex-wrap gap-2 justify-content-end">
          <Button label="Filtrar" icon="pi pi-filter" @click="applyFilters" outlined style="color:var(--primary);border: 1px solid var(--primary);"/>
          <Button v-if="hasActiveFilters" label="Limpiar filtros" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" />
        </div>
      </template>
    </Card>

    <Message v-if="error" severity="error" class="mb-4">
      <div class="flex align-items-center justify-content-between gap-3">
        <span>{{ error }}</span>
        <Button label="Reintentar" severity="danger" size="small" outlined @click="fetchProductos" />
      </div>
    </Message>

    <DataTable v-else :value="productos" :loading="loading" dataKey="id_producto" class="admin-table " stripedRows>
      <template #empty>No se encontraron productos que coincidan con los criterios.</template>

      <Column>
        <template #header>
          <Button :label="`Producto`" :icon="sortPrimeIcon('nombre')" severity="secondary" text @click="toggleSort('nombre')" />
        </template>
        <template #body="{ data: producto }">
          <div class="flex align-items-center gap-3">
            <div class="admin-thumb">
              <img v-if="producto.imagen_url" :src="producto.imagen_url" :alt="producto.nombre">
              <i v-else class="pi pi-image text-400"></i>
            </div>
            <div class="flex flex-column gap-1">
              <span class="font-bold product-name">{{ producto.nombre }}</span>
              <span class="text-xs text-600">{{ producto.pais ?? 'N/A' }} - {{ producto.contenido_ml ? producto.contenido_ml + 'ml' : 'N/A' }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column>
        <template #header>
          <div class="flex align-items-center gap-1">
            <Button label="Categoría" :icon="sortPrimeIcon('categoria')" severity="secondary" text @click="toggleSort('categoria')" />
            <Button label="Marca" :icon="sortPrimeIcon('marca')" severity="secondary" text @click="toggleSort('marca')" />
          </div>
        </template>
        <template #body="{ data: producto }">
          <div class="flex flex-column gap-1">
            <span class="font-medium">{{ producto.categoria?.nombre ?? 'Sin Categoria' }}</span>
            <span class="text-xs text-600">{{ producto.marca?.nombre ?? 'Sin Marca' }}</span>
          </div>
        </template>
      </Column>

      <Column>
        <template #header>
          <Button label="Stock" :icon="sortPrimeIcon('cantidad')" severity="secondary" text @click="toggleSort('cantidad')" />
        </template>
        <template #body="{ data: producto }">
          <Tag :value="`${producto.cantidad} Unidades`" :severity="producto.cantidad <= 10 ? 'danger' : 'success'" />
        </template>
      </Column>

      <Column>
        <template #header>
          <Button label="Precio" :icon="sortPrimeIcon('precio')" severity="secondary" text @click="toggleSort('precio')" />
        </template>
        <template #body="{ data: producto }">
          <span class="font-bold price-text">{{ formatPrice(producto.precio) }}</span>
        </template>
      </Column>

      <Column>
        <template #header>
          <Button label="Estado" :icon="sortPrimeIcon('estado')" severity="secondary" text @click="toggleSort('estado')" />
        </template>
        <template #body="{ data: producto }">
          <Tag :value="producto.estado ? 'Activo' : 'Inactivo'" :severity="producto.estado ? 'success' : 'danger'" />
        </template>
      </Column>

      <Column header="Acciones" bodyClass="text-right">
        <template #body="{ data: producto }">
          <div class="flex justify-content-end gap-2">
            <router-link :to="{ name: 'admin.productos.edit', params: { id: producto.id_producto } }" custom v-slot="{ navigate }">
              <Button icon="pi pi-pencil" severity="secondary" text rounded aria-label="Editar" @click="navigate" />
            </router-link>
            <Button icon="pi pi-trash" severity="danger" text rounded aria-label="Eliminar" @click="openDeleteModal(producto)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <div v-if="pagination.total > 0" class="flex flex-column md:flex-row md:align-items-center justify-content-between gap-3 mt-4 pagination-controls">
      <span class="text-sm text-600">
        Mostrando <strong>{{ pagination.from ?? 0 }}</strong> a <strong>{{ pagination.to ?? 0 }}</strong> de <strong>{{ pagination.total }}</strong> productos
      </span>
      <div class="flex gap-2 justify-content-end">
        <Button icon="pi pi-chevron-left" severity="secondary" outlined :disabled="pagination.currentPage === 1" @click="goToPage(pagination.currentPage - 1)" />
        <Button v-for="page in visiblePages" :key="page" :label="String(page)" :outlined="page !== pagination.currentPage" severity="secondary" @click="goToPage(page)" />
        <Button icon="pi pi-chevron-right" severity="secondary" outlined :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.currentPage + 1)" />
      </div>
    </div>

    <Dialog v-model:visible="deleteModal.visible" modal header="Eliminar Producto" :style="{ width: '34rem' }">
      <p class="mb-3">
        Estas a punto de eliminar <strong>{{ deleteModal.producto?.nombre }}</strong> de la coleccion.
      </p>
      <Message severity="warn">
        Esta accion es irreversible. Se eliminaran permanentemente todos los datos tecnicos y notas de cata asociados.
      </Message>
      <template #footer>
        <Button label="Mantener en Cava" severity="secondary" outlined :disabled="deleteModal.loading" @click="closeDeleteModal" />
        <Button label="Eliminar Permanentemente" severity="danger" :loading="deleteModal.loading" @click="confirmDelete" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProductoController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const route  = useRoute()
const router = useRouter()
const notif  = useNotificationStore()

const productos  = ref([])
const categorias = ref([])
const marcas     = ref([])
const paises     = ref({})
const loading    = ref(false)
const error      = ref(null)

const pagination = reactive({
  currentPage: 1,
  lastPage:    1,
  total:       0,
  from:        null,
  to:          null,
})

const sort = reactive({
  field:     'id_producto',
  direction: 'desc',
})

const filters = reactive({
  search:    route.query.search    ?? '',
  categoria: route.query.categoria ?? '',
  marca:     route.query.marca     ?? '',
  pais:      route.query.pais      ?? '',
})

const deleteModal = reactive({
  visible:  false,
  producto: null,
  loading:  false,
})

const hasActiveFilters = computed(() =>
  Object.values(filters).some(v => v !== '')
)

const categoriaOptions = computed(() => [
  { id_categoria: '', nombre: 'Todas las categorias' },
  ...categorias.value,
])

const marcaOptions = computed(() => [
  { id_marca: '', nombre: 'Todas las marcas' },
  ...marcas.value,
])

const paisOptions = computed(() => ['', ...Object.values(paises.value)])

const visiblePages = computed(() => {
  const current = pagination.currentPage
  const last    = pagination.lastPage
  const start   = Math.max(1, current - 2)
  const end     = Math.min(last, current + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function sortIcon(field) {
  if (sort.field !== field) return 'unfold_more'
  return sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function sortPrimeIcon(field) {
  if (sort.field !== field) return 'pi pi-sort-alt'
  return sort.direction === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function buildQuery(page = 1) {
  const q = { page }
  if (filters.search)    q.search    = filters.search
  if (filters.categoria) q.categoria = filters.categoria
  if (filters.marca)     q.marca     = filters.marca
  if (filters.pais)      q.pais      = filters.pais
  if (sort.field !== 'id_producto') q.sort = sort.field
  if (sort.direction !== 'desc')    q.direction = sort.direction
  return q
}

function syncFromQuery() {
  filters.search    = route.query.search    ?? ''
  filters.categoria = route.query.categoria ?? ''
  filters.marca     = route.query.marca     ?? ''
  filters.pais      = route.query.pais      ?? ''
  sort.field        = route.query.sort      ?? 'id_producto'
  sort.direction    = route.query.direction ?? 'desc'
  pagination.currentPage = Number(route.query.page ?? 1)
}

async function fetchFormData() {
  try {
    const result = await ProductoController.obtenerFormData()

    if (!result.success) {
      throw new Error(result.message)
    }

    categorias.value = result.categorias
    marcas.value     = result.marcas
    paises.value     = result.paises
  } catch {
    console.warn('No se pudieron cargar los datos de formulario.')
  }
}

async function fetchProductos() {
  loading.value = true
  error.value   = null

  try {
    const result = await ProductoController.obtenerProductos({
      page:      pagination.currentPage,
      search:    filters.search    || undefined,
      categoria: filters.categoria || undefined,
      marca:     filters.marca     || undefined,
      pais:      filters.pais      || undefined,
      sort:      sort.field,
      direction: sort.direction,
    })

    if (!result.success) {
      throw new Error(result.message)
    }

    productos.value        = result.productos
    pagination.currentPage = result.pagination.currentPage
    pagination.lastPage    = result.pagination.lastPage
    pagination.total       = result.pagination.total
    pagination.from        = result.pagination.from
    pagination.to          = result.pagination.to
  } catch (e) {
    error.value = 'Error al cargar los productos. Intente nuevamente.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  router.push({ query: buildQuery(1) })
}

function clearFilters() {
  filters.search    = ''
  filters.categoria = ''
  filters.marca     = ''
  filters.pais      = ''
  router.push({ query: {} })
}

function toggleSort(field) {
  if (sort.field === field) {
    sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.field     = field
    sort.direction = 'asc'
  }
  router.push({ query: buildQuery(pagination.currentPage) })
}

function goToPage(page) {
  if (page < 1 || page > pagination.lastPage) return
  router.push({ query: buildQuery(page) })
}

function openDeleteModal(producto) {
  deleteModal.producto = producto
  deleteModal.visible  = true
}

function closeDeleteModal() {
  if (deleteModal.loading) return
  deleteModal.visible  = false
  deleteModal.producto = null
}

async function confirmDelete() {
  if (!deleteModal.producto) return
  deleteModal.loading = true

  try {
    const result = await ProductoController.eliminarProducto(deleteModal.producto.id_producto)

    if (!result.success) {
      throw new Error(result.message)
    }

    notif.show('Producto eliminado de la bodega', 'success')
    deleteModal.loading = false
    closeDeleteModal()
    const isLastItemOnPage = productos.value.length === 1 && pagination.currentPage > 1
    await fetchProductos()
    if (isLastItemOnPage) goToPage(pagination.currentPage - 1)
  } catch (e) {
    const msg = e.message ?? 'Error al eliminar el producto.'
    notif.show(msg, 'error')
  } finally {
    deleteModal.loading = false
  }
}

watch(
  () => route.query,
  () => {
    syncFromQuery()
    fetchProductos()
  }
)

onMounted(() => {
  syncFromQuery()
  fetchFormData()
  fetchProductos()
})
</script>
