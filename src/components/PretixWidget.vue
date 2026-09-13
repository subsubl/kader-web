<template>
  <div class="pretix-widget-wrap">
    <!-- The custom element <pretix-widget> is upgraded by plugins/pretix.client.ts -->
    <component
      :is="'pretix-widget'"
      :event="event"
      :items="items || undefined"
      :subevent="subevent || undefined"
      :voucher="voucher || undefined"
      :list-type="listType || undefined"
      disable-filters
    ></component>

    <noscript>
      <div class="pretix-widget">
        <div class="pretix-widget-info-message">
          {{ t('pretix.noJsNotice') }}
          <a target="_blank" :href="event" rel="noopener">{{ t('pretix.clickHere') }}</a>.
        </div>
      </div>
    </noscript>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()

const props = defineProps<{
  /** Full event shop URL, e.g. https://pretix.eu/myorg/my-event/ (trailing slash) */
  event: string
  /** Optional comma-separated product ids to show */
  items?: string
  /** Optional single subevent (date) id for series */
  subevent?: string
  /** Optional voucher code to preselect / show hidden products */
  voucher?: string
  /** 'list' displays a chooser; omit for a ticket box */
  listType?: string
}>()

// Per-event stylesheet so the widget renders in the venue's colours on the page.
const config = useRuntimeConfig()
const pretixUrl = (config.public.pretixUrl as string || 'https://pretix.eu').replace(/\/$/, '')
const fullUrl = props.event.startsWith('http') ? props.event : `${pretixUrl}${props.event}`

useHead({
  link: [{ rel: 'stylesheet', type: 'text/css', href: `${fullUrl.replace(/\/$/, '')}/widget/v2.css` }]
})
</script>