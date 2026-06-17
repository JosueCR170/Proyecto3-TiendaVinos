<template>
  <main class="catalog-layout flex">

    <!-- ── Sidebar de filtros ─────────────────────────────────────────────── -->
    <aside class="filter-sidebar flex-shrink-0">
      <header class="mb-6">
        <h2 class="filter-heading">Filtrar Colección</h2>
        <p class="filter-sub">Refinando la bodega</p>
      </header>

      <!-- Búsqueda -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-search filter-icon"></i>Buscar Vino</h3>
        <IconField>
          <InputIcon class="pi pi-arrow-right cursor-pointer" @click="applyFilters" />
          <InputText
            v-model="filters.buscar"
            @keyup.enter="applyFilters"
            placeholder="Nombre del vino..."
            class="w-full"
          />
        </IconField>
      </section>

      <!-- Categoría -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-tag filter-icon"></i>Categoría</h3>
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center gap-2">
            <RadioButton v-model="filters.categoria" inputId="cat-todas" name="categoria" value="" @change="applyFilters" />
            <label for="cat-todas" class="radio-text">Todas</label>
          </div>
          <div v-for="cat in meta.categorias" :key="cat.id_categoria" class="flex align-items-center gap-2">
            <RadioButton
              v-model="filters.categoria"
              :inputId="`cat-${cat.id_categoria}`"
              name="categoria"
              :value="cat.id_categoria"
              @change="applyFilters"
            />
            <label :for="`cat-${cat.id_categoria}`" class="radio-text">{{ cat.nombre }}</label>
          </div>
        </div>
      </section>

      <!-- País -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-globe filter-icon"></i>País de Origen</h3>
        <div class="flex flex-column gap-3 scrollable-list">
          <div class="flex align-items-center gap-2">
            <RadioButton v-model="filters.pais" inputId="pais-todos" name="pais" value="" @change="applyFilters" />
            <label for="pais-todos" class="radio-text">Todos</label>
          </div>
          <div v-for="pais in meta.paises" :key="pais" class="flex align-items-center gap-2">
            <RadioButton v-model="filters.pais" :inputId="`pais-${pais}`" name="pais" :value="pais" @change="applyFilters" />
            <label :for="`pais-${pais}`" class="radio-text">{{ pais }}</label>
          </div>
        </div>
      </section>

      <!-- Bodega -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-building filter-icon"></i>Bodega</h3>
        <div class="flex flex-column gap-3 scrollable-list">
          <div class="flex align-items-center gap-2">
            <RadioButton v-model="filters.marca" inputId="marca-todas" name="marca" value="" @change="applyFilters" />
            <label for="marca-todas" class="radio-text">Todas</label>
          </div>
          <div v-for="marca in meta.marcas" :key="marca.id_marca" class="flex align-items-center gap-2">
            <RadioButton
              v-model="filters.marca"
              :inputId="`marca-${marca.id_marca}`"
              name="marca"
              :value="marca.id_marca"
              @change="applyFilters"
            />
            <label :for="`marca-${marca.id_marca}`" class="radio-text">{{ marca.nombre }}</label>
          </div>
        </div>
      </section>

      <!-- Variedad -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-tags filter-icon"></i>Cepa / Variedad</h3>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="v in meta.variedades"
            :key="v.id_variedad"
            :label="v.nombre"
            size="small"
            rounded
            :outlined="filters.variedad != v.id_variedad"
            class="variedad-btn"
            :class="{ 'variedad-active': filters.variedad == v.id_variedad }"
            @click="toggleVariedad(v.id_variedad)"
          />
        </div>
      </section>

      <!-- Solo descuentos -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-percentage filter-icon"></i>Ofertas</h3>
        <div class="flex align-items-center gap-2">
          <Checkbox v-model="filters.solo_descuentos" :binary="true" inputId="solo-desc" @change="applyFilters" />
          <label for="solo-desc" class="oferta-label">Solo con Descuento</label>
        </div>
      </section>

      <!-- Ordenar -->
      <section class="filter-section">
        <h3 class="filter-section-title"><i class="pi pi-sort-alt filter-icon"></i>Ordenar por</h3>
        <Select
          v-model="filters.orden"
          :options="ordenOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          @change="applyFilters"
        />
      </section>

      <!-- Limpiar -->
      <Button
        v-if="hasFilters"
        label="Limpiar filtros"
        icon="pi pi-times"
        text
        size="small"
        class="clear-btn"
        @click="clearFilters"
      />
    </aside>

    <!-- ── Grilla de productos ─────────────────────────────────────────────── -->
    <section class="flex-grow-1">
      <div class="flex justify-content-between align-items-end mb-6">
        <div>
          <h1 class="catalog-title">Nuestra Colección</h1>
          <p v-if="pagination.total" class="catalog-sub">
            Mostrando {{ pagination.from }}–{{ pagination.to }} de {{ pagination.total }} vinos curados.
          </p>
        </div>
      </div>

      <!-- Skeletons -->
      <div v-if="loading" class="grid">
        <div v-for="n in 6" :key="n" class="col-12 md:col-6 xl:col-4 product-grid-col">
          <Skeleton height="26rem" borderRadius="8px" />
        </div>
      </div>

      <!-- Productos -->
      <div v-else-if="productos.length" class="grid">
        <article
          v-for="producto in productos"
          :key="producto.id_producto"
          class="col-12 md:col-6 xl:col-4 product-grid-col"
        >
          <div class="product-card flex flex-column gap-3">
            <div class="relative">
              <router-link :to="`/catalogo/${producto.id_producto}`" class="block">
                <div class="product-image-frame border-round relative flex align-items-center justify-content-center">
                  <img
                    v-if="producto.imagen_url"
                    :alt="producto.nombre"
                    :src="producto.imagen_url"
                    class="product-image"
                  />
                  <i v-else class="pi pi-image empty-image-icon"></i>

                  <Tag
                    v-if="producto.descuento > 0"
                    :value="`-${producto.descuento}%`"
                    severity="danger"
                    class="discount-tag"
                  />

                  <div v-if="producto.cantidad <= 0" class="agotado-overlay">
                    <Tag value="Agotado" severity="contrast" class="agotado-tag" />
                  </div>
                </div>
              </router-link>

              <Button
  v-if="producto.cantidad > 0"
  icon="pi pi-cart-plus"
  rounded
  text
  class="cart-quick-btn"
  style="background:#2a0002; color:white;"
  @click="addToCart(producto)"
