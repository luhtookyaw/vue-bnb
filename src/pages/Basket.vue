<template>
    <div>
        <div class="row">
            <div class="col-md-8" v-if="itemsInBasket">
                <div class="row">
                    <div class="col-md-6 form-group">
                        <label for="firstNames">First names</label>
                        <input 
                            type="text" class="form-control" name="firstNames" v-model="customer.first_names"
                            :class="{'is-invalid': haveError(errors, 'customer.first_names')}"
                        />
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="lastName">Last name</label>
                        <input 
                            type="text" class="form-control" name="lastName" v-model="customer.last_name"
                            :class="{'is-invalid': haveError(errors, 'customer.last_name')}"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" class="form-control" name="email" v-model="customer.email"
                            :class="{'is-invalid': haveError(errors, 'customer.email')}"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 form-group">
                        <label for="street">Street</label>
                        <input 
                            type="text" class="form-control" name="street" v-model="customer.street"
                            :class="{'is-invalid': haveError(errors, 'customer.street')}"    
                        />
                    </div>
                    <div class="col-md-6 form-group">
                        <label for="city">City</label>
                        <input 
                            type="text" class="form-control" name="city" v-model="customer.city"
                            :class="{'is-invalid': haveError(errors, 'customer.city')}"
                        />
                    </div>                   
                </div>
                <div class="row">
                    <div class="col-md-4 form-group">
                        <label for="country">Country</label>
                        <input 
                            type="text" class="form-control" name="country" v-model="customer.country"
                            :class="{'is-invalid': haveError(errors, 'customer.country')}"
                        />
                    </div>
                    <div class="col-md-4 form-group">
                        <label for="state">State</label>
                        <input 
                            type="text" class="form-control" name="state" v-model="customer.state"
                            :class="{'is-invalid': haveError(errors, 'customer.state')}"
                        />
                    </div>
                    <div class="col-md-4 form-group">
                        <label for="zip">Zip</label>
                        <input 
                            type="text" class="form-control" name="zip" v-model="customer.zip"
                            :class="{'is-invalid': haveError(errors, 'customer.zip')}"
                        />
                    </div>
                </div>
                <div v-if="errors" class="text-danger small mt-2">*Please fill all the required field</div>
                <hr/>
                <div class="row">
                    <div class="d-grid">
                        <button class="btn btn-primary" @click.prevent="book" :disabled="loading">
                            Book now
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-8" v-else>
                <div class="container-fluid bg-secondary text-center text-white py-5">
                    <h1>Empty</h1>
                </div>
            </div>
            <div class="col-md-4">
                <div class="d-flex justify-content-between">
                    <h6 class="text-uppercase text-secondary font-weight-bolder">Your Cart</h6>
                    <h6 class="badge bg-secondary">
                        Items {{ itemsInBasket }}
                    </h6>
                </div>
                <transition-group name="fade" tag="div">
                    <div v-for="item in basket" :key="item.bookable.id">
                        <div class="py-2 border-top d-flex justify-content-between">
                            <span>
                                <router-link :to="{name: 'bookable', params: {id: item.bookable.id}}">
                                    {{ item.bookable.title }}
                                </router-link>
                            </span>
                            <span class="font-weight-bolder">
                                ${{ item.price.total }}
                            </span>
                        </div>
                        <div class="py-2 d-flex justify-content-between">
                            <span>From {{ item.dates.from }}</span>
                            <span>To {{ item.dates.to }}</span>
                        </div>
                        <div class="py-2 text-end">
                            <button 
                                class="btn btn-outline-danger btn-sm" 
                                @click="$store.dispatch('removeFromBasket', item.bookable.id)"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>               
                </transition-group>            
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: "Basket",
    computed: {
        ...mapGetters([
            'itemsInBasket',
        ]),
        ...mapState({
            basket: (state) => state.basket.items
        }),
    },
    methods: {
        async book() {
            this.loading = true;
            this.errors = null;
            this.success = false;
            
            await this.axios.post('/api/checkout', {
                customer: this.customer,
                bookings: this.basket.map(item => {
                    return {
                        bookable_id: item.bookable.id,
                        from: item.dates.from,
                        to: item.dates.to,
                    }
                })
            })
            .then(() => {
                this.$store.dispatch("clearBasket");
                this.$router.push({name: 'home'});
            })
            .catch(error => {
                console.log(error.response.data);
                if(this.is422(error)){
                    this.errors = error.response.data.errors;
                }
            })
            .then(() => this.loading=false);
        },
        haveError(errors, name) {
            if (errors) {
                for(const err in errors) {
                    if (err == name) {
                        return true;
                    }
                }
            }
        }
    },
    data() {
        return {
            loading: false,
            customer: {
                first_names: '',
                last_name: '',
                email: '',
                street: '',
                city: '',
                country: '',
                state: '',
                zip: '',
            },
            errors: null,
            success: false,
        }
    }
}
</script>
<style scoped>
    a {
        text-decoration: none;
    }
</style>