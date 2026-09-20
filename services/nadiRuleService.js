/**
 * Agathiyar / Poorva Punniya / Karma Nadi rules.
 *
 * SARA WORK START - NADI RULE ENGINE
 *
 * IMPORTANT:
 * - ADDITIVE ONLY. Do not change any existing locked horoscope calculation.
 * - Source wording is preserved from the client-supplied 60-rule corpus.
 * - Rules 1-10 are UAT validated/frozen.
 * - Rules 1-50 are UAT validated/frozen.
 * - This controlled update adds Rules 51-60 without changing Rules 1-50 logic.
 */

const SOURCE_RULES = {
  1: {
    formulaTa: "குரு + ராகு \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "குரு சண்டாள தோஷம் / பிரம்மஹத்தி & நாக தோஷம்",
    effectsTa: "புத்திர பாக்கியத் தாமதம், குடும்ப வம்ச விருத்தியில் தடை, சற்குரு வழிகாட்டல் இன்மை, தவறான ஆலோசனைகளால் பொருள் இழப்பு.",
    remedyTa: "வியாழக்கிழமை அந்திப் பொழுதில் அரசமரத்தடி நாகருக்குப் பசும்பால் அபிஷேகம் செய்து, பிரம்மச்சாரி அந்தணருக்கு அல்லது சன்யாசிக்கு வெண்தாமரை மலர் சமர்ப்பித்துத் தங்க தானம் (அல்லது இயன்ற பொற்காசு) மற்றும் கடலை தானம் வழங்குதல்.",
  },
  2: {
    formulaTa: "சூரியன் + ராகு / கேது \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "பித்ரு தோஷம் / சூரிய கிரகண தோஷம்",
    effectsTa: "அரசு மற்றும் அதிகாரிகளால் விரோதம், பதவி இழப்பு, கண் பார்வை மங்குதல், இதய உபாதைகள், தந்தைக்குத் தொடர் கண்டம்.",
    remedyTa: "ஞாயிற்றுக்கிழமைகளில் சூரிய உதய வேளையில் செப்புப் பாத்திரத்தில் கோதுமை மற்றும் செந்நிற வஸ்திரம் வைத்து, நதிக்கரையில் பித்ரு தர்ப்பணம் செய்து சிவலிங்கத்திற்கு வில்வ அர்ச்சனை செய்வித்துத் தானமளித்தல்.",
  },
  3: {
    formulaTa: "சந்திரன் + கேது / சனி \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "மாத்ரு தோஷம் / புனர்பூ & சந்திர கிரகண தோஷம்",
    effectsTa: "தீராத மன அழுத்தம், தூக்கமின்மை, மார்புச் சளி, நீர் கண்டம், தாய்க்குத் தொடர் உடல்நலக் குறைவு, மனக்குழப்பம்.",
    remedyTa: "பௌர்ணமி தோறும் நதி சங்கமத்தில் அல்லது கடலில் நீராடி, முதிய சுமங்கலிப் பெண்களுக்குப் பச்சரிசி, வெண்வஸ்திரம் மற்றும் வெள்ளி நாணயம் தானம் செய்து தயிர்சாத அன்னதானம் வழங்குதல்.",
  },
  4: {
    formulaTa: "செவ்வாய் + ராகு / கேது \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "பிராத்ரு தோஷம் / அங்காரக நாக தோஷம்",
    effectsTa: "சகோதரப் பகை, ரத்தக் காயங்கள், விபத்துக்கள், ரத்தக் கொதிப்பு, தீராத நில வழக்குகள் மற்றும் பூமி நஷ்டம்.",
    remedyTa: "செவ்வாய்க்கிழமைகளில் முருகப்பெருமானுக்குச் செவ்வரளி மாலையிட்டு, செப்புத் தகட்டில் சுப்பிரமணிய எந்திரம் வரைந்து பூஜித்து, துவரம் பருப்பும் செவ்வாழையும் ஏழை உழைப்பாளிகளுக்குத் தானமளித்தல்.",
  },
  5: {
    formulaTa: "சுக்கிரன் + கேது \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "ஸ்திரீ தோஷம் / களத்திர கர்ம தோஷம்",
    effectsTa: "தாம்பத்தியப் பிரிவு, திருமணத் தடை, விந்து/கருப்பை நோய்கள், பொருளாதாரச் சரிவு, இல்லறத்தில் நிம்மதியின்மை.",
    remedyTa: "வெள்ளிக்கிழமைகளில் பழமையான அம்பாள் சன்னதியில் நெய்தீபம் ஏற்றி, ஏழை சுமங்கலிப் பெண்ணுக்குப் பட்டு வஸ்திரம், தாலிச் சரடு, மொச்சை தானம் தந்து அன்னபூரணிக்குத் தாளம்பூ அர்ச்சனை செய்தல்.",
  },
  6: {
    formulaTa: "சனி + செவ்வாய் சேர்க்கை அல்லது பரஸ்பர பார்வை (180^\\circ)",
    typeTa: "அக்னி-மாருத தோஷம் / ருத்ர தோஷம்",
    effectsTa: "தொழிலில் திடீர் நஷ்டம், எலும்பு முறிவு, அடிக்கடி அறுவை சிகிச்சைகள், ரத்த இழப்பு, தீ விபத்துக்கள்.",
    remedyTa: "சனிக்கிழமைகளில் இரும்புப் பாத்திரத்தில் நல்லெண்ணெய் ஊற்றித் தன் முகம் பார்த்து தானம் அளித்தல் (சாயா தானம்); உழவு மாடுகளுக்கு எள்ளும் கொள்ளும் கலந்த பிண்ணாக்கு உணவளித்தல்.",
  },
  7: {
    formulaTa: "புதன் + ராகு / சனி \\le 5^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "பிரம்ம சாபம் / வித்யா தோஷம்",
    effectsTa: "நரம்புத் தளர்ச்சி, தோல் வியாதிகள், முடிவெடுக்கும் திறன் இழப்பு, வியாபாரத் துரோகம், திக்குவாய்/பேச்சுத் தடுமாற்றம்.",
    remedyTa: "புதன்கிழமைகளில் பசு மாடுகளுக்குப் பச்சைப் பயறு ஊறவைத்து வெல்லம் சேர்த்து ஊட்டல்; ஏழை மாணவர்களுக்கு ஏடு, எழுத்தாணி (கல்விப் பொருட்கள்) தானம் செய்தல்.",
  },
  8: {
    formulaTa: "5-ஆம் வீட்டில் சனி அல்லது கேது அமர்வு",
    typeTa: "குலதெய்வ சாபம் / பூர்வ புண்ணிய க்ஷய தோஷம்",
    effectsTa: "சுபகாரியங்கள் கடைசி நேரத்தில் தடைபடுதல், வம்ச விருத்தியில் தாமதம், பிள்ளைகளால் மன உளைச்சல், வாரிசு இன்மை.",
    remedyTa: "குலதெய்வக் கோவிலுக்கு நேரில் சென்று பொங்கலிட்டுப் பச்சைக் கற்பூரம் ஏற்றிப் பூஜித்தல்; 5 ஏழைக் குழந்தைகளுக்கு வஸ்திர தானமும் பஞ்சாமிர்தமும் வழங்குதல்.",
  },
  9: {
    formulaTa: "9-ஆம் அதிபதி 8 அல்லது 12-ல் மறைவு",
    typeTa: "தர்ம லோப தோஷம் / பாக்கியஹீன தோஷம்",
    effectsTa: "பாக்கியக் குறைவு, எதிலும் அதிர்ஷ்டமின்மை, தந்தையுடன் சுமுக உறவின்மை, பெரியோர்களின் ஆதரவு கிட்டாமை.",
    remedyTa: "சிவாலயங்களில் நடைபெறும் நித்திய அன்னதானத்திற்கு நெல் மூட்டை தானம் செய்தல் மற்றும் புண்ணிய நதிகளில் முன்னோர்களை வேண்டித் தீர்த்தமாடி தில ஹோமம் இயற்றுதல்.",
  },
  10: {
    formulaTa: "சனி + கேது சேர்க்கை",
    typeTa: "சன்யாச யோக கர்ம தோஷம் / பித்ரு பிரேத தோஷம்",
    effectsTa: "உலகப் பற்றின்மை, மன தனிமை, அறியப்படாத அச்சம், மூட்டு வாதம், நரம்பு முடக்கம்.",
    remedyTa: "திருக்காளஹஸ்தி அல்லது திருநாகேஸ்வரம் சென்று மோட்ச தீபம் ஏற்றுதல்; ஆடையற்ற பரதேசிகளுக்குக் கம்பளி ஆடையும் கறுப்பு எள்ளுருண்டையும் தானம் அளித்தல்.",
  },
  11: {
    formulaTa: "குருவுக்கு 5 அல்லது 9-ல் சுப கிரகங்கள் அமர்வு",
    typeTa: "சுப கர்மப் பதிவு (பூர்வ புண்ணிய யோகம் - தோஷ நிவர்த்தி அமைப்பு)",
    effectsTa: "தோஷமில்லை; ஆனால் கர்ம வினையைத் தக்கவைக்கத் தவறினால் பின்வரும் சந்ததிக்குக் கர்மச் சுமை ஏறும்.",
    remedyTa: "அன்ன சத்திரங்களுக்குத் தொடர்ந்து அரிசி தானம் செய்தல் மற்றும் ஆலய திருப்பணிகளுக்குப் பங்களித்துத் தர்மத்தை நிலைநிறுத்துதல்.",
  },
  12: {
    formulaTa: "லக்னாதிபதி 12-ல் நின்று கேது பார்வை பெறுதல்",
    typeTa: "ஆத்ம பந்தன தோஷம்",
    effectsTa: "உலகியல் இன்பங்களில் திருப்தியின்மை, தீவிர மன உளைச்சல், குடும்பத்தை விட்டு விலகும் நாட்டம், காரிய விரயம்.",
    remedyTa: "சித்தர் சமாதிகளுக்கு (உதாரணமாகப் பழனி போகர் அல்லது திருவண்ணாமலை) சென்று பௌர்ணமி கிரிவலம் வந்து, சித்தர்களுக்குக் காவி வஸ்திரம் சமர்ப்பித்து விபூதி பிரசாதம் பெறுதல்.",
  },
  13: {
    formulaTa: "6/8/12 அதிபதிகள் \\leftrightarrow 1/5/9 அதிபதிகள் பரிவர்த்தனை",
    typeTa: "ருண-கர்ம பரிவர்த்தனை தோஷம்",
    effectsTa: "எதிர்பாராத பெரும் நிதி இழப்பு, கடுமையான நம்பிக்கை துரோகங்கள், நீதிமன்ற வழக்குகள், பரம்பரைச் சொத்து விரயம்.",
    remedyTa: "ஏழைகளின் மருத்துவச் செலவுக்கு மருந்து வாங்கித் தருதல்; வறியோரின் கடன் சுமையைத் தீர்க்கப் பொருள் உதவி செய்து, பைரவருக்கு வடை மாலை சார்த்துதல்.",
  },
  14: {
    formulaTa: "கிரக பாகை \\le ராகு பாகை (கிரகம் ராகுவை நோக்கிச் செல்லுதல்)",
    typeTa: "தீவிர போக கர்ம தோஷம்",
    effectsTa: "உலகப் பொருட்கள் மீது அளவு கடந்த மோகம், மாயையான பேராசையால் நஷ்டமடைதல், போதை அல்லது சூதாட்ட ஈர்ப்பு.",
    remedyTa: "வில்வ மரத்தடியில் அமர்ந்து ராகு காலத்தில் துர்க்கைக்கு எலுமிச்சம்பழத் தீபம் ஏற்றுதல்; பாம்பாட்டி அல்லது ஆதரவற்ற முதியோருக்குப் புளிசாத தானம் வழங்குதல்.",
  },
  15: {
    formulaTa: "கிரக பாகை \\ge கேது பாகை (கிரகம் கேதுவை விட்டு விலகுதல்)",
    typeTa: "முக்தி கர்ம சுமை / உலகியல் விரக்தி தோஷம்",
    effectsTa: "உறவுகள் மற்றும் தொழில் மீது ஈடுபாடின்மை, குடும்பப் பொறுப்புகளில் அலட்சியம், வறுமை நிலை.",
    remedyTa: "விநாயகப் பெருமானுக்கு அருகம்புல் மாலை சார்த்தி, 108 சிதறுகாய் உடைத்து, ஏழைகளுக்குக் கதர் ஆடை தானம் செய்து சாதுக்களுக்கு உணவிடுதல்.",
  },
  16: {
    formulaTa: "காரக கிரகத்திற்கு 2 மற்றும் 12-ல் பாப கிரகங்கள் (பாபகர்த்தாரி யோகம்)",
    typeTa: "பந்தன தோஷம் (காரக முடக்கம்)",
    effectsTa: "சுதந்திரமின்மை, காரிய முடக்கம், கடுமையான தனிமை, சிறைவாசம் போன்ற மன உளைச்சல், உரிய உறவின் ஆதரவின்மை.",
    remedyTa: "கூண்டில் அடைக்கப்பட்ட பறவைகளை விலைக்கு வாங்கி சுதந்திரமாக காட்டில் பறக்க விடுதல்; சிறைப்பட்ட கைதிகளுக்கு அன்னமும் உடையும் உதவுதல்.",
  },
  17: {
    formulaTa: "5 அல்லது 9-ஆம் வீட்டில் வக்ர கிரகம் நிற்றல்",
    typeTa: "அபூர்வ வித்யா கர்ம தோஷம் (முற்றுப்பெறா தவம்)",
    effectsTa: "தீவிர சிந்தனை ஓட்டம், சாஸ்திர ஞானம் இருந்தும் உலகியல் வாழ்வில் பிழைக்கத் தெரியாமை, உறவுகளுடன் ஒட்டாத நிலை.",
    remedyTa: "குருமார்களுக்குப் பாதபூஜை செய்து தட்சிணை அளித்தல்; புராதன ஓலைச்சுவடிகள் அல்லது பழமையான நூல்களைப் பராமரிக்கும் இடங்களுக்குப் பொருள் உதவி செய்தல்.",
  },
  18: {
    formulaTa: "சனி \\leftrightarrow செவ்வாய் சமசப்தக பார்வை (180^\\circ)",
    typeTa: "ரத்த சாப தோஷம் / வன்முறை கர்மம்",
    effectsTa: "உடலில் தழும்புகள், விபத்துக்கள், ரத்தக் காயங்கள், எதிர்பாராத அறுவை சிகிச்சைகள், ஆயுத கண்டங்கள்.",
    remedyTa: "வீரபத்திரர் அல்லது நரசிம்மர் ஆலயத்தில் நெய் தீபமேற்றிப் பானகம் நைவேத்தியம் செய்து, ரத்ததானம் செய்தல் அல்லது ரத்த காயம்பட்டோருக்கு மருந்து தானம் அளித்தல்.",
  },
  19: {
    formulaTa: "சூரியன் \\leftrightarrow சனி சமசப்தக பார்வை (180^\\circ)",
    typeTa: "பித்ரு விரோத சாபம்",
    effectsTa: "தந்தை-மகன் உறவில் தீராத விரிசல், அரசு வழியில் தடைகள், உயர் அதிகாரிகளால் நெருக்கடிகள், இதய/எலும்பு உபாதைகள்.",
    remedyTa: "ஞாயிறு மற்றும் சனிக்கிழமை சந்திக்கும் அந்தி வேளையில் பித்ருக்களுக்கு எள்ளும் தண்ணீரும் இறைத்து, தொழுநோயாளிகளுக்கு அன்னதானமும் செருப்பும் தானமளித்தல்.",
  },
  20: {
    formulaTa: "5-ஆம் அதிபதி D-60-ல் குரூர/ராக்ஷச ஷஷ்டியாம்சத்தில் அமர்வு",
    typeTa: "திருட கர்ம தோஷம் (மாற்ற முடியாத தீவிர கர்மம்)",
    effectsTa: "எளிய பரிகாரங்களால் விலகாத கடுமையான தடைகள், தொடர் தோல்விகள், சந்ததி உருவாவதில் தீவிர முடக்கம்.",
    remedyTa: "ராமேஸ்வரம் அக்னி தீர்த்தத்தில் 21 தலைமுறை பித்ருக்களுக்குத் தில ஹோமம் செய்வித்து, மகா ருத்ர பாராயணத்தில் பங்கு கொண்டு பசு மாட்டை கன்றுடன் தானம் அளித்தல் (கோதானம்).",
  },
  21: {
    formulaTa: "முடக்கு நட்சத்திரத்தின் 1-5-9-ல் சனி அல்லது ராகு நிற்றல்",
    typeTa: "முடக்கு கர்ம தோஷம்",
    effectsTa: "வாழ்க்கைப் பாதையில் பூர்வ புண்ணிய சக்தி தற்காலிகமாக முடங்கிப் போதல், திடீர் தொழில் இழப்பு, ஸ்தம்பித்து நிற்கும் சூழல்.",
    remedyTa: "முடக்கு நட்சத்திரத்திற்குரிய மரக்கன்றை நட்டு நீர் ஊற்றி வளர்த்தல்; ஆதரவற்ற முடமான மாற்றுத்திறனாளிகளுக்கு மூன்று சக்கர வண்டி அல்லது ஊன்றுகோல் தானம் தருதல்.",
  },
  22: {
    formulaTa: "8-ஆம் அதிபதியுடன் ராகு சேர்க்கை",
    typeTa: "துர்மரண பித்ரு தோஷம் / அஷ்டம நாக தோஷம்",
    effectsTa: "வீட்டில் காரணமில்லாத அச்ச உணர்வு, கெட்ட கனவுகள், விபத்துக் கண்டங்கள், துர்மரண பயம், தொடர் நஷ்டம்.",
    remedyTa: "கயா அல்லது திருவெண்காடு சென்று துர்மரணம் அடைந்த முன்னோர்களுக்கு நாராயண பலி பூசையும், காளஹஸ்தியில் சர்ப்ப சாந்தி ஹோமமும் செய்து முடித்தல்.",
  },
  23: {
    formulaTa: "குருவுக்கு 5 அல்லது 9-ல் புதன் நிற்றல்",
    typeTa: "வித்யா புண்ணியப் பதிவு (தோஷமற்ற யோக அமைப்பு)",
    effectsTa: "கர்வம் கொண்டால் வாக்குப் பலிதம் மங்கிப் போதல், தவறான கணிப்புகளால் அவப்பெயர் வருதல்.",
    remedyTa: "ஏழை மாணவர்களுக்கு இலவச சாஸ்திர நூல்கள் மற்றும் கல்வி உபகரணங்களை வழங்கி, சரஸ்வதி தேவிக்கு வெண்தாமரை சாற்றி நெய் தீபம் ஏற்றுதல்.",
  },
  24: {
    formulaTa: "12-ஆம் வீட்டில் கேது சுபப் பார்வையுடன் தனித்து நிற்றல்",
    typeTa: "மோட்ச கர்ம ரேகை",
    effectsTa: "இல்லற வாழ்வில் பற்றின்மை ஏற்படுதல், பொருள் ஈட்டுவதில் முனைப்பின்மை, குடும்பத்தினரால் தவறாகப் புரிந்து கொள்ளப்படுதல்.",
    remedyTa: "சன்யாசிகளுக்குக் காவி உடை, கமண்டலம், அன்னம் அளித்தல்; திருக்கயிலாய/திருவண்ணாமலை கிரிவலப் பாதையில் உள்ள அடியார்களுக்குத் தீர்த்த தானம் செய்தல்.",
  },
  25: {
    formulaTa: "9-ஆம் அதிபதி 12-ல் அமர்ந்து கேது தொடர்பு பெறுதல்",
    typeTa: "தர்ம விரய கர்மம்",
    effectsTa: "சொந்தத் தேவைக்குச் சேமிக்க முடியாமல் ஆன்மீகப் பணிகளுக்கு எல்லை மீறிச் செலவழித்தல், பொருளாதார நெருக்கடி.",
    remedyTa: "பாழடைந்த கிராமப்புற சிவன் கோவில்களைத் தூய்மை செய்து (உழவாரப்பணி) நந்தா தீபம் எரிய எண்ணெய் தானம் அளித்தல்.",
  },
  26: {
    formulaTa: "அனைத்து கிரகங்களும் ராகு-கேது பிடியில் அடைபடல் (காலசர்ப்ப தோஷம்)",
    typeTa: "பூர்ண காலசர்ப்ப கர்ம தோஷம்",
    effectsTa: "36 அல்லது 42 வயது வரை தொடர் போராட்டங்கள், கடும் முயற்சிக்குப் பின்னும் அங்கீகாரமின்மை, மன அழுத்தம்.",
    remedyTa: "திருநாகேஸ்வரம் அல்லது காளஹஸ்தியில் ராகு-கேது பிரீதி செய்து, வெள்ளியிலான நாகர் உருவம் செய்து ஆதிசேஷ சன்னதியில் சமர்ப்பித்து, எள் சாத அன்னதானம் செய்தல்.",
  },
  27: {
    formulaTa: "ஜன்ம தாரைக்கு 3, 5, 7-வது தாரைகளில் (விபத்து, பிரத்யக், வதம்) சனி அல்லது ராகு அமர்வு",
    typeTa: "தாரா பலஹீன கர்ம தோஷம்",
    effectsTa: "தசா/புக்தி காலங்களில் கடும் சோதனைகள், திடீர் விபத்துக்கள், உறவுகளால் வஞ்சிக்கப்படுதல், உடல் நலம் குன்றுதல்.",
    remedyTa: "குறிப்பிட்ட அந்த தாரை நாளின் தொடக்கத்தில் மகா மிருத்யுஞ்சய மந்திரம் 108 முறை ஜெபித்து, சிவலிங்கத்திற்கு வில்வ இலைகளால் சகஸ்ரநாம அர்ச்சனை செய்து ஏழைகளுக்குக் கறுப்பு உளுந்து தானம் அளித்தல்.",
  },
  28: {
    formulaTa: "சூரியன் + சந்திரன் + ராகு / கேது ஒரே ராசியில் சேர்க்கை",
    typeTa: "மாத்ரு-பித்ரு சாப சங்கம தோஷம் (அமாவாசை கிரகண தோஷம்)",
    effectsTa: "பெற்றோரின் ஆதரவின்மை, வாழ்க்கையில் முடிவெடுக்க முடியாமல் குழம்புதல், பலவீனமான உடலமைப்பு, மன நடுக்கம்.",
    remedyTa: "அமாவாசை திதியில் முக்கடல் சங்கமிக்கும் இடத்தில் நீராடி, தாய்-தந்தை வழி முன்னோர்களுக்கு ஒரே நாளில் எள்ளும் பிண்டமும் வைத்துத் தானம் அளித்து, சூரிய சந்திர சன்னதியில் நெய் தீபமிடுதல்.",
  },
  29: {
    formulaTa: "புதன் + கேது \\le 3^\\circ பாகைக்குள் சேர்க்கை",
    typeTa: "பூர்வ சாஸ்திர கர்மப் பதிவு (தோஷ கலப்பற்ற ஞான அமைப்பு)",
    effectsTa: "நரம்பு மண்டலத்தில் அதீத உணர்ச்சி வசப்படுதல், சோர்வு, உலகியல் மனிதர்களிடம் உரையாடுவதில் சலிப்பு.",
    remedyTa: "தன்வந்திரி பகவானுக்குப் பச்சை வஸ்திரம் சார்த்தி, ஏழை நோயாளிகளுக்கு மூலிகை மருந்துகள் அல்லது கசாயங்களை இலவசமாக வழங்குதல்.",
  },
  30: {
    formulaTa: "செவ்வாய் + சனி 4-ஆம் வீட்டில் அமர்வு",
    typeTa: "பூமி சாப தோஷம் / மாத்ரு ஸ்தான பீடை",
    effectsTa: "சொந்த வீடு கட்டுவதில் பெரும் தடைகள், நிலத் தகராறுகள், வாங்கிய நிலத்தில் வழக்குகள், தாயாருக்குக் கடும் எலும்பு உபாதைகள்.",
    remedyTa: "பூமிக்குரிய வராஹ மூர்த்திக்குத் தயிர்சாதம் படைத்து வழிபாடு செய்தல்; வீடு கட்டத் தொடங்கும் முன் நிலத்தில் நவதானியங்களை முளைக்கப் போட்டுப் பசுவுக்கு மேய்த்தல்.",
  },
  31: {
    formulaTa: "லக்னாதிபதி 8 அல்லது 12-ல் ராகுவுடன் மறைவு",
    typeTa: "ஆயுள்-ஆத்ம கர்ம தோஷம்",
    effectsTa: "காரணமறியாத உடல் உபாதைகள் அடிக்கடி தோன்றுதல், பலவீனமான நோய் எதிர்ப்பு சக்தி, அலைச்சல், மருத்துவச் செலவு.",
    remedyTa: "ஞாயிறுதோறும் ருத்ர அபிஷேக தீர்த்தம் அருந்துதல்; மருத்துவமனைகளில் உள்ள அனாதை நோயாளிகளுக்குப் படுக்கை விரிப்பும் பழங்களும் தானம் செய்தல்.",
  },
  32: {
    formulaTa: "சுக்கிரன் 6-ல் நின்று ராகு அல்லது செவ்வாய் பார்வை பெறுதல்",
    typeTa: "கர்ப்பிணி/சுமங்கலி சாப தோஷம்",
    effectsTa: "குடும்பத்தில் பெண் வாரிசுகள் உருவாவதில் தடை, பெண்களுக்குத் தொடர் கருப்பை நோய்கள், தாம்பத்தியப் பிரிவு.",
    remedyTa: "கர்ப்பிணிப் பெண்களுக்கு வளைகாப்புச் செலவை ஏற்றுச் சீர்வரிசை அளித்தல்; கன்னிப் பெண்களுக்குப் புத்தாடையும் இனிப்பும் வழங்கி ஆசி பெறுதல்.",
  },
  33: {
    formulaTa: "5 அல்லது 9-ஆம் வீட்டில் குரு வக்ரமடைந்து நிற்றல்",
    typeTa: "தேவ-பிரார்த்தனை பாக்கி தோஷம்",
    effectsTa: "வம்ச விருத்தியில் தடை, சுபகாரியங்கள் இழுபறியாதல், குலதெய்வ அருளின்மை, நேர்த்திக்கடன் மறதியால் வரும் வறுமை.",
    remedyTa: "பூர்வீகக் குலதெய்வக் கோவிலுக்குச் சென்று பாதியில் விட்ட நேர்த்திக்கடன்களை முழுமையாக நிறைவேற்றி, திருவிளக்கு பூஜை நடத்தி நெய்ப் பொங்கல் வழங்குதல்.",
  },
  34: {
    formulaTa: "12-ஆம் வீட்டு அதிபதி கேதுவின் சாரத்தில் (அசுவினி, மகம், மூலம்) அமர்வு",
    typeTa: "வைராக்ய கர்ம தோஷம்",
    effectsTa: "உலகியல் செல்வங்களை ஈட்டுவதில் பிடிப்பின்மை, உறவினர்களிடமிருந்து அந்நியப்படுதல், பொருளாதார மந்தம்.",
    remedyTa: "கொல்லிமலை அல்லது சதுரகிரி போன்ற சித்தர் தலங்களுக்குச் சென்று தியானம் செய்து, துறவிகளுக்குக் கதர் வேட்டியும் அன்னமும் அளித்தல்.",
  },
  35: {
    formulaTa: "5 அல்லது 9-ஆம் அதிபதியின் தசாவில் ராகு / கேது புக்தி நடப்பு",
    typeTa: "கர்ம விபாக காலம் (முற்பிறவி வினை விழித்தெழும் நேரம்)",
    effectsTa: "கடுமையான திடீர் திருப்பங்கள், நஷ்டங்கள் அல்லது தீவிர சோதனைகள், உறவுகள் பிரிவு.",
    remedyTa: "தன் எடைக்கு நிகரான தானியத்தை (துலாபாரம்) ஏழை எளியவர்களுக்குத் தானம் தருதல்; சண்டி ஹோமம் அல்லது சுதர்சன ஹோமத்தில் கலந்து கொள்ளுதல்.",
  },
  36: {
    formulaTa: "சூரியன் நீர் ராசியில் (கடகம், விருச்சிகம், மீனம்) கேதுவுடன் இணைவு",
    typeTa: "ஜல-பித்ரு தாக சாபம்",
    effectsTa: "அரசு வழியில் விரோதம், தந்தை வழிச் சொத்துச் சிக்கல்கள், குடும்பத்தில் அமைதியின்மை, பித்ருக்களின் அதிருப்தி.",
    remedyTa: "கோடை காலத்தில் பொது இடங்களில் தண்ணீர்ப் பந்தல் அமைத்தல்; திருப்புல்லாணி அல்லது பவானி கூடுதுறையில் முன்னோர்களுக்குத் தில தர்ப்பணம் செய்தல்.",
  },
  37: {
    formulaTa: "குரு + சுக்கிரன் பாப தொடர்பின்றி 2 அல்லது 11-ன் திரிகோணத்தில் அமர்வு",
    typeTa: "குபேர யோக கர்மப் பதிவு (தோஷமற்ற பெரும் யோகம்)",
    effectsTa: "வறுமை பயம் இல்லாததால் செல்வத்தை விரயம் செய்தல், வரவுக்கு மீறிய உல்லாசத்தால் வரும் பிற்காலப் பற்றாக்குறை.",
    remedyTa: "ஏழை எளியவர்களின் திருமணத்திற்குத் தாலிப் பொன் அல்லது மங்கலப் பொருட்கள் வாங்கிக் கொடுத்துத் தனத்தை நல்ல வழியில் செலவிடுதல்.",
  },
  38: {
    formulaTa: "குருவும் சனியும் வக்ரம் பெற்றுப் பரஸ்பர பார்வை அல்லது திரிகோண தொடர்பு",
    typeTa: "குரு துரோக சாபம் / தர்ம அபகார தோஷம்",
    effectsTa: "நற்பெயர் கெடுதல், தொழிலில் பெருத்த நஷ்டம், வழக்குகளில் சிக்கி அவப்பெயர் அடைதல், சமூகப் புறக்கணிப்பு.",
    remedyTa: "வேத பாடசாலைகளில் பயிலும் பிரம்மச்சாரிகளுக்கு உணவு மற்றும் வஸ்திரப் பொறுப்பை ஏற்றல்; தர்ம ஸ்தாபனங்களுக்கு நிலம் அல்லது கட்டிடத் திருப்பணி செய்தல்.",
  },
  39: {
    formulaTa: "5-ஆம் வீட்டில் சந்திரன் + செவ்வாய் கூடி கேது பார்வை பெறுதல்",
    typeTa: "கரு அழிப்பு சாபம் (சிசுஹத்தி தோஷம்)",
    effectsTa: "கருத்தரிப்பதில் நீண்ட தாமதம், அடிக்கடி கருச்சிதைவு ஏற்படுதல், புத்திர சோகம், பிறக்கும் குழந்தைகளுக்கு ஆரோக்கியக் கேடு.",
    remedyTa: "திருக்கருகாவூர் கர்ப்பரக்ஷாம்பிகை சன்னதியில் நெய் நைவேத்தியம் செய்து உண்டு வருதல்; அனாதைக் குழந்தைகளுக்குப் பால், சத்துணவு வழங்குதல்.",
  },
  40: {
    formulaTa: "காலசர்ப்ப அமைப்பில் குரு மட்டும் ராகு-கேது அச்சிற்கு வெளியே நிற்றல்",
    typeTa: "கர்ம விமோசன ரேகை",
    effectsTa: "32 வயது வரை தீவிர போராட்டங்களும் விரயங்களும், காரியத் தடைகள்.",
    remedyTa: "வியாழக்கிழமைகளில் தட்சிணாமூர்த்திக்குக் கொண்டைக்கடலை மாலை சார்த்தி நெய் தீபம் ஏற்றுதல்; ஏழை ஆன்மீக மாணவர்களுக்குக் கல்வி உதவி செய்தல்.",
  },

  41: {
    formulaTa: "2-ஆம் வீட்டில் புதன் + செவ்வாய் + ராகு சேர்க்கை",
    typeTa: "வாக்-சாப தோஷம்",
    effectsTa: "பேச்சால் பெரும் பகையும் நிதி இழப்பும் உண்டாகுதல், தொண்டை/பல் நோய்கள், வீண்பழி, குடும்பத்தில் வாக்குவாதம்.",
    remedyTa: "செவ்வாய் மற்றும் புதன்கிழமைகளில் மௌன விரதம் இருத்தல்; ஊமை/செவிடு மாற்றுத்திறனாளிகளுக்கு உணவு மற்றும் செவித்திறன் கருவிகள் தானம் செய்தல்.",
  },
  42: {
    formulaTa: "5-ஆம் வீட்டில் கேது அமர்ந்து செவ்வாயின் பார்வை (4, 7, 8) பெறுதல்",
    typeTa: "ஜீவஹிம்சா புத்திர தோஷம்",
    effectsTa: "புத்திரப் பேறின்மை, பிள்ளைகளால் கடுமையான மனவேதனை, பிள்ளைகள் பெற்றோருக்கு அடங்காமல் போதல்.",
    remedyTa: "தெருவோர நாய்களுக்கும், தாயை இழந்த விலங்கு குட்டிகளுக்கும் தொடர்ந்து உணவிடுதல்; சுப்பிரமணியருக்குப் பாலபிஷேகம் செய்வித்துச் செந்தூரக் காப்பிடுதல்.",
  },
  43: {
    formulaTa: "9-ஆம் வீட்டில் கேது அமர்ந்து குரு பார்வை பெறுதல்",
    typeTa: "சித்தர் அருள் யோகப் பதிவு",
    effectsTa: "உலகியல் பிடிப்பின்மையால் பொருளாதார முன்னேற்றம் தாமதமாதல், குடும்பத்தார் உலகியல் மனிதனாகப் பார்க்க இயலாமை.",
    remedyTa: "சித்தர்களின் ஜீவசமாதிகளுக்குப் பாதயாத்திரை சென்று நெய்தீபம் ஏற்றுதல்; ஆலய நந்தவனங்களில் வில்வம், துளசி, வேப்ப மரக்கன்றுகளை நடுதல்.",
  },
  44: {
    formulaTa: "சனி லக்னத்திற்கு 12-ஆம் வீட்டைத் தனது பார்வையால் (3, 7, 10) பார்த்தல்",
    typeTa: "கர்ம க்ஷய வாய்ப்பு யோகம்",
    effectsTa: "தான தர்மங்கள் செய்யத் தவறினால் கடுமையான விரயமும் மன அமைதியின்மையும் உண்டாகுதல்.",
    remedyTa: "தினசரி உணவில் ஒரு பிடி அன்னத்தை எடுத்து காகத்திற்கு வைத்த பின் உண்ணுதல்; முதியோர் இல்லங்களுக்குத் தேவையான பாய், தலையணை, கம்பளிகளைத் தானமளித்தல்.",
  },
  45: {
    formulaTa: "அக்னி ராசியில் (மேஷம், சிம்மம், தனுசு) சூரியன் அல்லது செவ்வாய் + ராகு சேர்க்கை",
    typeTa: "அக்னி சாப தோஷம்",
    effectsTa: "உடலில் கடுமையான உஷ்ண நோய்கள், பித்த வெடிப்பு, தீக்காயங்கள், கொப்புளங்கள், ரத்த உஷ்ணம்.",
    remedyTa: "சிவாலயங்களில் ருத்ர ஏகாதசி பாராயணம் செய்வித்து இளநீர் அபிஷேகம் செய்தல்; கோடை காலத்தில் பொதுமக்களுக்கு நீர்மோர், நுங்கு தானம் அளித்தல்.",
  },
  46: {
    formulaTa: "8 அல்லது 12-ல் சுக்கிரன் + ராகு சேர்க்கை",
    typeTa: "கோஹத்தி சாபம் / காம கர்ம தோஷம்",
    effectsTa: "வம்ச விருத்தியின்மை, தாம்பத்திய அமைதியின்மை, கடுமையான ரத்த சோகை, பாலியல் ரீதியான வியாதிகள்.",
    remedyTa: "பசு மாடுகளுக்குக் கோதுமை தவிடு, அகத்திக் கீரை, வெல்லம் தொடர்ந்து 48 நாட்கள் அளித்தல்; கோசாலையில் கன்றுகளுக்குப் பால் புகட்ட உதவுதல்.",
  },
  47: {
    formulaTa: "2-ஆம் வீட்டில் சந்திரன் + சனி சேர்க்கை",
    typeTa: "அன்ன-லக்ஷ்மி சாப தோஷம்",
    effectsTa: "எப்போதும் பணப் பற்றாக்குறை மனப்பான்மை, உணவில் திருப்தியின்மை, குடும்பத்தில் நிம்மதியான பேச்சுவார்த்தையின்மை.",
    remedyTa: "பசியோடு வாசலுக்கு வருவோருக்கு ஒருபோதும் உணவில்லை என்று கூறாமல் உணவிடுதல்; ஏழைகளுக்கு வெல்லம் கலந்த அன்னதானம் வழங்குதல்.",
  },
  48: {
    formulaTa: "குரு + கேது சேர்க்கையுடன் சனி பார்வை",
    typeTa: "குரு-சாப பித்ரு தோஷம்",
    effectsTa: "எந்தத் தொழில் தொடங்கினாலும் திடீர் முடக்கம், கடுமையான கடன் சுமை, சமூகத்தில் பெரும் அவப்பெயர்.",
    remedyTa: "தனது ஆன்மீக ஆசானுக்குப் பாத காணிக்கை செலுத்தி ஆசி பெறுதல்; பழமையான மடங்களுக்கு அரிசி, பருப்பு உள்ளிட்ட மளிகைப் பொருட்களைத் தானமளித்தல்.",
  },
  49: {
    formulaTa: "செவ்வாய் 4-ல் நீசம் அல்லது கேதுவுடன் இணைவு",
    typeTa: "பூமி அபகரண தோஷம்",
    effectsTa: "சொந்த வீடு அமையாமல் வாடகை வீட்டிலேயே வாழ்தல், கட்டிய வீட்டில் வசிக்க முடியாமல் போதல், நில விவகாரங்களில் ஏமாறுதல்.",
    remedyTa: "ஆதரவற்ற ஏழைக் குடும்பத்திற்கு வீட்டின் கூரை வேய அல்லது பழுதுபார்க்கப் பொருளுதவி செய்தல்; செவ்வாய்க்கிழமை திருச்செந்தூர் சென்று கடலில் நீராடி முருகனை வழிபடுதல்.",
  },
  50: {
    formulaTa: "6-ஆம் வீட்டில் சூரியன் + புதன் + ராகு சேர்க்கை",
    typeTa: "ஔஷத சாப தோஷம் (மருத்துவ வஞ்சனை)",
    effectsTa: "சரியான நோய் அறிதல் முடியாமை, தவறான மருந்து உட்கொள்ளல், பக்க விளைவுகள், நரம்புத் தளர்ச்சி.",
    remedyTa: "ஆதரவற்ற ஏழை நோயாளிகளுக்குத் தேவையான உயிர் காக்கும் மருந்துகளை இலவசமாக வாங்கிக் கொடுத்தல்; தன்வந்திரி ஹோமத்தில் நெய் சமர்ப்பித்தல்.",
  },
  51: {
    formulaTa: "7 அல்லது 8-ல் செவ்வாய் + சுக்கிரன் + கேது சேர்க்கை",
    typeTa: "மாங்கல்ய தோஷம் / தீவிர களத்திர சாபம்",
    effectsTa: "கடுமையான திருமண முறிவு, வாழ்க்கைத் துணைக்குத் தொடர் ஆரோக்கியக் கேடு, தாலி பாக்கியக் குறைவு.",
    remedyTa: "ஏழைப் பெண்ணின் திருமணத்திற்குத் தாலிக்குத் தங்கம் அல்லது திருமண வஸ்திரம் தானமாக அளித்தல்; திருவீழிமிழலை சென்று அம்பாளுக்குத் திருக்கல்யாண உற்சவம் செய்வித்தல்.",
  },
  52: {
    formulaTa: "5-ஆம் அதிபதி 6-ல் மறைந்து ராகு சேர்க்கை",
    typeTa: "புத்திர ருண கர்ம தோஷம்",
    effectsTa: "பிள்ளைகளால் கடுமையான அவமானம், புத்திர விரயம், பிள்ளைகளுக்காகத் தொடர் மருத்துவச் செலவுகள் செய்து கடனாளியாதல்.",
    remedyTa: "ஆதரவற்ற குழந்தைகள் இல்லங்களுக்குப் பால், உணவு, நோட்டுப் புத்தகங்கள் வழங்குதல்; திருவெண்காடு சென்று புதன் பகவானுக்குப் பிரீதி செய்து நாராயண பூஜை செய்தல்.",
  },
  53: {
    formulaTa: "சனியும் கேதுவும் 1-5-9-ல் தனித்து நிற்றல்",
    typeTa: "பூர்வ தபோ யோகம் (உலகியல் விரக்தி தோஷம்)",
    effectsTa: "உலக ஆசைகளில் தீவிர ஈடுபாடின்மை, குடும்பப் பொறுப்புகளைத் தட்டிக் கழித்தல், மன தனிமை.",
    remedyTa: "இல்லறக் கடமைகளை இறைத் தொண்டாக எண்ணி ஆற்றுதல்; காசி அல்லது ராமேஸ்வரத்தில் சன்யாசிகளுக்கு வஸ்திரமும் அன்னமும் தானம் அளித்தல்.",
  },
  54: {
    formulaTa: "1, 5, 9 அதிபதிகள் சேர்க்கை / பார்வை / பரிவர்த்தனை",
    typeTa: "அகண்ட பூர்வ புண்ணிய யோகம் (தோஷமற்ற உன்னத அமைப்பு)",
    effectsTa: "பூர்வ புண்ணியத்தால் வரும் வெற்றிகளால் ஆணவம் கொண்டால் பின்வரும் தலைமுறைக்கு புண்ணியம் குறையும்.",
    remedyTa: "ஏழை எளியவர்களுக்குக் கல்வி, மருத்துவம், அன்னம் ஆகிய முப்பெரும் தர்மங்களைத் தனது வாழ்நாள் முழுவதும் இடைவிடாது செய்து வருதல்.",
  },
  55: {
    formulaTa: "8-ஆம் அதிபதி + சந்திரன் + கேது 8 அல்லது 12-ல் இணைவு",
    typeTa: "மாத்ரு-பித்ரு பிரேத சாபம்",
    effectsTa: "வீட்டில் காரணமில்லாத பய உணர்வு, துர்மரண நினைவுகள், நீர் கண்டங்கள், பெண்களுக்குத் தொடர் ஆரோக்கியக் கேடு.",
    remedyTa: "தாய் வழி, தந்தை வழி முன்னோர்களுக்குத் திருப்புல்லாணியில் சேது ஸ்நானம் செய்து பிண்ட தானம் அளித்தல்; பெண் குழந்தைகளுக்கு வெள்ளியிலான பாதசரங்கள் தானம் தருதல்.",
  },
  56: {
    formulaTa: "6 அல்லது 8-ஆம் வீட்டில் சனி + சூரியன் + ராகு சேர்க்கை",
    typeTa: "வம்ச விருத்த சாபம் (முதியோர் வதை சாபம்)",
    effectsTa: "அரசு மற்றும் அதிகாரிகளால் கடும் தொல்லை, தந்தையுடன் தீராத விரோதம், முதுமையில் ஆதரவற்ற பய உணர்வு, நரம்புத் தளர்ச்சி.",
    remedyTa: "முதியோர் இல்லங்களில் உள்ள ஆதரவற்ற பெரியவர்களுக்கு வேட்டி, சட்டை, உணவு வழங்கி அவர்களின் பாதங்களைத் தொட்டு ஆசி பெறுதல்; சூரிய பகவானுக்கு எள் கலந்த நைவேத்தியம் படைத்தல்.",
  },
  57: {
    formulaTa: "சனியின் துல்லிய பாகைக்கு எதிரில் (180^\\circ) ஒரு கிரகம் நிற்றல்",
    typeTa: "கர்ம ருண பந்த தோஷம்",
    effectsTa: "அந்த குறிப்பிட்ட கிரகக் காரக உறவினால் ஏமாற்றம், விரயம், மனக்கசப்பு, தீராத கடன் பாக்கி ஏற்படுதல்.",
    remedyTa: "குறிப்பிட்ட கிரகத்திற்குரிய தானியத்தை 8 சனிக்கிழமைகள் ஏழைகளுக்குத் தானமாக வழங்கி, சனீஸ்வர பகவானுக்கு நல்லெண்ணெய் தீபம் ஏற்றி மனமுருகப் பிரார்த்தித்தல்.",
  },
  58: {
    formulaTa: "5 அல்லது 9-ஆம் வீட்டில் சூரியன் + செவ்வாய் + கேது சேர்க்கை",
    typeTa: "விருட்ச சாபம் / பித்ரு வம்ச தோஷம்",
    effectsTa: "தலைமுறை இடைவெளி (குடும்பத்தில் வாரிசு உருவாவதில் நீண்ட இடைவெளி), தண்டுவடம் மற்றும் எலும்பு வியாதிகள்.",
    remedyTa: "சிவாலயங்கள் அல்லது பொது இடங்களில் ஆலமரம், அரசமரம், வில்வ மரம் நட்டுப் பராமரித்தல்; மரங்களை வெட்டுவதைத் தடுத்து மரம் நடுவோருக்கு உதவி செய்தல்.",
  },
  59: {
    formulaTa: "9 மற்றும் 10-ஆம் அதிபதிகள் 6 மற்றும் 8-ஆம் அதிபதிகளுடன் பரிவர்த்தனை",
    typeTa: "தர்ம-கர்ம பரிவர்த்தனை சாபம்",
    effectsTa: "எவ்வளவு உழைத்தாலும் நற்பெயர் கிடைக்காமல் போவதுடன், அடுத்தவர் செய்த நிதி மோசடிப் பழி இவர் மீது விழுதல், பதவி இழப்பு.",
    remedyTa: "பொதுக் கோவில்களின் உண்டியலில் கர்ம நிவர்த்தியாகக் காணிக்கை செலுத்துதல்; ஏழை எளிய தொழிலாளர்களின் ஊதியத்தை உடனடியாக வழங்கி அவர்களுக்குப் புத்தாடை தானமளித்தல்.",
  },
  60: {
    formulaTa: "லக்னம் அல்லது 8-ல் செவ்வாய் + புதன் + கேது சேர்க்கை",
    typeTa: "மூலிகை சாபம் / சித்த வித்யா வஞ்சனை தோஷம்",
    effectsTa: "சரும வெடிப்பு, ரத்தத்தில் நச்சுத் தன்மை, காரணமறியாத அலர்ஜி உபாதைகள், நரம்பு எரிச்சல்.",
    remedyTa: "தன்வந்திரி சன்னதியில் நெய்தீபமேற்றி, சித்த மருத்துவம் செய்யும் ஏழை மருத்துவர்களுக்கு மூலிகைகள் வாங்க நிதியுதவி செய்தல்; சித்தர்களின் திருவுருவத்திற்குப் பச்சை வஸ்திரமும் சந்தனமும் சார்த்தி வழிபடுதல்.",
  },
};

