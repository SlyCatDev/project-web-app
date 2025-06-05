<template>
    <section class="dark:bg-dark bg-white py-[70px]">
      <div class="mx-auto px-4 sm:container">
        <div class="border-stroke items-center justify-between border-b md:flex">
          <div class="mb-6 w-full">
            <h2 class="text-dark mb-2 text-2xl font-semibold ">{{ pagetitle }}</h2>
          </div>
        </div>
      </div>
    </section>
  </template>

<script>
export default {
  name: 'PageTitle',
  props: {
    pagetitle: {
      type: String,
      default: 'Page Title'
    }
  }
};
</script>
