/**
 * Client-supplied classical Yoga rules.
 *
 * SARA WORK START - CLIENT YOGA RULE ENGINE
 *
 * IMPORTANT:
 * - ADDITIVE ONLY. Existing yogaService.js and all frozen calculations stay untouched.
 * - Rules 1-40 are implemented in controlled batches.
 * - Rules 1-30 are frozen/UAT-passed; this batch adds Rules 31-40 only.
 * - Source wording is preserved from the client-supplied corpus.
 */

const SIGN_LORD_KEYS = {
  1: 'mars', 2: 'venus', 3: 'mercury', 4: 'moon', 5: 'sun', 6: 'mercury',
  7: 'venus', 8: 'mars', 9: 'jupiter', 10: 'saturn', 11: 'saturn', 12: 'jupiter',
};

const OWN_SIGNS = {
  sun: [5], moon: [4], mars: [1, 8], mercury: [3, 6],
  jupiter: [9, 12], venus: [2, 7], saturn: [10, 11],
};

const EXALTED_SIGNS = {
  sun: 1, moon: 2, mars: 10, mercury: 6, jupiter: 4, venus: 12, saturn: 7,
};

const DEBILITATED_SIGNS = {
  sun: 7, moon: 8, mars: 4, mercury: 12, jupiter: 10, venus: 6, saturn: 1,
};

// Client Rule 14 explicitly allows Jupiter in a friendly sign.
// Jupiter's natural friends are Sun, Moon and Mars; therefore their signs
// are treated as friendly signs for this client rule.
const JUPITER_FRIENDLY_SIGNS = [1, 4, 5, 8];

// Planet that becomes exalted in each sign.
const EXALTATION_PLANET_BY_SIGN = Object.fromEntries(
  Object.entries(EXALTED_SIGNS).map(([planetKey, rasiNo]) => [rasiNo, planetKey])
);

