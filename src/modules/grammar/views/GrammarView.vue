<script setup lang="ts">
import SystemDifferenceTable from '@/modules/grammar/components/SystemDifferenceTable.vue';
import RuleListTable from '@/modules/grammar/components/RuleListTable.vue';
import GodanVerbTable from '@/modules/grammar/components/GodanVerbTable.vue';
import InflectionTable from '@/modules/grammar/components/InflectionTable.vue';
import PosConversionTable from '@/modules/grammar/components/PosConversionTable.vue';
import {
  conjugationMeaningRules,
  godanTableSpec,
  grammarSections,
  inflectionTableSpecs,
  posConversionSections,
  systemDifferenceRows,
  verbClassificationRules
} from '@/modules/grammar/data/changeRules';
</script>

<template>
  <div class="space-y-1 py-1" data-testid="grammar-sections">
    <section
      v-for="section in grammarSections"
      :key="section.id"
      :data-testid="section.dataTestId"
      class="grammar-section-card"
    >
      <SystemDifferenceTable
        v-if="section.kind === 'system-difference'"
        :section-id="section.id"
        :title="section.title"
        :rows="systemDifferenceRows"
      />
      <RuleListTable
        v-else-if="section.payloadKey === 'conjugationMeaningRules'"
        :section-id="section.id"
        :title="section.title"
        :rows="conjugationMeaningRules"
      />
      <RuleListTable
        v-else-if="section.payloadKey === 'verbClassificationRules'"
        :section-id="section.id"
        :title="section.title"
        :rows="verbClassificationRules"
      />
      <GodanVerbTable
        v-else-if="section.kind === 'godan-table'"
        :section-id="section.id"
        :spec="godanTableSpec"
      />
      <InflectionTable
        v-else-if="section.kind === 'inflection-table'"
        :section-id="section.id"
        :spec="inflectionTableSpecs[section.payloadKey]!"
      />
      <PosConversionTable
        v-else-if="section.kind === 'pos-conversion'"
        :section-id="section.id"
        :title="section.title"
        :groups="posConversionSections"
      />
    </section>
  </div>
</template>
