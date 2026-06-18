<template>
  <main>

    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="hero-section flex align-items-center">
      <div class="page-container grid align-items-center">

        <div class="col-12 md:col-6">
          <span class="eyebrow">Boutique de Selección</span>
          <h1 class="hero-title">
            Curaduría <br /><span class="text-italic">con Alma.</span>
          </h1>
          <p class="hero-body">
            En La Última Botella no solo vendemos vino; recorremos las bodegas más exclusivas
            del mundo para encontrar esas piezas únicas que merecen un lugar en tu colección.
          </p>
        </div>

        <div class="col-12 md:col-6 relative">
          <div class="hero-img-main border-round overflow-hidden shadow-4">
            <img
              class="w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6lysfBeryigaP3EPQfLvg-Xxg_Hy50JofrdJVweT9lT05jrAYJ5yRUzMetBSvJh8RoZXsLLx2zyvgFfE-ItMUdfwvvUU_eRtHR0OvmibjNBzf14zmEaoFKtjqdtkTwtLuIsNAUDxwrIIGWr7nJZiae4oIPaX5L8nrR3IVkv44tv68iBGR8kIv_H-ZNh8mp0TAB1GMSaHvTqGi5KVfREGnhKTLhq8qorWJ_REpASgubzqjP98HbuwzjJbfVqFpfbrDuZE9rxpDIGLp"
              alt="Bodega con velas"
            />
          </div>
          <div class="hero-img-floating absolute border-round overflow-hidden shadow-5 hidden md:block">
            <img
              class="w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5tAWfmciXKBkJ_P_eEeW_dJ0lOkVbgG-VggXTjpU36EH4FjtsI-gcnvWWI0Q1B1z1oZ1sBgtU3FQMPae8-kfb58-wLWnP03YxuWFYBcG-_GeoMCQZ74q-sHhAUEUlKreWOjNGRldBvKLLaNuyOyToGGDIEJ6qJ8vFPXFYQOpfnjLBHDXMGS8dQzkiW-CnrM5gHSh66uMN3vBXuqFD3Tvf8Yg7mWGZis6P7GnaWfFFveBG3wSrqigEdCoL1RsU8Xg9F6OF_dW_9FoF"
              alt="Viñedos al amanecer"
            />
          </div>
        </div>

      </div>
    </section>

    <!-- ── Filosofía ─────────────────────────────────────────────────────── -->
    <section class="surface-section" style="background-color: var(--brand-beige);">
      <div class="page-container">
        <div class="philosophy-block mx-auto text-center">
          <h2 class="philosophy-quote">
            «No somos solo una tienda; somos el puente entre la bodega y tu copa.»
          </h2>

          <div class="grid mt-8">
            <div class="col-12 md:col-4">
              <Card class="pillar-card">
                <template #title>El Origen</template>
                <template #content>
                  <p class="pillar-body">
                    Cada etiqueta en nuestro catálogo ha sido seleccionada tras un riguroso proceso
                    de cata, asegurando autenticidad y excelencia desde su tierra natal.
                  </p>
                </template>
              </Card>
            </div>
            <div class="col-12 md:col-4">
              <Card class="pillar-card">
                <template #title>La Excelencia</template>
                <template #content>
                  <p class="pillar-body">
                    Buscamos vinos que cuenten una historia. Desde pequeños productores independientes
                    hasta las casas más prestigiosas del viejo mundo.
                  </p>
                </template>
              </Card>
            </div>
            <div class="col-12 md:col-4">
              <Card class="pillar-card">
                <template #title>El Vínculo</template>
                <template #content>
                  <p class="pillar-body">
                    Nuestra misión es educar y conectar. Facilitamos el acceso a botellas que de otro
                    modo serían imposibles de encontrar en mercados convencionales.
                  </p>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Editorial Break ───────────────────────────────────────────────── -->
    <section class="editorial-section relative overflow-hidden">
      <img
        class="w-full h-full"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSS9Sdznr_JJw2ixxvreypojY_DkH5T4vY0E7LtaCYr4mwJl3yc3sbCisne9GP4o6Nx4ODmXp04Arg2nLChC77I2fNmXn26BHrOxLYs6K_WMwVcx29-Fchzvq6u7q9AAWXtsvEVpJFjwI2zx-lyow6VjP09NHSOO0snbErzRGITnOKOkvb1xhOse2S41xyE1kQI01YBxVfy7JirjNelHTYvFGxTUF0HTteM7PZl2h0obXUFezahs3z7SYDwum0k487425aJQDesmG4"
        alt="Bodega al atardecer"
      />
      <div class="editorial-overlay absolute top-0 left-0 w-full h-full flex align-items-center justify-content-center">
        <h2 class="editorial-headline text-center px-3">
          Corazón Tradicional, Paladar Moderno.
        </h2>
      </div>
    </section>

    <!-- ── Nuestra Misión ───────────────────────────────────────────────── -->
    <section class="surface-section">
      <div class="page-container grid align-items-center">

        <!-- Imagen -->
        <div class="col-12 md:col-6 relative mb-6 md:mb-0">
          <div class="mission-img border-round overflow-hidden shadow-4">
            <img
              class="w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3r2h7XKPkrrSxHPKSoTGcWQwenUGmS2bug8H8hDelLMf1PVjYb6EXcARFsdl8i-1bLMoaXBBYUqBdhDSR43P7uSZUBDcjBgs8HfJD4MCRNVUyl1XBSqtMddGXu1GqZR-Trcp8cBheZX3kuFa71rozqQ3TtJSl04avpxPudrUbDl-0gtq5OvGCboIgf-o15qm-KaFBacrlNwslhfvdBNz-LUusgRkapyv_xykgu1SQB_PCWrO-NFTUhrkqW0sQQ6hFAiRI5_ICMz4Y"
              alt="Barricas de roble"
            />
          </div>
          <div class="mission-card absolute border-round shadow-5 hidden md:block p-4">
            <p class="mission-card-text">
              "Selección artesanal, <br />corazón volcado."
            </p>
          </div>
        </div>

        <!-- Texto -->
        <div class="col-12 md:col-6 mission-text">
          <span class="eyebrow">Nuestra Misión</span>
          <h2 class="mission-title">Seleccionando lo <br />Inalcanzable.</h2>
          <p class="mission-body">
            La Última Botella no es solo un catálogo, es una curaduría personal. Seleccionamos
            tirajes limitados y joyas ocultas de bodegas familiares, asegurando que cada botella
            que llega a tus manos sea una pieza de colección.
          </p>

          <div class="flex flex-column gap-4 mb-6">
            <div class="feature-row flex align-items-center gap-3">
              <i class="pi pi-verified feature-icon"></i>
              <span class="font-medium">Autenticidad Garantizada</span>
            </div>
            <div class="feature-row flex align-items-center gap-3">
              <i class="pi pi-box feature-icon"></i>
              <span class="font-medium">Almacenamiento en Cava Privada</span>
            </div>
            <div class="feature-row flex align-items-center gap-3">
              <i class="pi pi-truck feature-icon"></i>
              <span class="font-medium">Logística de Guante Blanco</span>
            </div>
          </div>

          <router-link to="/catalogo">
            <Button label="Ver Productos" icon="pi pi-arrow-right" iconPos="right" class="btn-primary " style="background-color: var(--primary);border: none;"/>
          </router-link>
        </div>

      </div>
    </section>

  </main>
