<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="activeTab === 'table' ? 'modal-table-title' : 'modal-takeaway-title'"
        @click.self="closeModal"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-2xl bg-zinc-950 border border-masanielli-gold/40 rounded-3xl shadow-2xl overflow-hidden text-gray-100 my-auto transform transition-all"
        >
          <!-- Top Accent Glow Line -->
          <div class="h-1 w-full bg-gradient-to-r from-transparent via-masanielli-gold to-transparent"></div>

          <!-- Header & Close Button -->
          <div class="px-6 pt-6 pb-4 flex items-center justify-between border-b border-zinc-800/80">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-masanielli-gold/10 border border-masanielli-gold/30 flex items-center justify-center text-masanielli-gold">
                <span v-if="activeTab === 'table'" class="text-xl">📅</span>
                <span v-else class="text-xl">🛍️</span>
              </div>
              <div>
                <h3 class="text-xl md:text-2xl font-serif font-black uppercase text-white tracking-wide">
                  {{ activeTab === 'table' ? 'Rezervacija Mize' : 'Naročilo Za S Seboj' }}
                </h3>
                <p class="text-xs text-masanielli-gold font-mono tracking-wider">
                  Kader Grad Kodeljevo · Neapolitan Pizzeria & Bar
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              aria-label="Zapri okno"
              class="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Tab Navigation Switcher -->
          <div class="px-6 pt-4 pb-2">
            <div class="grid grid-cols-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl gap-1">
              <button
                type="button"
                @click="switchTab('table')"
                :class="[
                  'py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]',
                  activeTab === 'table'
                    ? 'bg-masanielli-gold text-black shadow-lg shadow-masanielli-gold/15 font-black'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                ]"
              >
                <span>📅</span>
                <span>Miza (Rezervacija)</span>
              </button>

              <button
                type="button"
                @click="switchTab('takeaway')"
                :class="[
                  'py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 min-h-[44px]',
                  activeTab === 'takeaway'
                    ? 'bg-masanielli-gold text-black shadow-lg shadow-masanielli-gold/15 font-black'
                    : 'text-gray-400 hover:text-white hover:bg-zinc-800/60'
                ]"
              >
                <span>🛍️</span>
                <span>Za S Seboj (Takeaway)</span>
              </button>
            </div>
          </div>

          <!-- ==================== TAB 1: TABLE RESERVATION ==================== -->
          <div v-if="activeTab === 'table'" class="p-6">
            <!-- Success State -->
            <div v-if="tableSuccess" class="text-center py-8 space-y-4">
              <div class="w-16 h-16 bg-masanielli-gold/20 text-masanielli-gold border border-masanielli-gold rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                ✓
              </div>
              <h4 class="text-2xl font-serif font-black text-white uppercase">Rezervacija Uspešno Zabeležena!</h4>
              <p class="text-sm text-gray-300 max-w-md mx-auto">
                Hvala, <strong class="text-masanielli-gold">{{ tableForm.name }}</strong>! Vašo mizo za <strong class="text-white">{{ tableForm.guests }} oseb</strong> smo rezervirali za termin <strong class="text-white">{{ tableForm.date }} ob {{ tableForm.time }}</strong>.
              </p>
              <div class="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
                <div class="flex justify-between text-gray-400">
                  <span>Referenca rezervacije:</span>
                  <span class="text-masanielli-gold font-bold">{{ tableReference }}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>Izbrano območje:</span>
                  <span class="text-white">{{ tableForm.area === 'garden' ? 'Poletni grajski vrt' : 'Notranji grajski ambient' }}</span>
                </div>
                <div class="flex justify-between text-gray-400">
                  <span>Lokacija:</span>
                  <span class="text-white">Grad Kodeljevo, Benza 20</span>
                </div>
              </div>
              <p class="text-xs text-gray-400 italic">
                * Mizo hranimo 15 minut po rezervirani uri. V primeru odpovedi nas prosimo pravočasno pokličite.
              </p>
              <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+38640175628"
                  class="px-6 py-3 bg-zinc-900 border border-masanielli-gold/40 text-masanielli-gold rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors flex items-center justify-center min-h-[44px]"
                >
                  📞 Klic v picerijo (+386 40 175 628)
                </a>
                <button
                  type="button"
                  @click="resetAndClose"
                  class="px-8 py-3 bg-masanielli-gold text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-masanielli-goldLight transition-colors min-h-[44px]"
                >
                  Zaključi
                </button>
              </div>
            </div>

            <!-- Booking Form -->
            <form v-else @submit.prevent="submitTableReservation" class="space-y-5">
              <!-- Date & Time Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Datum Obiska *
                  </label>
                  <input
                    type="date"
                    v-model="tableForm.date"
                    :min="todayString"
                    required
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  />
                  <!-- Quick Date Chips -->
                  <div class="flex gap-2 mt-2">
                    <button
                      type="button"
                      @click="setTableDateOffset(0)"
                      :class="['text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors', isTableToday ? 'bg-masanielli-gold/20 border-masanielli-gold text-masanielli-gold font-bold' : 'bg-zinc-900 border-zinc-800 text-gray-400']"
                    >
                      Danes
                    </button>
                    <button
                      type="button"
                      @click="setTableDateOffset(1)"
                      :class="['text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors', isTableTomorrow ? 'bg-masanielli-gold/20 border-masanielli-gold text-masanielli-gold font-bold' : 'bg-zinc-900 border-zinc-800 text-gray-400']"
                    >
                      Jutri
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Ura (Kuhinja 12:00 – 22:00) *
                  </label>
                  <select
                    v-model="tableForm.time"
                    required
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  >
                    <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
                      {{ slot }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Guest Count & Area -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Število Oseb (1–12+) *
                  </label>
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      @click="adjustGuests(-1)"
                      class="w-12 h-11 bg-zinc-900 border border-zinc-700 text-white rounded-xl flex items-center justify-center font-bold text-lg hover:bg-zinc-800 min-h-[44px] min-w-[44px]"
                    >
                      −
                    </button>
                    <div class="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 text-center font-mono font-black text-lg text-white">
                      {{ tableForm.guests }} {{ tableForm.guests === 1 ? 'oseba' : tableForm.guests === 2 ? 'osebi' : tableForm.guests < 5 ? 'osebe' : 'oseb' }}
                    </div>
                    <button
                      type="button"
                      @click="adjustGuests(1)"
                      class="w-12 h-11 bg-zinc-900 border border-zinc-700 text-white rounded-xl flex items-center justify-center font-bold text-lg hover:bg-zinc-800 min-h-[44px] min-w-[44px]"
                    >
                      +
                    </button>
                  </div>
                  <p v-if="tableForm.guests >= 10" class="text-[11px] text-masanielli-gold mt-1.5 font-light">
                    * Za večje skupine (12+) nudimo tudi zasebni najem grajskih dvoran.
                  </p>
                </div>

                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Želeno Območje *
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      @click="tableForm.area = 'garden'"
                      :class="[
                        'p-2.5 rounded-xl border text-xs font-semibold text-left transition-all min-h-[44px]',
                        tableForm.area === 'garden'
                          ? 'border-masanielli-gold bg-masanielli-gold/15 text-white'
                          : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                      ]"
                    >
                      🌳 Poletni Vrt
                      <span class="block text-[10px] text-gray-500 font-normal">Na grajskem dvorišču</span>
                    </button>

                    <button
                      type="button"
                      @click="tableForm.area = 'inside'"
                      :class="[
                        'p-2.5 rounded-xl border text-xs font-semibold text-left transition-all min-h-[44px]',
                        tableForm.area === 'inside'
                          ? 'border-masanielli-gold bg-masanielli-gold/15 text-white'
                          : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                      ]"
                    >
                      🏰 Notranji Bistro
                      <span class="block text-[10px] text-gray-500 font-normal">Grajski oboki & bar</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Ime in Priimek *
                  </label>
                  <input
                    type="text"
                    v-model="tableForm.name"
                    required
                    placeholder="npr. Luka Novak"
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Telefonska Številka (za potrditev) *
                  </label>
                  <input
                    type="tel"
                    v-model="tableForm.phone"
                    required
                    placeholder="npr. +386 40 123 456"
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                  Posebne Želje / Opombe (alergije, rojstni dan, otroški stolček)
                </label>
                <textarea
                  v-model="tableForm.notes"
                  rows="2"
                  placeholder="Navedite morebitne posebnosti..."
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-masanielli-gold"
                ></textarea>
              </div>

              <!-- Actions & Quick Call -->
              <div class="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:flex-1 py-4 bg-masanielli-gold text-black rounded-xl font-serif font-bold text-xs uppercase tracking-[0.2em] hover:bg-masanielli-goldLight transition-all duration-300 shadow-xl shadow-masanielli-gold/15 flex items-center justify-center min-h-[48px]"
                >
                  <span v-if="isSubmitting">Beleženje rezervacije...</span>
                  <span v-else>Potrdi Rezervacijo Mize</span>
                </button>

                <a
                  href="tel:+38640175628"
                  class="w-full sm:w-auto px-5 py-4 bg-zinc-900 border border-zinc-700 hover:border-masanielli-gold text-masanielli-gold rounded-xl text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[48px]"
                >
                  <span>📞</span>
                  <span>Ali pokličite: +386 40 175 628</span>
                </a>
              </div>
            </form>
          </div>

          <!-- ==================== TAB 2: TAKEAWAY ORDER ==================== -->
          <div v-else class="p-6">
            <!-- Success State -->
            <div v-if="takeawaySuccess" class="text-center py-8 space-y-4">
              <div class="w-16 h-16 bg-masanielli-gold/20 text-masanielli-gold border border-masanielli-gold rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                🛍️
              </div>
              <h4 class="text-2xl font-serif font-black text-white uppercase">Naročilo Je V Pripravi!</h4>
              <p class="text-sm text-gray-300 max-w-md mx-auto">
                Hvala, <strong class="text-masanielli-gold">{{ takeawayForm.name }}</strong>! Vaše naročilo je bilo posredovano v picerijo. Prevzem bo pripravljen ob približno <strong class="text-white">{{ takeawayForm.pickupTime }}</strong>.
              </p>
              
              <div class="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                <div class="flex justify-between text-gray-400">
                  <span>Številka naročila:</span>
                  <span class="text-masanielli-gold font-bold">{{ takeawayReference }}</span>
                </div>
                <div class="border-t border-zinc-800 pt-2 space-y-1">
                  <div v-for="item in cartItems" :key="item.name" class="flex justify-between text-gray-300">
                    <span>{{ item.quantity }}x {{ item.name }}</span>
                    <span>{{ (parsePrice(item.price) * item.quantity).toFixed(2) }} €</span>
                  </div>
                </div>
                <div class="border-t border-zinc-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Znesek za plačilo:</span>
                  <span class="text-masanielli-gold">{{ cartTotal.toFixed(2) }} €</span>
                </div>
              </div>

              <div class="p-3 bg-zinc-950/80 border border-masanielli-gold/30 rounded-xl text-left max-w-md mx-auto text-xs text-gray-400 space-y-1">
                <p class="font-bold text-white">📍 Prevzemno mesto:</p>
                <p>Točilni pult Pizzeria Kader, Grad Kodeljevo (Ulica Carla Benza 20, Ljubljana).</p>
                <p>Plačilo ob prevzemu (kartica ali gotovina).</p>
              </div>

              <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+38683836740"
                  class="px-6 py-3 bg-zinc-900 border border-masanielli-gold/40 text-masanielli-gold rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors flex items-center justify-center min-h-[44px]"
                >
                  📞 Telefon za naročila (+386 83 836 740)
                </a>
                <button
                  type="button"
                  @click="resetAndClose"
                  class="px-8 py-3 bg-masanielli-gold text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-masanielli-goldLight transition-colors min-h-[44px]"
                >
                  Zapri
                </button>
              </div>
            </div>

            <!-- Takeaway Form -->
            <form v-else @submit.prevent="submitTakeawayOrder" class="space-y-5">
              <!-- Selected Order Items Cart -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold">
                    Izbrane Jedi za Prevzem
                  </label>
                  <span class="text-xs text-gray-400 font-mono">
                    Skupaj: <strong class="text-masanielli-gold text-sm">{{ cartTotal.toFixed(2) }} €</strong>
                  </span>
                </div>

                <!-- Empty State Notice -->
                <div v-if="cartItems.length === 0" class="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
                  <p class="text-xs text-gray-400 mb-3">V naročilu še nimate izbranih jedi.</p>
                  <button
                    type="button"
                    @click="addSamplePizza"
                    class="px-4 py-2 bg-masanielli-gold/15 border border-masanielli-gold text-masanielli-gold rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-masanielli-gold/25"
                  >
                    + Dodaj priporočeno: Pica Bufalina (12 €)
                  </button>
                </div>

                <!-- Cart Items List -->
                <div v-else class="space-y-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3">
                  <div
                    v-for="(item, index) in cartItems"
                    :key="index"
                    class="flex items-center justify-between py-2 px-2 border-b border-zinc-800/80 last:border-b-0"
                  >
                    <div>
                      <h5 class="text-sm font-serif font-bold text-white">{{ item.name }}</h5>
                      <span class="text-xs text-masanielli-gold font-mono">{{ item.price }} / kos</span>
                    </div>

                    <div class="flex items-center space-x-3">
                      <div class="flex items-center space-x-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                        <button
                          type="button"
                          @click="changeItemQuantity(index, -1)"
                          class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded font-mono font-bold text-sm min-h-[32px] min-w-[32px]"
                        >
                          −
                        </button>
                        <span class="px-2 font-mono font-bold text-xs text-white">{{ item.quantity }}</span>
                        <button
                          type="button"
                          @click="changeItemQuantity(index, 1)"
                          class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded font-mono font-bold text-sm min-h-[32px] min-w-[32px]"
                        >
                          +
                        </button>
                      </div>

                      <span class="text-xs font-mono font-bold text-white w-14 text-right">
                        {{ (parsePrice(item.price) * item.quantity).toFixed(2) }} €
                      </span>

                      <button
                        type="button"
                        @click="removeItem(index)"
                        class="text-gray-500 hover:text-red-400 p-1 text-sm min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Odstrani"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Quick Add Popular Items -->
                  <div class="pt-2 border-t border-zinc-800/80 flex flex-wrap gap-2 items-center">
                    <span class="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Hitro dodaj:</span>
                    <button
                      type="button"
                      @click="quickAddItem('Panuozzo Mortadela', '9 €')"
                      class="text-[10px] font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-gray-300 hover:border-masanielli-gold/50"
                    >
                      + Panuozzo Mortadela (9 €)
                    </button>
                    <button
                      type="button"
                      @click="quickAddItem('Fokača (Focaccia)', '3.50 €')"
                      class="text-[10px] font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-gray-300 hover:border-masanielli-gold/50"
                    >
                      + Fokača (3.50 €)
                    </button>
                    <button
                      type="button"
                      @click="quickAddItem('Domača Limonada', '3.00 €')"
                      class="text-[10px] font-mono px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-gray-300 hover:border-masanielli-gold/50"
                    >
                      + Limonada (3.00 €)
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pickup Timing Selection -->
              <div>
                <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                  Čas Prevzema *
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    @click="takeawayForm.pickupType = 'asap'; takeawayForm.pickupTime = 'Čim prej (~20–25 min)'"
                    :class="[
                      'p-2.5 rounded-xl border text-xs font-bold text-center transition-all min-h-[44px]',
                      takeawayForm.pickupType === 'asap'
                        ? 'border-masanielli-gold bg-masanielli-gold/20 text-masanielli-gold'
                        : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                    ]"
                  >
                    ⚡ Čim prej
                    <span class="block text-[10px] text-gray-400 font-normal">~20-25 min</span>
                  </button>

                  <button
                    type="button"
                    @click="takeawayForm.pickupType = '45min'; takeawayForm.pickupTime = 'Čez 45 minut'"
                    :class="[
                      'p-2.5 rounded-xl border text-xs font-bold text-center transition-all min-h-[44px]',
                      takeawayForm.pickupType === '45min'
                        ? 'border-masanielli-gold bg-masanielli-gold/20 text-masanielli-gold'
                        : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                    ]"
                  >
                    Čez 45 min
                    <span class="block text-[10px] text-gray-400 font-normal">Standard</span>
                  </button>

                  <button
                    type="button"
                    @click="takeawayForm.pickupType = '60min'; takeawayForm.pickupTime = 'Čez 1 uro'"
                    :class="[
                      'p-2.5 rounded-xl border text-xs font-bold text-center transition-all min-h-[44px]',
                      takeawayForm.pickupType === '60min'
                        ? 'border-masanielli-gold bg-masanielli-gold/20 text-masanielli-gold'
                        : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                    ]"
                  >
                    Čez 1 uro
                    <span class="block text-[10px] text-gray-400 font-normal">Vnaprej</span>
                  </button>

                  <button
                    type="button"
                    @click="takeawayForm.pickupType = 'custom'"
                    :class="[
                      'p-2.5 rounded-xl border text-xs font-bold text-center transition-all min-h-[44px]',
                      takeawayForm.pickupType === 'custom'
                        ? 'border-masanielli-gold bg-masanielli-gold/20 text-masanielli-gold'
                        : 'border-zinc-800 bg-zinc-900 text-gray-400 hover:border-zinc-700'
                    ]"
                  >
                    Točna Ura
                    <span class="block text-[10px] text-gray-400 font-normal">Izberi spodaj</span>
                  </button>
                </div>

                <div v-if="takeawayForm.pickupType === 'custom'" class="mt-2">
                  <select
                    v-model="takeawayForm.pickupTime"
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  >
                    <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
                      Prevzem danes ob {{ slot }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Ime za Prevzem *
                  </label>
                  <input
                    type="text"
                    v-model="takeawayForm.name"
                    required
                    placeholder="npr. Ana Kranjc"
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                    Telefonska Številka *
                  </label>
                  <input
                    type="tel"
                    v-model="takeawayForm.phone"
                    required
                    placeholder="npr. +386 83 123 456"
                    class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                  />
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-xs font-mono font-bold uppercase tracking-wider text-masanielli-gold mb-1.5">
                  Navodila Picopeku (npr. narezano na 4 kose, brez origana...)
                </label>
                <input
                  type="text"
                  v-model="takeawayForm.notes"
                  placeholder="Dodatna navodila za kuhinjo..."
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-masanielli-gold min-h-[44px]"
                />
              </div>

              <!-- Takeaway Guarantee Box -->
              <div class="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-start space-x-3 text-xs text-gray-400">
                <span class="text-masanielli-gold text-base">🍕</span>
                <div>
                  <strong class="text-white">Embalaža za ohranitev hrustljavosti:</strong>
                  Vse pice pakiramo v posebne neapeljske škatle z zračnimi režami, da para ne zmehča hrustljavega robčka med transportom.
                </div>
              </div>

              <!-- Actions & Quick Call -->
              <div class="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  :disabled="isSubmitting || cartItems.length === 0"
                  class="w-full sm:flex-1 py-4 bg-masanielli-gold text-black rounded-xl font-serif font-bold text-xs uppercase tracking-[0.2em] hover:bg-masanielli-goldLight transition-all duration-300 shadow-xl shadow-masanielli-gold/15 flex items-center justify-center disabled:opacity-50 min-h-[48px]"
                >
                  <span v-if="isSubmitting">Oddajanje naročila...</span>
                  <span v-else>Oddaj Naročilo za Prevzem ({{ cartTotal.toFixed(2) }} €)</span>
                </button>

                <a
                  href="tel:+38683836740"
                  class="w-full sm:w-auto px-5 py-4 bg-zinc-900 border border-zinc-700 hover:border-masanielli-gold text-masanielli-gold rounded-xl text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-colors min-h-[48px]"
                >
                  <span>📞</span>
                  <span>Hitri Klic: +386 83 836 740</span>
                </a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

export interface OrderCartItem {
  name: string
  price: string
  quantity: number
}

const props = defineProps<{
  isOpen: boolean
  initialTab?: 'table' | 'takeaway'
  preselectedItem?: { name: string; price: string; quantity?: number } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'tableReserved', payload: any): void
  (e: 'takeawayOrdered', payload: any): void
}>()

