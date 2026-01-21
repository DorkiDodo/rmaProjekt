<template>
  <q-page padding class="q-gutter-y-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-grey-1 full-height">
          <q-card-section>
            <div class="text-h6 q-mb-sm">Mjesečni Proračun</div>
            <div class="text-subtitle1 q-mb-md">{{ ukupniTrosak }} / {{ mjesečniLimit }} EUR</div>
            <q-linear-progress size="25px" :value="procentualnaPotrosnja" :color="procentualnaPotrosnja > 0.9 ? 'red' : 'blue'" stripe rounded>
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="black" :label="`${(procentualnaPotrosnja * 100).toFixed(0)}%`" />
              </div>
            </q-linear-progress>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered v-if="troskovi.length" class="full-height">
          <q-card-section>
            <div class="text-h6 q-mb-md">Raspodjela</div>
            <apexchart type="pie" height="250" :options="pieOptions" :series="pieSeries" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-gutter-x-md">
      <q-btn label="Prikaži troškove" color="blue" icon="list" @click="prikaziTablicu = !prikaziTablicu" />
      <q-btn label="Dodaj novi trošak" color="red" icon="add" @click="prikaziFormu = !prikaziFormu" />
    </div>

    <q-card v-if="prikaziFormu" flat bordered>
      <q-card-section>
        <q-form @submit.prevent="unosTroska" class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <q-input class="col-12 col-sm-6" v-model="nazivTroska" label="Naziv troška" outlined dense color="blue" />
            <q-input class="col-12 col-sm-6" v-model.number="vrijednost" label="Vrijednost" type="number" outlined dense color="blue" />
            <q-input class="col-12 col-sm-6" v-model="datum" label="Datum" type="date" outlined dense color="blue" />
            <q-input class="col-12" v-model="opis" label="Opis troška" outlined dense color="blue" />
          </div>
          <div class="row q-gutter-sm">
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" flat color="grey" @click="resetInput" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-table v-if="prikaziTablicu" flat bordered :rows="troskovi" :columns="columns" row-key="id" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

// All your original refs preserved
const troskovi = ref([])
const prikaziTablicu = ref(false)
const prikaziFormu = ref(false)
const nazivTroska = ref('')
const vrijednost = ref(0)
const datum = ref(new Date().toISOString().slice(0, 10))
const opis = ref('')
const mjesečniLimit = ref(1500)

const columns = [
  { name: 'nazivTroska', label: 'Naziv', field: 'nazivTroska', align: 'left' },
  { name: 'vrijednost', label: 'Iznos', field: 'vrijednost', align: 'right', format: val => `${val} €` },
  { name: 'datum', label: 'Datum', field: 'datum', align: 'left' },
  { name: 'opis', label: 'Opis', field: 'opis', align: 'left' }
]

const ukupniTrosak = computed(() => troskovi.value.reduce((s, i) => s + Number(i.vrijednost), 0))
const procentualnaPotrosnja = computed(() => Math.min(ukupniTrosak.value / mjesečniLimit.value, 1))

const pieSeries = computed(() => {
  const map = {}
  troskovi.value.forEach(t => map[t.nazivTroska] = (map[t.nazivTroska] || 0) + Number(t.vrijednost))
  return Object.values(map)
})

const pieOptions = computed(() => ({
  labels: [...new Set(troskovi.value.map(t => t.nazivTroska))],
  legend: { position: 'bottom' }
}))

async function loadTroskovi() {
  const { data } = await axios.get('http://localhost:3000/api/troskovi')
  troskovi.value = data
}

async function unosTroska() {
  try {
    await axios.post('http://localhost:3000/api/unostroskova', {
      nazivTroska: nazivTroska.value,
      vrijednost: vrijednost.value,
      datum: datum.value,
      opis: opis.value
    })
    Notify.create({ type: 'positive', message: 'Uspješno spremljeno' })
    resetInput(); loadTroskovi(); prikaziFormu.value = false
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Greška!' })
  }
}

function resetInput() {
  nazivTroska.value = ''; vrijednost.value = 0; opis.value = ''
  datum.value = new Date().toISOString().slice(0, 10)
}

onMounted(loadTroskovi)
</script>