</template>

<script setup>
// Página estática — sin llamadas a API
import Button from 'primevue/button';
import Card from 'primevue/card';
</script>

<style scoped>
/* Unificar paleta: usar variables y ajustar fondos/textos al beige de la app */
:root{
  --brand-beige: #fbfbe2;
  --brand-burgundy: #2a0002;
  --brand-body: #544341;
  --brand-accent: #735c00;
}

/* ── Tokens de marca (no cubiertos por PrimeFlex) ──────────────────────── */
.page-container {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}
@media (min-width: 768px) {
  .page-container { padding-inline: 3rem; }
}

/* Hero */
.hero-section {
  position: relative;
  min-height: 80vh;
  overflow: hidden;
  background-color: var(--brand-beige);
  padding-block: 4rem;
}

.eyebrow {
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--brand-accent);
  margin-bottom: 1.5rem;
  font-weight: 700;
  display: block;
}

.hero-title {
  font-family: 'Noto Serif', serif;
  color: var(--brand-burgundy);
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 1;
  margin-bottom: 2rem;
  margin-left: -4px;
}

.text-italic { font-style: italic; }

.hero-body {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  color: var(--brand-body);
  max-width: 28rem;
  line-height: 1.7;
}

.hero-img-main {
  aspect-ratio: 3 / 4;
  width: 100%;
  background-color: var(--brand-beige);
  transform: rotate(2deg);
}

