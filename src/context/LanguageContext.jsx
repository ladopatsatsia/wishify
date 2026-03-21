import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value[k] === undefined) return key; // fallback to key
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

const translations = {
  en: {
    nav: {
      templates: "Templates",
      features: "Features",
      howItWorks: "How it Works",
      login: "Log in",
      getStarted: "Get Started ✨"
    },
    hero: {
      badge: "✨ The #1 Digital Greetings Platform",
      title1: "Send Joy, Instantly.",
      title2: "Zero Waste.",
      desc: "Create breathtaking, animated digital cards in seconds. Personalize with music, custom animations, and your own photos. Delivered instantly, loved forever.",
      btnPrimary: "Start Creating — It's Free",
      btnSecondary: "See how it works",
      statUsers: "100k+ Happy Users",
      statCards: "1M+ Smilies Delivered"
    },
    features: {
      badge: "Features",
      title: "Everything you need to make them smile",
      desc: "Our platform provides all the tools to create an unforgettable digital greeting experience.",
      f1_title: "Stunning Animations",
      f1_desc: "Cards that come alive with beautiful CSS animations and confetti.",
      f2_title: "Add Custom Music",
      f2_desc: "Upload their favorite song to play when they open your card.",
      f3_title: "Photo Galleries",
      f3_desc: "Include a beautiful swipeable gallery of your favorite memories.",
      f4_title: "Instant Delivery",
      f4_desc: "Get a custom link immediately and send via WhatsApp, SMS, or Email.",
      f5_title: "Mobile Optimized",
      f5_desc: "Every card looks flawless on any device, from phones to desktops.",
      f6_title: "Eco-Friendly",
      f6_desc: "Zero paper waist. Zero shipping emissions. 100% digital joy."
    },
    howItWorks: {
      badge: "Simple Process",
      title: "How Wishify Works",
      desc: "Creating the perfect digital card takes less than two minutes.",
      s1: "Choose a Template",
      s1_d: "Browse our collection of beautifully designed templates for any occasion.",
      s2: "Personalize It",
      s2_d: "Add your message, photos, and pick the perfect background music.",
      s3: "Send & Celebrate",
      s3_d: "Share your unique link instantly with your loved ones anywhere."
    },
    cta: {
      title: "Ready to start creating?",
      desc: "Join thousands of others making every occasion special with Wishify.",
      btn: "Create Your First Card ✨"
    },
    footer: {
      desc: "The most beautiful way to send digital greetings to your loved ones.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      rights: "© 2024 Wishify. All rights reserved."
    },
    browse: {
      title1: "Beautiful Templates for",
      title2: "Every Occasion",
      desc: "Choose from our handcrafted designs. Each template is fully customizable with your own photos, message, and music.",
      btnCreate: "Create Note ✍️",
      btnShare: "Share 💌"
    },
    auth: {
      login_title: "Welcome back!",
      login_desc: "Sign in to manage your cards",
      signup_title: "Join Wishify",
      signup_desc: "Start creating magical cards today",
      email: "Email address",
      pass: "Password",
      name: "Full Name",
      btn_login: "Sign In",
      btn_signup: "Create Account"
    },
    dashboard: {
      saved_title: "My Saved Cards",
      saved_desc: "All your customized and beautifully personalized greeting cards.",
      published_title: "My Published Cards",
      published_desc: "Your live digital cards out in the wild bringing joy.",
      no_saved: "No saved cards yet",
      no_saved_desc: "You haven't customized any cards yet. Head over to our templates and create something magical!",
      no_public: "No private cards",
      no_public_desc: "You've published all your cards! Check them out in the Published section.",
      btn_view: "👀 View",
      btn_remove: "🗑️ Remove",
      btn_create: "Start Customizing",
      btn_copy: "Copy Link",
      btn_unpublish: "Make Private"
    },
    publish: {
      modal_title: "Choose Your Live Link",
      modal_desc: "Your card will be published at a custom address.",
      url_label: "Your Custom URL",
      warning_title: "Read This Before You Proceed — ყურადღებით!",
      warning_desc: "Once this card goes live, it's permanent. Your link, your design, your message — sealed forever. No edits. No do-overs. The moment you hit Publish, your gift is cast in digital stone. Choose your URL wisely. 💎",
      cancel: "Cancel",
      process: "Process →",
      pay_title: "Publish Your Gift Card",
      pay_desc: "One-time premium publishing fee",
      btn_pay: "🔒 Pay & Publish — $4.99",
      success_title: "Card is Live!",
      live_at: "Your gift is now live at:"
    },
    editor: {
      title: "Birthday Card Editor",
      desc: "Personalize every detail",
      live: "Live Preview",
      settings: "Card Settings",
      recipient: "Recipient's Name or Title",
      message: "Your Message",
      signature: "Signature / From",
      photos: "Upload Photos (Max 4)",
      photos_sub: "Add some favorite memories",
      music: "Background Music",
      box: "Add Gift Box Link?",
      btn_save: "Save Changes",
      btn_preview: "Preview Full Card"
    }
  },
  ka: {
     nav: {
      templates: "შაბლონები",
      features: "ფუნქციები",
      howItWorks: "როგორ მუშაობს",
      login: "შესვლა",
      getStarted: "დაწყება ✨"
    },
    hero: {
      badge: "✨ #1 ციფრული მისალოცი პლატფორმა",
      title1: "გააგზავნე სიხარული, მყისიერად.",
      title2: "ნულოვანი ნარჩენი.",
      desc: "შექმენით ულამაზესი, ანიმირებული ციფრული ბარათები წამებში. პერსონალიზაცია მუსიკით, ანიმაციებით და თქვენი ფოტოებით.",
      btnPrimary: "დაიწყე შექმნა — უფასოა",
      btnSecondary: "ნახე როგორ მუშაობს",
      statUsers: "100k+ მომხმარებელი",
      statCards: "1M+ გაგზავნილი ღიმილი"
    },
    features: {
      badge: "ფუნქციები",
      title: "ყველაფერი რაც გჭირდებათ ღიმილისთვის",
      desc: "ჩვენი პლატფორმა გაძლევთ ყველა ინსტრუმენტს ციფრული მისალოცის შესაქმნელად.",
      f1_title: "ულამაზესი ანიმაციები",
      f1_desc: "ბარათები ცოცხლდება ლამაზი CSS ანიმაციებით და კონფეტით.",
      f2_title: "დაამატე მუსიკა",
      f2_desc: "ატვირთეთ მათი საყვარელი სიმღერა ბარათის გახსნისას გასაჟღერებლად.",
      f3_title: "ფოტო გალერეები",
      f3_desc: "დაამატეთ საუკეთესო მოგონებების ულამაზესი გალერეა.",
      f4_title: "მყისიერი მიწოდება",
      f4_desc: "მიიღეთ ლინკი მაშინვე და გააგზავნეთ WhatsApp, SMS ან ელ-ფოსტით.",
      f5_title: "მორგებული მობილურზე",
      f5_desc: "ყველა ბარათი იდეალურად გამოიყურება ნებისმიერ მოწყობილობაზე.",
      f6_title: "ეკო-მეგობრული",
      f6_desc: "ნულოვანი ნარჩენი. ციფრული სიხარული."
    },
    howItWorks: {
      badge: "მარტივი პროცესი",
      title: "როგორ მუშაობს Wishify",
      desc: "ციფრული ბარათის შექმნას 2 წუთზე ნაკლები სჭირდება.",
      s1: "აირჩიე შაბლონი",
      s1_d: "დაათვალიერე ულამაზესი დიზაინის მქონე შაბლონები ნებისმიერი შემთხვევისთვის.",
      s2: "პერსონალიზაცია",
      s2_d: "დაამატე შენი ტექსტი, ფოტოები და ფონური მუსიკა.",
      s3: "გააგზავნე",
      s3_d: "გაუზიარე უნიკალური ლინკი საყვარელ ადამიანებს მყისიერად."
    },
    cta: {
      title: "მზად ხარ შესაქმნელად?",
      desc: "შემოუერთდი ათასობით მომხმარებელს და გახადე ყველა დღესასწაული გამორჩეული Wishify-სთან ერთად.",
      btn: "შექმენი შენი პირველი ბარათი ✨"
    },
    footer: {
      desc: "საყვარელი ადამიანებისთვის ციფრული ბარათების გაგზავნის ყველაზე ლამაზი გზა.",
      product: "პროდუქტი",
      company: "კომპანია",
      legal: "იურიდიული",
      rights: "© 2024 Wishify. ყველა უფლება დაცულია."
    },
    browse: {
      title1: "ულამაზესი შაბლონები",
      title2: "ყველა შემთხვევისთვის",
      desc: "აირჩიე ჩვენი დიზაინებიდან. თითოეული შაბლონი სრულად რედაქტირებადია.",
      btnCreate: "შექმენი ✍️",
      btnShare: "გაზიარება 💌"
    },
    auth: {
      login_title: "მოგესალმებით!",
      login_desc: "შედით თქვენი ბარათების სამართავად",
      signup_title: "შემოუერთდი Wishify-ს",
      signup_desc: "დაიწყეთ ჯადოსნური ბარათების შექმნა დღესვე",
      email: "ელ-ფოსტა",
      pass: "პაროლი",
      name: "სრული სახელი",
      btn_login: "შესვლა",
      btn_signup: "რეგისტრაცია"
    },
    dashboard: {
      saved_title: "ჩემი შენახული ბარათები",
      saved_desc: "თქვენი ყველა პერსონალიზებული ბარათი.",
      published_title: "ჩემი გამოქვეყნებული ბარათები",
      published_desc: "თქვენი დასრულებული ბარათები, რომლებიც უკვე ონლაინ არის.",
      no_saved: "ჯერ არაფერია შენახული",
      no_saved_desc: "თქვენ ჯერ არ შეგიქმნიათ ბარათები. გადადით შაბლონებში და შექმენით!",
      no_public: "არ გაქვთ პირადი ბარათები",
      no_public_desc: "თქვენ უკვე გამოაქვეყნეთ ყველა ბარათი! შეამოწმეთ ისინი გამოქვეყნებულების სექციაში.",
      btn_view: "👀 ნახვა",
      btn_remove: "🗑️ წაშლა",
      btn_create: "დაიწყე შექმნა",
      btn_copy: "ლინკის კოპირება",
      btn_unpublish: "პირადად გადაქცევა"
    },
    publish: {
      modal_title: "აირჩიეთ ლაივ ლინკი",
      modal_desc: "თქვენი ბარათი გამოქვეყნდება მორგებულ მისამართზე.",
      url_label: "თქვენი მორგებული URL",
      warning_title: "წაიკითხეთ სანამ გააგრძელებთ — ყურადღებით!",
      warning_desc: "როდესაც ბარათი გამოქვეყნდება, ის მუდმივია. თქვენი ლინკი, დიზაინი, ტექსტი — დალუქული იქნება სამუდამოდ. გაუქმება შეუძლებელია. ყურადღებით აირჩიეთ URL. 💎",
      cancel: "გაუქმება",
      process: "გაგრძელება →",
      pay_title: "გამოაქვეყნეთ სასაჩუქრე ბარათი",
      pay_desc: "ერთჯერადი პრემიუმ გამოქვეყნების საკომისიო",
      btn_pay: "🔒 გადახდა და გამოქვეყნება — $4.99",
      success_title: "ბარათი გამოქვეყნდა!",
      live_at: "თქვენი საჩუქარი ახლა განთავსებულია აქ:"
    },
    editor: {
      title: "დაბადების დღის ბარათის რედაქტორი",
      desc: "დეტალების პერსონალიზაცია",
      live: "ლაივ გადახედვა",
      settings: "პარამეტრები",
      recipient: "მიმღების სახელი ან სათაური",
      message: "თქვენი მესიჯი",
      signature: "ხელმოწერა / ვისგან",
      photos: "ატვირთე ფოტოები (მაქსიმუმ 4)",
      photos_sub: "დაამატე საუკეთესო მოგონებები",
      music: "ფონური მუსიკა",
      box: "სასაჩუქრე ყუთის ლინკი?",
      btn_save: "ცვლილებების შენახვა",
      btn_preview: "სრული გადახედვა"
    }
  },
  ru: {
    nav: {
      templates: "Шаблоны",
      features: "Особенности",
      howItWorks: "Как это работает",
      login: "Войти",
      getStarted: "Начать ✨"
    },
    hero: {
      badge: "✨ №1 Платформа цифровых поздравлений",
      title1: "Дарите радость мгновенно.",
      title2: "Без лишних отходов.",
      desc: "Создавайте потрясающие анимированные цифровые открытки за считанные секунды. Добавьте музыку, анимацию и свои фото. Доставка мгновенно, память навсегда.",
      btnPrimary: "Начать создавать — бесплатно",
      btnSecondary: "Как это работает",
      statUsers: "100k+ пользователей",
      statCards: "1M+ улыбок доставлено"
    },
    features: {
      badge: "Особенности",
      title: "Все, чтобы они улыбнулись",
      desc: "Наша платформа предоставляет все инструменты для создания незабываемого цифрового поздравления.",
      f1_title: "Потрясающая анимация",
      f1_desc: "Открытки оживают благодаря красивой CSS-анимации и конфетти.",
      f2_title: "Своя музыка",
      f2_desc: "Загрузите любимую песню, которая зазвучит при открытии открытки.",
      f3_title: "Фотогалереи",
      f3_desc: "Добавьте красивую галерею ваших любимых воспоминаний.",
      f4_title: "Мгновенная доставка",
      f4_desc: "Получите ссылку сразу и отправьте через WhatsApp, SMS или Email.",
      f5_title: "Мобильная оптимизация",
      f5_desc: "Каждая открытка идеально смотрится на любом устройстве.",
      f6_title: "Экологичность",
      f6_desc: "Ноль бумажных отходов. Ноль вредных выбросов. 100% цифровой радости."
    },
    howItWorks: {
      badge: "Простой процесс",
      title: "Как работает Wishify",
      desc: "Создание идеальной цифровой открытки занимает менее двух минут.",
      s1: "Выберите шаблон",
      s1_d: "Просмотрите нашу коллекцию красиво оформленных шаблонов на любой случай.",
      s2: "Персонализируйте",
      s2_d: "Добавьте сообщение, фото и выберите идеальную фоновую музыку.",
      s3: "Отправьте и празднуйте",
      s3_d: "Поделитесь уникальной ссылкой с близкими мгновенно."
    },
    cta: {
      title: "Готовы начать создавать?",
      desc: "Присоединяйтесь к тысячам тех, кто делает каждый праздник особенным с Wishify.",
      btn: "Создать свою первую открытку ✨"
    },
    footer: {
      desc: "Самый красивый способ отправить цифровые поздравления вашим близким.",
      product: "Продукт",
      company: "Компания",
      legal: "Юридическая информация",
      rights: "© 2024 Wishify. Все права защищены."
    },
    browse: {
      title1: "Красивые шаблоны для",
      title2: "Любого случая",
      desc: "Выбирайте из наших авторских дизайнов. Каждый шаблон полностью настраивается.",
      btnCreate: "Создать ✍️",
      btnShare: "Поделиться 💌"
    },
    auth: {
      login_title: "С возвращением!",
      login_desc: "Войдите, чтобы управлять открытками",
      signup_title: "Присоединяйтесь к Wishify",
      signup_desc: "Начните создавать магические открытки сегодня",
      email: "Электронная почта",
      pass: "Пароль",
      name: "Полное имя",
      btn_login: "Войти",
      btn_signup: "Создать аккаунт"
    },
    dashboard: {
      saved_title: "Мои сохраненные открытки",
      saved_desc: "Все ваши персонализированные поздравительные открытки.",
      published_title: "Мои опубликованные открытки",
      published_desc: "Ваши живые открытки, приносящие радость.",
      no_saved: "Сохраненных открыток пока нет",
      no_saved_desc: "Вы еще не создали ни одной открытки. Перейдите к шаблонам и создайте что-то магическое!",
      no_public: "Нет приватных открыток",
      no_public_desc: "Вы опубликовали все свои открытки! Посмотрите их в разделе «Опубликованные».",
      btn_view: "👀 Посмотреть",
      btn_remove: "🗑️ Удалить",
      btn_create: "Начать создание",
      btn_copy: "Копировать ссылку",
      btn_unpublish: "Сделать приватной"
    },
    publish: {
      modal_title: "Выберите ссылку для открытки",
      modal_desc: "Ваша открытка будет опубликована по специальному адресу.",
      url_label: "Ваш специальный URL",
      warning_title: "Прочтите перед публикацией — ყურადღებით!",
      warning_desc: "Как только открытка станет публичной, это навсегда. Ваша ссылка, дизайн, сообщение — всё будет запечатано. Никаких правок. Никаких переделок. В тот момент, когда вы нажимаете «Опубликовать», ваш подарок отливается в цифровом камне. Выбирайте URL с умом. 💎",
      cancel: "Отмена",
      process: "Продолжить →",
      pay_title: "Опубликуйте свою открытку",
      pay_desc: "Единоразовый взнос за премиум-публикацию",
      btn_pay: "🔒 Оплатить и опубликовать — $4.99",
      success_title: "Открытка опубликована!",
      live_at: "Ваш подарок доступен по ссылке:"
    },
    editor: {
      title: "Редактор открыток",
      desc: "Персонализируйте каждую деталь",
      live: "Предпросмотр",
      settings: "Настройки открытки",
      recipient: "Имя получателя",
      message: "Ваше сообщение",
      signature: "Подпись / От кого",
      photos: "Загрузить фото (макс. 4)",
      photos_sub: "Добавьте любимые воспоминания",
      music: "Фоновая музыка",
      box: "Добавить ссылку на подарок?",
      btn_save: "Сохранить изменения",
      btn_preview: "Полный предпросмотр"
    }
  }
};