const SIGN_LORD_KEY = {
  1: "mars", 2: "venus", 3: "mercury", 4: "moon", 5: "sun", 6: "mercury",
  7: "venus", 8: "mars", 9: "jupiter", 10: "saturn", 11: "saturn", 12: "jupiter",
};

const CLASSICAL_PLANETS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
const RULE11_BENEFICS = ["venus", "mercury", "moon"];
const RULE16_MALEFICS = ["saturn", "mars", "rahu", "ketu"];

// Standard 60 Shashtiamsha names in odd-sign order.
// For even signs the name order is reversed.
const SHASHTIAMSHA_NAMES = [
  "Ghora", "Rakshasa", "Deva", "Kubera", "Yaksha", "Kinnara", "Bhrashta", "Kulaghna", "Garala", "Vahni",
  "Maya", "Purishaka", "Apampati", "Marutwana", "Kala", "Sarpa", "Amrita", "Indu", "Mridu", "Komala",
  "Heramba", "Brahma", "Vishnu", "Maheshwara", "Deva", "Ardra", "Kalinasha", "Kshitisa", "Kamalakara", "Gulika",
  "Mrityu", "Kala", "Davagni", "Ghora", "Yama", "Kantaka", "Sudha", "Amrita", "Purnachandra", "Vishadagdha",
  "Kulanasha", "Vamshakshaya", "Utpata", "Kala", "Saumya", "Komala", "Sheetala", "Karaladamshtra", "Candramukhi", "Praveena",
  "Kalapavaka", "Dandayudha", "Nirmala", "Saumya", "Krura", "Atisheetala", "Amrita", "Payodhi", "Bhramana", "Chandrarekha",
];

