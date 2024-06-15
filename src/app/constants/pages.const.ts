import { NavigationPages } from "../types/navigation-pages.types";

export const noAuthPages: NavigationPages[] = [
  {
    icon: 'home',
    route: '/home',
    name: 'Home page',
  },
]

export const authPages = [
  {
    icon: 'home',
    route: '/home',
    name: 'Home page',
  },
  {
    icon: 'view_cozy',
    route: '/categories',
    name: 'Category page',
  },
  {
    icon: 'menu_book',
    route: '/books',
    name: 'Books page',
  },
]