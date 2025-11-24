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

### Tailwind CSS
A stílushoz [Tailwindet](https://tailwindcss.com/) fogok használni, ami megkönnyíti a szép UI felületek kialakítását. 

Telepítés:
```
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

tailwind.config.js-ben a contentet írjuk át:
```
content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
```

CSS-ben:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

main.js-ben legyen importálva a css:
```
import './index.css'
```

Teszt: `<h1 class="font-bold">asd</h1>`

### RegisterView
A RegisterView két máshol is felhasználható komponensből fog állni (? = not required):
- Button (Props: type?, disabled?) (Emits: click)
- Input (Props: name, label, placeholder?, type?, class?, disabled?) (Models: model) (Emits: Ø)

**Button:**
Ez a könnyebbik. Bekér egy prop-ot, ami a type (pl.: button vagy submit). Ezt nem kötelező megadni. A :type v-bind-al adjuk meg neki. A v-on segítségével a click eseményen emitelünk egy 'click' emitet. 

*Slot:* Mint látható, propként nem kértük be a gomb feliratát. Ez a `<Button>` child elementje lesz, pl.:
`<Button><span>EZ ITT!</span></Button>`. Ahova beírjuk a `<slot>` tag-et, ott fog megjelenni a child element.

Elkészült kód:

```
<script setup>
const emit = defineEmits(['click']);

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'button'
  }
});
</script>

<template>
  <button :type="props.type" @click="emit('click')"><slot></slot></button>
</template>

// Felhasználása:
<Button type="button" @click='getStartedClicked'>Get started</Button>
```

**Input:**
Az input saját komponensekre van a Vue-nak egy nagyon jól működő struktúrája. Valójában csinálunk egy "saját v-model"-t.
`const model = defineModel();`

És a child komponensen belül így használjuk:
`<input v-model="model" />`

A parent komponensben pedig mintha egy sima egyszerű input lenne, a v-model attribútumot használjuk.

`<Input name="fullname" label="Teljes név: " placeholder="Gipsz Jakab" v-model="formData.fullName" />`

A többi magától értetődik.

```
<script setup>
// Itt definiáljuk a saját modelünket.
const model = defineModel();

const props = defineProps(...);
</script>

<template>
  <div :class="'flex items-center gap-3' + ' ' + props.class">
    <label :for="props.name">{{ props.label }}</label>
    <input v-model="model" :type="props.type" :name="props.name" :placeholder="props.placeholder" />
  </div>
</template>