// Malefic/cruel Shashtiamsha names used for Rule 20.
// This is kept explicit so UAT can verify the classification independently.
const MALEFIC_SHASHTIAMSHA_NAMES = new Set([
  "Ghora", "Rakshasa", "Bhrashta", "Kulaghna", "Garala", "Vahni", "Maya", "Purishaka",
  "Kala", "Sarpa", "Ardra", "Kalinasha", "Gulika", "Mrityu", "Davagni", "Yama", "Kantaka",
  "Vishadagdha", "Kulanasha", "Vamshakshaya", "Utpata", "Karaladamshtra", "Kalapavaka", "Krura", "Bhramana",
]);

function normalizeDegree(value) {
  let n = Number(value) % 360;
  if (n < 0) n += 360;
  return n;
}

function degreeInRasi(planet) {
  if (!planet) return null;
  if (Number.isFinite(Number(planet.degreeInRasi))) return Number(planet.degreeInRasi);
  if (!Number.isFinite(Number(planet.longitude))) return null;
  return normalizeDegree(planet.longitude) % 30;
}

function angularDistance(a, b) {
  const diff = Math.abs(normalizeDegree(a) - normalizeDegree(b));
  return Math.min(diff, 360 - diff);
}

function getPlanet(planets, key) {
  return Array.isArray(planets)
    ? planets.find((planet) => planet && planet.key === key) || null
    : null;
}