const SOURCE_RULES = {
  1: {
    key: 'gaja_kesari',
    nameTa: 'கஜகேசரி யோகம்',
    nameEn: 'Gaja Kesari Yoga',
    formulaTa: 'சந்திரனுக்கு கேந்திர ஸ்தானங்களில் (1, 4, 7, 10 ஆகிய இடங்களில்) குரு பகவான் அமர்வது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் (அத்தியாயம் 36, சுலோகம் 3) மற்றும் ஜாதக அலங்காரம்.',
    benefitTa: 'நீண்ட ஆயுள், எதிரிகளை வெல்லும் மனோபலம், உயர்ந்த தலைமைப் பதவி மற்றும் அழியாத புகழ்.',
  },
  2: {
    key: 'dharma_karmadhipati',
    nameTa: 'தர்மகர்மாதிபதி யோகம்',
    nameEn: 'Dharma Karmadhipati Yoga',
    formulaTa: 'பாக்கிய ஸ்தானாதிபதியான 9-ஆம் அதிபதியும், கர்ம ஸ்தானாதிபதியான 10-ஆம் அதிபதியும் இணைந்து நிற்பது, சமசப்தம பார்வை பெறுவது அல்லது பரிவர்த்தனை ஆவது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் புலிப்பாணி முனிவரின் புலிப்பாணி ஜோதிடம் 300.',
    benefitTa: 'சமூக அந்தஸ்து, அரசாங்க நன்மதிப்பு, நீடித்த செல்வம் மற்றும் தர்ம சிந்தனையுடன் கூடிய நிர்வாக அதிகாரம்.',
  },
  3: {
    key: 'neecha_bhanga_raja',
    nameTa: 'நீசபங்க ராஜயோகம்',
    nameEn: 'Neecha Bhanga Raja Yoga',
    formulaTa: 'நீசமான கிரகத்தின் வீட்டு அதிபதியோ அல்லது அந்த ராசியில் உச்சமடையும் கிரகமோ, லக்னத்திற்கோ அல்லது சந்திரனுக்கோ கேந்திரத்தில் (1, 4, 7, 10) நிற்பது.',
    sourceTa: 'மந்திரேஸ்வரரின் பலதீபிகை (அத்தியாயம் 6) மற்றும் தேவகேரளம் (சந்திரகலா நாடி).',
    benefitTa: 'ஆரம்பகால இன்னல்கள் நீங்கி, பிற்காலத்தில் அசுர வளர்ச்சி அடைந்து சக்கரவர்த்திக்கு நிகரான வாழ்க்கை அமைதல்.',
  },
  4: {
    key: 'vipareeta_raja',
    nameTa: 'விபரீத ராஜயோகம் (ஹர்ஷ, சரள, விமல யோகங்கள்)',
    nameEn: 'Vipareeta Raja Yoga (Harsha, Sarala, Vimala)',
    formulaTa: 'துர்ஸ்தானங்களான 6, 8, 12-ஆம் அதிபதிகள் தங்களுக்குள் பரிவர்த்தனை பெறுவது அல்லது மறைவு ஸ்தானங்களிலேயே ஒருவருக்கொருவர் கூடி நிற்பது (சுபகிரக பார்வை இன்றி).',
    sourceTa: 'காளிதாசரின் உத்தர காலாமிருதம் (காண்டம் 4, சுலோகம் 22).',
    benefitTa: 'எதிர்பாராத தனலாபம், போட்டிகள் மற்றும் எதிரிகளின் வீழ்ச்சியின் மூலம் திடீர் அதிகார உயர்வைப் பெறுதல்.',
  },
  5: {
    key: 'hamsa',
    nameTa: 'பஞ்ச மகாபுருஷ யோகம் (ஹம்ச யோகம்)',
    nameEn: 'Hamsa Yoga (Pancha Mahapurusha Yoga)',
    formulaTa: 'குரு பகவான் தனது சொந்த வீடுகளிலோ (தனுசு, மீனம்) அல்லது உச்ச வீட்டிலோ (கடகம்) நின்று, அந்த இடம் லக்ன கேந்திரமாக (1, 4, 7, 10) அமைவது.',
    sourceTa: 'வராகமிஹிரரின் பிருஹத் சம்ஹிதை மற்றும் சர்வார்த்த சிந்தாமணி.',
    benefitTa: 'ஆன்மீக ஞானம், மெய்யறிவு, அறநெறி தவறாத வாழ்க்கை மற்றும் சமுதாயத்தால் மதிக்கப்படும் குரு நிலையை அடைதல்.',
  },
  6: {
    key: 'chandra_mangala',
    nameTa: 'சந்திர மங்கள யோகம்',
    nameEn: 'Chandra Mangala Yoga',
    formulaTa: 'மனோகாரகனான சந்திரனும் பூமிக்காரகனான செவ்வாயும் இணைந்திருப்பது அல்லது 7-ஆம் பார்வையாக பரஸ்பரம் நேருக்கு நேர் பார்த்துக் கொள்வது.',
    sourceTa: 'பிருஹத் ஜாதகம் மற்றும் ஜாதக தத்துவ நிவர்த்தி.',
    benefitTa: 'அசையாச் சொத்துக்கள், நிலம், பூமி லாபம், தடையற்ற பணப்புழக்கம் மற்றும் வணிக வெற்றி.',
  },
  7: {
    key: 'budha_aditya',
    nameTa: 'புதாதித்ய யோகம் (நிபுண யோகம்)',
    nameEn: 'Budha Aditya Yoga (Nipuna Yoga)',
    formulaTa: 'சூரியனும் புதனும் ஒரே ராசியில் இணைந்திருப்பது (புதன் அஸ்தங்கம் அடையாமல் சுப வீடுகளில் அமைவது சிறந்தது).',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் ஓலைச்சுவடி மூலமான அகத்தியர் நாடி ஜோதிடம்.',
    benefitTa: 'கூரிய புத்தி கூர்மை, தர்க்க அறிவு, கணிதம் மற்றும் எழுத்துத் துறையில் வித்தகராக விளங்குதல்.',
  },
  8: {
    key: 'amala',
    nameTa: 'அமல யோகம்',
    nameEn: 'Amala Yoga',
    formulaTa: 'லக்னத்திற்கோ அல்லது சந்திரனுக்கோ 10-ஆம் இடத்தில் இயற்கை சுபர்களான குரு, சுக்கிரன் அல்லது வளர்பிறை சந்திரன்/புதன் தனித்து அமர்வது.',
    sourceTa: 'வைத்தியநாத தீட்சிதரின் ஜாதக பாரிஜாதம் மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம்.',
    benefitTa: 'களங்கமற்ற தொழில் வாழ்க்கை, பரோபகார குணம், நற்பெயர் மற்றும் வாழ்நாள் முழுவதும் நேர்மையான செல்வ ஈட்டல்.',
  },
  9: {
    key: 'lakshmi',
    nameTa: 'லட்சுமி யோகம்',
    nameEn: 'Lakshmi Yoga',
    formulaTa: '9-ஆம் அதிபதி கேந்திரத்திலோ அல்லது திரிகோணத்திலோ பலம் பெற்று நிற்க, சுக்கிரன் ஆட்சி அல்லது உச்சம் பெற்று கேந்திரத்தில் அமைவது.',
    sourceTa: 'பலதீபிகை (அத்தியாயம் 6, சுலோகம் 20).',
    benefitTa: 'வற்றாத செல்வ வளம், உயர் ரக ஆடம்பர வசதிகள், கவர்ச்சிகரமான தோற்றம் மற்றும் பரந்த குடும்ப மகிழ்ச்சி.',
  },
  10: {
    key: 'guru_mangala',
    nameTa: 'குரு மங்கள யோகம்',
    nameEn: 'Guru Mangala Yoga',
    formulaTa: 'சுப கிரகமான குருவும் தைரிய காரகனான செவ்வாயும் சேர்க்கை பெறுவது அல்லது ஒருவருக்கொருவர் 5, 9 போன்ற திரிகோண பார்வை பெறுவது.',
    sourceTa: 'தமிழ் பாடல் வடிவிலான புலிப்பாணி பலன் 300 மற்றும் வீரமாமுனிவர் ஜோதிட திரட்டு.',
    benefitTa: 'துணிச்சல், நேர்மையான நிர்வாகத் திறன், சொத்துக்களின் சேர்க்கை மற்றும் தளபதிக்கு நிகரான ஆளுமைத் திறன்.',
  },  11: {
    key: 'chandra_adhi',
    nameTa: 'சந்திராதி யோகம் (அதி யோகம்)',
    nameEn: 'Chandra Adhi Yoga (Adhi Yoga)',
    formulaTa: 'சந்திரனுக்கு 6, 7 மற்றும் 8 ஆகிய இடங்களில் இயற்கை சுப கிரகங்களான குரு, சுக்கிரன், புதன் அமைந்திருப்பது.',
    sourceTa: 'வராகமிஹிரரின் பிருஹத் ஜாதகம் (அத்தியாயம் 13) மற்றும் ஜாதக பாரிஜாதம்.',
    benefitTa: 'தலைமை தளபதி அல்லது அமைச்சருக்கு நிகரான அதிகாரம், எதிரிகளை எளிதில் வெல்லும் ஆற்றல், நீண்ட ஆயுள் மற்றும் ஆரோக்கியம்.',
  },
  12: {
    key: 'malavya',
    nameTa: 'மாலவ்ய யோகம் (பஞ்ச மகாபுருஷ யோகம்)',
    nameEn: 'Malavya Yoga (Pancha Mahapurusha Yoga)',
    formulaTa: 'சுக்கிரன் தனது சொந்த வீடுகளான ரிஷபம், துலாம் அல்லது உச்ச வீடான மீனத்தில் நின்று, அந்த இடம் லக்ன கேந்திரமாக (1, 4, 7, 10) அமைவது.',
    sourceTa: 'கல்யாண வர்மாவின் சாராவளி மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம்.',
    benefitTa: 'வசீகர தோற்றம், கலைகளில் நிபுணத்துவம், ஆடம்பர வாகனங்கள் மற்றும் உயர் ரக வாழ்க்கைத் துணை அமையும் பாக்கியம்.',
  },
  13: {
    key: 'vasumati',
    nameTa: 'வசுமதி யோகம்',
    nameEn: 'Vasumati Yoga',
    formulaTa: 'லக்னத்திற்கோ அல்லது சந்திரனுக்கோ உபசய ஸ்தானங்களான 3, 6, 10, 11 ஆகிய இடங்களில் சுப கிரகங்கள் (குரு, சுக்கிரன், தனித்த புதன்) நிற்பது.',
    sourceTa: 'மந்திரேஸ்வரரின் பலதீபிகை (அத்தியாயம் 6) மற்றும் ஜாதக தத்துவம்.',
    benefitTa: 'பிறரிடம் கையேந்தாத தற்சார்பு, சொந்த உழைப்பில் குவியும் அபரிமிதமான அசையாச் சொத்துக்கள் மற்றும் பெரும் பண பலம்.',
  },
  14: {
    key: 'saraswati',
    nameTa: 'சரஸ்வதி யோகம்',
    nameEn: 'Saraswati Yoga',
    formulaTa: 'வித்யா காரகனான புதன், ஞான காரகனான குரு, கலை காரகனான சுக்கிரன் ஆகிய மூவரும் கேந்திரம், திரிகோணம் அல்லது 2-ஆம் வீட்டில் அமர்ந்து, இதில் குரு பகவான் ஆட்சி, உச்சம் அல்லது நட்பு வீடுகளில் பலம்பெறுவது.',
    sourceTa: 'ஜாதக பாரிஜாதம் மற்றும் அகத்தியர் அருளிய நாடி ஓலைச்சுவடிகள்.',
    benefitTa: 'உலகளாவிய கல்வி ஞானம், எழுத்து, கவிதை, அறிவியல் துறைகளில் முதன்மை வித்தகராக விளங்குதல்.',
  },
  15: {
    key: 'durudhara',
    nameTa: 'துரதுரா யோகம்',
    nameEn: 'Durudhara Yoga',
    formulaTa: 'சந்திரனுக்கு 2-ஆம் இடத்திலும் 12-ஆம் இடத்திலும் சூரியனைத் தவிர்த்து பிற கிரகங்கள் (குறிப்பாக சுப கிரகங்கள்) இருபுறமும் அமைவது.',
    sourceTa: 'பிருஹத் ஜாதகம் (அத்தியாயம் 13) மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம்.',
    benefitTa: 'பிறருக்கு உதவும் தாராள குணம், நிலையான செல்வ வளம், விசுவாசமான பணியாளர்கள் மற்றும் அமைதியான குடும்ப வாழ்க்கை.',
  },
  16: {
    key: 'ubhayachari',
    nameTa: 'உபயசாரி யோகம்',
    nameEn: 'Ubhayachari Yoga',
    formulaTa: 'சூரியனுக்கு 2-ஆம் இடத்திலும் 12-ஆம் இடத்திலும் சந்திரன் மற்றும் ராகு-கேது தவிர்த்த ஏனைய கிரகங்கள் அமைவது.',
    sourceTa: 'சாராவளி (அத்தியாயம் 13) மற்றும் ஜாதக அலங்காரம்.',
    benefitTa: 'அரசவையில் ஏற்புடைய பேச்சுவன்மை, தீர்க்கமான முடிவெடுக்கும் திறன், அதிகார மையங்களுடன் நேரடித் தொடர்பு.',
  },
  17: {
    key: 'chamara',
    nameTa: 'சாமர யோகம்',
    nameEn: 'Chamara Yoga',
    formulaTa: 'லக்னாதிபதி ஆட்சி அல்லது உச்சம் பெற்று கேந்திரத்தில் நிற்கும்போது, லக்னத்தை குரு பார்ப்பது அல்லது லக்னத்தில் சுப கிரகங்கள் அமர்வது.',
    sourceTa: 'பலதீபிகை (அத்தியாயம் 6, சுலோகம் 44-45).',
    benefitTa: 'சமுதாயத்தில் முடிசூடா மன்னனைப் போன்ற செல்வாக்கு, அறிஞர்களால் போற்றப்படும் மேதைமை மற்றும் அரசு கௌரவம்.',
  },
  18: {
    key: 'parvata',
    nameTa: 'பர்வத யோகம்',
    nameEn: 'Parvata Yoga',
    formulaTa: 'லக்ன கேந்திரங்களில் (1, 4, 7, 10) சுப கிரகங்கள் மட்டுமே நிற்க, 6 மற்றும் 8-ஆம் வீடுகள் பாவ கிரகங்கள் அற்ற வெற்று இடமாக அமைவது (அல்லது லக்னாதிபதியும் 12-ஆம் அதிபதியும் பரஸ்பர கேந்திரங்களில் நிற்பது).',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் சர்வார்த்த சிந்தாமணி.',
    benefitTa: 'நிலம், எஸ்டேட் போன்ற மலை போன்ற அசைக்க முடியாத சொத்துக்கள், நீடித்த குலப் பெருமை மற்றும் தலைமுறை கடந்த செல்வாக்கு.',
  },
  19: {
    key: 'mahabhagya',
    nameTa: 'மகாபாக்ய யோகம்',
    nameEn: 'Mahabhagya Yoga',
    formulaTa: 'ஆண் ஜாதகத்தில் பகலில் பிறந்து லக்னம், சூரியன், சந்திரன் ஆகிய மூன்றும் ஒற்றைப்படை (ஆண்) ராசிகளிலும்; பெண் ஜாதகத்தில் இரவில் பிறந்து லக்னம், சூரியன், சந்திரன் மூன்றும் இரட்டைப்படை (பெண்) ராசிகளிலும் அமைவது.',
    sourceTa: 'பிருஹத் ஜாதகம் மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம்.',
    benefitTa: 'பரம்பரை புண்ணிய பலன்கள் கூடிவருதல், தர்ம சிந்தனை, மக்கள் போற்றும் தூய நற்பெயர் மற்றும் பூரண ஆயுள்.',
  },
  20: {
    key: 'sasa',
    nameTa: 'சச யோகம் (பஞ்ச மகாபுருஷ யோகம்)',
    nameEn: 'Sasa Yoga (Pancha Mahapurusha Yoga)',
    formulaTa: 'சனி பகவான் தனது ஆட்சி வீடுகளான மகரம், கும்பம் அல்லது உச்ச வீடான துலாமில் நின்று, லக்னத்திற்கு கேந்திரமாக (1, 4, 7, 10) அமைவது.',
    sourceTa: 'சாராவளி மற்றும் ஓலைச்சுவடி மூலமான நந்தி வாக்கியம்.',
    benefitTa: 'மக்கள் சக்தி, பொதுவாழ்வு அல்லது அரசியலில் வலிமையான தலைமை, பல நிறுவனங்களை நிர்வகிக்கும் ஆளுமை மற்றும் வழுவாத நீதி நெறி.',
  },  21: {
    key: 'ruchaka',
    nameTa: 'ருசக யோகம் (பஞ்ச மகாபுருஷ யோகம்)',
    nameEn: 'Ruchaka Yoga (Pancha Mahapurusha Yoga)',
    formulaTa: 'செவ்வாய் பகவான் தனது ஆட்சி வீடுகளான மேஷம், விருச்சிகம் அல்லது உச்ச வீடான மகரத்தில் நின்று, அந்த இடம் லக்ன கேந்திரமாக (1, 4, 7, 10) அமைவது.',
    sourceTa: 'கல்யாண வர்மாவின் சாராவளி (அத்தியாயம் 37) மற்றும் வராகமிஹிரரின் பிருஹத் சம்ஹிதை.',
    benefitTa: 'அபாரமான உடல்பலம், தைரியம், பாதுகாப்பு அல்லது காவல் துறையில் தலைமைப் பதவி, நிலபுலன்களின் மீது ஆதிக்கம் மற்றும் எதிரிகளை அஞ்சவைக்கும் கம்பீரம்.',
  },
  22: {
    key: 'bhadra',
    nameTa: 'பத்ர யோகம் (பஞ்ச மகாபுருஷ யோகம்)',
    nameEn: 'Bhadra Yoga (Pancha Mahapurusha Yoga)',
    formulaTa: 'புதன் பகவான் தனது சொந்த வீடான மிதுனம் அல்லது ஆட்சி மற்றும் உச்ச வீடான கன்னியில் நின்று, லக்னத்திற்கு கேந்திரத்தில் (1, 4, 7, 10) அமைவது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் ஜாதக பாரிஜாதம்.',
    benefitTa: 'கூரிய மதிநுட்பம், நாவன்மை, கணிதம் மற்றும் வணிகத் துறையில் அபார வளர்ச்சி, சுதந்திரமான சிந்தனை மற்றும் நீண்ட ஆயுள்.',
  },
  23: {
    key: 'kalanidhi',
    nameTa: 'களநிதி யோகம்',
    nameEn: 'Kalanidhi Yoga',
    formulaTa: 'குரு பகவான் 2 அல்லது 9-ஆம் இடத்தில் அமர்ந்து புதன் மற்றும் சுக்கிரனால் பார்க்கப்படுவது (அல்லது சேர்க்கை பெறுவது); அல்லது புதன்/சுக்கிரனின் வீடுகளில் குரு அமர்ந்து சுபப் பார்வை பெறுவது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் ஓலைச்சுவடி மூலமான அகத்தியர் நாடி.',
    benefitTa: 'இசை, இலக்கியம், கலைகளில் மேன்மை, அனைத்து சுகபோகங்களும் அமையப் பெறுதல், நற்பண்புகள் மற்றும் பலரால் மதிக்கப்படும் யோகம்.',
  },
  24: {
    key: 'sunapha',
    nameTa: 'சுனபா யோகம்',
    nameEn: 'Sunapha Yoga',
    formulaTa: 'சந்திரனுக்கு 2-ஆம் இடத்தில் சூரியன், ராகு, கேது தவிர்த்த பிற கிரகங்கள் (செவ்வாய், புதன், குரு, சுக்கிரன் அல்லது சனி) அமைவது.',
    sourceTa: 'வராகமிஹிரரின் பிருஹத் ஜாதகம் (அத்தியாயம் 13) மற்றும் சாராவளி.',
    benefitTa: 'சொந்த உழைப்பால் சிறுகச் சிறுக பெரும் செல்வம் சேர்த்தல், தர்ம குணம், புத்தி கூர்மை மற்றும் சுதந்திரமான வாழ்வியல் நிலை.',
  },
  25: {
    key: 'anapha',
    nameTa: 'அனபா யோகம்',
    nameEn: 'Anapha Yoga',
    formulaTa: 'சந்திரனுக்கு 12-ஆம் இடத்தில் சூரியன், ராகு, கேது தவிர்த்த ஏனைய கிரகங்கள் அமைவது.',
    sourceTa: 'மந்திரேஸ்வரரின் பலதீபிகை (அத்தியாயம் 6) மற்றும் பிருஹத் ஜாதகம்.',
    benefitTa: 'மன அமைதி, எதிலும் நிதானமான போக்கு, கவர்ச்சிகரமான ஆளுமை, சிற்றின்ப சுகங்கள் குறைவின்றி கிடைத்தல் மற்றும் தாராள மனப்பான்மை.',
  },
  26: {
    key: 'vesi',
    nameTa: 'வேசி யோகம் (சுப வேசி)',
    nameEn: 'Vesi Yoga (Subha Vesi)',
    formulaTa: 'சூரியனுக்கு 2-ஆம் இடத்தில் சந்திரன், ராகு, கேது தவிர்த்த ஏனைய கிரகங்கள் (குறிப்பாக சுப கிரகங்கள்) அமைவது.',
    sourceTa: 'சாராவளி (அத்தியாயம் 14) மற்றும் ஜாதக அலங்காரம்.',
    benefitTa: 'கவர்ச்சியான வாக்கு வன்மை, நிதானமான நடத்தை, நேர்மையான வாழ்வு மற்றும் அரசாங்க அல்லது அதிகார மையங்களின் அங்கீகாரம்.',
  },
  27: {
    key: 'vasi',
    nameTa: 'வாசி யோகம் (சுப வாசி)',
    nameEn: 'Vasi Yoga (Subha Vasi)',
    formulaTa: 'சூரியனுக்கு 12-ஆம் இடத்தில் சந்திரன், ராகு, கேது தவிர்த்த ஏனைய கிரகங்கள் (குறிப்பாக சுப கிரகங்கள்) அமைவது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் பலதீபிகை.',
    benefitTa: 'சிறந்த நினைவாற்றல், தூரதேச பிரயாணங்கள் மூலம் யோகம், சாஸ்திர ஞானம் மற்றும் நேர்மறையான ஆளுமை.',
  },
  28: {
    key: 'shankha',
    nameTa: 'சங்க யோகம்',
    nameEn: 'Shankha Yoga',
    formulaTa: 'லக்னாதிபதி பலம் பெற்று நிற்க, 5 மற்றும் 6-ஆம் அதிபதிகள் பரஸ்பர கேந்திரங்களில் (1, 4, 7, 10) அமைவது (அல்லது லக்னாதிபதியும் 10-ஆம் அதிபதியும் சர ராசிகளில் நின்று 9-ஆம் அதிபதி உச்சம் பெறுவது).',
    sourceTa: 'ஜாதக பாரிஜாதம் மற்றும் சர்வார்த்த சிந்தாமணி.',
    benefitTa: 'தர்ம வழியில் ஈட்டிய பெருஞ்செல்வம், பரந்த நிலம் மற்றும் அசையாச் சொத்துக்கள், சாஸ்திர ஈடுபாடு மற்றும் பூரண ஆயுள்.',
  },
  29: {
    key: 'kahala',
    nameTa: 'காஹள யோகம்',
    nameEn: 'Kahala Yoga',
    formulaTa: '4-ஆம் அதிபதியும் 9-ஆம் அதிபதியும் பரஸ்பரம் கேந்திரங்களில் அமைந்திருக்க, லக்னாதிபதி ஆட்சி அல்லது உச்சம் பெற்று பலத்துடன் நிற்பது.',
    sourceTa: 'பலதீபிகை (அத்தியாயம் 6) மற்றும் புலிப்பாணி முனிவரின் புலிப்பாணி ஜோதிடம் 300.',
    benefitTa: 'தளராத மன உறுதி, நிறுவனங்கள் அல்லது பெரும்படையை வழிநடத்தும் ஆளுமை, துணிச்சலான நிர்வாகத் திறன் மற்றும் மக்கள் செல்வாக்கு.',
  },
  30: {
    key: 'srinatha',
    nameTa: 'ஸ்ரீநாத யோகம்',
    nameEn: 'Srinatha Yoga',
    formulaTa: '7-ஆம் அதிபதி கேந்திரத்தில் உச்சம் பெற்று நிற்க, அவருடன் 9 மற்றும் 10-ஆம் அதிபதிகள் தொடர்பு (இணைவு அல்லது சமசப்தம பார்வை) பெறுவது.',
    sourceTa: 'ஜாதக பாரிஜாதம் மற்றும் ஓலைச்சுவடி மூலமான தேவகேரளம் (சந்திரகலா நாடி).',
    benefitTa: 'வற்றாத லட்சுமி கடாட்சம், சமுதாயத்தில் உயர்ந்த கௌரவப் பதவி, இனிய பேச்சுத்திறன் மற்றும் அரசருக்கு நிகரான வாழ்க்கை வசதிகள்.',
  },
  31: {
    key: 'maha_subha_parivarthana',
    nameTa: 'மகா யோகம் (சுப பரிவர்த்தனை யோகம்)',
    nameEn: 'Maha Yoga (Subha Parivarthana Yoga)',
    formulaTa: 'கேந்திர (1, 4, 7, 10), திரிகோண (5, 9) மற்றும் தன-லாப (2, 11) ஸ்தானங்களின் அதிபதிகள் தங்களுக்குள் வீடுகளைப் பரிவர்த்தனை செய்து கொள்வது (இதில் மொத்தம் 28 வகைகள் உண்டு).',
    sourceTa: 'மந்திரேஸ்வரரின் பலதீபிகை (அத்தியாயம் 6) மற்றும் கல்யாண வர்மாவின் சாராவளி.',
    benefitTa: 'அரசாளும் தகுதி, வற்றாத பணப்புழக்கம், உயரிய வாகன வசதிகள் மற்றும் தலைமுறை காக்கும் செல்வம்.',
  },
  32: {
    key: 'subha_kartari',
    nameTa: 'சுபகர்த்தாரி யோகம்',
    nameEn: 'Subha Kartari Yoga',
    formulaTa: 'லக்னத்திற்கு (அல்லது சந்திரன், சூரியன் அல்லது ஏதேனும் ஒரு பாவத்திற்கு) 2-ஆம் இடத்திலும் 12-ஆம் இடத்திலும் இயற்கை சுபகிரகங்களான குரு, சுக்கிரன், வளர்பிறை சந்திரன், தனித்த புதன் அமைந்திருப்பது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் ஜாதக அலங்காரம்.',
    benefitTa: 'ஜாதகத்தின் தோஷங்களை விலக்கும் பாதுகாப்பு அரண், அழகிய தோற்றம், நோய்நொடியற்ற நீண்ட ஆயுள் மற்றும் காரிய சித்தி.',
  },
  33: {
    key: 'gauri',
    nameTa: 'கௌரி யோகம்',
    nameEn: 'Gauri Yoga',
    formulaTa: 'சந்திரன் நின்ற ராசிநாதன் உச்சம் அல்லது சொந்த வீட்டில் பலம்பெற்று கேந்திர/திரிகோணத்தில் நிற்க, சந்திரனை குரு பகவான் பார்ப்பது.',
    sourceTa: 'வைத்தியநாத தீட்சிதரின் ஜாதக பாரிஜாதம் (அத்தியாயம் 7) மற்றும் தேவகேரளம் (சந்திரகலா நாடி).',
    benefitTa: 'உயர்ந்த குலப் பெருமை, வசீகர முகம், தர்ம நெறி தவறாத பண்பு மற்றும் பொதுமக்களின் ஏகோபித்த அன்பு.',
  },
  34: {
    key: 'pushkala',
    nameTa: 'புஷ்கல யோகம்',
    nameEn: 'Pushkala Yoga',
    formulaTa: 'லக்னாதிபதியும் சந்திரனும் கூடி நிற்க, சந்திரனின் வீட்டு அதிபதி கேந்திரம் அல்லது திரிகோணத்தில் நின்று லக்னத்தை ஒரு சுபகிரகம் பார்ப்பது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் சர்வார்த்த சிந்தாமணி.',
    benefitTa: 'பேச்சாற்றல் மூலம் காரியங்களை சாதித்தல், அரசு நிர்வாகத்தில் நன்மதிப்பு மற்றும் உயர்ந்த மனிதர்களின் நட்பு.',
  },
  35: {
    key: 'bheri',
    nameTa: 'பேரி யோகம்',
    nameEn: 'Bheri Yoga',
    formulaTa: 'லக்னாதிபதி, குரு, சுக்கிரன் ஆகிய மூவரும் கேந்திரங்களில் (1, 4, 7, 10) நிற்க, 9-ஆம் அதிபதி ஆட்சி அல்லது உச்சம் பெற்று பலத்துடன் இருப்பது.',
    sourceTa: 'பலதீபிகை (அத்தியாயம் 6) மற்றும் ஜாதக தத்துவம்.',
    benefitTa: 'படைகள் அல்லது பெருநிறுவனங்களை வழிநடத்தும் அதிகாரம், ஆடல் பாடல் மற்றும் கலைகளில் ஆர்வம், நீடித்த சுகபோகம்.',
  },
  36: {
    key: 'brahma',
    nameTa: 'பிரம்ம யோகம்',
    nameEn: 'Brahma Yoga',
    formulaTa: '9-ஆம் அதிபதிக்கு கேந்திரத்தில் குருவும், 11-ஆம் அதிபதிக்கு கேந்திரத்தில் சுக்கிரனும், லக்னம் அல்லது 10-ஆம் அதிபதிக்கு கேந்திரத்தில் புதனும் அமைவது.',
    sourceTa: 'ஜாதக பாரிஜாதம் மற்றும் ஓலைச்சுவடி மூலமான அகத்தியர் பன்னிரு காண்டம்.',
    benefitTa: 'வேதம், தத்துவம், வானவியல் சாஸ்திரங்களில் ஆழமான புலமை, சாந்தமான உள்ளம் மற்றும் உலக அறிஞர்களால் போற்றப்படும் மேன்மை.',
  },
  37: {
    key: 'shiva',
    nameTa: 'சிவ யோகம்',
    nameEn: 'Shiva Yoga',
    formulaTa: '5-ஆம் அதிபதி 9-ஆம் வீட்டிலும், 9-ஆம் அதிபதி 10-ஆம் வீட்டிலும், 10-ஆம் அதிபதி 5-ஆம் வீட்டிலும் பரிவர்த்தனை அல்லது ஒருவருக்கொருவர் தொடர்பு பெற்று அமைவது.',
    sourceTa: 'சம்போரா சம்ஹிதை மற்றும் சித்தர்களின் புலிப்பாணி சோதிடம் 300.',
    benefitTa: 'தெய்வீக அருள், தியானம் மற்றும் யோக ஆற்றல், பொது அறக்கட்டளைகளை நிறுவும் தர்ம குணம் மற்றும் அழியாத புகழ்.',
  },
  38: {
    key: 'kurma',
    nameTa: 'கூர்ம யோகம்',
    nameEn: 'Kurma Yoga',
    formulaTa: '5, 6, 7 ஆகிய வீடுகளில் சுப கிரகங்கள் தங்கள் சொந்த அல்லது உச்ச வீடுகளில் நிற்க, 1, 3, 11 ஆகிய உபசய ஸ்தானங்களில் பாவ கிரகங்கள் பலம் பெற்று நிற்பது.',
    sourceTa: 'சாராவளி (அத்தியாயம் 36) மற்றும் பிருஹத் பராசர ஹோரா சாஸ்திரம்.',
    benefitTa: 'ஆமை போன்ற அசைக்க முடியாத நிதானம், நெருக்கடிகளில் தற்காத்துக் கொள்ளும் சாமர்த்தியம், ஊர் போற்றும் தலைமை மற்றும் பூமி யோகம்.',
  },
  39: {
    key: 'bhaskara',
    nameTa: 'பாஸ்கர யோகம்',
    nameEn: 'Bhaskara Yoga',
    formulaTa: 'புதனுக்கு 2-ஆம் இடத்தில் சூரியன், சூரியனுக்கு 11-ஆம் இடத்தில் சந்திரன், சந்திரனுக்கு 5 அல்லது 9-ஆம் இடத்தில் குரு அமைவது.',
    sourceTa: 'வராகமிஹிரரின் பிருஹத் ஜாதகம் மற்றும் சாராவளி.',
    benefitTa: 'சூரியனைப் போன்ற கம்பீரமான ஆளுமை, கணிதம், ஜோதிடம், இசை போன்ற நுண்ணிய கலைகளில் நிகரற்ற தேர்ச்சி.',
  },
  40: {
    key: 'veena_vallaki',
    nameTa: 'வீணா யோகம் (வல்லகீ யோகம் - நாபஸ யோகம்)',
    nameEn: 'Veena Yoga (Vallaki / Nabhasa Yoga)',
    formulaTa: 'ராகு-கேது தவிர்த்த மற்ற 7 கிரகங்களும் ஏதேனும் 7 தனித்தனி ராசிகளில் பரவி நிற்பது.',
    sourceTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம் மற்றும் பிருஹத் ஜாதகம் (நாபஸ யோக அத்தியாயம்).',
    benefitTa: 'நுண்கலை மற்றும் இசையில் இயல்பான ஞானம், நயமான பேச்சு, சுகபோக வாழ்க்கை மற்றும் ஏராளமான நண்பர்களைக் கொண்டிருத்தல்.',
  },
};

