import { createStore } from 'vuex';

export const store = createStore({
    state() {
        return {
            lastSearch: {
                from: null,
                to: null,
            },
            basket: {
                items: [],
            },
        }
    },
    mutations: {
        setLastSearch(state, payload) {
            state.lastSearch = payload;
        },
        addToBasket(state, payload) {
            state.basket.items.push(payload);
        },
        removeFromBasket(state, payload) {
            state.basket.items = state.basket.items.filter(item => item.bookable.id !== payload);
        },
        setBasket(state, payload) {
            state.basket = payload;
         },
    },
    actions: {
        setLastSearch({ commit }, payload) {
            commit('setLastSearch', payload);
            localStorage.setItem('lastSearch', JSON.stringify(payload));
        },
        localStoredState({ commit }) {
            const lastSearch = localStorage.getItem('lastSearch');
            if(lastSearch) {
                commit('setLastSearch', JSON.parse(lastSearch));
            }

            const basket = localStorage.getItem('basket');
            if(basket) {
                commit('setBasket', JSON.parse(basket));
            }
        },
        addToBasket({ commit, state }, payload) {
            commit('addToBasket', payload);
            localStorage.setItem('basket', JSON.stringify(state.basket));
        },
        removeFromBasket({ commit, state }, payload) {
            commit('removeFromBasket', payload);
            localStorage.setItem('basket', JSON.stringify(state.basket));
        },
        clearBasket({ commit, state }) {
            commit("setBasket", { items: [] });
            localStorage.setItem('basket', JSON.stringify(state.basket));
        },
    },
    getters: { // works like computed property
        itemsInBasket(state) {
            return state.basket.items.length;
        },
    }
});