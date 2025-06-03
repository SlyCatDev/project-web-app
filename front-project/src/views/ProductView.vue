<template>
    <PageTitle :pagetitle="pageTitle" />
    <ProductList />
</template>

<script>
import PageTitle from '@/components/ui/PageTitle.vue';
import ProductList from '@/components/products/ProductList.vue';


export default {
    name: 'ProductView',
    components: {
        PageTitle,
        ProductList
    },
    data() {
        return {
            pageTitle: 'Liste des produits'
        }
    },
}
</script>

<style scoped>
</style>