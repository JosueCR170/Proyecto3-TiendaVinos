<template>
  <main class="page-container py-6">

    <!-- Migas de pan -->
    <nav class="mb-5" style="font-size:.75rem; text-transform:uppercase; letter-spacing:.15em; color:rgba(27,29,14,.5);">
      <RouterLink to="/" style="color:inherit; text-decoration:none;">Inicio</RouterLink>
      <span class="mx-2">/</span>
      <RouterLink to="/catalogo" style="color:inherit; text-decoration:none;">Catálogo</RouterLink>
      <span class="mx-2">/</span>
      <span style="color:#2a0002;">{{ producto.nombre }}</span>
    </nav>

    <!-- Producto encontrado -->
    <template v-if="producto.id_producto">
      <div class="grid">

        <!-- Imagen -->
        <div class="col-12 lg:col-5">
          <div class="border-round-lg p-6 sticky top-5 flex flex-column align-items-center justify-content-between"
               style="background:#f5f5dc; aspect-ratio:3/4; box-shadow:0 20px 40px -10px rgba(27,29,14,.06);">
            <div class="flex-grow-1 flex align-items-center justify-content-center w-full">
              <img v-if="producto.imagen_url"
                   :alt="producto.nombre"
                   :src="producto.imagen_url"
                   style="max-width:100%; max-height:100%; object-fit:contain; transition:transform .7s;"
                   class="product-detail-img" />
              <i v-else class="pi pi-inbox" style="font-size:6rem; opacity:.2;"></i>
            </div>

            <div class="w-full pt-4 mt-4 flex justify-content-center"
                 style="border-top:1px solid rgba(218,193,191,.2);">
              <RouterLink :to="{ name: 'admin.productos.index', query: { search: producto.nombre } }"
                          style="color:#735c00; text-decoration:none; font-size:.75rem;
                                 text-transform:uppercase; letter-spacing:.15em; font-weight:700;"
                          class="flex align-items-center gap-2">
                <i class="pi pi-pencil"></i>
                Editar en Admin
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div class="col-12 lg:col-7 flex flex-column gap-5">

          <!-- Header -->
          <section>
            <div class="flex align-items-center flex-wrap gap-2 mb-3">
              <Tag v-if="producto.categoria"
                   :value="producto.categoria.nombre"
                   style="background:#735c00; color:white; font-size:.7rem;
                          text-transform:uppercase; letter-spacing:.1em;" />
              <span v-if="producto.pais"
                    style="color:#544341; font-size:.75rem; text-transform:uppercase; letter-spacing:.15em;">
                {{ producto.pais }}{{ producto.region ? ', ' + producto.region : '' }}
              </span>
            </div>

            <h1 class="product-detail-title">{{ producto.nombre }}</h1>

            <p v-if="producto.marca"
               style="font-family:'Noto Serif',serif; font-size:1.5rem; color:#745853; font-style:italic; opacity:.8;">
              {{ producto.marca.nombre }}
            </p>

            <p v-if="producto.variedades?.length"
               style="font-size:.875rem; color:#735c00; text-transform:uppercase; letter-spacing:.15em; margin-top:.5rem;">
              {{ producto.variedades.map(v => v.nombre).join(' / ') }}
            </p>
          </section>

          <!-- Specs técnicas -->
          <section class="grid">
            <div v-if="producto.anio_cosecha" class="col-6 sm:col-3">
              <div class="text-center p-4 border-round-lg" style="background:#efefd7;">
                <p class="spec-label">Año de Cosecha</p>
                <p class="spec-value">{{ producto.anio_cosecha }}</p>
              </div>
            </div>
            <div v-if="producto.alcohol_porcentaje" class="col-6 sm:col-3">
              <div class="text-center p-4 border-round-lg" style="background:#efefd7;">
                <p class="spec-label">Alcohol</p>
                <p class="spec-value">{{ producto.alcohol_porcentaje }}%</p>
              </div>
            </div>
            <div v-if="producto.contenido_ml" class="col-6 sm:col-3">
              <div class="text-center p-4 border-round-lg" style="background:#efefd7;">
                <p class="spec-label">Contenido</p>
                <p class="spec-value">{{ producto.contenido_ml }}ml</p>
              </div>
            </div>
            <div class="col-6 sm:col-3">
              <div class="text-center p-4 border-round-lg" style="background:#efefd7;">
                <p class="spec-label">Existencias</p>
                <p class="spec-value">{{ producto.cantidad }}</p>
              </div>
            </div>
          </section>

          <!-- Precio y CTA -->
          <section class="flex flex-column sm:flex-row align-items-start sm:align-items-center
                          justify-content-between p-5 border-round-xl gap-4"
                   style="background:#eaead1; border:1px solid rgba(218,193,191,.2);">
            <div>
              <span style="font-size:.75rem; text-transform:uppercase; letter-spacing:.1em; color:#544341;">
                Precio de Venta
              </span>
              <template v-if="producto.descuento > 0">
                <p class="line-through mt-1" style="color:rgba(0,0,0,.4); font-size:1rem;">
                  ${{ formatPrice(producto.precio) }}
                </p>
                <p class="price-main">
                  ${{ formatPrice(producto.precio * (1 - producto.descuento / 100)) }}
                  <span style="font-size:1rem; color:#735c00; margin-left:.5rem;">
                    -{{ producto.descuento }}%
                  </span>
                </p>
              </template>
              <p v-else class="price-main">${{ formatPrice(producto.precio) }}</p>
            </div>

            <Button v-if="producto.cantidad > 0"
                    label="Agregar al Carrito"
                    icon="pi pi-cart-plus"
                    style="background:#2a0002; border-color:#2a0002; color:white;
                           text-transform:uppercase; letter-spacing:.15em;
                           font-size:.8rem; font-weight:700; padding:1rem 2rem;"
                    @click="agregarAlCarrito(producto.id_producto)" />

            <div v-else
                 class="flex align-items-center gap-2 px-5 py-3 border-round-md"
                 style="background:#f0f0f0; color:#aaa; cursor:not-allowed;
                        font-size:.8rem; text-transform:uppercase; letter-spacing:.15em; font-weight:700;">
              <i class="pi pi-ban"></i>
              Producto Agotado
            </div>
          </section>

          <!-- Descripción -->
          <section v-if="producto.descripcion">
            <h3 class="section-heading">Descripción del Vino</h3>
            <p style="color:#544341; line-height:1.8; font-size:1.1rem;">{{ producto.descripcion }}</p>
          </section>

          <!-- Datos técnicos -->
          <section class="p-5 border-round-lg relative overflow-hidden" style="background:#f5f5dc;">
            <i class="pi pi-star absolute"
               style="font-size:8rem; opacity:.06; top:0; right:1rem;"></i>
            <h3 class="section-heading">Datos Técnicos</h3>
            <dl class="grid">
              <div v-if="producto.pais" class="col-12 sm:col-6 mb-3">
                <div class="flex align-items-start gap-3 pb-3"
                     style="border-bottom:1px solid rgba(218,193,191,.2);">
                  <i class="pi pi-globe mt-1" style="color:#735c00;"></i>
                  <div>
                    <dt class="spec-label">País</dt>
                    <dd style="font-weight:500; color:#1b1d0e;">{{ producto.pais }}</dd>
                  </div>
                </div>
              </div>
              <div v-if="producto.region" class="col-12 sm:col-6 mb-3">
                <div class="flex align-items-start gap-3 pb-3"
                     style="border-bottom:1px solid rgba(218,193,191,.2);">
                  <i class="pi pi-map-marker mt-1" style="color:#735c00;"></i>
                  <div>
                    <dt class="spec-label">Región</dt>
                    <dd style="font-weight:500; color:#1b1d0e;">{{ producto.region }}</dd>
                  </div>
                </div>
              </div>
              <div v-if="producto.marca" class="col-12 sm:col-6 mb-3">
                <div class="flex align-items-start gap-3 pb-3"
                     style="border-bottom:1px solid rgba(218,193,191,.2);">
                  <i class="pi pi-building mt-1" style="color:#735c00;"></i>
                  <div>
                    <dt class="spec-label">Bodega</dt>
                    <dd style="font-weight:500; color:#1b1d0e;">{{ producto.marca.nombre }}</dd>
                  </div>
                </div>
              </div>
              <div v-if="producto.categoria" class="col-12 sm:col-6 mb-3">
                <div class="flex align-items-start gap-3 pb-3"
                     style="border-bottom:1px solid rgba(218,193,191,.2);">
                  <i class="pi pi-tag mt-1" style="color:#735c00;"></i>
                  <div>
                    <dt class="spec-label">Categoría</dt>
                    <dd style="font-weight:500; color:#1b1d0e;">{{ producto.categoria.nombre }}</dd>
                  </div>
                </div>
              </div>
            </dl>
          </section>

        </div>
      </div>

      <!-- Relacionados -->
      <section v-if="relacionados.length" class="mt-8 py-6 px-4 border-round-lg" style="background:#f5f5dc;">
        <h2 class="section-heading mb-5">Vinos del Mismo Estilo</h2>
        <div class="grid">
          <div v-for="rel in relacionados" :key="rel.id_producto" class="col-12 md:col-4">
            <RouterLink :to="`/catalogo/${rel.id_producto}`" class="no-underline block related-card">
              <div class="flex align-items-center justify-content-center p-5 border-round-lg mb-3"
                   style="aspect-ratio:3/4; background:rgb(245, 245, 220);;">
                <img v-if="rel.imagen_url"
                     :alt="rel.nombre" :src="rel.imagen_url"
                     style="max-width:100%; max-height:100%; object-fit:contain;
                            transition:transform .7s;" class="related-img" />
                <i v-else class="pi pi-inbox" style="font-size:4rem; opacity:.2;"></i>
              </div>
              <h4 style="font-family:'Noto Serif',serif; font-size:1.2rem;
                         color:#2a0002; font-weight:700; transition:color .2s;">
                {{ rel.nombre }}
              </h4>
              <p style="font-size:.875rem; color:#544341; margin-top:.25rem;">
                {{ rel.marca?.nombre || '' }}{{ rel.pais ? ' | ' + rel.pais : '' }}
              </p>
              <p style="color:#735c00; font-weight:700; margin-top:.5rem;">
                ${{ formatPrice(rel.precio) }}
              </p>
            </RouterLink>
          </div>
        </div>
      </section>
    </template>

    <!-- No encontrado -->
    <template v-else>
      <div class="text-center py-8">
        <i class="pi pi-inbox" style="font-size:5rem; opacity:.15; display:block; margin-bottom:1rem;"></i>
        <p style="font-size:1.5rem; color:rgba(42,0,2,.5); font-style:italic;">Producto no encontrado</p>
      </div>
    </template>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ProductoController } from '@/controllers'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notifications'

