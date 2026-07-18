
import{useState,useEffect,useRef,useCallback}from"react";

/* ═══ GOOGLE FONTS ═══ */
const GF=document.createElement("link");
GF.rel="stylesheet";
GF.href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@400;600;700;800&display=swap";
document.head.appendChild(GF);

/* ═══ GLOBAL STYLES ═══ */
const S=document.createElement("style");
S.textContent=`
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;direction:rtl;background:#0F0E2A;color:#1e1b4b;overflow-x:hidden}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#f1f1f1}::-webkit-scrollbar-thumb{background:#8b5cf6;border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes stampIn{0%{transform:scale(0) rotate(-30deg);opacity:0}70%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes confetti{0%{transform:translateY(-100px) rotate(0deg);opacity:1}100%{transform:translateY(400px) rotate(720deg);opacity:0}}
@keyframes glow{0%,100%{box-shadow:0 0 10px #8b5cf680}50%{box-shadow:0 0 25px #8b5cf6,0 0 50px #8b5cf640}}
.animated{animation:fadeIn .5s ease forwards}
.slide-in{animation:slideIn .4s ease forwards}
.floating{animation:float 3s ease-in-out infinite}
.pulsing{animation:pulse 2s ease-in-out infinite}
.spinning{animation:spin 1s linear infinite}
.glowing{animation:glow 2s ease-in-out infinite}
`;
document.head.appendChild(S);

/* ═══════════════════════════════════
   DATA CONSTANTS
═══════════════════════════════════ */

const TEACHER_CREDS={email:"noufdos77@gmail.com",password:"2030"};

const BADGES=[
  {id:"greeter",name:"سفيرة الترحيب العالمي",icon:"🌍",color:"#3B82F6",desc:"تعلّمتِ الترحيب بـ 5 لغات"},
  {id:"listener",name:"مستمعة رائعة",icon:"👂",color:"#8B5CF6",desc:"أتقنتِ تبديل زاوية النظر"},
  {id:"peacemaker",name:"صانعة السلام",icon:"☮️",color:"#10B981",desc:"اخترتِ التسامح في مواقف صعبة"},
  {id:"bridge",name:"بانية الجسور",icon:"🌉",color:"#F59E0B",desc:"بنيتِ جسر الكلمات الطيبة"},
  {id:"resolver",name:"خبيرة حل الخلاف",icon:"⚗️",color:"#EF4444",desc:"أتقنتِ خطوات حل الخلاف"},
  {id:"kindwords",name:"ناشرة الكلمات الطيبة",icon:"💬",color:"#EC4899",desc:"أرسلتِ رسالة سلام"},
  {id:"diversity",name:"صديقة الاختلاف",icon:"🎭",color:"#6366F1",desc:"فرّقتِ بين الحقيقة والصورة النمطية"},
  {id:"ambassador",name:"سفيرة التسامح",icon:"🏅",color:"#D97706",desc:"أتممتِ رحلة التسامح"},
];

const ACTIVITIES=[
  {id:"greetings",title:"تعلّمي الترحيب بلغات العالم",icon:"🌍",color:"#3B82F6",bg:"#EFF6FF",pts:25,badge:"greeter",desc:"اكتشفي كيف تقول أهلاً في 11 دولة"},
  {id:"scenarios",title:"ماذا ستفعلين؟",icon:"💭",color:"#8B5CF6",bg:"#F5F3FF",pts:20,badge:"peacemaker",desc:"مواقف حقيقية - اختاري التصرف المتسامح"},
  {id:"perspective",title:"بدّلي زاوية النظر",icon:"🔭",color:"#EC4899",bg:"#FDF2F8",pts:20,badge:"listener",desc:"تعلّمي فهم مشاعر الآخرين قبل الحكم"},
  {id:"bridge",title:"جسر الكلمات الطيبة",icon:"🌉",color:"#10B981",bg:"#ECFDF5",pts:20,badge:"bridge",desc:"ابني جسرًا بالكلمات التي تُصلح"},
  {id:"conflict",title:"مختبر حل الخلاف",icon:"⚗️",color:"#F59E0B",bg:"#FFFBEB",pts:20,badge:"resolver",desc:"رتّبي خطوات حل الخلاف بالترتيب الصحيح"},
  {id:"wheel",title:"عجلة مواقف التسامح",icon:"🎡",color:"#EF4444",bg:"#FEF2F2",pts:10,badge:"kindwords",desc:"تحدي يومي عشوائي للتسامح"},
  {id:"stereotype",title:"حقيقة أم صورة نمطية؟",icon:"🎭",color:"#6366F1",bg:"#EEF2FF",pts:20,badge:"diversity",desc:"تعلّمي الفرق بين الحقائق والتعميمات"},
  {id:"peace-message",title:"رسالتي للسلام",icon:"✉️",color:"#0EA5E9",bg:"#F0F9FF",pts:15,badge:"kindwords",desc:"اكتبي رسالة وأضيفيها لجدار السلام"},
  {id:"assessment",title:"مقياس التسامح",icon:"📊",color:"#64748B",bg:"#F8FAFC",pts:0,badge:null,desc:"اكتشفي مستوى تسامحك قبل وبعد الرحلة"},
  {id:"mission",title:"مهمة سفيرة التسامح",icon:"🏅",color:"#D97706",bg:"#FFFBEB",pts:100,badge:"ambassador",desc:"المهمة المركّبة النهائية - أثبتي مهاراتك"},
];

const WORLD_GREETINGS=[
  {country:"العربية السعودية",flag:"🇸🇦",lang:"Arabic",hello:"السلام عليكم",pronounce:"أَس-سَلَامُ عَلَيْكُم",meaning:"السلام عليكم",fact:"التحية الإسلامية العالمية التي تجمع المسلمين حول العالم"},
  {country:"المملكة المتحدة",flag:"🇬🇧",lang:"English",hello:"Hello",pronounce:"هِلُو",meaning:"أهلاً / مرحباً",fact:"اللغة الإنجليزية تُستخدم في أكثر من 50 دولة حول العالم"},
  {country:"فرنسا",flag:"🇫🇷",lang:"French",hello:"Bonjour",pronounce:"بُونْ جُور",meaning:"يوم جيد / مرحباً",fact:"اللغة الفرنسية تُسمّى 'لغة الدبلوماسية' وتُستخدم في 29 دولة"},
  {country:"إسبانيا",flag:"🇪🇸",lang:"Spanish",hello:"Hola",pronounce:"أُولَا",meaning:"مرحباً",fact:"الإسبانية ثاني أكثر لغة يتحدث بها الناس كلغة أمّ في العالم"},
  {country:"الصين",flag:"🇨🇳",lang:"Chinese",hello:"你好",pronounce:"نِي هَاو",meaning:"أنتِ بخير؟ / أهلاً",fact:"اللغة الصينية يتحدث بها أكثر من مليار شخص"},
  {country:"اليابان",flag:"🇯🇵",lang:"Japanese",hello:"こんにちは",pronounce:"كُونِيتشِيوَا",meaning:"مرحباً / أهلاً",fact:"التحية في اليابان تعني الاحترام - ينحني اليابانيون عند التحية"},
  {country:"كوريا",flag:"🇰🇷",lang:"Korean",hello:"안녕하세요",pronounce:"أَنْيُونغ هَاسَيو",meaning:"هل أنتِ بسلام؟",fact:"في كوريا الانحناء عند التحية علامة على الاحترام"},
  {country:"تركيا",flag:"🇹🇷",lang:"Turkish",hello:"Merhaba",pronounce:"مَرْحَبَا",meaning:"مرحباً",fact:"تركيا تقع بين آسيا وأوروبا وثقافتها تجمع الاثنتين"},
  {country:"الهند",flag:"🇮🇳",lang:"Hindi",hello:"नमस्ते",pronounce:"نَمَسْتِي",meaning:"أحني رأسي أمام الإله فيكِ",fact:"نمستي تحية إشارة للاحترام العميق في الثقافة الهندية"},
  {country:"روسيا",flag:"🇷🇺",lang:"Russian",hello:"Привет",pronounce:"بِرِيفْيِت",meaning:"مرحباً",fact:"روسيا أكبر دولة في العالم وتمتد على قارتين"},
  {country:"إيطاليا",flag:"🇮🇹",lang:"Italian",hello:"Ciao",pronounce:"تشَاو",meaning:"مرحباً / وداعاً",fact:"Ciao تُستخدم للترحيب والوداع معاً في اللغة الإيطالية"},
];

const SCENARIOS=[
  {
    id:1,title:"الطالبة الجديدة",
    char:"👧🏽",bg:"#EFF6FF",
    story:"انضمت إلى صفك طالبة جديدة تتحدث بلهجة مختلفة. بعض الطالبات بدأن يقلّدن طريقة كلامها ويضحكن عليها. الطالبة الجديدة تبدو حزينة ومحرجة...",
    choices:[
      {text:"أنضم معهن في التقليد والضحك",type:"bad",effect:"😔 الطالبة الجديدة تشعر بالإحراج والرغبة في الاختباء. لا أحد يستحق السخرية من طريقة كلامه.",resolution:"التصرف المتسامح: الدفاع عنها والترحيب بها"},
      {text:"أتجاهل الأمر وأكمل ما أفعله",type:"neutral",effect:"😐 التجاهل لا يساعد الطالبة الجديدة، وقد يجعلها تشعر أن لا أحد يهتم بها.",resolution:"التصرف الأفضل: التدخل بلطف والترحيب بها"},
      {text:"أذهب إليها وأرحب بها وأجلس معها",type:"good",effect:"😊 رائع! الطالبة الجديدة شعرت بالقبول والأمان. تصرفك هذا يصنع فرقاً كبيراً!",resolution:"هذا هو التسامح الحقيقي: الترحيب بمن يختلف عنا"},
      {text:"أخبر المعلمة بما يحدث",type:"good",effect:"✅ جيد! إخبار المعلمة يساعد في إيقاف السخرية وحماية الطالبة.",resolution:"طلب المساعدة من الكبار شجاعة وليس ضعفاً"},
    ],
    goodPhrase:"أهلاً وسهلاً! تعالي اجلسي معنا، يسعدنا التعرف عليكِ 🌸",
  },
  {
    id:2,title:"خلاف أثناء اللعب",
    char:"👭",bg:"#ECFDF5",
    story:"أنتِ وصديقتك تلعبان معاً، وحدث خلاف على قواعد اللعبة. كل واحدة منكما تعتقد أنها على حق، وبدأ الموقف يتصاعد...",
    choices:[
      {text:"أصرخ عليها وأقول إنها دائماً تغشّ",type:"bad",effect:"😤 الصراخ والاتهامات تؤذي المشاعر وتكبّر المشكلة بدلاً من حلّها.",resolution:"الكلمات الجارحة تترك آثاراً حتى بعد الصلح"},
      {text:"أترك اللعبة وأمشي بغضب",type:"neutral",effect:"😶 الهروب من المشكلة لا يحلّها، وقد يُشعر صديقتك بأنك لا تهتمين بها.",resolution:"الأفضل: المواجهة الهادئة والحوار"},
      {text:"أقترح نسأل معاً عن القاعدة الصحيحة",type:"good",effect:"✅ ممتاز! البحث عن الحل معاً يقوّي الصداقة ويحل المشكلة بعدل.",resolution:"البحث عن الحل المشترك هو مهارة التسامح"},
      {text:"أقول: لا بأس، نلعب بطريقتك هذه المرة",type:"good",effect:"😊 التنازل أحياناً علامة قوة وتسامح، وليس ضعفاً.",resolution:"التنازل أحياناً يبقي الصداقة ويبني الثقة"},
    ],
    goodPhrase:"أعتقد أننا نفهم القاعدة بشكل مختلف، لنبحث عن الصواب معاً 🤝",
  },
  {
    id:3,title:"السخرية من المظهر",
    char:"🧕",bg:"#FDF2F8",
    story:"زميلتك في الفصل ترتدي ملابس مختلفة تعكس ثقافتها. بعض الطالبات يعلّقن على ملابسها ويسخرن منها في الخفاء.",
    choices:[
      {text:"أضحك معهن لأكون جزءاً من المجموعة",type:"bad",effect:"😔 الضحك على الآخرين لأنك تريدين القبول يؤذي الضحية ويؤذي ضميرك أيضاً.",resolution:"القبول الحقيقي لا يحتاج إلى إيذاء الآخرين"},
      {text:"أبتعد وكأنني لم أسمع",type:"neutral",effect:"😶 الصمت أمام الإساءة يجعل المسيء يعتقد أن تصرفه مقبول.",resolution:"الصمت أحياناً يُعتبر موافقة ضمنية"},
      {text:"أدافع عنها وأقول إن مظهرها يعكس ثقافتها الجميلة",type:"good",effect:"🌟 شجاعة رائعة! الدفاع عن المظلوم من أعلى مراتب التسامح.",resolution:"الدفاع عن الآخرين حتى حين لا يرونك شجاعة حقيقية"},
      {text:"أكلّمها بعدها وأقول لها إن ما حدث خطأ",type:"good",effect:"💙 جميل! إخبارها يجعلها تعرف أن هناك من يقف بجانبها.",resolution:"الدعم الشخصي يصنع فرقاً كبيراً"},
    ],
    goodPhrase:"ملابسها جميلة وتعكس ثقافتها، كل ثقافة لها جماليّاتها الخاصة 🌸",
  },
  {
    id:4,title:"الاعتذار الصعب",
    char:"😔",bg:"#FFFBEB",
    story:"أخطأتِ في حق صديقتك وقلتِ كلاماً أحزنها دون قصد. تعرفين أنكِ أخطأتِ لكن الاعتذار يبدو صعباً...",
    choices:[
      {text:"أتجاهل الموقف وأأمل أن تنساه",type:"bad",effect:"😟 التجاهل يُكبّر الجرح بدلاً من إصلاحه، وقد تفقدين صداقة قيّمة.",resolution:"الجروح لا تُشفى بالتجاهل"},
      {text:"أنتظر أن تبدأ هي بالكلام",type:"neutral",effect:"⏳ الانتظار يطيل الجفاء. من أخطأ فليبادر بالإصلاح.",resolution:"المبادرة بالاعتذار تحتاج شجاعة"},
      {text:"أذهب إليها فوراً وأعتذر بصدق",type:"good",effect:"✅ الاعتذار الصادق يشفي الجروح ويعمّق الصداقة!",resolution:"الاعتذار ليس ضعفاً بل هو من أشجع ما يمكن أن تفعليه"},
      {text:"أكتب لها رسالة أعتذر فيها",type:"good",effect:"💌 الاعتذار بالكتابة يمنحك وقتاً لتختاري الكلمات الصحيحة.",resolution:"الاعتذار بأي طريقة صادقة هو الخطوة الأهم"},
    ],
    goodPhrase:"أنا آسفة جداً على ما قلته، لم أقصد إيذاءك. مشاعرك تهمني 💜",
  },
  {
    id:5,title:"انتشار رسالة غير لطيفة",
    char:"📱",bg:"#EFF6FF",
    story:"وصلتكِ في مجموعة الفصل رسالة تحمل كلاماً غير لطيف عن إحدى الزميلات. البعض أضاف تعليقات سلبية والرسالة تنتشر بسرعة...",
    choices:[
      {text:"أشارك الرسالة وأضيف تعليقاً مضحكاً",type:"bad",effect:"❌ مشاركة الرسائل الجارحة تجعلك جزءاً من الأذى، حتى لو بدا الأمر تافهاً.",resolution:"كل رسالة مؤلمة نشرتها تتركها آثار"},
      {text:"أحذف الرسالة وأتجاهل الموضوع",type:"neutral",effect:"🤷 الحذف جيد، لكن الزميلة لا تزال تتأذى من الرسائل التي انتشرت.",resolution:"يمكنك فعل أكثر من مجرد الحذف"},
      {text:"أكتب في المجموعة أن هذا الكلام غير مقبول",type:"good",effect:"🦁 شجاعة! التصدي للتنمر الإلكتروني يحتاج قوة وتحتاجه زميلتك.",resolution:"موقفك الواضح يحمي الضحية ويردع الآخرين"},
      {text:"أخبر المعلمة وأدعم الزميلة المتضررة",type:"good",effect:"✅ ممتاز! التبليغ يوقف المشكلة وبسرعة أكبر.",resolution:"الكبار يستطيعون المساعدة أسرع وأفضل"},
    ],
    goodPhrase:"هذا الكلام يؤذي زميلتنا. أرجو أن نتوقف ونفكر كيف تشعر هي الآن 💙",
  },
];