// Felhasználása:
<Input name="password" type="password" label="Jelszó: " placeholder="***" v-model="formData.password" />
```

#### Regisztráció logika
Lépésről lépésre:
1. Létre kell hozni egy formot, benne az előzőleg elkészített input és button komponensekkel
2. Egy refben eltárolni az értéküket, és létrehozni ref-eket a hibáknak és a sikernek.
3. Gombnyomásra meghívni egy metódust, ami elkezdi a regisztrációs folyamatot
4. Be kell állítani a loadingot egy üzenetre
5. Meg kell hívni az API-t
6. Ellenőrizni, hogy 201-et ad-e vissza, vagy hibát
7. Ki kell írni a hibát/sikert
8. Loading => off

*1. Form:*
A form-nak egy attribútum fog kelleni kötelezően, az on-submit:
`@submit.prevent="formSubmitted"`
A prevent arra szolgál, hogy az oldal ne frissüljön automatikusan gombnyomásra. HTML5-ben a form-ra ha nincs beállítva ilyen tulajdonság, akkor automatikusan frissül az oldal, amikor elküldik a formot, mivel az `action` attribútum nincs definiálva. Erre szolgál javascriptben az event.preventDefault() is, de ezt a Vue megoldja helyettünk, ha odaírjuk, hogy `.prevent`.

*2. Ref-ek:*
Kell egy ref, ahol tároljuk a form adatokat.

```
const formData = ref({
  name: "",
  email: "",
  password: "",
  password2: "",
});
```

Emellett, kell kettő ref a hibák és a siker tárolására.
```
const errors = ref([]);
const success = ref(null);
```

Az hibákat listában tárolom, hiszen egyszerre több hibád is lehet (nem töltesz ki semmit).

*3. Meghívni a metódust és elkezdeni a regisztrációt:*
Valójában ez már félig kész van, csak el kell készíteni a formSubmitted metódust, ami egy async metódus lesz, mivel API hívást végzünk benne:

1. 
`
const formSubmitted = async () => {};
`

2. Feltételezzük, hogy lehetséges, hogy a user már megpróbált regisztrálni egyszer, de hibát kapott. Ezért állítsuk az errors-t és a success-t az alap értékükre, ami üres lista ([]) és null.

3. Hiba lehetősége fennáll, hiszen lehet, hogy lehalt a backend. Ezért try-catch blokkba kell tenni az API hívásunkat, hogy ne haljon le miatta a frontend is.

4. A try blokk:
- *(#4)* Állítsuk a loading értét valamilyen üzenetre, például "Fiók létrehozása folyamatban, kérjük várjon..."
- *(#5)* Hívjuk az API-t: `const response = await axios.post("http://127.0.0.1:8000/api/register", formData.value);` Az axios-t használom, ami telepíthető az `npm install axios` paranccsal és importálás után már használható is a [dokumentációban](https://axios-http.com/docs/post_example) leírt módon. Valójában egy JavaScript fetch API felturbózva, sok olyan lehetőséggel, ami könnyebbé teszi a fejlesztő életét.
- *(#6-7)* Ezen a ponton, két lehetőség van: vagy hibára jutott a kérésünk, vagy sikerült. Ezt a response.status egyértelműen visszaadja, hiszen tartalmazza a státuszkódot. Ellenőrizzük, hogy sikerült-e és ha igen, akkor állítsuk be a success ref értékét:
`if (response.status == 201) success.value = response.data.message;`

5. A catch blokk:
- *(#7)*Ha hibára jutunk: Ellenőrizzük, hogy 422-es hibakódot (Unprocessable Content) kaptunk-e, azaz a user nem töltött ki valamit megfelelően, vagy például használatban van az email. Ez esetben, menjünk végig a hibákon, és rakjuk bele őket az errors ref-be. Ha a hibakód bármi más, pl.: 500 Internal Server Error írjunk ki egy általános hibaüzenetet.
```
if (error.response && error.response.status == 422) {
  const errs = error.response.data.errors;
  for (const key in errs) {
    errors.value.push(errs[key][0]);
  }
} else {
  errors.value.push("Ismeretlen hiba történt.");
}
```
Azért ellenőrizzük az error.response létezését, mert ha például nincs internetkapcsolat, vagy timeot van, akkor az error.response nem létezhet.

6. Finally block:
- *Magyarázat:* A try-catch-nek van egy harmadik blokkja is, a finally, ami minden esetben lefut, amikor a try/catch a futásciklus végére ér.
*(#8)*
```
finally {
    loading.value = null;
}
```

*Hiba esetén a struktúra magyarázata:*
Ha postmanben megnézzük, akkor a válasz egy teljesen kitöltetlen POST request a /login endpointra így nézne ki:
```
{
    "message": "The email has already been taken.",
    "errors": {
        "email": [
            "The email has already been taken."
        ]
    }
}
```
Ez magyarázza, hogy miért olyan for loopot használtam amilyet, és azt, hogy miért-mire hivatkoztam. De persze a legjobb módszer ezeket megérteni, egy egyszerű: `console.log(response)`

Teljes formSubmitted metódus:
```
const formSubmitted = async () => {
  errors.value = [];
  success.value = null;

  try {
    loading.value = "Fiók létrehozása...";
    const response = await axios.post("http://127.0.0.1:8000/api/register", formData.value);
    if (response.status == 201) success.value = response.data.message;
  } catch (error) {
    if (error.response.status == 422) {
      const errs = error.response.data.errors;
      for (const key in errs) {
        errors.value.push(errs[key][0]);
      }
    } else {
      errors.value.push("Ismeretlen hiba történt.");
    }
  } finally {
    loading.value = null;
  }
};
```

#### API refactoring
A jobb megoldás az lenne, ha axios.POST(teljesURL) helyett egy saját axios instance-et tudnánk definiálni.
Ez azért jó, mert nem kell mindig begépelni a teljes URL-t, és ha változik, elég egy helyen átírni. A későbbiekben tudunk még sok más hasznos dolgot is csinálni vele, mint például végrehajtani bizonyos tevékenységet bizonyos kérésekre, vagy akár logolni. Ez az egyszerű módosítás sok hasznos dolgot fog még eredményezni.

Először is készítsük el az `api.js` file-t a `src/` mappába.

Tartalma egy axios instance, amit kiexportálunk:
```
import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

export default api;
```

A baseURL-be kerül az API url. A timeout arra való, hogy a ms-ben megadott idő után automatikusan megszakítja a próbálkozást, és hibát dobjon. 

Ezután így tudjuk felhasználni: `const response = await api.post("/register", formData.value)`.
Fontos: Ne az axios-t importáljuk ahol API hívást szeretnénk végrehajtani, hanem a saját axios instance-ünket. És ne `axios.post`-al hívjuk, hanem `api.post`-al, vagy bárhogy is van elnevezve a saját axios instance.