function getPlanet(planets, key) {
  return (planets || []).find((p) => p.key === key) || null;
}

function rasiFromHouse(lagnaRasiNo, houseNo) {
  return ((lagnaRasiNo + houseNo - 2) % 12) + 1;
}

function houseFromRasi(lagnaRasiNo, rasiNo) {
  return ((rasiNo - lagnaRasiNo + 12) % 12) + 1;
}

function relativeHouse(fromRasiNo, toRasiNo) {
  return ((toRasiNo - fromRasiNo + 12) % 12) + 1;
}

function planetForHouseLord(lagna, planets, houseNo) {
  const rasiNo = rasiFromHouse(lagna.rasiNo, houseNo);
  const key = SIGN_LORD_KEYS[rasiNo];
  return { houseNo, rasiNo, key, planet: getPlanet(planets, key) };
}

function isKendraFromRasi(referenceRasiNo, targetRasiNo) {
  return [1, 4, 7, 10].includes(relativeHouse(referenceRasiNo, targetRasiNo));
}

function isKendraOrTrineFromLagna(lagna, planet) {
  if (!planet) return false;
  return [1, 4, 5, 7, 9, 10].includes(houseFromRasi(lagna.rasiNo, planet.rasiNo));
}

function isOwnOrExalted(planetKey, rasiNo) {
  return (OWN_SIGNS[planetKey] || []).includes(rasiNo) || EXALTED_SIGNS[planetKey] === rasiNo;
}

