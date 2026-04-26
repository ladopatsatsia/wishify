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
      if (!value || value[k] === undefined) return key; // fallback to key
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
      f6_desc: "Zero paper waste. Zero shipping emissions. 100% digital joy."
    },
    howItWorks: {
      badge: "Simple Process",
      title: "How Wishyfy Works",
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
      desc: "Join thousands of others making every occasion special with Wishyfy.",
      btn: "Create Your First Card ✨"
    },
    footer: {
      desc: "The most beautiful way to send digital greetings to your loved ones.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      rights: "© 2024 Wishyfy. All rights reserved."
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
      signup_title: "Join Wishyfy",
      signup_desc: "Start creating magical cards today",
      email: "Email address",
      pass: "Password",
      name: "Full Name",
      btn_login: "Sign In",
      btn_signup: "Create Account",
      login_required: "Please log in to save your cards!"
    },
    dashboard: {
      hello: "Hello",
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
      btn_unpublish: "Make Private",
      change_password_title: "Change Password",
      change_password_desc: "Update your account password to keep it secure.",
      current_password: "Current Password",
      new_password: "New Password",
      confirm_password: "Confirm New Password",
      btn_change_password: "Update Password",
      password_success: "Password changed successfully!",
      password_mismatch: "New passwords do not match.",
      password_short: "New password must be at least 6 characters.",
      delete_modal: {
        title: "Delete Forever?",
        desc: "This magic card will be deleted forever. You won't be able to recover it.",
        btn_confirm: "Delete Forever",
        btn_cancel: "Cancel"
      }
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
      common: {
        back: "Back",
        preview: "Preview",
        save: "Save",
        saving: "Saving...",
        saved_success: "Card successfully saved!",
        go_to_cabinet: "Go to Cabinet",
        go_to_saved: "Go to Saved Cards",
        read_only_warn: "Published card (Read-Only)",
        live_preview: "Live Preview",
        preview_sub: "How it will look...",
        music: "Music",
        photos: "Photos",
        upload_limit: "Upload up to 4 images",
        add: "Add",
        add_photo: "Add Photo",
        uploading: "Uploading...",
        uploading_failed: "Upload failed",
        upload_error: "Error during upload",
        change_song: "Switch the Vibe ✨",
        find_melody: "Find Your Melody",
        add_melody: "Add Music",
        creative_mode: "Creative Mode",
        copy: "Copy",
        copy_success: "Link copied!",
        purchase: "Purchase",
        dashboard: "Go to Dashboard",
        ready_publish: "Ready to Publish?",
        preserve_forever: "Your memory card will be preserved forever. Choose a beautiful URL and share it with the world.",
        go_to_publish: "Go to Publish"
      },
      birthday: {
        studio: "Birthday Studio",
        title: "Title",
        title_placeholder: "Happy Birthday!",
        message: "Message",
        message_placeholder: "Write your heartfelt message...",
        signature: "Signature",
        signature_placeholder: "With Love ❤️",
        magic_music: "Magic Music Search",
        gift_link: "Gift Link",
        gift_sub: "Add a clickable surprise",
        gift_placeholder: "https://example.com/gift..."
      },
      memory: {
        studio: "Memory Studio",
        title: "Memory Editor",
        main_heading: "Main Heading",
        heading_placeholder: "Enter Title...",
        galleries: "Galleries",
        add_gallery: "Add Gallery",
        gallery_name: "Gallery Name",
        gallery_placeholder: "Enter gallery name...",
        photos_count: "Photos",
        secure_memories: "Your private memories are secure 🔐",
        no_photos: "No photos here yet",
        click_to_upload: "Click to start uploading your magic moments",
        add_photos: "Add Photos",
        remove: "Remove",
        limit_alert: "Maximum 25 photos in total per gallery!",
        hero_subtitle: "Hero Subtitle",
        hero_subtitle_placeholder: "Our Collection of Memories",
        hero_scroll: "Scroll Instruction",
        hero_scroll_placeholder: "Scroll to explore our story",
        gallery_description: "Gallery Description",
        gallery_desc_placeholder: "Tell the story behind these photos...",
        main_photo: "Main Cover Photo"
      },
      love: {
        studio: "Love Letter Studio",
        title: "Love Letter Editor",
        sub_title: "Create a Masterpiece",
        who_is_for: "Who is this for?",
        message: "The Message",
        message_placeholder: "Pour your heart out here...",
        final_wish: "Final Wish",
        signature: "Your Signature",
        photo: "Your Special Photo",
        upload_photo: "Upload Photo",
        change_photo: "Change Photo",
        locked: "Locked",
        save_letter: "Save Letter ✨"
      },
      invitation: {
        studio: "Invitation Studio",
        title: "Invitation Editor",
        sub_title: "Create Your Celebration",
        locations: "Locations",
        add_location: "Add Location",
        location_name: "Place",
        location_time: "Time",
        location_desc: "What happens?",
        phones: "Phone Numbers",
        add_phone: "Add Number",
        seating: "Seating Arrangement",
        add_seating: "Add Guest",
        add_guest: "Add Guest",
        phone_number: "Phone",
        guest_name: "Guest Name",
        table_number: "Table",
        seat_number: "Seat",
        photo: "Photo",
        music: "Music",
        guest_links: "Personalized Guest Links 💌",
        copy_guest_link: "Copy Link",
        save_to_generate: "Please save the invitation to generate personalized guest links.",
        heading_placeholder: "Enter Event Title",
        msg_placeholder: "Enter Event Details",
        basic_info: "Basic Info",
        no_seating: "No guest seating added yet",
        signature: "Sign Off (Footer)",
        signature_placeholder: "e.g. With Love, Lado",
        event_date: "Event Date",
        date_placeholder: "e.g. 24.08.2024",
        guest_phone: "Guest Phone",
        guest_table: "Table #",
        guest_seat: "Seat #"
      }
    },
    music_search: {
      title: "Magic Music Library ✨",
      sub: "Power of iTunes Search",
      placeholder: "Search for song or artist...",
      no_results: "No results found...",
      start_typing: "Start typing to find magic",
      add: "Add ✨"
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
      f1_desc: "ბარათები ცოცხლდება ლამაზი ანიმაციებით.",
      f2_title: "დაამატე მუსიკა",
      f2_desc: "ატვირთეთ მათი საყვარელი სიმღერა და ბარათის გახსნისას შეძლებს მოსმენას.",
      f3_title: "ფოტო გალერეები",
      f3_desc: "დაამატეთ საუკეთესო მოგონებების ულამაზესი გალერეა.",
      f4_title: "მყისიერი მიწოდება",
      f4_desc: "ბარათის შეძენისთანავე, გენერირდება ლინკი, რომელიც უნიკალურია და მზადაა ადრესატისთვის გასაგზავნად.",
      f5_title: "მორგებული მობილურზე",
      f5_desc: "ყველა ბარათი იდეალურად გამოიყურება ნებისმიერ მოწყობილობაზე.",
      f6_title: "ეკო-მეგობრული",
      f6_desc: "ნულოვანი ნარჩენი. ციფრული სიხარული."
    },
    howItWorks: {
      badge: "მარტივი პროცესი",
      title: "როგორ მუშაობს Wishyfy",
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
      desc: "შემოუერთდი ათასობით მომხმარებელს და გახადე ყველა დღესასწაული გამორჩეული Wishyfy-სთან ერთად.",
      btn: "შექმენი შენი პირველი ბარათი ✨"
    },
    footer: {
      desc: "საყვარელი ადამიანებისთვის ციფრული ბარათების გაგზავნის ყველაზე ლამაზი გზა.",
      product: "პროდუქტი",
      company: "კომპანია",
      legal: "იურიდიული",
      rights: "© 2024 Wishyfy. ყველა უფლება დაცულია."
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
      signup_title: "შემოუერთდი Wishyfy-ს",
      signup_desc: "დაიწყეთ ჯადოსნური ბარათების შექმნა დღესვე",
      email: "ელ-ფოსტა",
      pass: "პაროლი",
      name: "სრული სახელი",
      btn_login: "შესვლა",
      btn_signup: "რეგისტრაცია",
      login_required: "გთხოვთ გაიაროთ ავტორიზაცია თქვენი ბარათების შესანახად!"
    },
    dashboard: {
      hello: "გამარჯობა",
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
      btn_unpublish: "პირადად გადაქცევა",
      change_password_title: "პაროლის შეცვლა",
      change_password_desc: "განაახლეთ თქვენი ანგარიშის პაროლი უსაფრთხოებისთვის.",
      current_password: "მიმდინარე პაროლი",
      new_password: "ახალი პაროლი",
      confirm_password: "დაადასტურეთ ახალი პაროლი",
      btn_change_password: "პაროლის განახლება",
      password_success: "პაროლი წარმატებით შეიცვალა!",
      password_mismatch: "ახალი პაროლები არ ემთხვევა.",
      password_short: "ახალი პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს.",
      delete_modal: {
        title: "სამუდამოდ წაშლა?",
        desc: "ეს მაგიური ბარათი წაიშლება სამუდამოდ. მისი აღდგენა შეუძლებელი იქნება.",
        btn_confirm: "სამუდამოდ წაშლა",
        btn_cancel: "გაუქმება"
      }
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
      common: {
        back: "უკან",
        preview: "ბარათის ნახვა",
        save: "შენახვა",
        saving: "ინახება...",
        saved_success: "ბარათი წარმატებით შეინახა!",
        go_to_cabinet: "პირადი კაბინეტი",
        go_to_saved: "შენახულ ბარათებში გადასვლა",
        read_only_warn: "გამოქვეყნებული ბარათის რედაქტირება შეუძლებელია",
        live_preview: "ლაივ პრევიუ",
        preview_sub: "ნახე როგორ გამოჩნდება...",
        music: "მუსიკა",
        photos: "სურათები",
        upload_limit: "ატვირთეთ მაქსიმუმ 4 სურათი",
        add: "დამატება",
        add_photo: "ფოტოს დამატება",
        uploading: "იტვირთება...",
        uploading_failed: "ატვირთვა ვერ მოხერხდა",
        upload_error: "შეცდომა ატვირთვისას",
        change_song: "შეცვალე ჰანგი ✨",
        find_melody: "იპოვე შენი მელოდია",
        add_melody: "დაამატე მუსიკა",
        creative_mode: "Creative Mode",
        copy: "კოპირება",
        copy_success: "ლინკი კოპირებულია!",
        purchase: "შეძენა",
        dashboard: "მართვის პანელი",
        ready_publish: "მზად ხართ გამოსაქვეყნებლად?",
        preserve_forever: "თქვენი ბარათი სამუდამოდ შენარჩუნდება. აირჩიეთ ლამაზი მისამართი და გაუზიარეთ სამყაროს.",
        go_to_publish: "გამოქვეყნება"
      },
      birthday: {
        studio: "Birthday სტუდია",
        title: "სათაური",
        title_placeholder: "გილოცავ დაბადების დღეს!",
        message: "ტექსტი",
        message_placeholder: "დაწერეთ თქვენი გულწრფელი მესიჯი...",
        signature: "ხელმოწერა",
        signature_placeholder: "სიყვარულით ❤️",
        magic_music: "მეჯიქ მუსიკა",
        gift_link: "საჩუქრის ლინკი",
        gift_sub: "დაამატე სიურპრიზი",
        gift_placeholder: "https://example.com/gift..."
      },
      memory: {
        studio: "Memory სტუდია",
        title: "მოგონებების რედაქტორი",
        main_heading: "საწყისი სათაური",
        heading_placeholder: "ჩაწერეთ სათაური...",
        galleries: "გალერეები",
        add_gallery: "გალერეის დამატება",
        gallery_name: "გალერეის სახელი",
        gallery_placeholder: "შეიყვანეთ სახელი...",
        photos_count: "ფოტოები",
        secure_memories: "პირადი მოგონებები დაცულია 🔐",
        no_photos: "აქ ფოტოები ჯერ არ არის",
        click_to_upload: "დააკლიკეთ ასატვირთად",
        add_photos: "ფოტოების დამატება",
        remove: "წაშლა",
        limit_alert: "ჯამში მაქსიმუმ 25 ფოტო!",
        hero_subtitle: "ზედა პატარა სათაური",
        hero_subtitle_placeholder: "ჩვენი მოგონებების კოლექცია",
        hero_scroll: "სქროლვის ინსტრუქცია",
        hero_scroll_placeholder: "ჩამოწკაპუნეთ ამბის სანახავად",
        gallery_description: "გალერეის აღწერა",
        gallery_desc_placeholder: "მოყევით ამ ფოტოების ისტორია...",
        main_photo: "მთავარი გარეკანის ფოტო"
      },
      love: {
        studio: "სიყვარულის სტუდია",
        title: "სიყვარულის წერილი",
        sub_title: "შექმენი მოგონება",
        who_is_for: "ვისთვის არის?",
        message: "შენი წერილი",
        message_placeholder: "დაწერე შენი გრძნობები აქ...",
        final_wish: "დამასრულებელი სურვილი",
        signature: "ხელმოწერა",
        photo: "საყვარელი ფოტო",
        upload_photo: "ატვირთვა",
        change_photo: "შეცვლა",
        locked: "დაბლოკილია",
        save_letter: "შენახვა ✨"
      },
      invitation: {
        studio: "მოსაწვევების სტუდია",
        title: "მოსაწვევის რედაქტორი",
        sub_title: "შექმენი შენი დღესასწაული",
        locations: "ლოკაციები",
        add_location: "ლოკაციის დამატება",
        location_name: "ადგილი",
        location_time: "დრო",
        location_desc: "რა ხდება?",
        phones: "ტელეფონის ნომრები: (დაამატეთ ის საკონტაქტო,ვისაც შეუძლიათ რომ დაუკავშირდნენ, რათა დაადასტურონ მოწვევა)",
        add_phone: "ნომრის დამატება",
        seating: "სტუმრების განლაგება",
        add_seating: "სტუმრის დამატება",
        add_guest: "სტუმრის დამატება",
        phone_number: "ტელეფონი",
        guest_name: "სტუმრის სახელი",
        table_number: "მაგიდა",
        seat_number: "ადგილი",
        photo: "ფოტო",
        music: "მუსიკა",
        guest_links: "პერსონალური ლინკები სტუმრებისთვის 💌",
        copy_guest_link: "ლინკის კოპირება",
        save_to_generate: "გთხოვთ შეინახოთ მოსაწვევი პერსონალური ლინკების მისაღებად.",
        heading_placeholder: "ჩაწერეთ მოსაწვევის სახელი-(მაგ. ქორწილის მოსაწვევი)",
        msg_placeholder: "ჩაწერეთ მოსაწვევის ტექსტი",
        basic_info: "ძირითადი ინფორმაცია",
        no_seating: "სტუმრების სია ცარიელია",
        signature: "ხელმოწერა / დასასრული",
        signature_placeholder: "მაგ: სიყვარულით, გიორგი ან სიყვარულით გიორგი და ანა",
        event_date: "წვეულების თარიღი",
        date_placeholder: "მაგ: 24.08.2024",
        guest_phone: "სტუმრის ტელეფონი",
        guest_table: "მაგიდა #",
        guest_seat: "ადგილი #"
      }
    },
    music_search: {
      title: "მუსიკალური ბიბლიოთეკა ✨",
      sub: "Power of iTunes Search",
      placeholder: "ჩაწერეთ სიმღერა ან მომღერალი...",
      no_results: "შედეგი ვერ მოიძებნა",
      start_typing: "დაიწყე ძებნა ჯადოსნობისთვის",
      add: "დამატება ✨"
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
      title: "Как работает Wishyfy",
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
      desc: "Присоединяйтесь к тысячам тех, кто делает каждый праздник особенным с Wishyfy.",
      btn: "Создать свою первую открытку ✨"
    },
    footer: {
      desc: "Самый красивый способ отправить цифровые поздравления вашим близким.",
      product: "Продукт",
      company: "Компания",
      legal: "Юридическая информация",
      rights: "© 2024 Wishyfy. Все права защищены."
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
      signup_title: "Присоединяйтесь к Wishyfy",
      signup_desc: "Начните создавать магические открытки сегодня",
      email: "Электронная почта",
      pass: "Password",
      name: "Полное имя",
      btn_login: "Войти",
      btn_signup: "Создать аккаунт",
      login_required: "Пожалуйста, войдите, чтобы сохранить Ваши открытки!"
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
      btn_unpublish: "Сделать приватной",
      change_password_title: "Изменить пароль",
      change_password_desc: "Обновите пароль вашего аккаунта для большей безопасности.",
      current_password: "Текущий пароль",
      new_password: "Новый пароль",
      confirm_password: "Подтвердите новый пароль",
      btn_change_password: "Обновить пароль",
      password_success: "Пароль успешно изменён!",
      password_mismatch: "Новые пароли не совпадают.",
      password_short: "Новый пароль должен содержать не менее 6 символов.",
      delete_modal: {
        title: "Удалить навсегда?",
        desc: "Эта магическая открытка будет удалена навсегда. Вы не сможете её восстановить.",
        btn_confirm: "Удалить навсегда",
        btn_cancel: "Отмена"
      }
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
      common: {
        back: "Назад",
        preview: "Превью",
        save: "Сохранить",
        saving: "Сохранение...",
        saved_success: "Открытка успешно сохранена!",
        go_to_cabinet: "Личный кабинет",
        go_to_saved: "Перейти к сохраненным",
        read_only_warn: "Опубликованную открытку редактировать нельзя",
        live_preview: "Предпросмотр",
        preview_sub: "Как это будет выглядеть...",
        music: "Музыка",
        basic_info: "Основная информация",
        no_seating: "Список гостей пуст",
        photos: "Фотографии",
        upload_limit: "Загрузите до 4-х фото",
        add: "Добавить",
        uploading: "Загрузка...",
        uploading_failed: "Загрузка не удалась",
        upload_error: "Ошибка при загрузке",
        change_song: "Сменить мотив ✨",
        find_melody: "Найдите свою мелодию",
        creative_mode: "Creative Mode",
        copy: "Копировать",
        copy_success: "Ссылка скопирована!"
      },
      birthday: {
        studio: "Студия Дня Рождения",
        title: "Заголовок",
        title_placeholder: "С днем рождения!",
        message: "Сообщение",
        message_placeholder: "Напишите ваше искреннее сообщение...",
        signature: "Подпись",
        signature_placeholder: "С любовью ❤️",
        magic_music: "Магический поиск музыки",
        gift_link: "Ссылка на подарок",
        gift_sub: "Добавьте кликабельный сюрприз",
        gift_placeholder: "https://example.com/gift..."
      },
      memory: {
        studio: "Студия памяти",
        main_heading: "Главный заголовок",
        heading_placeholder: "Введите заголовок...",
        galleries: "Галереи",
        add_gallery: "Добавить галерею",
        gallery_name: "Название галереи",
        gallery_placeholder: "Введите название галереи...",
        photos_count: "Фото",
        secure_memories: "Воспоминания под защитой",
        no_photos: "Фотографий пока нет",
        click_to_upload: "Нажмите, чтобы начать загрузку ваших моментов",
        add_photos: "Добавить фото",
        remove: "Удалить",
        limit_alert: "Максимум 25 фотографий в одной галерее!"
      },
      love: {
        studio: "Студия любовных писем",
        title: "Редактор писем",
        sub_title: "Создайте шедевр",
        who_is_for: "Для кого это?",
        message: "Сообщение",
        message_placeholder: "Выплесните свои чувства здесь...",
        final_wish: "Финальное желание",
        signature: "Ваша подпись",
        photo: "Ваше особое фото",
        upload_photo: "Загрузить",
        change_photo: "Изменить",
        locked: "Заблокировано",
        save_letter: "Сохранить ✨"
      }
    },
    music_search: {
      title: "Музыкальная библиотека ✨",
      sub: "Power of iTunes Search",
      placeholder: "Ищите песню или артиста...",
      no_results: "Ничего не найдено",
      start_typing: "Начните вводить текст для поиска",
      add: "Добавить ✨"
    }
  }
};
