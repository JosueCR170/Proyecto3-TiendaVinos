MIGRADO
<template>
  <main class="pt-8">

    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="hero-section">
      <div class="page-container grid align-items-center">

        <div class="col-12 lg:col-6">
          <span class="eyebrow">El Sommelier Digital</span>
          <h1 class="hero-title">
            <span>El Sommelier Digital:</span>
            <br />
            <span class="text-italic">Excelencia Curada para el Paladar Paciente</span>
          </h1>
          <p class="hero-body">
            Un archivo curado de viticultura, donde el tiempo es el ingrediente
            principal y cada botella cuenta la historia de su terruño.
          </p>

          <RouterLink to="/catalogo">
            <Button label="Explorar la Bodega" class="btn-primary mt-4" />
          </RouterLink>
        </div>

        <div class="col-12 lg:col-6 relative">
          <div class="hero-img-main border-round overflow-hidden shadow-4">
            <img
              v-if="destacados[0]?.imagen_url"
              :alt="destacados[0].nombre"
              :src="destacados[0].imagen_url"
              class="w-full h-full"
              style="object-fit:cover"
            />
            <i v-else class="pi pi-star" style="font-size:6rem; color:#dac1bf; opacity:.4;"></i>
          </div>

          <div class="hero-img-floating absolute border-round overflow-hidden shadow-5 hidden lg:block">
            <img v-if="destacados[1]?.imagen_url" :src="destacados[1].imagen_url" alt="" class="w-full h-full" style="object-fit:contain;" />
          </div>
        </div>

      </div>
    </section>

    <!-- ── Vinos Destacados ──────────────────────────────────────────────── -->
    <section class="py-6 px-5" style="background:#fbfbe2;">
      <div style="max-width:1400px; margin:0 auto;">

        <div class="flex justify-content-between align-items-end mb-5">
          <div>
            <span class="section-eyebrow">Nuestra Selección</span>
            <h2 class="section-title">Vinos Destacados</h2>
          </div>
          <RouterLink to="/catalogo" class="link-secondary">Ver Todos</RouterLink>
        </div>

        <!-- Skeleton mientras carga -->
        <div v-if="loading" class="grid">
          <div v-for="n in 3" :key="n" class="col-12 md:col-4">
            <Skeleton height="400px" class="mb-2 border-round-lg" />
            <Skeleton width="60%" height="1rem" class="mb-2" />
            <Skeleton width="40%" height="1rem" />
          </div>
        </div>

        <!-- Cards de productos -->
        <div v-else-if="destacados.length" class="grid">
          <div v-for="(producto, index) in destacados"
               :key="producto.id_producto"
               class="col-12 md:col-6 lg:col-4"
               :class="index === 1 ? 'lg:mt-5' : ''">

            <Card class="product-card h-full border-round-lg" style="background:rgb(245, 245, 220); border: 1px solid rgba(218,193,191,.3);">
              <template #header>
                <RouterLink :to="`/catalogo/${producto.id_producto}`" class="no-underline">
                  <div class="relative flex align-items-center justify-content-center p-4"
                       style="height:300px; background:rgb(245, 245, 220); border-radius:12px 12px 0 0;">
                    <img v-if="producto.imagen_url"
                         :alt="producto.nombre"
                         :src="producto.imagen_url"
                         style="max-width:100%; max-height:100%; object-fit:contain;"
                         :style="producto.cantidad <= 0 ? 'opacity:.5; filter:grayscale(1)' : ''" />
                    <i v-else class="pi pi-inbox"
                       style="font-size:4rem; color:#dac1bf; opacity:.3;"></i>

                    <div v-if="producto.cantidad <= 0"
                         class="absolute top-0 left-0 w-full h-full flex align-items-center
                                justify-content-center border-round-top"
                         style="background:rgba(0,0,0,.2); backdrop-filter:blur(2px);">
                      <Tag value="Agotado" severity="danger" class="text-xs" />
                    </div>
                  </div>
                </RouterLink>
              </template>

              <template #content>
                <RouterLink :to="`/catalogo/${producto.id_producto}`" class="no-underline">
                  <p class="product-meta-text mb-1">
                    {{ producto.pais }}{{ producto.region ? ', ' + producto.region : '' }}
                    {{ producto.anio_cosecha ? ', ' + producto.anio_cosecha : '' }}
                  </p>
                  <h3 class="product-name mt-0 mb-3">{{ producto.nombre }}</h3>
                </RouterLink>

                <div class="flex justify-content-between align-items-center">
                  <span class="text-lg font-semibold" style="color:#745853;">
                    ${{ fmt(producto.precio) }}
                  </span>
                  <Button v-if="producto.cantidad > 0"
                          icon="pi pi-cart-plus"
                          class="p-button-rounded p-button-text"
                          style="color:#2a0002;"
                          @click="addToCart(producto)" />
                </div>
              </template>
            </Card>

          </div>
        </div>

        <div v-else class="text-center py-6 font-italic" style="color:#544341;">
          No hay productos disponibles en este momento.
        </div>

      </div>
    </section>

    <!-- ── Ofertas Imperdibles ────────────────────────────────────────────── -->
    <section v-if="descuentos.length" class="py-6 px-5" style="background:#fbfbe2;">
      <div style="max-width:1400px; margin:0 auto;">

        <div class="flex justify-content-between align-items-end mb-5">
          <div>
            <span class="section-eyebrow">Oportunidades Únicas</span>
            <h2 class="section-title">Ofertas Imperdibles</h2>
          </div>
          <RouterLink to="/catalogo?solo_descuentos=1" class="link-secondary">
            Ver Todas las Ofertas
          </RouterLink>
        </div>

        <div class="grid">
          <div v-for="producto in descuentos"
               :key="producto.id_producto"
               class="col-12 md:col-6 lg:col-4">

            <Card class="product-card h-full border-round-lg" style="background:rgb(245, 245, 220);;">
              <template #header>
                <RouterLink :to="`/catalogo/${producto.id_producto}`" class="no-underline">
                  <div class="relative flex align-items-center justify-content-center p-4"
                       style="height:300px; background:#f5f5dc; border-radius:12px 12px 0 0;">
                    <img v-if="producto.imagen_url"
                         :alt="producto.nombre"
                         :src="producto.imagen_url"
                         style="max-width:100%; max-height:100%; object-fit:contain;"
                         :style="producto.cantidad <= 0 ? 'opacity:.5; filter:grayscale(1)' : ''" />
                    <i v-else class="pi pi-inbox"
                       style="font-size:4rem; color:#dac1bf; opacity:.3;"></i>

                    <!-- Badge de descuento -->
                    <Tag :value="`-${producto.descuento}%`"
                         severity="danger"
                         class="absolute"
                         style="top:.75rem; right:.75rem; font-size:10px;" />

                    <div v-if="producto.cantidad <= 0"
                         class="absolute top-0 left-0 w-full h-full flex align-items-center
                                justify-content-center border-round-top"
                         style="background:rgba(0,0,0,.2);">
                      <Tag value="Agotado" severity="danger" />
                    </div>
                  </div>
                </RouterLink>
              </template>

              <template #content>
                <RouterLink :to="`/catalogo/${producto.id_producto}`" class="no-underline">
                  <p class="product-meta-text mb-1">
                    {{ producto.pais }}{{ producto.region ? ', ' + producto.region : '' }}
                  </p>
                  <h3 class="product-name mt-0 mb-3">{{ producto.nombre }}</h3>
                </RouterLink>

                <div class="flex justify-content-between align-items-center">
                  <div>
                    <span class="text-sm line-through mr-2" style="color:#999;">
                      ${{ fmt(producto.precio) }}
                    </span>
                    <span class="text-lg font-bold text-red-600">
                      ${{ fmt(producto.precio * (1 - producto.descuento / 100)) }}
                    </span>
                  </div>
                  <Button v-if="producto.cantidad > 0"
                          icon="pi pi-cart-plus"
                          class="p-button-rounded p-button-text"
                          style="color:#2a0002;"
                          @click="addToCart(producto)" />
                </div>
              </template>
            </Card>

          </div>
        </div>
      </div>
    </section>

    <!-- ── Ediciones Especiales ──────────────────────────────────────────── -->
    <section class="py-6 px-5" style="background:#fbfbe2;">
      <div style="max-width:1400px; margin:0 auto;">
        <div class="grid align-items-center">

          <div class="col-12 lg:col-6">
            <Card class="border-round-lg" style="background:#2a0002; color:white;">
              <template #content>
                <span class="section-eyebrow" style="color:#e4e4cc;">Ediciones Especiales</span>
                <h2 class="mt-3 mb-4 text-4xl" style="color:white; font-family:'Noto Serif',serif;">
                  Espumosos y Antigüedades
                </h2>
                <p class="line-height-3 mb-5" style="color:#e4e4cc; font-size:1.1rem;">
                  Accede a nuestra reserva privada de champañas añejos y magnums de producción
                  limitada, obtenidos directamente de las bóvedas más antiguas de la bodega.
                </p>
                <RouterLink to="/catalogo">
                  <Button label="Explorar el Catálogo"
                          class="p-button-outlined w-full"
                          style="border-color:#e4e4cc; color:#e4e4cc;" />
                </RouterLink>
              </template>
            </Card>
          </div>

          <div class="col-12 lg:col-6">
            <div class="grid">
              <div v-for="(p, i) in destacados.slice(0, 2)"
                   :key="p.id_producto"
                   class="col-6"
                   :class="i === 1 ? 'mt-5' : ''">
                <div class="flex align-items-center justify-content-center p-4 border-round-lg"
                     style="height:280px; background:#f5f5dc;">
                  <img v-if="p.imagen_url"
                       :alt="p.nombre" :src="p.imagen_url"
                       style="max-width:100%; max-height:100%; object-fit:contain;" />
                  <i v-else class="pi pi-inbox"
                     style="font-size:4rem; color:#dac1bf; opacity:.3;"></i>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── Nuestra Historia ──────────────────────────────────────────────── -->
    <section class="py-6 px-5 text-center" style="background:#fbfbe2;">
      <div style="max-width:42rem; margin:0 auto;">
        <Divider />
        <h2 class="historia-title">Un Legado en Cada Copa</h2>
        <p class="historia-body">
          Fundados en la creencia de que una gran bodega es una biblioteca viva del tiempo,
          hemos pasado décadas cultivando relaciones con productores artesanales que priorizan
          el terruño por encima de la escala.
        </p>
        <RouterLink to="/about" class="no-underline inline-flex align-items-center gap-2">
          <span class="font-label uppercase" style="color:#745853; letter-spacing:.15em; font-size:.875rem;">
            Conoce Nuestra Historia
          </span>
          <i class="pi pi-arrow-right" style="color:#745853;"></i>
        </RouterLink>
        <Divider />
      </div>
    </section>

  </main>