function isOppositeRasi(a, b) {
  return relativeHouse(a, b) === 7;
}

function isMovableSign(rasiNo) {
  return [1, 4, 7, 10].includes(rasiNo);
}

function hasConjunctionOrAspect(planets, aspects, fromKey, targetPlanet) {
  const from = getPlanet(planets, fromKey);
  if (!from || !targetPlanet) return false;
  return from.rasiNo === targetPlanet.rasiNo || aspectsRasi(aspects, fromKey, targetPlanet.rasiNo);
}

function areExchanged(a, b) {
  if (!a?.planet || !b?.planet) return false;
  return a.planet.rasiNo === b.rasiNo && b.planet.rasiNo === a.rasiNo;
}

function aspectsRasi(aspects, planetKey, targetRasiNo) {
  return (aspects || []).some((a) => a.fromKey === planetKey && a.toRasi === targetRasiNo);
}

function planetsInRasi(planets, rasiNo, excludedKeys = []) {
  return (planets || []).filter((p) => p.rasiNo === rasiNo && !excludedKeys.includes(p.key));
}

function isWaxingMoon(planets) {
  const sun = getPlanet(planets, 'sun');
  const moon = getPlanet(planets, 'moon');
  if (!sun || !moon) return false;
  const elongation = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
  return elongation > 0 && elongation < 180;
}


function isPlanetAloneAmongClassicalPlanets(planets, planet) {
  if (!planet) return false;
  const classicalKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const occupants = (planets || []).filter((p) => p.rasiNo === planet.rasiNo && classicalKeys.includes(p.key));
  return occupants.length === 1 && occupants[0].key === planet.key;
}

function normalizeGender(gender) {
  const value = String(gender || '').trim().toLowerCase();
  if (['male', 'm', 'ஆண்', 'aan', 'man'].includes(value)) return 'male';
  if (['female', 'f', 'பெண்', 'pen', 'woman'].includes(value)) return 'female';
  return value || null;
}

function deriveDayBirthAstronomically(birthDate, latitude, longitude) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const Astronomy = require('astronomy-engine');
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const searchStart = new Date(birthDate.getTime() - 36 * 60 * 60 * 1000);

  const collect = (direction) => {
    const events = [];
    let cursor = new Date(searchStart.getTime());
    for (let i = 0; i < 4; i += 1) {
      const event = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, direction, cursor, 3);
      if (!event?.date) break;
      events.push(event.date);
      cursor = new Date(event.date.getTime() + 60 * 1000);
    }
    return events;
  };

  const sunrises = collect(+1);
  const sunsets = collect(-1);
  const birthMs = birthDate.getTime();
  const previousSunrise = [...sunrises].reverse().find((d) => d.getTime() <= birthMs);
  const previousSunset = [...sunsets].reverse().find((d) => d.getTime() <= birthMs);
  const nextSunset = sunsets.find((d) => d.getTime() > birthMs);

  if (!previousSunrise || !nextSunset) return null;
  return previousSunrise.getTime() <= birthMs && birthMs < nextSunset.getTime() &&
    (!previousSunset || previousSunrise.getTime() > previousSunset.getTime());
}

function result(ruleNo, matched, details = {}) {
  const src = SOURCE_RULES[ruleNo];
  return {
    ruleNo,
    key: src.key,
    matched: Boolean(matched),
    name: src.nameTa,
    nameTa: src.nameTa,
    nameEn: src.nameEn,
    formula: src.formulaTa,
    formulaTa: src.formulaTa,
    source: src.sourceTa,
    sourceTa: src.sourceTa,
    benefit: src.benefitTa,
    benefitTa: src.benefitTa,
    details,
  };
}

