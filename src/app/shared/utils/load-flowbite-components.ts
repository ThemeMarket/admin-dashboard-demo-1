import { initFlowbite } from 'flowbite';

export function loadFlowbiteComponents() {
  const timeoutId = setTimeout(() => {
    initFlowbite();
    clearTimeout(timeoutId);
  }, 100);
}
