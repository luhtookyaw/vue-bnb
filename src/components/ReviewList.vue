<template>
    <div style="padding: 1rem">
        <h6 class="text-uppercase text-secondary font-weight-bolder pt-4 pb-2">Reivew List</h6>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <div class="border-bottom" v-for="review in reviews" :key="review.id">
                <div class="row">
                    <div class="col-md-6">Barry</div>
                    <div class="col-md-6 d-flex justify-content-end"><StarRating :value="review.rating"/></div>
                </div>
                <div class="row">
                    <div class="col-md-12">{{ fromNow(review.created_at) }}</div>
                </div>
                <div class="row pt-4 pb-4">
                    <div class="col-md-12">{{ review.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StarRating from './StarRating';

export default {
    name: "ReviewList",
    components: {
        StarRating,
    },
    props: {
        bookableId: String,
    },
    data() {
        return {
            loading: false,
            reviews: null,
        }
    },
    created() {
        this.loading = true;

        setTimeout(() => {
            this.axios.get(`/api/bookables/${this.bookableId}/reviews`)
            .then(response => {
                this.reviews = response.data;
            })
            .then(() => this.loading = false);
        }, 2000);
    },
}
</script>