function evaluateRule1({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const jupiter = getPlanet(planets, 'jupiter');
  const relative = moon && jupiter ? relativeHouse(moon.rasiNo, jupiter.rasiNo) : null;
  return result(1, [1, 4, 7, 10].includes(relative), {
    moonRasiNo: moon?.rasiNo ?? null,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    jupiterHouseFromMoon: relative,
  });
}

function evaluateRule2({ lagna, planets }) {
  const h9 = planetForHouseLord(lagna, planets, 9);
  const h10 = planetForHouseLord(lagna, planets, 10);
  const conjunction = Boolean(h9.planet && h10.planet && h9.planet.rasiNo === h10.planet.rasiNo);
  const opposition = Boolean(h9.planet && h10.planet && isOppositeRasi(h9.planet.rasiNo, h10.planet.rasiNo));
  const exchange = areExchanged(h9, h10);
  return result(2, conjunction || opposition || exchange, {
    ninthLordKey: h9.key,
    tenthLordKey: h10.key,
    conjunction,
    opposition,
    exchange,
  });
}

function evaluateRule3({ lagna, planets }) {
  const moon = getPlanet(planets, 'moon');
  const matches = [];
  for (const [planetKey, debSign] of Object.entries(DEBILITATED_SIGNS)) {
    const p = getPlanet(planets, planetKey);
    if (!p || p.rasiNo !== debSign) continue;
    const dispositorKey = SIGN_LORD_KEYS[debSign];
    const exaltationPlanetKey = EXALTATION_PLANET_BY_SIGN[debSign];
    const dispositor = getPlanet(planets, dispositorKey);
    const exaltationPlanet = getPlanet(planets, exaltationPlanetKey);
    const dispositorKendraFromLagna = Boolean(dispositor && isKendraFromRasi(lagna.rasiNo, dispositor.rasiNo));
    const dispositorKendraFromMoon = Boolean(moon && dispositor && isKendraFromRasi(moon.rasiNo, dispositor.rasiNo));
    const exaltationPlanetKendraFromLagna = Boolean(exaltationPlanet && isKendraFromRasi(lagna.rasiNo, exaltationPlanet.rasiNo));
    const exaltationPlanetKendraFromMoon = Boolean(moon && exaltationPlanet && isKendraFromRasi(moon.rasiNo, exaltationPlanet.rasiNo));
    const matched = dispositorKendraFromLagna || dispositorKendraFromMoon || exaltationPlanetKendraFromLagna || exaltationPlanetKendraFromMoon;
    if (matched) {
      matches.push({
        debilitatedPlanetKey: planetKey,
        debilitatedRasiNo: debSign,
        dispositorKey,
        exaltationPlanetKey,
        dispositorKendraFromLagna,
        dispositorKendraFromMoon,
        exaltationPlanetKendraFromLagna,
        exaltationPlanetKendraFromMoon,
      });
    }
  }
  return result(3, matches.length > 0, { matches });
}

function evaluateRule4({ lagna, planets, aspects }) {
  const lords = [6, 8, 12].map((h) => planetForHouseLord(lagna, planets, h));
  const exchanges = [];
  for (let i = 0; i < lords.length; i++) {
    for (let j = i + 1; j < lords.length; j++) {
      if (areExchanged(lords[i], lords[j])) {
        exchanges.push({ houseA: lords[i].houseNo, houseB: lords[j].houseNo, lordAKey: lords[i].key, lordBKey: lords[j].key });
      }
    }
  }

  const beneficKeys = ['jupiter', 'venus', 'mercury', 'moon'];
  const conjunctions = [];
  for (const dusthanaHouse of [6, 8, 12]) {
    const targetRasiNo = rasiFromHouse(lagna.rasiNo, dusthanaHouse);
    const dusthanaLordsThere = lords.filter((x) => x.planet?.rasiNo === targetRasiNo);
    if (dusthanaLordsThere.length < 2) continue;
    const beneficAspects = beneficKeys.filter((key) => aspectsRasi(aspects, key, targetRasiNo));
    if (beneficAspects.length === 0) {
      conjunctions.push({
        houseNo: dusthanaHouse,
        rasiNo: targetRasiNo,
        lordKeys: [...new Set(dusthanaLordsThere.map((x) => x.key))],
        beneficAspects,
      });
    }
  }

  return result(4, exchanges.length > 0 || conjunctions.length > 0, {
    exchanges,
    dusthanaConjunctionsWithoutBeneficAspect: conjunctions,
    beneficKeysUsed: beneficKeys,
  });
}

function evaluateRule5({ lagna, planets }) {
  const jupiter = getPlanet(planets, 'jupiter');
  const house = jupiter ? houseFromRasi(lagna.rasiNo, jupiter.rasiNo) : null;
  const ownOrExalted = Boolean(jupiter && isOwnOrExalted('jupiter', jupiter.rasiNo));
  return result(5, ownOrExalted && [1, 4, 7, 10].includes(house), {
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    jupiterHouse: house,
    ownOrExalted,
  });
}

function evaluateRule6({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const mars = getPlanet(planets, 'mars');
  const conjunction = Boolean(moon && mars && moon.rasiNo === mars.rasiNo);
  const opposition = Boolean(moon && mars && isOppositeRasi(moon.rasiNo, mars.rasiNo));
  return result(6, conjunction || opposition, {
    moonRasiNo: moon?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    conjunction,
    mutualSeventhAspect: opposition,
  });
}

function evaluateRule7({ planets }) {
  const sun = getPlanet(planets, 'sun');
  const mercury = getPlanet(planets, 'mercury');
  const conjunction = Boolean(sun && mercury && sun.rasiNo === mercury.rasiNo);
  return result(7, conjunction, {
    sunRasiNo: sun?.rasiNo ?? null,
    mercuryRasiNo: mercury?.rasiNo ?? null,
    conjunction,
    mercuryCombust: mercury?.combust ?? null,
    note: 'Client formula treats same-Rasi conjunction as the core condition; non-combust placement is stated as preferable, not mandatory.',
  });
}

function evaluateRule8({ lagna, planets }) {
  const moon = getPlanet(planets, 'moon');
  const waxingMoon = isWaxingMoon(planets);
  const candidateKeys = ['jupiter', 'venus', 'mercury'];
  if (waxingMoon) candidateKeys.push('moon');

  const matches = [];
  for (const key of candidateKeys) {
    const p = getPlanet(planets, key);
    if (!p) continue;
    const tenthFromLagna = relativeHouse(lagna.rasiNo, p.rasiNo) === 10;
    const tenthFromMoon = Boolean(moon && relativeHouse(moon.rasiNo, p.rasiNo) === 10);
    const occupants = planetsInRasi(planets, p.rasiNo, ['rahu', 'ketu', 'mandi']);
    const alone = occupants.length === 1 && occupants[0].key === p.key;
    if ((tenthFromLagna || tenthFromMoon) && alone) {
      matches.push({ key, rasiNo: p.rasiNo, tenthFromLagna, tenthFromMoon, alone });
    }
  }

  return result(8, matches.length > 0, {
    waxingMoon,
    candidateKeys,
    matches,
  });
}

function evaluateRule9({ lagna, planets }) {
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const venus = getPlanet(planets, 'venus');
  const ninthLordHouse = ninthLord.planet ? houseFromRasi(lagna.rasiNo, ninthLord.planet.rasiNo) : null;
  const ninthLordStrong = Boolean(ninthLord.planet && isOwnOrExalted(ninthLord.key, ninthLord.planet.rasiNo));
  const ninthLordKendraOrTrine = [1, 4, 5, 7, 9, 10].includes(ninthLordHouse);
  const venusHouse = venus ? houseFromRasi(lagna.rasiNo, venus.rasiNo) : null;
  const venusOwnOrExalted = Boolean(venus && isOwnOrExalted('venus', venus.rasiNo));
  const venusKendra = [1, 4, 7, 10].includes(venusHouse);

  return result(9, ninthLordStrong && ninthLordKendraOrTrine && venusOwnOrExalted && venusKendra, {
    ninthLordKey: ninthLord.key,
    ninthLordRasiNo: ninthLord.planet?.rasiNo ?? null,
    ninthLordHouse,
    ninthLordStrong,
    strengthConvention: 'For this batch, “பலம்பெற்று” is evaluated as own-sign or exalted strength using the existing API strength convention.',
    venusRasiNo: venus?.rasiNo ?? null,
    venusHouse,
    venusOwnOrExalted,
    venusKendra,
  });
}

function evaluateRule10({ planets }) {
  const jupiter = getPlanet(planets, 'jupiter');
  const mars = getPlanet(planets, 'mars');
  const conjunction = Boolean(jupiter && mars && jupiter.rasiNo === mars.rasiNo);
  const relation = jupiter && mars ? relativeHouse(jupiter.rasiNo, mars.rasiNo) : null;
  const trinalRelation = [5, 9].includes(relation);
  return result(10, conjunction || trinalRelation, {
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    conjunction,
    marsHouseFromJupiter: relation,
    trinalRelation,
  });
}


function evaluateRule11({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const keys = ['jupiter', 'venus', 'mercury'];
  const positions = {};
  const allInRequiredHouses = Boolean(moon) && keys.every((key) => {
    const p = getPlanet(planets, key);
    const h = p ? relativeHouse(moon.rasiNo, p.rasiNo) : null;
    positions[key] = h;
    return [6, 7, 8].includes(h);
  });
  return result(11, allInRequiredHouses, {
    moonRasiNo: moon?.rasiNo ?? null,
    housesFromMoon: positions,
    convention: 'Jupiter, Venus and Mercury are each required to occupy one of the 6th, 7th or 8th houses from Moon.',
  });
}

function evaluateRule12({ lagna, planets }) {
  const venus = getPlanet(planets, 'venus');
  const house = venus ? houseFromRasi(lagna.rasiNo, venus.rasiNo) : null;
  const ownOrExalted = Boolean(venus && isOwnOrExalted('venus', venus.rasiNo));
  return result(12, ownOrExalted && [1, 4, 7, 10].includes(house), {
    venusRasiNo: venus?.rasiNo ?? null,
    venusHouse: house,
    ownOrExalted,
  });
}

function evaluateRule13({ lagna, planets }) {
  const moon = getPlanet(planets, 'moon');
  const keys = ['jupiter', 'venus', 'mercury'];
  const upachaya = [3, 6, 10, 11];
  const housesFromLagna = {};
  const housesFromMoon = {};
  for (const key of keys) {
    const p = getPlanet(planets, key);
    housesFromLagna[key] = p ? relativeHouse(lagna.rasiNo, p.rasiNo) : null;
    housesFromMoon[key] = moon && p ? relativeHouse(moon.rasiNo, p.rasiNo) : null;
  }
  const mercury = getPlanet(planets, 'mercury');
  const mercuryAlone = isPlanetAloneAmongClassicalPlanets(planets, mercury);
  const allFromLagna = keys.every((key) => upachaya.includes(housesFromLagna[key]));
  const allFromMoon = Boolean(moon) && keys.every((key) => upachaya.includes(housesFromMoon[key]));
  return result(13, mercuryAlone && (allFromLagna || allFromMoon), {
    housesFromLagna,
    housesFromMoon,
    mercuryAlone,
    matchedReference: allFromLagna ? 'lagna' : allFromMoon ? 'moon' : null,
    convention: '“தனித்த புதன்” is evaluated as Mercury being the only classical planet in its Rasi.',
  });
}

function evaluateRule14({ lagna, planets }) {
  const allowedHouses = [1, 2, 4, 5, 7, 9, 10];
  const keys = ['mercury', 'jupiter', 'venus'];
  const houses = {};
  const allPlaced = keys.every((key) => {
    const p = getPlanet(planets, key);
    const h = p ? houseFromRasi(lagna.rasiNo, p.rasiNo) : null;
    houses[key] = h;
    return allowedHouses.includes(h);
  });
  const jupiter = getPlanet(planets, 'jupiter');
  const jupiterOwn = Boolean(jupiter && (OWN_SIGNS.jupiter || []).includes(jupiter.rasiNo));
  const jupiterExalted = Boolean(jupiter && EXALTED_SIGNS.jupiter === jupiter.rasiNo);
  const jupiterFriendly = Boolean(jupiter && JUPITER_FRIENDLY_SIGNS.includes(jupiter.rasiNo));
  const jupiterStrong = jupiterOwn || jupiterExalted || jupiterFriendly;
  return result(14, allPlaced && jupiterStrong, {
    houses,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    jupiterOwn,
    jupiterExalted,
    jupiterFriendly,
    jupiterStrong,
  });
}

function evaluateRule15({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const secondRasi = moon ? rasiFromHouse(moon.rasiNo, 2) : null;
  const twelfthRasi = moon ? rasiFromHouse(moon.rasiNo, 12) : null;
  const secondOccupants = moon ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === secondRasi) : [];
  const twelfthOccupants = moon ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === twelfthRasi) : [];
  return result(15, secondOccupants.length > 0 && twelfthOccupants.length > 0, {
    moonRasiNo: moon?.rasiNo ?? null,
    secondRasiNo: secondRasi,
    twelfthRasiNo: twelfthRasi,
    secondOccupants,
    twelfthOccupants,
    eligibleKeys,
  });
}

function evaluateRule16({ planets }) {
  const sun = getPlanet(planets, 'sun');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const secondRasi = sun ? rasiFromHouse(sun.rasiNo, 2) : null;
  const twelfthRasi = sun ? rasiFromHouse(sun.rasiNo, 12) : null;
  const secondOccupants = sun ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === secondRasi) : [];
  const twelfthOccupants = sun ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === twelfthRasi) : [];
  return result(16, secondOccupants.length > 0 && twelfthOccupants.length > 0, {
    sunRasiNo: sun?.rasiNo ?? null,
    secondRasiNo: secondRasi,
    twelfthRasiNo: twelfthRasi,
    secondOccupants,
    twelfthOccupants,
    excludedKeys: ['moon', 'rahu', 'ketu'],
  });
}

