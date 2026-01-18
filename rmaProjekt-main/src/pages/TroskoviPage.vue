<template>
  <q-page padding>
    <div class="q-pa-md">

      <q-btn class="q-mx-md" label="Prikaži troškove"  color="blue" @click="prikaziTablicu = !prikaziTablicu"/>
      <q-btn class="q-mx-md" label="Dodaj novi trošak" color="red" @click="prikaziFormu = !prikaziFormu"/>
        <q-form v-if="prikaziFormu">
            <q-form class="q-gutter-md">
            <q-input color="blue" v-model="nazivTroska" label="Naziv troška" />
            <q-input color="grey-3" v-model="vrijednost" label="Vrijednost" type="number"/>
            <q-input color="grey-3" v-model="datum" label="Datum" type="date" />
            <q-input color="grey-3" v-model="opis" label="Opis troška"/>
                <div>
                <q-btn label="Submit" type="submit" color="primary" @click="unosTroska()" />
                <q-btn label="Reset" @click="resetInput" color="primary" flat class="q-ml-sm" />
                </div>
        </q-form>
      </q-form>
      <q-table v-if="prikaziTablicu" flat bordered :rows="troskovi" :columns="columns" row-key="id" :wrap-cells="true" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { Notify } from 'quasar'

let troskovi = ref([])
let prikaziTablicu= ref(false)
const prikaziFormu = ref(false)
const nazivTroska = ref('')
const vrijednost = ref('')
const datum = ref('')
const opis = ref('')

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nazivTroska', label: 'Naziv troška', field: 'nazivTroska', align: 'left' },
  { name: 'vrijednost', label: 'Vrijednost', field: 'vrijednost', align: 'right' },
  { name: 'datum', label: 'Datum', field: 'datum', align: 'left' },
  { name: 'opis', label: 'Opis', field: 'opis', align: 'left' }
]
onMounted(() => {
  loadTroskovi()
})

async function loadTroskovi() {
  try {
    const result = await axios.get('http://localhost:3000/api/troskovi')
    troskovi.value = result.data
  } catch (error) {
    console.error(error)
  }
}
async function unosTroska () {
  const formData = {
    nazivTroska: nazivTroska.value,
    vrijednost: vrijednost.value,
    datum: datum.value,
    opis: opis.value
  }


  try {
    const result = await axios.post('http://localhost:3000/api/unostroskova', formData)

    Notify.create({
      type: 'positive',
      message: 'Trošak uspješno dodan!'
    })

    console.log(result)
  } 
  catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Neuspješan unos troška!'
    })

    console.log(error)
  }
}
function resetInput () {
  nazivTroska.value = ''
  vrijednost.value = ''
  datum.value = ''
  opis.value = ''
}
</script>
