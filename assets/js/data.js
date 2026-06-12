export const emergencyData = {
  tr: {
    title: "Acil Durum Nedir?",
    subtitle: "Doğru ilk yardım adımları için bir kategori seçin. Sakin kalın, PulseAid yanınızda.",
    backBtn: "Geri",
    nextBtn: "Sonraki Adım",
    prevBtn: "Önceki Adım",
    finishBtn: "Tamamlandı / Güvende",
    metronomeToggle: "Ritim Sesi (Metronom)",
    timerReset: "Sıfırla",
    timerStart: "Başlat",
    timerPause: "Durdur",
    activeRhythm: "Aktif Ritm",
    distanceTip: "Tavsiye: Telefonu yere koyun ve ses seviyesini açın. Yazılar uzaktan okunacak şekilde tasarlanmıştır.",
    cases: {
      bleeding: {
        title: "Kanama / Yaralanma",
        icon: "bleeding",
        description: "Açık yaralar, uzuv kesikleri ve ciddi kanamalar için acil müdahale.",
        question: "Kanama fışkırma/atım şeklinde mi, yoksa yavaş sızıntı şeklinde mi?",
        options: {
          spurting: {
            label: "Fışkırıyor / Ciddi Kanama",
            steps: [
              {
                text: "Yaraya doğrudan, temiz bir bezle iki elinizle sertçe bastırın! Baskıyı asla gevşetmeyin.",
                animation: "pressure-pulse",
                rate: 105
              },
              {
                text: "Kanayan bölgeyi mümkünse kalp seviyesinin üzerine kaldırın. Baskı uygulamaya devam edin.",
                animation: "elevation-pulse",
                rate: 105
              },
              {
                text: "Kanama durmazsa ve uzuvda ise, yaranın 5-7 cm üzerine turnike uygulayın. Sıkma çubuğunu kanama durana kadar döndürün.",
                animation: "tourniquet-tighten"
              }
            ]
          },
          oozing: {
            label: "Sızıntı / Yavaş Akıyor",
            steps: [
              {
                text: "Yarayı temiz, ılık akan su altında en az 2-3 dakika yıkayarak kirlerden arındırın.",
                animation: "wash-rinse"
              },
              {
                text: "Steril bir gazlı bez veya temiz bir bezle yarayı kapatın.",
                animation: "bandage-apply"
              },
              {
                text: "Yaraya hafif baskı uygulayarak bandajı sabitleyin. Enfeksiyon riskini izleyin.",
                animation: "pressure-pulse"
              }
            ]
          }
        }
      },
      choking: {
        title: "Boğulma / Nefes Darlığı",
        icon: "choking",
        description: "Yabancı cisim kaçması, solunum tıkanıklığı ve nefes alamama durumları.",
        question: "Kişi kısmen öksürebiliyor mu veya konuşabiliyor mu (Bilinci açık mı)?",
        options: {
          conscious: {
            label: "Öksürüyor / Konuşuyor (Kısmi)",
            steps: [
              {
                text: "Kişiyi öksürmeye teşvik edin. Sırtına vurmayın! Öksürmek en doğal refleks ve temizleyicidir.",
                animation: "cough-encourage"
              },
              {
                text: "Eğer öksüremiyorsa: Kişiyi öne eğin, kürek kemikleri arasına elinizin ayasıyla 5 kez sertçe vurun.",
                animation: "back-blows",
                rate: 60
              },
              {
                text: "Yabancı cisim çıkmadıysa: Arkasına geçip göbek deliğinin hemen üzerine elinizi yumruk yapıp koyun, yukarı ve içeri doğru 5 kez bastırın (Heimlich Manevrası).",
                animation: "heimlich-maneuver",
                rate: 60
              }
            ]
          },
          unconscious: {
            label: "Konuşamıyor / Bilinç Kapalı (Tam)",
            steps: [
              {
                text: "Hemen Acil Servisi (112) arayın veya birine aratın! Hoparlörü açın.",
                animation: "call-emergency"
              },
              {
                text: "Kişiyi sert bir zemine sırtüstü yatırın. Ağzında görünür bir cisim varsa nazikçe parmağınızla alın. Körlemesine parmak sokmayın.",
                animation: "lay-flat"
              },
              {
                text: "Temel Yaşam Desteğine (CPR) başlayın: 30 Göğüs Basısı uygulayın (dakikada 100-120 hızında).",
                animation: "cpr-compressions",
                rate: 105
              }
            ]
          }
        }
      },
      burns: {
        title: "Yanık / Haşlanma",
        icon: "burns",
        description: "Alev, sıcak su, elektrik veya kimyasal maddelerin neden olduğu doku hasarları.",
        question: "Yanığa neden olan unsur nedir? Isı / Sıcak sıvı mı, yoksa Kimyasal madde mi?",
        options: {
          heat: {
            label: "Isı / Alev / Sıcak Su",
            steps: [
              {
                text: "Yanık bölgeyi en az 10 dakika akan soğuk (buz gibi olmayan, ılık-soğuk) musluk suyu altında tutun.",
                animation: "wash-rinse",
                timer: 600
              },
              {
                text: "Yüzük, saat, bilezik gibi takıları ödem oluşmadan nazikçe çıkarın. Deriye yapışmış elbiseleri zorla çekmeyin, etrafından kesin.",
                animation: "remove-jewelry"
              },
              {
                text: "Yanık bölgesini temiz bir streç filmle veya nemli steril bezle gevşekçe kapatın. Krem, diş macunu veya salça sürmeyin!",
                animation: "bandage-apply"
              }
            ]
          },
          chemical: {
            label: "Kimyasal Madde",
            steps: [
              {
                text: "Kendi güvenliğinizi sağlayın (eldiven takın). Kimyasal bulaşmış kıyafetleri makasla keserek hızlıca vücuttan uzaklaştırın.",
                animation: "remove-clothing"
              },
              {
                text: "Kimyasal bulaşan alanı en az 20 dakika boyunca bol, tazyiksiz akan su ile yıkayın.",
                animation: "wash-rinse",
                timer: 1200
              },
              {
                text: "Göz etkilenmişse, temiz gözü koruyarak, etkilenen gözü burun köprüsünden dışa doğru bol suyla en az 20 dakika yıkayın.",
                animation: "eye-rinse",
                timer: 1200
              }
            ]
          }
        }
      },
      heart_attack: {
        title: "Kalp Krizi / Bilinç Kaybı",
        icon: "heart_attack",
        description: "Göğüs ağrısı, bayılma, kalp durması durumlarında hızlı reanimasyon rehberi.",
        question: "Hasta sesli uyarılara yanıt veriyor mu ve normal nefes alıyor mu?",
        options: {
          breathing: {
            label: "Yanıt Yok ama Nefes Alıyor",
            steps: [
              {
                text: "Hemen Acil Servisi (112) arayın. Hoparlörü açıp hastanın yanına koyun.",
                animation: "call-emergency"
              },
              {
                text: "Hastayı yarı yüzüstü yan yatış pozisyonuna (Kurtarma / İyileşme Pozisyonu) getirin.",
                animation: "recovery-position"
              },
              {
                text: "Ambulans gelene kadar solunumu 2 dakikada bir kontrol edin. Sıcak tutun.",
                animation: "monitor-pulse"
              }
            ]
          },
          not_breathing: {
            label: "Yanıt Yok ve Nefes Almıyor",
            steps: [
              {
                text: "Hemen Acil Servisi (112) arayın ve çevrede varsa Elektroşok Cihazı (OED) getirtilmesini sağlayın.",
                animation: "call-emergency"
              },
              {
                text: "Hemen Kalp Masajına başlayın: Göğüs kemiğinin ortasına iki elinizi kenetleyerek yerleştirin ve metronom ritminde dakikada 100-120 hızda sertçe basın (5-6 cm çökecek şekilde).",
                animation: "cpr-compressions",
                rate: 105
              },
              {
                text: "30 kalp masajından sonra hastanın başını geri itip çenesini kaldırarak 2 kez suni solunum verin. 30 masaj - 2 solunum olarak devam edin.",
                animation: "rescue-breaths",
                rate: 105
              }
            ]
          }
        }
      }
    }
  },
  en: {
    title: "What is the Emergency?",
    subtitle: "Select a category for immediate first-aid guidance. Stay calm, PulseAid is with you.",
    backBtn: "Back",
    nextBtn: "Next Step",
    prevBtn: "Previous Step",
    finishBtn: "Completed / Safe",
    metronomeToggle: "Rhythm Audio (Metronome)",
    timerReset: "Reset",
    timerStart: "Start",
    timerPause: "Pause",
    activeRhythm: "Active Rhythm",
    distanceTip: "Tip: Place your phone on the ground and turn up the volume. The UI is designed for far-distance readability.",
    cases: {
      bleeding: {
        title: "Bleeding / Injury",
        icon: "bleeding",
        description: "Urgent response for open wounds, severe lacerations, and heavy bleeding.",
        question: "Is the bleeding spurting (arterial) or slowly oozing?",
        options: {
          spurting: {
            label: "Spurting / Heavy Bleeding",
            steps: [
              {
                text: "Apply firm, direct pressure on the wound with a clean cloth using both hands! Never release pressure.",
                animation: "pressure-pulse",
                rate: 105
              },
              {
                text: "Elevate the bleeding limb above the heart level if possible. Maintain direct pressure.",
                animation: "elevation-pulse",
                rate: 105
              },
              {
                text: "If bleeding continues and is on a limb, apply a tourniquet 2-3 inches above the wound. Turn the windlass until bleeding stops.",
                animation: "tourniquet-tighten"
              }
            ]
          },
          oozing: {
            label: "Oozing / Slow Flow",
            steps: [
              {
                text: "Wash the wound under clean, running lukewarm water for 2-3 minutes to remove dirt.",
                animation: "wash-rinse"
              },
              {
                text: "Cover the wound with a sterile gauze dressing or clean cloth.",
                animation: "bandage-apply"
              },
              {
                text: "Apply gentle pressure to secure the bandage. Monitor for infection.",
                animation: "pressure-pulse"
              }
            ]
          }
        }
      },
      choking: {
        title: "Choking / Suffocation",
        icon: "choking",
        description: "Foreign body airway obstruction and breathing emergencies.",
        question: "Is the person able to cough or speak partially (Conscious)?",
        options: {
          conscious: {
            label: "Coughing / Speaking (Partial)",
            steps: [
              {
                text: "Encourage them to cough. Do NOT hit their back if they are coughing! Coughing is the most effective way to clear the airway.",
                animation: "cough-encourage"
              },
              {
                text: "If they stop coughing: Lean them forward, deliver 5 sharp back blows between the shoulder blades with the heel of your hand.",
                animation: "back-blows",
                rate: 60
              },
              {
                text: "If object remains: Stand behind them, wrap your arms around waist, make a fist above navel, and give 5 quick upward & inward thrusts (Heimlich Maneuver).",
                animation: "heimlich-maneuver",
                rate: 60
              }
            ]
          },
          unconscious: {
            label: "Unable to Speak / Unconscious (Total)",
            steps: [
              {
                text: "Call Emergency Services (911/112) immediately! Turn on speakerphone and place it near you.",
                animation: "call-emergency"
              },
              {
                text: "Lay the person flat on their back on a firm surface. If an object is clearly visible in the mouth, gently sweep it out. Do not perform blind sweeps.",
                animation: "lay-flat"
              },
              {
                text: "Start CPR immediately: Perform 30 chest compressions (synchronized with the metronome at 100-120 BPM).",
                animation: "cpr-compressions",
                rate: 105
              }
            ]
          }
        }
      },
      burns: {
        title: "Burns / Scalds",
        icon: "burns",
        description: "Tissue damage caused by heat, hot liquids, electricity, or chemical agents.",
        question: "What caused the burn? Heat / Hot liquid / Flame, or a Chemical substance?",
        options: {
          heat: {
            label: "Heat / Flame / Hot Liquid",
            steps: [
              {
                text: "Hold the burned area under cool running tap water (not ice cold) for at least 10 minutes.",
                animation: "wash-rinse",
                timer: 600
              },
              {
                text: "Gently remove rings, watches, or bracelets before swelling starts. Do NOT peel away clothing stuck to the skin; cut around it.",
                animation: "remove-jewelry"
              },
              {
                text: "Cover the burn loosely with clean plastic wrap or a damp sterile cloth. Do NOT apply cream, ointment, toothpaste, or butter!",
                animation: "bandage-apply"
              }
            ]
          },
          chemical: {
            label: "Chemical Substance",
            steps: [
              {
                text: "Ensure your own safety (wear gloves). Quickly remove clothing contaminated with the chemical by cutting it away.",
                animation: "remove-clothing"
              },
              {
                text: "Flush the affected area with large amounts of gently running tap water for at least 20 minutes.",
                animation: "wash-rinse",
                timer: 1200
              },
              {
                text: "If eyes are affected, flush from the nose bridge outwards with plenty of water for at least 20 minutes.",
                animation: "eye-rinse",
                timer: 1200
              }
            ]
          }
        }
      },
      heart_attack: {
        title: "Heart Attack / Unconsciousness",
        icon: "heart_attack",
        description: "Chest pain, fainting, cardiac arrest. Quick guide for CPR and emergency response.",
        question: "Is the person responsive to verbal cues and breathing normally?",
        options: {
          breathing: {
            label: "Unresponsive but Breathing",
            steps: [
              {
                text: "Call Emergency Services (911/112) immediately. Set phone on speaker near the patient.",
                animation: "call-emergency"
              },
              {
                text: "Roll the patient onto their side into the semi-prone recovery position to keep the airway open.",
                animation: "recovery-position"
              },
              {
                text: "Regularly check breathing every 2 minutes. Keep them warm and wait for the ambulance.",
                animation: "monitor-pulse"
              }
            ]
          },
          not_breathing: {
            label: "Unresponsive and Not Breathing",
            steps: [
              {
                text: "Call Emergency Services (911/112) immediately and secure an Automated External Defibrillator (AED) if available nearby.",
                animation: "call-emergency"
              },
              {
                text: "Start chest compressions immediately: Place hands in the center of the chest and press down firmly (5-6 cm) at a rate of 100-120 compressions per minute.",
                animation: "cpr-compressions",
                rate: 105
              },
              {
                text: "After 30 chest compressions, tilt the head back, lift the chin, and give 2 rescue breaths. Repeat cycles of 30 compressions and 2 breaths.",
                animation: "rescue-breaths",
                rate: 105
              }
            ]
          }
        }
      }
    }
  }
};