.hero-img-floating {
  aspect-ratio: 1 / 1;
  width: 16rem;
  bottom: -3rem;
  left: -3rem;
  background-color: var(--brand-burgundy);
  border: 12px solid var(--brand-beige);
  transform: rotate(-3deg);
}
.hero-img-floating img { opacity: 0.95; }

/* Filosofía */
.surface-section { padding-block: 8rem; background-color: var(--brand-beige) !important; }

.philosophy-block { max-width: 72rem; }

.philosophy-quote {
  font-family: 'Noto Serif', serif;
  font-size: 2rem;
  color: #111111; /* texto oscuro para máxima legibilidad */
  font-style: italic;
  margin-bottom: 2.5rem;
}

.pillar-card { background: transparent; box-shadow: none; text-align: left; }
.pillar-card :deep(.p-card-title) {
  font-family: 'Noto Serif', serif;
  font-size: 1.125rem;
  color: #111111; 
}
.pillar-card :deep(.p-card-body) { padding: 0; }
.pillar-body {
  font-family: 'Manrope', sans-serif;
  font-size: 0.95rem;
  color: #111111; /* texto de los párrafos en negro para contraste */
  line-height: 1.8;
}

/* Editorial: imagen de fondo con overlay oscuro y texto claro */
.editorial-section { height: 614px; position: relative; overflow: hidden; }
.editorial-section img { display: block; width: 100%; height: 100%; object-fit: cover; }
.editorial-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(42, 0, 2, 0.2);
  backdrop-filter: brightness(75%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 1.5rem;
}
.editorial-headline {
  font-family: 'Noto Serif', serif;
  color: white;
  font-size: clamp(3rem, 7vw, 5rem);
  font-style: italic;
  text-align: center;
  text-shadow: 0 6px 20px rgba(0,0,0,0.5);
}

/* Misión */
.mission-img {
  aspect-ratio: 4 / 5;
  width: 100%;
  background-color: var(--brand-beige) !important;
}

.mission-card {
  top: -2.5rem;
  right: -2.5rem;
  background-color: #ffe088;
}
.mission-card-text {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-style: italic;
  line-height: 1.3;
  margin: 0;
}

.mission-title {
  font-family: 'Noto Serif', serif;
  font-size: 3.25rem;
  color: var(--brand-burgundy);
  margin-bottom: 2rem;
  line-height: 1.1;
}

.mission-body {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  color: var(--brand-body);
  margin-bottom: 3rem;
  line-height: 1.7;
}

.mission-text { padding-left: 2.5rem; }
@media (max-width: 767px) { .mission-text { padding-left: 0; } }

.feature-row {
  border-bottom: 1px solid rgba(218, 193, 191, 0.2);
  padding-bottom: 1rem;
  font-family: 'Manrope', sans-serif;
}
.feature-icon { color: var(--brand-accent); font-size: 1.25rem; }

/* Botón principal: se reusa para cualquier <Button class="btn-primary"> */
:deep(.btn-primary) {
  background-color: var(--brand-burgundy);
  border-color: var(--brand-burgundy);
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  padding: 1.25rem 2.5rem;
  border-radius: 6px;
  box-shadow: 0 10px 20px rgba(42, 0, 2, 0.15);
}
:deep(.btn-primary:hover) { background-color: #3d0003; border-color: #3d0003; }
:deep(.btn-primary:active) { transform: scale(0.95); }
</style>