<template>
  <div class="index-view">
    <header class="index-header mb-5">
      <div class="header-info">
        <h1>Dashboard General</h1>
        <p>Vision general del inventario, bodegas y estado de la cava.</p>
      </div>
    </header>

    <div v-if="loading" class="admin-loading">
      <ProgressSpinner />
    </div>

    <Message v-else-if="error" severity="error" class="mb-4">
      <div class="flex align-items-center justify-content-between gap-3">
        <span>{{ error }}</span>
        <Button label="Reintentar" severity="danger" size="small" outlined @click="fetchStats" />
      </div>
    </Message>

    <div v-else class="grid">
      <div v-for="item in statItems" :key="item.label" class="col-12 md:col-6 xl:col-4">
        <Card class="admin-stat-card h-full bg-transparent">
          <template #content>
            <div class="flex align-items-center gap-4">
              <div class="admin-stat-icon" :class="item.class">
                <i :class="item.icon"></i>
              </div>
              <div>
                <p class="admin-stat-label">{{ item.label }}</p>
                <p class="admin-stat-value">{{ item.value }}</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const stats = ref({})
const loading = ref(true)
const error = ref(null)

const statItems = computed(() => [
  { label: 'Total Productos', value: stats.value.total_productos, icon: 'pi pi-box', class: 'wine' },
  { label: 'Productos Activos', value: stats.value.productos_activos, icon: 'pi pi-check-circle', class: 'sage' },
  { label: 'Sin Stock (Agotados)', value: stats.value.productos_sin_stock, icon: 'pi pi-exclamation-triangle', class: 'danger' },
  { label: 'En Oferta', value: stats.value.con_descuento, icon: 'pi pi-tag', class: 'gold' },
  { label: 'Categorias', value: stats.value.total_categorias, icon: 'pi pi-objects-column', class: 'wine' },
  { label: 'Marcas / Bodegas', value: stats.value.total_marcas, icon: 'pi pi-shop', class: 'sage' },
  { label: 'Variedades', value: stats.value.total_variedades, icon: 'pi pi-sparkles', class: 'gold' },
])

async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/v1/admin/dashboard')
    stats.value = data.data
  } catch (err) {
    error.value = 'No se pudieron cargar las estadisticas.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>
