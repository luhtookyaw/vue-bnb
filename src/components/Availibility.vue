<template>
    <div>
        <h6 class="text-uppercase text-secondary font-weight-border">
            Check Availibility
            <span v-if="status==true" class="text-success">(available)</span>
            <span v-if="status==false" class="text-danger">(unavailable)</span>          
        </h6>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="from">From</label>
                <input 
                    type="date" 
                    name="from" 
                    class="form-control form-control-sm" 
                    placeholder="Start Data"
                    v-model="from"
                    @keyup.enter="check"
                    :class="{'is-invalid': fromError}"
                />
            </div>
            <div v-if="fromError" class="err-message">*{{ fromError }}</div>
            <div class="form-group col-md-6">
                <label for="to">To</label>
                <input 
                    type="date" 
                    name="to" 
                    class="form-control form-control-sm" 
                    placeholder="End Data"
                    v-model="to"
                    @keyup.enter="check"
                    :class="toError && 'is-invalid'"
                />
            </div>
            <div v-if="toError" class="err-message">*{{ toError }}</div>
            <button class="btn btn-secondary btn-block mt-2" @click="check" :disabled="loading">
                <span v-if="!loading">Check!</span>
                <span v-else><i class="fas fa-circle-notch fa-spin"></i>checking...</span>
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: "Availibility",
    props: {
        bookableId: String,
    },
    methods: {
        async check() {
            this.loading = true;
            this.fromError = null;
            this.toError = null;
            this.status = null;

            this.$store.dispatch('setLastSearch', {
                from: this.from,
                to: this.to,
            });

            await this.axios
            .get(`/api/bookables/${this.bookableId}/availibility?from=${this.from}&to=${this.to}`)
            .then(response => {
                this.status = response.data.status;
            })
            .catch(error => {
                if(this.is422(error)){
                    if(error.response.data.errors.from){
                        this.fromError = error.response.data.errors.from[0];
                    }
                    if(error.response.data.errors.to){
                        this.toError = error.response.data.errors.to[0];
                    }
                }
            })
            .then(() => {
                this.loading = false;
                this.$emit('availibility', this.status);
            });
        },
    },
    data() {
        return {
            from: this.$store.state.lastSearch.from || '',
            to: this.$store.state.lastSearch.to || '',
            loading: false,
            status: null,
            errors: null,
            fromError: null,
            toError: null,
        }
    },
}
</script>
<style scoped>
    label {
        font-size: 0.7rem;
        text-transform: uppercase;
        columns: gray;
        font-weight: bolder;
    }
    .err-message {
        color: red;
        font-size: 0.7rem;
    }
</style>