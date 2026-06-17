<template>
  <div class="create-view-wrapper">
    <div v-if="loadingForm" class="admin-loading">
      <ProgressSpinner />
    </div>

    <form v-else @submit.prevent="submitForm">
      <header class="header-section">
        <div class="header-text">
          <h1>Catalogar Nuevo Vino</h1>
          <p>Define la narrativa, especificaciones tecnicas y el legado de una nueva adicion a la cava digital.</p>
        </div>
        <div class="header-actions">
          <router-link :to="{ name: 'admin.productos.index' }" custom v-slot="{ navigate }">
            <Button label="Descartar" severity="secondary" outlined @click="navigate" />
          </router-link>
          <Button type="submit" label="Guardar Coleccion" icon="pi pi-save" :loading="loadingSubmit" />
        </div>
      </header>

      <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

      <div class="grid">
        <div class="col-12 xl:col-8">
          <Card class="admin-card mb-4">
            <template #title>Informacion Basica</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-6">
                  <label for="nombre" class="admin-label">Nombre del Vino</label>
                  <InputText v-model="form.nombre" id="nombre" class="w-full" placeholder="ej. Chateau Margaux" required />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="anio_cosecha" class="admin-label">Cosecha (Vintage)</label>
                  <InputNumber v-model="form.anio_cosecha" inputId="anio_cosecha" class="w-full" :useGrouping="false" placeholder="2018" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="pais" class="admin-label">Pais de Origen</label>
                  <Select v-model="form.pais" id="pais" :options="paisOptions" class="w-full" placeholder="Seleccionar pais..." filter required />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="region" class="admin-label">Region / Terroir</label>
                  <InputText v-model="form.region" id="region" class="w-full" placeholder="Bordeaux" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="id_categoria" class="admin-label">Categoria Editorial</label>
                  <Select v-model="form.id_categoria" id="id_categoria" :options="categorias" optionLabel="nombre" optionValue="id_categoria" class="w-full" placeholder="Seleccionar..." required />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="id_marca" class="admin-label">Casa / Bodega</label>
                  <Select v-model="form.id_marca" id="id_marca" :options="marcas" optionLabel="nombre" optionValue="id_marca" class="w-full" placeholder="Seleccionar..." required />
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card mb-4">
            <template #title>Detalles Tecnicos</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-4">
                  <label for="alcohol_porcentaje" class="admin-label">Alcohol por Vol.</label>
                  <InputNumber v-model="form.alcohol_porcentaje" inputId="alcohol_porcentaje" class="w-full" suffix=" %" :minFractionDigits="1" :maxFractionDigits="1" placeholder="13.5" />
                </div>
                <div class="field col-12 md:col-4">
                  <label for="contenido_ml" class="admin-label">Contenido</label>
                  <InputNumber v-model="form.contenido_ml" inputId="contenido_ml" class="w-full" suffix=" ml" :useGrouping="false" placeholder="750" />
                </div>
                <div class="field col-12 md:col-4">
                  <label class="admin-label">Estado Inicial</label>
                  <div class="flex align-items-center gap-3 pt-2">
                    <ToggleSwitch v-model="form.estado" />
                    <Tag :value="form.estado ? 'Activo' : 'Inactivo'" :severity="form.estado ? 'success' : 'danger'" />
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <Card class="admin-card mb-4">
            <template #title>Nota del Sommelier</template>
            <template #content>
              <Textarea v-model="form.descripcion" id="descripcion" rows="7" class="w-full" autoResize placeholder="Describe el caracter, bouquet y final de esta cosecha..." />
            </template>
          </Card>

          <Card class="admin-card">
            <template #title>Valoracion y Stock</template>
            <template #content>
              <div class="grid formgrid">
                <div class="field col-12 md:col-4">
                  <label for="precio" class="admin-label">Precio Unitario</label>
                  <InputNumber v-model="form.precio" inputId="precio" class="w-full" mode="currency" currency="USD" locale="en-US" required />
                </div>
                <div class="field col-12 md:col-4">
                  <label for="cantidad" class="admin-label">Cantidad en Cava</label>
                  <InputNumber v-model="form.cantidad" inputId="cantidad" class="w-full" suffix=" Botellas" :useGrouping="false" required />
                </div>
                <div class="field col-12 md:col-4">
                  <label for="descuento" class="admin-label">Descuento</label>
                  <InputNumber v-model="form.descuento" inputId="descuento" class="w-full" suffix=" % OFF" :useGrouping="false" />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="col-12 xl:col-4">
          <Card class="admin-card mb-4">
            <template #title>Identidad Visual</template>
            <template #content>
              <div class="admin-upload" :class="{ 'has-image': form.imagen_url }" @click="fileInput?.click()">
                <img v-if="form.imagen_url" :src="form.imagen_url" alt="Preview">
                <div v-else class="flex flex-column align-items-center gap-3 text-center">
                  <i class="pi pi-image text-4xl text-primary"></i>
                  <div>
                    <h3 class="m-0 text-primary">Estetica de la Botella</h3>
                    <p class="mt-2 mb-0 text-sm text-600">Sube una fotografia en alta resolucion.</p>
                  </div>
                </div>
              </div>

              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload">

              <Button class="w-full mt-3" label="Subir imagen" icon="pi pi-upload" severity="secondary" outlined :loading="uploadingImage" @click="fileInput?.click()" />

              <div class="field mt-4">
                <label for="imagen_url" class="admin-label">URL de la Imagen Editorial</label>
                <InputText v-model="form.imagen_url" id="imagen_url" class="w-full" placeholder="https://ejemplo.com/imagen.jpg" />
              </div>
            </template>
          </Card>

          <Message severity="info" :closable="false">
            Al catalogar vinos de alta gama, resalta la region y la cosecha; son factores criticos de valoracion.
          </Message>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ProductoController, ImageController } from '@/controllers'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const notif = useNotificationStore()