/>
            </div>

            <div class="product-info">
              <router-link :to="`/catalogo/${producto.id_producto}`">
                <h3 class="product-name">{{ producto.nombre }}</h3>
              </router-link>
              <div class="flex justify-content-between align-items-center product-meta">
                <span>
                  {{ producto.marca?.nombre ?? '' }}
                  {{ producto.pais ? '· ' + producto.pais : '' }}
                  {{ producto.anio_cosecha ? ', ' + producto.anio_cosecha : '' }}
                </span>
                <div class="flex flex-column align-items-end">
                  <template v-if="producto.descuento > 0">
                    <span class="price-old">${{ fmt(producto.precio) }}</span>
                    <span class="price-discounted">${{ fmt(producto.precio * (1 - producto.descuento / 100)) }}</span>
                  </template>
                  <span v-else class="price-regular">${{ fmt(producto.precio) }}</span>
                </div>
              </div>
              <p v-if="producto.variedades?.length" class="product-varieties">
                {{ producto.variedades.map(v => v.nombre).join(' / ') }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- Vacío -->
      <div v-else class="text-center py-8">
        <i class="pi pi-search-minus empty-state-icon"></i>
        <p class="empty-state-text">
          No se encontraron vinos con los filtros seleccionados.
        </p>
        <Button label="Ver todos los vinos" text @click="clearFilters" />
      </div>

      <!-- ── Paginación ─────────────────────────────────────────────────────── -->
      <div v-if="pagination.last_page > 1" class="pagination-bar flex justify-content-between align-items-center mt-6">
        <div class="pagination-info">
          Mostrando <strong>{{ pagination.from ?? 0 }}</strong> a
          <strong>{{ pagination.to ?? 0 }}</strong> de
          <strong>{{ pagination.total }}</strong> vinos curados
        </div>
        <div class="flex align-items-center gap-2">
          <Button
            icon="pi pi-chevron-left"
            text
            rounded
            :disabled="pagination.current_page <= 1"
            @click="goToPage(pagination.current_page - 1)"
          />

          <Button
            v-for="page in visiblePages"
            :key="page"
            :label="String(page)"
            :text="page !== pagination.current_page"
            :outlined="page === pagination.current_page"
            rounded
            @click="goToPage(page)"
          />

          <Button
            icon="pi pi-chevron-right"
            text
            rounded
            :disabled="pagination.current_page >= pagination.last_page"
            @click="goToPage(pagination.current_page + 1)"
          />
        </div>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProductoController } from '@/controllers'
