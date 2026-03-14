export const hu = {
  // Common
  common: {
    loading: 'Betöltés...',
    error: 'Hiba',
    success: 'Sikeres',
    cancel: 'Mégse',
    close: 'Bezárás',
    save: 'Mentés',
    delete: 'Törlés',
    edit: 'Szerkesztés',
    back: 'Vissza',
    next: 'Következő',
    submit: 'Küldés',
    search: 'Keresés',
    filter: 'Szűrés',
    download: 'Letöltés',
    upload: 'Feltöltés',
    required: 'Kötelező',
    optional: 'Opcionális',
    yes: 'Igen',
    no: 'Nem',
  },

  // Navigation
  nav: {
    home: 'Főoldal',
    events: 'Események',
    dashboard: 'Irányítópult',
    admin: 'Admin',
    login: 'Bejelentkezés',
    logout: 'Kijelentkezés',
    profile: 'Profil',
  },

  // Landing Page
  landing: {
    hero: {
      title: 'Fedezd fel a legjobb eseményeket',
      subtitle: 'Vásárolj jegyeket könnyen és biztonságosan',
      cta: 'Események megtekintése',
    },
    features: {
      title: 'Miért válassz minket?',
      secure: {
        title: 'Biztonságos fizetés',
        description: 'Barion fizetési rendszer',
      },
      easy: {
        title: 'Egyszerű vásárlás',
        description: 'Néhány kattintással megveheted a jegyeket',
      },
      qr: {
        title: 'QR kódos belépés',
        description: 'Gyors és érintésmentes beléptetés',
      },
    },
    events: {
      title: 'Aktuális események',
      noEvents: 'Jelenleg nincsenek aktív események',
      viewDetails: 'Részletek',
    },
  },

  // Events
  events: {
    title: 'Események',
    details: 'Esemény részletei',
    date: 'Időpont',
    location: 'Helyszín',
    ticketsAvailable: 'Jegyek elérhetők',
    soldOut: 'Elfogyott',
    backToEvents: 'Vissza az eseményekhez',
  },

  // Tickets
  tickets: {
    individual: 'Egyéni jegyek',
    group: 'Csoportos jegyek',
    child: 'Gyermek',
    adult: 'Felnőtt',
    selectTickets: 'Válassz jegyeket',
    addToCart: 'Kosárba',
    addIndividual: 'Egyéni jegyek hozzáadása',
    addGroup: 'Csoportos jegyek hozzáadása',
    quantity: 'Mennyiség',
    price: 'Ár',
    total: 'Összesen',
    perTicket: 'jegy',
    maxIndividual: 'Maximum 4 egyéni jegy',
    minGroup: 'Minimum 5 csoportos jegy',
    groupRequiresLogin: 'Csoportos jegyekhez bejelentkezés szükséges',
  },

  // Cart
  cart: {
    title: 'Kosár',
    empty: 'A kosár üres',
    items: 'tételek',
    subtotal: 'Részösszeg',
    total: 'Végösszeg',
    checkout: 'Fizetés',
    proceedToCheckout: 'Tovább a fizetéshez',
    remove: 'Eltávolítás',
    clear: 'Kosár ürítése',
  },

  // Checkout
  checkout: {
    title: 'Pénztár',
    contactInfo: 'Kapcsolattartási adatok',
    ticketInfo: 'Jegy információk',
    orderSummary: 'Rendelés összegzése',
    completePurchase: 'Vásárlás befejezése',
    processing: 'Feldolgozás...',
    email: 'E-mail cím',
    emailPlaceholder: 'pelda@email.hu',
  },

  // Ticket Form Fields
  ticketForm: {
    holderName: 'Név',
    holderAge: 'Életkor',
    parentName: 'Szülő/Gondviselő neve',
    holderPhone: 'Telefonszám',
    holderAddress: 'Cím',
    childName: 'Gyermek neve',
    participant: 'Résztvevő',
  },

  // Validation
  validation: {
    required: 'Ez a mező kötelező',
    email: 'Érvénytelen e-mail cím',
    minLength: 'Legalább {min} karakter szükséges',
    maxLength: 'Maximum {max} karakter',
    minAge: 'Minimum életkor: {min}',
    maxAge: 'Maximum életkor: {max}',
    phone: 'Érvénytelen telefonszám',
  },

  // Payment
  payment: {
    status: {
      pending: 'Függőben',
      paid: 'Fizetve',
      failed: 'Sikertelen',
      payment_initiated: 'Fizetés folyamatban',
    },
    success: {
      title: 'Sikeres fizetés!',
      message: 'Köszönjük a vásárlást',
      orderNumber: 'Rendelésszám',
      downloadQR: 'QR kód letöltése',
      viewOrder: 'Rendelés megtekintése',
    },
    error: {
      title: 'Fizetési hiba',
      message: 'A fizetés nem sikerült',
      tryAgain: 'Próbáld újra',
    },
    pending: {
      title: 'Fizetés folyamatban',
      message: 'A fizetés még feldolgozás alatt van',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Rendeléseim',
    subtitle: 'Jegyek megtekintése és kezelése',
    noOrders: 'Még nem vásároltál jegyeket',
    browseEvents: 'Események böngészése',
    orderHistory: 'Rendelési előzmények',
    orderId: 'Rendelésszám',
    event: 'Esemény',
    purchaseDate: 'Vásárlás dátuma',
    amount: 'Összeg',
    status: 'Státusz',
    actions: 'Műveletek',
    viewDetails: 'Részletek',
    viewQR: 'QR kód',
  },

  // Order Details
  orderDetails: {
    title: 'Rendelés részletei',
    eventInfo: 'Esemény információk',
    participants: 'Résztvevők',
    orderSummary: 'Rendelés összegzése',
    orderType: 'Rendelés típusa',
    orderDate: 'Rendelés dátuma',
    name: 'Név',
    age: 'Életkor',
    parent: 'Szülő/Gondviselő',
    phone: 'Telefon',
    address: 'Cím',
  },

  // QR Code
  qrCode: {
    title: 'Jegy QR kód',
    subtitle: 'Mutasd fel ezt a QR kódot a belépésnél',
    download: 'QR kód letöltése',
    event: 'Esemény',
    notAvailable: 'QR kód nem elérhető',
  },

  // Scanner
  scanner: {
    title: 'QR Szkenner',
    welcome: 'Üdvözöljük',
    scanTicket: 'Jegy beolvasása',
    startScanner: 'Szkenner indítása',
    stopScanner: 'Szkenner leállítása',
    recentScans: 'Legutóbbi beolvasások',
    validTicket: 'Érvényes jegy - Belépés engedélyezve',
    invalidQR: 'Érvénytelen QR kód',
    alreadyUsed: 'Jegy már felhasználva',
    paymentNotCompleted: 'Fizetés nem teljesült',
    verificationFailed: 'Ellenőrzés sikertelen',
    participants: 'résztvevő',
    scanToVerify: 'Kezdd el a beolvasást a jegyek ellenőrzéséhez',
  },

  // Admin
  admin: {
    title: 'Adminisztráció',
    events: {
      title: 'Események kezelése',
      create: 'Új esemény',
      edit: 'Esemény szerkesztése',
      delete: 'Esemény törlése',
      active: 'Aktív',
      inactive: 'Inaktív',
      analytics: 'Statisztikák',
    },
    orders: {
      title: 'Rendelések',
      viewAll: 'Összes rendelés',
      filter: 'Szűrés',
    },
    users: {
      title: 'Felhasználók',
      role: 'Szerepkör',
      customer: 'Vásárló',
      staff: 'Munkatárs',
      admin: 'Adminisztrátor',
    },
    analytics: {
      totalTickets: 'Összes jegy',
      individual: 'Egyéni',
      group: 'Csoportos',
      revenue: 'Bevétel',
      checkIns: 'Beolvasások',
      scanned: 'beolvasva',
    },
  },

  // Auth
  auth: {
    login: 'Bejelentkezés',
    logout: 'Kijelentkezés',
    email: 'E-mail',
    password: 'Jelszó',
    forgotPassword: 'Elfelejtett jelszó?',
    noAccount: 'Nincs még fiókod?',
    signUp: 'Regisztráció',
    hasAccount: 'Van már fiókod?',
    signIn: 'Bejelentkezés',
    loggingIn: 'Bejelentkezés...',
    loginError: 'Bejelentkezési hiba',
    invalidCredentials: 'Érvénytelen e-mail vagy jelszó',
  },

  // Email
  email: {
    subject: {
      orderConfirmation: 'Rendelés megerősítés - {eventTitle}',
    },
    greeting: 'Kedves Vásárló!',
    orderConfirmed: 'Rendelésed sikeresen megerősítve!',
    thankYou: 'Köszönjük a vásárlást!',
    eventDetails: 'Esemény részletei',
    orderDetails: 'Rendelés részletei',
    viewQR: 'QR kód megtekintése',
    downloadTicket: 'Jegy letöltése',
    questions: 'Kérdésed van? Írj nekünk!',
  },

  // Errors
  errors: {
    generic: 'Valami hiba történt',
    notFound: 'Nem található',
    unauthorized: 'Nincs jogosultságod',
    forbidden: 'Hozzáférés megtagadva',
    serverError: 'Szerverhiba',
    networkError: 'Hálózati hiba',
    tryAgain: 'Próbáld újra később',
  },
}

export type Translations = typeof hu