function evaluateRule17({ lagna, planets, aspects }) {
  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const lordHouse = lagnaLord.planet ? houseFromRasi(lagna.rasiNo, lagnaLord.planet.rasiNo) : null;
  const lordOwnOrExalted = Boolean(lagnaLord.planet && isOwnOrExalted(lagnaLord.key, lagnaLord.planet.rasiNo));
  const lordInKendra = [1, 4, 7, 10].includes(lordHouse);
  const jupiterAspectsLagna = aspectsRasi(aspects, 'jupiter', lagna.rasiNo);
  const waxingMoon = isWaxingMoon(planets);
  const beneficKeys = ['jupiter', 'venus', 'mercury', ...(waxingMoon ? ['moon'] : [])];
  const beneficsInLagna = beneficKeys.filter((key) => getPlanet(planets, key)?.rasiNo === lagna.rasiNo);
  const supportingCondition = jupiterAspectsLagna || beneficsInLagna.length > 0;
  return result(17, lordOwnOrExalted && lordInKendra && supportingCondition, {
    lagnaLordKey: lagnaLord.key,
    lagnaLordRasiNo: lagnaLord.planet?.rasiNo ?? null,
    lagnaLordHouse: lordHouse,
    lagnaLordOwnOrExalted: lordOwnOrExalted,
    lagnaLordInKendra: lordInKendra,
    jupiterAspectsLagna,
    waxingMoon,
    beneficsInLagna,
  });
}

function evaluateRule18({ lagna, planets }) {
  const waxingMoon = isWaxingMoon(planets);
  const beneficKeys = ['jupiter', 'venus', 'mercury', ...(waxingMoon ? ['moon'] : [])];
  const classicalKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const kendraHouses = [1, 4, 7, 10];
  const kendraOccupants = classicalKeys
    .map((key) => getPlanet(planets, key))
    .filter(Boolean)
    .filter((p) => kendraHouses.includes(houseFromRasi(lagna.rasiNo, p.rasiNo)));
  const hasBeneficInKendra = kendraOccupants.some((p) => beneficKeys.includes(p.key));
  const onlyBeneficsInKendra = kendraOccupants.every((p) => beneficKeys.includes(p.key));
  const house6Rasi = rasiFromHouse(lagna.rasiNo, 6);
  const house8Rasi = rasiFromHouse(lagna.rasiNo, 8);
  const house6Occupants = classicalKeys.filter((key) => getPlanet(planets, key)?.rasiNo === house6Rasi);
  const house8Occupants = classicalKeys.filter((key) => getPlanet(planets, key)?.rasiNo === house8Rasi);
  const firstBranch = hasBeneficInKendra && onlyBeneficsInKendra && house6Occupants.length === 0 && house8Occupants.length === 0;

  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const twelfthLord = planetForHouseLord(lagna, planets, 12);
  const mutualKendra = Boolean(lagnaLord.planet && twelfthLord.planet &&
    [1, 4, 7, 10].includes(relativeHouse(lagnaLord.planet.rasiNo, twelfthLord.planet.rasiNo)));

  return result(18, firstBranch || mutualKendra, {
    firstBranch,
    kendraOccupants: kendraOccupants.map((p) => p.key),
    beneficKeysUsed: beneficKeys,
    house6Occupants,
    house8Occupants,
    alternateBranch: {
      lagnaLordKey: lagnaLord.key,
      twelfthLordKey: twelfthLord.key,
      mutualKendra,
    },
  });
}

function evaluateRule19({ lagna, planets, gender, birthDate, latitude, longitude, isDayBirth }) {
  const sun = getPlanet(planets, 'sun');
  const moon = getPlanet(planets, 'moon');
  const normalizedGender = normalizeGender(gender);
  const dayBirth = typeof isDayBirth === 'boolean'
    ? isDayBirth
    : deriveDayBirthAstronomically(birthDate, latitude, longitude);
  const rasis = [lagna?.rasiNo, sun?.rasiNo, moon?.rasiNo];
  const allOdd = rasis.every((x) => Number.isInteger(x) && x % 2 === 1);
  const allEven = rasis.every((x) => Number.isInteger(x) && x % 2 === 0);
  const maleMatch = normalizedGender === 'male' && dayBirth === true && allOdd;
  const femaleMatch = normalizedGender === 'female' && dayBirth === false && allEven;
  return result(19, maleMatch || femaleMatch, {
    gender: normalizedGender,
    isDayBirth: dayBirth,
    lagnaRasiNo: lagna?.rasiNo ?? null,
    sunRasiNo: sun?.rasiNo ?? null,
    moonRasiNo: moon?.rasiNo ?? null,
    allOdd,
    allEven,
    dayNightMethod: typeof isDayBirth === 'boolean' ? 'provided-test-override' : 'astronomical-sunrise-sunset',
  });
}

function evaluateRule20({ lagna, planets }) {
  const saturn = getPlanet(planets, 'saturn');
  const house = saturn ? houseFromRasi(lagna.rasiNo, saturn.rasiNo) : null;
  const ownOrExalted = Boolean(saturn && isOwnOrExalted('saturn', saturn.rasiNo));
  return result(20, ownOrExalted && [1, 4, 7, 10].includes(house), {
    saturnRasiNo: saturn?.rasiNo ?? null,
    saturnHouse: house,
    ownOrExalted,
  });
}



function evaluateRule21({ lagna, planets }) {
  const mars = getPlanet(planets, 'mars');
  const house = mars ? houseFromRasi(lagna.rasiNo, mars.rasiNo) : null;
  const ownOrExalted = Boolean(mars && isOwnOrExalted('mars', mars.rasiNo));
  return result(21, ownOrExalted && [1, 4, 7, 10].includes(house), {
    marsRasiNo: mars?.rasiNo ?? null,
    marsHouse: house,
    ownOrExalted,
  });
}

function evaluateRule22({ lagna, planets }) {
  const mercury = getPlanet(planets, 'mercury');
  const house = mercury ? houseFromRasi(lagna.rasiNo, mercury.rasiNo) : null;
  const ownOrExalted = Boolean(mercury && isOwnOrExalted('mercury', mercury.rasiNo));
  return result(22, ownOrExalted && [1, 4, 7, 10].includes(house), {
    mercuryRasiNo: mercury?.rasiNo ?? null,
    mercuryHouse: house,
    ownOrExalted,
  });
}

function evaluateRule23({ lagna, planets, aspects }) {
  const jupiter = getPlanet(planets, 'jupiter');
  const jupiterHouse = jupiter ? houseFromRasi(lagna.rasiNo, jupiter.rasiNo) : null;
  const mercuryRelation = hasConjunctionOrAspect(planets, aspects, 'mercury', jupiter);
  const venusRelation = hasConjunctionOrAspect(planets, aspects, 'venus', jupiter);
  const firstBranch = [2, 9].includes(jupiterHouse) && mercuryRelation && venusRelation;

  const mercuryVenusSigns = [...OWN_SIGNS.mercury, ...OWN_SIGNS.venus];
  const jupiterInMercuryOrVenusSign = Boolean(jupiter && mercuryVenusSigns.includes(jupiter.rasiNo));
  const waxingMoon = isWaxingMoon(planets);
  const beneficKeys = ['mercury', 'venus', ...(waxingMoon ? ['moon'] : [])];
  const beneficAspects = jupiter
    ? beneficKeys.filter((key) => aspectsRasi(aspects, key, jupiter.rasiNo))
    : [];
  const secondBranch = jupiterInMercuryOrVenusSign && beneficAspects.length > 0;

  return result(23, firstBranch || secondBranch, {
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    jupiterHouse,
    firstBranch: { mercuryRelation, venusRelation, matched: firstBranch },
    secondBranch: { jupiterInMercuryOrVenusSign, beneficAspects, matched: secondBranch },
    convention: 'In branch 1, both Mercury and Venus must conjoin or aspect Jupiter. In branch 2, benefic aspect uses Mercury/Venus and waxing Moon when applicable.',
  });
}

function evaluateRule24({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const secondRasiNo = moon ? rasiFromHouse(moon.rasiNo, 2) : null;
  const occupants = moon ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === secondRasiNo) : [];
  return result(24, occupants.length > 0, {
    moonRasiNo: moon?.rasiNo ?? null,
    secondRasiNo,
    occupants,
    excludedKeys: ['sun', 'rahu', 'ketu'],
  });
}

