import { createRouter, createWebHistory } from 'vue-router';
import Bookable from '../pages/Bookable';
import Bookables from '../pages/Bookables';
import Review from '../pages/Review';
import Basket from '../pages/Basket';

const routes = [
    {
        path: "/",
        component: Bookables,
        name: 'home',
    },
    {
        path: "/bookable/:id",
        component: Bookable,
        name: 'bookable',
    },
    {
        path: "/review/:id",
        component: Review,
        name: 'review',
    },
    {
        path: "/basket",
        component: Basket,
        name: 'basket',
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router;