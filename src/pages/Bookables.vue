<template>
    <div>
        <div v-if="loading">Data is loading...</div>
        <div v-else>
            <div class="row" v-for="row in rows" :key="row + 1">        
                <div 
                    class="col d-flex align-items-stretch" 
                    v-for="(bookable, column) in bookablesInRow(row)" 
                    :key="row + column"
                >
                    <bookable-list-item 
                        :title="bookable.title"
                        :content="bookable.description"
                        :id="bookable.id"
                    />
                </div>
                <div class="col" v-for="p in placeholdersInRow(row)" :key="row + p"></div>
            </div>
        </div>
    </div>
</template>
<script>
import BookableListItem from '../components/BookableListItem';

export default {
    name: 'Bookables',
    components: {
        "bookable-list-item": BookableListItem,
    },
    methods: {
        bookablesInRow(row) {
            return this.bookables.slice((row - 1) * this.columns, row * this.columns);
        },
        placeholdersInRow(row){
            return this.columns - this.bookablesInRow(row).length;
        }
    },
    computed: {
        rows() {
            return this.bookables == null ? 0 : Math.ceil(this.bookables.length /this.columns);
        }
    },
    data() {
        return {
            bookables: null,
            loading: false,
            columns: 3,
        }
    },
    created() {
        this.loading = true;

        const p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            setTimeout(() => {
                resolve("Hello")
            }, 3000);
        })
        .then(result => console.log(`success ${result}`))
        .catch(result => console.log((`error ${result}`)));

        console.log(p);

        setTimeout(() => {
            this.axios.get("api/bookables/")
            .then(response => {
                this.bookables = response.data;
                this.loading = false;
            });
        }, 500);

    }
}
</script>