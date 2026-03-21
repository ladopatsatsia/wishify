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
  }
};
