import { defineComponent } from 'vue';
import type { Component } from 'vue';
import { mount } from '@vue/test-utils';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import type { PracticeSession } from '@/modules/practice/composables/usePracticeSession';

export function mountWithPracticeSession(
  component: Component,
  configure?: (session: PracticeSession) => void,
  mountOptions?: Parameters<typeof mount>[1]
) {
  const session = createPracticeSession();
  configure?.(session);

  const Wrapper = defineComponent({
    components: {
      TestedComponent: component
    },
    setup() {
      providePracticeSession(session);
      return {};
    },
    template: '<TestedComponent />'
  });

  return {
    session,
    wrapper: mount(Wrapper, mountOptions)
  };
}
