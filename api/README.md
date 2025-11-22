### Ötlet
Egyszerű full basic webshop, adminfelülettel

MVP - Határidő 2025.12.02. - kedd (két hét): 
Login/register/Logout
Rendelés leadás, egyszerű adatokkal, nincs fizetés semmi komoly
Rendeléseket nyomon lehet követni kis csúszkával, progress barral ami változik:
Megrendelve, előkészítés alatt, futárnak átadva

**Bővítésnek:**
Role rendszer - Admin és Vásárló
Admin tudjon rendelés státuszán változtatni

**User flow:**
Login (/login)
Vásárlás (/) - User kosárba rakhat terméket, mutatja mennyi van raktáron, és beírhatja hányat akar hozzáadni a kosárhoz. 
Kosár (/basket) - User látja mit rendelt, ki tudja törölni, és tovább tud lépni leadni a rendelést
Rendelés leadás (/order) - Irányítószámot, címet megadja, és leadja a rendelést
Rendeléseim (/orders) - Látható az összes rendelést amit user adott le és rá lehet kattintani
Nyomonkövetés (/orders/{id}) - ID alapján lekérhető a rendelés állapota

**Backend routes:**

Auth:
- /login POST
- /register POST
- /logout POST

Termékek:
- /products GET

Rendelés:
- /order GET POST (PUT DELETE)

***2025.11.18.***
A sanctum, ahogy én értelmezem, egy authentikációs package. A következő parancs az API-hoz szükséges infrastruktúrát előkészíti, és a sanctumot is telepíti.
`php artisan install api`

### Auth
A sanctum pont SPA-khoz lett kitalálva, így Vue-val tökéletes lesz számomra.

Találtam egy [medium cikket](https://medium.com/@abdelra7manabdullah/api-authentication-using-laravel-sanctum-v10-x-21dfe130cda) is, ahol leírják, hogy lehet létrehozni egy pár egyszerű funkciót: register, login, logout.

Ez alapján elkészítettem a route-okat, melyeket postmannel teszteltem, és működőképesnek találtam.

A middlewarnek köszönhetően csak akkor érem el a logoutot, ha be vagyok jelentkezve:
`Route::post('/logout', [UserAuthController::class, 'logout'])->middleware('auth:sanctum');`

A middleware-ek haszonsak, abból a szempontból, hogy szűrik a HTTP kéréseket. Így ahelyett, hogy minden controllerben ellenőrizném, hogy a user be van-e jelentkezve, a middleware beékeli magát a kérés mögé, és ha a user nincs bejelentkezve a következőt küldi vissza 401-es hibakóddal:
`{"message": "Unauthenticated."}`

Ha a user be van jelentkezve, tovább irányítja a kérést a megadott controller adott metódusának.

*~ 1.5h*

***2025.11.20.***
### Migrations
Elkészítettem az alapvető migrációkat.

### Seeders
Azért, hogy a teszt adatok migrate:fresh esetén is megmaradjanak, létrehoztam 4 seedert: UserSeeder és ProductSeeder, OrderSeeder, OrderProductSeeder

Itt egy példa:
`
DB::table('users')->insert([
  'name' => 'Gipsz Jakab',
  'email' => 'gj@gmail.com',
  'password' => Hash::make('gj123'),
]);
`

Ezt a 'run' metóduson belül kell elhelyezni, és feltölti a users táblát az értékekkel. Több érték is megadható a seederben, pl.:
`
DB::table('products')->insert([
  [
    'name' => 'Borsodi világos sör 0,5L',
    'price' => 350,
    'stock_count' => 150
  ],
  [
    'name' => 'Dreher classic sör 0,5L',
    'price' => 360,
    'stock_count' => 120
  ],
]);
`

A következő paranccsal lehet őket futtatni:
`php artisan db:seed`
vagy, ha migrate:fresh-el együtt akarjuk
`php artisan migrate:fresh --seed`

### Models
Elkészítettem a modeleket, és hogy teszteljem a 'tinker'-t használtam, ami egy beépített CLI eszköz a laravelben.
Az alábbi parancsal nyitható meg:
`php aritsan tinker`

És így tudtam pl. az order-t letesztelni:
`
\> $order = \App\Models\Order::first(); # lekéri a legelső ordert a táblából
\> $order->user->name
= "Gipsz Jakab"
`
### Protected routes
Egy protected route csak olyannak küld vissza adatot, aki be van jelentkezve. Tehát, az auth middleware-en keresztül megy a kérés. Ezeket a legkönnyebben úgy lehet megcsinálni, ha csinálunk egy group-ot, és azon belül helyezzük el a route-okat:
`
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/products', [ProductController::class, 'index']);
});
`

### Controllers
Az API-hoz való controllereket a következő parancs hozza létre:
`php artisan make:controller ProductController --api`
Ezzel elkészül az alapvető API Controller scheme, benne a szükséges metódusokkal.

***Eager loading***
Tegyük fel, szeretném az orderrel együtt lekérni azt, hogy ki rendelte, és miket rendelt.
Ebben az esetben a 'rossz' megoldás, lekérni az összes ordert és több lekérést végezni, hogy lekérjem azt is, hogy ki rendelte, és mit rendelt. Ez az n+1 lekérdezés problémája, amire az Eloquent az eager loading megoldását használhatjuk:
`Order::with(['user', 'products'])->get()`
Ezzel lekérjük az ordert, annak a user és a products relationjeit. Ezek ugyan azok a metódusok, amiket a modelben definiáltunk. Olyan, mintha ezt mondanám:
`$order->user`
Csak minden rekordra az adatbázisban, EGYETLEN lekérésből.

### Requests
Létrehozhatunk saját requesteket a laravelben, így:
`php artisan make:request StoreOrderRequest`

És ezt a controllerben a következőképp használhatjuk:
`public function store(Request $request)`
Helyette:
`public function store(StoreOrderRequest $request)`

A requestben van egy authorize és egy rules metódus alapból megírva. Az authorize metódus akkor jön jól, ha pl. role rendszer van kiépítve, és van egy request amit például csak adminnak lehet végrehajtani. Ebben az esetben itt tudjuk lecheckolni, hogy admin-e a user, és a megfelelő boolean-t visszaadni.

Nekem egyelőre a rules metódus a fontos, ami hasonló, a request->validate-hez, ugyanúgy szabályokat tudunk megadni, hogy az egyes mezőknek hogy kell kinézni.