import { useCartStore }         from '@/stores/cart'
import { useNotificationStore } from '@/stores/notifications'

import InputText  from 'primevue/inputtext'
import IconField  from 'primevue/iconfield'
import InputIcon  from 'primevue/inputicon'
import RadioButton from 'primevue/radiobutton'
import Checkbox   from 'primevue/checkbox'
import Select     from 'primevue/select'
import Button     from 'primevue/button'
import Tag        from 'primevue/tag'
import Skeleton   from 'primevue/skeleton'

const route      = useRoute()
const router     = useRouter()
const cartStore  = useCartStore()
const notifStore = useNotificationStore()

const productos = ref([])
const meta      = reactive({ categorias: [], marcas: [], variedades: [], paises: [] })
const loading   = ref(true)

const pagination = reactive({
  current_page: 1, last_page: 1, total: 0, from: 0, to: 0
})

const filters = reactive({
  buscar:          route.query.buscar         ?? '',
  categoria:       route.query.categoria      ?? '',
  pais:            route.query.pais           ?? '',
  marca:           route.query.marca          ?? '',
  variedad:        route.query.variedad       ?? '',
  solo_descuentos: route.query.solo_descuentos === '1',
  orden:           route.query.orden          ?? 'newest',
  page:            Number(route.query.page)   || 1,
})

const ordenOptions = [
  { label: 'Más recientes',            value: 'newest' },
  { label: 'Precio: Menor a Mayor',    value: 'precio_asc' },
  { label: 'Precio: Mayor a Menor',    value: 'precio_desc' },
  { label: 'Nombre A-Z',               value: 'nombre' },
]

const fmt = (n) => Number(n).toFixed(2)

const hasFilters = computed(() =>
  filters.buscar || filters.categoria || filters.pais ||
  filters.marca  || filters.variedad  || filters.solo_descuentos
)

