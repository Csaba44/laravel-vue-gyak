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