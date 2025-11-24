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

***2025.11.20.***
### Migrations
Elkészítettem az alapvető migrációkat.

### Seeders
Azért, hogy a teszt adatok migrate:fresh esetén is megmaradjanak, létrehoztam 4 seedert: UserSeeder és ProductSeeder, OrderSeeder, OrderProductSeeder

Itt egy példa:
```
DB::table('users')->insert([
  'name' => 'Gipsz Jakab',
  'email' => 'gj@gmail.com',
  'password' => Hash::make('gj123'),
]);
```

Ezt a 'run' metóduson belül kell elhelyezni, és feltölti a users táblát az értékekkel. Több érték is megadható a seederben, pl.:
```
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
```

A következő paranccsal lehet őket futtatni:
`php artisan db:seed`
vagy, ha migrate:fresh-el együtt akarjuk
`php artisan migrate:fresh --seed`

### Models
Elkészítettem a modeleket, és hogy teszteljem a 'tinker'-t használtam, ami egy beépített CLI eszköz a laravelben.
Az alábbi parancsal nyitható meg:
`php aritsan tinker`

És így tudtam pl. az order-t letesztelni:
```
\> $order = \App\Models\Order::first(); # lekéri a legelső ordert a táblából
\> $order->user->name
= "Gipsz Jakab"
```
### Protected routes
Egy protected route csak olyannak küld vissza adatot, aki be van jelentkezve. Tehát, az auth middleware-en keresztül megy a kérés. Ezeket a legkönnyebben úgy lehet megcsinálni, ha csinálunk egy group-ot, és azon belül helyezzük el a route-okat:
```
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/products', [ProductController::class, 'index']);
});
```

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


***2025.11.22.***

### Store metódus - kapcsolótáblával (Controller)
Van az orders tábla ami a rendeléseket tárolja és a products táblában található az összes termék. Ezt a kettőt kapcsolótábla köti össze, mivel N:M kapcsolatúak. Itt még egy adat szerepe, a count, vagyis hogy user hány darabot vett az adott productból.

Egy post request során meg kell adni az orders tábla szükséges adatait (név, cim, stb.), emellett a program vár egy products mezőt is, ahol listában kell megadni a termékeket a következő formátumban
`"products": [{"product_id": 1, "count: 1"}, {"product_id": 2, count: 3}]`

Itt ezt találtam a legjobb megoldásnak, és megvalósitásom a következő:
```
$order = Order::create($data);

foreach ($request->products as $key => $item) {
    $order->products()->attach($item['product_id'], ['count' => $item['count']]);
}
```

Elkészitjük az ordert, ami berakja az orders táblába a rendelést, az összes adatával. Emellett, végigmegyünk a post requestben bekért products-on, ami tartalmaz product_id-kat és count-okat. Az elkészitett orderhez hozzácsatolom az attach metódussal, és megadom a product_id-t (az order_id is kell a kapcsolótáblába, de ezt nem kell megadni, hiszen az $order-re hivom az attach metódust, ezáltal tudja a saját ID-ját) és megadok egy listát a második argumentumként, ide kellenek a pivottábla adatai, asszociativ tömbként megadva, kulccsal és értékkel. A kulcs lesz a pivottábla mezője, az érték pedig az értéke.

Ennek az egésznek az előfeltétele az, hogy a model megfelelően legyen meghatározva, benne az N:M kapcsolattal (belongsToMany). Az attach csak is emiatt müködhet.

### Update metódus - kapcsolótáblával (Controller)
Az update-nek is hasonló a módszere, viszont itt a model sync metódusáát használom. Azért ez a legjobb megoldás véleményem szerint, mert ha egy ordernek van például 3 productja, ebből az update-nél csak 2-t küldök el, akkor a 3. törlődik, tehát mindenféle változtatást képes kezelni a controller. 

Megvalósitás a következő:

#### Validációk
```
'postal_code' => 'sometimes|required|string',
'address' => 'sometimes|required|string',
'status' => ['sometimes', Rule::in(['Megrendelve', 'Előkészítés alatt', 'Átadva a futárnak'])],


'products' => 'sometimes|required|array|min:1',
'products.*.product_id' => 'required_with:products|exists:products,id',
'products.*.count' => 'required_with:products|integer|min:1',
```

A sometimes egy számomra új validációs szabály, amely a következőt teszi: alapból nem muszáj megadni semmit sem, viszont ha megadok valamit, akkor a sometimes utáni paraméterek lecsekkolják, hogy amit megadtam, helyes-e. Pl.: csak postal codeot adok meg, de ha az nem egy string akkor hibát ad. Viszont másra, amit egyáltalán nem adtam meg, arra nem dob hibát. Igy az egész Order elküldése nélkül tudunk updatelni, úgy, hogy nem az új Ordert adjuk meg amit látni szeretnénk, csak azt, hogy minek kell változnia.

#### Route model bindig
A laravel engedi a route model bindingot, azaz, a requestben ID-t adunk meg, de a laravel automatikusan megkeresi a számunkra megfelelő Order modelt, és ezzel nekünk már nem kell bajlódni. Megvalósitás a következő:
```
Route::put('/orders/{order}', [OrderController::class, 'update']);
```
{id} helyett {order}-t irok be a route cimébe, itt semmi egyéb nem változik.

A controllerben:
```
public function update(UpdateOrderRequest $request, Order $order)
```
Tehát `$string id` helyett `Order $order` van irva, ezáltal fog müködni a route-model binding.

#### Sync a kapcsoló táblával
Az order-t updateljük, azokkal a paraméterekkel, amik meg vannak adva:
```
$order->update([
    'postal_code' => $request->postal_code ?? $order->postal_code,
    'address' => $request->address ?? $order->address,
    'status' => $request->status ?? $order->status
]);
```
Feltételes szintaktika:
Megvan adva? Akkor legyen a megadott. Nincs megadva? Akkor legyen az eredeti.

A következő a kapcsolótáblával való szinkronizálás. Ezt a módszert választottam, mivel igy a legegyszerübb eltávolitani és új termékeket is hozzáadni az orderhez. Eltávolitáshoz egyszerüen csak nem rakjuk bele a products listába a requestnél, uj hozzáadásánál csak simán megadjuk az előzőeket és az újat egy listában.
Megvalósitása:
```
if (isset($request->products)) {
    $syncData = [];

    foreach ($request->products as $item) {
        $syncData[$item['product_id']] = [
            'count' => $item['count']
        ];
    }

    $order->products()->sync($syncData);
}
```
Az egész csak akkor fut le, ha van products megadva. Ha nem, akkor változatlannak tekintjük és nem módositunk semmit, tehát az előző termékek megmaradnak 1/1.

Sync data táblában a termékeket tároljuk a következő formában:
```
[
  termék-id => ["count" => darabszám]
]
```

Tehát az asszociativ tömb minden elemének a kulcsa egy termék id, és az értéke pedig egy lista a pivot tábla értékeivel, ez esetben egy van: count.

Végül, miután hozzáadtuk ebben a formában a termékeket, meghivjuk az order products metódusára a syncet. Ez megadja a laravelnek, hogy az order_product kapcsolótáblát synceljük és paraméterként a syncData pedig megadja, hogy mi kerüljön be, és mi kerüljön ki a táblából.

Legvégül csak visszaküldünk egy JSON-t üzenettel, és a módositott orderrel amibe eager loadolva van a products:
```
return response()->json([
    'message' => 'Order updated',
    'order' => $order->load('products'),
]);
```