function houseRasiNo(lagnaRasiNo, houseNo) {
  return ((Number(lagnaRasiNo) + Number(houseNo) - 2) % 12) + 1;
}

function houseNoFromRasi(lagnaRasiNo, rasiNo) {
  return ((Number(rasiNo) - Number(lagnaRasiNo) + 12) % 12) + 1;
}

function sameRasi(a, b) {
  return Boolean(a && b && Number(a.rasiNo) === Number(b.rasiNo));
}

function withinDegrees(a, b, maxDegrees) {
  if (!a || !b) return false;
  return angularDistance(a.longitude, b.longitude) <= maxDegrees;
}

function oppositeRasi(a, b) {
  if (!a || !b) return false;
  return houseNoFromRasi(a.rasiNo, b.rasiNo) === 7;
}

function lordOfHouse(lagna, houseNo) {
  if (!lagna) return null;
  const rasiNo = houseRasiNo(lagna.rasiNo, houseNo);
  return SIGN_LORD_KEY[rasiNo] || null;
}

function makeResult(ruleNo, matched, details = {}) {
  const source = SOURCE_RULES[ruleNo];
  return {
    ruleNo,
    matched: Boolean(matched),
    formula: source.formulaTa,
    doshaYogaType: source.typeTa,
    problems: source.effectsTa,
    remedy: source.remedyTa,
    details,
  };
}

function rasiAtOffset(fromRasiNo, offset) {
  return ((Number(fromRasiNo) - 1 + Number(offset)) % 12) + 1;
}

function planetsInRasi(planets, rasiNo, allowedKeys = null) {
  return (Array.isArray(planets) ? planets : []).filter((planet) => {
    if (!planet || Number(planet.rasiNo) !== Number(rasiNo)) return false;
    return !allowedKeys || allowedKeys.includes(planet.key);
  });
}

function exchangeBetweenHouses(lagna, planets, houseA, houseB) {
  const lordAKey = lordOfHouse(lagna, houseA);
  const lordBKey = lordOfHouse(lagna, houseB);
  if (!lordAKey || !lordBKey || lordAKey === lordBKey) return null;

  const lordA = getPlanet(planets, lordAKey);
  const lordB = getPlanet(planets, lordBKey);
  if (!lordA || !lordB) return null;

  const houseARasi = houseRasiNo(lagna.rasiNo, houseA);
  const houseBRasi = houseRasiNo(lagna.rasiNo, houseB);
  const isExchange = Number(lordA.rasiNo) === Number(houseBRasi)
    && Number(lordB.rasiNo) === Number(houseARasi);

  if (!isExchange) return null;
  return {
    houseA,
    houseB,
    lordAKey,
    lordBKey,
    houseARasi,
    houseBRasi,
  };
}