function evaluateRule25({ planets }) {
  const moon = getPlanet(planets, 'moon');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const twelfthRasiNo = moon ? rasiFromHouse(moon.rasiNo, 12) : null;
  const occupants = moon ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === twelfthRasiNo) : [];
  return result(25, occupants.length > 0, {
    moonRasiNo: moon?.rasiNo ?? null,
    twelfthRasiNo,
    occupants,
    excludedKeys: ['sun', 'rahu', 'ketu'],
  });
}

function evaluateRule26({ planets }) {
  const sun = getPlanet(planets, 'sun');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const secondRasiNo = sun ? rasiFromHouse(sun.rasiNo, 2) : null;
  const occupants = sun ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === secondRasiNo) : [];
  return result(26, occupants.length > 0, {
    sunRasiNo: sun?.rasiNo ?? null,
    secondRasiNo,
    occupants,
    excludedKeys: ['moon', 'rahu', 'ketu'],
  });
}

function evaluateRule27({ planets }) {
  const sun = getPlanet(planets, 'sun');
  const eligibleKeys = ['mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const twelfthRasiNo = sun ? rasiFromHouse(sun.rasiNo, 12) : null;
  const occupants = sun ? eligibleKeys.filter((key) => getPlanet(planets, key)?.rasiNo === twelfthRasiNo) : [];
  return result(27, occupants.length > 0, {
    sunRasiNo: sun?.rasiNo ?? null,
    twelfthRasiNo,
    occupants,
    excludedKeys: ['moon', 'rahu', 'ketu'],
  });
}

function evaluateRule28({ lagna, planets }) {
  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const fifthLord = planetForHouseLord(lagna, planets, 5);
  const sixthLord = planetForHouseLord(lagna, planets, 6);
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const tenthLord = planetForHouseLord(lagna, planets, 10);

  const lagnaLordStrong = Boolean(lagnaLord.planet && isOwnOrExalted(lagnaLord.key, lagnaLord.planet.rasiNo));
  const fifthSixthMutualKendra = Boolean(fifthLord.planet && sixthLord.planet &&
    [1, 4, 7, 10].includes(relativeHouse(fifthLord.planet.rasiNo, sixthLord.planet.rasiNo)));
  const firstBranch = lagnaLordStrong && fifthSixthMutualKendra;

  const lagnaLordMovable = Boolean(lagnaLord.planet && isMovableSign(lagnaLord.planet.rasiNo));
  const tenthLordMovable = Boolean(tenthLord.planet && isMovableSign(tenthLord.planet.rasiNo));
  const ninthLordExalted = Boolean(ninthLord.planet && EXALTED_SIGNS[ninthLord.key] === ninthLord.planet.rasiNo);
  const secondBranch = lagnaLordMovable && tenthLordMovable && ninthLordExalted;

  return result(28, firstBranch || secondBranch, {
    firstBranch: {
      lagnaLordKey: lagnaLord.key,
      lagnaLordStrong,
      fifthLordKey: fifthLord.key,
      sixthLordKey: sixthLord.key,
      fifthSixthMutualKendra,
      matched: firstBranch,
    },
    secondBranch: {
      lagnaLordMovable,
      tenthLordKey: tenthLord.key,
      tenthLordMovable,
      ninthLordKey: ninthLord.key,
      ninthLordExalted,
      matched: secondBranch,
    },
    strengthConvention: '“லக்னாதிபதி பலம்” is evaluated as own-sign or exalted strength, consistent with the prior Yoga batch convention.',
  });
}

function evaluateRule29({ lagna, planets }) {
  const fourthLord = planetForHouseLord(lagna, planets, 4);
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const fourthNinthMutualKendra = Boolean(fourthLord.planet && ninthLord.planet &&
    [1, 4, 7, 10].includes(relativeHouse(fourthLord.planet.rasiNo, ninthLord.planet.rasiNo)));
  const lagnaLordStrong = Boolean(lagnaLord.planet && isOwnOrExalted(lagnaLord.key, lagnaLord.planet.rasiNo));
  return result(29, fourthNinthMutualKendra && lagnaLordStrong, {
    fourthLordKey: fourthLord.key,
    ninthLordKey: ninthLord.key,
    fourthNinthMutualKendra,
    lagnaLordKey: lagnaLord.key,
    lagnaLordStrong,
  });
}

function evaluateRule30({ lagna, planets }) {
  const seventhLord = planetForHouseLord(lagna, planets, 7);
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const tenthLord = planetForHouseLord(lagna, planets, 10);
  const seventhHouse = seventhLord.planet ? houseFromRasi(lagna.rasiNo, seventhLord.planet.rasiNo) : null;
  const seventhExalted = Boolean(seventhLord.planet && EXALTED_SIGNS[seventhLord.key] === seventhLord.planet.rasiNo);
  const seventhInKendra = [1, 4, 7, 10].includes(seventhHouse);

  const related = (lord) => Boolean(seventhLord.planet && lord.planet &&
    (seventhLord.planet.rasiNo === lord.planet.rasiNo || isOppositeRasi(seventhLord.planet.rasiNo, lord.planet.rasiNo)));
  const ninthRelated = related(ninthLord);
  const tenthRelated = related(tenthLord);

  return result(30, seventhExalted && seventhInKendra && ninthRelated && tenthRelated, {
    seventhLordKey: seventhLord.key,
    seventhLordRasiNo: seventhLord.planet?.rasiNo ?? null,
    seventhLordHouse: seventhHouse,
    seventhExalted,
    seventhInKendra,
    ninthLordKey: ninthLord.key,
    ninthRelated,
    tenthLordKey: tenthLord.key,
    tenthRelated,
    relationConvention: 'Client formula relation is evaluated as same-Rasi conjunction or 7th/opposition (சமசப்தம) relation.',
  });
}



function evaluateRule31({ lagna, planets }) {
  const eligibleHouses = [1, 2, 4, 5, 7, 9, 10, 11];
  const exchanges = [];
  for (let i = 0; i < eligibleHouses.length; i += 1) {
    for (let j = i + 1; j < eligibleHouses.length; j += 1) {
      const a = planetForHouseLord(lagna, planets, eligibleHouses[i]);
      const b = planetForHouseLord(lagna, planets, eligibleHouses[j]);
      if (a.key === b.key) continue;
      if (areExchanged(a, b)) {
        exchanges.push({ houseA: a.houseNo, houseB: b.houseNo, lordAKey: a.key, lordBKey: b.key });
      }
    }
  }
  return result(31, exchanges.length > 0, {
    eligibleHouses,
    exchanges,
    convention: 'Any mutual sign exchange between distinct lords of 1,2,4,5,7,9,10,11 satisfies the supplied Subha Parivarthana condition.',
  });
}

function evaluateRule32({ lagna, planets }) {
  const waxingMoon = isWaxingMoon(planets);
  const mercury = getPlanet(planets, 'mercury');
  const mercuryAlone = isPlanetAloneAmongClassicalPlanets(planets, mercury);
  const beneficKeys = ['jupiter', 'venus', ...(waxingMoon ? ['moon'] : []), ...(mercuryAlone ? ['mercury'] : [])];
  const references = [];
  for (let referenceRasiNo = 1; referenceRasiNo <= 12; referenceRasiNo += 1) {
    const secondRasiNo = rasiFromHouse(referenceRasiNo, 2);
    const twelfthRasiNo = rasiFromHouse(referenceRasiNo, 12);
    const secondBenefics = beneficKeys.filter((key) => getPlanet(planets, key)?.rasiNo === secondRasiNo);
    const twelfthBenefics = beneficKeys.filter((key) => getPlanet(planets, key)?.rasiNo === twelfthRasiNo);
    if (secondBenefics.length > 0 && twelfthBenefics.length > 0) {
      references.push({
        referenceRasiNo,
        isLagna: referenceRasiNo === lagna.rasiNo,
        isMoon: referenceRasiNo === getPlanet(planets, 'moon')?.rasiNo,
        isSun: referenceRasiNo === getPlanet(planets, 'sun')?.rasiNo,
        secondRasiNo,
        twelfthRasiNo,
        secondBenefics,
        twelfthBenefics,
      });
    }
  }
  return result(32, references.length > 0, {
    waxingMoon,
    mercuryAlone,
    beneficKeys,
    matchingReferences: references,
    convention: 'Because the supplied rule explicitly includes Lagna, Moon, Sun or any Bhava, every Rasi reference is checked for benefic enclosure on its 2nd and 12th sides.',
  });
}

function evaluateRule33({ lagna, planets, aspects }) {
  const moon = getPlanet(planets, 'moon');
  const moonLordKey = moon ? SIGN_LORD_KEYS[moon.rasiNo] : null;
  const moonLord = moonLordKey ? getPlanet(planets, moonLordKey) : null;
  const moonLordStrong = Boolean(moonLord && isOwnOrExalted(moonLordKey, moonLord.rasiNo));
  const moonLordHouse = moonLord ? houseFromRasi(lagna.rasiNo, moonLord.rasiNo) : null;
  const moonLordKendraOrTrine = [1, 4, 5, 7, 9, 10].includes(moonLordHouse);
  const jupiterAspectsMoon = Boolean(moon && aspectsRasi(aspects, 'jupiter', moon.rasiNo));
  return result(33, moonLordStrong && moonLordKendraOrTrine && jupiterAspectsMoon, {
    moonRasiNo: moon?.rasiNo ?? null,
    moonLordKey,
    moonLordRasiNo: moonLord?.rasiNo ?? null,
    moonLordHouse,
    moonLordStrong,
    moonLordKendraOrTrine,
    jupiterAspectsMoon,
  });
}

function evaluateRule34({ lagna, planets, aspects }) {
  const moon = getPlanet(planets, 'moon');
  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const conjunction = Boolean(lagnaLord.planet && moon && lagnaLord.planet.rasiNo === moon.rasiNo);
  const moonLordKey = moon ? SIGN_LORD_KEYS[moon.rasiNo] : null;
  const moonLord = moonLordKey ? getPlanet(planets, moonLordKey) : null;
  const moonLordHouse = moonLord ? houseFromRasi(lagna.rasiNo, moonLord.rasiNo) : null;
  const moonLordKendraOrTrine = [1, 4, 5, 7, 9, 10].includes(moonLordHouse);
  const waxingMoon = isWaxingMoon(planets);
  const beneficKeys = ['jupiter', 'venus', 'mercury', ...(waxingMoon ? ['moon'] : [])];
  const beneficAspectsLagna = beneficKeys.filter((key) => aspectsRasi(aspects, key, lagna.rasiNo));
  return result(34, conjunction && moonLordKendraOrTrine && beneficAspectsLagna.length > 0, {
    lagnaLordKey: lagnaLord.key,
    lagnaLordMoonConjunction: conjunction,
    moonLordKey,
    moonLordHouse,
    moonLordKendraOrTrine,
    waxingMoon,
    beneficAspectsLagna,
  });
}

function evaluateRule35({ lagna, planets }) {
  const lagnaLord = planetForHouseLord(lagna, planets, 1);
  const jupiter = getPlanet(planets, 'jupiter');
  const venus = getPlanet(planets, 'venus');
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const houseOf = (p) => p ? houseFromRasi(lagna.rasiNo, p.rasiNo) : null;
  const lagnaLordHouse = houseOf(lagnaLord.planet);
  const jupiterHouse = houseOf(jupiter);
  const venusHouse = houseOf(venus);
  const allInKendra = [lagnaLordHouse, jupiterHouse, venusHouse].every((h) => [1, 4, 7, 10].includes(h));
  const ninthLordStrong = Boolean(ninthLord.planet && isOwnOrExalted(ninthLord.key, ninthLord.planet.rasiNo));
  return result(35, allInKendra && ninthLordStrong, {
    lagnaLordKey: lagnaLord.key,
    lagnaLordHouse,
    jupiterHouse,
    venusHouse,
    allInKendra,
    ninthLordKey: ninthLord.key,
    ninthLordRasiNo: ninthLord.planet?.rasiNo ?? null,
    ninthLordStrong,
  });
}

function evaluateRule36({ lagna, planets }) {
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const eleventhLord = planetForHouseLord(lagna, planets, 11);
  const tenthLord = planetForHouseLord(lagna, planets, 10);
  const jupiter = getPlanet(planets, 'jupiter');
  const venus = getPlanet(planets, 'venus');
  const mercury = getPlanet(planets, 'mercury');
  const jupiterKendraFrom9L = Boolean(jupiter && ninthLord.planet && isKendraFromRasi(ninthLord.planet.rasiNo, jupiter.rasiNo));
  const venusKendraFrom11L = Boolean(venus && eleventhLord.planet && isKendraFromRasi(eleventhLord.planet.rasiNo, venus.rasiNo));
  const mercuryKendraFromLagna = Boolean(mercury && isKendraFromRasi(lagna.rasiNo, mercury.rasiNo));
  const mercuryKendraFrom10L = Boolean(mercury && tenthLord.planet && isKendraFromRasi(tenthLord.planet.rasiNo, mercury.rasiNo));
  return result(36, jupiterKendraFrom9L && venusKendraFrom11L && (mercuryKendraFromLagna || mercuryKendraFrom10L), {
    ninthLordKey: ninthLord.key,
    eleventhLordKey: eleventhLord.key,
    tenthLordKey: tenthLord.key,
    jupiterKendraFrom9L,
    venusKendraFrom11L,
    mercuryKendraFromLagna,
    mercuryKendraFrom10L,
  });
}

function evaluateRule37({ lagna, planets, aspects }) {
  const fifthLord = planetForHouseLord(lagna, planets, 5);
  const ninthLord = planetForHouseLord(lagna, planets, 9);
  const tenthLord = planetForHouseLord(lagna, planets, 10);
  const fifthIn9 = Boolean(fifthLord.planet && houseFromRasi(lagna.rasiNo, fifthLord.planet.rasiNo) === 9);
  const ninthIn10 = Boolean(ninthLord.planet && houseFromRasi(lagna.rasiNo, ninthLord.planet.rasiNo) === 10);
  const tenthIn5 = Boolean(tenthLord.planet && houseFromRasi(lagna.rasiNo, tenthLord.planet.rasiNo) === 5);
  const exactPlacement = fifthIn9 && ninthIn10 && tenthIn5;

  const relation = (a, b) => {
    if (!a.planet || !b.planet) return false;
    return a.planet.rasiNo === b.planet.rasiNo ||
      aspectsRasi(aspects, a.key, b.planet.rasiNo) || aspectsRasi(aspects, b.key, a.planet.rasiNo) ||
      areExchanged(a, b);
  };
  const r59 = relation(fifthLord, ninthLord);
  const r910 = relation(ninthLord, tenthLord);
  const r510 = relation(fifthLord, tenthLord);
  const connectedRelation = [r59, r910, r510].filter(Boolean).length >= 2;

  return result(37, exactPlacement || connectedRelation, {
    fifthLordKey: fifthLord.key,
    ninthLordKey: ninthLord.key,
    tenthLordKey: tenthLord.key,
    exactPlacement: { fifthIn9, ninthIn10, tenthIn5, matched: exactPlacement },
    relations: { fifthNinth: r59, ninthTenth: r910, fifthTenth: r510, connectedRelation },
    convention: 'The supplied “பரிவர்த்தனை அல்லது ஒருவருக்கொருவர் தொடர்பு” branch is treated as exchange/conjunction/aspect connectivity linking all three lords; two pairwise links are sufficient to connect the three-lord group.',
  });
}

function evaluateRule38({ lagna, planets }) {
  const waxingMoon = isWaxingMoon(planets);
  const mercury = getPlanet(planets, 'mercury');
  const mercuryAlone = isPlanetAloneAmongClassicalPlanets(planets, mercury);
  const beneficKeys = ['jupiter', 'venus', ...(waxingMoon ? ['moon'] : []), ...(mercuryAlone ? ['mercury'] : [])];
  const maleficKeys = ['sun', 'mars', 'saturn'];
  const requiredBeneficHouses = [5, 6, 7];
  const requiredMaleficHouses = [1, 3, 11];
  const strongBeneficsByHouse = {};
  const strongMaleficsByHouse = {};
  for (const houseNo of requiredBeneficHouses) {
    const rasiNo = rasiFromHouse(lagna.rasiNo, houseNo);
    strongBeneficsByHouse[houseNo] = beneficKeys.filter((key) => {
      const p = getPlanet(planets, key);
      return p?.rasiNo === rasiNo && isOwnOrExalted(key, p.rasiNo);
    });
  }
  for (const houseNo of requiredMaleficHouses) {
    const rasiNo = rasiFromHouse(lagna.rasiNo, houseNo);
    strongMaleficsByHouse[houseNo] = maleficKeys.filter((key) => {
      const p = getPlanet(planets, key);
      return p?.rasiNo === rasiNo && isOwnOrExalted(key, p.rasiNo);
    });
  }
  const beneficSide = requiredBeneficHouses.some((h) => strongBeneficsByHouse[h].length > 0);
  const maleficSide = requiredMaleficHouses.some((h) => strongMaleficsByHouse[h].length > 0);
  return result(38, beneficSide && maleficSide, {
    waxingMoon,
    mercuryAlone,
    beneficKeys,
    maleficKeys,
    strongBeneficsByHouse,
    strongMaleficsByHouse,
    beneficSide,
    maleficSide,
    convention: 'The supplied rule is evaluated when qualifying strong benefics occupy one or more of houses 5/6/7 and qualifying strong natural malefics occupy one or more of houses 1/3/11. Natural malefics are Sun, Mars and Saturn for this rule.',
  });
}

function evaluateRule39({ planets }) {
  const mercury = getPlanet(planets, 'mercury');
  const sun = getPlanet(planets, 'sun');
  const moon = getPlanet(planets, 'moon');
  const jupiter = getPlanet(planets, 'jupiter');
  const sunSecondFromMercury = Boolean(mercury && sun && relativeHouse(mercury.rasiNo, sun.rasiNo) === 2);
  const moonEleventhFromSun = Boolean(sun && moon && relativeHouse(sun.rasiNo, moon.rasiNo) === 11);
  const jupiterFromMoon = moon && jupiter ? relativeHouse(moon.rasiNo, jupiter.rasiNo) : null;
  const jupiterFifthOrNinthFromMoon = [5, 9].includes(jupiterFromMoon);
  return result(39, sunSecondFromMercury && moonEleventhFromSun && jupiterFifthOrNinthFromMoon, {
    sunSecondFromMercury,
    moonEleventhFromSun,
    jupiterHouseFromMoon: jupiterFromMoon,
    jupiterFifthOrNinthFromMoon,
  });
}

function evaluateRule40({ planets }) {
  const classicalKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const positions = Object.fromEntries(classicalKeys.map((key) => [key, getPlanet(planets, key)?.rasiNo ?? null]));
  const allPresent = classicalKeys.every((key) => Number.isInteger(positions[key]));
  const distinctRasis = new Set(classicalKeys.map((key) => positions[key]).filter(Number.isInteger));
  return result(40, allPresent && distinctRasis.size === 7, {
    positions,
    distinctRasiCount: distinctRasis.size,
    excludedKeys: ['rahu', 'ketu'],
  });
}

function buildClientYogaRules({ lagna, planets, aspects = [], language = 'ta', gender = null, birthDate = null, latitude = null, longitude = null, isDayBirth = null }) {
  const ctx = { lagna, planets, aspects, language, gender, birthDate, latitude, longitude, isDayBirth };
  const ruleResults = [
    evaluateRule1(ctx), evaluateRule2(ctx), evaluateRule3(ctx), evaluateRule4(ctx), evaluateRule5(ctx),
    evaluateRule6(ctx), evaluateRule7(ctx), evaluateRule8(ctx), evaluateRule9(ctx), evaluateRule10(ctx),
    evaluateRule11(ctx), evaluateRule12(ctx), evaluateRule13(ctx), evaluateRule14(ctx), evaluateRule15(ctx),
    evaluateRule16(ctx), evaluateRule17(ctx), evaluateRule18(ctx), evaluateRule19(ctx), evaluateRule20(ctx),
    evaluateRule21(ctx), evaluateRule22(ctx), evaluateRule23(ctx), evaluateRule24(ctx), evaluateRule25(ctx),
    evaluateRule26(ctx), evaluateRule27(ctx), evaluateRule28(ctx), evaluateRule29(ctx), evaluateRule30(ctx),
    evaluateRule31(ctx), evaluateRule32(ctx), evaluateRule33(ctx), evaluateRule34(ctx), evaluateRule35(ctx),
    evaluateRule36(ctx), evaluateRule37(ctx), evaluateRule38(ctx), evaluateRule39(ctx), evaluateRule40(ctx),
  ];
  const matchedRules = ruleResults.filter((x) => x.matched);

  return {
    source: 'Client-supplied classical Yoga rules',
    totalPlannedRules: 40,
    implementedThroughRule: 40,
    evaluatedRuleCount: 40,
    pendingRuleCount: 0,
    matchedRuleCount: matchedRules.length,
    matchedRules,
    ruleResults,
  };
}

module.exports = {
  buildClientYogaRules,
  SOURCE_RULES,
};
