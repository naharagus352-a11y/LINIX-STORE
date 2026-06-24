import { Product, Testimonial, FAQItem } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'fake-lag',
    category: 'gaming',
    iconName: 'Zap',
    badge: 'FREE / VIP',
    rating: 4.9,
    salesCount: '1.4k+',
    hasTiers: true,
    selectedTierIndex: 0,
    tiers: [
      { name: 'FREE Tier', price: 0, badge: 'Standard' },
      { name: 'VIP Tier', price: 20000, badge: 'Premium Speed' }
    ],
    price: 0,
    idTranslations: {
      name: 'Fake Lag Optimizer',
      tagline: 'Solusi Latency & Kestabilan Ping Game',
      description: 'Kurangi latency, optimalkan kestabilan ping, dan menangkan game dengan fitur anti-lag tercanggih.',
      features: [
        'Optimasi jaringan real-time untuk game MOBA & FPS',
        'Stabilisasi koneksi dari ping loncat (jitter reduction)',
        'Meningkatkan performa jaringan tanpa lag saat pertempuran intens',
        'Metode aman, tanpa risiko banned akun game'
      ],
      specs: [
        { label: 'Kompatibilitas', value: 'Android 7.0 & Up' },
        { label: 'Ukuran File', value: '4.5 MB' },
        { label: 'Status Root', value: 'Tidak Butuh Root' },
        { label: 'Versi', value: 'v2.8' }
      ]
    },
    enTranslations: {
      name: 'Fake Lag Optimizer',
      tagline: 'The Ultimate Gaming Latency & Ping Stabilizer',
      description: 'Reduce latency, optimize ping stability, and dominate games with the most advanced anti-lag features.',
      features: [
        'Real-time network optimization for MOBA & FPS games',
        'Stabilizes ping spikes and reduces connection jitter',
        'Improves packet handling for fluid gaming performance',
        '100% Safe, zero risk of account bans'
      ],
      specs: [
        { label: 'Compatibility', value: 'Android 7.0 & Up' },
        { label: 'File Size', value: '4.5 MB' },
        { label: 'Root Status', value: 'No Root Required' },
        { label: 'Version', value: 'v2.8' }
      ]
    }
  },
  {
    id: 'apk-bioskop-no-vip',
    category: 'entertainment',
    iconName: 'Film',
    badge: 'NO VIP ADS',
    rating: 4.7,
    salesCount: '950+',
    price: 10000,
    idTranslations: {
      name: 'APK Bioskop (No VIP)',
      tagline: 'Nonton Film HD Tanpa Gangguan Iklan',
      description: 'Nonton film bioskop terupdate dan serial TV favorit tanpa gangguan iklan dengan kualitas HD terbaik.',
      features: [
        'Streaming lancar tanpa buffering',
        'Tanpa iklan pop-up yang mengganggu',
        'Subtitle Indonesia otomatis',
        'Katalog film terupdate setiap hari'
      ],
      specs: [
        { label: 'Kompatibilitas', value: 'Android 5.0 / Smart TV' },
        { label: 'Ukuran File', value: '18 MB' },
        { label: 'Kualitas Video', value: 'HD / Full HD' },
        { label: 'Bahasa', value: 'Multi-bahasa & Indo Sub' }
      ]
    },
    enTranslations: {
      name: 'APK Cinema (No VIP)',
      tagline: 'Watch HD Movies Ad-Free',
      description: 'Watch the latest cinema movies and favorite TV series without ads in high definition.',
      features: [
        'Smooth streaming with minimal buffering',
        'Completely ad-free movie experience',
        'Automatic English & local subtitles',
        'Daily catalog updates with the latest titles'
      ],
      specs: [
        { label: 'Compatibility', value: 'Android 5.0 / Smart TV' },
        { label: 'File Size', value: '18 MB' },
        { label: 'Video Quality', value: 'HD / Full HD' },
        { label: 'Languages', value: 'Multi-language & Subs' }
      ]
    }
  },
  {
    id: 'apk-bioskop-unlimited-vip',
    category: 'entertainment',
    iconName: 'Tv',
    badge: 'UNLIMITED VIP',
    rating: 4.9,
    salesCount: '1.8k+',
    price: 15000,
    idTranslations: {
      name: 'APK Bioskop Unlimited VIP',
      tagline: 'Akses VIP Tanpa Batas & Server Premium',
      description: 'Akses premium tanpa batas ke seluruh film, serial TV, dan fitur VIP eksklusif tanpa batasan apa pun.',
      features: [
        'Buka semua konten VIP dan eksklusif',
        'Server super cepat khusus VIP (No Buffering)',
        'Kualitas streaming Ultra HD 4K didukung',
        'Bisa download film untuk ditonton offline'
      ],
      specs: [
        { label: 'Kompatibilitas', value: 'Android / Android TV / iOS' },
        { label: 'Ukuran File', value: '22 MB' },
        { label: 'Resolusi Maks', value: 'Ultra HD 4K' },
        { label: 'Akses Server', value: 'Server VIP Premium' }
      ]
    },
    enTranslations: {
      name: 'APK Cinema Unlimited VIP',
      tagline: 'Unlimited VIP Access & Premium Servers',
      description: 'Unlimited premium access to all movies, TV series, and exclusive VIP features without any limits.',
      features: [
        'Unlock all VIP premium and exclusive content',
        'High-speed dedicated VIP streaming servers',
        'Supports Ultra HD 4K video playback',
        'Offline download functionality enabled'
      ],
      specs: [
        { label: 'Compatibility', value: 'Android / Android TV / iOS' },
        { label: 'File Size', value: '22 MB' },
        { label: 'Max Resolution', value: 'Ultra HD 4K' },
        { label: 'Server Type', value: 'Premium Dedicated VIP' }
      ]
    }
  },
  {
    id: 'mt-manager-vip',
    category: 'tools',
    iconName: 'Code',
    badge: 'LIFETIME VIP',
    rating: 4.9,
    salesCount: '2.5k+',
    price: 40000,
    idTranslations: {
      name: 'MT Manager VIP Lifetime',
      tagline: 'Semua Fitur Premium & Plugin Terbuka',
      description: 'Aplikasi editor file andal untuk Android. Nikmati lisensi VIP seumur hidup dengan semua plugin premium terbuka penuh.',
      features: [
        'Semua fitur VIP dan editor biner terbuka penuh',
        'Semua plugin premium (DEX, ARSC, XML) dapat diakses',
        'Penerjemah otomatis terintegrasi seumur hidup',
        'Tanpa biaya langganan bulanan - Sekali Bayar Selamanya'
      ],
      specs: [
        { label: 'Kompatibilitas', value: 'Android 5.0 - Android 14' },
        { label: 'Ukuran File', value: '25 MB' },
        { label: 'Lisensi', value: 'Lifetime (Seumur Hidup)' },
        { label: 'Fitur', value: 'All VIP Plugins Unlocked' }
      ]
    },
    enTranslations: {
      name: 'MT Manager VIP Lifetime',
      tagline: 'All Premium Features & Plugins Unlocked',
      description: 'Powerful file editor for Android. Enjoy lifetime VIP membership with all premium plugins fully unlocked.',
      features: [
        'Complete VIP options & binary editor unlocked',
        'All premium plugins (DEX, ARSC, XML) fully accessible',
        'Integrated auto-translator working forever',
        'One-time payment - Lifetime updates with zero subscription fees'
      ],
      specs: [
        { label: 'Compatibility', value: 'Android 5.0 - Android 14' },
        { label: 'File Size', value: '25 MB' },
        { label: 'License', value: 'Lifetime' },
        { label: 'Features', value: 'All VIP Plugins Unlocked' }
      ]
    }
  },
  {
    id: 'head-trick-file',
    category: 'gaming',
    iconName: 'Target',
    badge: 'AIM CONFIG',
    rating: 4.8,
    salesCount: '820+',
    price: 35000,
    idTranslations: {
      name: 'Head Trick Config File',
      tagline: 'Sensitivitas Optimal & Auto-Headshot',
      description: 'File konfigurasi sensitivitas optimal untuk performa auto-headshot maksimal dalam game favorit Anda.',
      features: [
        'Meningkatkan akurasi bidikan (Aim lock)',
        'Kalibrasi sensitivitas layar sentuh maksimal',
        'Bekerja pada semua merek handphone Android & iOS',
        '100% Aman dari deteksi sistem game (No ban)'
      ],
      specs: [
        { label: 'Jenis File', value: 'Config JSON / XML' },
        { label: 'Kompatibilitas', value: 'Android & iOS' },
        { label: 'Ukuran File', value: '150 KB' },
        { label: 'Instalasi', value: 'Sangat Mudah' }
      ]
    },
    enTranslations: {
      name: 'Head Trick Config File',
      tagline: 'Optimal Sensitivity & Aim Calibration',
      description: 'Optimal sensitivity configuration file for maximum auto-headshot performance in your favorite games.',
      features: [
        'Greatly improves crosshair lock and accuracy',
        'Fine-tunes touchscreen sensitivity parameters',
        'Fully compatible with all Android and iOS models',
        '100% Anti-ban, completely safe server-side config'
      ],
      specs: [
        { label: 'File Type', value: 'Config JSON / XML' },
        { label: 'Compatibility', value: 'Android & iOS' },
        { label: 'File Size', value: '150 KB' },
        { label: 'Installation', value: 'Extremely Simple' }
      ]
    }
  },
  {
    id: 'complete-tutorial',
    category: 'services',
    iconName: 'HelpCircle',
    badge: '1-ON-1 GUIDE',
    rating: 5.0,
    salesCount: '1.1k+',
    price: 2000,
    idTranslations: {
      name: 'Jasa Tutorial Lengkap',
      tagline: 'Panduan Bimbingan Sampai Paham & Sukses',
      description: 'Bimbingan langkah demi langkah secara personal sampai semua aplikasi berhasil dipasang dan berjalan lancar.',
      features: [
        'Panduan video beresolusi tinggi yang mudah dipahami',
        'Bimbingan personal 1-on-1 via WhatsApp chat / call',
        'Solusi pemecahan masalah jika terjadi error pada HP Anda',
        'Jaminan kepuasan - dibimbing sampai berhasil digunakan!'
      ],
      specs: [
        { label: 'Format Layanan', value: 'Personal Chat / Video Call' },
        { label: 'Durasi Bimbingan', value: 'Sampai Berhasil' },
        { label: 'Waktu Respon', value: 'Cepat (< 15 Menit)' },
        { label: 'Tingkat Keberhasilan', value: '100% Sukses' }
      ]
    },
    enTranslations: {
      name: 'Complete Tutorial Service',
      tagline: 'Step-by-Step Guidance and Live Support',
      description: 'Personal step-by-step guidance until all applications are successfully installed and running smoothly.',
      features: [
        'Clear, high-resolution step-by-step video guides',
        'Personal 1-on-1 chat/call support via WhatsApp',
        'On-demand troubleshooting for any Android/iOS errors',
        '100% Success guarantee - guided until it runs!'
      ],
      specs: [
        { label: 'Service Format', value: 'Personal Chat / Video Support' },
        { label: 'Support Duration', value: 'Until Fully Working' },
        { label: 'Response Time', value: 'Fast (< 15 Mins)' },
        { label: 'Success Rate', value: '100% Guarantee' }
      ]
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Andra Wijaya',
    role: 'Mobile Gamer',
    rating: 5,
    avatar: '',
    commentId: 'Fake Lag Optimizer-nya mantap banget! Biasanya ping saya 120ms ke atas sekarang stabil di 20-30ms terus pas main game. Admin ramah dan dibimbing sampai bisa!',
    commentEn: 'The Fake Lag Optimizer is outstanding! Usually my ping spikes above 120ms, but now it stays stable at 20-30ms. Extremely helpful admin who guided me step-by-step.',
    date: '2026-06-20'
  },
  {
    name: 'Siti Rahma',
    role: 'Movie Enthusiast',
    rating: 5,
    avatar: '',
    commentId: 'APK Bioskop Unlimited VIP harganya murah meriah tapi kualitasnya gila, jernih banget 4K tanpa buffering. Akhirnya bisa nonton film sepuasnya tanpa iklan.',
    commentEn: 'APK Cinema Unlimited VIP is super affordable but the quality is amazing, crystal clear 4K with absolutely no buffering. Finally, I can watch endless movies without ads.',
    date: '2026-06-18'
  },
  {
    name: 'Fauzi Hakim',
    role: 'Android Modder',
    rating: 5,
    avatar: '',
    commentId: 'Beli MT Manager VIP lifetime di sini bener-bener semua plugin kebuka seumur hidup. Sangat worth it, proses transaksi cepat ga pakai ribet.',
    commentEn: 'Bought the MT Manager VIP lifetime here and all plugins are active forever. Completely worth it, process was rapid and hassle-free.',
    date: '2026-06-22'
  },
  {
    name: 'Eko Santoso',
    role: 'PUBG Player',
    rating: 5,
    avatar: '',
    commentId: 'File Head Trick 35k beneran nambah sensitivitas aim saya pas main. Gampang banget headshot sekarang, musuh auto rata. Terbaik!',
    commentEn: 'The 35k Head Trick file really boosted my aim sensitivity. Extremely easy headshots now. The best!',
    date: '2026-06-21'
  },
  {
    name: 'Rian Hidayat',
    role: 'Casual Gamer',
    rating: 5,
    avatar: '',
    commentId: 'Awalnya ragu, tapi pas dicoba pas mabar Mobile Legends ping ijo stabil! Ga ada lagi delay skill. VIP-nya beneran premium.',
    commentEn: 'Skeptical at first, but when tried in ML multiplayer, the ping stayed solid green! No skill delay. The VIP tier is truly premium.',
    date: '2026-06-20'
  },
  {
    name: 'Dewi Lestari',
    role: 'Drama Lover',
    rating: 5,
    avatar: '',
    commentId: 'Aplikasi bioskop no VIP cuma 10k murah banget dan beneran ga ada iklan sama sekali. Kualitas film HD jernih mantap.',
    commentEn: 'Cinema app without VIP is only 10k, so cheap and absolutely no ads. HD film quality is superb.',
    date: '2026-06-19'
  },
  {
    name: 'Budi Utomo',
    role: 'Developer',
    rating: 5,
    avatar: '',
    commentId: 'Sangat membantu buat modding aplikasi. MT Manager seumur hidup murah banget cuma 40k. Di tempat lain bisa ratusan ribu.',
    commentEn: 'Extremely helpful for app modding. MT Manager lifetime is incredibly cheap at only 40k. Elsewhere it could cost hundreds.',
    date: '2026-06-19'
  },
  {
    name: 'Aditya Pratama',
    role: 'Student',
    rating: 5,
    avatar: '',
    commentId: 'Jasa tutorial 2k tapi pelayanannya bintang 5! Admin sabar banget jelasin padahal saya gaptek. Akhirnya aplikasi fake lag bisa terpasang sempurna.',
    commentEn: 'Only 2k for tutorial service but the treatment is 5-star! Admin is incredibly patient explaining things even though I am tech-illiterate.',
    date: '2026-06-18'
  },
  {
    name: 'Yudi Kusuma',
    role: 'Free Fire Player',
    rating: 5,
    avatar: '',
    commentId: 'Config headshot-nya jos! Aim nempel banget ke kepala musuh. Rekomendasi buat yang mau naik tier ranked cepet.',
    commentEn: 'The headshot config is amazing! Aim locks perfectly onto the enemy\'s head. Highly recommended for fast rank climbing.',
    date: '2026-06-18'
  },
  {
    name: 'Maya Indah',
    role: 'Gamer Girl',
    rating: 5,
    avatar: '',
    commentId: 'Ping ping aman terkendali, main PUBG jadi lancar jaya tanpa jitter. Terima kasih Lex Store!',
    commentEn: 'Ping is completely under control, playing PUBG is super smooth with no jitter. Thank you Lex Store!',
    date: '2026-06-17'
  },
  {
    name: 'Hadi Wijaya',
    role: 'TV Show Watcher',
    rating: 5,
    avatar: '',
    commentId: 'Nonton serial TV kesukaan lancar tanpa buffering di Android TV. APK Bioskop Unlimited VIP juara!',
    commentEn: 'Watching favorite TV series without any buffering on Android TV. Cinema Unlimited VIP is the champ!',
    date: '2026-06-16'
  },
  {
    name: 'Rudi Tabuti',
    role: 'Mod Enthusiast',
    rating: 5,
    avatar: '',
    commentId: 'Semua plugin Dex & XML kebuka gratis tanpa kendala. Beneran lifetime seumur hidup!',
    commentEn: 'All Dex & XML plugins unlocked for free without issues. Truly lifetime access!',
    date: '2026-06-15'
  },
  {
    name: 'Dian Sastro',
    role: 'Newbie User',
    rating: 5,
    avatar: '',
    commentId: 'Fast respon banget adminnya. Langsung dipandu begitu beres transaksi. 2k ga ada apa-apanya dibanding ilmunya.',
    commentEn: 'Very fast response from the admin. Directly guided right after transaction. 2k is nothing compared to the knowledge.',
    date: '2026-06-15'
  },
  {
    name: 'Guntur Tri',
    role: 'Gamer',
    rating: 5,
    avatar: '',
    commentId: 'Sangat akurat file head trick-nya. Terpasang langsung di sensitivitas game. Keren bener.',
    commentEn: 'Highly accurate head trick file. Applied directly to the game sensitivity. Totally awesome.',
    date: '2026-06-14'
  },
  {
    name: 'Fitriani',
    role: 'Home Network User',
    rating: 5,
    avatar: '',
    commentId: 'Cocok banget buat daerah yang sinyalnya kurang bagus kayak rumah saya. Fake Lag Optimizer ngebantu stabilin ping.',
    commentEn: 'Perfect for areas with weak signal like my home. The Fake Lag Optimizer stabilizes my connection.',
    date: '2026-06-14'
  },
  {
    name: 'Iwan Fals',
    role: 'Family Man',
    rating: 5,
    avatar: '',
    commentId: 'Nonton bioskop hemat ga perlu keluar uang banyak. Cukup beli sekali seharga 15k udah bisa nonton sekeluarga.',
    commentEn: 'Affordable cinema movies. Just buy once for 15k and the whole family can watch.',
    date: '2026-06-13'
  },
  {
    name: 'Aris Nugraha',
    role: 'Power User',
    rating: 5,
    avatar: '',
    commentId: 'Aplikasi wajib buat oprek hp. Terimakasih Lex Store sudah nyediain yang VIP lifetime murah meriah.',
    commentEn: 'Must-have app for phone customization. Thank you Lex Store for providing cheap lifetime VIP.',
    date: '2026-06-12'
  },
  {
    name: 'Siska Amelia',
    role: 'App Learner',
    rating: 5,
    avatar: '',
    commentId: 'Dibimbing ramah dari nol sampai paham. Recommended seller banget pokoknya.',
    commentEn: 'Friendly guidance from scratch until fully understood. Absolute recommended seller.',
    date: '2026-06-12'
  },
  {
    name: 'Rahmat H.',
    role: 'FPS Veteran',
    rating: 5,
    avatar: '',
    commentId: 'Bidikan nempel terus kayak pakai magnet. Worth it banget harganya 35k.',
    commentEn: 'Crosshair locks on like a magnet. Totally worth the 35k price.',
    date: '2026-06-11'
  },
  {
    name: 'Denny Cagur',
    role: 'Mobile Legend Player',
    rating: 5,
    avatar: '',
    commentId: 'Sangat memuaskan! Main game online jadi ga emosi lagi karena lag. Ping ijo terus.',
    commentEn: 'Very satisfying! No more getting angry at online games due to lag. Green ping always.',
    date: '2026-06-10'
  },
  {
    name: 'Wati Lestari',
    role: 'Movie Collector',
    rating: 5,
    avatar: '',
    commentId: 'Ga nyesel beli yang Unlimited VIP, servernya kenceng dan update filmnya cepet banget.',
    commentEn: 'No regrets buying the Unlimited VIP, servers are extremely fast and movies are updated rapidly.',
    date: '2026-06-09'
  },
  {
    name: 'Rony Keo',
    role: 'App Tinkerer',
    rating: 5,
    avatar: '',
    commentId: 'Editor biner terbaik, semua fitur premium aktif. Sukses terus buat Lex Store!',
    commentEn: 'Best binary editor, all premium features active. More success to Lex Store!',
    date: '2026-06-09'
  },
  {
    name: 'Kiki Rizky',
    role: 'Non-Tech User',
    rating: 5,
    avatar: '',
    commentId: 'Bantuan tutorialnya kilat dan sabar. Padahal saya nanya terus tapi tetep dijawab ramah.',
    commentEn: 'The tutorial assistance was quick and patient. Despite my endless questions, they answered nicely.',
    date: '2026-06-08'
  },
  {
    name: 'Anton Sujarwo',
    role: 'Shooter Enthusiast',
    rating: 5,
    avatar: '',
    commentId: 'Sensitivitas hp jadi makin lincah dan licin buat headshot. Mantap pol!',
    commentEn: 'Touch sensitivity is now much faster and slicker for headshots. Excellent!',
    date: '2026-06-07'
  },
  {
    name: 'Yuli Anita',
    role: 'Casual Player',
    rating: 5,
    avatar: '',
    commentId: 'Beda banget performanya sebelum dan sesudah pakai optimizer ini. Mantap luar biasa!',
    commentEn: 'The performance is night and day before and after using this optimizer. Outstanding!',
    date: '2026-06-07'
  },
  {
    name: 'Ahmad Dani',
    role: 'Cinema Lover',
    rating: 5,
    avatar: '',
    commentId: 'Tampilan aplikasinya bersih dan gampang dipake. Bioskop di rumah jadi nyata.',
    commentEn: 'The app UI is clean and easy to use. Home cinema is now a reality.',
    date: '2026-06-06'
  },
  {
    name: 'Mega Utami',
    role: 'Geek',
    rating: 5,
    avatar: '',
    commentId: 'Aman dari virus dan langsung bisa login akun VIP. Pelayanan top banget.',
    commentEn: 'Safe from viruses and instantly logged into the VIP account. Top-notch service.',
    date: '2026-06-06'
  },
  {
    name: 'Doni Salman',
    role: 'Fast Learner',
    rating: 5,
    avatar: '',
    commentId: 'Video panduannya singkat padat dan jelas. Sekali tonton langsung bisa install sendiri.',
    commentEn: 'The video guide is short, concise, and clear. Watched it once and installed immediately.',
    date: '2026-06-05'
  },
  {
    name: 'Baim Wong',
    role: 'Pro Gamer',
    rating: 5,
    avatar: '',
    commentId: 'Config aim ini beneran work 100%. KD game saya naik drastis setelah pasang file ini.',
    commentEn: 'This aim config is 100% working. My game KD increased drastically after using it.',
    date: '2026-06-05'
  },
  {
    name: 'Lulu Tobing',
    role: 'Lag Hater',
    rating: 5,
    avatar: '',
    commentId: 'Penyelamat koneksi lemot! Gak nyesel beli yang VIP tier, kerasa banget bedanya.',
    commentEn: 'Lifesaver for slow connections! No regrets buying the VIP tier, the difference is massive.',
    date: '2026-06-04'
  },
  {
    name: 'Raffi Ahmad',
    role: 'TV Enthusiast',
    rating: 5,
    avatar: '',
    commentId: 'Akhirnya dapet aplikasi nonton yang gak banyak iklan pop-up aneh. Bioskop VIP terbaik.',
    commentEn: 'Finally found a streaming app without weird pop-up ads. Best VIP cinema.',
    date: '2026-06-03'
  },
  {
    name: 'Nagita S.',
    role: 'Product Tester',
    rating: 5,
    avatar: '',
    commentId: 'Lisensi aman dan semua fitur premium bisa dipakai. Makasih admin!',
    commentEn: 'License is secure and all premium features work perfectly. Thanks admin!',
    date: '2026-06-02'
  },
  {
    name: 'Zaskia Gotik',
    role: 'Enthusiast',
    rating: 5,
    avatar: '',
    commentId: 'Hanya dengan 2k rupiah bisa dapet panduan sedetil ini. Makasih banyak bantuannya!',
    commentEn: 'For just 2k IDR, got such detailed guidance. Thank you so much for the help!',
    date: '2026-06-01'
  },
  {
    name: 'Atta Halilintar',
    role: 'Apex Legends Player',
    rating: 5,
    avatar: '',
    commentId: 'AIM-nya makin stabil dan recoil berkurang drastis. Enak banget buat ranked.',
    commentEn: 'Aim is much more stable and recoil is drastically reduced. Perfect for ranked matches.',
    date: '2026-05-30'
  },
  {
    name: 'Aurel H.',
    role: 'Blogger',
    rating: 5,
    avatar: '',
    commentId: 'Lex Store terbaik kalau soal aplikasi modifikasi Android. Udah langganan berkali-kali.',
    commentEn: 'Lex Store is the best when it comes to Android modified apps. Have been a regular customer.',
    date: '2026-05-29'
  }
];