function ketuAspectsRasi(ketu, targetRasiNo, aspects) {
  if (!ketu || !targetRasiNo) return false;

  const aspectHit = Array.isArray(aspects) && aspects.some((aspect) =>
    aspect && aspect.fromKey === "ketu" && Number(aspect.toRasi) === Number(targetRasiNo)
  );
  if (aspectHit) return true;

  // Current locked API models Rahu/Ketu with 7th aspect.
  return houseNoFromRasi(ketu.rasiNo, targetRasiNo) === 7;
}

function shashtiamshaOfPlanet(planet) {
  if (!planet || !Number.isFinite(Number(planet.longitude))) return null;

  const longitude = normalizeDegree(planet.longitude);
  const rasiNo = Number(planet.rasiNo) || Math.floor(longitude / 30) + 1;
  const inRasi = longitude % 30;
  const segment = Math.min(60, Math.floor((inRasi + 1e-10) / 0.5) + 1);
  const nameIndex = rasiNo % 2 === 1 ? segment : 61 - segment;
  const name = SHASHTIAMSHA_NAMES[nameIndex - 1];
  const classification = MALEFIC_SHASHTIAMSHA_NAMES.has(name) ? "malefic" : "non_malefic";

  return {
    rasiNo,
    degreeInRasi: inRasi,
    segment,
    nameIndex,
    name,
    classification,
    segmentSizeDegrees: 0.5,
    evenSignOrderReversed: rasiNo % 2 === 0,
  };
}


function nakshatraNumberFromLongitude(longitude) {
  if (!Number.isFinite(Number(longitude))) return null;
  return Math.floor(normalizeDegree(longitude) / (360 / 27)) + 1;
}

function mudakkuNakshatraNumberFromSun(sun) {
  const sunNak = sun ? nakshatraNumberFromLongitude(sun.longitude) : null;
  if (!sunNak) return null;
  const countToMulaInclusive = ((19 - sunNak + 27) % 27) + 1;
  return ((20 - 1 + countToMulaInclusive - 1) % 27) + 1;
}

function nakshatraAtOffset(baseNakshatraNo, offset) {
  if (!baseNakshatraNo) return null;
  return ((Number(baseNakshatraNo) - 1 + Number(offset)) % 27) + 1;
}

function beneficAspectsRasi(planets, aspects, targetRasiNo) {
  const beneficKeys = ["jupiter", "venus", "mercury", "moon"];
  return (Array.isArray(aspects) ? aspects : [])
    .filter((aspect) => aspect && beneficKeys.includes(aspect.fromKey) && Number(aspect.toRasi) === Number(targetRasiNo))
    .map((aspect) => aspect.fromKey);
}

function nodeRelationToRasi(node, targetRasiNo, aspects) {
  if (!node || !targetRasiNo) return { related: false, conjunction: false, aspect: false };
  const conjunction = Number(node.rasiNo) === Number(targetRasiNo);
  const aspect = (Array.isArray(aspects) ? aspects : []).some((a) => a && a.fromKey === node.key && Number(a.toRasi) === Number(targetRasiNo))
    || houseNoFromRasi(node.rasiNo, targetRasiNo) === 7;
  return { related: conjunction || aspect, conjunction, aspect };
}

function isLongitudeWithinForwardArc(start, end, value) {
  const s = normalizeDegree(start);
  const e = normalizeDegree(end);
  const v = normalizeDegree(value);
  const arc = (e - s + 360) % 360;
  const pos = (v - s + 360) % 360;
  return pos <= arc + 1e-9;
}

function isClientKalaSarpaEnclosed(planets, rahu, ketu) {
  if (!rahu || !ketu) return { matched: false, direction: null, outsidePlanets: [] };
  const considered = CLASSICAL_PLANETS.map((key) => getPlanet(planets, key)).filter(Boolean);

  const checkDirection = (startNode, endNode, label) => {
    const outside = [];
    for (const planet of considered) {
      const jointWithBoundary = Number(planet.rasiNo) === Number(rahu.rasiNo) || Number(planet.rasiNo) === Number(ketu.rasiNo);
      const insideArc = isLongitudeWithinForwardArc(startNode.longitude, endNode.longitude, planet.longitude);
      if (!jointWithBoundary && !insideArc) outside.push(planet.key);
    }
    return { matched: outside.length === 0, direction: label, outsidePlanets: outside };
  };

  const rk = checkDirection(rahu, ketu, "rahu_to_ketu");
  if (rk.matched) return rk;
  const kr = checkDirection(ketu, rahu, "ketu_to_rahu");
  if (kr.matched) return kr;
  return { matched: false, direction: null, outsidePlanets: Array.from(new Set([...rk.outsidePlanets, ...kr.outsidePlanets])) };
}

function taraPositionFromJanma(janmaNakshatraNo, targetNakshatraNo) {
  if (!janmaNakshatraNo || !targetNakshatraNo) return null;
  const inclusiveCount = ((Number(targetNakshatraNo) - Number(janmaNakshatraNo) + 27) % 27) + 1;
  return ((inclusiveCount - 1) % 9) + 1;
}

function aspectFromTo(aspects, fromKey, targetRasiNo) {
  return Array.isArray(aspects) && aspects.some((aspect) =>
    aspect && aspect.fromKey === fromKey && Number(aspect.toRasi) === Number(targetRasiNo)
  );
}

function trinalRasiRelation(aRasiNo, bRasiNo) {
  if (!aRasiNo || !bRasiNo) return false;
  const house = houseNoFromRasi(aRasiNo, bRasiNo);
  return house === 5 || house === 9;
}

function dashaLordNameToKey(value) {
  const text = String(value || "").trim().toLowerCase();
  const map = {
    sun: "sun", "சூரியன்": "sun",
    moon: "moon", "சந்திரன்": "moon",
    mars: "mars", "செவ்வாய்": "mars",
    mercury: "mercury", "புதன்": "mercury",
    jupiter: "jupiter", "குரு": "jupiter",
    venus: "venus", "சுக்கிரன்": "venus",
    saturn: "saturn", "சனி": "saturn",
    rahu: "rahu", "ராகு": "rahu",
    ketu: "ketu", "கேது": "ketu",
  };
  return map[text] || null;
}

function kalaSarpaArcEvaluations(planets, rahu, ketu) {
  if (!rahu || !ketu) return [];
  const considered = CLASSICAL_PLANETS.map((key) => getPlanet(planets, key)).filter(Boolean);
  const evaluate = (startNode, endNode, direction) => {
    const outsidePlanets = [];
    for (const planet of considered) {
      const jointWithBoundary = Number(planet.rasiNo) === Number(rahu.rasiNo)
        || Number(planet.rasiNo) === Number(ketu.rasiNo);
      const insideArc = isLongitudeWithinForwardArc(startNode.longitude, endNode.longitude, planet.longitude);
      if (!jointWithBoundary && !insideArc) outsidePlanets.push(planet.key);
    }
    return { direction, outsidePlanets };
  };
  return [
    evaluate(rahu, ketu, "rahu_to_ketu"),
    evaluate(ketu, rahu, "ketu_to_rahu"),
  ];
}

