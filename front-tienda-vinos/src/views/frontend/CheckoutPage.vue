<template>
  <main class="page-container py-6">
    <div class="border-round-lg overflow-hidden shadow-4 surface-card">

      <!-- Header -->
      <div class="flex justify-content-between align-items-start p-6"
           style="background:#2a0002; color:white;">
        <div>
          <h1 class="invoice-title">Factura de Compra</h1>
          <p class="invoice-subtitle">La Última Botella — Selección Privada</p>
        </div>
        <div class="text-right">
          <p class="invoice-label">Fecha</p>
          <p class="invoice-date">{{ currentDate }}</p>
        </div>
      </div>

      <!-- Cuerpo -->
      <div class="p-6">

        <!-- Emisor / Cliente -->
        <div class="flex justify-content-between mb-6">
          <div>
            <p class="field-label">Emitido por</p>
            <p class="field-name">La Última Botella S.A.</p>
            <p class="field-detail">Valle de los Viñedos, Bóveda 01<br>Costa Rica</p>
          </div>
          <div class="text-right">
            <p class="field-label">Detalle de Cliente</p>
            <p class="field-name">Invitado Distinguido</p>
            <p class="field-detail">Compra en Línea</p>
          </div>
        </div>

        <Divider />

        <!-- Tabla de productos -->
        <DataTable :value="cartStore.itemsList" class="mb-6" style="font-family:'Manrope',sans-serif;">
          <Column field="nombre" header="Vino Seleccionado">
            <template #body="{ data }">
              <p class="field-name mb-0">{{ data.nombre }}</p>
              <p class="field-detail mb-0">Reserva Especial</p>
            </template>
          </Column>
          <Column field="cantidad" header="Cant." style="width:6rem; text-align:center;">
            <template #body="{ data }">
              <span class="text-center block">{{ data.cantidad }}</span>
            </template>
          </Column>
          <Column header="Precio Unit." style="width:9rem; text-align:right;">
            <template #body="{ data }">
              <span class="block text-right">${{ formatPrice(data.precio) }}</span>
            </template>
          </Column>
          <Column header="Subtotal" style="width:9rem; text-align:right;">
            <template #body="{ data }">
              <span class="block text-right font-bold" style="color:#2a0002;">
                ${{ formatPrice(data.precio * data.cantidad) }}
              </span>
            </template>
          </Column>
        </DataTable>

        <!-- Totales -->
        <div class="flex justify-content-end">
          <div style="width:18rem;" class="flex flex-column gap-3">
            <div class="flex justify-content-between totals-row">
              <span>Subtotal</span>
              <span>${{ formatPrice(cartStore.total) }}</span>
            </div>
            <div class="flex justify-content-between totals-row">
              <span>Impuestos (IVA)</span>
              <span>Incluidos</span>
            </div>
            <div class="flex justify-content-between totals-row pb-3"
                 style="border-bottom:1px solid rgba(218,193,191,.2);">
              <span>Envío</span>
              <span class="font-italic" style="color:#745853;">Bonificado</span>
            </div>
            <div class="flex justify-content-between align-items-end pt-2">
              <span class="totals-label">Total a Pagar</span>
              <span class="totals-grand">${{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Acciones -->
      <div class="p-6 flex flex-column align-items-center gap-4 surface-ground"
           style="border-top:1px solid rgba(218,193,191,.2);">
        <Button
          :label="procesando ? 'Procesando...' : 'Confirmar y Pagar Factura'"
          :icon="procesando ? 'pi pi-spin pi-spinner' : 'pi pi-credit-card'"
          :disabled="procesando"
          class="w-full"
          style="max-width:28rem; background:#2a0002; border-color:#2a0002;
                 font-weight:700; letter-spacing:.2em; text-transform:uppercase;
                 padding:1.25rem;"
          @click="confirmarPago"
        />
        <RouterLink to="/carrito">
          <Button
            label="Regresar al Carrito"
            icon="pi pi-arrow-left"
            text
            size="small"
            style="color:#745853; text-transform:uppercase; letter-spacing:.1em; font-size:.75rem;"
          />
        </RouterLink>
      </div>

    </div>

    <p class="invoice-footer">
      Al confirmar, se descontarán los productos de nuestro inventario.<br>
      Gracias por confiar en la curaduría de La Última Botella.
    </p>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { useCartStore }   from '@/stores/cart'
import { useNotificationStore } from '@/stores/notifications'
import api from '@/services/api'
import DataTable from 'primevue/datatable'
import Column    from 'primevue/column'

const router     = useRouter()
const cartStore  = useCartStore()
const notifStore = useNotificationStore()

const currentDate = ref('')
const procesando  = ref(false)
const formatPrice = (price) => parseFloat(price).toFixed(2)

const confirmarPago = async () => {
  if (cartStore.itemsList.length === 0) {
    notifStore.show('El carrito está vacío', 'error')
    return
  }
  procesando.value = true
  try {
    const carritoPayload = {}
    cartStore.itemsList.forEach(item => {
      carritoPayload[item.idProducto] = item
    })
    const response = await api.post('v1/pedidos', { carrito: carritoPayload })
    const data = response.data
    if (data.success) {
      cartStore.clear()
      notifStore.show('¡Pedido confirmado! Gracias por tu compra.', 'success')
      setTimeout(() => router.push('/'), 2000)
    } else {
      notifStore.show(data.message || 'Error al procesar el pago', 'error')
    }
  } catch (error) {
    console.error('Error:', error)
    notifStore.show('Error al procesar el pago. Intenta de nuevo.', 'error')
  } finally {
    procesando.value = false
  }
}

onMounted(() => {
  const now = new Date()
  currentDate.value = `${String(now.getDate()).padStart(2,'0')} / ${String(now.getMonth()+1).padStart(2,'0')} / ${now.getFullYear()}`
})
</script>

<style scoped>
.page-container { max-width: 56rem; margin-inline: auto; padding-inline: 1.5rem; }

.invoice-title    { font-family:'Noto Serif',serif; font-size:2rem; font-weight:700; font-style:italic; color:white; }
.invoice-subtitle { font-size:.75rem; text-transform:uppercase; letter-spacing:.2em; opacity:.6; color:white; margin-top:.5rem; }
.invoice-label    { font-size:.7rem; text-transform:uppercase; letter-spacing:.15em; opacity:.6; color:white; }
.invoice-date     { font-size:1.1rem; color:white; margin-top:.25rem; }
.invoice-footer   { text-align:center; margin-top:2rem; font-size:10px; text-transform:uppercase;
                    letter-spacing:.15em; opacity:.4; line-height:1.8; }

.field-label  { font-size:.7rem; text-transform:uppercase; letter-spacing:.15em; color:#78716c; margin-bottom:.5rem; }
.field-name   { font-family:'Noto Serif',serif; font-size:1.1rem; color:#2a0002; font-weight:700; }
.field-detail { font-size:.875rem; color:rgba(0,0,0,.5); margin-top:.25rem; }

.totals-row   { font-size:.75rem; text-transform:uppercase; letter-spacing:.1em; opacity:.6; }
.totals-label { font-size:.75rem; text-transform:uppercase; letter-spacing:.1em; font-weight:700; }
.totals-grand { font-family:'Noto Serif',serif; font-size:2.5rem; font-weight:700; font-style:italic; color:#2a0002; }
</style>