import Home from './components/Home.vue';
import Configure from './components/Configure.vue';
import Brew from './components/Brew.vue';

export const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/configure',
        name: 'Configure',
        component: Configure
    },
    {
        path: '/brew',
        name: 'Brew',
        component: Brew
    }
]