const CONFLICT_STEPS=[
  {id:1,text:"أتوقف وأهدأ 🧘",correct:0},
  {id:2,text:"أستمع للطرف الآخر 👂",correct:1},
  {id:3,text:"أشرح رأيي بأدب 🗣️",correct:2},
  {id:4,text:"أبحث عن نقطة اتفاق 🤝",correct:3},
  {id:5,text:"أقترح حلولاً 💡",correct:4},
  {id:6,text:"نختار حلاً عادلاً ⚖️",correct:5},
  {id:7,text:"نعتذر ونتصالح 💜",correct:6},
];

const BRIDGE_WORDS=[
  {text:"أحترم رأيك",good:true,points:10},
  {text:"لنستمع لبعضنا",good:true,points:10},
  {text:"أعتذر منك",good:true,points:15},
  {text:"يمكننا أن نختلف ونبقى صديقتين",good:true,points:15},
  {text:"أخبريني عن ثقافتك",good:true,points:10},
  {text:"لنبحث عن حل يرضينا",good:true,points:10},
  {text:"مشاعرك مهمة",good:true,points:10},
  {text:"أنا لا تقصدين الأذى",good:true,points:10},
  {text:"أنتِ مخطئة دائماً",good:false,points:-5},
  {text:"لا أريد التحدث معك",good:false,points:-5},
  {text:"هذا أمر لا يعنيني",good:false,points:-10},
  {text:"رأيك غير مهم",good:false,points:-10},
];

const WHEEL_CHALLENGES=[
  {text:"قولي لزميلة جملة إطراء صادقة",icon:"💐"},
  {text:"استمعي لرأي مختلف حتى النهاية دون مقاطعة",icon:"👂"},
  {text:"اعتذري عن خطأ سابق بصدق",icon:"🤲"},
  {text:"رحّبي بطالبة جديدة أو تحدثي معها",icon:"🤗"},
  {text:"تعلّمي كلمة مرحباً بلغة مختلفة",icon:"🌍"},
  {text:"اكتبي جملة تُنهي خلافاً بسلام",icon:"✏️"},
  {text:"اذكري صفة جميلة في شخص مختلف عنك",icon:"🌟"},
  {text:"شاركي أحدهم شيئاً يسعدها دون انتظار مقابل",icon:"🎁"},
];

const STEREOTYPES=[
  {text:"كل الناس في بلد معين يأكلون نفس الطعام",answer:"stereotype",explain:"داخل كل دولة تنوّع كبير في العادات والأذواق. لا يمكننا الحكم على الجميع من خلال شخص واحد."},
  {text:"اللغة العربية إحدى أقدم اللغات في التاريخ",answer:"fact",explain:"صحيح! اللغة العربية لها تاريخ عريق يمتد لأكثر من 1500 سنة."},
  {text:"كل من يرتدي ملابس مختلفة هو غريب أو عجيب",answer:"stereotype",explain:"الملابس تعكس ثقافات مختلفة وكلها جميلة. الاختلاف ليس غرابة."},
  {text:"اليابان معروفة بصناعتها في التكنولوجيا والسيارات",answer:"fact",explain:"صحيح! اليابان من أهم الدول في صناعة التقنية والسيارات عالمياً."},
  {text:"الأطفال في كل مكان يحبون اللعب والمرح",answer:"fact",explain:"صحيح! حب اللعب طبيعة إنسانية مشتركة تجمع الأطفال في كل مكان."},
  {text:"من يتكلم ببطء لا يكون ذكياً",answer:"stereotype",explain:"طريقة الكلام لا تعكس الذكاء. الناس يتحدثون بأساليب مختلفة لأسباب كثيرة."},
  {text:"بعض الدول تحتفل برأس السنة في أوقات مختلفة",answer:"fact",explain:"صحيح! مثلاً رأس السنة الصينية يأتي في وقت مختلف عن رأس السنة الميلادية."},
  {text:"الطالبات في بعض الدول يدرسن إلى جانب الطلاب",answer:"fact",explain:"صحيح! في كثير من دول العالم التعليم المختلط شائع جداً."},
];

const PERSPECTIVES=[
  {
    situation:"رفضتِ مجموعة من الطالبات السماح لزميلتهن بالانضمام إليهن في اللعب",
    chars:["سلمى - الطالبة التي رُفضت","نورة - إحدى الطالبات في المجموعة"],
    views:[
      {name:"سلمى",icon:"😢",text:"شعرت بالإحراج والحزن الشديد. كل يوم أحاول الانضمام وأُرفض. بدأت أشعر أنني لا أُحَب وأن المدرسة مكان مؤلم بالنسبة لي."},
      {name:"نورة",icon:"😕",text:"لم أقصد إيذاء سلمى. ظننت أن المجموعة ممتلئة وأنها ستجد أصدقاء آخرين. لم أفكر كيف تشعر هي."},
    ],
    lesson:"أحياناً لا نقصد الأذى لكن أفعالنا تُؤلم. التفكير في مشاعر الآخرين يمنعنا من إيذائهم دون قصد.",
    question:"ما العبارة الأكثر تفهماً للموقف؟",
    choices:[
      {text:"المجموعة لديها حق في اختيار أصدقائها",pts:0},
      {text:"سلمى تبالغ في مشاعرها",pts:0},
      {text:"نورة لم تقصد لكن يجب أن تفكر بمشاعر سلمى",pts:20,correct:true},
      {text:"يجب إجبار المجموعة على قبول سلمى",pts:5},
    ]
  },
  {
    situation:"خلاف بين طالبتين على أسلوب إنجاز مشروع مشترك",
    chars:["ريم - تريد العمل بأسلوبها","لينا - لديها فكرة مختلفة"],
    views:[
      {name:"ريم",icon:"😤",text:"أعتقد أن أسلوبي هو الأفضل وقد جربته من قبل ونجح. أشعر أن لينا لا تثق بقدراتي."},
      {name:"لينا",icon:"😟",text:"فكرتي جديدة وإبداعية لكن ريم لا تسمعني. أشعر أن رأيي لا يُحترم."},
    ],
    lesson:"في النزاعات كل شخص يرى الأمور من زاويته فقط. الاستماع الحقيقي يجعلنا نرى الصورة كاملة.",
    question:"ما العبارة التي تُعبّر عن التسامح وتقبّل الاختلاف؟",
    choices:[
      {text:"ريم خبيرة أكثر فيجب اتباعها",pts:0},
      {text:"لينا عنيدة ولا تريد التعاون",pts:0},
      {text:"كلتاهما لديها وجهة نظر قيّمة ويجب الاستماع لكلتيهما",pts:20,correct:true},
      {text:"يجب على المعلمة أن تقرر بدلاً منهما",pts:5},
    ]
  },
];

const DEMO_STUDENTS=[
  {name:"سارة الشمري",pts:340,acts:8,badges:["greeter","peacemaker","bridge"],level:3,avatar:"🌟"},
  {name:"نورة العتيبي",pts:280,acts:7,badges:["peacemaker","listener","kindwords"],level:2,avatar:"💫"},
  {name:"ريم المطيري",pts:260,acts:6,badges:["greeter","bridge"],level:2,avatar:"🌸"},
  {name:"لمى الشهري",pts:220,acts:5,badges:["peacemaker","resolver"],level:2,avatar:"🎯"},
  {name:"هنوف الزهراني",pts:200,acts:5,badges:["diversity","kindwords"],level:2,avatar:"🌺"},
  {name:"غدير السلمي",pts:180,acts:4,badges:["greeter"],level:1,avatar:"✨"},
  {name:"مها الدوسري",pts:160,acts:4,badges:["peacemaker"],level:1,avatar:"🦋"},
  {name:"جواهر الرشيدي",pts:140,acts:3,badges:["listener"],level:1,avatar:"💎"},
];

const PEACE_MESSAGES=[
  {name:"سارة",msg:"التسامح هو الطريق الأقصر إلى السعادة 🌸",time:"منذ يومين"},
  {name:"ريم",msg:"عندما أسامح أشعر بخفة في قلبي ✨",time:"منذ 3 أيام"},
  {name:"نورة",msg:"الكلمة الطيبة جسر بين القلوب 🌉",time:"منذ أسبوع"},
  {name:"مها",msg:"الاختلاف نعمة، والتسامح هبة 🌈",time:"منذ أسبوع"},
];

/* ═══════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════ */

const LS={
  get:(k)=>{try{return JSON.parse(localStorage.getItem(k))||null}catch{return null}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},
  del:(k)=>{try{localStorage.removeItem(k)}catch{}},
};

const getLevelName=(pts)=>{
  if(pts<50)return "أبدأ رحلتي";
  if(pts<150)return "أتقدم جيداً";
  if(pts<300)return "صديقة متسامحة";
  return "سفيرة التسامح";
};

const getLevelNum=(pts)=>{
  if(pts<50)return 1;
  if(pts<150)return 2;
  if(pts<300)return 3;
  return 4;
};

/* ═══════════════════════════════════
   UI COMPONENTS
═══════════════════════════════════ */

const Stars=({count=5,filled=0,color="#F59E0B"})=>(
  <div style={{display:"flex",gap:2}}>
    {Array.from({length:count}).map((_,i)=>(
      <span key={i} style={{color:i<filled?color:"#D1D5DB",fontSize:16}}>★</span>
    ))}
  </div>
);

const Badge=({badge,size=48})=>{
  const b=BADGES.find(x=>x.id===badge);
  if(!b)return null;
  return(
    <div style={{textAlign:"center",animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:size,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))"}}>{b.icon}</div>
      <div style={{fontSize:11,fontWeight:700,color:b.color,marginTop:4,maxWidth:80}}>{b.name}</div>
    </div>
  );
};

const ProgressBar=({value,max,color="#8B5CF6",height=8,label})=>(
  <div>
    {label&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13,color:"#6B7280"}}>
      <span>{label}</span><span style={{fontWeight:700}}>{Math.round(value/max*100)}%</span>
    </div>}
    <div style={{background:"#E5E7EB",borderRadius:99,height,overflow:"hidden"}}>
      <div style={{width:`${Math.min(100,value/max*100)}%`,height:"100%",background:color,borderRadius:99,transition:"width .8s ease"}}/>
    </div>
  </div>
);

