export function loadFlowbiteComponents() {
  const timeoutId = setTimeout(async () => {
    const flowbite = await import('flowbite');
    flowbite.initFlowbite();

    clearTimeout(timeoutId);
  }, 100);
}
