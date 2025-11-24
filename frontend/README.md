# Frontend with Vue.js

### Előkészületek
Előkészületként két videót néztem meg:
[Az első](https://www.youtube.com/watch?v=s9URD3PefTk) a Composition API működéséről,
[A második](https://youtu.be/QB1p2iuQm_0?si=JoSmbaf_sf2A8KBr) pedig a Vue Best practices-ről szól.
A leírásban feltételnek tekintem a két videó ismeretét, és nem térek ki arra, ami ott elhangzott.

### Routing

A routinghoz a [Vue Routert](https://router.vuejs.org/) használtam, a dokumentációja elég érdekes, félig-meddig a régi API-ra épül, de használható. Találtam egy blog [bejegyzést arról](https://vueschool.io/articles/vuejs-tutorials/how-to-master-vue-router-in-vue-js-3-with-composition-api/) hogyan kellene használni jól a composition API-al.

A lényeg, hogy készítünk az src/ mappába egy route.js file-t, ahol inicializáljuk a routert: 
```
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./views/HomeView.vue";

const routes = [ { path: "/", name: "home", component: HomeView }, { path: "/login", name: "login", component: import("./views/LoginView.vue") }, // Lazy loading ];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: routes, }); export default router;
```


Definiáljuk az elérési utakat, a nevet, és a komponenseket (view-kat) amiket adott route-hoz ki kell renderelni. A login route-ot lazy loadinggal oldottam meg, nem töltöm be addig, amég nem kattintott rá a user. Kattintáskor kezdi a betöltést, mivel nem kell a usernek minden alkalommal belépnie, ezért fölösleges betölteni. A HomeView-hoz nem használok lazy loadingot mivel itt csak hátülütője lenne, hiszen a home-ra lép fel a user elsőnek, tehát mindenképp be kell tölteni. A Lazy Loading nem összekeverendő az eager loadingal a laravelben, *teljesen más* a kettő.

A `history` a `createRouter`-ben a következőre szolgál:
Többféle módon lehet kezelni a böngészési előzményeket és az URL-eket, a Vue-ban három módja van:
- *HTML 5 mód - createWebHistory:* A legelterjedtebb (és én is ezt válaszottam), szép URL-eket produkál, pl: `https://example.com/user/id`. Hátulütője: A szervert be kell konfigurálni (csak majd productionben szükséges, developmentben *működik*), hogy minden egyes kérésre az index.html-t adja vissza, mert minden a kliens oldalon renderelődik, tehát akármelyik route-ra megyünk, mindig az index.html lesz kiszolgálva nekünk, hiszen csak annak a tartalma változik dinamikusan (ezért is szeretjük a frontend js frameworkoket). Tehát, a 404 oldalt külön, a vue-n belül kell bekonfigurálni egy catch-all statementel (majd később). 
- *Hash mód:* A navigáció úgy van megoldva, hogy amikor egy linkre kattintunk, akkor egy ilyen URL-t látunk a címsorban: `example.com/#/login`. A # szimbólum arra szolgál, hogy a szervert ne kelljen bekonfigurálni külön, mivel sosem kerül elküldésre a szervernek. Hátránya, hogy kevésbé néz ki jól, és SEO-ra kifejezetten rossz kihatással van. Akkor érdemes használni, ha nem férünk hozzá a szerverkonfigurációhoz.
- *Memory mode:* Egyáltalán nem interaktál a címsorral, és nem is böngészőre van kitalálva. Tehát, nem tudok direktbe a login page-re betölteni, hanem először meg kell nyomnom a navigációt. Ez jó lehet, például egy Electron appban (pl.: Discord). Itt sosem látjuk a címeket, fölösleges is bajlódni vele. Nekünk nem opció.


Az App.vue-ba el kell helyezni egy `<main>` szekciót, ami a View-k megjelenítésére szolgál. 
```
<template>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <br>
    <RouterLink to="/login">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
```

Illetve teszteléshez elhelyeztem két linket is, amivel váltogatni lehet. A `<nav>` mindig ottmarad felül, hiszen az oldalon csak a `<main>` szekció fog változni, mivel itt található a `<RouterView />`. A legkönnyebb így elképzelni: Amikor a user rákattint az oldalra, és belép a homepage-re a RouterView kicserélődik a HomeView-ra: 
```
<main>
<HomeView />
</main>
```
Ha a loginra kattintok, akkor kicserélődik a LoginView-ra:
```
<main>
<LoginView />
</main>
```

És így tovább. Valójában nem különbözik egy View egy hétköznapi komponenstől. Ez abból is látható, hogy mindösszesen ennyit írtam például a HomeView fileomba (amit konvenció szerint a /views mappában tárolok):
```
<template>
  Home
</template>
```

*Navbar elrejtése*
A navbar nem szeretném, ha látszódna amikor a login route-on van a user, a többin szeretném ha kirajzolódna. Azért érdemesebb így megoldani (hogy a App.vue-ban van a nav), mert csak egyszer kell kirajzolni, ahelyett, hogy az összes komponensbe egyesével beleraknám. 
Persze, ha a legegyszerűbb megoldásra törekednék, csak kivenném a App.vue-ból és beraknám minden View-ba egyesével, kivéve a loginba. Látszólag az eredmény megegyezne, de a teljesítményben találnánk azért különbséget bőven.

Ezt így lehetne megoldani: v-if megnézi, hogy a route a "/login" vagy "/register"-e és akkor elrejti a navbart.

Kis utánanézés után, *megoldás:*
A `$route.fullPath` globális változó megadja nekünk, hogy melyik routeon vagyunk. Login route esetében: `/login`. Innentől már egyszerű a dolgunk:

```
<script setup>
const EXCLUDE_NAV = ['/login', '/register'];
</script>

<template>
  <nav v-show="!EXCLUDE_NAV.includes($route.fullPath)">
    <RouterLink to="/">Go to Home</RouterLink>
    <br>
    <RouterLink to="/login">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
```

Ha benne van a `EXCLUDE_NAV` konstansban a jelenlegi path, akkor nem mutatjuk. Egyszerű, és gyors megoldás.
*v-show:* Ugyan az mint a `v-if`, annyi különbséggel, hogy nem veszi ki teljes mértékben a navbart az oldalról, csak rárak egy `display: none`-t CSS-ben, amivel eléri ugyan ezt az eredményt, viszont nem kell újra betölteni, ha a user bejelentkezik és meg kell jeleníteni. Ilyenkor csak leveszi róla a Vue a CSS formázást, és megoldva. A bizonyíték a kirenderelt oldal forrásában is látható:
```
<div id="app" data-v-app="">
  <nav style="display: none">
    <a href="/" class="">Go to Home</a>
    <br />
    <a href="/login" class="router-link-active router-link-exact-active" aria-current="page">Go to About</a>
  </nav>
  <main>Login</main>
</div>
```

*404 not found:*
Egy egyszerű path matching syntaxist kínál a Vue hasonló esetekre:
`{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView }`
Nézzük mi történik. Vue-ban a ':' a path-ben paraméter megadására szolgál, a pathMatch pedig elkap minden olyan routet ami a zárójelben lévő regexnek stimmel. Jelen esetben ez '.*'. Ez egy speciális eset a Vue-ban, ami arra szolgál, hogy megtalálja azokat a route-okat, amik nem lettek megtalálva a többi definiált route által, és kidobja a NotFoundView-t.
De ezt a syntaxist lehetne másra is használni, példa:
Ha a regex ez lenne `/user/:id(\\d+)`, akkor:
- Ha beírjuk, hogy `/user/1` => Mutatja a user adatait (vagy akármi)
- Ha beírjuk, hogy `/user/foo` => 404 error