const Card=({children,style={},onClick,hover=true})=>(
  <div onClick={onClick} style={{
    background:"white",borderRadius:20,padding:24,boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
    transition:"all .3s ease",cursor:onClick?"pointer":"default",
    ...(hover&&onClick?{":hover":{transform:"translateY(-4px)"}}:{}),
    ...style
  }}
  onMouseEnter={e=>{if(onClick&&hover)e.currentTarget.style.transform="translateY(-4px) scale(1.01)"}}
  onMouseLeave={e=>{if(onClick&&hover)e.currentTarget.style.transform="none"}}
  >
    {children}
  </div>
);

const Btn=({children,onClick,color="#8B5CF6",style={},disabled=false,size="md"})=>{
  const sizes={sm:{padding:"8px 16px",fontSize:13},md:{padding:"12px 24px",fontSize:15},lg:{padding:"16px 32px",fontSize:17}};
  return(
    <button onClick={!disabled?onClick:undefined} style={{
      ...sizes[size],background:disabled?"#9CA3AF":color,color:"white",border:"none",borderRadius:12,
      fontFamily:"Tajawal,sans-serif",fontWeight:700,cursor:disabled?"not-allowed":"pointer",
      transition:"all .2s ease",transform:"translateY(0)",boxShadow:`0 4px 15px ${color}40`,
      ...style
    }}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)"}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)"}}
    onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform="translateY(1px)"}}
    >
      {children}
    </button>
  );
};

const Toast=({message,type="success",onClose})=>(
  <div style={{
    position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
    background:type==="success"?"#10B981":type==="error"?"#EF4444":"#8B5CF6",
    color:"white",padding:"12px 24px",borderRadius:12,fontWeight:700,fontSize:15,
    boxShadow:"0 8px 30px rgba(0,0,0,0.2)",zIndex:9999,animation:"fadeIn .3s ease",
    display:"flex",alignItems:"center",gap:8
  }}>
    {type==="success"?"✅":type==="error"?"❌":"ℹ️"} {message}
  </div>
);

/* ═══════════════════════════════════
   MAIN APP
═══════════════════════════════════ */

export default function App(){
  const[screen,setScreen]=useState("loading");
  const[user,setUser]=useState(null);
  const[isTeacher,setIsTeacher]=useState(false);
  const[userData,setUserData]=useState({});
  const[toast,setToast]=useState(null);
  const[bgAnim,setBgAnim]=useState(0);

  useEffect(()=>{
    const t=setInterval(()=>setBgAnim(a=>(a+1)%360),50);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const saved=LS.get("rtUser");
    const savedData=LS.get("rtUserData");
    if(saved){
      setUser(saved);
      setUserData(savedData||{pts:0,badges:[],completedActivities:[],passportStamps:[],messages:[],assessmentBefore:null,assessmentAfter:null});
    }
    const teacherSaved=LS.get("rtTeacher");
    if(teacherSaved)setIsTeacher(true);
    setTimeout(()=>setScreen(saved?"home":teacherSaved?"teacher":"login"),1800);
  },[]);

  const showToast=(msg,type="success")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  const saveUser=(u)=>{setUser(u);LS.set("rtUser",u);};
  const saveUserData=(d)=>{setUserData(d);LS.set("rtUserData",d);};

  const addPoints=(pts,actId,badgeId)=>{
    const d={...userData};
    d.pts=(d.pts||0)+pts;
    if(actId&&!d.completedActivities?.includes(actId)){
      d.completedActivities=[...(d.completedActivities||[]),actId];
    }
    if(badgeId&&!d.badges?.includes(badgeId)){
      d.badges=[...(d.badges||[]),badgeId];
      showToast(`🏅 حصلتِ على شارة: ${BADGES.find(b=>b.id===badgeId)?.name}!`,"success");
    }
    if(actId){
      d.passportStamps=[...(d.passportStamps||[]),{act:actId,date:new Date().toLocaleDateString("ar-SA")}];
    }
    saveUserData(d);
    if(pts>0)showToast(`🌟 +${pts} نقطة!`,"success");
  };

  const go=(s)=>{setScreen(s);window.scrollTo(0,0);};

  const nav={go,user,userData,addPoints,showToast,saveUserData,saveUser};

  return(
    <div style={{minHeight:"100vh",background:"#0F0E2A",fontFamily:"Tajawal,sans-serif",direction:"rtl"}}>
      {screen==="loading"&&<LoadingScreen/>}
      {screen==="login"&&<LoginScreen nav={nav} setIsTeacher={setIsTeacher}/>}
      {screen==="home"&&<HomeScreen nav={nav}/>}
      {screen==="activities"&&<ActivitiesScreen nav={nav}/>}
      {screen==="passport"&&<PassportScreen nav={nav}/>}
      {screen==="leaderboard"&&<LeaderboardScreen nav={nav}/>}
      {screen==="teacher"&&<TeacherScreen nav={nav} setIsTeacher={setIsTeacher}/>}
      {screen==="act-greetings"&&<GreetingsActivity nav={nav}/>}
      {screen==="act-scenarios"&&<ScenariosActivity nav={nav}/>}
      {screen==="act-perspective"&&<PerspectiveActivity nav={nav}/>}
      {screen==="act-bridge"&&<BridgeActivity nav={nav}/>}
      {screen==="act-conflict"&&<ConflictActivity nav={nav}/>}
      {screen==="act-wheel"&&<WheelActivity nav={nav}/>}
      {screen==="act-stereotype"&&<StereotypeActivity nav={nav}/>}
      {screen==="act-peace-message"&&<PeaceMessageActivity nav={nav}/>}
      {screen==="act-assessment"&&<AssessmentActivity nav={nav}/>}
      {screen==="act-mission"&&<MissionActivity nav={nav}/>}
      {toast&&<Toast message={toast.msg} type={toast.type}/>}
    </div>
  );
}

/* ═══ LOADING SCREEN ═══ */
function LoadingScreen(){
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F0E2A,#1E1B4B,#312E81)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"white"}}>
      <div style={{fontSize:80,animation:"float 2s ease-in-out infinite",marginBottom:24}}>🕊️</div>
      <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:36,fontWeight:800,marginBottom:8}}>رحلة التسامح</h1>
      <p style={{fontSize:16,opacity:.7,marginBottom:40}}>مدرسة ملهم الابتدائية • المعلمة نوف الدوسري</p>
      <div style={{width:200,height:4,background:"rgba(255,255,255,0.2)",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#8B5CF6,#EC4899)",animation:"shimmer 1.5s linear infinite",backgroundSize:"200% 100%"}}/>
      </div>
      <p style={{marginTop:16,fontSize:13,opacity:.5}}>جاري تحضير الرحلة...</p>
    </div>
  );
}