const visiblePages = computed(() => {
  const cur  = pagination.current_page
  const last = pagination.last_page
  const start = Math.max(1, cur - 2)
  const end   = Math.min(last, cur + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

async function fetchMeta() {
  const result = await ProductoController.obtenerFormData()

  if (!result.success) {
    console.warn('No se pudieron cargar los filtros del catalogo.', result.errors)
    return
  }

  meta.categorias = result.categorias ?? []
  meta.marcas     = result.marcas ?? []
  meta.variedades = result.variedades ?? []
  meta.paises     = result.paises ?? []
}

async function fetchProductos() {
  loading.value = true
  try {
    const params = {
      buscar:          filters.buscar         || undefined,
      categoria:       filters.categoria      || undefined,
      pais:            filters.pais           || undefined,
      marca:           filters.marca          || undefined,
      variedad:        filters.variedad       || undefined,
      solo_descuentos: filters.solo_descuentos ? 1 : undefined,
      orden:           filters.orden          || undefined,
      page:            filters.page,
    }
    const result = await ProductoController.obtenerProductos(params)

    if (!result.success) {
      throw new Error(result.message)
    }

    productos.value = result.productos ?? []
    pagination.current_page = result.pagination.currentPage
    pagination.last_page    = result.pagination.lastPage
    pagination.total        = result.pagination.total
    pagination.from         = result.pagination.from
    pagination.to           = result.pagination.to
  } catch (e) {
    console.error('Error cargando catálogo', e)
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  filters.page = 1
  syncUrl()
  fetchProductos()
}

function goToPage(page) {
  if (page < 1 || page > pagination.last_page) return
  filters.page = page
  syncUrl()
  fetchProductos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleVariedad(id) {
  filters.variedad = filters.variedad == id ? '' : id
  applyFilters()
}

function clearFilters() {
  Object.assign(filters, {
    buscar: '', categoria: '', pais: '', marca: '',
    variedad: '', solo_descuentos: false, orden: 'newest', page: 1
  })
  syncUrl()
  fetchProductos()
}

function syncUrl() {
  router.replace({
    query: {
      buscar:          filters.buscar         || undefined,
      categoria:       filters.categoria      || undefined,
      pais:            filters.pais           || undefined,
      marca:           filters.marca          || undefined,
      variedad:        filters.variedad       || undefined,
      solo_descuentos: filters.solo_descuentos ? '1' : undefined,
      orden:           filters.orden !== 'newest' ? filters.orden : undefined,
      page:            filters.page > 1 ? filters.page : undefined,
    }
  })
}

async function addToCart(producto) {
  try {
    const precioFinal = producto.descuento > 0 ? producto.precio * (1 - producto.descuento / 100) : producto.precio
    const data = await cartStore.addItem(producto.id_producto, {
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen_url
    })
    notifStore.show(data.mensaje ?? 'Producto agregado al carrito')
  } catch {
    notifStore.show('Error al agregar al carrito', 'error')
  }
}

onMounted(async () => {
  await fetchMeta()
  await fetchProductos()
})
</script>

<style scoped>

/* RadioButton color */
:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
  background: #2a0002;
  border-color: #2a0002;
}
:deep(.p-radiobutton .p-radiobutton-box:hover) {
  border-color: #2a0002;
}

/* Checkbox color */
:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #2a0002;
  border-color: #2a0002;
}

/* Botón de búsqueda (flecha) */
:deep(.p-inputtext:focus) {
  border-color: #2a0002;
  box-shadow: 0 0 0 1px #2a0002;
}

.p-button.p-button-outlined {
  color: #2a0002 !important;
  border-color: #2a0002 !important;
}

.p-inputtext {
  background: white !important;
  color: #1b1d0e !important;
}

.p-select {
  background: white !important;
  color: #1b1d0e !important;
}

.catalog-layout {
  min-height: 100vh;
  gap: 4rem;
  padding: 3rem 1.5rem 6rem;
}
@media (min-width: 768px) {
  .catalog-layout { padding: 3rem 3rem 6rem; }
}

.filter-sidebar { width: 18rem; padding-top: 1rem; }

.filter-section { margin-bottom: 2.5rem; }

.filter-heading {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  color: #2a0002;
  font-weight: 700;
}

.filter-sub {
  font-size: 0.75rem;
  font-family: 'Manrope', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #745853;
  margin-top: 0.5rem;
  opacity: 0.7;
}

.filter-section-title {
  font-family: 'Noto Serif', serif;
  font-size: 1.125rem;
  font-style: italic;
  border-bottom: 1px solid rgba(218, 193, 191, 0.15);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.filter-icon { font-size: 0.875rem; margin-right: 0.5rem; color: #735c00; }

.radio-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(27, 29, 14, 0.8);
  cursor: pointer;
}

.oferta-label {
  font-size: 0.875rem;
  font-weight: 700;
  font-style: italic;
  color: #ba1a1a;
  cursor: pointer;
}

.scrollable-list { max-height: 12rem; overflow-y: auto; padding-right: 0.5rem; }

.variedad-btn { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
:deep(.variedad-active) { background-color: #735c00; border-color: #735c00; color: white; }

.clear-btn { color: #745853; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }

/* Catálogo */
.catalog-title {
  font-family: 'Noto Serif', serif;
  font-size: 2.25rem;
  color: #2a0002;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.catalog-sub {
  color: rgba(27, 29, 14, 0.6);
  margin-top: 0.5rem;
  font-family: 'Noto Serif', serif;
  font-style: italic;
}

.product-grid-col { padding-bottom: 2.5rem; }

.product-image-frame {
  aspect-ratio: 3 / 4;
  background-color: #f5f5dc;
  overflow: hidden;
  padding: 1.5rem;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.7s;
}
.product-card:hover .product-image { transform: scale(1.05); }

.empty-image-icon { font-size: 3.5rem; opacity: 0.2; }

:deep(.discount-tag) {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.agotado-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}

.cart-quick-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  opacity: 0;
  transform: translateY(1rem);
  transition: all 0.3s;
}
.product-card:hover .cart-quick-btn { opacity: 1; transform: translateY(0); }

.product-name {
  font-family: 'Noto Serif', serif;
  font-size: 1.25rem;
  color: #2a0002;
  transition: color 0.2s;
}
.product-card:hover .product-name { color: #735c00; }

.product-meta {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
  font-family: 'Manrope', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-old { font-size: 0.625rem; text-decoration: line-through; opacity: 0.5; }
.price-discounted { color: #ba1a1a; font-weight: 700; }
.price-regular { color: #735c00; font-weight: 700; }

.product-varieties {
  font-size: 0.625rem;
  color: rgba(0, 0, 0, 0.4);
  font-family: 'Manrope', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

.empty-state-icon { font-size: 3.5rem; opacity: 0.2; display: block; margin-bottom: 1rem; }
.empty-state-text {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  color: rgba(42, 0, 2, 0.6);
  font-style: italic;
  margin-bottom: 1.5rem;
}

.pagination-info { font-size: 0.75rem; color: #544341; }
</style>