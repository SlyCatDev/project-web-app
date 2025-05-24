<template>
        <header>
            <NavBar />
        </header>
        <main>
            <PageTitle :pagetitle="pageTitle" />
            <ProductList />
        </main>
        <FooterSection />
</template>

<script>
import NavBar from '@/components/layout/NavBar.vue';
import FooterSection from '@/components/layout/FooterSection.vue';
import PageTitle from '@/components/ui/PageTitle.vue';
import ProductList from '@/components/products/ProductList.vue';


export default {
    name: 'ProductView',
    components: {
        NavBar,
        FooterSection,
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