function buildNadiRuleAnalysis({ lagna, planets, aspects = [], dasha, language = "ta" }) {
  void dasha;
  void language;

  const sun = getPlanet(planets, "sun");
  const moon = getPlanet(planets, "moon");
  const mars = getPlanet(planets, "mars");
  const mercury = getPlanet(planets, "mercury");
  const jupiter = getPlanet(planets, "jupiter");
  const venus = getPlanet(planets, "venus");
  const saturn = getPlanet(planets, "saturn");
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");

  const results = [];

  // Rules 1-10: frozen after UAT. Do not alter without explicit change request.
  results.push(makeResult(1, withinDegrees(jupiter, rahu, 5), {
    angularDistance: jupiter && rahu ? angularDistance(jupiter.longitude, rahu.longitude) : null,
    maxDegrees: 5,
    planetKeys: ["jupiter", "rahu"],
  }));

  const r2Rahu = withinDegrees(sun, rahu, 5);
  const r2Ketu = withinDegrees(sun, ketu, 5);
  results.push(makeResult(2, r2Rahu || r2Ketu, {
    matchedWith: r2Rahu ? "rahu" : r2Ketu ? "ketu" : null,
    rahuDistance: sun && rahu ? angularDistance(sun.longitude, rahu.longitude) : null,
    ketuDistance: sun && ketu ? angularDistance(sun.longitude, ketu.longitude) : null,
    maxDegrees: 5,
  }));

  const r3Ketu = withinDegrees(moon, ketu, 5);
  const r3Saturn = withinDegrees(moon, saturn, 5);
  results.push(makeResult(3, r3Ketu || r3Saturn, {
    matchedWith: r3Ketu ? "ketu" : r3Saturn ? "saturn" : null,
    ketuDistance: moon && ketu ? angularDistance(moon.longitude, ketu.longitude) : null,
    saturnDistance: moon && saturn ? angularDistance(moon.longitude, saturn.longitude) : null,
    maxDegrees: 5,
  }));

  const r4Rahu = withinDegrees(mars, rahu, 5);
  const r4Ketu = withinDegrees(mars, ketu, 5);
  results.push(makeResult(4, r4Rahu || r4Ketu, {
    matchedWith: r4Rahu ? "rahu" : r4Ketu ? "ketu" : null,
    rahuDistance: mars && rahu ? angularDistance(mars.longitude, rahu.longitude) : null,
    ketuDistance: mars && ketu ? angularDistance(mars.longitude, ketu.longitude) : null,
    maxDegrees: 5,
  }));

  results.push(makeResult(5, withinDegrees(venus, ketu, 5), {
    angularDistance: venus && ketu ? angularDistance(venus.longitude, ketu.longitude) : null,
    maxDegrees: 5,
    planetKeys: ["venus", "ketu"],
  }));

  const r6Conjunction = sameRasi(saturn, mars);
  const r6Opposition = oppositeRasi(saturn, mars);
  results.push(makeResult(6, r6Conjunction || r6Opposition, {
    conjunctionSameRasi: r6Conjunction,
    opposition180Axis: r6Opposition,
    saturnRasiNo: saturn?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
  }));

  const r7Rahu = withinDegrees(mercury, rahu, 5);
  const r7Saturn = withinDegrees(mercury, saturn, 5);
  results.push(makeResult(7, r7Rahu || r7Saturn, {
    matchedWith: r7Rahu ? "rahu" : r7Saturn ? "saturn" : null,
    rahuDistance: mercury && rahu ? angularDistance(mercury.longitude, rahu.longitude) : null,
    saturnDistance: mercury && saturn ? angularDistance(mercury.longitude, saturn.longitude) : null,
    maxDegrees: 5,
  }));

  const fifthRasiNo = lagna ? houseRasiNo(lagna.rasiNo, 5) : null;
  const r8Saturn = Boolean(saturn && fifthRasiNo && saturn.rasiNo === fifthRasiNo);
  const r8Ketu = Boolean(ketu && fifthRasiNo && ketu.rasiNo === fifthRasiNo);
  results.push(makeResult(8, r8Saturn || r8Ketu, {
    fifthHouseRasiNo: fifthRasiNo,
    matchedPlanets: [
      ...(r8Saturn ? ["saturn"] : []),
      ...(r8Ketu ? ["ketu"] : []),
    ],
  }));

  const ninthLordKey = lagna ? lordOfHouse(lagna, 9) : null;
  const ninthLord = getPlanet(planets, ninthLordKey);
  const ninthLordHouse = lagna && ninthLord
    ? houseNoFromRasi(lagna.rasiNo, ninthLord.rasiNo)
    : null;
  results.push(makeResult(9, ninthLordHouse === 8 || ninthLordHouse === 12, {
    ninthLordKey,
    ninthLordHouse,
    ninthLordRasiNo: ninthLord?.rasiNo ?? null,
  }));

  results.push(makeResult(10, sameRasi(saturn, ketu), {
    saturnRasiNo: saturn?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    conjunctionSameRasi: sameRasi(saturn, ketu),
  }));

  // Rule 11 - benefics Venus/Mercury/Moon in 5th or 9th from Jupiter.
  const jupiterFifthRasi = jupiter ? rasiAtOffset(jupiter.rasiNo, 4) : null;
  const jupiterNinthRasi = jupiter ? rasiAtOffset(jupiter.rasiNo, 8) : null;
  const rule11Matches = [
    ...(jupiterFifthRasi ? planetsInRasi(planets, jupiterFifthRasi, RULE11_BENEFICS) : []),
    ...(jupiterNinthRasi ? planetsInRasi(planets, jupiterNinthRasi, RULE11_BENEFICS) : []),
  ];
  results.push(makeResult(11, rule11Matches.length > 0, {
    beneficPlanetKeys: RULE11_BENEFICS,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    fifthFromJupiterRasiNo: jupiterFifthRasi,
    ninthFromJupiterRasiNo: jupiterNinthRasi,
    matchedPlanets: rule11Matches.map((p) => ({ key: p.key, rasiNo: p.rasiNo })),
  }));

  // Rule 12 - Lagna lord in 12th and receiving Ketu's 7th aspect.
  const lagnaLordKey = lagna ? lordOfHouse(lagna, 1) : null;
  const lagnaLord = getPlanet(planets, lagnaLordKey);
  const lagnaLordHouse = lagna && lagnaLord ? houseNoFromRasi(lagna.rasiNo, lagnaLord.rasiNo) : null;
  const rule12KetuAspect = lagnaLord ? ketuAspectsRasi(ketu, lagnaLord.rasiNo, aspects) : false;
  results.push(makeResult(12, lagnaLordHouse === 12 && rule12KetuAspect, {
    lagnaLordKey,
    lagnaLordHouse,
    lagnaLordRasiNo: lagnaLord?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuAspect: rule12KetuAspect,
  }));

  // Rule 13 - any exchange between dusthana lords (6/8/12) and dharma lords (1/5/9).
  const rule13Exchanges = [];
  if (lagna) {
    for (const dusthanaHouse of [6, 8, 12]) {
      for (const dharmaHouse of [1, 5, 9]) {
        const exchange = exchangeBetweenHouses(lagna, planets, dusthanaHouse, dharmaHouse);
        if (exchange) rule13Exchanges.push(exchange);
      }
    }
  }
  results.push(makeResult(13, rule13Exchanges.length > 0, {
    exchanges: rule13Exchanges,
  }));

  // Rule 14 - same Rasi as Rahu and planet's 0-30 degree <= Rahu's 0-30 degree.
  const rahuDegree = degreeInRasi(rahu);
  const rule14MatchedPlanets = CLASSICAL_PLANETS
    .map((key) => getPlanet(planets, key))
    .filter((planet) => planet && rahu && sameRasi(planet, rahu))
    .filter((planet) => degreeInRasi(planet) <= rahuDegree)
    .map((planet) => ({ key: planet.key, rasiNo: planet.rasiNo, degreeInRasi: degreeInRasi(planet) }));
  results.push(makeResult(14, rule14MatchedPlanets.length > 0, {
    comparison: "planetDegreeInRasi <= rahuDegreeInRasi",
    rahuRasiNo: rahu?.rasiNo ?? null,
    rahuDegreeInRasi: rahuDegree,
    consideredPlanets: CLASSICAL_PLANETS,
    matchedPlanets: rule14MatchedPlanets,
  }));

  // Rule 15 - same Rasi as Ketu and planet's 0-30 degree >= Ketu's 0-30 degree.
  const ketuDegree = degreeInRasi(ketu);
  const rule15MatchedPlanets = CLASSICAL_PLANETS
    .map((key) => getPlanet(planets, key))
    .filter((planet) => planet && ketu && sameRasi(planet, ketu))
    .filter((planet) => degreeInRasi(planet) >= ketuDegree)
    .map((planet) => ({ key: planet.key, rasiNo: planet.rasiNo, degreeInRasi: degreeInRasi(planet) }));
  results.push(makeResult(15, rule15MatchedPlanets.length > 0, {
    comparison: "planetDegreeInRasi >= ketuDegreeInRasi",
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuDegreeInRasi: ketuDegree,
    consideredPlanets: CLASSICAL_PLANETS,
    matchedPlanets: rule15MatchedPlanets,
  }));

  // Rule 16 - modular Papakartari evaluation around every classical karaka planet.
  const rule16KarakaResults = {};
  for (const karakaKey of CLASSICAL_PLANETS) {
    const karaka = getPlanet(planets, karakaKey);
    if (!karaka) {
      rule16KarakaResults[karakaKey] = { matched: false, reason: "planet_not_available" };
      continue;
    }
    const secondRasiNo = rasiAtOffset(karaka.rasiNo, 1);
    const twelfthRasiNo = rasiAtOffset(karaka.rasiNo, 11);
    const secondMalefics = planetsInRasi(planets, secondRasiNo, RULE16_MALEFICS).map((p) => p.key);
    const twelfthMalefics = planetsInRasi(planets, twelfthRasiNo, RULE16_MALEFICS).map((p) => p.key);
    rule16KarakaResults[karakaKey] = {
      matched: secondMalefics.length > 0 && twelfthMalefics.length > 0,
      karakaRasiNo: karaka.rasiNo,
      secondRasiNo,
      twelfthRasiNo,
      secondMalefics,
      twelfthMalefics,
    };
  }
  const rule16MatchedKarakas = Object.entries(rule16KarakaResults)
    .filter(([, value]) => value.matched)
    .map(([key]) => key);
  results.push(makeResult(16, rule16MatchedKarakas.length > 0, {
    maleficPlanetKeys: RULE16_MALEFICS,
    optionalSunAndWaningMoonExcluded: true,
    matchedKarakas: rule16MatchedKarakas,
    karakaResults: rule16KarakaResults,
  }));

  // Rule 17 - any retrograde planet in the 5th or 9th house.
  const fifthHouseRasi = lagna ? houseRasiNo(lagna.rasiNo, 5) : null;
  const ninthHouseRasi = lagna ? houseRasiNo(lagna.rasiNo, 9) : null;
  const rule17Planets = (Array.isArray(planets) ? planets : [])
    .filter((planet) => planet && planet.retrograde === true)
    .filter((planet) => Number(planet.rasiNo) === Number(fifthHouseRasi) || Number(planet.rasiNo) === Number(ninthHouseRasi))
    .map((planet) => ({ key: planet.key, rasiNo: planet.rasiNo, houseNo: houseNoFromRasi(lagna.rasiNo, planet.rasiNo) }));
  results.push(makeResult(17, rule17Planets.length > 0, {
    fifthHouseRasiNo: fifthHouseRasi,
    ninthHouseRasiNo: ninthHouseRasi,
    matchedPlanets: rule17Planets,
  }));

  // Rule 18 - Saturn and Mars in opposite Rasis (Samasaptaka).
  results.push(makeResult(18, oppositeRasi(saturn, mars), {
    saturnRasiNo: saturn?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    oppositionByRasi: oppositeRasi(saturn, mars),
  }));

  // Rule 19 - Sun and Saturn in opposite Rasis (Samasaptaka).
  results.push(makeResult(19, oppositeRasi(sun, saturn), {
    sunRasiNo: sun?.rasiNo ?? null,
    saturnRasiNo: saturn?.rasiNo ?? null,
    oppositionByRasi: oppositeRasi(sun, saturn),
  }));

  // Rule 20 - 5th lord in malefic/cruel Shashtiamsha (D60 named division).
  const fifthLordKey = lagna ? lordOfHouse(lagna, 5) : null;
  const fifthLord = getPlanet(planets, fifthLordKey);
  const fifthLordD60 = shashtiamshaOfPlanet(fifthLord);
  const rule20Matched = Boolean(fifthLordD60 && fifthLordD60.classification === "malefic");
  results.push(makeResult(20, rule20Matched, {
    fifthLordKey,
    fifthLordRasiNo: fifthLord?.rasiNo ?? null,
    shashtiamsha: fifthLordD60,
    calculationConvention: "60 x 0.5-degree named Shashtiamshas; odd signs direct order, even signs reverse order",
  }));



  // Rule 21 - Saturn or Rahu in the 1st/5th/9th Nakshatra from Mudakku Nakshatra.
  const mudakkuNakshatraNo = mudakkuNakshatraNumberFromSun(sun);
  const rule21TargetNakshatras = mudakkuNakshatraNo
    ? [mudakkuNakshatraNo, nakshatraAtOffset(mudakkuNakshatraNo, 4), nakshatraAtOffset(mudakkuNakshatraNo, 8)]
    : [];
  const rule21MatchedPlanets = [saturn, rahu]
    .filter(Boolean)
    .map((planet) => ({ key: planet.key, nakshatraNumber: nakshatraNumberFromLongitude(planet.longitude) }))
    .filter((planet) => rule21TargetNakshatras.includes(planet.nakshatraNumber));
  results.push(makeResult(21, rule21MatchedPlanets.length > 0, {
    mudakkuNakshatraNumber: mudakkuNakshatraNo,
    targetNakshatraNumbers: rule21TargetNakshatras,
    matchedPlanets: rule21MatchedPlanets,
    calculationMethod: "mudakku from Sun nakshatra, then 1-5-9 nakshatra positions",
  }));

  // Rule 22 - 8th lord conjunct Rahu (same Rasi).
  const eighthLordKey = lagna ? lordOfHouse(lagna, 8) : null;
  const eighthLord = getPlanet(planets, eighthLordKey);
  results.push(makeResult(22, sameRasi(eighthLord, rahu), {
    eighthLordKey,
    eighthLordRasiNo: eighthLord?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    conjunctionSameRasi: sameRasi(eighthLord, rahu),
  }));

  // Rule 23 - Mercury in 5th or 9th from Jupiter.
  const rule23Matched = Boolean(mercury && (
    Number(mercury.rasiNo) === Number(jupiterFifthRasi)
    || Number(mercury.rasiNo) === Number(jupiterNinthRasi)
  ));
  results.push(makeResult(23, rule23Matched, {
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    mercuryRasiNo: mercury?.rasiNo ?? null,
    fifthFromJupiterRasiNo: jupiterFifthRasi,
    ninthFromJupiterRasiNo: jupiterNinthRasi,
  }));

  // Rule 24 - Ketu alone in 12th house and receiving a benefic aspect.
  // Interpretation used for implementation: natural benefics = Jupiter, Venus, Mercury, Moon.
  const twelfthHouseRasiNo = lagna ? houseRasiNo(lagna.rasiNo, 12) : null;
  const rule24KetuIn12th = Boolean(ketu && Number(ketu.rasiNo) === Number(twelfthHouseRasiNo));
  const rule24OtherPlanets = rule24KetuIn12th
    ? (Array.isArray(planets) ? planets : []).filter((p) => p && p.key !== "ketu" && Number(p.rasiNo) === Number(twelfthHouseRasiNo)).map((p) => p.key)
    : [];
  const rule24BeneficAspects = rule24KetuIn12th ? beneficAspectsRasi(planets, aspects, twelfthHouseRasiNo) : [];
  results.push(makeResult(24, rule24KetuIn12th && rule24OtherPlanets.length === 0 && rule24BeneficAspects.length > 0, {
    twelfthHouseRasiNo,
    ketuInTwelfth: rule24KetuIn12th,
    otherPlanetsInTwelfth: rule24OtherPlanets,
    beneficAspectPlanetKeys: rule24BeneficAspects,
    beneficKeysUsed: ["jupiter", "venus", "mercury", "moon"],
    interpretationNeedsClientFreezeConfirmation: true,
  }));

  // Rule 25 - 9th lord in 12th with Ketu relation.
  // Interpretation used: Ketu relation = conjunction or locked 7th aspect.
  const rule25NinthLordIn12th = ninthLordHouse === 12;
  const rule25KetuRelation = ninthLord ? nodeRelationToRasi(ketu, ninthLord.rasiNo, aspects) : { related: false, conjunction: false, aspect: false };
  results.push(makeResult(25, rule25NinthLordIn12th && rule25KetuRelation.related, {
    ninthLordKey,
    ninthLordHouse,
    ninthLordRasiNo: ninthLord?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuRelation: rule25KetuRelation,
    interpretationNeedsClientFreezeConfirmation: true,
  }));

  // Rule 26 - all seven classical planets enclosed by the Rahu-Ketu axis.
  // Uses the already confirmed client convention: boundary inclusive; same-Rasi conjunction with either node counts inside.
  const rule26KalaSarpa = isClientKalaSarpaEnclosed(planets, rahu, ketu);
  results.push(makeResult(26, rule26KalaSarpa.matched, {
    consideredPlanets: CLASSICAL_PLANETS,
    mandiExcluded: true,
    boundaryInclusive: true,
    sameRasiWithNodeCountsInside: true,
    direction: rule26KalaSarpa.direction,
    outsidePlanets: rule26KalaSarpa.outsidePlanets,
  }));

  // Rule 27 - Saturn/Rahu in Vipat(3), Pratyak(5), Vadha(7) Tara from Moon's Janma Nakshatra.
  const janmaNakshatraNo = moon ? nakshatraNumberFromLongitude(moon.longitude) : null;
  const rule27MatchedPlanets = [saturn, rahu].filter(Boolean).map((planet) => {
    const nakshatraNumber = nakshatraNumberFromLongitude(planet.longitude);
    const taraPosition = taraPositionFromJanma(janmaNakshatraNo, nakshatraNumber);
    return { key: planet.key, nakshatraNumber, taraPosition };
  }).filter((item) => [3, 5, 7].includes(item.taraPosition));
  results.push(makeResult(27, rule27MatchedPlanets.length > 0, {
    janmaNakshatraNumber: janmaNakshatraNo,
    targetTaraPositions: [3, 5, 7],
    matchedPlanets: rule27MatchedPlanets,
  }));

  // Rule 28 - Sun + Moon + Rahu OR Ketu in the same Rasi.
  const rule28WithRahu = sameRasi(sun, moon) && sameRasi(sun, rahu);
  const rule28WithKetu = sameRasi(sun, moon) && sameRasi(sun, ketu);
  results.push(makeResult(28, rule28WithRahu || rule28WithKetu, {
    matchedWith: rule28WithRahu ? "rahu" : rule28WithKetu ? "ketu" : null,
    sunRasiNo: sun?.rasiNo ?? null,
    moonRasiNo: moon?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
  }));

  // Rule 29 - Mercury + Ketu within 3 degrees.
  results.push(makeResult(29, withinDegrees(mercury, ketu, 3), {
    angularDistance: mercury && ketu ? angularDistance(mercury.longitude, ketu.longitude) : null,
    maxDegrees: 3,
    planetKeys: ["mercury", "ketu"],
  }));

  // Rule 30 - Mars + Saturn both in the 4th house.
  const fourthHouseRasiNo = lagna ? houseRasiNo(lagna.rasiNo, 4) : null;
  const rule30Matched = Boolean(mars && saturn &&
    Number(mars.rasiNo) === Number(fourthHouseRasiNo) &&
    Number(saturn.rasiNo) === Number(fourthHouseRasiNo));
  results.push(makeResult(30, rule30Matched, {
    fourthHouseRasiNo,
    marsRasiNo: mars?.rasiNo ?? null,
    saturnRasiNo: saturn?.rasiNo ?? null,
  }));

  // Rules 31-40: controlled additive implementation. Rules 1-30 above are frozen.

  // Rule 31 - Lagna lord in 8th/12th house together with Rahu.
  const rule31House = lagnaLordHouse;
  const rule31ConjunctRahu = sameRasi(lagnaLord, rahu);
  results.push(makeResult(31, (rule31House === 8 || rule31House === 12) && rule31ConjunctRahu, {
    lagnaLordKey,
    lagnaLordHouse: rule31House,
    lagnaLordRasiNo: lagnaLord?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    conjunctionSameRasi: rule31ConjunctRahu,
  }));

  // Rule 32 - Venus in 6th house receiving Rahu or Mars aspect.
  const venusHouse = lagna && venus ? houseNoFromRasi(lagna.rasiNo, venus.rasiNo) : null;
  const rule32RahuAspect = venus ? aspectFromTo(aspects, "rahu", venus.rasiNo) : false;
  const rule32MarsAspect = venus ? aspectFromTo(aspects, "mars", venus.rasiNo) : false;
  results.push(makeResult(32, venusHouse === 6 && (rule32RahuAspect || rule32MarsAspect), {
    venusHouse,
    venusRasiNo: venus?.rasiNo ?? null,
    rahuAspect: rule32RahuAspect,
    marsAspect: rule32MarsAspect,
  }));

  // Rule 33 - retrograde Jupiter in 5th or 9th house.
  const jupiterHouse = lagna && jupiter ? houseNoFromRasi(lagna.rasiNo, jupiter.rasiNo) : null;
  results.push(makeResult(33, Boolean(jupiter?.retrograde) && (jupiterHouse === 5 || jupiterHouse === 9), {
    jupiterHouse,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    retrograde: Boolean(jupiter?.retrograde),
  }));

  // Rule 34 - 12th lord placed in Ketu-ruled Nakshatra: Ashwini(1), Magha(10), Mula(19).
  const twelfthLordKey = lagna ? lordOfHouse(lagna, 12) : null;
  const twelfthLord = getPlanet(planets, twelfthLordKey);
  const twelfthLordNakshatraNo = twelfthLord ? nakshatraNumberFromLongitude(twelfthLord.longitude) : null;
  const ketuNakshatras = [1, 10, 19];
  results.push(makeResult(34, ketuNakshatras.includes(twelfthLordNakshatraNo), {
    twelfthLordKey,
    twelfthLordRasiNo: twelfthLord?.rasiNo ?? null,
    nakshatraNumber: twelfthLordNakshatraNo,
    ketuRuledNakshatraNumbers: ketuNakshatras,
  }));

  // Rule 35 - Dasha of 5th/9th lord with Rahu or Ketu Bhukti.
  const currentDashaKey = dashaLordNameToKey(dasha?.currentDasha);
  const currentBhuktiKey = dashaLordNameToKey(dasha?.currentBhukti);
  const rule35DashaLords = Array.from(new Set([fifthLordKey, ninthLordKey].filter(Boolean)));
  results.push(makeResult(35, rule35DashaLords.includes(currentDashaKey) && ["rahu", "ketu"].includes(currentBhuktiKey), {
    fifthLordKey,
    ninthLordKey,
    qualifyingDashaLordKeys: rule35DashaLords,
    currentDashaKey,
    currentBhuktiKey,
  }));

  // Rule 36 - Sun conjunct Ketu in a water sign: Cancer(4), Scorpio(8), Pisces(12).
  const waterSigns = [4, 8, 12];
  results.push(makeResult(36, sameRasi(sun, ketu) && waterSigns.includes(Number(sun?.rasiNo)), {
    sunRasiNo: sun?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    waterSignRasiNos: waterSigns,
    conjunctionSameRasi: sameRasi(sun, ketu),
  }));

  // Rule 37 - Jupiter + Venus together, placed in a trine from the 2nd or 11th house, without malefic relation.
  // Explicit convention: malefic relation = conjunction/aspect from Saturn, Mars, Rahu, or Ketu.
  const secondHouseRasiNo = lagna ? houseRasiNo(lagna.rasiNo, 2) : null;
  const eleventhHouseRasiNo = lagna ? houseRasiNo(lagna.rasiNo, 11) : null;
  const rule37Conjunction = sameRasi(jupiter, venus);
  const rule37RasiNo = rule37Conjunction ? jupiter.rasiNo : null;
  const rule37TrinalTo2 = rule37RasiNo ? [1, 5, 9].includes(houseNoFromRasi(secondHouseRasiNo, rule37RasiNo)) : false;
  const rule37TrinalTo11 = rule37RasiNo ? [1, 5, 9].includes(houseNoFromRasi(eleventhHouseRasiNo, rule37RasiNo)) : false;
  const rule37MaleficKeys = ["saturn", "mars", "rahu", "ketu"];
  const rule37MaleficRelations = rule37RasiNo ? rule37MaleficKeys.filter((key) => {
    const p = getPlanet(planets, key);
    return (p && Number(p.rasiNo) === Number(rule37RasiNo)) || aspectFromTo(aspects, key, rule37RasiNo);
  }) : [];
  results.push(makeResult(37, rule37Conjunction && (rule37TrinalTo2 || rule37TrinalTo11) && rule37MaleficRelations.length === 0, {
    conjunctionSameRasi: rule37Conjunction,
    jupiterVenusRasiNo: rule37RasiNo,
    secondHouseRasiNo,
    eleventhHouseRasiNo,
    trinalToSecond: rule37TrinalTo2,
    trinalToEleventh: rule37TrinalTo11,
    maleficKeysUsed: rule37MaleficKeys,
    maleficRelations: rule37MaleficRelations,
    interpretation: "Jupiter and Venus conjunct; conjunction sign is 1/5/9 from 2nd or 11th; no Saturn/Mars/Rahu/Ketu conjunction or aspect",
  }));

  // Rule 38 - both Jupiter and Saturn retrograde plus mutual aspect OR trinal relation.
  const rule38MutualAspect = Boolean(jupiter && saturn
    && aspectFromTo(aspects, "jupiter", saturn.rasiNo)
    && aspectFromTo(aspects, "saturn", jupiter.rasiNo));
  const rule38Trinal = Boolean(jupiter && saturn && trinalRasiRelation(jupiter.rasiNo, saturn.rasiNo));
  results.push(makeResult(38, Boolean(jupiter?.retrograde) && Boolean(saturn?.retrograde) && (rule38MutualAspect || rule38Trinal), {
    jupiterRetrograde: Boolean(jupiter?.retrograde),
    saturnRetrograde: Boolean(saturn?.retrograde),
    mutualAspect: rule38MutualAspect,
    trinalRelation: rule38Trinal,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    saturnRasiNo: saturn?.rasiNo ?? null,
  }));

  // Rule 39 - Moon + Mars in 5th house, with Ketu aspect to that house.
  const rule39MoonIn5 = Boolean(moon && Number(moon.rasiNo) === Number(fifthHouseRasi));
  const rule39MarsIn5 = Boolean(mars && Number(mars.rasiNo) === Number(fifthHouseRasi));
  const rule39KetuAspect = fifthHouseRasi ? ketuAspectsRasi(ketu, fifthHouseRasi, aspects) : false;
  results.push(makeResult(39, rule39MoonIn5 && rule39MarsIn5 && rule39KetuAspect, {
    fifthHouseRasiNo: fifthHouseRasi,
    moonInFifth: rule39MoonIn5,
    marsInFifth: rule39MarsIn5,
    ketuAspect: rule39KetuAspect,
  }));

  // Rule 40 - Kala Sarpa pattern where Jupiter alone is outside the Rahu-Ketu enclosure.
  // Uses the same confirmed client enclosure convention as Rule 26.
  const rule40Arcs = kalaSarpaArcEvaluations(planets, rahu, ketu);
  const rule40MatchedArc = rule40Arcs.find((arc) => arc.outsidePlanets.length === 1 && arc.outsidePlanets[0] === "jupiter") || null;
  results.push(makeResult(40, Boolean(rule40MatchedArc), {
    consideredPlanets: CLASSICAL_PLANETS,
    mandiExcluded: true,
    boundaryInclusive: true,
    sameRasiWithNodeCountsInside: true,
    matchedDirection: rule40MatchedArc?.direction ?? null,
    arcEvaluations: rule40Arcs,
  }));


  // Rules 41-50: controlled additive implementation. Rules 1-40 above are frozen.

  // Rule 41 - Mercury + Mars + Rahu together in the 2nd house.
  const secondHouseRasi41 = lagna ? houseRasiNo(lagna.rasiNo, 2) : null;
  const rule41Matched = Boolean(
    mercury && mars && rahu && secondHouseRasi41
    && Number(mercury.rasiNo) === Number(secondHouseRasi41)
    && Number(mars.rasiNo) === Number(secondHouseRasi41)
    && Number(rahu.rasiNo) === Number(secondHouseRasi41)
  );
  results.push(makeResult(41, rule41Matched, {
    secondHouseRasiNo: secondHouseRasi41,
    mercuryRasiNo: mercury?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
  }));

  // Rule 42 - Ketu in the 5th house receiving Mars 4th/7th/8th aspect.
  const fifthHouseRasi42 = lagna ? houseRasiNo(lagna.rasiNo, 5) : null;
  const rule42KetuInFifth = Boolean(ketu && fifthHouseRasi42 && Number(ketu.rasiNo) === Number(fifthHouseRasi42));
  const rule42MarsAspectType = mars && fifthHouseRasi42
    ? houseNoFromRasi(mars.rasiNo, fifthHouseRasi42)
    : null;
  const rule42MarsAspect = Boolean(
    mars && fifthHouseRasi42
    && (
      aspectFromTo(aspects, "mars", fifthHouseRasi42)
      || [4, 7, 8].includes(rule42MarsAspectType)
    )
  );
  results.push(makeResult(42, rule42KetuInFifth && rule42MarsAspect, {
    fifthHouseRasiNo: fifthHouseRasi42,
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuInFifth: rule42KetuInFifth,
    marsRasiNo: mars?.rasiNo ?? null,
    marsAspectHouseFromMars: rule42MarsAspectType,
    marsAspect: rule42MarsAspect,
    allowedMarsAspects: [4, 7, 8],
  }));

  // Rule 43 - Ketu in the 9th house receiving Jupiter aspect (5th/7th/9th).
  const ninthHouseRasi43 = lagna ? houseRasiNo(lagna.rasiNo, 9) : null;
  const rule43KetuInNinth = Boolean(ketu && ninthHouseRasi43 && Number(ketu.rasiNo) === Number(ninthHouseRasi43));
  const rule43JupiterAspectType = jupiter && ninthHouseRasi43
    ? houseNoFromRasi(jupiter.rasiNo, ninthHouseRasi43)
    : null;
  const rule43JupiterAspect = Boolean(
    jupiter && ninthHouseRasi43
    && (
      aspectFromTo(aspects, "jupiter", ninthHouseRasi43)
      || [5, 7, 9].includes(rule43JupiterAspectType)
    )
  );
  results.push(makeResult(43, rule43KetuInNinth && rule43JupiterAspect, {
    ninthHouseRasiNo: ninthHouseRasi43,
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuInNinth: rule43KetuInNinth,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    jupiterAspectHouseFromJupiter: rule43JupiterAspectType,
    jupiterAspect: rule43JupiterAspect,
    allowedJupiterAspects: [5, 7, 9],
  }));

  // Rule 44 - Saturn aspects Lagna's 12th house by its 3rd/7th/10th aspect.
  const twelfthHouseRasi44 = lagna ? houseRasiNo(lagna.rasiNo, 12) : null;
  const rule44SaturnAspectType = saturn && twelfthHouseRasi44
    ? houseNoFromRasi(saturn.rasiNo, twelfthHouseRasi44)
    : null;
  const rule44SaturnAspect = Boolean(
    saturn && twelfthHouseRasi44
    && (
      aspectFromTo(aspects, "saturn", twelfthHouseRasi44)
      || [3, 7, 10].includes(rule44SaturnAspectType)
    )
  );
  results.push(makeResult(44, rule44SaturnAspect, {
    twelfthHouseRasiNo: twelfthHouseRasi44,
    saturnRasiNo: saturn?.rasiNo ?? null,
    saturnAspectHouseFromSaturn: rule44SaturnAspectType,
    saturnAspect: rule44SaturnAspect,
    allowedSaturnAspects: [3, 7, 10],
  }));

  // Rule 45 - Sun+Rahu OR Mars+Rahu together in a fire sign (Aries/Leo/Sagittarius).
  const fireSignRasiNos = [1, 5, 9];
  const rule45SunRahu = Boolean(
    sameRasi(sun, rahu) && fireSignRasiNos.includes(Number(sun?.rasiNo))
  );
  const rule45MarsRahu = Boolean(
    sameRasi(mars, rahu) && fireSignRasiNos.includes(Number(mars?.rasiNo))
  );
  results.push(makeResult(45, rule45SunRahu || rule45MarsRahu, {
    fireSignRasiNos,
    sunRahuConjunctionInFireSign: rule45SunRahu,
    marsRahuConjunctionInFireSign: rule45MarsRahu,
    sunRasiNo: sun?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
  }));

  // Rule 46 - Venus + Rahu together in the 8th or 12th house.
  const venusHouse46 = lagna && venus ? houseNoFromRasi(lagna.rasiNo, venus.rasiNo) : null;
  const rule46Conjunction = sameRasi(venus, rahu);
  results.push(makeResult(46, rule46Conjunction && [8, 12].includes(venusHouse46), {
    venusHouse: venusHouse46,
    venusRasiNo: venus?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    conjunctionSameRasi: rule46Conjunction,
    qualifyingHouses: [8, 12],
  }));

  // Rule 47 - Moon + Saturn together in the 2nd house.
  const secondHouseRasi47 = lagna ? houseRasiNo(lagna.rasiNo, 2) : null;
  const rule47Matched = Boolean(
    moon && saturn && secondHouseRasi47
    && Number(moon.rasiNo) === Number(secondHouseRasi47)
    && Number(saturn.rasiNo) === Number(secondHouseRasi47)
  );
  results.push(makeResult(47, rule47Matched, {
    secondHouseRasiNo: secondHouseRasi47,
    moonRasiNo: moon?.rasiNo ?? null,
    saturnRasiNo: saturn?.rasiNo ?? null,
  }));

  // Rule 48 - Jupiter + Ketu conjunction receiving Saturn aspect.
  const rule48Conjunction = sameRasi(jupiter, ketu);
  const rule48TargetRasi = rule48Conjunction ? Number(jupiter.rasiNo) : null;
  const rule48SaturnAspectType = saturn && rule48TargetRasi
    ? houseNoFromRasi(saturn.rasiNo, rule48TargetRasi)
    : null;
  const rule48SaturnAspect = Boolean(
    saturn && rule48TargetRasi
    && (
      aspectFromTo(aspects, "saturn", rule48TargetRasi)
      || [3, 7, 10].includes(rule48SaturnAspectType)
    )
  );
  results.push(makeResult(48, rule48Conjunction && rule48SaturnAspect, {
    conjunctionSameRasi: rule48Conjunction,
    jupiterRasiNo: jupiter?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    saturnRasiNo: saturn?.rasiNo ?? null,
    saturnAspectHouseFromSaturn: rule48SaturnAspectType,
    saturnAspect: rule48SaturnAspect,
  }));

  // Rule 49 - Mars is in the 4th house and is either debilitated (Cancer) or conjunct Ketu.
  const marsHouse49 = lagna && mars ? houseNoFromRasi(lagna.rasiNo, mars.rasiNo) : null;
  const rule49Debilitated = Boolean(mars && Number(mars.rasiNo) === 4);
  const rule49KetuConjunction = sameRasi(mars, ketu);
  results.push(makeResult(49, marsHouse49 === 4 && (rule49Debilitated || rule49KetuConjunction), {
    marsHouse: marsHouse49,
    marsRasiNo: mars?.rasiNo ?? null,
    debilitatedInCancer: rule49Debilitated,
    ketuRasiNo: ketu?.rasiNo ?? null,
    ketuConjunctionSameRasi: rule49KetuConjunction,
    interpretation: "Mars must occupy the 4th house; within that house it qualifies by debilitation or Ketu conjunction",
  }));

  // Rule 50 - Sun + Mercury + Rahu together in the 6th house.
  const sixthHouseRasi50 = lagna ? houseRasiNo(lagna.rasiNo, 6) : null;
  const rule50Matched = Boolean(
    sun && mercury && rahu && sixthHouseRasi50
    && Number(sun.rasiNo) === Number(sixthHouseRasi50)
    && Number(mercury.rasiNo) === Number(sixthHouseRasi50)
    && Number(rahu.rasiNo) === Number(sixthHouseRasi50)
  );
  results.push(makeResult(50, rule50Matched, {
    sixthHouseRasiNo: sixthHouseRasi50,
    sunRasiNo: sun?.rasiNo ?? null,
    mercuryRasiNo: mercury?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
  }));


  // Rules 51-60: controlled additive implementation. Rules 1-50 above are frozen.

  // Rule 51 - Mars + Venus + Ketu together in the 7th or 8th house.
  const rule51House = lagna && mars ? houseNoFromRasi(lagna.rasiNo, mars.rasiNo) : null;
  const rule51Together = Boolean(mars && venus && ketu && sameRasi(mars, venus) && sameRasi(mars, ketu));
  results.push(makeResult(51, rule51Together && [7, 8].includes(rule51House), {
    house: rule51House,
    marsRasiNo: mars?.rasiNo ?? null,
    venusRasiNo: venus?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    conjunctionSameRasi: rule51Together,
    qualifyingHouses: [7, 8],
  }));

  // Rule 52 - 5th lord in the 6th house and conjunct Rahu.
  const rule52FifthLordKey = lordOfHouse(lagna, 5);
  const rule52FifthLord = getPlanet(planets, rule52FifthLordKey);
  const rule52FifthLordHouse = lagna && rule52FifthLord ? houseNoFromRasi(lagna.rasiNo, rule52FifthLord.rasiNo) : null;
  const rule52RahuConjunction = sameRasi(rule52FifthLord, rahu);
  results.push(makeResult(52, rule52FifthLordHouse === 6 && rule52RahuConjunction, {
    fifthLordKey: rule52FifthLordKey,
    fifthLordHouse: rule52FifthLordHouse,
    fifthLordRasiNo: rule52FifthLord?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    rahuConjunctionSameRasi: rule52RahuConjunction,
  }));

  // Rule 53 - Saturn and Ketu each occupy a trinal house (1/5/9) and each stands alone in its Rasi.
  const rule53SaturnHouse = lagna && saturn ? houseNoFromRasi(lagna.rasiNo, saturn.rasiNo) : null;
  const rule53KetuHouse = lagna && ketu ? houseNoFromRasi(lagna.rasiNo, ketu.rasiNo) : null;
  const rule53SaturnOccupants = saturn ? planetsInRasi(planets, saturn.rasiNo).map((p) => p.key) : [];
  const rule53KetuOccupants = ketu ? planetsInRasi(planets, ketu.rasiNo).map((p) => p.key) : [];
  const rule53SaturnAlone = rule53SaturnOccupants.length === 1 && rule53SaturnOccupants[0] === "saturn";
  const rule53KetuAlone = rule53KetuOccupants.length === 1 && rule53KetuOccupants[0] === "ketu";
  const rule53Matched = [1, 5, 9].includes(rule53SaturnHouse) && [1, 5, 9].includes(rule53KetuHouse)
    && rule53SaturnAlone && rule53KetuAlone;
  results.push(makeResult(53, rule53Matched, {
    saturnHouse: rule53SaturnHouse,
    ketuHouse: rule53KetuHouse,
    saturnAlone: rule53SaturnAlone,
    ketuAlone: rule53KetuAlone,
    saturnOccupants: rule53SaturnOccupants,
    ketuOccupants: rule53KetuOccupants,
    qualifyingHouses: [1, 5, 9],
  }));

  // Rule 54 - Any two distinct lords among 1/5/9 have conjunction, aspect, or exchange relation.
  const rule54Houses = [1, 5, 9];
  const rule54Relations = [];
  for (let i = 0; i < rule54Houses.length; i += 1) {
    for (let j = i + 1; j < rule54Houses.length; j += 1) {
      const houseA = rule54Houses[i];
      const houseB = rule54Houses[j];
      const lordAKey = lordOfHouse(lagna, houseA);
      const lordBKey = lordOfHouse(lagna, houseB);
      if (!lordAKey || !lordBKey || lordAKey === lordBKey) continue;
      const lordA = getPlanet(planets, lordAKey);
      const lordB = getPlanet(planets, lordBKey);
      if (!lordA || !lordB) continue;
      const conjunction = sameRasi(lordA, lordB);
      const aspect = aspectFromTo(aspects, lordAKey, lordB.rasiNo) || aspectFromTo(aspects, lordBKey, lordA.rasiNo);
      const exchange = Boolean(exchangeBetweenHouses(lagna, planets, houseA, houseB));
      if (conjunction || aspect || exchange) {
        rule54Relations.push({ houseA, houseB, lordAKey, lordBKey, conjunction, aspect, exchange });
      }
    }
  }
  results.push(makeResult(54, rule54Relations.length > 0, {
    houses: rule54Houses,
    relations: rule54Relations,
  }));

  // Rule 55 - 8th lord + Moon + Ketu together in the 8th or 12th house.
  const rule55EighthLordKey = lordOfHouse(lagna, 8);
  const rule55EighthLord = getPlanet(planets, rule55EighthLordKey);
  const rule55House = lagna && rule55EighthLord ? houseNoFromRasi(lagna.rasiNo, rule55EighthLord.rasiNo) : null;
  const rule55Together = Boolean(rule55EighthLord && moon && ketu && sameRasi(rule55EighthLord, moon) && sameRasi(rule55EighthLord, ketu));
  results.push(makeResult(55, rule55Together && [8, 12].includes(rule55House), {
    eighthLordKey: rule55EighthLordKey,
    house: rule55House,
    eighthLordRasiNo: rule55EighthLord?.rasiNo ?? null,
    moonRasiNo: moon?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    conjunctionSameRasi: rule55Together,
    qualifyingHouses: [8, 12],
  }));

  // Rule 56 - Saturn + Sun + Rahu together in the 6th or 8th house.
  const rule56House = lagna && saturn ? houseNoFromRasi(lagna.rasiNo, saturn.rasiNo) : null;
  const rule56Together = Boolean(saturn && sun && rahu && sameRasi(saturn, sun) && sameRasi(saturn, rahu));
  results.push(makeResult(56, rule56Together && [6, 8].includes(rule56House), {
    house: rule56House,
    saturnRasiNo: saturn?.rasiNo ?? null,
    sunRasiNo: sun?.rasiNo ?? null,
    rahuRasiNo: rahu?.rasiNo ?? null,
    conjunctionSameRasi: rule56Together,
    qualifyingHouses: [6, 8],
  }));

  // Rule 57 - A planet lies at the exact degree opposite Saturn (180 degrees).
  // "Exact" is implemented mathematically with a tiny floating-point epsilon only; no astrological orb is added.
  const RULE57_EPSILON = 1e-6;
  const rule57Candidates = CLASSICAL_PLANETS
    .filter((key) => key !== "saturn")
    .map((key) => getPlanet(planets, key))
    .filter(Boolean)
    .map((planet) => ({
      planetKey: planet.key,
      angularDistance: saturn ? angularDistance(planet.longitude, saturn.longitude) : null,
    }))
    .filter((item) => Number.isFinite(item.angularDistance) && Math.abs(item.angularDistance - 180) <= RULE57_EPSILON);
  results.push(makeResult(57, rule57Candidates.length > 0, {
    saturnLongitude: saturn?.longitude ?? null,
    exactOppositionDegrees: 180,
    floatingPointEpsilon: RULE57_EPSILON,
    matchedPlanets: rule57Candidates,
  }));

  // Rule 58 - Sun + Mars + Ketu together in the 5th or 9th house.
  const rule58House = lagna && sun ? houseNoFromRasi(lagna.rasiNo, sun.rasiNo) : null;
  const rule58Together = Boolean(sun && mars && ketu && sameRasi(sun, mars) && sameRasi(sun, ketu));
  results.push(makeResult(58, rule58Together && [5, 9].includes(rule58House), {
    house: rule58House,
    sunRasiNo: sun?.rasiNo ?? null,
    marsRasiNo: mars?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    conjunctionSameRasi: rule58Together,
    qualifyingHouses: [5, 9],
  }));

  // Rule 59 - Cross-group exchange: a 9th/10th lord exchanges with a 6th/8th lord.
  const rule59Exchanges = [];
  for (const dharmaKarmaHouse of [9, 10]) {
    for (const dusthanaHouse of [6, 8]) {
      const exchange = exchangeBetweenHouses(lagna, planets, dharmaKarmaHouse, dusthanaHouse);
      if (exchange) rule59Exchanges.push(exchange);
    }
  }
  results.push(makeResult(59, rule59Exchanges.length > 0, {
    dharmaKarmaHouses: [9, 10],
    dusthanaHouses: [6, 8],
    exchanges: rule59Exchanges,
  }));

  // Rule 60 - Mars + Mercury + Ketu together in Lagna (1st) or the 8th house.
  const rule60House = lagna && mars ? houseNoFromRasi(lagna.rasiNo, mars.rasiNo) : null;
  const rule60Together = Boolean(mars && mercury && ketu && sameRasi(mars, mercury) && sameRasi(mars, ketu));
  results.push(makeResult(60, rule60Together && [1, 8].includes(rule60House), {
    house: rule60House,
    marsRasiNo: mars?.rasiNo ?? null,
    mercuryRasiNo: mercury?.rasiNo ?? null,
    ketuRasiNo: ketu?.rasiNo ?? null,
    conjunctionSameRasi: rule60Together,
    qualifyingHouses: [1, 8],
  }));


  const matchedRules = results.filter((rule) => rule.matched);

  return {
    source: "Agathiyar Poorva Punniya Nadi / Karma Kandam - client supplied rules",
    totalPlannedRules: 60,
    implementedThroughRule: 60,
    evaluatedRuleCount: 60,
    pendingRuleCount: 0,
    matchedRuleCount: matchedRules.length,
    matchedRules,
    ruleResults: results,
  };
}

/**
 * SARA WORK END - NADI RULE ENGINE
 */

module.exports = {
  buildNadiRuleAnalysis,
  // Exported for UAT only. Existing API usage remains buildNadiRuleAnalysis.
  _testHelpers: {
    shashtiamshaOfPlanet,
  },
};
