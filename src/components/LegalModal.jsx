import { useLanguage } from '../context/LanguageContext';
import { createPortal } from 'react-dom';

export default function LegalModal({ isOpen, onClose, type }) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const content = {
    privacy: {
      ka: {
        title: 'კონფიდენციალურობის პოლიტიკა',
        sections: [
          {
            h: 'მონაცემთა შეგროვება',
            p: 'ჩვენ ვაგროვებთ მხოლოდ აუცილებელ ინფორმაციას თქვენი ანგარიშის შესაქმნელად: სახელი, გვარი და ელ-ფოსტა. ეს მონაცემები გამოიყენება თქვენი პერსონალიზებული ბარათების შესანახად და თქვენთან დასაკავშირებლად.'
          },
          {
            h: 'ბარათების შენახვა',
            p: 'თქვენს მიერ შექმნილი ყველა ბარათი და ატვირთული ფოტო ინახება უსაფრთხოდ ჩვენს სერვერებზე. ჩვენ ვიყენებთ თანამედროვე დაშიფვრის მეთოდებს თქვენი კონტენტის დასაცავად.'
          },
          {
            h: 'მესამე მხარე',
            p: 'Wishify არ ყიდის და არ გადასცემს თქვენს პერსონალურ ინფორმაციას მესამე პირებს. თქვენი მონაცემები გამოიყენება მხოლოდ სერვისის გაუმჯობესების მიზნით.'
          },
          {
            h: 'თქვენი უფლებები',
            p: 'თქვენ გაქვთ უფლება ნებისმიერ დროს მოითხოვოთ თქვენი მონაცემების წაშლა ან შეცვლა პროფილის პარამეტრებიდან.'
          }
        ]
      },
      en: {
        title: 'Privacy Policy',
        sections: [
          {
            h: 'Data Collection',
            p: 'We collect only essential information to create your account: first name, last name, and email. This data is used to store your personalized cards and communicate with you.'
          },
          {
            h: 'Card Storage',
            p: 'All cards created and photos uploaded by you are stored securely on our servers. We use modern encryption methods to protect your content.'
          },
          {
            h: 'Third Parties',
            p: 'Wishify does not sell or share your personal information with third parties. Your data is used solely for service improvement purposes.'
          },
          {
            h: 'Your Rights',
            p: 'You have the right to request the deletion or modification of your data at any time through your profile settings.'
          }
        ]
      },
      ru: {
        title: 'Политика конфиденциальности',
        sections: [
          {
            h: 'Сбор данных',
            p: 'Мы собираем только необходимую информацию для создания вашей учетной записи: имя, фамилия и адрес электронной почты. Эти данные используются для хранения ваших персонализированных открыток и связи с вами.'
          },
          {
            h: 'Хранение открыток',
            p: 'Все созданные вами открытки и загруженные фотографии надежно хранятся на наших серверах. Мы используем современные методы шифрования для защиты вашего контента.'
          },
          {
            h: 'Третьи лица',
            p: 'Wishify не продает и не передает вашу личную информацию третьим лицам. Ваши данные используются исключительно в целях улучшения сервиса.'
          },
          {
            h: 'Ваши права',
            p: 'Вы имеете право в любое время запросить удаление или изменение ваших данных через настройки профиля.'
          }
        ]
      }
    },
    terms: {
      ka: {
        title: 'მოხმარების წესები',
        sections: [
          {
            h: 'მომსახურების აღწერა',
            p: 'Wishify არის ციფრული მისალოცი ბარათების პლატფორმა, რომელიც გაძლევთ საშუალებას შექმნათ, დააპროგრამოთ და გააგზავნოთ ინტერაქტიული ბარათები.'
          },
          {
            h: 'ფასები და ანგარიშსწორება',
            p: 'თითოეული ბარათის გამოქვეყნების ღირებულებაა 20₾. ახალი მომხმარებლებისთვის პირველი ბარათის ფასი შეადგენს 10₾-ს (50% ფასდაკლება).'
          },
          {
            h: 'კონტენტის პასუხისმგებლობა',
            p: 'მომხმარებელი პასუხისმგებელია ბარათში ატვირთულ ტექსტსა და ფოტოებზე. აკრძალულია შეურაცხმყოფელი, ძალადობრივი ან არალეგალური შინაარსის გავრცელება.'
          },
          {
            h: 'სერვისის შეწყვეტა',
            p: 'ჩვენ ვიტოვებთ უფლებას შევუჩეროთ წვდომა მომხმარებელს, რომელიც არღვევს პლატფორმის წესებს ან იყენებს სერვისს მავნე მიზნებისთვის.'
          }
        ]
      },
      en: {
        title: 'Terms of Service',
        sections: [
          {
            h: 'Service Description',
            p: 'Wishify is a digital greeting card platform that allows you to create, schedule, and send interactive cards.'
          },
          {
            h: 'Pricing & Payments',
            p: 'The cost of publishing each card is 20₾. For new users, the price of the first card is 10₾ (50% discount).'
          },
          {
            h: 'Content Responsibility',
            p: 'Users are responsible for the text and photos uploaded in the cards. It is forbidden to distribute offensive, violent, or illegal content.'
          },
          {
            h: 'Service Termination',
            p: 'We reserve the right to suspend access for users who violate the platform rules or use the service for malicious purposes.'
          }
        ]
      },
      ru: {
        title: 'Условия использования',
        sections: [
          {
            h: 'Описание услуги',
            p: 'Wishify — это платформа цифровых поздравительных открыток, которая позволяет вам создавать, планировать и отправлять интерактивные открытки.'
          },
          {
            h: 'Цены и оплата',
            p: 'Стоимость публикации каждой открытки составляет 20₾. Для новых пользователей цена первой открытки составляет 10₾ (скидка 50%).'
          },
          {
            h: 'Ответственность за контент',
            p: 'Пользователи несут ответственность за текст и фотографии, загруженные в открытки. Запрещено распространять оскорбительный, насильственный или незаконный контент.'
          },
          {
            h: 'Прекращение обслуживания',
            p: 'Мы оставляем за собой право приостановить доступ пользователям, которые нарушают правила платформы или используют сервис в злонамеренных целях.'
          }
        ]
      }
    },
    howItWorks: {
      ka: {
        title: 'როგორ მუშაობს',
        sections: [
          {
            h: 'აარჩიეთ შაბლონი',
            p: 'დაათვალიერეთ ჩვენი მრავალფეროვანი კოლექცია და აირჩიეთ თქვენთვის სასურველი დიზაინი ნებისმიერი შემთხვევისთვის.'
          },
          {
            h: 'პერსონალიზაცია',
            p: 'შეცვალეთ ტექსტები, ატვირთეთ თქვენი საყვარელი ფოტოები და შეარჩიეთ მუსიკა განსაკუთრებული განწყობის შესაქმნელად.'
          },
          {
            h: 'შენახვა და გადახედვა',
            p: 'ნახეთ როგორ გამოიყურება თქვენი ბარათი რეალურ დროში და შეინახეთ ის თქვენს პროფილში შემდგომი რედაქტირებისთვის.'
          },
          {
            h: 'გაზიარება',
            p: 'მიიღეთ უნიკალური ბმული და გაუგზავნეთ ის ადრესატს ნებისმიერი სოციალური ქსელის ან ელ-ფოსტის საშუალებით.'
          }
        ]
      },
      en: {
        title: 'How it Works',
        sections: [
          {
            h: 'Choose a Template',
            p: 'Browse our diverse collection and choose the design that perfectly matches your occasion.'
          },
          {
            h: 'Personalize',
            p: 'Change the text, upload your favorite photos, and pick the music to set the right mood.'
          },
          {
            h: 'Save & Preview',
            p: 'See how your card looks in real-time and save it to your profile for further editing.'
          },
          {
            h: 'Share',
            p: 'Get a unique link and send it to your recipient via any social network or email.'
          }
        ]
      },
      ru: {
        title: 'Как это работает',
        sections: [
          {
            h: 'Выберите шаблон',
            p: 'Просмотрите нашу разнообразную коллекцию и выберите дизайн, который идеально подходит для вашего случая.'
          },
          {
            h: 'Персонализируйте',
            p: 'Изменяйте текст, загружайте любимые фотографии и выбирайте музыку для создания нужного настроения.'
          },
          {
            h: 'Сохранение и просмотр',
            p: 'Посмотрите, как ваша открытка выглядит в реальном времени, и сохраните ее в своем профиле для дальнейшего редактирования.'
          },
          {
            h: 'Поделитесь',
            p: 'Получите уникальную ссылку и отправьте ее получателю через любую социальную сеть или электронную почту.'
          }
        ]
      }
    }
  };

  const currentData = content[type]?.[language] || content[type]?.['en'];

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type === 'privacy' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-indigo-600'} flex items-center justify-center text-white shadow-lg`}>
              {type === 'privacy' ? '🛡️' : '📜'}
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {currentData?.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600 group cursor-pointer"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform">✕</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {currentData?.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-violet-200 rounded-full" />
                {section.h}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {section.p}
              </p>
            </div>
          ))}

          {/* Footer inside content */}
          <div className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400 text-center italic">
              {language === 'ka' ? 'ბოლოს განახლდა: 28 მარტი, 2026' : language === 'ru' ? 'Последнее обновление: 28 марта 2026 г.' : 'Last updated: March 28, 2026'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            {language === 'ka' ? 'გავიგე' : language === 'ru' ? 'Понятно' : 'Got it'}
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root'));
}