const loadingForm = ref(true)
const loadingSubmit = ref(false)
const uploadingImage = ref(false)
const error = ref(null)

const categorias = ref([])
const marcas = ref([])
const paises = ref([])

const fileInput = ref(null)

const paisOptions = computed(() =>
  Array.isArray(paises.value) ? paises.value : Object.values(paises.value)
)

const form = reactive({
  nombre: '',
  id_categoria: '',
  id_marca: '',
  descripcion: '',
  precio: 0,
  cantidad: 0,
  descuento: 0,
  pais: '',
  region: '',
  anio_cosecha: null,
  alcohol_porcentaje: null,
  contenido_ml: 750,
  imagen_url: '',
  estado: true
})

async function fetchFormData() {
  try {
    const result = await ProductoController.obtenerFormData()

    if (!result.success) {
      throw new Error(result.message)
    }

    categorias.value = result.categorias
    marcas.value = result.marcas
    paises.value = result.paises
  } catch (err) {
    error.value = 'Error al cargar los datos auxiliares (categorias, marcas).'
    console.error(err)
  } finally {
    loadingForm.value = false
  }
}

async function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingImage.value = true
  try {
    const imageCtrl = new ImageController()
    const result = await imageCtrl.upload(file)

    if (!result.success) {
      throw new Error(result.message)
    }

    form.imagen_url = result.data.imagen_url
    notif.show('Imagen subida correctamente.', 'success')
  } catch (err) {
    error.value = err.message || 'Error al subir la imagen.'
  } finally {
    uploadingImage.value = false
  }
}

async function submitForm() {
  loadingSubmit.value = true
  error.value = null
  try {
    const result = await ProductoController.crearProducto(form)

    if (!result.success) {
      throw result
    }

    notif.show('Producto creado exitosamente.', 'success')
    router.push({ name: 'admin.productos.index' })
  } catch (err) {
    if (err.status === 422) {
      error.value = err.message || 'Error de validacion. Revisa los campos.'
    } else {
      error.value = 'Ocurrio un error inesperado al guardar el producto.'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loadingSubmit.value = false
  }
}

onMounted(fetchFormData)
</script>