const activeTab = ref<'table' | 'takeaway'>(props.initialTab || 'table')
const isSubmitting = ref(false)
const tableSuccess = ref(false)
const takeawaySuccess = ref(false)
const tableReference = ref('')
const takeawayReference = ref('')

// Cart state for takeaway orders
const cartItems = ref<OrderCartItem[]>([])

const tableForm = reactive({
  date: new Date().toISOString().split('T')[0],
  time: '18:00',
  guests: 2,
  area: 'garden' as 'garden' | 'inside',
  name: '',
  phone: '',
  notes: ''
})

const takeawayForm = reactive({
  pickupType: 'asap',
  pickupTime: 'Čim prej (~20–25 min)',
  name: '',
  phone: '',
  notes: ''
})

// Synchronize props
watch(
  () => props.initialTab,
  (newTab) => {
    if (newTab) activeTab.value = newTab
  }
)

watch(
  () => props.preselectedItem,
  (item) => {
    if (item && item.name) {
      const existing = cartItems.value.find((i) => i.name === item.name)
      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        cartItems.value.push({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1
        })
      }
    }
  },
  { immediate: true }
)

const todayString = computed(() => new Date().toISOString().split('T')[0])
const isTableToday = computed(() => tableForm.date === todayString.value)
const isTableTomorrow = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tableForm.date === tomorrow.toISOString().split('T')[0]
})