export const FAQS: FAQItem[] = [
  {
    questionId: 'Apakah semua aplikasi ini aman untuk dipasang?',
    questionEn: 'Are all these applications safe to install?',
    answerId: 'Ya, semua aplikasi yang kami jual telah melalui pengujian keamanan ketat, bebas dari virus, malware, serta aman dari resiko banned akun.',
    answerEn: 'Yes, all applications we offer have undergone rigorous security testing and are completely free from viruses, malware, or ban risks.'
  },
  {
    questionId: 'Bagaimana cara pengiriman setelah melakukan pembayaran?',
    questionEn: 'How are the files delivered after payment?',
    answerId: 'File aplikasi dan panduan instalasi akan langsung dikirim oleh Admin melalui chat WhatsApp berupa link download privat yang aman dan cepat.',
    answerEn: 'The application files and complete installation instructions will be sent instantly by the Admin via WhatsApp chat as secure, fast private download links.'
  },
  {
    questionId: 'Apakah saya bisa meminta bantuan jika tidak paham cara menginstalnya?',
    questionEn: 'Can I get help if I do not know how to install it?',
    answerId: 'Tentu saja! Kami menyediakan Jasa Tutorial Lengkap seharga 2K di mana Admin akan memandu Anda langkah demi langkah secara personal via chat atau video call hingga berhasil.',
    answerEn: 'Of course! We provide a Complete Tutorial Service for only 2K where the Admin will personally guide you step-by-step via chat or call until everything runs perfectly.'
  },
  {
    questionId: 'Metode pembayaran apa saja yang diterima?',
    questionEn: 'What payment methods are accepted?',
    answerId: 'Kami menerima berbagai metode pembayaran populer di Indonesia seperti DANA, OVO, GoPay, LinkAja, QRIS, serta transfer bank (BCA, Mandiri, BRI, BNI).',
    answerEn: 'We accept various popular Indonesian payment methods including E-Wallets (DANA, OVO, GoPay, LinkAja), QRIS, and bank transfers.'
  }
];