const route      = useRoute()
const cart       = useCartStore()
const notif      = useNotificationStore()
const producto   = ref({})
const relacionados = ref([])

const formatPrice = (price) => parseFloat(price).toFixed(2)

function agregarAlCarrito(idProducto) {
  try {
    const p = producto.value
    const result = cart.addItem(idProducto, {
      nombre: p.nombre,
      precio: p.descuento > 0 ? p.precio * (1 - p.descuento / 100) : p.precio,
      imagen: p.imagen_url,
    })
    notif.show(result.mensaje || 'Producto agregado al carrito', 'success')
    window.dispatchEvent(new Event('cart-updated'))
  } catch (err) {
    notif.show('Error al agregar al carrito', 'error')
  }
}

onMounted(async () => {
  try {
    const id = route.params.id
    const result = await ProductoController.obtenerProductoPorId(id)
    if (!result.success) throw new Error(result.message)
    producto.value = result.producto

    if (result.producto.id_categoria) {
      const rel = await ProductoController.obtenerProductos({
        id_categoria: result.producto.id_categoria,
        per_page: 4,
      })
      relacionados.value = (rel.productos ?? [])
        .filter(i => i.id_producto !== result.producto.id_producto)
        .slice(0, 3)
    }
  } catch (error) {
    console.error('Error loading product:', error)
  }
})
</script>

<style scoped>
.page-container { max-width: 1400px; margin-inline: auto; padding-inline: 1.5rem; }

.product-detail-img:hover { transform: scale(1.05); }

.product-detail-title {
  font-family: 'Noto Serif', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  font-style: italic;
  color: #2a0002;
  letter-spacing: -.02em;
  line-height: 1.1;
  margin: .5rem 0;
}

.spec-label {
  font-size: .65rem;
  text-transform: uppercase;
  letter-spacing: .15em;
  color: #544341;
  margin-bottom: .25rem;
}

.spec-value {
  font-family: 'Noto Serif', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2a0002;
}

.price-main {
  font-family: 'Noto Serif', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2a0002;
  margin-top: .25rem;
}

.section-heading {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
  color: #2a0002;
  margin-bottom: 1rem;
}

.related-card:hover h4 { color: #735c00; }
.related-img:hover { transform: scale(1.05); }
</style>