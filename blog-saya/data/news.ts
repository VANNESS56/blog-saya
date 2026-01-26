export interface NewsItem {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    author: string;
    category: string;
    tags: string[];
}

export const ALL_NEWS: NewsItem[] = [
    {
        id: "remaja-sukses-rolls-royce-2026",
        title: "Viral! Remaja 17 Tahun Ini Sukses Bangun Bisnis Hingga Mampu Beli Rolls Royce",
        excerpt: "Kisah inspiratif seorang pemuda yang berhasil meraih kesuksesan finansial luar biasa di usia muda berkat ketekunannya membangun imperium bisnis digital.",
        content: `
      <p>Dunia jagat maya belakangan ini dihebohkan oleh sosok pemuda berusia 17 tahun yang sudah memiliki gaya hidup mewah, termasuk mengoleksi mobil super mewah Rolls Royce. Namun, di balik kemewahan tersebut, tersimpan perjuangan keras yang luar biasa.</p>
      <p>Pemuda yang akrab disapa Owen ini mulai merintis bisnisnya sejak usia 14 tahun. Berawal dari ketertarikannya pada dunia *trading* dan *digital marketing*, ia menghabiskan ribuan jam untuk belajar secara otodidak. "Tidak ada kesuksesan yang datang dalam semalam. Saya gagal berkali-kali sebelum akhirnya menemukan pola yang tepat," ujarnya kepada PannessTV.</p>
      <p>Owennn menekankan bahwa memiliki mobil mewah bukanlah tujuan utamanya, melainkan simbol dari dedikasi dan konsistensi. Ia kini mengelola beberapa agensi digital yang mempekerjakan puluhan orang, membuktikan bahwa usia bukan hambatan untuk menjadi pemimpin di dunia bisnis.</p>
      <p>Kisah ini menjadi pengingat bagi generasi muda lainnya bahwa dengan visi yang jelas dan kemauan untuk terus belajar, kesuksesan besar bisa diraih kapan saja. "Mulailah dari apa yang kamu sukai, dan jangan pernah berhenti saat menghadapi tantangan," tambahnya.</p>
    `,
        image: "https://i.ibb.co.com/Txr9YQ1j/photo-2026-01-26-08-58-27.jpg",
        date: "26 Jan 2026",
        author: "Tim Redaksi",
        category: "LIFESTYLE",
        tags: ["Inspirasi", "Bisnis", "Muda Sukses", "Gaya Hidup"],
    },
    {
        id: "prestasi-mahasiswa-sumsel-2026",
        title: "Membanggakan! Mahasiswa Asal Sumatera Selatan Raih Prestasi Gemilang di Tingkat Nasional",
        excerpt: "Inovasi mahasiswa sumatera selatan kembali mencuri perhatian publik setelah berhasil menyabet penghargaan utama dalam ajang kompetisi teknologi nasional.",
        content: `
      <p>Kabar membanggakan datang dari dunia pendidikan Sumatera Selatan. Seorang mahasiswa berprestasi asal Bumi Sriwijaya baru-baru ini berhasil mengharumkan nama daerah dengan meraih penghargaan bergengsi di tingkat nasional.</p>
      <p>Prestasi ini diraih dalam ajang kompetisi inovasi digital yang diikuti oleh ratusan universitas ternama dari seluruh Indonesia. Dengan membawa proyek bertajuk pemberdayaan ekonomi daerah berbasis teknologi, mahasiswa tersebut mampu memikat dewan juri dan mengalahkan kompetitor dari berbagai wilayah lainnya.</p>
      <p>Gubernur Sumatera Selatan memberikan apresiasi tinggi atas pencapaian ini. "Ini adalah bukti bahwa SDM unggul di Sumsel mampu bersaing di kancah nasional. Kami akan terus mendukung mahasiswa kita untuk terus berinovasi," ungkapnya dalam sesi wawancara khusus dengan tim PannessTV.</p>
      <p>Kemenangan ini diharapkan menjadi pemacu semangat bagi para pelajar dan mahasiswa lainnya di Sumatera Selatan untuk terus menggali potensi dan memberikan kontribusi terbaik bagi pembangunan daerah dan bangsa.</p>
    `,
        image: "https://i.ibb.co.com/v6WYLj7c/owennn.png",
        date: "26 Jan 2026",
        author: "Fajar Ramadhan",
        category: "NEWS",
        tags: ["Prestasi", "Mahasiswa", "Sumatera Selatan", "Pendidikan"],
    },
    {
        id: "imlek-2026",
        title: "Sambut Tahun Baru Imlek 2026: Persiapan Klenteng dan Tradisi yang Dinanti",
        excerpt: "Berbagai klenteng di Indonesia mulai bersiap menyambut perayaan Tahun Baru Imlek 2026 dengan dekorasi merah yang meriah.",
        content: `
      <p>Tahun Baru Imlek 2026 sudah di depan mata. Masyarakat Tionghoa di berbagai penjuru Indonesia mulai melakukan persiapan matang untuk menyambut momen pergantian tahun dalam kalender lunar ini.</p>
      <p>Klenteng-klenteng bersejarah sperti Klenteng Boen Tek Bio di Tangerang dan Klenteng Jin De Yuan di Glodok mulai dibersihkan dan dihiasi dengan ribuan lampion merah. Tradisi membersihkan patung dewa dan persiapan lilin berukuran raksasa menjadi pemandangan rutin yang menarik perhatian wisatawan.</p>
      <p>Selain persiapan fisik di tempat ibadah, tradisi makan malam bersama keluarga (Reunion Dinner) tetap menjadi inti dari perayaan ini. Menu khas seperti Ikan Bandeng, Kue Keranjang, dan Jeruk Mandarin mulai diburu di pasar-pasar tradisional.</p>
      <p>Pemerintah juga telah menetapkan libur nasional untuk merayakan momen ini, yang diharapkan dapat meningkatkan pergerakan ekonomi di sektor pariwisata dan kuliner khas Imlek.</p>
    `,
        image: "https://i.ibb.co.com/xKHP3Dpw/Screenshot-2024-11-18-111153.png",
        date: "26 Jan 2026",
        author: "Tim Redaksi",
        category: "LIFESTYLE",
        tags: ["Imlek", "Budaya", "Tahun Baru"],
    },
    {
        id: "h1",
        title: "Indonesia Targetkan Investasi Hijau Capai 500 Triliun di Tahun 2026",
        excerpt: "Pemerintah Indonesia optimis dapat menarik minat investor global untuk mendanai proyek-proyek energi terbarukan.",
        content: `
      <p>Pemerintah Indonesia melalui Kementerian Investasi menargetkan realisasi investasi hijau dapat mencapai angka Rp 500 triliun pada tahun 2026 mendatang. Target ambisius ini sejalan dengan komitmen negara untuk mencapai Net Zero Emission pada tahun 2060.</p>
      <p>Menteri Investasi menyatakan bahwa sektor energi terbarukan, seperti panel surya dan panas bumi, akan menjadi primadona bagi para pemodal asing. Beberapa negara Eropa dan Asia Timur telah menyatakan ketertarikannya untuk berkolaborasi dalam pembangunan infrastruktur ramah lingkungan di tanah air.</p>
      <p>Selain fokus pada energi, investasi ini juga mencakup pengembangan ekosistem kendaraan listrik (EV) yang terintegrasi, mulai dari pertambangan nikel hingga pabrik baterai.</p>
    `,
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1000",
        date: "26 Jan 2026",
        author: "Aditya Pratama",
        category: "EKONOMI",
        tags: ["Investasi", "Energi Hijau", "Ekonomi"],
    },
    {
        id: "h2",
        title: "Teknologi AI Terbaru Kini Mampu Memprediksi Cuaca dengan Akurasi 99%",
        excerpt: "Sebuah terobosan besar di dunia meteorologi menggunakan model deep learning terbaru yang dikembangkan startup lokal.",
        content: `
      <p>Para ilmuwan komputer telah meluncurkan model kecerdasan buatan (AI) teranyar yang diklaim mampu memprediksi kondisi cuaca ekstrem hingga 7 hari ke depan dengan tingkat akurasi mencapai 99%.</p>
      <p>Berbeda dengan sistem konvensional yang mengandalkan superkomputer fisik, AI ini belajar dari miliaran data historis cuaca global untuk mengenali pola-pola mikro yang seringkali terlewatkan.</p>
    `,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        date: "26 Jan 2026",
        author: "Rina Wijaya",
        category: "TEKNO",
        tags: ["AI", "Cuaca", "Teknologi"],
    },
    {
        id: "h3",
        title: "Eksplorasi Mars: Robot Penjelajah Temukan Bukti Baru Sumber Air",
        excerpt: "Temuan terbaru dari kawah Jezero memperkuat hipotesis bahwa Mars pernah memiliki ekosistem yang bisa ditinggali.",
        content: `
      <p>Badan Antariksa Nasional melaporkan temuan mineral yang terbentuk dari air di kedalaman kawah Jezero, Mars. Temuan ini didapat dari analisis sampel batuan yang diambil oleh robot penjelajah terbaru.</p>
    `,
        image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000",
        date: "26 Jan 2026",
        author: "Dr. Gunawan",
        category: "SAINS",
        tags: ["Mars", "Antariksa", "Sains"],
    },
    {
        id: "l1",
        title: "Mengenal 'Green Hydrogen', Energi Masa Depan yang Ramah Lingkungan",
        excerpt: "Green hydrogen diprediksi akan menjadi kunci utama dalam transisi energi global menuju net zero emission.",
        content: `<p>Hidrogen hijau diproduksi melalui elektrolisis air menggunakan energi terbarukan...</p>`,
        image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80&w=400",
        date: "26 Jan 2026",
        author: "Siti Aminah",
        category: "SAINS",
        tags: ["Energi", "Lingkungan"],
    },
    {
        id: "l2",
        title: "5 Tips Mengamankan Akun Media Sosial dari Serangan Phishing",
        excerpt: "Kejahatan siber semakin meningkat, pastikan Anda melakukan langkah-langkah pencegahan ini.",
        content: `<p>1. Gunakan Autentikasi Dua Faktor (2FA)...</p>`,
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400",
        date: "26 Jan 2026",
        author: "Budi Santoso",
        category: "TEKNO",
        tags: ["Keamanan", "Siber"],
    },
    {
        id: "l3",
        title: "Review Toyota Land Cruiser 300: Kemewahan yang Tangguh",
        excerpt: "Unit terbaru dari Land Cruiser ini membawa mesin V6 twin-turbo yang lebih efisien.",
        content: `<p>Land Cruiser 300 menawarkan kenyamanan berkendara di segala medan...</p>`,
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400",
        date: "26 Jan 2026",
        author: "Fajar Pratama",
        category: "OTOMOTIF",
        tags: ["Mobil", "Otomotif"],
    },
    {
        id: "l4",
        title: "Strategi Investasi Saham Bagi Pemula di Tahun 2026",
        excerpt: "Pasar modal Indonesia menunjukkan tren positif, berikut adalah sektor yang layak diperhatikan.",
        content: `<p>Memilih saham dengan fundamental yang kuat sangat penting bagi pemula...</p>`,
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400",
        date: "26 Jan 2026",
        author: "Maya Sari",
        category: "EKONOMI",
        tags: ["Saham", "Keuangan"],
    },
];
