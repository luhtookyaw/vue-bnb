<template>
    <nav class="navbar bg-white border-bottom navbar-light p-2">
        <router-link 
        class="navbar-brand mr-auto" :to="{name: 'home'}"
        >
        Home
        </router-link>
        <router-link class="btn nav-button" :to="{name: 'basket'}">
            Basket
            <span class="badge bg-secondary">{{ itemsInBasket }}</span>
        </router-link>
    </nav>
    <div class="container mt-4 mb-4 pr-4 pl-4">
        <router-view class="content"></router-view>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            itemsInBasket: 'itemsInBasket',
        })
    },
    async beforeCreate() {
        this.$store.dispatch('localStoredState');
        
        await this.axios.get('/sanctum/csrf-cookie');
    },
}
</script>

