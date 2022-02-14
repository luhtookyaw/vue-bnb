<template>
    <div class="row">
        <div class="col-md-8 pb-4">
            <div class="card">
                <div class="card-body">
                    <div v-if="!loading">
                        <h2>{{ bookable.title }}</h2>
                        <hr>
                        <article>{{ bookable.description }}</article>
                    </div>
                    <div v-else>loading...</div>
                </div>
            </div>
            <ReviewList :bookableId="$route.params.id"/>
        </div>
        <div class="col-md-4">
            <Availibility :bookableId="$route.params.id" @availibility="checkPrice"/>
            <transition name="fade">
                <PriceBreakdown v-if="price" :price="price"/>
            </transition>       
            <button 
                v-if="price && !inBasketAlready" 
                class="btn btn-outline-secondary btn-block my-1" 
                @click="addToBasket"
            >
                Book Now
            </button>
            <button
                v-if="inBasketAlready" 
                class="btn btn-outline-danger btn-block my-1" 
                @click="removeFromBasket"
            >
                Remove from Basket
            </button>            
            <div v-if="inBasketAlready" class="mt-2 text-muted warning">
                Booking already exists in the basket. Remove from the basket first to change.
            </div>
        </div>
    </div>
</template>
<script>
import Availibility from '../components/Availibility';
import ReviewList from '../components/ReviewList';
import PriceBreakdown from '../components/PriceBreakdown';
import { mapState } from 'vuex';

export default {
    name: "Bookable",
    components: {
        Availibility,
        ReviewList,
        PriceBreakdown,
    },
    methods: {
        async checkPrice(hasAvailibility) {
            console.log(hasAvailibility);
            if(!hasAvailibility) {
                this.price = null;
            }
            else {
                await this.axios.get(`/api/bookables/${this.bookable.id}/price?from=${this.lastSearch.from}&to=${this.lastSearch.to}`)
                .then((response => {
                    this.price = response.data;
                }))
                .catch(() => {
                    this.price = null;
                });
            }
        },
        addToBasket() {
            this.$store.dispatch("addToBasket", {
                bookable: this.bookable,
                price: this.price,
                dates: this.lastSearch,
            });
        },
        removeFromBasket() {
            this.$store.dispatch("removeFromBasket", this.bookable.id);
        },
    },
    computed: {
        ...mapState({
            lastSearch: 'lastSearch',
            inBasketAlready(state) {
                if(this.bookable == null) {
                    return false;
                }
                return state.basket.items.reduce((result, item) => result || item.bookable.id == this.bookable.id, false);
            }
        }),
    },
    data() {
        return {
            bookable: null,
            loading: false,
            price: null,
        }
    },
    created() {
        this.loading = true;
        
        this.axios.get(`/api/bookables/${this.$route.params.id}`)
        .then(reponse => {
            this.bookable = reponse.data;
            this.loading = false;
        });
    }
}
</script>
<style scoped>
    .warning {
        font-size: 0.7rem;
    }
</style>