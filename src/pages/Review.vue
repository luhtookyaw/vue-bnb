<template>
    <div v-if="error" class="col-12">
        <FatalError/>
    </div>
    <div v-else class="row">
        <div v-if="hasBooking" :class="[{'col-md-4': loading || !alreadyReviewed}, {'d-none': !loading && alreadyReviewed}]">
            <div class="card">
                <div class="card-body">
                    <div v-if="loading">Loading...</div>
                    <div v-else>
                        <p>
                            Stayed at 
                            <router-link :to="{name: 'bookable', params: { id: booking.bookable.id }}">
                                {{booking.bookable.title}}
                            </router-link>
                        </p>
                        <p>
                            From {{ booking.from}} to {{ booking.to }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'col-md-8': loading || !alreadyReviewed}, {'col-md-12': !loading && alreadyReviewed}]">
            <div v-if="loading">Loading...</div>
            <div v-else>
                <div v-if="alreadyReviewed">
                    <h3>You've already left a review for this booking!</h3>
                </div>
                <div v-else>
                    <div class="form-group">
                        <label for="" class="text-muted">Select the star rating</label>
                        <StarRating :value="review.rating" class="fa-2x" @input="review.rating = $event"></StarRating>
                    </div>
                    <div class="form-group">
                        <label for="content" class="text-muted">Describe your experience</label>
                        <textarea 
                            name="content"
                            cols="30" 
                            rows="10" 
                            class="form-control" 
                            v-model="review.content" 
                            :class="contentError && 'is-invalid'"
                        ></textarea>
                        <div v-if="contentError" class="err-message">*{{ contentError }}</div>
                    </div>
                    <button class="btn btn-md btn-primary mt-2 w-100" @click.prevent="submit" :disabled="loading">Submit</button>
                </div>
            </div>
        </div> 
    </div>
</template>
<script>
import StarRating from '../components/StarRating';
import FatalError from '../components/FatalError';

export default {
    name: "Review",
    components: {
        StarRating,
        FatalError,
    },
    computed: {
        alreadyReviewed() {
            return this.hasReview || !this.hasBooking;
        },
        hasReview() {
            return this.existingReview != null;
        },
        hasBooking() {
            return this.booking != null;
        },
    },
    methods: {
        submit() {
            this.contentError = null;
            this.loading = true;

            this.axios.post('/api/reviews', this.review)
            .then(response => {
                console.log(response);
                this.$router.push({ name: 'bookable', params: { id: this.booking.bookable.id }});
            })
            .catch((error) => {
                if(this.is422(error)) {
                    if(error.response.data.errors['content']){
                        this.contentError = error.response.data.errors.content[0];
                    }
                }
                else {
                    this.error = error;
                }               
            })
            .then(() => this.loading = false);
        },
    },
    data() {
        return {
            review: {
                id: null,
                rating: 5,
                content: null,
            },
            existingReview: null,
            booking: null,
            loading: false,
            error: false,
            contentError: null,
        };
    },
    async created() {
        this.review.id = this.$route.params.id;
        this.loading = true;
        try {
            this.existingReview = (await this.axios.get(`/api/reviews/${this.$route.params.id}`)).data;
        } 
        catch(error) {  
            if(this.is404(error)){
                return this.axios.get(`/api/booking-by-review/${this.$route.params.id}`)
                .then((response) => {                    
                    this.booking = response.data;
                })
                .catch((error) => {
                    this.error = !this.is404(error);
                }); }
        } 
        finally {
            this.loading=false;
        }
    }
}
</script>
<style scoped>
.err-message {
    color: red;
    font-size: 0.7rem;
}
</style>