</template>

<script setup>
/* ── Sin cambios respecto al original ── */
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useCartStore }         from '@/stores/cart'
import { useNotificationStore } from '@/stores/notifications'

const cartStore  = useCartStore()
const notifStore = useNotificationStore()

const destacados = ref([])
const descuentos = ref([])
const loading    = ref(true)

const fmt = (n) => Number(n).toFixed(2)

async function fetchHome() {
  try {
    const { data } = await api.get('/v1/home')
    destacados.value = data.destacados ?? []
    descuentos.value = data.descuentos ?? []
  } catch (e) {
    console.error('Error cargando home', e)
  } finally {
    loading.value = false
  }
}

async function addToCart(producto) {
  try {
    const precioFinal = producto.descuento > 0
      ? producto.precio * (1 - producto.descuento / 100)
      : producto.precio
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

onMounted(fetchHome)
</script>

<style scoped>
.page-container { max-width: 1280px; margin-inline: auto; padding-inline: 1.5rem; }
@media (min-width: 768px) { .page-container { padding-inline: 3rem; } }

.hero-section {
  position: relative;
  min-height: 80vh;
  overflow: hidden;
  background-color: #fbfbe2;
  padding-block: 4rem;
}

.eyebrow {
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #735c00;
  margin-bottom: 1rem;
  font-weight: 700;
  display: block;
}

.hero-title {
  font-family: 'Noto Serif', serif;
  color: #2a0002;
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  line-height: 1.05;
  margin-bottom: 1.25rem;
}
.text-italic { font-style: italic; }

.hero-body {
  font-family: 'Manrope', sans-serif;
  font-size: 1.05rem;
  color: #544341;
  max-width: 36rem;
  line-height: 1.7;
}

.hero-img-main {
  aspect-ratio: 3 / 4;
  width: 100%;
  background-color: #fbfbe2;
  transform: rotate(4deg);
}
.hero-img-main img { display:block; width:100%; height:100%; }

.hero-img-floating {
  width: 220px;
  aspect-ratio: 1 / 1;
  bottom: -2.5rem;
  left: -2.5rem;
  background-color: #2a0002;
  border: 12px solid #fbfbe2;
  transform: rotate(-6deg);
}

.btn-primary {
  background-color: #2a0002 !important;
  border-color: #2a0002 !important;
  color: #fff !important;
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  padding: 0.9rem 1.6rem;
  border-radius: 6px;
}

.hero-title {
  font-family: 'Noto Serif', serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.15;
  color: #2a0002;
  margin-bottom: 1.5rem;
}
.hero-subtitle {
  color: #544341;
  font-size: 1.1rem;
  max-width: 28rem;
  line-height: 1.7;
  margin-bottom: 1rem;
}
.section-eyebrow {
  color: #735c00;
  text-transform: uppercase;
  letter-spacing: .2em;
  font-size: .75rem;
  font-weight: 700;
  display: block;
}
.section-title {
  font-family: 'Noto Serif', serif;
  font-size: 2rem;
  color: #2a0002;
  margin-top: .5rem;
}
.link-secondary {
  color: #745853;
  font-size: .875rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(218,193,191,.4);
}
.link-secondary:hover { color: #2a0002; }
.product-meta-text {
  font-size: .75rem;
  color: #78716c;
  text-transform: uppercase;
  letter-spacing: .15em;
}
.product-name {
  font-family: 'Noto Serif', serif;
  font-size: 1.2rem;
  color: #2a0002;
}
.product-card {
  transition: transform .2s;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.product-card:hover { transform: translateY(-6px); }
.historia-title {
  font-family: 'Noto Serif', serif;
  font-size: 1.75rem;
  color: #2a0002;
  margin-bottom: 1rem;
}
.historia-body {
  color: #544341;
  line-height: 1.9;
  margin-bottom: 2rem;
}
</style>