/* ═══ LOGIN SCREEN ═══ */
function LoginScreen({nav,setIsTeacher}){
  const[mode,setMode]=useState("choose");
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[pass,setPass]=useState("");
  const[err,setErr]=useState("");
  const[avatar,setAvatar]=useState("🌟");
  const avatars=["🌟","💫","🌸","🦋","🎯","💎","🌺","✨","🎀","🌈"];

  const handleStudent=()=>{
    if(!name.trim()){setErr("أدخلي اسمك أولاً");return;}
    nav.saveUser({name:name.trim(),avatar,role:"student",joinDate:new Date().toLocaleDateString("ar-SA")});
    nav.saveUserData({pts:0,badges:[],completedActivities:[],passportStamps:[],messages:[],assessmentBefore:null,assessmentAfter:null});
    nav.go("home");
  };

  const handleTeacher=()=>{
    if(email===TEACHER_CREDS.email&&pass===TEACHER_CREDS.password){
      LS.set("rtTeacher",true);
      setIsTeacher(true);
      nav.go("teacher");
    } else setErr("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F0E2A,#1E1B4B,#312E81)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:480,width:"100%"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:72,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>🕊️</div>
          <h1 style={{color:"white",fontFamily:"Cairo,sans-serif",fontSize:32,fontWeight:900,marginTop:8}}>رحلة التسامح</h1>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:14}}>تعلّمي التسامح وتقبّل الاختلاف مع زميلات العالم</p>
        </div>

        {mode==="choose"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,animation:"fadeIn .5s ease"}}>
            <div onClick={()=>setMode("student")} style={{background:"white",borderRadius:20,padding:24,textAlign:"center",cursor:"pointer",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
              <div style={{fontSize:48,marginBottom:12}}>👧</div>
              <div style={{fontWeight:800,fontSize:18,color:"#1E1B4B"}}>طالبة</div>
              <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>أبدأي رحلتي</div>
            </div>
            <div onClick={()=>setMode("teacher")} style={{background:"white",borderRadius:20,padding:24,textAlign:"center",cursor:"pointer",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
              <div style={{fontSize:48,marginBottom:12}}>👩‍🏫</div>
              <div style={{fontWeight:800,fontSize:18,color:"#1E1B4B"}}>معلمة</div>
              <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>لوحة التحكم</div>
            </div>
          </div>
        )}

        {mode==="student"&&(
          <div style={{background:"white",borderRadius:24,padding:32,animation:"fadeIn .5s ease"}}>
            <button onClick={()=>{setMode("choose");setErr("");}} style={{background:"none",border:"none",color:"#8B5CF6",cursor:"pointer",fontSize:14,marginBottom:16,fontFamily:"Tajawal"}}>← العودة</button>
            <h2 style={{fontSize:22,fontWeight:800,color:"#1E1B4B",marginBottom:24}}>مرحباً بكِ! 👋</h2>
            <div>
              <label style={{fontSize:14,fontWeight:700,color:"#374151",display:"block",marginBottom:8}}>اسمك</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="أدخلي اسمك..." style={{width:"100%",padding:"12px 16px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:15,fontFamily:"Tajawal",outline:"none"}} onKeyDown={e=>e.key==="Enter"&&handleStudent()}/>
            </div>
            <div style={{marginTop:20}}>
              <label style={{fontSize:14,fontWeight:700,color:"#374151",display:"block",marginBottom:8}}>اختاري شخصيتك</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {avatars.map(a=>(
                  <button key={a} onClick={()=>setAvatar(a)} style={{fontSize:28,background:avatar===a?"#EDE9FE":"#F9FAFB",border:avatar===a?"2px solid #8B5CF6":"2px solid #E5E7EB",borderRadius:12,width:48,height:48,cursor:"pointer",transition:"all .2s"}}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:12}}>{err}</p>}
            <Btn onClick={handleStudent} color="#8B5CF6" style={{width:"100%",marginTop:20,fontSize:16}}>
              🚀 ابدأي الرحلة!
            </Btn>
          </div>
        )}

        {mode==="teacher"&&(
          <div style={{background:"white",borderRadius:24,padding:32,animation:"fadeIn .5s ease"}}>
            <button onClick={()=>{setMode("choose");setErr("");}} style={{background:"none",border:"none",color:"#8B5CF6",cursor:"pointer",fontSize:14,marginBottom:16,fontFamily:"Tajawal"}}>← العودة</button>
            <h2 style={{fontSize:22,fontWeight:800,color:"#1E1B4B",marginBottom:24}}>دخول المعلمة 👩‍🏫</h2>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:14,fontWeight:700,color:"#374151",display:"block",marginBottom:8}}>البريد الإلكتروني</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="البريد الإلكتروني" style={{width:"100%",padding:"12px 16px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:15,fontFamily:"Tajawal",outline:"none"}}/>
            </div>
            <div>
              <label style={{fontSize:14,fontWeight:700,color:"#374151",display:"block",marginBottom:8}}>كلمة المرور</label>
              <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="كلمة المرور" style={{width:"100%",padding:"12px 16px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:15,fontFamily:"Tajawal",outline:"none"}} onKeyDown={e=>e.key==="Enter"&&handleTeacher()}/>
            </div>
            {err&&<p style={{color:"#EF4444",fontSize:13,marginTop:12}}>{err}</p>}
            <Btn onClick={handleTeacher} color="#1D4ED8" style={{width:"100%",marginTop:20,fontSize:16}}>
              🔐 دخول لوحة التحكم
            </Btn>
          </div>
        )}

        <p style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:12,marginTop:24}}>
          إعداد وتنفيذ: المعلمة نوف الدوسري • مدرسة ملهم الابتدائية
        </p>
      </div>
    </div>
  );
}

/* ═══ HOME SCREEN ═══ */
function HomeScreen({nav}){
  const{user,userData,go}=nav;
  const completed=userData.completedActivities?.length||0;
  const total=ACTIVITIES.length;
  const pts=userData.pts||0;
  const level=getLevelNum(pts);
  const levelName=getLevelName(pts);

  const todayMsg=[
    "التسامح لا يغيّر الماضي لكنه يُضيء المستقبل 🌟",
    "الكلمة الطيبة صدقة 💙",
    "من عفا أعلى الله قدره ✨",
    "تقبّل الاختلاف يُثري حياتك 🌈",
    "الاستماع للآخر نصف الحكمة 👂",
  ][new Date().getDay()%5];

  return(
    <div style={{minHeight:"100vh",background:"#F5F3FF"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81,#4C1D95)",padding:"24px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,background:"rgba(139,92,246,0.2)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:250,height:250,background:"rgba(236,72,153,0.15)",borderRadius:"50%"}}/>
        <div style={{maxWidth:800,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div>
              <p style={{color:"rgba(255,255,255,0.7)",fontSize:14}}>مرحباً بكِ 👋</p>
              <h1 style={{color:"white",fontSize:24,fontWeight:900,fontFamily:"Cairo,sans-serif"}}>{user?.avatar} {user?.name}</h1>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                <span style={{background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"4px 12px",color:"white",fontSize:13,fontWeight:700}}>
                  المستوى {level}: {levelName}
                </span>
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{background:"rgba(255,255,255,0.15)",borderRadius:16,padding:"12px 20px"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#F59E0B"}}>{pts}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>نقطة</div>
              </div>
            </div>
          </div>
          <ProgressBar value={completed} max={total} color="#F59E0B" label={`تقدم الرحلة: ${completed} من ${total} نشاط`}/>
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 16px",marginTop:16,borderRight:"3px solid #F59E0B"}}>
            <p style={{color:"rgba(255,255,255,0.9)",fontSize:14,margin:0}}>💡 {todayMsg}</p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
          {[
            {icon:"🎯",label:"الأنشطة",screen:"activities",color:"#8B5CF6"},
            {icon:"🗺️",label:"جواز السفر",screen:"passport",color:"#10B981"},
            {icon:"🏆",label:"الصدارة",screen:"leaderboard",color:"#F59E0B"},
            {icon:"✉️",label:"رسائل السلام",screen:"act-peace-message",color:"#EC4899"},
          ].map(item=>(
            <Card key={item.screen} onClick={()=>go(item.screen)} style={{padding:"16px 8px",textAlign:"center",background:"white"}}>
              <div style={{fontSize:28,marginBottom:6}}>{item.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:item.color}}>{item.label}</div>
            </Card>
          ))}
        </div>

        {/* Badges */}
        {userData.badges?.length>0&&(
          <Card style={{marginBottom:20}}>
            <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🏅 شاراتي</h3>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {userData.badges.map(b=><Badge key={b} badge={b} size={36}/>)}
            </div>
          </Card>
        )}

        {/* Continue Activity */}
        <Card style={{marginBottom:20,background:"linear-gradient(135deg,#7C3AED,#A855F7)",color:"white"}}>
          <h3 style={{fontSize:16,fontWeight:800,marginBottom:8}}>🚀 أكملي رحلتك</h3>
          <p style={{fontSize:14,opacity:.85,marginBottom:16}}>
            {completed===0?"ابدأي بأول نشاط في رحلة التسامح!"
            :completed===total?"أحسنتِ! أتممتِ جميع الأنشطة 🎉"
            :`تبقّى لكِ ${total-completed} أنشطة`}
          </p>
          <Btn onClick={()=>go("activities")} color="white" style={{color:"#7C3AED",fontWeight:800}}>
            عرض جميع الأنشطة ←
          </Btn>
        </Card>

        {/* Activity Grid */}
        <h2 style={{fontSize:18,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🗺️ محطات الرحلة</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {ACTIVITIES.slice(0,6).map((act,i)=>{
            const done=userData.completedActivities?.includes(act.id);
            return(
              <Card key={act.id} onClick={()=>go(`act-${act.id}`)} style={{padding:"16px",position:"relative",overflow:"hidden",opacity:done?.9:1}}>
                {done&&<div style={{position:"absolute",top:8,left:8,background:"#10B981",color:"white",borderRadius:99,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>✓</div>}
                <div style={{fontSize:32,marginBottom:8}}>{act.icon}</div>
                <div style={{fontSize:13,fontWeight:800,color:act.color,marginBottom:4}}>{act.title}</div>
                <div style={{fontSize:11,color:"#6B7280"}}>{act.desc}</div>
                <div style={{marginTop:8,fontSize:12,color:"#9CA3AF"}}>+{act.pts} نقطة</div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ ACTIVITIES SCREEN ═══ */
function ActivitiesScreen({nav}){
  const{userData,go}=nav;
  return(
    <div style={{minHeight:"100vh",background:"#F5F3FF"}}>
      <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الرئيسية</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:24,fontWeight:900}}>🎯 أنشطة التسامح</h1>
        <p style={{opacity:.7,fontSize:14}}>اختاري نشاطاً لتبدأي</p>
      </div>
      <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {ACTIVITIES.map(act=>{
            const done=userData.completedActivities?.includes(act.id);
            return(
              <Card key={act.id} onClick={()=>go(`act-${act.id}`)} style={{padding:"20px",position:"relative",background:act.bg,border:`2px solid ${done?"#10B981":"#E5E7EB"}`}}>
                {done&&<div style={{position:"absolute",top:12,left:12,background:"#10B981",color:"white",borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700}}>✓ مكتمل</div>}
                <div style={{fontSize:36,marginBottom:10}}>{act.icon}</div>
                <div style={{fontSize:14,fontWeight:800,color:act.color,marginBottom:6}}>{act.title}</div>
                <div style={{fontSize:12,color:"#6B7280",marginBottom:10,lineHeight:1.5}}>{act.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{background:act.color+"20",color:act.color,borderRadius:99,padding:"3px 10px",fontSize:12,fontWeight:700}}>+{act.pts} نقطة</span>
                  {act.badge&&<span style={{fontSize:11,color:"#9CA3AF"}}>🏅 {BADGES.find(b=>b.id===act.badge)?.name}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ GREETINGS ACTIVITY ═══ */
function GreetingsActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[selected,setSelected]=useState(null);
  const[learned,setLearned]=useState([]);
  const[quiz,setQuiz]=useState(null);
  const[quizAns,setQuizAns]=useState(null);
  const[done,setDone]=useState(false);

  const selectCountry=(g,i)=>{
    setSelected({...g,idx:i});
    setQuiz(null);setQuizAns(null);
  };

  const markLearned=()=>{
    if(!learned.includes(selected.idx)){
      const nl=[...learned,selected.idx];
      setLearned(nl);
      if(nl.length>=5&&!userData.completedActivities?.includes("greetings")){
        addPoints(25,"greetings","greeter");
        setDone(true);
      }
    }
    const choices=WORLD_GREETINGS.filter((_,i)=>i!==selected.idx).sort(()=>Math.random()-.5).slice(0,3);
    choices.push(selected);
    setQuiz({choices:choices.sort(()=>Math.random()-.5),correct:selected.hello});
  };

  return(
    <div style={{minHeight:"100vh",background:"#EFF6FF"}}>
      <div style={{background:"linear-gradient(135deg,#1D4ED8,#3B82F6)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🌍 تعلّمي الترحيب بلغات العالم</h1>
        <p style={{opacity:.8,fontSize:13,marginTop:4}}>تعلّمتِ: {learned.length}/5 لغات للحصول على الشارة</p>
        <ProgressBar value={learned.length} max={5} color="white"/>
      </div>

      {done&&(
        <div style={{maxWidth:600,margin:"20px auto",padding:"0 16px"}}>
          <Card style={{textAlign:"center",background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"white"}}>
            <div style={{fontSize:64,marginBottom:12}}>🌍</div>
            <h2 style={{fontSize:24,fontWeight:900,marginBottom:8}}>سفيرة الترحيب العالمي!</h2>
            <p style={{opacity:.85}}>تعلّمتِ الترحيب بـ 5 لغات مختلفة. أنتِ الآن تستطيعين أن ترحّبي بزملائك من كل العالم!</p>
            <Btn onClick={()=>go("home")} color="white" style={{color:"#3B82F6",marginTop:16}}>العودة للرئيسية 🏠</Btn>
          </Card>
        </div>
      )}

      <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {WORLD_GREETINGS.map((g,i)=>(
            <button key={i} onClick={()=>selectCountry(g,i)} style={{
              background:learned.includes(i)?"#DCFCE7":selected?.idx===i?"#DBEAFE":"white",
              border:`2px solid ${learned.includes(i)?"#10B981":selected?.idx===i?"#3B82F6":"#E5E7EB"}`,
              borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:"Tajawal",textAlign:"right",
              transition:"all .2s"
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:24}}>{g.flag}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:learned.includes(i)?"#059669":"#1E1B4B"}}>{g.country}</div>
                  <div style={{fontSize:12,color:"#6B7280"}}>{g.lang}</div>
                </div>
                {learned.includes(i)&&<span style={{marginRight:"auto",color:"#10B981",fontSize:18}}>✓</span>}
              </div>
            </button>
          ))}
        </div>

        {selected&&(
          <Card style={{animation:"slideIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:48,marginBottom:8}}>{selected.flag}</div>
              <h2 style={{fontSize:18,fontWeight:900,color:"#1E1B4B"}}>{selected.country}</h2>
            </div>
            <div style={{background:"#EFF6FF",borderRadius:16,padding:20,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:36,fontWeight:900,color:"#1D4ED8",marginBottom:8}}>{selected.hello}</div>
              <div style={{fontSize:18,color:"#374151",fontWeight:700,marginBottom:4}}>النطق: {selected.pronounce}</div>
              <div style={{fontSize:15,color:"#6B7280"}}>المعنى: {selected.meaning}</div>
            </div>
            <div style={{background:"#F0FDF4",borderRadius:12,padding:16,marginBottom:16,borderRight:"3px solid #10B981"}}>
              <p style={{fontSize:14,color:"#065F46",margin:0}}>💡 {selected.fact}</p>
            </div>

            {quiz?(
              <div>
                <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>🧠 تحدي صغير: أي هذه التحية لغة {selected.country}؟</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {quiz.choices.map((c,i)=>(
                    <button key={i} onClick={()=>{if(!quizAns)setQuizAns(c.hello)}} style={{
                      padding:"12px",borderRadius:12,border:`2px solid ${quizAns?c.hello===quiz.correct?"#10B981":c.hello===quizAns?"#EF4444":"#E5E7EB":"#E5E7EB"}`,
                      background:quizAns?c.hello===quiz.correct?"#DCFCE7":c.hello===quizAns?"#FEE2E2":"white":"white",
                      cursor:"pointer",fontFamily:"Tajawal",fontSize:15,fontWeight:700,transition:"all .2s"
                    }}>
                      {c.hello}
                    </button>
                  ))}
                </div>
                {quizAns&&(
                  <div style={{marginTop:12,padding:12,background:quizAns===quiz.correct?"#DCFCE7":"#FEE2E2",borderRadius:12}}>
                    <p style={{color:quizAns===quiz.correct?"#065F46":"#991B1B",fontSize:14,margin:0}}>
                      {quizAns===quiz.correct?"✅ ممتاز! إجابة صحيحة!":"❌ الإجابة الصحيحة: "+quiz.correct}
                    </p>
                  </div>
                )}
              </div>
            ):(
              <Btn onClick={markLearned} color="#3B82F6" style={{width:"100%",marginTop:8}}>
                {learned.includes(selected.idx)?"✓ تعلّمتِه بالفعل":"تعلّمتُ هذه التحية ✓"}
              </Btn>
            )}
          </Card>
        )}

        {!selected&&(
          <div style={{textAlign:"center",padding:40,color:"#9CA3AF"}}>
            <div style={{fontSize:48,marginBottom:12}}>🗺️</div>
            <p style={{fontSize:16}}>اختاري دولة من القائمة لتتعلمي التحية بلغتها!</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ SCENARIOS ACTIVITY ═══ */
function ScenariosActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[idx,setIdx]=useState(0);
  const[chosen,setChosen]=useState(null);
  const[score,setScore]=useState(0);
  const[finished,setFinished]=useState(false);

  const scenario=SCENARIOS[idx];

  const choose=(choice)=>{
    if(chosen)return;
    setChosen(choice);
    if(choice.type==="good")setScore(s=>s+20);
  };

  const next=()=>{
    if(idx<SCENARIOS.length-1){setIdx(i=>i+1);setChosen(null);}
    else{
      if(!userData.completedActivities?.includes("scenarios"))addPoints(score,"scenarios","peacemaker");
      setFinished(true);
    }
  };

  if(finished)return(
    <div style={{minHeight:"100vh",background:"#F5F3FF",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
        <div style={{fontSize:64,marginBottom:16}}>☮️</div>
        <h2 style={{fontSize:26,fontWeight:900,color:"#1E1B4B",marginBottom:8}}>أحسنتِ!</h2>
        <p style={{color:"#6B7280",marginBottom:20}}>أكملتِ جميع المواقف بدرجة {score}/{SCENARIOS.length*20} نقطة</p>
        <div style={{background:"#F5F3FF",borderRadius:16,padding:20,marginBottom:20}}>
          <div style={{fontSize:32,fontWeight:900,color:"#8B5CF6"}}>{score}</div>
          <div style={{fontSize:14,color:"#6B7280"}}>نقطة من أصل {SCENARIOS.length*20}</div>
        </div>
        <Btn onClick={()=>go("home")} color="#8B5CF6" style={{width:"100%"}}>العودة للرئيسية 🏠</Btn>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#F5F3FF"}}>
      <div style={{background:"linear-gradient(135deg,#5B21B6,#7C3AED)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>💭 ماذا ستفعلين؟</h1>
        <p style={{opacity:.8,fontSize:13}}>موقف {idx+1} من {SCENARIOS.length}</p>
        <ProgressBar value={idx+1} max={SCENARIOS.length} color="white"/>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        <Card style={{background:scenario.bg,marginBottom:20}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:56,marginBottom:8}}>{scenario.char}</div>
            <h2 style={{fontSize:20,fontWeight:900,color:"#1E1B4B"}}>{scenario.title}</h2>
          </div>
          <p style={{fontSize:15,color:"#374151",lineHeight:1.7,background:"white",borderRadius:12,padding:16}}>{scenario.story}</p>
        </Card>

        <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>ماذا ستفعلين؟</h3>
        <div style={{display:"grid",gap:10,marginBottom:16}}>
          {scenario.choices.map((c,i)=>(
            <button key={i} onClick={()=>choose(c)} style={{
              background:!chosen?"white":c===chosen?c.type==="good"?"#DCFCE7":"#FEE2E2":"white",
              border:`2px solid ${!chosen?"#E5E7EB":c===chosen?c.type==="good"?"#10B981":"#EF4444":"#E5E7EB"}`,
              borderRadius:14,padding:"14px 16px",cursor:chosen?"default":"pointer",
              fontFamily:"Tajawal",fontSize:14,textAlign:"right",transition:"all .3s",
              display:"flex",alignItems:"center",gap:10
            }}>
              <span style={{background:"#F3F4F6",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{i+1}</span>
              {c.text}
              {chosen===c&&<span style={{marginRight:"auto",fontSize:20}}>{c.type==="good"?"✅":"❌"}</span>}
            </button>
          ))}
        </div>

        {chosen&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{background:chosen.type==="good"?"#DCFCE7":"#FEF3C7",borderRadius:16,padding:16,marginBottom:12,borderRight:`4px solid ${chosen.type==="good"?"#10B981":"#F59E0B"}`}}>
              <p style={{fontSize:15,color:chosen.type==="good"?"#065F46":"#92400E",fontWeight:600,marginBottom:8}}>{chosen.effect}</p>
              <p style={{fontSize:13,color:"#6B7280"}}>{chosen.resolution}</p>
            </div>
            <div style={{background:"#EFF6FF",borderRadius:12,padding:12,marginBottom:16,borderRight:"3px solid #3B82F6"}}>
              <p style={{fontSize:13,color:"#1D4ED8",margin:0}}>💬 يمكنكِ قول: "{scenario.goodPhrase}"</p>
            </div>
            <Btn onClick={next} color="#8B5CF6" style={{width:"100%"}}>
              {idx<SCENARIOS.length-1?"الموقف التالي ←":"إنهاء النشاط ✓"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ PERSPECTIVE ACTIVITY ═══ */
function PerspectiveActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[idx,setIdx]=useState(0);
  const[viewIdx,setViewIdx]=useState(0);
  const[answered,setAnswered]=useState(null);
  const[totalPts,setTotalPts]=useState(0);
  const[finished,setFinished]=useState(false);

  const scenario=PERSPECTIVES[idx];

  const answer=(choice)=>{
    if(answered!==null)return;
    setAnswered(choice);
    if(choice.correct)setTotalPts(p=>p+choice.pts);
  };

  const next=()=>{
    if(idx<PERSPECTIVES.length-1){setIdx(i=>i+1);setViewIdx(0);setAnswered(null);}
    else{
      if(!userData.completedActivities?.includes("perspective"))addPoints(totalPts,"perspective","listener");
      setFinished(true);
    }
  };

  if(finished)return(
    <div style={{minHeight:"100vh",background:"#FDF2F8",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
        <div style={{fontSize:64,marginBottom:12}}>👁️</div>
        <h2 style={{fontSize:24,fontWeight:900,color:"#1E1B4B",marginBottom:8}}>مستمعة رائعة!</h2>
        <p style={{color:"#6B7280",marginBottom:24}}>تعلّمتِ رؤية الأمور من زوايا مختلفة قبل الحكم</p>
        <Btn onClick={()=>go("home")} color="#EC4899" style={{width:"100%"}}>العودة للرئيسية</Btn>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#FDF2F8"}}>
      <div style={{background:"linear-gradient(135deg,#9D174D,#EC4899)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🔭 بدّلي زاوية النظر</h1>
        <p style={{opacity:.8,fontSize:13}}>موقف {idx+1} من {PERSPECTIVES.length}</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        <Card style={{marginBottom:20,borderRight:"4px solid #EC4899"}}>
          <h3 style={{fontSize:15,fontWeight:800,color:"#9D174D",marginBottom:8}}>📌 الموقف</h3>
          <p style={{color:"#374151",lineHeight:1.7}}>{scenario.situation}</p>
        </Card>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {scenario.chars.map((c,i)=>(
            <button key={i} onClick={()=>setViewIdx(i)} style={{
              flex:1,padding:"10px",borderRadius:12,border:`2px solid ${viewIdx===i?"#EC4899":"#E5E7EB"}`,
              background:viewIdx===i?"#FCE7F3":"white",cursor:"pointer",fontFamily:"Tajawal",fontWeight:700,fontSize:13
            }}>
              {scenario.views[i].icon} {c}
            </button>
          ))}
        </div>

        <Card style={{background:"#FDF2F8",marginBottom:20,animation:"fadeIn .3s ease",borderRight:`4px solid ${viewIdx===0?"#EC4899":"#8B5CF6"}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{fontSize:32}}>{scenario.views[viewIdx].icon}</div>
            <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B"}}>{scenario.views[viewIdx].name} تقول:</h3>
          </div>
          <p style={{fontSize:14,color:"#374151",lineHeight:1.7,background:"white",borderRadius:12,padding:16}}>
            "{scenario.views[viewIdx].text}"
          </p>
        </Card>

        <div style={{background:"#FEF3C7",borderRadius:12,padding:16,marginBottom:20,borderRight:"3px solid #F59E0B"}}>
          <p style={{fontSize:14,color:"#92400E",margin:0}}>💡 {scenario.lesson}</p>
        </div>

        <h3 style={{fontSize:15,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>{scenario.question}</h3>
        <div style={{display:"grid",gap:8,marginBottom:16}}>
          {scenario.choices.map((c,i)=>(
            <button key={i} onClick={()=>answer(c)} style={{
              background:answered===null?"white":c===answered?c.correct?"#DCFCE7":"#FEE2E2":"white",
              border:`2px solid ${answered===null?"#E5E7EB":c===answered?c.correct?"#10B981":"#EF4444":"#E5E7EB"}`,
              borderRadius:12,padding:"12px 16px",cursor:"pointer",fontFamily:"Tajawal",fontSize:14,textAlign:"right"
            }}>
              {c.text} {answered&&c.correct&&"✅"}
            </button>
          ))}
        </div>
        {answered!==null&&<Btn onClick={next} color="#EC4899" style={{width:"100%"}}>{idx<PERSPECTIVES.length-1?"الموقف التالي":"إنهاء النشاط ✓"}</Btn>}
      </div>
    </div>
  );
}

/* ═══ BRIDGE ACTIVITY ═══ */
function BridgeActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[bridgePts,setBridgePts]=useState(0);
  const[placed,setPlaced]=useState([]);
  const[badWords,setBadWords]=useState([]);
  const[done,setDone]=useState(false);
  const shuffled=useRef([...BRIDGE_WORDS].sort(()=>Math.random()-.5));

  const clickWord=(word,idx)=>{
    if(placed.find(p=>p.idx===idx)||badWords.includes(idx))return;
    if(word.good){
      setPlaced(p=>[...p,{...word,idx}]);
      setBridgePts(p=>p+word.points);
    } else {
      setBadWords(p=>[...p,idx]);
      setBridgePts(p=>Math.max(0,p+word.points));
    }
    if(placed.filter(p=>p.good).length+1>=6){
      setTimeout(()=>{
        if(!userData.completedActivities?.includes("bridge"))addPoints(bridgePts+word.points,"bridge","bridge");
        setDone(true);
      },500);
    }
  };

  const goodPlaced=placed.length;
  const bridgeWidth=Math.min(100,(goodPlaced/6)*100);

  if(done)return(
    <div style={{minHeight:"100vh",background:"#ECFDF5",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
        <div style={{fontSize:64,marginBottom:12}}>🌉</div>
        <h2 style={{fontSize:24,fontWeight:900,color:"#065F46",marginBottom:8}}>بانية الجسور!</h2>
        <p style={{color:"#6B7280",marginBottom:20}}>بنيتِ الجسر بالكلمات الطيبة وجعلتِ الشخصيتين تتواصلان!</p>
        <div style={{fontSize:32,fontWeight:900,color:"#10B981",marginBottom:20}}>{bridgePts} نقطة</div>
        <Btn onClick={()=>go("home")} color="#10B981" style={{width:"100%"}}>العودة للرئيسية</Btn>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#ECFDF5"}}>
      <div style={{background:"linear-gradient(135deg,#065F46,#10B981)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🌉 جسر الكلمات الطيبة</h1>
        <p style={{opacity:.8,fontSize:13}}>اختاري الكلمات التي تبني التسامح</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        {/* Bridge Visual */}
        <Card style={{marginBottom:20,textAlign:"center",background:"#F0FDF4"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16,padding:"0 10px"}}>
            <div style={{fontSize:36}}>🧑</div>
            <div style={{flex:1,margin:"0 10px"}}>
              <div style={{background:"#BBF7D0",borderRadius:8,height:12,margin:"0 0 8px",position:"relative",overflow:"hidden"}}>
                <div style={{width:`${bridgeWidth}%`,height:"100%",background:"linear-gradient(90deg,#10B981,#059669)",borderRadius:8,transition:"width .5s ease"}}/>
              </div>
              <div style={{fontSize:13,color:"#065F46",fontWeight:700}}>الجسر: {goodPlaced}/6 قطعة</div>
            </div>
            <div style={{fontSize:36}}>🧑</div>
          </div>
          <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
            {placed.map((w,i)=>(
              <span key={i} style={{background:"#10B981",color:"white",borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:700}}>{w.text}</span>
            ))}
          </div>
        </Card>

        <div style={{background:"#FEF3C7",borderRadius:12,padding:12,marginBottom:16,borderRight:"3px solid #F59E0B"}}>
          <p style={{fontSize:13,color:"#92400E",margin:0}}>💡 اضغطي على الكلمات الطيبة لبناء الجسر. الكلمات الجارحة ستهزّ الجسر!</p>
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          {shuffled.current.map((word,i)=>{
            const isPlaced=placed.find(p=>p.idx===i);
            const isBad=badWords.includes(i);
            return(
              <button key={i} onClick={()=>clickWord(word,i)} disabled={!!isPlaced||isBad} style={{
                padding:"10px 16px",borderRadius:20,border:`2px solid ${isPlaced?"#10B981":isBad?"#EF4444":"#E5E7EB"}`,
                background:isPlaced?"#DCFCE7":isBad?"#FEE2E2":"white",
                cursor:isPlaced||isBad?"default":"pointer",fontFamily:"Tajawal",fontSize:14,
                opacity:isPlaced||isBad?.6:1,transition:"all .3s",
                animation:isBad?"pulse .3s ease":"none"
              }}>
                {word.text}
                {isPlaced&&" ✅"}
                {isBad&&" ❌"}
              </button>
            );
          })}
        </div>

        <div style={{textAlign:"center",marginTop:20,fontSize:16,fontWeight:700,color:"#10B981"}}>
          نقاط الجسر: {bridgePts}
        </div>
      </div>
    </div>
  );
}

/* ═══ CONFLICT ACTIVITY ═══ */
function ConflictActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[steps,setSteps]=useState(()=>[...CONFLICT_STEPS].sort(()=>Math.random()-.5));
  const[checked,setChecked]=useState(false);
  const[score,setScore]=useState(0);
  const[dragging,setDragging]=useState(null);
  const[done,setDone]=useState(false);

  const moveUp=(i)=>{
    if(i===0)return;
    const s=[...steps];
    [s[i],s[i-1]]=[s[i-1],s[i]];
    setSteps(s);
  };
  const moveDown=(i)=>{
    if(i===steps.length-1)return;
    const s=[...steps];
    [s[i],s[i+1]]=[s[i+1],s[i]];
    setSteps(s);
  };

  const checkAnswer=()=>{
    let correct=0;
    steps.forEach((s,i)=>{if(s.correct===i)correct++;});
    const pts=correct*5;
    setScore(pts);
    setChecked(true);
  };

  const finish=()=>{
    if(!userData.completedActivities?.includes("conflict"))addPoints(score,"conflict","resolver");
    setDone(true);
  };

  if(done)return(
    <div style={{minHeight:"100vh",background:"#FFFBEB",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
        <div style={{fontSize:64,marginBottom:12}}>⚗️</div>
        <h2 style={{fontSize:24,fontWeight:900,color:"#92400E",marginBottom:8}}>خبيرة حل الخلاف!</h2>
        <p style={{color:"#6B7280",marginBottom:20}}>أتقنتِ ترتيب خطوات حل الخلاف. أنتِ الآن تعرفين كيف تُحوّلين الخلاف إلى فرصة للتفاهم!</p>
        <Btn onClick={()=>go("home")} color="#F59E0B" style={{width:"100%",color:"white"}}>العودة للرئيسية</Btn>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#FFFBEB"}}>
      <div style={{background:"linear-gradient(135deg,#92400E,#F59E0B)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>⚗️ مختبر حل الخلاف</h1>
        <p style={{opacity:.8,fontSize:13}}>رتّبي الخطوات بالترتيب الصحيح</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        <div style={{background:"#FEF3C7",borderRadius:12,padding:12,marginBottom:16,borderRight:"3px solid #F59E0B"}}>
          <p style={{fontSize:13,color:"#92400E",margin:0}}>💡 استخدمي الأسهم لترتيب خطوات حل الخلاف من الأول للأخير</p>
        </div>

        <div style={{display:"grid",gap:8,marginBottom:20}}>
          {steps.map((step,i)=>{
            const isCorrect=checked&&step.correct===i;
            const isWrong=checked&&step.correct!==i;
            return(
              <div key={step.id} style={{
                background:isCorrect?"#DCFCE7":isWrong?"#FEE2E2":"white",
                border:`2px solid ${isCorrect?"#10B981":isWrong?"#EF4444":"#E5E7EB"}`,
                borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,
                transition:"all .3s",animation:isCorrect?"fadeIn .4s ease":"none"
              }}>
                <div style={{background:"#F3F4F6",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#374151",flexShrink:0}}>{i+1}</div>
                <span style={{flex:1,fontSize:14,fontWeight:600}}>{step.text}</span>
                {!checked&&(
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <button onClick={()=>moveUp(i)} disabled={i===0} style={{background:"none",border:"1px solid #E5E7EB",borderRadius:6,width:28,height:28,cursor:"pointer",opacity:i===0?.3:1}}>↑</button>
                    <button onClick={()=>moveDown(i)} disabled={i===steps.length-1} style={{background:"none",border:"1px solid #E5E7EB",borderRadius:6,width:28,height:28,cursor:"pointer",opacity:i===steps.length-1?.3:1}}>↓</button>
                  </div>
                )}
                {checked&&(isCorrect?<span style={{color:"#10B981",fontSize:18}}>✓</span>:<span style={{fontSize:12,color:"#EF4444"}}>الترتيب: {step.correct+1}</span>)}
              </div>
            );
          })}
        </div>

        {!checked?(
          <Btn onClick={checkAnswer} color="#F59E0B" style={{width:"100%",color:"white"}}>✓ تحقق من الترتيب</Btn>
        ):(
          <div>
            <div style={{background:"#DCFCE7",borderRadius:12,padding:16,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:"#065F46"}}>{score}/{CONFLICT_STEPS.length*5} نقطة</div>
              <p style={{color:"#065F46",marginTop:4,fontSize:14}}>
                {score===CONFLICT_STEPS.length*5?"مثالي! كل الخطوات بالترتيب الصحيح! 🌟":score>20?"ممتاز! معظم الخطوات صحيحة":"جيد! راجعي الترتيب الصحيح"}
              </p>
            </div>
            <Btn onClick={finish} color="#F59E0B" style={{width:"100%",color:"white"}}>إنهاء النشاط ✓</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ WHEEL ACTIVITY ═══ */
function WheelActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[spinning,setSpinning]=useState(false);
  const[result,setResult]=useState(null);
  const[rotation,setRotation]=useState(0);
  const[done,setDone]=useState(false);
  const[accepted,setAccepted]=useState(false);

  const spin=()=>{
    if(spinning)return;
    setSpinning(true);
    setResult(null);
    const extra=720+Math.random()*720;
    const newRot=rotation+extra;
    setRotation(newRot);
    setTimeout(()=>{
      const idx=Math.floor((WHEEL_CHALLENGES.length-((newRot%360)/(360/WHEEL_CHALLENGES.length)))%WHEEL_CHALLENGES.length);
      setResult(WHEEL_CHALLENGES[Math.abs(idx)%WHEEL_CHALLENGES.length]);
      setSpinning(false);
    },2500);
  };

  const accept=()=>{
    setAccepted(true);
    if(!userData.completedActivities?.includes("wheel"))addPoints(10,"wheel","kindwords");
    setDone(true);
  };

  const segments=WHEEL_CHALLENGES;
  const anglePerSeg=360/segments.length;
  const colors=["#8B5CF6","#3B82F6","#10B981","#F59E0B","#EF4444","#EC4899","#6366F1","#0EA5E9"];

  return(
    <div style={{minHeight:"100vh",background:"#FEF2F2"}}>
      <div style={{background:"linear-gradient(135deg,#7F1D1D,#EF4444)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🎡 عجلة مواقف التسامح</h1>
        <p style={{opacity:.8,fontSize:13}}>أديري العجلة واقبلي التحدي اليومي!</p>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 16px",textAlign:"center"}}>
        {/* Wheel */}
        <div style={{position:"relative",width:280,height:280,margin:"0 auto 24px",display:"inline-block"}}>
          <svg width={280} height={280} viewBox="0 0 280 280" style={{transform:`rotate(${rotation}deg)`,transition:spinning?"transform 2.5s cubic-bezier(0.25,0.1,0.25,1)":"none",transformOrigin:"center"}}>
            {segments.map((seg,i)=>{
              const startAngle=(i*anglePerSeg-90)*Math.PI/180;
              const endAngle=((i+1)*anglePerSeg-90)*Math.PI/180;
              const x1=140+120*Math.cos(startAngle),y1=140+120*Math.sin(startAngle);
              const x2=140+120*Math.cos(endAngle),y2=140+120*Math.sin(endAngle);
              const midAngle=((i+0.5)*anglePerSeg-90)*Math.PI/180;
              const tx=140+80*Math.cos(midAngle),ty=140+80*Math.sin(midAngle);
              return(
                <g key={i}>
                  <path d={`M140 140 L${x1} ${y1} A120 120 0 0 1 ${x2} ${y2} Z`} fill={colors[i%colors.length]} stroke="white" strokeWidth={2}/>
                  <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize={18} transform={`rotate(${i*anglePerSeg+anglePerSeg/2},${tx},${ty})`}>{seg.icon}</text>
                </g>
              );
            })}
            <circle cx={140} cy={140} r={20} fill="white" stroke="#E5E7EB" strokeWidth={2}/>
          </svg>
          <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",fontSize:24,zIndex:10}}>⬇️</div>
        </div>

        {!result&&!spinning&&(
          <Btn onClick={spin} color="#EF4444" size="lg" style={{fontSize:18}}>🎡 أديري العجلة!</Btn>
        )}

        {spinning&&(
          <div style={{padding:20,color:"#EF4444",fontWeight:700,fontSize:16}}>⏳ العجلة تدور...</div>
        )}

        {result&&!done&&(
          <div style={{animation:"fadeIn .5s ease"}}>
            <Card style={{textAlign:"center",background:"linear-gradient(135deg,#EF4444,#F97316)",color:"white",marginBottom:16}}>
              <div style={{fontSize:48,marginBottom:8}}>{result.icon}</div>
              <h3 style={{fontSize:18,fontWeight:900,marginBottom:8}}>تحديكِ اليوم:</h3>
              <p style={{fontSize:16,lineHeight:1.6}}>{result.text}</p>
            </Card>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={accept} color="#10B981" style={{flex:1}}>✅ قبلتُ التحدي!</Btn>
              <Btn onClick={spin} color="#EF4444" style={{flex:1}}>🎡 أديري مجدداً</Btn>
            </div>
          </div>
        )}

        {done&&(
          <Card style={{textAlign:"center",background:"#DCFCE7"}}>
            <div style={{fontSize:48,marginBottom:8}}>🌟</div>
            <h3 style={{fontSize:18,fontWeight:900,color:"#065F46"}}>أحسنتِ! قبلتِ التحدي!</h3>
            <p style={{color:"#065F46",marginBottom:16}}>تذكّري تنفيذه اليوم مع زملائك وعائلتك 💙</p>
            <Btn onClick={()=>go("home")} color="#10B981" style={{width:"100%"}}>العودة للرئيسية</Btn>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ═══ STEREOTYPE ACTIVITY ═══ */
function StereotypeActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[idx,setIdx]=useState(0);
  const[answered,setAnswered]=useState(null);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const cards=useRef([...STEREOTYPES].sort(()=>Math.random()-.5));

  const card=cards.current[idx];

  const answer=(ans)=>{
    if(answered)return;
    setAnswered(ans);
    if(ans===card.answer)setScore(s=>s+10);
  };

  const next=()=>{
    if(idx<cards.current.length-1){setIdx(i=>i+1);setAnswered(null);}
    else{
      if(!userData.completedActivities?.includes("stereotype"))addPoints(score,"stereotype","diversity");
      setDone(true);
    }
  };

  if(done)return(
    <div style={{minHeight:"100vh",background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
        <div style={{fontSize:64,marginBottom:12}}>🎭</div>
        <h2 style={{fontSize:24,fontWeight:900,color:"#1E1B4B",marginBottom:8}}>صديقة الاختلاف!</h2>
        <p style={{color:"#6B7280",marginBottom:16}}>حصلتِ على {score}/{cards.current.length*10} نقطة</p>
        <p style={{color:"#6B7280",marginBottom:24}}>تعلّمتِ الفرق بين الحقيقة والصور النمطية. تذكّري دائماً: لا يمكن الحكم على الكل من خلال البعض!</p>
        <Btn onClick={()=>go("home")} color="#6366F1" style={{width:"100%"}}>العودة للرئيسية</Btn>
      </Card>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#EEF2FF"}}>
      <div style={{background:"linear-gradient(135deg,#312E81,#6366F1)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🎭 حقيقة أم صورة نمطية؟</h1>
        <p style={{opacity:.8,fontSize:13}}>بطاقة {idx+1} من {cards.current.length}</p>
        <ProgressBar value={idx+1} max={cards.current.length} color="white"/>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 16px"}}>
        <Card style={{textAlign:"center",marginBottom:24,background:"#EEF2FF",border:"2px solid #6366F1",minHeight:180,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <p style={{fontSize:18,fontWeight:700,color:"#312E81",lineHeight:1.6}}>{card.text}</p>
        </Card>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {["fact","stereotype"].map(ans=>(
            <button key={ans} onClick={()=>answer(ans)} style={{
              padding:"20px 12px",borderRadius:16,cursor:"pointer",fontFamily:"Tajawal",fontSize:15,fontWeight:800,border:"2px solid",
              background:answered===null?"white":ans===answered?ans===card.answer?"#DCFCE7":"#FEE2E2":card.answer===ans&&answered?"#DCFCE7":"white",
              borderColor:answered===null?"#E5E7EB":ans===answered?ans===card.answer?"#10B981":"#EF4444":card.answer===ans&&answered?"#10B981":"#E5E7EB",
              color:ans==="fact"?"#065F46":"#991B1B",transition:"all .3s"
            }}>
              {ans==="fact"?"✅ حقيقة":"❌ صورة نمطية"}
            </button>
          ))}
        </div>

        {answered&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{background:answered===card.answer?"#DCFCE7":"#FEF3C7",borderRadius:12,padding:16,marginBottom:16,borderRight:`4px solid ${answered===card.answer?"#10B981":"#F59E0B"}`}}>
              <p style={{fontWeight:700,color:answered===card.answer?"#065F46":"#92400E",marginBottom:4}}>
                {answered===card.answer?"✅ إجابة صحيحة!":"⚠️ الجواب الصحيح: "+(card.answer==="fact"?"حقيقة":"صورة نمطية")}
              </p>
              <p style={{fontSize:14,color:"#6B7280"}}>{card.explain}</p>
            </div>
            <Btn onClick={next} color="#6366F1" style={{width:"100%"}}>
              {idx<cards.current.length-1?"البطاقة التالية ←":"إنهاء النشاط ✓"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ PEACE MESSAGE ACTIVITY ═══ */
function PeaceMessageActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[msg,setMsg]=useState("");
  const[submitted,setSubmitted]=useState(false);
  const[allMsgs,setAllMsgs]=useState(()=>[...PEACE_MESSAGES,...(LS.get("rtMessages")||[])]);

  const submit=()=>{
    if(!msg.trim()||msg.length<10)return;
    const newMsg={name:nav.user?.name||"طالبة",msg:msg.trim(),time:"الآن"};
    const updated=[newMsg,...allMsgs];
    setAllMsgs(updated);
    LS.set("rtMessages",updated.filter(m=>!PEACE_MESSAGES.some(p=>p.msg===m.msg)));
    if(!userData.completedActivities?.includes("peace-message"))addPoints(15,"peace-message","kindwords");
    setSubmitted(true);
  };

  return(
    <div style={{minHeight:"100vh",background:"#F0F9FF"}}>
      <div style={{background:"linear-gradient(135deg,#0369A1,#0EA5E9)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الرئيسية</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>✉️ رسالتي للسلام</h1>
        <p style={{opacity:.8,fontSize:13}}>جدار السلام العالمي • {allMsgs.length} رسالة من الطالبات</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        {!submitted?(
          <Card style={{marginBottom:20}}>
            <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>✍️ اكتبي رسالتك للسلام</h3>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="اكتبي رسالة جميلة عن التسامح أو السلام... (على الأقل 10 حروف)" style={{width:"100%",padding:"12px 16px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:14,fontFamily:"Tajawal",outline:"none",resize:"vertical",minHeight:100,lineHeight:1.7}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <span style={{fontSize:12,color:msg.length<10?"#EF4444":"#6B7280"}}>{msg.length} حرف {msg.length<10&&"(على الأقل 10)"}</span>
              <Btn onClick={submit} color="#0EA5E9" disabled={msg.length<10}>إرسال رسالتي ✉️</Btn>
            </div>
          </Card>
        ):(
          <Card style={{textAlign:"center",background:"linear-gradient(135deg,#0EA5E9,#8B5CF6)",color:"white",marginBottom:20}}>
            <div style={{fontSize:48,marginBottom:8}}>✉️</div>
            <h3 style={{fontSize:18,fontWeight:900,marginBottom:4}}>رسالتك وصلت!</h3>
            <p style={{opacity:.85}}>شكراً! رسالتك أضافت لمسة جميلة لجدار السلام</p>
          </Card>
        )}

        <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>🕊️ جدار السلام</h3>
        <div style={{display:"grid",gap:12}}>
          {allMsgs.slice(0,8).map((m,i)=>(
            <Card key={i} style={{background:"#F0F9FF",border:"1px solid #BAE6FD"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontWeight:700,color:"#0369A1",fontSize:14}}>💙 {m.name}</span>
                <span style={{fontSize:12,color:"#9CA3AF"}}>{m.time}</span>
              </div>
              <p style={{color:"#374151",fontSize:14,lineHeight:1.6,margin:0}}>{m.msg}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ ASSESSMENT ACTIVITY ═══ */
function AssessmentActivity({nav}){
  const{addPoints,go,userData,saveUserData}=nav;
  const questions=[
    {q:"زميلتك تتحدث بلهجة مختلفة وبعض الطالبات يضحكن. ماذا تفعلين؟",opts:["أضحك معهن","أتجاهل الأمر","أرحب بها وأجلس معها","أخبر المعلمة"],correct:[2,3]},
    {q:"اختلفتِ مع صديقتك على رأي. ما أول خطوة تقومين بها؟",opts:["أصرخ عليها","أسمع رأيها أولاً","أترك المكان","أشكوها"],correct:[1]},
    {q:"أخطأتِ في حق زميلتك. ماذا تفعلين؟",opts:["أتجاهل الأمر","أنتظرها أن تبادر","أعتذر بصدق فوراً","أقول إنها هي المخطئة"],correct:[2]},
    {q:"زميلة جديدة تبدو وحيدة في الفصل. ماذا تفعلين؟",opts:["لا يعنيني","أشير إليها بدون كلام","أذهب إليها وأعرّف بنفسي","أنتظر أن تتكلم"],correct:[2]},
    {q:"ترى رسالة جارحة عن زميلة في مجموعة الفصل. ماذا تفعلين؟",opts:["أشاركها","أتجاهلها","أحذفها وأكتب أن هذا خاطئ","أضيف تعليقاً مضحكاً"],correct:[2]},
  ];
  const[idx,setIdx]=useState(0);
  const[answers,setAnswers]=useState({});
  const[done,setDone]=useState(false);
  const[score,setScore]=useState(0);

  const answer=(optIdx)=>{
    if(answers[idx]!==undefined)return;
    const isCorrect=questions[idx].correct.includes(optIdx);
    setAnswers(a=>({...a,[idx]:optIdx}));
    if(isCorrect)setScore(s=>s+20);
  };

  const next=()=>{
    if(idx<questions.length-1)setIdx(i=>i+1);
    else{
      const finalScore=score+(questions[idx].correct.includes(answers[idx])?20:0);
      const level=finalScore>=80?"سفيرة التسامح":finalScore>=60?"صديقة متسامحة":finalScore>=40?"أتقدم جيداً":"أبدأ رحلتي";
      const d={...userData};
      if(!d.assessmentBefore)d.assessmentBefore={score:finalScore,level,date:new Date().toLocaleDateString("ar-SA")};
      else d.assessmentAfter={score:finalScore,level,date:new Date().toLocaleDateString("ar-SA")};
      saveUserData(d);
      setDone(true);
    }
  };

  const q=questions[idx];
  if(done){
    const lvl=score>=80?"سفيرة التسامح":score>=60?"صديقة متسامحة":score>=40?"أتقدم جيداً":"أبدأ رحلتي";
    const pct=Math.round(score/100*100);
    return(
      <div style={{minHeight:"100vh",background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <Card style={{maxWidth:480,width:"100%",textAlign:"center",padding:40}}>
          <div style={{fontSize:64,marginBottom:12}}>📊</div>
          <h2 style={{fontSize:22,fontWeight:900,color:"#1E1B4B",marginBottom:4}}>نتيجة مقياس التسامح</h2>
          <div style={{background:"linear-gradient(135deg,#8B5CF6,#EC4899)",borderRadius:16,padding:20,color:"white",margin:"20px 0"}}>
            <div style={{fontSize:48,fontWeight:900}}>{pct}%</div>
            <div style={{fontSize:18,fontWeight:700,marginTop:4}}>{lvl}</div>
          </div>
          <p style={{color:"#6B7280",marginBottom:20}}>
            {pct>=80?"أنتِ سفيرة حقيقية للتسامح! تصرفاتك تعكس قيماً رائعة."
            :pct>=60?"أنتِ في الطريق الصحيح! استمري في رحلة التسامح."
            :"الرحلة بدأت! الأنشطة ستساعدك على النمو والتطور."}
          </p>
          <Btn onClick={()=>go("home")} color="#8B5CF6" style={{width:"100%"}}>العودة للرحلة</Btn>
        </Card>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{background:"linear-gradient(135deg,#374151,#6B7280)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>📊 مقياس التسامح</h1>
        <p style={{opacity:.8,fontSize:13}}>سؤال {idx+1} من {questions.length}</p>
        <ProgressBar value={idx+1} max={questions.length} color="white"/>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 16px"}}>
        <Card style={{marginBottom:20,minHeight:120,display:"flex",alignItems:"center"}}>
          <p style={{fontSize:16,fontWeight:700,color:"#1E1B4B",lineHeight:1.7}}>{q.q}</p>
        </Card>
        <div style={{display:"grid",gap:10,marginBottom:16}}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>answer(i)} style={{
              padding:"14px 16px",borderRadius:12,border:`2px solid ${answers[idx]===undefined?"#E5E7EB":q.correct.includes(i)?"#10B981":answers[idx]===i?"#EF4444":"#E5E7EB"}`,
              background:answers[idx]===undefined?"white":q.correct.includes(i)?"#DCFCE7":answers[idx]===i?"#FEE2E2":"white",
              cursor:"pointer",fontFamily:"Tajawal",fontSize:14,textAlign:"right",transition:"all .3s"
            }}>{opt}</button>
          ))}
        </div>
        {answers[idx]!==undefined&&<Btn onClick={next} color="#374151" style={{width:"100%"}}>{idx<questions.length-1?"السؤال التالي":"إنهاء المقياس"}</Btn>}
      </div>
    </div>
  );
}

/* ═══ MISSION ACTIVITY ═══ */
function MissionActivity({nav}){
  const{addPoints,go,userData}=nav;
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[commitment,setCommitment]=useState("");
  const[done,setDone]=useState(false);

  const steps=[
    {type:"scenario",title:"اختاري الموقف",content:"زميلتان تتشاجران في الفناء. ما دورك كسفيرة تسامح؟",opts:["أتجاهل الأمر","أصوّر الشجار","أحاول الوساطة والإصلاح","أنضم لأحدهن"],correct:2},
    {type:"feelings",title:"تحديد المشاعر",content:"الطالبة التي شعرت بالإقصاء من المجموعة تشعر بـ:",opts:["الفرح","الحزن والوحدة","عدم الاكتراث","الغضب والرغبة في الانتقام"],correct:1},
    {type:"phrase",title:"اختاري عبارة الحوار",content:"أفضل طريقة لبدء الحل:",opts:["أنتِ مخطئة","لنسمع كل آراءنا ونجد حلاً يرضي الجميع","هذا لا يعنيني","من أخطأ فلتعتذر فوراً"],correct:1},
    {type:"steps",title:"ترتيب خطوات الحل",content:"رتّبي هذه الخطوات:\n1. أتوقف وأهدأ\n2. أستمع للطرفين\n3. أقترح حلاً\nالترتيب الصحيح هو:",opts:["3-1-2","2-3-1","1-2-3","3-2-1"],correct:2},
    {type:"commitment",title:"تعهدي الشخصي",content:"اكتبي تعهداً شخصياً بممارسة التسامح"},
  ];

  const currStep=steps[step];

  const answer=(i)=>{
    if(answers[step]!==undefined)return;
    setAnswers(a=>({...a,[step]:i}));
  };

  const next=()=>{
    if(step<steps.length-1)setStep(s=>s+1);
    else{
      if(!userData.completedActivities?.includes("mission"))addPoints(100,"mission","ambassador");
      setDone(true);
    }
  };

  if(done)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1E1B4B,#312E81,#4C1D95)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:500,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:80,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🏅</div>
        <div style={{background:"rgba(255,255,255,0.15)",borderRadius:24,padding:32,color:"white",backdropFilter:"blur(10px)"}}>
          <h2 style={{fontFamily:"Cairo,sans-serif",fontSize:28,fontWeight:900,marginBottom:8}}>سفيرة التسامح!</h2>
          <p style={{opacity:.85,fontSize:15,marginBottom:20,lineHeight:1.7}}>أتممتِ مهمة سفيرة التسامح بنجاح! أنتِ الآن سفيرة حقيقية للسلام والتسامح في مدرستك ومجتمعك.</p>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:16,padding:20,marginBottom:20}}>
            <div style={{fontSize:13,opacity:.7,marginBottom:4}}>شهادة إتمام رحلة التسامح</div>
            <div style={{fontSize:20,fontWeight:800}}>{nav.user?.name}</div>
            <div style={{fontSize:13,opacity:.7,marginTop:4}}>{new Date().toLocaleDateString("ar-SA")}</div>
          </div>
          <Btn onClick={()=>go("home")} color="white" style={{color:"#7C3AED",width:"100%"}}>العودة للرئيسية 🏠</Btn>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#FFFBEB"}}>
      <div style={{background:"linear-gradient(135deg,#78350F,#D97706)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("activities")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الأنشطة</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:22,fontWeight:900}}>🏅 مهمة سفيرة التسامح</h1>
        <p style={{opacity:.8,fontSize:13}}>خطوة {step+1} من {steps.length}</p>
        <ProgressBar value={step+1} max={steps.length} color="white"/>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 16px"}}>
        <Card style={{marginBottom:16,borderRight:"4px solid #D97706"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#D97706",marginBottom:8}}>{currStep.title}</div>
          <p style={{fontSize:15,color:"#374151",lineHeight:1.7,whiteSpace:"pre-line"}}>{currStep.content}</p>
        </Card>

        {currStep.type!=="commitment"?(
          <div style={{display:"grid",gap:10,marginBottom:16}}>
            {currStep.opts.map((opt,i)=>(
              <button key={i} onClick={()=>answer(i)} style={{
                padding:"14px 16px",borderRadius:12,cursor:"pointer",fontFamily:"Tajawal",fontSize:14,textAlign:"right",transition:"all .3s",border:"2px solid",
                borderColor:answers[step]===undefined?"#E5E7EB":currStep.correct===i?"#10B981":answers[step]===i?"#EF4444":"#E5E7EB",
                background:answers[step]===undefined?"white":currStep.correct===i?"#DCFCE7":answers[step]===i?"#FEE2E2":"white",
              }}>{opt}</button>
            ))}
          </div>
        ):(
          <div style={{marginBottom:16}}>
            <textarea value={commitment} onChange={e=>setCommitment(e.target.value)} placeholder="أتعهد بأن... مثال: أتعهد بأن أرحب بالطالبات الجديدات وأدافع عنهن عند الحاجة" style={{width:"100%",padding:"12px 16px",border:"2px solid #E5E7EB",borderRadius:12,fontSize:14,fontFamily:"Tajawal",outline:"none",resize:"vertical",minHeight:120,lineHeight:1.7}}/>
          </div>
        )}

        {(answers[step]!==undefined||currStep.type==="commitment")&&(
          <Btn onClick={next} color="#D97706" style={{width:"100%",color:"white"}} disabled={currStep.type==="commitment"&&commitment.length<10}>
            {step<steps.length-1?"الخطوة التالية ←":"أكملتُ المهمة! 🏅"}
          </Btn>
        )}
      </div>
    </div>
  );
}

/* ═══ PASSPORT SCREEN ═══ */
function PassportScreen({nav}){
  const{user,userData,go}=nav;
  const stamps=userData.passportStamps||[];
  const badges=userData.badges||[];
  const pts=userData.pts||0;

  return(
    <div style={{minHeight:"100vh",background:"#F5F3FF"}}>
      <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الرئيسية</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:24,fontWeight:900}}>🗺️ جواز سفر التسامح</h1>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"20px 16px"}}>
        {/* Passport Design */}
        <div style={{background:"linear-gradient(135deg,#1E3A5F,#0F2744)",borderRadius:24,padding:32,color:"white",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-40,right:-40,width:150,height:150,background:"rgba(255,255,255,0.05)",borderRadius:"50%"}}/>
          <div style={{position:"absolute",bottom:-30,left:-30,width:120,height:120,background:"rgba(255,255,255,0.05)",borderRadius:"50%"}}/>
          <div style={{textAlign:"center",marginBottom:20,position:"relative"}}>
            <div style={{fontSize:60,marginBottom:8}}>{user?.avatar||"🌟"}</div>
            <h2 style={{fontSize:20,fontWeight:900,marginBottom:4}}>{user?.name}</h2>
            <div style={{fontSize:13,opacity:.7}}>مدرسة ملهم الابتدائية • الصف الثالث</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:12,textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:"#F59E0B"}}>{pts}</div>
              <div style={{fontSize:12,opacity:.7}}>نقطة</div>
            </div>
            <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:12,textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:"#10B981"}}>{badges.length}</div>
              <div style={{fontSize:12,opacity:.7}}>شارة</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:12,textAlign:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>{getLevelName(pts)}</div>
            <div style={{fontSize:12,opacity:.7}}>مستواكِ الحالي</div>
          </div>
        </div>

        {/* Stamps */}
        {stamps.length>0&&(
          <Card style={{marginBottom:20}}>
            <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🔖 أختام الرحلة</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {stamps.map((s,i)=>{
                const act=ACTIVITIES.find(a=>a.id===s.act);
                return act?(
                  <div key={i} style={{background:act.bg,border:`2px solid ${act.color}`,borderRadius:12,padding:"8px 12px",textAlign:"center",animation:"stampIn .5s ease"}}>
                    <div style={{fontSize:24}}>{act.icon}</div>
                    <div style={{fontSize:11,color:act.color,fontWeight:700,marginTop:2}}>{s.date}</div>
                  </div>
                ):null;
              })}
            </div>
          </Card>
        )}

        {/* Badges */}
        {badges.length>0&&(
          <Card style={{marginBottom:20}}>
            <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🏅 شاراتي المكتسبة</h3>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {badges.map(b=><Badge key={b} badge={b}/>)}
            </div>
          </Card>
        )}

        {/* All Badges Preview */}
        <Card>
          <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🎯 جميع الشارات</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {BADGES.map(b=>{
              const earned=badges.includes(b.id);
              return(
                <div key={b.id} style={{textAlign:"center",opacity:earned?1:.3}}>
                  <div style={{fontSize:32,filter:earned?"none":"grayscale(100%)"}}>{b.icon}</div>
                  <div style={{fontSize:10,color:earned?b.color:"#9CA3AF",fontWeight:700,marginTop:4,lineHeight:1.3}}>{b.name}</div>
                  {earned&&<div style={{fontSize:10,color:"#10B981",marginTop:2}}>✓</div>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══ LEADERBOARD SCREEN ═══ */
function LeaderboardScreen({nav}){
  const{user,userData,go}=nav;
  const myEntry={name:user?.name||"أنتِ",pts:userData?.pts||0,acts:userData?.completedActivities?.length||0,badges:userData?.badges||[],level:getLevelNum(userData?.pts||0),avatar:user?.avatar||"🌟",isMe:true};
  const combined=[...DEMO_STUDENTS,myEntry].sort((a,b)=>b.pts-a.pts);

  return(
    <div style={{minHeight:"100vh",background:"#FFFBEB"}}>
      <div style={{background:"linear-gradient(135deg,#78350F,#F59E0B)",padding:"20px 16px 30px",color:"white"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,fontFamily:"Tajawal",marginBottom:8}}>← الرئيسية</button>
        <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:24,fontWeight:900}}>🏆 لوحة الصدارة</h1>
        <p style={{opacity:.8,fontSize:13}}>{combined.length} طالبة مشاركة</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
        {/* Top 3 */}
        <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"flex-end",justifyContent:"center"}}>
          {[combined[1],combined[0],combined[2]].map((s,i)=>{
            const h=[90,110,80][i];
            const medal=["🥈","🥇","🥉"][i];
            const bg=["#9CA3AF","#F59E0B","#D97706"][i];
            return s?(
              <div key={i} style={{flex:1,textAlign:"center",background:"white",borderRadius:16,padding:"12px 8px",border:`3px solid ${bg}`}}>
                <div style={{fontSize:24,marginBottom:4}}>{medal}</div>
                <div style={{fontSize:28,marginBottom:4}}>{s.avatar}</div>
                <div style={{fontSize:13,fontWeight:800,color:"#1E1B4B",marginBottom:2}}>{s.name?.split(" ")[0]||s.name}</div>
                <div style={{fontSize:18,fontWeight:900,color:bg}}>{s.pts}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>نقطة</div>
                {s.isMe&&<div style={{fontSize:11,color:"#8B5CF6",fontWeight:700,marginTop:2}}>أنتِ ⬆️</div>}
              </div>
            ):null;
          })}
        </div>

        {/* Full List */}
        <div style={{display:"grid",gap:8}}>
          {combined.map((s,i)=>(
            <Card key={i} style={{
              padding:"14px 16px",display:"flex",alignItems:"center",gap:12,
              background:s.isMe?"linear-gradient(135deg,#EDE9FE,#FCE7F3)":i<3?"#FFFBEB":"white",
              border:s.isMe?"2px solid #8B5CF6":i<3?"2px solid #F59E0B":"1px solid #E5E7EB"
            }}>
              <div style={{width:32,height:32,borderRadius:"50%",background:["#F59E0B","#9CA3AF","#D97706"][i]||"#E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"white",fontSize:14,flexShrink:0}}>
                {i+1}
              </div>
              <div style={{fontSize:28}}>{s.avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:"#1E1B4B"}}>{s.name}{s.isMe&&" 👈"}</div>
                <div style={{fontSize:12,color:"#6B7280"}}>المستوى {s.level||getLevelNum(s.pts)} • {s.acts||0} نشاط • {s.badges?.length||0} شارة</div>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontWeight:900,fontSize:16,color:"#F59E0B"}}>{s.pts}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>نقطة</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ TEACHER SCREEN ═══ */
function TeacherScreen({nav,setIsTeacher}){
  const{go}=nav;
  const[tab,setTab]=useState("overview");

  const logout=()=>{LS.del("rtTeacher");setIsTeacher(false);go("login");};

  const stats={
    students:DEMO_STUDENTS.length+1,
    active:DEMO_STUDENTS.length-1,
    activities:47,
    avgPts:Math.round(DEMO_STUDENTS.reduce((s,d)=>s+d.pts,0)/DEMO_STUDENTS.length),
    messages:PEACE_MESSAGES.length+(LS.get("rtMessages")||[]).length,
    badges:DEMO_STUDENTS.reduce((s,d)=>s+d.badges.length,0),
  };

  const actCompletions=ACTIVITIES.map(a=>({
    name:a.title,icon:a.icon,
    count:Math.floor(Math.random()*stats.students),
    pct:Math.floor(Math.random()*80+20)
  }));

  return(
    <div style={{minHeight:"100vh",background:"#F8FAFC"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1E1B4B,#312E81)",padding:"20px 16px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{fontFamily:"Cairo,sans-serif",fontSize:20,fontWeight:900}}>👩‍🏫 لوحة تحكم المعلمة</h1>
            <p style={{fontSize:13,opacity:.7}}>المعلمة نوف الدوسري • مدرسة ملهم الابتدائية</p>
          </div>
          <button onClick={logout} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"8px 14px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:13}}>تسجيل الخروج</button>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16,overflowX:"auto"}}>
          {["overview","students","activities","reports"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"8px 16px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:"Tajawal",fontSize:13,fontWeight:700,flexShrink:0,
              background:tab===t?"white":"rgba(255,255,255,0.15)",color:tab===t?"#312E81":"white"
            }}>
              {t==="overview"?"نظرة عامة":t==="students"?"الطالبات":t==="activities"?"الأنشطة":"التقارير"}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="overview"&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              {[
                {label:"الطالبات المسجلات",value:stats.students,icon:"👩",color:"#8B5CF6"},
                {label:"الطالبات النشطات",value:stats.active,icon:"✅",color:"#10B981"},
                {label:"الأنشطة المكتملة",value:stats.activities,icon:"🎯",color:"#3B82F6"},
                {label:"متوسط النقاط",value:stats.avgPts,icon:"🌟",color:"#F59E0B"},
                {label:"رسائل السلام",value:stats.messages,icon:"✉️",color:"#EC4899"},
                {label:"الشارات الممنوحة",value:stats.badges,icon:"🏅",color:"#D97706"},
              ].map((s,i)=>(
                <Card key={i} style={{padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontSize:28,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:12,color:"#6B7280"}}>{s.label}</div>
                </Card>
              ))}
            </div>

            <Card style={{marginBottom:20}}>
              <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>📊 مؤشر القياس القبلي / البعدي</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <div style={{fontSize:13,color:"#6B7280",marginBottom:8}}>متوسط القياس القبلي</div>
                  <div style={{fontSize:28,fontWeight:900,color:"#EF4444"}}>62%</div>
                  <ProgressBar value={62} max={100} color="#EF4444"/>
                </div>
                <div>
                  <div style={{fontSize:13,color:"#6B7280",marginBottom:8}}>متوسط القياس البعدي</div>
                  <div style={{fontSize:28,fontWeight:900,color:"#10B981"}}>84%</div>
                  <ProgressBar value={84} max={100} color="#10B981"/>
                </div>
              </div>
              <div style={{background:"#ECFDF5",borderRadius:12,padding:12,marginTop:16,textAlign:"center"}}>
                <span style={{color:"#065F46",fontWeight:700,fontSize:15}}>📈 نسبة التحسن: +22% في مهارات التسامح</span>
              </div>
            </Card>

            <Card>
              <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:16}}>🏅 توزيع الشارات</h3>
              <div style={{display:"grid",gap:8}}>
                {BADGES.map((b,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:20,flexShrink:0}}>{b.icon}</span>
                    <span style={{fontSize:13,flex:1,color:"#374151"}}>{b.name}</span>
                    <div style={{width:120}}>
                      <ProgressBar value={Math.floor(Math.random()*stats.students)} max={stats.students} color={b.color}/>
                    </div>
                    <span style={{fontSize:12,color:"#6B7280",minWidth:40,textAlign:"left"}}>{Math.floor(Math.random()*stats.students)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab==="students"&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{display:"grid",gap:10}}>
              {DEMO_STUDENTS.map((s,i)=>(
                <Card key={i} style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:28}}>{s.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:14,color:"#1E1B4B",marginBottom:2}}>{s.name}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {s.badges.map(b=>{
                          const badge=BADGES.find(x=>x.id===b);
                          return badge?<span key={b} style={{fontSize:11,background:badge.color+"20",color:badge.color,borderRadius:20,padding:"2px 8px",fontWeight:700}}>{badge.icon} {badge.name}</span>:null;
                        })}
                      </div>
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontWeight:900,fontSize:16,color:"#F59E0B"}}>{s.pts}</div>
                      <div style={{fontSize:11,color:"#9CA3AF"}}>{s.acts} نشاط</div>
                    </div>
                  </div>
                  <div style={{marginTop:8}}>
                    <ProgressBar value={s.acts} max={ACTIVITIES.length} color="#8B5CF6" label={`التقدم: ${s.acts}/${ACTIVITIES.length}`}/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab==="activities"&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{display:"grid",gap:10}}>
              {ACTIVITIES.map((a,i)=>(
                <Card key={i} style={{padding:"14px 16px",background:a.bg}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:28}}>{a.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14,color:a.color,marginBottom:4}}>{a.title}</div>
                      <ProgressBar value={Math.floor(Math.random()*stats.students)} max={stats.students} color={a.color}/>
                    </div>
                    <div style={{textAlign:"left",minWidth:50}}>
                      <div style={{fontWeight:900,color:a.color}}>{Math.floor(Math.random()*80+20)}%</div>
                      <div style={{fontSize:11,color:"#9CA3AF"}}>إنجاز</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab==="reports"&&(
          <div style={{animation:"fadeIn .4s ease"}}>
            <Card style={{marginBottom:16}}>
              <h3 style={{fontSize:16,fontWeight:800,color:"#1E1B4B",marginBottom:12}}>📋 تقرير التنفيذ</h3>
              <div style={{background:"#F8FAFC",borderRadius:12,padding:16,fontSize:14,lineHeight:2,color:"#374151"}}>
                <div><strong>البرنامج:</strong> رحلة التسامح</div>
                <div><strong>المعلمة:</strong> نوف الدوسري</div>
                <div><strong>المدرسة:</strong> مدرسة ملهم الابتدائية</div>
                <div><strong>الفئة:</strong> طالبات الصف الثالث</div>
                <div><strong>فترة التنفيذ:</strong> الفصل الدراسي الثالث ١٤٤٦هـ</div>
                <div><strong>عدد المشاركات:</strong> {stats.students} طالبة</div>
                <div><strong>الأنشطة المنفذة:</strong> {ACTIVITIES.length} نشاطاً</div>
                <div><strong>متوسط القياس القبلي:</strong> 62%</div>
                <div><strong>متوسط القياس البعدي:</strong> 84%</div>
                <div><strong>نسبة التحسن:</strong> <span style={{color:"#10B981",fontWeight:700}}>+22%</span></div>
                <div><strong>رسائل السلام:</strong> {stats.messages} رسالة</div>
                <div><strong>الشارات الممنوحة:</strong> {stats.badges} شارة</div>
              </div>
            </Card>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Btn onClick={()=>nav.showToast("جارٍ تحميل التقرير...","success")} color="#1D4ED8" style={{width:"100%"}}>📄 تصدير PDF</Btn>
              <Btn onClick={()=>nav.showToast("جارٍ تصدير البيانات...","success")} color="#065F46" style={{width:"100%"}}>📊 تصدير Excel</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
