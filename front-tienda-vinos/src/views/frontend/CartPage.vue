<template>
  <main class="page-container py-6">

    <header class="mb-6 pb-4" style="border-bottom: 1px solid rgba(218,193,191,.2);">
      <h1 class="cart-title">Tu Bodega Personal</h1>
      <p class="cart-subtitle">Vinos seleccionados listos para ser descorchados.</p>
    </header>

    <!-- Con productos -->
    <template v-if="cartStore.itemsList.length > 0">
      <div class="grid">

        <!-- Listado -->
        <div class="col-12 lg:col-8">
          <div class="flex flex-column gap-4">

            <article v-for="item in cartStore.itemsList" :key="item.idProducto"
              class="flex align-items-center gap-4 p-4 border-round-lg border-1" style="background-color: rgb(245 245 220 / var(--tw-bg-opacity, 1)); border-color:rgba(218,193,191,.3);
         box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);">
              <!-- Imagen -->
              <div class="flex-shrink-0 border-round overflow-hidden flex align-items-center justify-content-center"
                style="width:6rem; height:8rem; background:#f5f5dc;">
                <img v-if="item.imagen" :src="item.imagen" :alt="item.nombre"
                  style="width:100%; height:100%; object-fit:contain; padding:.5rem;" />
                <i v-else class="pi pi-inbox" style="font-size:2.5rem; opacity:.2;"></i>
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <h3 class="item-name">{{ item.nombre }}</h3>
                <p class="item-price-unit">${{ formatPrice(item.precio) }} por unidad</p>

                <div class="flex align-items-center gap-4 mt-3">
                  <!-- Cantidad -->
                  <div class="flex align-items-center border-1 surface-border border-round-md overflow-hidden">
                    <Button icon="pi pi-minus" text size="small" :disabled="item.cantidad <= 1"
                      @click="cartStore.decrement(item.idProducto)"
                      style="border-radius:0; border-right:1px solid var(--surface-border);" />
                    <span class="px-3 font-bold text-sm" style="min-width:3rem; text-align:center;">
                      {{ item.cantidad }}
                    </span>
                    <Button icon="pi pi-plus" text size="small" @click="cartStore.increment(item.idProducto)"
                      style="border-radius:0; border-left:1px solid var(--surface-border);" />
                  </div>

                  <Button label="Eliminar" icon="pi pi-trash" text size="small" severity="danger"
                    @click="cartStore.remove(item.idProducto)" />
                </div>
              </div>

              <!-- Subtotal -->
              <div class="text-right flex-shrink-0">
                <p class="item-subtotal">${{ formatPrice(item.precio * item.cantidad) }}</p>
              </div>
            </article>

          </div>

          <div class="mt-5">
            <RouterLink to="/catalogo">
              <Button label="Seguir comprando" icon="pi pi-arrow-left" text size="small" />
            </RouterLink>
          </div>
        </div>

        <!-- Resumen -->
        <div class="col-12 lg:col-4">
          <div class="border-round-lg p-5 sticky top-5" style="background:#2a0002; color:white;">
            <h3 class="summary-title">Resumen de Compra</h3>

            <div class="flex flex-column gap-3 mb-5">
              <div class="flex justify-content-between text-sm summary-row">
                <span>Subtotal</span>
                <span>${{ formatPrice(cartStore.total) }}</span>
              </div>
              <div class="flex justify-content-between text-sm summary-row">
                <span>Envío</span>
                <span class="font-italic">Gratis</span>
              </div>
            </div>

            <Divider style="border-color:rgba(255,255,255,.2);" />

            <div class="flex justify-content-between align-items-end mb-5">
              <span class="summary-label">Total Estimado</span>
              <span class="summary-total">${{ formatPrice(cartStore.total) }}</span>
            </div>

            <RouterLink to="/checkout">
              <Button label="Finalizar Pedido" class="w-full" style="background:#e4e4cc; border-color:#e4e4cc; color:#2a0002;
                       font-weight:700; letter-spacing:.15em; text-transform:uppercase;" />
            </RouterLink>

            <p class="summary-note">
              Precios incluyen impuestos locales.<br>Garantía de calidad de La Última Botella.
            </p>
          </div>
        </div>

      </div>
    </template>

    <!-- Vacío -->
    <template v-else>
      <div class="text-center py-8 border-round-xl border-1 surface-border"
        style="background:#fafaf5; border-style:dashed !important;">
        <i class="pi pi-shopping-bag" style="font-size:5rem; opacity:.15; display:block; margin-bottom:1.5rem;"></i>
        <h2 class="empty-title">Tu bodega está vacía.</h2>
        <p class="empty-body">Es el momento perfecto para descubrir nuevas historias embotelladas.</p>
        <RouterLink to="/catalogo">
          <Button label="Explorar Catálogo" style="background:#2a0002; border-color:#2a0002;
                   text-transform:uppercase; letter-spacing:.15em; font-size:.75rem;" />
        </RouterLink>
      </div>
    </template>

  </main>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const formatPrice = (price) => parseFloat(price).toFixed(2)
</script>

<style scoped>
.page-container {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

.cart-title {
  font-family: 'Noto Serif', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #2a0002;
  font-weight: 700;
  font-style: italic;
}

.cart-subtitle {
  color: rgba(0, 0, 0, .5);
  font-size: 1.1rem;
  font-style: italic;
  margin-top: .5rem;
}

.item-name {
  font-family: 'Noto Serif', serif;
  font-size: 1.2rem;
  color: #2a0002;
  font-weight: 700;
}

.item-price-unit {
  font-size: .875rem;
  color: #745853;
  text-transform: uppercase;
  letter-spacing: .1em;
  margin-top: .25rem;
}

.item-subtotal {
  font-family: 'Noto Serif', serif;
  font-size: 1.2rem;
  color: #2a0002;
  font-weight: 700;
}

.summary-title {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-style: italic;
  color: white;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.summary-row {
  opacity: .8;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.summary-label {
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  opacity: .6;
  color: white;
}

.summary-total {
  font-family: 'Noto Serif', serif;
  font-size: 2.5rem;
  font-weight: 700;
  font-style: italic;
  color: #e4e4cc;
}

.summary-note {
  font-size: 10px;
  text-align: center;
  margin-top: 1.5rem;
  opacity: .4;
  text-transform: uppercase;
  letter-spacing: .1em;
  line-height: 1.8;
  color: white;
}

.empty-title {
  font-family: 'Noto Serif', serif;
  font-size: 2rem;
  color: rgba(42, 0, 2, .5);
  font-style: italic;
}

.empty-body {
  color: rgba(0, 0, 0, .4);
  margin: 1rem 0 2rem;
}
</style>