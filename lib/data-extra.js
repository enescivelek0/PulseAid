// Additional emergency scenarios (merged into emergencyData in lib/content.ts).
// Content follows general ERC / AHA / Red Cross lay-rescuer first-aid guidance.

export const extraCases = {
  tr: {
    stroke: {
      title: "İnme (Felç)",
      icon: "stroke",
      description: "Yüzde kayma, kolda güçsüzlük, konuşma bozukluğu gibi ani beyin damar tıkanıklığı belirtileri.",
      question: "Kişinin bilinci açık mı ve size tepki veriyor mu?",
      options: {
        conscious: {
          label: "Bilinci Açık",
          steps: [
            {
              text: "HYKS testi yapın: Yüz – gülümsemesini isteyin, bir taraf düşük mü? Kol – iki kolunu kaldırsın, biri düşüyor mu? Konuşma – basit bir cümleyi tekrarlayabiliyor mu?",
              animation: "fast-face"
            },
            {
              text: "Belirtilerden biri bile varsa hemen 112'yi arayın ve 'inme şüphesi' deyin. Belirtilerin başladığı saati mutlaka not edin.",
              animation: "call-emergency"
            },
            {
              text: "Kişiyi başı ve omuzları hafif yükseltilmiş şekilde rahatça yatırın. Yiyecek, içecek veya ilaç (aspirin dahil) vermeyin.",
              animation: "lay-flat"
            },
            {
              text: "Ekip gelene kadar yanından ayrılmayın, konuşarak sakinleştirin. Bilinci kapanırsa nefesini kontrol edin.",
              animation: "monitor-pulse"
            }
          ]
        },
        unconscious: {
          label: "Bilinç Kapalı / Tepkisiz",
          steps: [
            {
              text: "Hemen 112'yi arayın veya birine aratın. Hoparlörü açın.",
              animation: "call-emergency"
            },
            {
              text: "Başını geriye itip çenesini kaldırın ve 10 saniye boyunca normal nefes alıp almadığına bakın.",
              animation: "monitor-pulse"
            },
            {
              text: "Nefes alıyorsa yan yatırın (derlenme pozisyonu) ve nefesini sürekli izleyin. Nefes almıyorsa hemen kalp masajına başlayın.",
              animation: "recovery-position"
            }
          ]
        }
      }
    },
    seizure: {
      title: "Nöbet / Epilepsi",
      icon: "seizure",
      description: "Bilinç kaybıyla birlikte istemsiz kasılmalar, titremeler ve sarsılmalar.",
      question: "Kasılmalar şu anda devam ediyor mu?",
      options: {
        active: {
          label: "Evet, Kasılmalar Sürüyor",
          steps: [
            {
              text: "Sakin kalın. Çevredeki sert ve keskin eşyaları uzaklaştırın, başının altına yumuşak bir şey (ceket, yastık) koyun.",
              animation: "protect-head"
            },
            {
              text: "Kişiyi tutmaya veya kasılmaları durdurmaya çalışmayın. Ağzına kesinlikle hiçbir şey sokmayın, dil yutulmaz.",
              animation: "stop-sign"
            },
            {
              text: "Nöbetin süresini ölçün. 5 dakikadan uzun sürerse, ardı ardına tekrarlarsa veya kişi yaralandıysa hemen 112'yi arayın.",
              animation: "monitor-pulse",
              timer: 300
            }
          ]
        },
        ended: {
          label: "Hayır, Nöbet Bitti",
          steps: [
            {
              text: "Kişiyi yan yatırın (derlenme pozisyonu) ve hava yolunun açık kaldığından emin olun.",
              animation: "recovery-position"
            },
            {
              text: "Nefesini kontrol edin. Normal nefes almıyorsa 112'yi arayın ve kalp masajına başlayın.",
              animation: "monitor-pulse"
            },
            {
              text: "Tamamen kendine gelene kadar yanında kalın, yiyecek-içecek vermeyin. İlk nöbetiyse, yaralandıysa, hamileyse veya suda olduysa 112'yi arayın.",
              animation: "call-emergency"
            }
          ]
        }
      }
    },
    allergy: {
      title: "Ciddi Alerji (Anafilaksi)",
      icon: "allergy",
      description: "Arı sokması, gıda veya ilaç sonrası ani şişlik, nefes darlığı ve döküntü.",
      question: "Nefes darlığı, dilde/boğazda şişlik, hırıltı veya baygınlık var mı?",
      options: {
        severe: {
          label: "Evet, Ciddi Belirtiler",
          steps: [
            {
              text: "Hemen 112'yi arayın ve 'anafilaksi' deyin.",
              animation: "call-emergency"
            },
            {
              text: "Kişinin adrenalin oto-enjektörü (kalem) varsa hemen uyluğun dış yan yüzüne, gerekirse kıyafetin üzerinden uygulayın ve birkaç saniye bastırarak tutun.",
              animation: "epipen"
            },
            {
              text: "Nefes almakta zorlanıyorsa oturtun. Baş dönmesi veya baygınlık varsa sırtüstü yatırıp bacaklarını kaldırın. Aniden ayağa kaldırmayın.",
              animation: "elevation-pulse"
            },
            {
              text: "5 dakikada düzelme yoksa ve ikinci bir oto-enjektör varsa tekrarlayın. Bilinci kapanır ve nefes almazsa kalp masajına başlayın.",
              animation: "epipen",
              timer: 300
            }
          ]
        },
        mild: {
          label: "Hayır, Sadece Kaşıntı / Kızarıklık",
          steps: [
            {
              text: "Alerjeni uzaklaştırın: Arı iğnesini kart gibi düz bir cisimle kazıyarak çıkarın, temas varsa bölgeyi bol suyla yıkayın.",
              animation: "wash-rinse"
            },
            {
              text: "Kişinin doktorunun önerdiği alerji ilacı (antihistaminik) varsa kullanmasına yardım edin.",
              animation: "monitor-pulse"
            },
            {
              text: "En az 30 dakika belirtileri izleyin. Nefes darlığı, yüzde/dudakta şişlik başlarsa hemen 112'yi arayın.",
              animation: "monitor-pulse",
              timer: 1800
            }
          ]
        }
      }
    },
    fracture: {
      title: "Kırık / Burkulma",
      icon: "fracture",
      description: "Düşme veya darbe sonrası şiddetli ağrı, şişlik, şekil bozukluğu ve hareket kısıtlılığı.",
      question: "Yarada kemik görünüyor mu veya açık bir yara var mı?",
      options: {
        open: {
          label: "Evet, Açık Kırık / Yara",
          steps: [
            {
              text: "Kemiği asla geri itmeye çalışmayın. Yaranın çevresine temiz bir bezle bastırarak kanamayı kontrol edin, kemiğin üzerine bastırmayın.",
              animation: "pressure-pulse"
            },
            {
              text: "Yarayı steril gazlı bez veya temiz bir bezle örtün.",
              animation: "bandage-apply"
            },
            {
              text: "Uzvu bulunduğu pozisyonda sabitleyin ve 112'yi arayın. Soluk, soğuk-terli cilt gibi şok belirtilerine dikkat edin.",
              animation: "splint"
            }
          ]
        },
        closed: {
          label: "Hayır, Kapalı (Şişlik, Ağrı)",
          steps: [
            {
              text: "Yaralı bölgeyi hareket ettirmeyin, düzeltmeye çalışmayın. Bulunduğu pozisyonda elinizle destekleyin.",
              animation: "splint"
            },
            {
              text: "Atel, katlanmış gazete veya sarılmış bir havluyla üstteki ve alttaki eklemleri de içine alacak şekilde sabitleyin.",
              animation: "splint"
            },
            {
              text: "Bir beze sarılmış buzu en fazla 20 dakika uygulayın. Buzu doğrudan cilde koymayın.",
              animation: "cool-down",
              timer: 1200
            },
            {
              text: "Boyun, sırt veya kalça yaralanması şüphesinde kişiyi hiç hareket ettirmeyin ve 112'yi arayın.",
              animation: "call-emergency"
            }
          ]
        }
      }
    },
    poisoning: {
      title: "Zehirlenme",
      icon: "poisoning",
      description: "İlaç, kimyasal, temizlik ürünü yutma veya karbonmonoksit gibi gaz soluma.",
      question: "Zehir nasıl alındı: Yutarak mı, yoksa gaz/duman soluyarak mı?",
      options: {
        swallowed: {
          label: "Yutarak (İlaç, Kimyasal)",
          steps: [
            {
              text: "Kişiyi kusturmaya çalışmayın! Ağzında kalan madde varsa tükürtün. Süt veya su içirmeyin.",
              animation: "stop-sign"
            },
            {
              text: "Ulusal Zehir Danışma Merkezi 114'ü veya 112'yi arayın. Ürünün kutusunu/etiketini ve ne kadar alındığını hazır tutun.",
              animation: "call-emergency"
            },
            {
              text: "Bilinci kapalı ve nefes alıyorsa yan yatırın. Nefes almıyorsa kalp masajına başlayın; ağzında kimyasal varsa ağızdan ağıza solunum yapmayın.",
              animation: "recovery-position"
            }
          ]
        },
        inhaled: {
          label: "Soluyarak (Gaz, Duman)",
          steps: [
            {
              text: "Önce kendi güvenliğinizi sağlayın. Ortam güvenli değilse içeri girmeyin; mümkünse kapı ve pencereleri açın.",
              animation: "fresh-air"
            },
            {
              text: "Kişiyi hemen temiz havaya çıkarın ve 112'yi arayın.",
              animation: "call-emergency"
            },
            {
              text: "Bilinci kapalı ve nefes alıyorsa yan yatırın, nefesini izleyin. Nefes almıyorsa kalp masajına başlayın.",
              animation: "recovery-position"
            }
          ]
        }
      }
    },
    heatstroke: {
      title: "Sıcak Çarpması",
      icon: "heat",
      description: "Aşırı sıcakta yüksek ateş, baş dönmesi, bilinç bulanıklığı ve sıcak/kuru cilt.",
      question: "Kişinin bilinci yerinde mi? Size mantıklı cevaplar veriyor mu?",
      options: {
        confused: {
          label: "Bilinç Bulanık / Tepkisiz",
          steps: [
            {
              text: "Hayati tehlike! Hemen 112'yi arayın.",
              animation: "call-emergency"
            },
            {
              text: "Kişiyi serin ve gölge bir yere taşıyın, fazla kıyafetlerini çıkarın.",
              animation: "remove-clothing"
            },
            {
              text: "Hemen soğutmaya başlayın: Vücudunu soğuk suyla ıslatın, boyun, koltuk altı ve kasıklara soğuk kompres koyun, yelpazeleyin. Bilinci bulanıksa su içirmeyin.",
              animation: "cool-down"
            }
          ]
        },
        alert: {
          label: "Bilinçli – Halsiz, Terli",
          steps: [
            {
              text: "Kişiyi serin bir yere götürün, uzandırın ve bacaklarını hafifçe yükseltin.",
              animation: "lay-flat"
            },
            {
              text: "Su veya elektrolitli bir içeceği yudum yudum içirin. Islak bezlerle ve yelpazeleyerek cildini serinletin.",
              animation: "cool-down"
            },
            {
              text: "30 dakika boyunca izleyin. Düzelme yoksa, kusma veya bilinç bulanıklığı başlarsa hemen 112'yi arayın.",
              animation: "monitor-pulse",
              timer: 1800
            }
          ]
        }
      }
    }
  },

  en: {
    stroke: {
      title: "Stroke",
      icon: "stroke",
      description: "Sudden face drooping, arm weakness or slurred speech caused by a blocked brain artery.",
      question: "Is the person conscious and responding to you?",
      options: {
        conscious: {
          label: "Conscious",
          steps: [
            {
              text: "Do the FAST check: Face – ask them to smile, does one side droop? Arms – can they raise both arms, does one drift down? Speech – can they repeat a simple sentence?",
              animation: "fast-face"
            },
            {
              text: "If any sign is present, call emergency services now and say 'suspected stroke'. Note the exact time the symptoms started.",
              animation: "call-emergency"
            },
            {
              text: "Let them rest with head and shoulders slightly raised. Do not give food, drink or medication (including aspirin).",
              animation: "lay-flat"
            },
            {
              text: "Stay with them and keep them calm until help arrives. If they become unresponsive, check their breathing.",
              animation: "monitor-pulse"
            }
          ]
        },
        unconscious: {
          label: "Unconscious / Unresponsive",
          steps: [
            {
              text: "Call emergency services immediately or have someone call. Put the phone on speaker.",
              animation: "call-emergency"
            },
            {
              text: "Tilt the head back, lift the chin and check for normal breathing for up to 10 seconds.",
              animation: "monitor-pulse"
            },
            {
              text: "If breathing, place them in the recovery position and keep monitoring. If not breathing, start chest compressions immediately.",
              animation: "recovery-position"
            }
          ]
        }
      }
    },
    seizure: {
      title: "Seizure / Epilepsy",
      icon: "seizure",
      description: "Loss of consciousness with involuntary jerking, stiffening or shaking.",
      question: "Is the person still convulsing right now?",
      options: {
        active: {
          label: "Yes, Still Convulsing",
          steps: [
            {
              text: "Stay calm. Move hard or sharp objects away and place something soft (a jacket, a pillow) under their head.",
              animation: "protect-head"
            },
            {
              text: "Do not hold them down or try to stop the movements. Never put anything in their mouth – they cannot swallow their tongue.",
              animation: "stop-sign"
            },
            {
              text: "Time the seizure. Call emergency services if it lasts longer than 5 minutes, repeats, or the person is injured.",
              animation: "monitor-pulse",
              timer: 300
            }
          ]
        },
        ended: {
          label: "No, It Has Stopped",
          steps: [
            {
              text: "Roll them onto their side into the recovery position and make sure the airway stays open.",
              animation: "recovery-position"
            },
            {
              text: "Check their breathing. If they are not breathing normally, call emergency services and start chest compressions.",
              animation: "monitor-pulse"
            },
            {
              text: "Stay until they are fully alert; give no food or drink. Call emergency services if it was a first seizure, they are injured, pregnant, or it happened in water.",
              animation: "call-emergency"
            }
          ]
        }
      }
    },
    allergy: {
      title: "Severe Allergy (Anaphylaxis)",
      icon: "allergy",
      description: "Sudden swelling, breathing difficulty and rash after a sting, food or medication.",
      question: "Is there difficulty breathing, swelling of the tongue/throat, wheezing or fainting?",
      options: {
        severe: {
          label: "Yes, Severe Symptoms",
          steps: [
            {
              text: "Call emergency services now and say 'anaphylaxis'.",
              animation: "call-emergency"
            },
            {
              text: "If they have an adrenaline auto-injector (pen), use it immediately on the outer thigh – through clothing if needed – and hold it in place for a few seconds.",
              animation: "epipen"
            },
            {
              text: "If breathing is difficult, let them sit up. If dizzy or faint, lay them flat and raise their legs. Do not let them stand up suddenly.",
              animation: "elevation-pulse"
            },
            {
              text: "If there is no improvement after 5 minutes and a second auto-injector is available, give it. If they stop breathing, start chest compressions.",
              animation: "epipen",
              timer: 300
            }
          ]
        },
        mild: {
          label: "No, Only Itching / Rash",
          steps: [
            {
              text: "Remove the allergen: scrape a bee stinger out with a flat edge like a card, and rinse any skin contact with plenty of water.",
              animation: "wash-rinse"
            },
            {
              text: "If they have an antihistamine recommended by their doctor, help them take it.",
              animation: "monitor-pulse"
            },
            {
              text: "Monitor for at least 30 minutes. If breathing difficulty or swelling of the face/lips starts, call emergency services immediately.",
              animation: "monitor-pulse",
              timer: 1800
            }
          ]
        }
      }
    },
    fracture: {
      title: "Fracture / Sprain",
      icon: "fracture",
      description: "Severe pain, swelling, deformity and limited movement after a fall or impact.",
      question: "Is bone visible or is there an open wound?",
      options: {
        open: {
          label: "Yes, Open Fracture / Wound",
          steps: [
            {
              text: "Never push the bone back in. Control bleeding by pressing a clean cloth around the wound – not directly on the bone.",
              animation: "pressure-pulse"
            },
            {
              text: "Cover the wound with a sterile dressing or a clean cloth.",
              animation: "bandage-apply"
            },
            {
              text: "Keep the limb still in the position found and call emergency services. Watch for signs of shock: pale, cold, sweaty skin.",
              animation: "splint"
            }
          ]
        },
        closed: {
          label: "No, Closed (Swelling, Pain)",
          steps: [
            {
              text: "Do not move or try to straighten the injured part. Support it with your hands in the position found.",
              animation: "splint"
            },
            {
              text: "Immobilize it with a splint, rolled newspaper or a folded towel, including the joints above and below the injury.",
              animation: "splint"
            },
            {
              text: "Apply ice wrapped in a cloth for up to 20 minutes. Never put ice directly on the skin.",
              animation: "cool-down",
              timer: 1200
            },
            {
              text: "If a neck, back or hip injury is suspected, do not move the person at all and call emergency services.",
              animation: "call-emergency"
            }
          ]
        }
      }
    },
    poisoning: {
      title: "Poisoning",
      icon: "poisoning",
      description: "Swallowed medication, chemicals or cleaning products, or inhaled gases like carbon monoxide.",
      question: "How was the poison taken: swallowed, or inhaled as gas/smoke?",
      options: {
        swallowed: {
          label: "Swallowed (Medication, Chemical)",
          steps: [
            {
              text: "Do not make them vomit! Have them spit out anything left in the mouth. Do not give milk or water.",
              animation: "stop-sign"
            },
            {
              text: "Call your local poison control center or emergency services. Keep the product's container/label and the amount taken at hand.",
              animation: "call-emergency"
            },
            {
              text: "If unconscious but breathing, place them on their side. If not breathing, start chest compressions; avoid mouth-to-mouth if there are chemicals around the mouth.",
              animation: "recovery-position"
            }
          ]
        },
        inhaled: {
          label: "Inhaled (Gas, Smoke)",
          steps: [
            {
              text: "Protect yourself first. Do not enter if the area is unsafe; open doors and windows if possible.",
              animation: "fresh-air"
            },
            {
              text: "Move the person to fresh air immediately and call emergency services.",
              animation: "call-emergency"
            },
            {
              text: "If unconscious but breathing, place them on their side and monitor breathing. If not breathing, start chest compressions.",
              animation: "recovery-position"
            }
          ]
        }
      }
    },
    heatstroke: {
      title: "Heatstroke",
      icon: "heat",
      description: "High body temperature, dizziness, confusion and hot skin after heat exposure.",
      question: "Is the person alert and giving sensible answers?",
      options: {
        confused: {
          label: "Confused / Unresponsive",
          steps: [
            {
              text: "Life-threatening! Call emergency services immediately.",
              animation: "call-emergency"
            },
            {
              text: "Move them to a cool, shaded place and remove excess clothing.",
              animation: "remove-clothing"
            },
            {
              text: "Cool them down right away: soak the body with cold water, put cold packs on the neck, armpits and groin, and fan them. Do not give drinks if confused.",
              animation: "cool-down"
            }
          ]
        },
        alert: {
          label: "Alert – Weak, Sweaty",
          steps: [
            {
              text: "Move them somewhere cool, lay them down and raise their legs slightly.",
              animation: "lay-flat"
            },
            {
              text: "Give water or an electrolyte drink in small sips. Cool the skin with wet cloths and fanning.",
              animation: "cool-down"
            },
            {
              text: "Monitor for 30 minutes. Call emergency services if there is no improvement, or if vomiting or confusion starts.",
              animation: "monitor-pulse",
              timer: 1800
            }
          ]
        }
      }
    }
  }
};
