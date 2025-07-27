import { useState, useRef, useEffect, useCallback } from 'react';
import './DiseaseDetection.css';

const DiseaseDetection = ({ onBackToHome }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const fileInputRef = useRef(null);

  // Indian languages list with English and Hindi at the top
  const indianLanguages = [
    { code: 'english', name: 'English', nativeName: 'English' },
    { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'urdu', name: 'Urdu', nativeName: 'اردو' },
    { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'sanskrit', name: 'Sanskrit', nativeName: 'संस्कृत' },
    { code: 'nepali', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'sindhi', name: 'Sindhi', nativeName: 'سنڌی' },
    { code: 'konkani', name: 'Konkani', nativeName: 'कोंकणी' },
    { code: 'manipuri', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
    { code: 'bodo', name: 'Bodo', nativeName: 'बर\'' },
    { code: 'dogri', name: 'Dogri', nativeName: 'डोगरी' },
    { code: 'kashmiri', name: 'Kashmiri', nativeName: 'کٲشُر' },
    { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱞᱤ' },
    { code: 'maithili', name: 'Maithili', nativeName: 'मैथिली' }
  ];

  // Function to get language instruction for Gemini API
  const getLanguageInstruction = (languageCode) => {
    const languageMap = {
      'english': 'English',
      'hindi': 'Hindi (हिंदी)',
      'bengali': 'Bengali (বাংলা)',
      'telugu': 'Telugu (తెలుగు)',
      'marathi': 'Marathi (मराठी)',
      'tamil': 'Tamil (தமিழ்)',
      'gujarati': 'Gujarati (ગુજરાતી)',
      'urdu': 'Urdu (اردو)',
      'kannada': 'Kannada (ಕನ್ನಡ)',
      'odia': 'Odia (ଓଡ଼ିଆ)',
      'punjabi': 'Punjabi (ਪੰਜਾਬੀ)',
      'malayalam': 'Malayalam (മലയാളം)',
      'assamese': 'Assamese (অসমীয়া)',
      'sanskrit': 'Sanskrit (संस्कृत)',
      'nepali': 'Nepali (नेपाली)',
      'sindhi': 'Sindhi (سنڌی)',
      'konkani': 'Konkani (कोंकणी)',
      'manipuri': 'Manipuri (মৈতৈলোন্)',
      'bodo': 'Bodo (बर\')',
      'dogri': 'Dogri (डोगरी)',
      'kashmiri': 'Kashmiri (کٲشُر)',
      'santali': 'Santali (ᱥᱟᱱᱛᱟᱞᱤ)',
      'maithili': 'Maithili (मैथिली)'
    };

    return languageMap[languageCode] || 'English';
  };

  // Function to get localized headings
  const getLocalizedHeadings = (languageCode) => {
  const headings = {
    'english': {
      title: '🌱 Plant Disease Detection',
      subtitle: 'Upload a clear photo of your plant to detect diseases and get expert treatment recommendations',
      analysisResults: '🔍 Analysis Results',
      diseaseIdentification: '🦠 Disease Identification',
      symptomsObserved: '🔍 Symptoms Observed',
      treatmentRecommendations: '💊 Treatment Recommendations',
      preventionTips: '🛡️ Prevention Tips',
      additionalInformation: 'ℹ️ Additional Information',
      confidenceLevel: 'Confidence Level:',
      connectWithExpert: '🎙️ Connect with Expert',
      analyzeAnotherPlant: '📸 Analyze Another Plant'
    },
    'hindi': {
      title: '🌱 पौधों की बीमारी की पहचान',
      subtitle: 'बीमारियों की पहचान और विशेषज्ञ उपचार सुझावों के लिए अपने पौधे की स्पष्ट तस्वीर अपलोड करें',
      analysisResults: '🔍 विश्लेषण परिणाम',
      diseaseIdentification: '🦠 रोग की पहचान',
      symptomsObserved: '🔍 देखे गए लक्षण',
      treatmentRecommendations: '💊 उपचार सुझाव',
      preventionTips: '🛡️ बचाव के तरीके',
      additionalInformation: 'ℹ️ अतिरिक्त जानकारी',
      confidenceLevel: 'विश्वास स्तर:',
      connectWithExpert: '🎙️ विशेषज्ञ से जुड़ें',
      analyzeAnotherPlant: '📸 दूसरे पौधे का विश्लेषण करें'
    },
    'bengali': {
      title: '🌱 উদ্ভিদ রোগ নির্ণয়',
      subtitle: 'রোগ শনাক্তকরণ এবং বিশেষজ্ঞ চিকিৎসার পরামর্শের জন্য আপনার গাছের একটি স্পষ্ট ছবি আপলোড করুন',
      analysisResults: '🔍 বিশ্লেষণের ফলাফল',
      diseaseIdentification: '🦠 রোগ শনাক্তকরণ',
      symptomsObserved: '🔍 পর্যবেক্ষিত লক্ষণ',
      treatmentRecommendations: '💊 চিকিৎসার সুপারিশ',
      preventionTips: '🛡️ প্রতিরোধের উপায়',
      additionalInformation: 'ℹ️ অতিরিক্ত তথ্য',
      confidenceLevel: 'আস্থার মাত্রা:',
      connectWithExpert: '🎙️ বিশেষজ্ঞের সাথে যোগাযোগ',
      analyzeAnotherPlant: '📸 অন্য গাছ বিশ্লেষণ করুন'
    },
    'telugu': {
      title: '🌱 మొక్కల వ్యాధి గుర్తింపు',
      subtitle: 'వ్యాధులను గుర్తించడానికి మరియు నిపుణుల చికిత్సా సలహాలను పొందడానికి మీ మొక్క యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి',
      analysisResults: '🔍 విశ్లేషణ ఫలితాలు',
      diseaseIdentification: '🦠 వ్యాధి గుర్తింపు',
      symptomsObserved: '🔍 గమనించిన లక్షణాలు',
      treatmentRecommendations: '💊 చికిత్సా సిఫార్సులు',
      preventionTips: '🛡️ నివారణ చిట్కాలు',
      additionalInformation: 'ℹ️ అదనపు సమాచారం',
      confidenceLevel: 'విశ్వాస స్థాయి:',
      connectWithExpert: '🎙️ నిపుణుడితో కనెక్ట్ అవ్వండి',
      analyzeAnotherPlant: '📸 మరో మొక్కను విశ్లేషించండి'
    },
    'marathi': {
      title: '🌱 वनस्पती रोग ओळख',
      subtitle: 'रोगांची ओळख आणि तज्ञ उपचार शिफारसींसाठी आपल्या वनस्पतीचा स्पष्ट फोटो अपलोड करा',
      analysisResults: '🔍 विश्लेषण परिणाम',
      diseaseIdentification: '🦠 रोग ओळख',
      symptomsObserved: '🔍 पाहिलेली लक्षणे',
      treatmentRecommendations: '💊 उपचार शिफारसी',
      preventionTips: '🛡️ बचावाचे उपाय',
      additionalInformation: 'ℹ️ अतिरिक्त माहिती',
      confidenceLevel: 'विश्वास पातळी:',
      connectWithExpert: '🎙️ तज्ञाशी संपर्क साधा',
      analyzeAnotherPlant: '📸 दुसर्‍या वनस्पतीचे विश्लेषण करा'
    },
    'tamil': {
      title: '🌱 தாவர நோய் கண்டறிதல்',
      subtitle: 'நோய்களைக் கண்டறிந்து நிபுணர் சிகிச்சை பரிந்துரைகளைப் பெற உங்கள் தாவரத்தின் தெளிவான புகைப்படத்தை பதிவேற்றவும்',
      analysisResults: '🔍 பகுப்பாய்வு முடிவுகள்',
      diseaseIdentification: '🦠 நோய் கண்டறிதல்',
      symptomsObserved: '🔍 காணப்பட்ட அறிகுறிகள்',
      treatmentRecommendations: '💊 சிகிச்சை பரிந்துரைகள்',
      preventionTips: '🛡️ தடுப்பு குறிப்புகள்',
      additionalInformation: 'ℹ️ கூடுதல் தகவல்',
      confidenceLevel: 'நம்பிக்கை நிலை:',
      connectWithExpert: '🎙️ நிபுணருடன் இணைக',
      analyzeAnotherPlant: '📸 மற்றொரு தாவரத்தை பகுப்பாய்வு செய்க'
    },
    'gujarati': {
      title: '🌱 છોડના રોગની ઓળખ',
      subtitle: 'રોગોની ઓળખ અને નિષ્ણાત સારવારની ભલામણો માટે તમારા છોડનો સ્પષ્ટ ફોટો અપલોડ કરો',
      analysisResults: '🔍 વિશ્લેષણ પરિણામો',
      diseaseIdentification: '🦠 રોગની ઓળખ',
      symptomsObserved: '🔍 જોવા મળેલા લક્ષણો',
      treatmentRecommendations: '💊 સારવારની ભલામણો',
      preventionTips: '🛡️ બચાવના ઉપાયો',
      additionalInformation: 'ℹ️ વધારાની માહિતી',
      confidenceLevel: 'વિશ્વાસ સ્તર:',
      connectWithExpert: '🎙️ નિષ્ણાત સાથે જોડાઓ',
      analyzeAnotherPlant: '📸 બીજા છોડનું વિશ્લેષણ કરો'
    },
    'urdu': {
      title: '🌱 پودوں کی بیماری کی تشخیص',
      subtitle: 'بیماریوں کی تشخیص اور ماہر علاج کی تجاویز کے لیے اپنے پودے کی واضح تصویر اپ لوڈ کریں',
      analysisResults: '🔍 تجزیہ کے نتائج',
      diseaseIdentification: '🦠 بیماری کی شناخت',
      symptomsObserved: '🔍 دیکھے گئے علامات',
      treatmentRecommendations: '💊 علاج کی تجاویز',
      preventionTips: '🛡️ بچاؤ کے طریقے',
      additionalInformation: 'ℹ️ اضافی معلومات',
      confidenceLevel: 'اعتماد کی سطح:',
      connectWithExpert: '🎙️ ماہر سے رابطہ کریں',
      analyzeAnotherPlant: '📸 دوسرے پودے کا تجزیہ کریں'
    },
    'kannada': {
      title: '🌱 ಸಸ್ಯ ರೋಗ ಪತ್ತೆ',
      subtitle: 'ರೋಗಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಮತ್ತು ತಜ್ಞರ ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಸಸ್ಯದ ಸ್ಪಷ್ಟ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      analysisResults: '🔍 ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು',
      diseaseIdentification: '🦠 ರೋಗ ಪತ್ತೆ',
      symptomsObserved: '🔍 ಗಮನಿಸಿದ ಲಕ್ಷಣಗಳು',
      treatmentRecommendations: '💊 ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸುಗಳು',
      preventionTips: '🛡️ ತಡೆಗಟ್ಟುವ ಮಾರ್ಗಗಳು',
      additionalInformation: 'ℹ️ ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ',
      confidenceLevel: 'ವಿಶ್ವಾಸ ಮಟ್ಟ:',
      connectWithExpert: '🎙️ ತಜ್ಞರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
      analyzeAnotherPlant: '📸 ಮತ್ತೊಂದು ಸಸ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಿ'
    },
    'odia': {
      title: '🌱 ଉଦ୍ଭିଦ ରୋଗ ଚିହ୍ନଟ',
      subtitle: 'ରୋଗ ଚିହ୍ନଟ ଏବଂ ବିଶେଷଜ୍ଞ ଚିକିତ୍ସା ପରାମର୍ଶ ପାଇଁ ଆପଣଙ୍କ ଉଦ୍ଭିଦର ଏକ ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
      analysisResults: '🔍 ବିଶ୍ଳେଷଣ ଫଳାଫଳ',
      diseaseIdentification: '🦠 ରୋଗ ଚିହ୍ନଟ',
      symptomsObserved: '🔍 ଦେଖାଯାଇଥିବା ଲକ୍ଷଣ',
      treatmentRecommendations: '💊 ଚିକିତ୍ସା ପରାମର୍ଶ',
      preventionTips: '🛡️ ପ୍ରତିରୋଧ ଉପାୟ',
      additionalInformation: 'ℹ️ ଅତିରିକ୍ତ ସୂଚନା',
      confidenceLevel: 'ବିଶ୍ୱାସ ସ୍ତର:',
      connectWithExpert: '🎙️ ବିଶେଷଜ୍ଞଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ',
      analyzeAnotherPlant: '📸 ଅନ୍ୟ ଉଦ୍ଭିଦ ବିଶ୍ଳେଷଣ କରନ୍ତୁ'
    },
    'punjabi': {
      title: '🌱 ਪੌਧਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
      subtitle: 'ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ ਅਤੇ ਮਾਹਿਰ ਇਲਾਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ ਲਈ ਆਪਣੇ ਪੌਧੇ ਦੀ ਸਪਸ਼ਟ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
      analysisResults: '🔍 ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ',
      diseaseIdentification: '🦠 ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
      symptomsObserved: '🔍 ਦੇਖੇ ਗਏ ਲੱਛਣ',
      treatmentRecommendations: '💊 ਇਲਾਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ',
      preventionTips: '🛡️ ਬਚਾਅ ਦੇ ਤਰੀਕੇ',
      additionalInformation: 'ℹ️ ਵਾਧੂ ਜਾਣਕਾਰੀ',
      confidenceLevel: 'ਭਰੋਸੇ ਦਾ ਪੱਧਰ:',
      connectWithExpert: '🎙️ ਮਾਹਿਰ ਨਾਲ ਜੁੜੋ',
      analyzeAnotherPlant: '📸 ਕਿਸੇ ਹੋਰ ਪੌਧੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ'
    },
    'malayalam': {
      title: '🌱 സസ്യ രോഗ കണ്ടെത്തൽ',
      subtitle: 'രോഗങ്ങൾ കണ്ടെത്താനും വിദഗ്ധ ചികിത്സാ ശുപാർശകൾ ലഭിക്കാനും നിങ്ങളുടെ ചെടിയുടെ വ്യക്തമായ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
      analysisResults: '🔍 വിശകലന ഫലങ്ങൾ',
      diseaseIdentification: '🦠 രോഗ കണ്ടെത്തൽ',
      symptomsObserved: '🔍 നിരീക്ഷിച്ച ലക്ഷണങ്ങൾ',
      treatmentRecommendations: '💊 ചികിത്സാ ശുപാർശകൾ',
      preventionTips: '🛡️ പ്രതിരോധ നുറുങ്ങുകൾ',
      additionalInformation: 'ℹ️ അധിക വിവരങ്ങൾ',
      confidenceLevel: 'വിശ്വാസ നില:',
      connectWithExpert: '🎙️ വിദഗ്ധനുമായി ബന്ധപ്പെടുക',
      analyzeAnotherPlant: '📸 മറ്റൊരു ചെടി വിശകലനം ചെയ്യുക'
    },
    'assamese': {
      title: '🌱 উদ্ভিদৰ ৰোগ চিনাক্তকৰণ',
      subtitle: 'ৰোগ চিনাক্তকৰণ আৰু বিশেষজ্ঞ চিকিৎসাৰ পৰামৰ্শৰ বাবে আপোনাৰ উদ্ভিদৰ এখন স্পষ্ট ফটো আপলড কৰক',
      analysisResults: '🔍 বিশ্লেষণৰ ফলাফল',
      diseaseIdentification: '🦠 ৰোগ চিনাক্তকৰণ',
      symptomsObserved: '🔍 পৰ্যবেক্ষিত লক্ষণ',
      treatmentRecommendations: '💊 চিকিৎসাৰ পৰামৰ্শ',
      preventionTips: '🛡️ প্ৰতিৰোধৰ উপায়',
      additionalInformation: 'ℹ️ অতিৰিক্ত তথ্য',
      confidenceLevel: 'বিশ্বাসৰ স্তৰ:',
      connectWithExpert: '🎙️ বিশেষজ্ঞৰ সৈতে যোগাযোগ কৰক',
      analyzeAnotherPlant: '📸 আন উদ্ভিদ বিশ্লেষণ কৰক'
    },
    'sanskrit': {
      title: '🌱 वनस्पति रोग निदान',
      subtitle: 'रोग निदान एवं विशेषज्ञ चिकित्सा सुझावार्थं स्वस्य वनस्पतेः स्पष्ट चित्रं अपलोड करोतु',
      analysisResults: '🔍 विश्लेषण फलानि',
      diseaseIdentification: '🦠 रोग निदान',
      symptomsObserved: '🔍 दृष्ट लक्षणानि',
      treatmentRecommendations: '💊 चिकित्सा सुझावः',
      preventionTips: '🛡️ निवारण उपायाः',
      additionalInformation: 'ℹ️ अतिरिक्त सूचना',
      confidenceLevel: 'विश्वास स्तरः:',
      connectWithExpert: '🎙️ विशेषज्ञेन सह संपर्कं करोतु',
      analyzeAnotherPlant: '📸 अन्य वनस्पति विश्लेषणं करोतु'
    },
    'nepali': {
      title: '🌱 बिरुवाको रोग पहिचान',
      subtitle: 'रोगहरूको पहिचान र विशेषज्ञ उपचार सुझावहरूका लागि आफ्नो बिरुवाको स्पष्ट फोटो अपलोड गर्नुहोस्',
      analysisResults: '🔍 विश्लेषण परिणामहरू',
      diseaseIdentification: '🦠 रोग पहिचान',
      symptomsObserved: '🔍 देखिएका लक्षणहरू',
      treatmentRecommendations: '💊 उपचार सुझावहरू',
      preventionTips: '🛡️ रोकथाम उपायहरू',
      additionalInformation: 'ℹ️ थप जानकारी',
      confidenceLevel: 'विश्वास स्तर:',
      connectWithExpert: '🎙️ विशेषज्ञसँग जडान गर्नुहोस्',
      analyzeAnotherPlant: '📸 अर्को बिरुवाको विश्लेषण गर्नुहोस्'
    },
    'sindhi': {
      title: '🌱 ٻوٽن جي بيماري جي سڃاڻپ',
      subtitle: 'بيمارين جي سڃاڻپ ۽ ماهر علاج جي تجويزن لاءِ پنهنجي ٻوٽي جي صاف تصوير اپ لوڊ ڪريو',
      analysisResults: '🔍 تجزيي جا نتيجا',
      diseaseIdentification: '🦠 بيماري جي سڃاڻپ',
      symptomsObserved: '🔍 ڏٺل علامتون',
      treatmentRecommendations: '💊 علاج جون تجويزون',
      preventionTips: '🛡️ بچاءُ جا طريقا',
      additionalInformation: 'ℹ️ اضافي معلومات',
      confidenceLevel: 'اعتماد جي سطح:',
      connectWithExpert: '🎙️ ماهر سان رابطو ڪريو',
      analyzeAnotherPlant: '📸 ٻئي ٻوٽي جو تجزيو ڪريو'
    },
    'konkani': {
      title: '🌱 रुखाचो रोग वळख',
      subtitle: 'रोगांची वळख आनी तज्ञ उपचार शिफारशींखातीर आपल्या रुखाचो स्पष्ट फोटो अपलोड करात',
      analysisResults: '🔍 विश्लेषण परिणाम',
      diseaseIdentification: '🦠 रोग वळख',
      symptomsObserved: '🔍 दिसल्यां लक्षणां',
      treatmentRecommendations: '💊 उपचार शिफारशी',
      preventionTips: '🛡️ बचावाचे उपाय',
      additionalInformation: 'ℹ️ अतिरिक्त माहिती',
      confidenceLevel: 'विश्वास पातळी:',
      connectWithExpert: '🎙️ तज्ञाशीं जुडात',
      analyzeAnotherPlant: '📸 दुसऱ्या रुखाचें विश्लेषण करात'
    },
    'manipuri': {
      title: '🌱 লাইরিক অনাবদা খংদোকপা',
      subtitle: 'অনাবসিং খংদোকপা অমসুং এক্সপার্ত হায়দোক-হায়রবা ফোংদোকপগিদমক নহাক্কি লাইরিক্কি চাংদমবা ফোতো অপ্লোড তৌরো',
      analysisResults: '🔍 শরুক য়ায়বা মপুং ফাবসিং',
      diseaseIdentification: '🦠 অনাবা খংদোকপা',
      symptomsObserved: '🔍 উবা ফংবা খুদোলসিং',
      treatmentRecommendations: '💊 নুংশিজরবা ফোংদোকপসিং',
      preventionTips: '🛡️ অরানবা লম্বিসিং',
      additionalInformation: 'ℹ️ অতোপ্পা ইনফরমেশন',
      confidenceLevel: 'থাজবা লেভেল:',
      connectWithExpert: '🎙️ এক্সপার্তগা মরি শম্নরো',
      analyzeAnotherPlant: '📸 অতোপ্পা লাইরিক শরুক য়াবা'
    },
    'bodo': {
      title: '🌱 दावदाव गोसो मोनख',
      subtitle: 'गोसोयाव मोनख आरो मावदाव हायदावयाव सलावआव नावगोन दावदावनि साफ फोटो अपलोड खालाम',
      analysisResults: '🔍 बिसलेफ्राइनाव फिसाब',
      diseaseIdentification: '🦠 गोसो मोनख',
      symptomsObserved: '🔍 नायनो फिसाव',
      treatmentRecommendations: '💊 हायदावयाव सलावआव',
      preventionTips: '🛡️ बेयावनाव लामआव',
      additionalInformation: 'ℹ️ गुवान सानसो',
      confidenceLevel: 'बिसोरनाव लेवेल:',
      connectWithExpert: '🎙️ मावदावगा मिलाव खालाम',
      analyzeAnotherPlant: '📸 गुवारि दावदावनि बिसलेफ्राइनाव'
    },
    'dogri': {
      title: '🌱 बूटयां दा रोग पिछाण',
      subtitle: 'रोगां दी पिछाण ते माहिर इलाजा दियां सिफारिशां लेई अप्पणे बूटे दी साफ फोटो अपलोड करो',
      analysisResults: '🔍 विश्लेषण नतीजे',
      diseaseIdentification: '🦠 रोग दी पिछाण',
      symptomsObserved: '🔍 दिक्खे गे लक्षण',
      treatmentRecommendations: '💊 इलाजा दियां सिफारिशां',
      preventionTips: '🛡️ बचावा दे तरीके',
      additionalInformation: 'ℹ️ होर जानकारी',
      confidenceLevel: 'भरोसे दा स्तर:',
      connectWithExpert: '🎙️ माहिरा कन्ने जुड़ो',
      analyzeAnotherPlant: '📸 कोई होर बूटे दा विश्लेषण करो'
    },
    'kashmiri': {
      title: '🌱 بوٹین ہند روگ پتا کرُن',
      subtitle: 'روگن ہنز پتا کرنس تی ماہرن ہنز علاج ہند تجویزن خاطرہ پنن بوٹ ہند صاف تصویر اپ لوڈ کرِو',
      analysisResults: '🔍 تجزیات ہند نتیجہ',
      diseaseIdentification: '🦠 روگ ہند پتا',
      symptomsObserved: '🔍 وچھنہ آمت علامات',
      treatmentRecommendations: '💊 علاج ہند تجویزات',
      preventionTips: '🛡️ بچاون ہند طریقہ',
      additionalInformation: 'ℹ️ اضافی معلومات',
      confidenceLevel: 'اعتماد ہند درجہ:',
      connectWithExpert: '🎙️ ماہر سان رابطہ کرِو',
      analyzeAnotherPlant: '📸 بی بوٹ ہند تجزیہ کرِو'
    },
    'santali': {
      title: '🌱 ᱫᱟᱨᱮ ᱨᱚᱜᱚ ᱪᱤᱱᱦᱟᱹ',
      subtitle: 'ᱨᱚᱜᱚ ᱪᱤᱱᱦᱟᱹ ᱟᱨ ᱮᱠᱥᱯᱟᱨᱴ ᱤᱞᱟᱹᱡᱽ ᱨᱮᱭᱟᱜ ᱥᱟᱞᱟᱦᱟ ᱞᱟᱹᱜᱤᱫ ᱛᱮ ᱟᱢᱟᱜ ᱫᱟᱨᱮ ᱨᱮᱭᱟᱜ ᱥᱟᱯᱷᱟ ᱯᱷᱚᱴᱚ ᱟᱯᱞᱚᱰ ᱢᱮ',
      analysisResults: '🔍 ᱵᱤᱥᱞᱮᱥᱚᱱ ᱨᱤᱡᱟᱞᱴ',
      diseaseIdentification: '🦠 ᱨᱚᱜᱚ ᱪᱤᱱᱦᱟᱹ',
      symptomsObserved: '🔍 ᱧᱮᱞ ᱞᱮᱱ ᱞᱚᱠᱷᱚᱱ',
      treatmentRecommendations: '💊 ᱤᱞᱟᱹᱡᱽ ᱨᱮᱭᱟᱜ ᱥᱟᱞᱟᱦᱟ',
      preventionTips: '🛡️ ᱚᱨᱚᱧᱚᱜ ᱨᱮᱭᱟᱜ ᱦᱚᱨ',
      additionalInformation: 'ℹ️ ᱵᱟᱹᱲᱛᱤ ᱠᱷᱚᱵᱚᱨ',
      confidenceLevel: 'ᱵᱷᱚᱨᱚᱥᱟ ᱛᱷᱚᱠ:',
      connectWithExpert: '🎙️ ᱮᱠᱥᱯᱟᱨᱴ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱢᱮ',
      analyzeAnotherPlant: '📸 ᱮᱴᱟᱜ ᱫᱟᱨᱮ ᱨᱮᱭᱟᱜ ᱵᱤᱥᱞᱮᱥᱚᱱ ᱢᱮ'
    },
    'maithili': {
      title: '🌱 गाछ-बिरिख रोग पहिचान',
      subtitle: 'रोगक पहिचान आ विशेषज्ञ इलाजक सुझावक लेल अपन गाछक स्पष्ट फोटो अपलोड करू',
      analysisResults: '🔍 विश्लेषण परिणाम',
      diseaseIdentification: '🦠 रोग पहिचान',
      symptomsObserved: '🔍 देखल गेल लक्षण',
      treatmentRecommendations: '💊 इलाजक सुझाव',
      preventionTips: '🛡️ बचावक उपाय',
      additionalInformation: 'ℹ️ अतिरिक्त जानकारी',
      confidenceLevel: 'विश्वासक स्तर:',
      connectWithExpert: '🎙️ विशेषज्ञ सं जुड़ू',
      analyzeAnotherPlant: '📸 आन गाछक विश्लेषण करू'
    }
  };

  return headings[languageCode] || headings['english'];
};


  // Function to process text formatting from Gemini API response
  const processText = (text) => {
    if (!text || typeof text !== 'string') return text || '';

    // Clean up any remaining formatting artifacts but keep markdown for processing
    let processedText = text.replace(/#{1,6}\s*/g, ''); // Remove markdown headers
    processedText = processedText.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Remove code formatting

    // Clean up extra whitespace and line breaks
    processedText = processedText.replace(/\n\s*\n/g, '\n'); // Remove multiple line breaks
    processedText = processedText.trim();

    return processedText;
  };

  // Function to render text with bold formatting
  const renderTextWithFormatting = (text) => {
    if (!text || typeof text !== 'string') return text || 'No information available';

    // Split text by **bold** patterns and render accordingly
    const parts = [];
    let currentIndex = 0;

    // Find all **text** patterns
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    let match;

    // Process bold text first
    const textWithBold = text.replace(boldPattern, (match, boldText) => {
      return `<strong>${boldText}</strong>`;
    });

    // Process italic text
    const textWithItalic = textWithBold.replace(italicPattern, (match, italicText) => {
      // Don't process if it's already inside strong tags
      if (match.includes('<strong>') || match.includes('</strong>')) {
        return match;
      }
      return `<em>${italicText}</em>`;
    });

    return textWithItalic;
  };

  // Enhanced text renderer component that handles formatting
  const FormattedText = ({ text, className = "" }) => {
    if (!text || typeof text !== 'string') {
      return <div className={className}>No information available</div>;
    }

    const processedText = processText(text);
    const lines = processedText.split('\n').filter(line => line.trim());

    return (
      <div className={className}>
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;

          const htmlContent = renderTextWithFormatting(trimmedLine);

          // Check if line looks like a bullet point or list item
          if (trimmedLine.match(/^[-•*]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
            return (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  paddingLeft: '16px',
                  textIndent: '-16px'
                }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );
          }

          return (
            <p
              key={index}
              style={{ marginBottom: '8px' }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          );
        })}
      </div>
    );
  };

  // Particles background functions (same as before)
  const createParticle = useCallback((container) => {
    const particle = document.createElement('div');
    particle.className = 'particle';

    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 150 + 75;

    const directionX = Math.cos(angle) * distance;
    const directionY = Math.sin(angle) * distance;

    const duration = Math.random() * 8 + 10;

    particle.style.animationDuration = duration + 's';
    particle.style.setProperty('--directionX', directionX + 'px');
    particle.style.setProperty('--directionY', directionY + 'px');

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, duration * 1000);
  }, []);

  const initializeParticles = useCallback(() => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const interval = setInterval(() => {
      const container = document.getElementById('particles');
      if (container) {
        const particleCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < particleCount; i++) {
          setTimeout(() => createParticle(container), i * 100);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [createParticle]);

  useEffect(() => {
    const cleanup = initializeParticles();
    return cleanup;
  }, [initializeParticles]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }

      setSelectedImage(file);
      setError(null);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Clear previous results when language changes
    setResult(null);
    setError(null);
  };

  const analyzeImageWithGemini = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Get Google API key from environment
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

      if (!apiKey) {
        throw new Error('Google API key not configured. Please add VITE_GOOGLE_API_KEY to your .env file');
      }

      // Convert image to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
          resolve(base64);
        };
        reader.readAsDataURL(selectedImage);
      });

      // Get language instruction
      const selectedLanguageName = getLanguageInstruction(selectedLanguage);

      // Prepare the request to Gemini API with language-specific instruction
      const requestBody = {
        contents: [{
          parts: [
            {
              text: `You are an expert agricultural pathologist and plant disease specialist with extensive knowledge of Indian crops and farming conditions. Analyze this plant image thoroughly and provide a comprehensive disease diagnosis.

Please analyze the uploaded plant image and provide the following information in JSON format:

{
  "disease": "Specific disease name",
  "confidence": "High/Medium/Low with percentage if possible",
  "symptoms": "Detailed list of visible symptoms observed",
  "treatment": "Comprehensive treatment recommendations including immediate actions, fungicides/treatments with concentrations, organic options, application methods",
  "prevention": "Prevention measures including cultural practices, crop rotation, sanitation, environmental management",
  "additional_info": "Recovery timeline, disease spread info, when to seek professional help, regional considerations for Indian farming"
}

IMPORTANT GUIDELINES:
- If the image is unclear or doesn't show a plant, clearly state this
- If no disease is visible, mention the plant appears healthy
- Be specific about treatment concentrations and safety precautions
- Consider regional factors and common diseases in India
- Use simple language that farmers can easily understand
- Provide practical, actionable advice suitable for Indian farming conditions
- You can use **bold** formatting for important terms and concepts
- Use *italic* formatting for emphasis where appropriate
- IMPORTANT: Provide your entire response in ${selectedLanguageName} language. All field values in the JSON should be in ${selectedLanguageName}.

Please provide your analysis in the exact JSON format specified above, with all content in ${selectedLanguageName}.`
            },
            {
              inline_data: {
                mime_type: selectedImage.type,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
        }
      };

      // Retry logic for API overload (503 errors)
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          });

          if (response.status === 503) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Wait with exponential backoff before retrying
              const waitTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
          break;
        } catch (fetchError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw fetchError;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error('The Gemini API is currently overloaded. Please try again in a few minutes.');
        }
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      // Extract the text response
      let analysisText = '';
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        analysisText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No analysis generated from the API');
      }

      // Process the analysis text (but don't strip formatting)
      analysisText = processText(analysisText);

      // Try to parse JSON response first
      let parsedResult;
      try {
        // Clean the response text to extract JSON
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);

          // Process all text fields in the parsed result (keep formatting)
          Object.keys(parsedResult).forEach(key => {
            if (typeof parsedResult[key] === 'string') {
              parsedResult[key] = processText(parsedResult[key]);
            }
          });
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (jsonError) {
        // If JSON parsing fails, parse the text response manually
        parsedResult = parseTextResponse(analysisText);
      }

      setResult(parsedResult);

    } catch (err) {
      console.error('Analysis error:', err);
      if (err.message.includes('overloaded') || err.message.includes('503')) {
        setError('The AI service is currently busy. Please try again in a few minutes.');
      } else {
        setError(`Analysis failed: ${err.message}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Fallback function to parse text response if JSON parsing fails
  const parseTextResponse = (text) => {
    const processedText = processText(text);

    const result = {
      disease: "Analysis completed",
      confidence: "Available",
      symptoms: "Check the detailed analysis below",
      treatment: "Recommendations provided",
      prevention: "Prevention tips included",
      additional_info: processedText
    };

    // Try to extract specific sections from text
    const sections = {
      disease: /(?:disease|condition|problem):\s*([^\n]+)/i,
      confidence: /(?:confidence|certainty):\s*([^\n]+)/i,
      symptoms: /(?:symptoms|visible symptoms):([\s\S]*?)(?=treatment|prevention|additional|$)/i,
      treatment: /(?:treatment|recommendations):([\s\S]*?)(?=prevention|additional|$)/i,
      prevention: /(?:prevention|preventive):([\s\S]*?)(?=additional|$)/i,
      additional_info: /(?:additional|other|note):([\s\S]*?)$/i
    };

    Object.keys(sections).forEach(key => {
      const match = processedText.match(sections[key]);
      if (match && match[1]) {
        result[key] = processText(match[1].trim());
      }
    });

    return result;
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const fakeEvent = { target: { files: [file] } };
      handleImageSelect(fakeEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Get current language headings
  const headings = getLocalizedHeadings(selectedLanguage);

  return (
    <div className="disease-detection-container">
      <div className="particles-container" id="particles"></div>

      <div className="detection-content">
        <div className="detection-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '60px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              <div>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="back-button"
                  style={{
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpath d='M7 10l5 5 5-5'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    paddingRight: '40px',
                    minWidth: '180px',
                    cursor: 'pointer',
                    marginLeft: '86%'
                  }}
                >
                  {indianLanguages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="back-button" onClick={onBackToHome}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7" />
                  <path d="m19 12H5" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>

          <h1>{headings.title}</h1>
          <p>{headings.subtitle}</p>
        </div>

        <div className="upload-section">
          <div
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!imagePreview ? (
              <div className="upload-placeholder">
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3>Click to upload or drag & drop</h3>
                <p>Support JPG, PNG, WEBP (Max 10MB)</p>
                <div className="upload-tips" style={{ boxSizing: 'border-box', padding: '1.7rem', textAlign: 'left' }}>
                  <p style={{ textAlign: 'center' }}><strong>📸 Tips for best results</strong></p>
                  <ul>
                    <li>Take photos in good natural light</li>
                    <li>Focus on affected plant parts (leaves, stems, fruits)</li>
                    <li>Avoid blurry or dark images</li>
                    <li>Include healthy parts for comparison</li>
                    <li>Get close-up shots of symptoms</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="image-preview">
                <img src={imagePreview} alt="Selected plant" />
                <div className="image-overlay">
                  <button className="change-image-btn" onClick={() => fileInputRef.current?.click()}>
                    📷 Change Image
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          {selectedImage && (
            <div className="action-buttons">
              <button
                className="analyze-button"
                onClick={analyzeImageWithGemini}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing Plant...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                    Analyze Disease
                  </>
                )}
              </button>

              <button className="reset-button" onClick={resetAnalysis}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Try Another Image
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-header">
              <h2>{headings.analysisResults}</h2>
            </div>

            <div className="result-content">
              <div className="disease-info">
                <h3>{headings.diseaseIdentification}</h3>
                <div
                  className="disease-name"
                  dangerouslySetInnerHTML={{
                    __html: renderTextWithFormatting(result?.disease || 'Unknown Disease')
                  }}
                />
                <div className="confidence-score">
                  {headings.confidenceLevel} <span
                    className="confidence-value"
                    dangerouslySetInnerHTML={{
                      __html: renderTextWithFormatting(result?.confidence || 'N/A')
                    }}
                  />
                </div>
              </div>

              <div className="symptoms-section">
                <h3>{headings.symptomsObserved}</h3>
                <div className="symptoms-content">
                  <FormattedText
                    text={result?.symptoms}
                    className="symptoms-text"
                  />
                </div>
              </div>

              <div className="treatment-section">
                <h3>{headings.treatmentRecommendations}</h3>
                <div className="treatment-content">
                  <FormattedText
                    text={result?.treatment}
                    className="treatment-text"
                  />
                </div>
              </div>

              <div className="prevention-section">
                <h3>{headings.preventionTips}</h3>
                <div className="prevention-content">
                  <FormattedText
                    text={result?.prevention}
                    className="prevention-text"
                  />
                </div>
              </div>

              <div className="additional-info">
                <h3>{headings.additionalInformation}</h3>
                <div className="info-content">
                  <FormattedText
                    text={result?.additional_info}
                    className="additional-text"
                  />
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="expert-connect-btn" onClick={onBackToHome}>
                {headings.connectWithExpert}
              </button>
              <button className="new-analysis-btn" onClick={resetAnalysis}>
                {headings.analyzeAnotherPlant}
              </button>
            </div>
          </div>
        )}

        {!selectedImage && !result && (
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">🔬</div>
              <h3>AI-Powered Analysis</h3>
              <p>Advanced Google Gemini AI analyzes your plant images to identify diseases accurately</p>
            </div>
            <div className="info-card">
              <div className="card-icon">💡</div>
              <h3>Expert Recommendations</h3>
              <p>Get detailed treatment plans and prevention strategies from agricultural specialists</p>
            </div>
            <div className="info-card">
              <div className="card-icon">🌱</div>
              <h3>Crop-Specific Solutions</h3>
              <p>Tailored advice for Indian crops and farming conditions to maximize your harvest</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;