const setTableDateOffset = (offsetDays: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  tableForm.date = d.toISOString().split('T')[0]
}

const availableTimeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
]

const adjustGuests = (delta: number) => {
  const next = tableForm.guests + delta
  if (next >= 1 && next <= 25) {
    tableForm.guests = next
  }
}

const parsePrice = (priceStr: string): number => {
  const clean = priceStr.replace('€', '').replace(',', '.').trim()
  const val = parseFloat(clean)
  return isNaN(val) ? 0 : val
}

const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity
  }, 0)
})

const changeItemQuantity = (index: number, delta: number) => {
  const item = cartItems.value[index]
  if (!item) return
  item.quantity += delta
  if (item.quantity <= 0) {
    cartItems.value.splice(index, 1)
  }
}

const removeItem = (index: number) => {
  cartItems.value.splice(index, 1)
}

const quickAddItem = (name: string, price: string) => {
  const existing = cartItems.value.find((i) => i.name === name)
  if (existing) {
    existing.quantity += 1
  } else {
    cartItems.value.push({ name, price, quantity: 1 })
  }
}

const addSamplePizza = () => {
  quickAddItem('Bufalina (San Marzano, Bufala D.O.P.)', '12 €')
}

const switchTab = (tab: 'table' | 'takeaway') => {
  activeTab.value = tab
}

const closeModal = () => {
  emit('close')
}

const resetAndClose = () => {
  tableSuccess.value = false
  takeawaySuccess.value = false
  emit('close')
}

const submitTableReservation = async () => {
  isSubmitting.value = true
  // Generate friendly reference code
  tableReference.value = 'KDR-REZ-' + Math.floor(1000 + Math.random() * 9000)
  
  // Simulate network wait for smooth UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  isSubmitting.value = false
  tableSuccess.value = true
  emit('tableReserved', { ...tableForm, reference: tableReference.value })
}

const submitTakeawayOrder = async () => {
  if (cartItems.value.length === 0) return
  isSubmitting.value = true
  takeawayReference.value = 'KDR-PICK-' + Math.floor(1000 + Math.random() * 9000)
  
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  isSubmitting.value = false
  takeawaySuccess.value = true
  emit('takeawayOrdered', {
    ...takeawayForm,
    items: cartItems.value,
    total: cartTotal.value,
    reference: takeawayReference.value
  })
}

// ESC Key listener
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>
