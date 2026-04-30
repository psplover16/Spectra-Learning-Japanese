import{d as R,c as v,t as b,a as Ie,b as u,o as h,u as Pe,e as $,i as ce,f as x,_ as re,w as ie,g as oe,F as C,r as O,h as fn,n as Zt,j as cn,k as dn,s as U,l as ot,m as V,p as mn,q as ea,v as pn,T as hn,x as st,y as ae,z as vn,A as gn}from"./index-4htt1kQ2.js";import{_ as X,u as kt,l as yn,r as bn,a as kn,w as xn}from"./storageGuard-j5PpuaOD.js";const wn={class:"flex w-full items-center gap-2 text-sm text-ink"},_n={key:0,class:"shrink-0 font-medium"},jn=["min","value","inputmode"],Sn=R({__name:"BaseInput",props:{modelValue:{},label:{default:""},min:{default:0},inputmode:{default:"numeric"}},emits:["update:modelValue"],setup(e,{emit:t}){const a=t;return(n,r)=>(h(),v("label",wn,[e.label?(h(),v("span",_n,b(e.label),1)):Ie("",!0),u("input",{class:"w-full rounded border border-clay/20 bg-white px-2 py-[0.275rem] outline-none transition focus:border-clay",type:"number",min:e.min,value:e.modelValue,inputmode:e.inputmode,onInput:r[0]||(r[0]=o=>a("update:modelValue",o.target.value))},null,40,jn)]))}}),An={"data-testid":"practice-toolbar",class:"section-card space-y-3"},$n={class:"flex flex-wrap gap-3"},In={class:"grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"},Pn={class:"flex items-center text-xs text-ink/70"},Cn={class:"flex flex-wrap gap-3"},On={class:"flex items-center justify-between gap-2"},En={class:"flex flex-wrap gap-2"},Tn=R({__name:"PracticeToolbar",props:{hasLatestResult:{type:Boolean}},emits:["startExam","clearLatestResult"],setup(e,{emit:t}){const a=t,n=Pe(),r=n.includeHiragana,o=n.includeKatakana,i=n.enableSokuon,s=n.enableYoonChoon,l=n.showArchaicKana,f=n.questionCountInput,p=n.allKanaSelected,m=n.dakuonSelected,k=n.canStartExam,j=n.selectedKanaCount,w=n.recommendedQuestionCount;return(A,_)=>(h(),v("section",An,[u("div",$n,[$(X,{modelValue:x(r),"onUpdate:modelValue":_[0]||(_[0]=d=>ce(r)?r.value=d:null),label:"題目包含：平假名"},null,8,["modelValue"]),$(X,{modelValue:x(o),"onUpdate:modelValue":_[1]||(_[1]=d=>ce(o)?o.value=d:null),label:"題目包含：片假名"},null,8,["modelValue"]),$(X,{"data-testid":"toggle-all-kana","model-value":x(p),label:"全選／全不選","onUpdate:modelValue":x(n).toggleAllKana},null,8,["model-value","onUpdate:modelValue"]),$(X,{"model-value":x(m),label:"濁音／半濁音","onUpdate:modelValue":x(n).toggleDakuon},null,8,["model-value","onUpdate:modelValue"])]),u("div",In,[$(Sn,{"data-testid":"question-count-input",label:"題數","model-value":x(f),"onUpdate:modelValue":x(n).setQuestionCount},null,8,["model-value","onUpdate:modelValue"]),u("p",Pn," 目前勾選 "+b(x(j))+" 個假名，依範圍建議 "+b(x(w))+" 題。 ",1)]),u("div",Cn,[$(X,{modelValue:x(i),"onUpdate:modelValue":_[2]||(_[2]=d=>ce(i)?i.value=d:null),label:"促音"},null,8,["modelValue"]),$(X,{modelValue:x(s),"onUpdate:modelValue":_[3]||(_[3]=d=>ce(s)?s.value=d:null),label:"拗音／合拗音／長音符"},null,8,["modelValue"])]),u("div",null,[$(X,{modelValue:x(l),"onUpdate:modelValue":_[4]||(_[4]=d=>ce(l)?l.value=d:null),label:"古語假名"},null,8,["modelValue"])]),u("div",On,[u("div",En,[$(re,{"data-testid":"start-exam-button",variant:"primary",disabled:!x(k),onClick:_[5]||(_[5]=d=>a("startExam"))},{default:ie(()=>[..._[7]||(_[7]=[oe(" 送出 ",-1)])]),_:1},8,["disabled"]),$(re,{variant:"secondary",onClick:x(n).resetAll},{default:ie(()=>[..._[8]||(_[8]=[oe("重置",-1)])]),_:1},8,["onClick"])]),$(re,{"data-testid":"toolbar-clear-result-button",variant:"ghost",disabled:!e.hasLatestResult,onClick:_[6]||(_[6]=d=>a("clearLatestResult"))},{default:ie(()=>[..._[9]||(_[9]=[oe(" 清除結果 ",-1)])]),_:1},8,["disabled"])])]))}}),Fn={class:"section-card space-y-2"},Nn={class:"table-shell"},Rn={"data-testid":"practice-seion-table",class:"fixed-grid-table practice-kana-table"},Ln=["onClick"],Mn=["checked"],Dn={class:"kana-header border-b border-clay/10 px-1 py-2"},zn=["onClick"],Un=["checked"],Wn=["onClick"],Kn=["checked"],Bn={class:"practice-kana-text-stack"},Yn={class:"practice-kana-main-text font-semibold"},Vn={class:"practice-kana-romaji-text text-ink/70"},Hn={key:1,class:"practice-kana-placeholder flex min-h-[58px] items-center justify-center whitespace-nowrap text-ink/40"},Gn=R({__name:"SeionTable",setup(e){const t=Pe();function a(i){return i.archaic===!0&&!t.showArchaicKana.value}function n(i,s,l){return l?.id??`${i}-${s}`}function r(i){t.toggleKana(i,!t.isKanaChecked(i.id))}function o(i){return`${i.hiragana} / ${i.katakana}`}return(i,s)=>(h(),v("section",Fn,[s[1]||(s[1]=u("div",{class:"flex items-center justify-between gap-2"},[u("h2",{class:"text-sm font-semibold text-ink"},"清音")],-1)),u("div",Nn,[u("table",Rn,[u("thead",null,[u("tr",null,[s[0]||(s[0]=u("th",{class:"kana-header border-b border-clay/15 px-1 py-2"},"行／段",-1)),(h(!0),v(C,null,O(x(fn),l=>(h(),v("th",{key:l.key,class:"kana-header border-b border-l border-clay/15 px-1 py-2"},[u("button",{type:"button",class:"practice-kana-header-button flex w-full flex-col items-center justify-center gap-1 whitespace-nowrap",onClick:f=>x(t).toggleColumn(l.key,!x(t).isColumnChecked(l.key))},[u("input",{class:"pointer-events-none h-3.5 w-3.5",type:"checkbox",checked:x(t).isColumnChecked(l.key)},null,8,Mn),u("span",null,b(l.label),1)],8,Ln)]))),128))])]),u("tbody",null,[(h(!0),v(C,null,O(x(cn),l=>(h(),v("tr",{key:l.rowKey},[u("th",Dn,[u("button",{type:"button",class:"practice-kana-header-button flex w-full flex-col items-center justify-center gap-1 whitespace-nowrap",onClick:f=>x(t).toggleRow(l.rowKey,!x(t).isRowChecked(l.rowKey))},[u("input",{class:"pointer-events-none h-3.5 w-3.5",type:"checkbox",checked:x(t).isRowChecked(l.rowKey)},null,8,Un),u("span",null,b(l.label),1)],8,zn)]),(h(!0),v(C,null,O(l.cells,(f,p)=>(h(),v("td",{key:n(l.rowKey,p,f),class:Zt(["border-b border-l border-clay/10 p-1 align-middle text-center",f&&x(t).isKanaChecked(f.id)?"kana-cell-selected":""])},[f&&!a(f)?(h(),v("button",{key:0,type:"button",class:"practice-kana-button flex min-h-[58px] w-full flex-col items-center justify-center gap-1 whitespace-nowrap",onClick:m=>f.selectable===!1?void 0:r(f)},[f.selectable!==!1?(h(),v("input",{key:0,class:"pointer-events-none h-3.5 w-3.5",type:"checkbox",checked:x(t).isKanaChecked(f.id)},null,8,Kn)):Ie("",!0),u("div",Bn,[u("div",Yn,b(o(f)),1),u("div",Vn,b(f.romaji),1)])],8,Wn)):(h(),v("div",Hn," - "))],2))),128))]))),128))])])])]))}}),qn={class:"section-card space-y-2"},Xn={class:"table-shell"},Jn={"data-testid":"practice-dakuon-table",class:"fixed-grid-table practice-kana-table"},Qn=["onClick"],Zn=["checked"],er={class:"practice-kana-text-stack"},tr={class:"practice-kana-main-text font-semibold"},ar={class:"practice-kana-romaji-text text-ink/70"},nr={key:1,class:"practice-kana-placeholder flex min-h-[58px] items-center justify-center whitespace-nowrap text-ink/40"},rr=R({__name:"DakuonTable",setup(e){const t=Pe();function a(r,o,i){return i?.id??`${r}-${o}`}function n(r){t.toggleKana(r,!t.isKanaChecked(r.id))}return(r,o)=>(h(),v("section",qn,[o[0]||(o[0]=u("div",{class:"flex items-center justify-between gap-2"},[u("h2",{class:"text-sm font-semibold text-ink"},"濁音／半濁音")],-1)),u("div",Xn,[u("table",Jn,[u("tbody",null,[(h(!0),v(C,null,O(x(dn),i=>(h(),v("tr",{key:i.rowKey},[(h(!0),v(C,null,O(i.cells,(s,l)=>(h(),v("td",{key:a(i.rowKey,l,s),class:Zt(["border-b border-l border-clay/10 p-1 align-middle text-center",s&&x(t).isKanaChecked(s.id)?"kana-cell-selected":""])},[s?(h(),v("button",{key:0,type:"button",class:"practice-kana-button flex min-h-[58px] w-full flex-col items-center justify-center gap-1 whitespace-nowrap",onClick:f=>n(s)},[u("input",{class:"pointer-events-none h-3.5 w-3.5",type:"checkbox",checked:x(t).isKanaChecked(s.id)},null,8,Zn),u("div",er,[u("div",tr,b(s.hiragana)+" / "+b(s.katakana),1),u("div",ar,b(s.romaji),1)])],8,Qn)):(h(),v("div",nr," - "))],2))),128))]))),128))])])])]))}}),ir=[{label:"ん / ン",values:["さんぽ（sanpo）：散步","しんぶん（shinbun）：報紙","てんき（tenki）：天氣"]}],or=[{label:"っ / ッ",values:["がっこう（gakkou）：學校","きって（kitte）：郵票","ざっし（zasshi）：雜誌"]}],ta=[{key:"ya",kana:"や / ヤ",romaji:"ya"},{key:"yu",kana:"ゆ / ユ",romaji:"yu"},{key:"yo",kana:"よ / ヨ",romaji:"yo"}],sr=[{header:{key:"ki",kana:"き / キ",romaji:"ki"},cells:[{kana:"きゃ / キャ",romaji:"kya"},{kana:"きゅ / キュ",romaji:"kyu"},{kana:"きょ / キョ",romaji:"kyo"}]},{header:{key:"shi",kana:"し / シ",romaji:"shi"},cells:[{kana:"しゃ / シャ",romaji:"sha"},{kana:"しゅ / シュ",romaji:"shu"},{kana:"しょ / ショ",romaji:"sho"}]},{header:{key:"chi",kana:"ち / チ",romaji:"chi"},cells:[{kana:"ちゃ / チャ",romaji:"cha"},{kana:"ちゅ / チュ",romaji:"chu"},{kana:"ちょ / チョ",romaji:"cho"}]},{header:{key:"ni",kana:"に / ニ",romaji:"ni"},cells:[{kana:"にゃ / ニャ",romaji:"nya"},{kana:"にゅ / ニュ",romaji:"nyu"},{kana:"にょ / ニョ",romaji:"nyo"}]},{header:{key:"hi",kana:"ひ / ヒ",romaji:"hi"},cells:[{kana:"ひゃ / ヒャ",romaji:"hya"},{kana:"ひゅ / ヒュ",romaji:"hyu"},{kana:"ひょ / ヒョ",romaji:"hyo"}]},{header:{key:"mi",kana:"み / ミ",romaji:"mi"},cells:[{kana:"みゃ / ミャ",romaji:"mya"},{kana:"みゅ / ミュ",romaji:"myu"},{kana:"みょ / ミョ",romaji:"myo"}]},{header:{key:"ri",kana:"り / リ",romaji:"ri"},cells:[{kana:"りゃ / リャ",romaji:"rya"},{kana:"りゅ / リュ",romaji:"ryu"},{kana:"りょ / リョ",romaji:"ryo"}]}],lr=[{header:{key:"gi",kana:"ぎ / ギ",romaji:"gi"},cells:[{kana:"ぎゃ / ギャ",romaji:"gya"},{kana:"ぎゅ / ギュ",romaji:"gyu"},{kana:"ぎょ / ギョ",romaji:"gyo"}]},{header:{key:"ji",kana:"じ / ジ",romaji:"ji"},cells:[{kana:"じゃ / ジャ",romaji:"ja"},{kana:"じゅ / ジュ",romaji:"ju"},{kana:"じょ / ジョ",romaji:"jo"}]},{header:{key:"bi",kana:"び / ビ",romaji:"bi"},cells:[{kana:"びゃ / ビャ",romaji:"bya"},{kana:"びゅ / ビュ",romaji:"byu"},{kana:"びょ / ビョ",romaji:"byo"}]},{header:{key:"pi",kana:"ぴ / ピ",romaji:"pi"},cells:[{kana:"ぴゃ / ピャ",romaji:"pya"},{kana:"ぴゅ / ピュ",romaji:"pyu"},{kana:"ぴょ / ピョ",romaji:"pyo"}]}],ur=[{key:"a",kana:"ア",romaji:"a"},{key:"i",kana:"イ",romaji:"i"},{key:"u",kana:"ウ",romaji:"u"},{key:"e",kana:"エ",romaji:"e"},{key:"o",kana:"オ",romaji:"o"}],fr=[{header:{key:"f",kana:"フ系",romaji:"f"},cells:[{kana:"ファ",romaji:"fa"},{kana:"フィ",romaji:"fi"},{kana:"フ",romaji:"fu"},{kana:"フェ",romaji:"fe"},{kana:"フォ",romaji:"fo"}]},{header:{key:"v",kana:"ヴ系",romaji:"v"},cells:[{kana:"ヴァ",romaji:"va"},{kana:"ヴィ",romaji:"vi"},{kana:"ヴ",romaji:"vu"},{kana:"ヴェ",romaji:"ve"},{kana:"ヴォ",romaji:"vo"}]},{header:{key:"ty",kana:"ティ系",romaji:"ty"},cells:[{kana:"テャ",romaji:"tya"},{kana:"ティ",romaji:"ti"},{kana:"テュ",romaji:"tyu"},{kana:"テェ",romaji:"tye"},{kana:"テョ",romaji:"tyo"}]},{header:{key:"dy",kana:"ディ系",romaji:"dy"},cells:[{kana:"デャ",romaji:"dya"},{kana:"ディ",romaji:"di"},{kana:"デュ",romaji:"dyu"},{kana:"デェ",romaji:"dye"},{kana:"デョ",romaji:"dyo"}]},{header:{key:"t",kana:"ト系",romaji:"t"},cells:[{kana:"-",available:!1},{kana:"ティ",romaji:"ti"},{kana:"トゥ",romaji:"tu"},{kana:"-",available:!1},{kana:"-",available:!1}]},{header:{key:"sh",kana:"シ系",romaji:"sh"},cells:[{kana:"シャ",romaji:"sha"},{kana:"シィ",romaji:"shi"},{kana:"シュ",romaji:"shu"},{kana:"シェ",romaji:"she"},{kana:"ショ",romaji:"sho"}]},{header:{key:"j",kana:"ジ系",romaji:"j"},cells:[{kana:"ジャ",romaji:"ja"},{kana:"ジィ",romaji:"ji"},{kana:"ジュ",romaji:"ju"},{kana:"ジェ",romaji:"je"},{kana:"ジョ",romaji:"jo"}]},{header:{key:"ch",kana:"チェ系",romaji:"ch"},cells:[{kana:"チャ",romaji:"cha"},{kana:"チィ",romaji:"chi"},{kana:"チュ",romaji:"chu"},{kana:"チェ",romaji:"che"},{kana:"チョ",romaji:"cho"}]},{header:{key:"ts",kana:"ツ系",romaji:"ts"},cells:[{kana:"ツァ",romaji:"tsa"},{kana:"ツィ",romaji:"tsi"},{kana:"ツ",romaji:"tsu"},{kana:"ツェ",romaji:"tse"},{kana:"ツォ",romaji:"tso"}]},{header:{key:"w",kana:"ウ系",romaji:"w"},cells:[{kana:"ワ",romaji:"wa"},{kana:"ウィ",romaji:"wi"},{kana:"ウ",romaji:"wu"},{kana:"ウェ",romaji:"we"},{kana:"ウォ",romaji:"wo"}]}],cr=[{id:"loanword-rule",kind:"rule",groupTitle:"外來語通常使用長音符ー",ruleText:"片假名借詞常用長音符拉長母音，閱讀時可直接把前一個母音延長。"},{id:"loanword-example-1",kind:"example",groupTitle:"外來語通常使用長音符ー",example:{kana:"ケーキ",romaji:"keki",translation:"蛋糕"}},{id:"loanword-example-2",kind:"example",groupTitle:"外來語通常使用長音符ー",example:{kana:"スーパー",romaji:"supa",translation:"超市"}},{id:"loanword-example-3",kind:"example",groupTitle:"外來語通常使用長音符ー",example:{kana:"コーヒー",romaji:"kohi",translation:"咖啡"}},{id:"ei-rule",kind:"rule",groupTitle:"え段假名 + い",ruleText:"很多字會以 え段假名接 い 來表示長音，讀音通常把 e 音拉長。"},{id:"ei-example-1",kind:"example",groupTitle:"え段假名 + い",example:{kana:"せんせい",romaji:"sensei",translation:"老師"}},{id:"ei-example-2",kind:"example",groupTitle:"え段假名 + い",example:{kana:"えいが",romaji:"eiga",translation:"電影"}},{id:"ei-example-3",kind:"example",groupTitle:"え段假名 + い",example:{kana:"とけい",romaji:"tokei",translation:"手錶"}},{id:"ou-rule",kind:"rule",groupTitle:"お段假名 + う",ruleText:"很多字會以 お段假名接 う 表示長音，讀音通常把 o 音拉長。"},{id:"ou-example-1",kind:"example",groupTitle:"お段假名 + う",example:{kana:"とうきょう",romaji:"toukyou",translation:"東京"}},{id:"ou-example-2",kind:"example",groupTitle:"お段假名 + う",example:{kana:"がっこう",romaji:"gakkou",translation:"學校"}},{id:"ou-example-3",kind:"example",groupTitle:"お段假名 + う",example:{kana:"どうぶつ",romaji:"doubutsu",translation:"動物"}},{id:"same-vowel-rule",kind:"rule",groupTitle:"同一母音連續",ruleText:"有些字直接讓同一母音連續出現，閱讀時也要把母音自然拉長。"},{id:"same-vowel-example-1",kind:"example",groupTitle:"同一母音連續",example:{kana:"おおきい",romaji:"ookii",translation:"大的"}},{id:"same-vowel-example-2",kind:"example",groupTitle:"同一母音連續",example:{kana:"にいさん",romaji:"niisan",translation:"哥哥"}},{id:"same-vowel-example-3",kind:"example",groupTitle:"同一母音連續",example:{kana:"ちいさい",romaji:"chiisai",translation:"小的"}},{id:"au-rule",kind:"rule",groupTitle:"あ段 + う 不一定屬於規則長音",ruleText:"看到 a 段接 う 時，不要直接當成長音；有些詞其實是兩個音節或歷史假名遣。"},{id:"au-example-1",kind:"example",groupTitle:"あ段 + う 不一定屬於規則長音",example:{kana:"あう",romaji:"au",translation:"相遇"}},{id:"au-example-2",kind:"example",groupTitle:"あ段 + う 不一定屬於規則長音",example:{kana:"うたう",romaji:"utau",translation:"歌唱"}},{id:"au-example-3",kind:"example",groupTitle:"あ段 + う 不一定屬於規則長音",example:{kana:"かう",romaji:"kau",translation:"買（歷史假名遣）"}}],dr=[{kana:"ゔ / ヴ",romaji:"vu",description:"主要出現在外來語與近代記音，日常詞彙中不常見。"},{kana:"を / ヲ",romaji:"wo",description:"現代日語多作助詞使用，實際發音常接近 o。"},{kana:"ぢ / ヂ、づ / ヅ",romaji:"di / du",description:"常見於連濁或固定詞，現代拼寫與讀音需搭配單字一起記。"}],mr={class:"section-card space-y-2"},pr={class:"table-shell"},hr={class:"content-fit-table text-sm"},vr={class:"whitespace-nowrap border-b border-clay/10 px-2 py-2 text-center font-semibold text-ink"},gr={class:"border-b border-l border-clay/10 px-2 py-2 text-center text-ink/80"},yr={class:"space-y-1"},br=R({__name:"HatsuonSection",setup(e){return(t,a)=>(h(),v("section",mr,[a[0]||(a[0]=u("h2",{class:"text-sm font-semibold text-ink"},"撥音的發音規則：通常會依後方音節自然轉成接近鼻音的發音。",-1)),u("div",pr,[u("table",hr,[u("tbody",null,[(h(!0),v(C,null,O(x(ir),n=>(h(),v("tr",{key:n.label},[u("th",vr,b(n.label),1),u("td",gr,[u("div",yr,[(h(!0),v(C,null,O(n.values,r=>(h(),v("p",{key:r},b(r),1))),128))])])]))),128))])])])]))}}),kr={class:"section-card space-y-2"},xr={class:"table-shell"},wr={class:"content-fit-table text-sm"},_r={class:"whitespace-nowrap border-b border-clay/10 px-2 py-2 text-center font-semibold text-ink"},jr={class:"border-b border-l border-clay/10 px-2 py-2 text-center text-ink/80"},Sr={class:"space-y-1"},Ar=R({__name:"SokuonSection",setup(e){return(t,a)=>(h(),v("section",kr,[a[0]||(a[0]=u("h2",{class:"text-sm font-semibold text-ink"},"促音的發音規則：先短暫停頓，再把後面的子音清楚推出來。",-1)),u("div",xr,[u("table",wr,[u("tbody",null,[(h(!0),v(C,null,O(x(or),n=>(h(),v("tr",{key:n.label},[u("th",_r,b(n.label),1),u("td",jr,[u("div",Sr,[(h(!0),v(C,null,O(n.values,r=>(h(),v("p",{key:r},b(r),1))),128))])])]))),128))])])])]))}}),$r={class:"table-shell"},Ir={class:"fixed-grid-table practice-grid-table text-xs"},Pr={class:"practice-kana-text"},Cr={class:"practice-romaji-text"},Or={class:"practice-grid-header-cell border-b border-clay/10"},Er={class:"practice-kana-text"},Tr={class:"practice-romaji-text"},Fr={class:"practice-kana-text"},Nr={class:"practice-romaji-text"},Rr=R({__name:"SeionYoonSection",setup(e){return(t,a)=>a[0]||(U(-1,!0),(a[0]=u("section",{"data-testid":"seion-yoon-section",class:"section-card space-y-2"},[a[2]||(a[2]=u("h2",{class:"text-sm font-semibold text-ink"},"清音拗音：由 i 段假名接上小や・ゆ・よ，整體要一口氣連讀。",-1)),u("div",$r,[u("table",Ir,[u("thead",null,[u("tr",null,[a[1]||(a[1]=u("th",{class:"practice-grid-header-cell border-b border-clay/10"},null,-1)),(h(!0),v(C,null,O(x(ta),n=>(h(),v("th",{key:n.key,class:"practice-grid-header-cell border-b border-l border-clay/10"},[u("span",Pr,b(n.kana),1),u("span",Cr,b(n.romaji),1)]))),128))])]),u("tbody",null,[(h(!0),v(C,null,O(x(sr),n=>(h(),v("tr",{key:n.header.key},[u("th",Or,[u("span",Er,b(n.header.kana),1),u("span",Tr,b(n.header.romaji),1)]),(h(!0),v(C,null,O(n.cells,r=>(h(),v("td",{key:r.kana,class:"practice-grid-cell border-b border-l border-clay/10"},[u("span",Fr,b(r.kana),1),u("span",Nr,b(r.romaji),1)]))),128))]))),128))])])])])).cacheIndex=0,U(1),a[0])}}),Lr={class:"table-shell"},Mr={class:"fixed-grid-table practice-grid-table text-xs"},Dr={class:"practice-kana-text"},zr={class:"practice-romaji-text"},Ur={class:"practice-grid-header-cell border-b border-clay/10"},Wr={class:"practice-kana-text"},Kr={class:"practice-romaji-text"},Br={class:"practice-kana-text"},Yr={class:"practice-romaji-text"},Vr=R({__name:"DakuonYoonSection",setup(e){return(t,a)=>a[0]||(U(-1,!0),(a[0]=u("section",{"data-testid":"dakuon-yoon-section",class:"section-card space-y-2"},[a[2]||(a[2]=u("h2",{class:"text-sm font-semibold text-ink"},"合拗音：濁音與半濁音接上小や・ゆ・よ時，也要視為一個連續音節。",-1)),u("div",Lr,[u("table",Mr,[u("thead",null,[u("tr",null,[a[1]||(a[1]=u("th",{class:"practice-grid-header-cell border-b border-clay/10"},null,-1)),(h(!0),v(C,null,O(x(ta),n=>(h(),v("th",{key:n.key,class:"practice-grid-header-cell border-b border-l border-clay/10"},[u("span",Dr,b(n.kana),1),u("span",zr,b(n.romaji),1)]))),128))])]),u("tbody",null,[(h(!0),v(C,null,O(x(lr),n=>(h(),v("tr",{key:n.header.key},[u("th",Ur,[u("span",Wr,b(n.header.kana),1),u("span",Kr,b(n.header.romaji),1)]),(h(!0),v(C,null,O(n.cells,r=>(h(),v("td",{key:r.kana,class:"practice-grid-cell border-b border-l border-clay/10"},[u("span",Br,b(r.kana),1),u("span",Yr,b(r.romaji),1)]))),128))]))),128))])])])])).cacheIndex=0,U(1),a[0])}}),Hr={class:"table-shell"},Gr={class:"fixed-grid-table practice-grid-table text-xs"},qr={class:"practice-kana-text"},Xr={class:"practice-romaji-text"},Jr={class:"practice-grid-header-cell border-b border-clay/10"},Qr={class:"practice-kana-text"},Zr={class:"practice-romaji-text"},ei={key:0,class:"practice-placeholder-text"},ti={class:"practice-kana-text"},ai={class:"practice-romaji-text"},ni=R({__name:"LoanwordSection",setup(e){return(t,a)=>a[0]||(U(-1,!0),(a[0]=u("section",{"data-testid":"loanword-section",class:"section-card space-y-2"},[a[2]||(a[2]=u("h2",{class:"text-sm font-semibold text-ink"},"外來語擴張：片假名會用額外組合來模擬日語原本沒有的音。",-1)),u("div",Hr,[u("table",Gr,[u("thead",null,[u("tr",null,[a[1]||(a[1]=u("th",{class:"practice-grid-header-cell border-b border-clay/10"},null,-1)),(h(!0),v(C,null,O(x(ur),n=>(h(),v("th",{key:n.key,class:"practice-grid-header-cell border-b border-l border-clay/10"},[u("span",qr,b(n.kana),1),u("span",Xr,b(n.romaji),1)]))),128))])]),u("tbody",null,[(h(!0),v(C,null,O(x(fr),n=>(h(),v("tr",{key:n.header.key},[u("th",Jr,[u("span",Qr,b(n.header.kana),1),u("span",Zr,b(n.header.romaji),1)]),(h(!0),v(C,null,O(n.cells,(r,o)=>(h(),v("td",{key:`${n.header.key}-${r.romaji??`empty-${o}`}`,class:"practice-grid-cell border-b border-l border-clay/10"},[r.available===!1?(h(),v("span",ei,b(r.kana),1)):(h(),v(C,{key:1},[u("span",ti,b(r.kana),1),u("span",ai,b(r.romaji),1)],64))]))),128))]))),128))])])])])).cacheIndex=0,U(1),a[0])}}),ri={class:"table-shell"},ii={class:"content-fit-table practice-long-vowel-table text-sm"},oi={key:0,class:"practice-long-vowel-rule-row"},si={colspan:"3",class:"practice-long-vowel-rule-cell"},li={class:"font-semibold text-ink"},ui={class:"text-ink/80"},fi={key:1,class:"practice-long-vowel-example-row"},ci={class:"practice-long-vowel-cell practice-long-vowel-example-cell"},di={class:"practice-kana-text practice-long-vowel-kana-text"},mi={class:"practice-long-vowel-cell practice-long-vowel-example-cell"},pi={class:"practice-long-vowel-romaji-text"},hi={class:"practice-long-vowel-cell practice-long-vowel-example-cell"},vi={class:"practice-long-vowel-translation-text"},gi=R({__name:"ChoonRuleSection",setup(e){return(t,a)=>a[0]||(U(-1,!0),(a[0]=u("section",{"data-testid":"choon-section",class:"section-card space-y-2"},[a[1]||(a[1]=u("h2",{class:"text-sm font-semibold text-ink"},"長音規則：不同拼寫形式都在提醒同一個母音要拉長。",-1)),u("div",ri,[u("table",ii,[u("tbody",null,[(h(!0),v(C,null,O(x(cr),n=>(h(),v(C,{key:n.id},[n.kind==="rule"?(h(),v("tr",oi,[u("th",si,[u("span",li,b(n.groupTitle),1),u("span",ui,"："+b(n.ruleText),1)])])):(h(),v("tr",fi,[u("td",ci,[u("span",di,b(n.example?.kana),1)]),u("td",mi,[u("span",pi,b(n.example?.romaji),1)]),u("td",hi,[u("span",vi,b(n.example?.translation),1)])]))],64))),128))])])])])).cacheIndex=0,U(1),a[0])}}),yi={class:"section-card space-y-2"},bi={class:"table-shell"},ki={class:"content-fit-table text-sm"},xi={class:"border-b border-clay/10 px-2 py-2 text-center font-semibold text-ink"},wi={class:"text-xs text-ink/60"},_i={class:"border-b border-l border-clay/10 px-3 py-2 text-left text-ink/80"},ji=R({__name:"SpecialSyllableSection",setup(e){return(t,a)=>(h(),v("section",yi,[a[0]||(a[0]=u("h2",{class:"text-sm font-semibold text-ink"},"特殊音節",-1)),u("div",bi,[u("table",ki,[u("tbody",null,[(h(!0),v(C,null,O(x(dr),n=>(h(),v("tr",{key:n.kana},[u("th",xi,[u("div",null,b(n.kana),1),u("div",wi,b(n.romaji),1)]),u("td",_i,b(n.description),1)]))),128))])])])]))}});function Be(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}function Si(e){if(Array.isArray(e))return e}function Ai(e){if(Array.isArray(e))return Be(e)}function $i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ii(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,aa(n.key),n)}}function Pi(e,t,a){return t&&Ii(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function xe(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=lt(e))||t){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var o,i=!0,s=!1;return{s:function(){a=a.call(e)},n:function(){var l=a.next();return i=l.done,l},e:function(l){s=!0,o=l},f:function(){try{i||a.return==null||a.return()}finally{if(s)throw o}}}}function S(e,t,a){return(t=aa(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Ci(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Oi(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var n,r,o,i,s=[],l=!0,f=!1;try{if(o=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;l=!1}else for(;!(l=(n=o.call(a)).done)&&(s.push(n.value),s.length!==t);l=!0);}catch(p){f=!0,r=p}finally{try{if(!l&&a.return!=null&&(i=a.return(),Object(i)!==i))return}finally{if(f)throw r}}return s}}function Ei(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ti(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function xt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?xt(Object(a),!0).forEach(function(n){S(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):xt(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function Ce(e,t){return Si(e)||Oi(e,t)||lt(e,t)||Ei()}function D(e){return Ai(e)||Ci(e)||lt(e)||Ti()}function Fi(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function aa(e){var t=Fi(e,"string");return typeof t=="symbol"?t:t+""}function je(e){"@babel/helpers - typeof";return je=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},je(e)}function lt(e,t){if(e){if(typeof e=="string")return Be(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Be(e,t):void 0}}var wt=function(){},ut={},na={},ra=null,ia={mark:wt,measure:wt};try{typeof window<"u"&&(ut=window),typeof document<"u"&&(na=document),typeof MutationObserver<"u"&&(ra=MutationObserver),typeof performance<"u"&&(ia=performance)}catch{}var Ni=ut.navigator||{},_t=Ni.userAgent,jt=_t===void 0?"":_t,H=ut,I=na,St=ra,be=ia;H.document;var Y=!!I.documentElement&&!!I.head&&typeof I.addEventListener=="function"&&typeof I.createElement=="function",oa=~jt.indexOf("MSIE")||~jt.indexOf("Trident/"),Re,Ri=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Li=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,sa={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},Mi={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},la=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],E="classic",ve="duotone",ua="sharp",fa="sharp-duotone",ca="chisel",da="etch",ma="graphite",pa="jelly",ha="jelly-duo",va="jelly-fill",ga="notdog",ya="notdog-duo",ba="slab",ka="slab-press",xa="thumbprint",wa="utility",_a="utility-duo",ja="utility-fill",Sa="whiteboard",Di="Classic",zi="Duotone",Ui="Sharp",Wi="Sharp Duotone",Ki="Chisel",Bi="Etch",Yi="Graphite",Vi="Jelly",Hi="Jelly Duo",Gi="Jelly Fill",qi="Notdog",Xi="Notdog Duo",Ji="Slab",Qi="Slab Press",Zi="Thumbprint",eo="Utility",to="Utility Duo",ao="Utility Fill",no="Whiteboard",Aa=[E,ve,ua,fa,ca,da,ma,pa,ha,va,ga,ya,ba,ka,xa,wa,_a,ja,Sa];Re={},S(S(S(S(S(S(S(S(S(S(Re,E,Di),ve,zi),ua,Ui),fa,Wi),ca,Ki),da,Bi),ma,Yi),pa,Vi),ha,Hi),va,Gi),S(S(S(S(S(S(S(S(S(Re,ga,qi),ya,Xi),ba,Ji),ka,Qi),xa,Zi),wa,eo),_a,to),ja,ao),Sa,no);var ro={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},io={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},oo=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),so={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},$a=["fak","fa-kit","fakd","fa-kit-duotone"],At={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},lo=["kit"],uo="kit",fo="kit-duotone",co="Kit",mo="Kit Duotone";S(S({},uo,co),fo,mo);var po={kit:{"fa-kit":"fak"}},ho={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},vo={kit:{fak:"fa-kit"}},$t={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Le,ke={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},go=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],yo="classic",bo="duotone",ko="sharp",xo="sharp-duotone",wo="chisel",_o="etch",jo="graphite",So="jelly",Ao="jelly-duo",$o="jelly-fill",Io="notdog",Po="notdog-duo",Co="slab",Oo="slab-press",Eo="thumbprint",To="utility",Fo="utility-duo",No="utility-fill",Ro="whiteboard",Lo="Classic",Mo="Duotone",Do="Sharp",zo="Sharp Duotone",Uo="Chisel",Wo="Etch",Ko="Graphite",Bo="Jelly",Yo="Jelly Duo",Vo="Jelly Fill",Ho="Notdog",Go="Notdog Duo",qo="Slab",Xo="Slab Press",Jo="Thumbprint",Qo="Utility",Zo="Utility Duo",es="Utility Fill",ts="Whiteboard";Le={},S(S(S(S(S(S(S(S(S(S(Le,yo,Lo),bo,Mo),ko,Do),xo,zo),wo,Uo),_o,Wo),jo,Ko),So,Bo),Ao,Yo),$o,Vo),S(S(S(S(S(S(S(S(S(Le,Io,Ho),Po,Go),Co,qo),Oo,Xo),Eo,Jo),To,Qo),Fo,Zo),No,es),Ro,ts);var as="kit",ns="kit-duotone",rs="Kit",is="Kit Duotone";S(S({},as,rs),ns,is);var os={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},ss={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Ye={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},ls=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],Ia=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(go,ls),us=["solid","regular","light","thin","duotone","brands","semibold"],Pa=[1,2,3,4,5,6,7,8,9,10],fs=Pa.concat([11,12,13,14,15,16,17,18,19,20]),cs=["aw","fw","pull-left","pull-right"],ds=[].concat(D(Object.keys(ss)),us,cs,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",ke.GROUP,ke.SWAP_OPACITY,ke.PRIMARY,ke.SECONDARY]).concat(Pa.map(function(e){return"".concat(e,"x")})).concat(fs.map(function(e){return"w-".concat(e)})),ms={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},K="___FONT_AWESOME___",Ve=16,Ca="fa",Oa="svg-inline--fa",Q="data-fa-i2svg",He="data-fa-pseudo-element",ps="data-fa-pseudo-element-pending",ft="data-prefix",ct="data-icon",It="fontawesome-i2svg",hs="async",vs=["HTML","HEAD","STYLE","SCRIPT"],Ea=["::before","::after",":before",":after"],Ta=(function(){try{return!0}catch{return!1}})();function ge(e){return new Proxy(e,{get:function(a,n){return n in a?a[n]:a[E]}})}var Fa=c({},sa);Fa[E]=c(c(c(c({},{"fa-duotone":"duotone"}),sa[E]),At.kit),At["kit-duotone"]);var gs=ge(Fa),Ge=c({},so);Ge[E]=c(c(c(c({},{duotone:"fad"}),Ge[E]),$t.kit),$t["kit-duotone"]);var Pt=ge(Ge),qe=c({},Ye);qe[E]=c(c({},qe[E]),vo.kit);var dt=ge(qe),Xe=c({},os);Xe[E]=c(c({},Xe[E]),po.kit);ge(Xe);var ys=Ri,Na="fa-layers-text",bs=Li,ks=c({},ro);ge(ks);var xs=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Me=Mi,ws=[].concat(D(lo),D(ds)),me=H.FontAwesomeConfig||{};function _s(e){var t=I.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function js(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(I&&typeof I.querySelector=="function"){var Ss=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];Ss.forEach(function(e){var t=Ce(e,2),a=t[0],n=t[1],r=js(_s(a));r!=null&&(me[n]=r)})}var Ra={styleDefault:"solid",familyDefault:E,cssPrefix:Ca,replacementClass:Oa,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};me.familyPrefix&&(me.cssPrefix=me.familyPrefix);var le=c(c({},Ra),me);le.autoReplaceSvg||(le.observeMutations=!1);var g={};Object.keys(Ra).forEach(function(e){Object.defineProperty(g,e,{enumerable:!0,set:function(a){le[e]=a,pe.forEach(function(n){return n(g)})},get:function(){return le[e]}})});Object.defineProperty(g,"familyPrefix",{enumerable:!0,set:function(t){le.cssPrefix=t,pe.forEach(function(a){return a(g)})},get:function(){return le.cssPrefix}});H.FontAwesomeConfig=g;var pe=[];function As(e){return pe.push(e),function(){pe.splice(pe.indexOf(e),1)}}var te=Ve,z={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function $s(e){if(!(!e||!Y)){var t=I.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=I.head.childNodes,n=null,r=a.length-1;r>-1;r--){var o=a[r],i=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(n=o)}return I.head.insertBefore(t,n),e}}var Is="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Ct(){for(var e=12,t="";e-- >0;)t+=Is[Math.random()*62|0];return t}function ue(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function mt(e){return e.classList?ue(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function La(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ps(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat(La(e[a]),'" ')},"").trim()}function Oe(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function pt(e){return e.size!==z.size||e.x!==z.x||e.y!==z.y||e.rotate!==z.rotate||e.flipX||e.flipY}function Cs(e){var t=e.transform,a=e.containerWidth,n=e.iconWidth,r={transform:"translate(".concat(a/2," 256)")},o="translate(".concat(t.x*32,", ").concat(t.y*32,") "),i="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),s="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(o," ").concat(i," ").concat(s)},f={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:l,path:f}}function Os(e){var t=e.transform,a=e.width,n=a===void 0?Ve:a,r=e.height,o=r===void 0?Ve:r,i="";return oa?i+="translate(".concat(t.x/te-n/2,"em, ").concat(t.y/te-o/2,"em) "):i+="translate(calc(-50% + ".concat(t.x/te,"em), calc(-50% + ").concat(t.y/te,"em)) "),i+="scale(".concat(t.size/te*(t.flipX?-1:1),", ").concat(t.size/te*(t.flipY?-1:1),") "),i+="rotate(".concat(t.rotate,"deg) "),i}var Es=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function Ma(){var e=Ca,t=Oa,a=g.cssPrefix,n=g.replacementClass,r=Es;if(a!==e||n!==t){var o=new RegExp("\\.".concat(e,"\\-"),"g"),i=new RegExp("\\--".concat(e,"\\-"),"g"),s=new RegExp("\\.".concat(t),"g");r=r.replace(o,".".concat(a,"-")).replace(i,"--".concat(a,"-")).replace(s,".".concat(n))}return r}var Ot=!1;function De(){g.autoAddCss&&!Ot&&($s(Ma()),Ot=!0)}var Ts={mixout:function(){return{dom:{css:Ma,insertCss:De}}},hooks:function(){return{beforeDOMElementCreation:function(){De()},beforeI2svg:function(){De()}}}},B=H||{};B[K]||(B[K]={});B[K].styles||(B[K].styles={});B[K].hooks||(B[K].hooks={});B[K].shims||(B[K].shims=[]);var M=B[K],Da=[],za=function(){I.removeEventListener("DOMContentLoaded",za),Se=1,Da.map(function(t){return t()})},Se=!1;Y&&(Se=(I.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(I.readyState),Se||I.addEventListener("DOMContentLoaded",za));function Fs(e){Y&&(Se?setTimeout(e,0):Da.push(e))}function ye(e){var t=e.tag,a=e.attributes,n=a===void 0?{}:a,r=e.children,o=r===void 0?[]:r;return typeof e=="string"?La(e):"<".concat(t," ").concat(Ps(n),">").concat(o.map(ye).join(""),"</").concat(t,">")}function Et(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var ze=function(t,a,n,r){var o=Object.keys(t),i=o.length,s=a,l,f,p;for(n===void 0?(l=1,p=t[o[0]]):(l=0,p=n);l<i;l++)f=o[l],p=s(p,t[f],f,t);return p};function Ua(e){return D(e).length!==1?null:e.codePointAt(0).toString(16)}function Tt(e){return Object.keys(e).reduce(function(t,a){var n=e[a],r=!!n.icon;return r?t[n.iconName]=n.icon:t[a]=n,t},{})}function Je(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=a.skipHooks,r=n===void 0?!1:n,o=Tt(t);typeof M.hooks.addPack=="function"&&!r?M.hooks.addPack(e,Tt(t)):M.styles[e]=c(c({},M.styles[e]||{}),o),e==="fas"&&Je("fa",t)}var he=M.styles,Ns=M.shims,Wa=Object.keys(dt),Rs=Wa.reduce(function(e,t){return e[t]=Object.keys(dt[t]),e},{}),ht=null,Ka={},Ba={},Ya={},Va={},Ha={};function Ls(e){return~ws.indexOf(e)}function Ms(e,t){var a=t.split("-"),n=a[0],r=a.slice(1).join("-");return n===e&&r!==""&&!Ls(r)?r:null}var Ga=function(){var t=function(o){return ze(he,function(i,s,l){return i[l]=ze(s,o,{}),i},{})};Ka=t(function(r,o,i){if(o[3]&&(r[o[3]]=i),o[2]){var s=o[2].filter(function(l){return typeof l=="number"});s.forEach(function(l){r[l.toString(16)]=i})}return r}),Ba=t(function(r,o,i){if(r[i]=i,o[2]){var s=o[2].filter(function(l){return typeof l=="string"});s.forEach(function(l){r[l]=i})}return r}),Ha=t(function(r,o,i){var s=o[2];return r[i]=i,s.forEach(function(l){r[l]=i}),r});var a="far"in he||g.autoFetchSvg,n=ze(Ns,function(r,o){var i=o[0],s=o[1],l=o[2];return s==="far"&&!a&&(s="fas"),typeof i=="string"&&(r.names[i]={prefix:s,iconName:l}),typeof i=="number"&&(r.unicodes[i.toString(16)]={prefix:s,iconName:l}),r},{names:{},unicodes:{}});Ya=n.names,Va=n.unicodes,ht=Ee(g.styleDefault,{family:g.familyDefault})};As(function(e){ht=Ee(e.styleDefault,{family:g.familyDefault})});Ga();function vt(e,t){return(Ka[e]||{})[t]}function Ds(e,t){return(Ba[e]||{})[t]}function J(e,t){return(Ha[e]||{})[t]}function qa(e){return Ya[e]||{prefix:null,iconName:null}}function zs(e){var t=Va[e],a=vt("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function G(){return ht}var Xa=function(){return{prefix:null,iconName:null,rest:[]}};function Us(e){var t=E,a=Wa.reduce(function(n,r){return n[r]="".concat(g.cssPrefix,"-").concat(r),n},{});return Aa.forEach(function(n){(e.includes(a[n])||e.some(function(r){return Rs[n].includes(r)}))&&(t=n)}),t}function Ee(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,n=a===void 0?E:a,r=gs[n][e];if(n===ve&&!e)return"fad";var o=Pt[n][e]||Pt[n][r],i=e in M.styles?e:null,s=o||i||null;return s}function Ws(e){var t=[],a=null;return e.forEach(function(n){var r=Ms(g.cssPrefix,n);r?a=r:n&&t.push(n)}),{iconName:a,rest:t}}function Ft(e){return e.sort().filter(function(t,a,n){return n.indexOf(t)===a})}var Nt=Ia.concat($a);function Te(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,n=a===void 0?!1:a,r=null,o=Ft(e.filter(function(j){return Nt.includes(j)})),i=Ft(e.filter(function(j){return!Nt.includes(j)})),s=o.filter(function(j){return r=j,!la.includes(j)}),l=Ce(s,1),f=l[0],p=f===void 0?null:f,m=Us(o),k=c(c({},Ws(i)),{},{prefix:Ee(p,{family:m})});return c(c(c({},k),Vs({values:e,family:m,styles:he,config:g,canonical:k,givenPrefix:r})),Ks(n,r,k))}function Ks(e,t,a){var n=a.prefix,r=a.iconName;if(e||!n||!r)return{prefix:n,iconName:r};var o=t==="fa"?qa(r):{},i=J(n,r);return r=o.iconName||i||r,n=o.prefix||n,n==="far"&&!he.far&&he.fas&&!g.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var Bs=Aa.filter(function(e){return e!==E||e!==ve}),Ys=Object.keys(Ye).filter(function(e){return e!==E}).map(function(e){return Object.keys(Ye[e])}).flat();function Vs(e){var t=e.values,a=e.family,n=e.canonical,r=e.givenPrefix,o=r===void 0?"":r,i=e.styles,s=i===void 0?{}:i,l=e.config,f=l===void 0?{}:l,p=a===ve,m=t.includes("fa-duotone")||t.includes("fad"),k=f.familyDefault==="duotone",j=n.prefix==="fad"||n.prefix==="fa-duotone";if(!p&&(m||k||j)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&Bs.includes(a)){var w=Object.keys(s).find(function(_){return Ys.includes(_)});if(w||f.autoFetchSvg){var A=oo.get(a).defaultShortPrefixId;n.prefix=A,n.iconName=J(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||o==="fa")&&(n.prefix=G()||"fas"),n}var Hs=(function(){function e(){$i(this,e),this.definitions={}}return Pi(e,[{key:"add",value:function(){for(var a=this,n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];var i=r.reduce(this._pullDefinitions,{});Object.keys(i).forEach(function(s){a.definitions[s]=c(c({},a.definitions[s]||{}),i[s]),Je(s,i[s]);var l=dt[E][s];l&&Je(l,i[s]),Ga()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(o){var i=r[o],s=i.prefix,l=i.iconName,f=i.icon,p=f[2];a[s]||(a[s]={}),p.length>0&&p.forEach(function(m){typeof m=="string"&&(a[s][m]=f)}),a[s][l]=f}),a}}])})(),Rt=[],ne={},se={},Gs=Object.keys(se);function qs(e,t){var a=t.mixoutsTo;return Rt=e,ne={},Object.keys(se).forEach(function(n){Gs.indexOf(n)===-1&&delete se[n]}),Rt.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(i){typeof r[i]=="function"&&(a[i]=r[i]),je(r[i])==="object"&&Object.keys(r[i]).forEach(function(s){a[i]||(a[i]={}),a[i][s]=r[i][s]})}),n.hooks){var o=n.hooks();Object.keys(o).forEach(function(i){ne[i]||(ne[i]=[]),ne[i].push(o[i])})}n.provides&&n.provides(se)}),a}function Qe(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];var o=ne[e]||[];return o.forEach(function(i){t=i.apply(null,[t].concat(n))}),t}function Z(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];var r=ne[e]||[];r.forEach(function(o){o.apply(null,a)})}function q(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return se[e]?se[e].apply(null,t):void 0}function Ze(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||G();if(t)return t=J(a,t)||t,Et(Ja.definitions,a,t)||Et(M.styles,a,t)}var Ja=new Hs,Xs=function(){g.autoReplaceSvg=!1,g.observeMutations=!1,Z("noAuto")},Js={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Y?(Z("beforeI2svg",t),q("pseudoElements2svg",t),q("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;g.autoReplaceSvg===!1&&(g.autoReplaceSvg=!0),g.observeMutations=!0,Fs(function(){Zs({autoReplaceSvgRoot:a}),Z("watch",t)})}},Qs={icon:function(t){if(t===null)return null;if(je(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:J(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=Ee(t[0]);return{prefix:n,iconName:J(n,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(g.cssPrefix,"-"))>-1||t.match(ys))){var r=Te(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||G(),iconName:J(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var o=G();return{prefix:o,iconName:J(o,t)||t}}}},L={noAuto:Xs,config:g,dom:Js,parse:Qs,library:Ja,findIconDefinition:Ze,toHtml:ye},Zs=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,n=a===void 0?I:a;(Object.keys(M.styles).length>0||g.autoFetchSvg)&&Y&&g.autoReplaceSvg&&L.dom.i2svg({node:n})};function Fe(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(n){return ye(n)})}}),Object.defineProperty(e,"node",{get:function(){if(Y){var n=I.createElement("div");return n.innerHTML=e.html,n.children}}}),e}function el(e){var t=e.children,a=e.main,n=e.mask,r=e.attributes,o=e.styles,i=e.transform;if(pt(i)&&a.found&&!n.found){var s=a.width,l=a.height,f={x:s/l/2,y:.5};r.style=Oe(c(c({},o),{},{"transform-origin":"".concat(f.x+i.x/16,"em ").concat(f.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function tl(e){var t=e.prefix,a=e.iconName,n=e.children,r=e.attributes,o=e.symbol,i=o===!0?"".concat(t,"-").concat(g.cssPrefix,"-").concat(a):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:c(c({},r),{},{id:i}),children:n}]}]}function al(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function gt(e){var t=e.icons,a=t.main,n=t.mask,r=e.prefix,o=e.iconName,i=e.transform,s=e.symbol,l=e.maskId,f=e.extra,p=e.watchable,m=p===void 0?!1:p,k=n.found?n:a,j=k.width,w=k.height,A=[g.replacementClass,o?"".concat(g.cssPrefix,"-").concat(o):""].filter(function(N){return f.classes.indexOf(N)===-1}).filter(function(N){return N!==""||!!N}).concat(f.classes).join(" "),_={children:[],attributes:c(c({},f.attributes),{},{"data-prefix":r,"data-icon":o,class:A,role:f.attributes.role||"img",viewBox:"0 0 ".concat(j," ").concat(w)})};!al(f.attributes)&&!f.attributes["aria-hidden"]&&(_.attributes["aria-hidden"]="true"),m&&(_.attributes[Q]="");var d=c(c({},_),{},{prefix:r,iconName:o,main:a,mask:n,maskId:l,transform:i,symbol:s,styles:c({},f.styles)}),y=n.found&&a.found?q("generateAbstractMask",d)||{children:[],attributes:{}}:q("generateAbstractIcon",d)||{children:[],attributes:{}},P=y.children,T=y.attributes;return d.children=P,d.attributes=T,s?tl(d):el(d)}function Lt(e){var t=e.content,a=e.width,n=e.height,r=e.transform,o=e.extra,i=e.watchable,s=i===void 0?!1:i,l=c(c({},o.attributes),{},{class:o.classes.join(" ")});s&&(l[Q]="");var f=c({},o.styles);pt(r)&&(f.transform=Os({transform:r,width:a,height:n}),f["-webkit-transform"]=f.transform);var p=Oe(f);p.length>0&&(l.style=p);var m=[];return m.push({tag:"span",attributes:l,children:[t]}),m}function nl(e){var t=e.content,a=e.extra,n=c(c({},a.attributes),{},{class:a.classes.join(" ")}),r=Oe(a.styles);r.length>0&&(n.style=r);var o=[];return o.push({tag:"span",attributes:n,children:[t]}),o}var Ue=M.styles;function et(e){var t=e[0],a=e[1],n=e.slice(4),r=Ce(n,1),o=r[0],i=null;return Array.isArray(o)?i={tag:"g",attributes:{class:"".concat(g.cssPrefix,"-").concat(Me.GROUP)},children:[{tag:"path",attributes:{class:"".concat(g.cssPrefix,"-").concat(Me.SECONDARY),fill:"currentColor",d:o[0]}},{tag:"path",attributes:{class:"".concat(g.cssPrefix,"-").concat(Me.PRIMARY),fill:"currentColor",d:o[1]}}]}:i={tag:"path",attributes:{fill:"currentColor",d:o}},{found:!0,width:t,height:a,icon:i}}var rl={found:!1,width:512,height:512};function il(e,t){!Ta&&!g.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function tt(e,t){var a=t;return t==="fa"&&g.styleDefault!==null&&(t=G()),new Promise(function(n,r){if(a==="fa"){var o=qa(e)||{};e=o.iconName||e,t=o.prefix||t}if(e&&t&&Ue[t]&&Ue[t][e]){var i=Ue[t][e];return n(et(i))}il(e,t),n(c(c({},rl),{},{icon:g.showMissingIcons&&e?q("missingIconAbstract")||{}:{}}))})}var Mt=function(){},at=g.measurePerformance&&be&&be.mark&&be.measure?be:{mark:Mt,measure:Mt},de='FA "7.2.0"',ol=function(t){return at.mark("".concat(de," ").concat(t," begins")),function(){return Qa(t)}},Qa=function(t){at.mark("".concat(de," ").concat(t," ends")),at.measure("".concat(de," ").concat(t),"".concat(de," ").concat(t," begins"),"".concat(de," ").concat(t," ends"))},yt={begin:ol,end:Qa},we=function(){};function Dt(e){var t=e.getAttribute?e.getAttribute(Q):null;return typeof t=="string"}function sl(e){var t=e.getAttribute?e.getAttribute(ft):null,a=e.getAttribute?e.getAttribute(ct):null;return t&&a}function ll(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(g.replacementClass)}function ul(){if(g.autoReplaceSvg===!0)return _e.replace;var e=_e[g.autoReplaceSvg];return e||_e.replace}function fl(e){return I.createElementNS("http://www.w3.org/2000/svg",e)}function cl(e){return I.createElement(e)}function Za(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,n=a===void 0?e.tag==="svg"?fl:cl:a;if(typeof e=="string")return I.createTextNode(e);var r=n(e.tag);Object.keys(e.attributes||[]).forEach(function(i){r.setAttribute(i,e.attributes[i])});var o=e.children||[];return o.forEach(function(i){r.appendChild(Za(i,{ceFn:n}))}),r}function dl(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var _e={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(r){a.parentNode.insertBefore(Za(r),a)}),a.getAttribute(Q)===null&&g.keepOriginalSource){var n=I.createComment(dl(a));a.parentNode.replaceChild(n,a)}else a.remove()},nest:function(t){var a=t[0],n=t[1];if(~mt(a).indexOf(g.replacementClass))return _e.replace(t);var r=new RegExp("".concat(g.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var o=n[0].attributes.class.split(" ").reduce(function(s,l){return l===g.replacementClass||l.match(r)?s.toSvg.push(l):s.toNode.push(l),s},{toNode:[],toSvg:[]});n[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",o.toNode.join(" "))}var i=n.map(function(s){return ye(s)}).join(`
`);a.setAttribute(Q,""),a.innerHTML=i}};function zt(e){e()}function en(e,t){var a=typeof t=="function"?t:we;if(e.length===0)a();else{var n=zt;g.mutateApproach===hs&&(n=H.requestAnimationFrame||zt),n(function(){var r=ul(),o=yt.begin("mutate");e.map(r),o(),a()})}}var bt=!1;function tn(){bt=!0}function nt(){bt=!1}var Ae=null;function Ut(e){if(St&&g.observeMutations){var t=e.treeCallback,a=t===void 0?we:t,n=e.nodeCallback,r=n===void 0?we:n,o=e.pseudoElementsCallback,i=o===void 0?we:o,s=e.observeMutationsRoot,l=s===void 0?I:s;Ae=new St(function(f){if(!bt){var p=G();ue(f).forEach(function(m){if(m.type==="childList"&&m.addedNodes.length>0&&!Dt(m.addedNodes[0])&&(g.searchPseudoElements&&i(m.target),a(m.target)),m.type==="attributes"&&m.target.parentNode&&g.searchPseudoElements&&i([m.target],!0),m.type==="attributes"&&Dt(m.target)&&~xs.indexOf(m.attributeName))if(m.attributeName==="class"&&sl(m.target)){var k=Te(mt(m.target)),j=k.prefix,w=k.iconName;m.target.setAttribute(ft,j||p),w&&m.target.setAttribute(ct,w)}else ll(m.target)&&r(m.target)})}}),Y&&Ae.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function ml(){Ae&&Ae.disconnect()}function pl(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(n,r){var o=r.split(":"),i=o[0],s=o.slice(1);return i&&s.length>0&&(n[i]=s.join(":").trim()),n},{})),a}function hl(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),n=e.innerText!==void 0?e.innerText.trim():"",r=Te(mt(e));return r.prefix||(r.prefix=G()),t&&a&&(r.prefix=t,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=Ds(r.prefix,e.innerText)||vt(r.prefix,Ua(e.innerText))),!r.iconName&&g.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=e.firstChild.data)),r}function vl(e){var t=ue(e.attributes).reduce(function(a,n){return a.name!=="class"&&a.name!=="style"&&(a[n.name]=n.value),a},{});return t}function gl(){return{iconName:null,prefix:null,transform:z,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Wt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=hl(e),n=a.iconName,r=a.prefix,o=a.rest,i=vl(e),s=Qe("parseNodeAttributes",{},e),l=t.styleParser?pl(e):[];return c({iconName:n,prefix:r,transform:z,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:o,styles:l,attributes:i}},s)}var yl=M.styles;function an(e){var t=g.autoReplaceSvg==="nest"?Wt(e,{styleParser:!1}):Wt(e);return~t.extra.classes.indexOf(Na)?q("generateLayersText",e,t):q("generateSvgReplacementMutation",e,t)}function bl(){return[].concat(D($a),D(Ia))}function Kt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!Y)return Promise.resolve();var a=I.documentElement.classList,n=function(m){return a.add("".concat(It,"-").concat(m))},r=function(m){return a.remove("".concat(It,"-").concat(m))},o=g.autoFetchSvg?bl():la.concat(Object.keys(yl));o.includes("fa")||o.push("fa");var i=[".".concat(Na,":not([").concat(Q,"])")].concat(o.map(function(p){return".".concat(p,":not([").concat(Q,"])")})).join(", ");if(i.length===0)return Promise.resolve();var s=[];try{s=ue(e.querySelectorAll(i))}catch{}if(s.length>0)n("pending"),r("complete");else return Promise.resolve();var l=yt.begin("onTree"),f=s.reduce(function(p,m){try{var k=an(m);k&&p.push(k)}catch(j){Ta||j.name==="MissingIcon"&&console.error(j)}return p},[]);return new Promise(function(p,m){Promise.all(f).then(function(k){en(k,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),l(),p()})}).catch(function(k){l(),m(k)})})}function kl(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;an(e).then(function(a){a&&en([a],t)})}function xl(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:Ze(t||{}),r=a.mask;return r&&(r=(r||{}).icon?r:Ze(r||{})),e(n,c(c({},a),{},{mask:r}))}}var wl=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=a.transform,r=n===void 0?z:n,o=a.symbol,i=o===void 0?!1:o,s=a.mask,l=s===void 0?null:s,f=a.maskId,p=f===void 0?null:f,m=a.classes,k=m===void 0?[]:m,j=a.attributes,w=j===void 0?{}:j,A=a.styles,_=A===void 0?{}:A;if(t){var d=t.prefix,y=t.iconName,P=t.icon;return Fe(c({type:"icon"},t),function(){return Z("beforeDOMElementCreation",{iconDefinition:t,params:a}),gt({icons:{main:et(P),mask:l?et(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:d,iconName:y,transform:c(c({},z),r),symbol:i,maskId:p,extra:{attributes:w,styles:_,classes:k}})})}},_l={mixout:function(){return{icon:xl(wl)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=Kt,a.nodeCallback=kl,a}}},provides:function(t){t.i2svg=function(a){var n=a.node,r=n===void 0?I:n,o=a.callback,i=o===void 0?function(){}:o;return Kt(r,i)},t.generateSvgReplacementMutation=function(a,n){var r=n.iconName,o=n.prefix,i=n.transform,s=n.symbol,l=n.mask,f=n.maskId,p=n.extra;return new Promise(function(m,k){Promise.all([tt(r,o),l.iconName?tt(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(j){var w=Ce(j,2),A=w[0],_=w[1];m([a,gt({icons:{main:A,mask:_},prefix:o,iconName:r,transform:i,symbol:s,maskId:f,extra:p,watchable:!0})])}).catch(k)})},t.generateAbstractIcon=function(a){var n=a.children,r=a.attributes,o=a.main,i=a.transform,s=a.styles,l=Oe(s);l.length>0&&(r.style=l);var f;return pt(i)&&(f=q("generateAbstractTransformGrouping",{main:o,transform:i,containerWidth:o.width,iconWidth:o.width})),n.push(f||o.icon),{children:n,attributes:r}}}},jl={mixout:function(){return{layer:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,o=r===void 0?[]:r;return Fe({type:"layer"},function(){Z("beforeDOMElementCreation",{assembler:a,params:n});var i=[];return a(function(s){Array.isArray(s)?s.map(function(l){i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(g.cssPrefix,"-layers")].concat(D(o)).join(" ")},children:i}]})}}}},Sl={mixout:function(){return{counter:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,o=r===void 0?[]:r,i=n.attributes,s=i===void 0?{}:i,l=n.styles,f=l===void 0?{}:l;return Fe({type:"counter",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:n}),nl({content:a.toString(),extra:{attributes:s,styles:f,classes:["".concat(g.cssPrefix,"-layers-counter")].concat(D(o))}})})}}}},Al={mixout:function(){return{text:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,o=r===void 0?z:r,i=n.classes,s=i===void 0?[]:i,l=n.attributes,f=l===void 0?{}:l,p=n.styles,m=p===void 0?{}:p;return Fe({type:"text",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:n}),Lt({content:a,transform:c(c({},z),o),extra:{attributes:f,styles:m,classes:["".concat(g.cssPrefix,"-layers-text")].concat(D(s))}})})}}},provides:function(t){t.generateLayersText=function(a,n){var r=n.transform,o=n.extra,i=null,s=null;if(oa){var l=parseInt(getComputedStyle(a).fontSize,10),f=a.getBoundingClientRect();i=f.width/l,s=f.height/l}return Promise.resolve([a,Lt({content:a.innerHTML,width:i,height:s,transform:r,extra:o,watchable:!0})])}}},nn=new RegExp('"',"ug"),Bt=[1105920,1112319],Yt=c(c(c(c({},{FontAwesome:{normal:"fas",400:"fas"}}),io),ms),ho),rt=Object.keys(Yt).reduce(function(e,t){return e[t.toLowerCase()]=Yt[t],e},{}),$l=Object.keys(rt).reduce(function(e,t){var a=rt[t];return e[t]=a[900]||D(Object.entries(a))[0][1],e},{});function Il(e){var t=e.replace(nn,"");return Ua(D(t)[0]||"")}function Pl(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),n=a.replace(nn,""),r=n.codePointAt(0),o=r>=Bt[0]&&r<=Bt[1],i=n.length===2?n[0]===n[1]:!1;return o||i||t}function Cl(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(rt[a]||{})[r]||$l[a]}function Vt(e,t){var a="".concat(ps).concat(t.replace(":","-"));return new Promise(function(n,r){if(e.getAttribute(a)!==null)return n();var o=ue(e.children),i=o.filter(function(ee){return ee.getAttribute(He)===t})[0],s=H.getComputedStyle(e,t),l=s.getPropertyValue("font-family"),f=l.match(bs),p=s.getPropertyValue("font-weight"),m=s.getPropertyValue("content");if(i&&!f)return e.removeChild(i),n();if(f&&m!=="none"&&m!==""){var k=s.getPropertyValue("content"),j=Cl(l,p),w=Il(k),A=f[0].startsWith("FontAwesome"),_=Pl(s),d=vt(j,w),y=d;if(A){var P=zs(w);P.iconName&&P.prefix&&(d=P.iconName,j=P.prefix)}if(d&&!_&&(!i||i.getAttribute(ft)!==j||i.getAttribute(ct)!==y)){e.setAttribute(a,y),i&&e.removeChild(i);var T=gl(),N=T.extra;N.attributes[He]=t,tt(d,j).then(function(ee){var fe=gt(c(c({},T),{},{icons:{main:ee,mask:Xa()},prefix:j,iconName:y,extra:N,watchable:!0})),Ne=I.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(Ne,e.firstChild):e.appendChild(Ne),Ne.outerHTML=fe.map(function(un){return ye(un)}).join(`
`),e.removeAttribute(a),n()}).catch(r)}else n()}else n()})}function Ol(e){return Promise.all([Vt(e,"::before"),Vt(e,"::after")])}function El(e){return e.parentNode!==document.head&&!~vs.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(He)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var Tl=function(t){return!!t&&Ea.some(function(a){return t.includes(a)})},Fl=function(t){if(!t)return[];var a=new Set,n=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(f){return f.trim()})});var r=xe(n),o;try{for(r.s();!(o=r.n()).done;){var i=o.value;if(Tl(i)){var s=Ea.reduce(function(l,f){return l.replace(f,"")},i);s!==""&&s!=="*"&&a.add(s)}}}catch(l){r.e(l)}finally{r.f()}return a};function Ht(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(Y){var a;if(t)a=e;else if(g.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var n=new Set,r=xe(document.styleSheets),o;try{for(r.s();!(o=r.n()).done;){var i=o.value;try{var s=xe(i.cssRules),l;try{for(s.s();!(l=s.n()).done;){var f=l.value,p=Fl(f.selectorText),m=xe(p),k;try{for(m.s();!(k=m.n()).done;){var j=k.value;n.add(j)}}catch(A){m.e(A)}finally{m.f()}}}catch(A){s.e(A)}finally{s.f()}}catch(A){g.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(i.href," (").concat(A.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(A){r.e(A)}finally{r.f()}if(!n.size)return;var w=Array.from(n).join(", ");try{a=e.querySelectorAll(w)}catch{}}return new Promise(function(A,_){var d=ue(a).filter(El).map(Ol),y=yt.begin("searchPseudoElements");tn(),Promise.all(d).then(function(){y(),nt(),A()}).catch(function(){y(),nt(),_()})})}}var Nl={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=Ht,a}}},provides:function(t){t.pseudoElements2svg=function(a){var n=a.node,r=n===void 0?I:n;g.searchPseudoElements&&Ht(r)}}},Gt=!1,Rl={mixout:function(){return{dom:{unwatch:function(){tn(),Gt=!0}}}},hooks:function(){return{bootstrap:function(){Ut(Qe("mutationObserverCallbacks",{}))},noAuto:function(){ml()},watch:function(a){var n=a.observeMutationsRoot;Gt?nt():Ut(Qe("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},qt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var o=r.toLowerCase().split("-"),i=o[0],s=o.slice(1).join("-");if(i&&s==="h")return n.flipX=!0,n;if(i&&s==="v")return n.flipY=!0,n;if(s=parseFloat(s),isNaN(s))return n;switch(i){case"grow":n.size=n.size+s;break;case"shrink":n.size=n.size-s;break;case"left":n.x=n.x-s;break;case"right":n.x=n.x+s;break;case"up":n.y=n.y-s;break;case"down":n.y=n.y+s;break;case"rotate":n.rotate=n.rotate+s;break}return n},a)},Ll={mixout:function(){return{parse:{transform:function(a){return qt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-transform");return r&&(a.transform=qt(r)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var n=a.main,r=a.transform,o=a.containerWidth,i=a.iconWidth,s={transform:"translate(".concat(o/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),f="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),p="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(l," ").concat(f," ").concat(p)},k={transform:"translate(".concat(i/2*-1," -256)")},j={outer:s,inner:m,path:k};return{tag:"g",attributes:c({},j.outer),children:[{tag:"g",attributes:c({},j.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:c(c({},n.icon.attributes),j.path)}]}]}}}},We={x:0,y:0,width:"100%",height:"100%"};function Xt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Ml(e){return e.tag==="g"?e.children:[e]}var Dl={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-mask"),o=r?Te(r.split(" ").map(function(i){return i.trim()})):Xa();return o.prefix||(o.prefix=G()),a.mask=o,a.maskId=n.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var n=a.children,r=a.attributes,o=a.main,i=a.mask,s=a.maskId,l=a.transform,f=o.width,p=o.icon,m=i.width,k=i.icon,j=Cs({transform:l,containerWidth:m,iconWidth:f}),w={tag:"rect",attributes:c(c({},We),{},{fill:"white"})},A=p.children?{children:p.children.map(Xt)}:{},_={tag:"g",attributes:c({},j.inner),children:[Xt(c({tag:p.tag,attributes:c(c({},p.attributes),j.path)},A))]},d={tag:"g",attributes:c({},j.outer),children:[_]},y="mask-".concat(s||Ct()),P="clip-".concat(s||Ct()),T={tag:"mask",attributes:c(c({},We),{},{id:y,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[w,d]},N={tag:"defs",children:[{tag:"clipPath",attributes:{id:P},children:Ml(k)},T]};return n.push(N,{tag:"rect",attributes:c({fill:"currentColor","clip-path":"url(#".concat(P,")"),mask:"url(#".concat(y,")")},We)}),{children:n,attributes:r}}}},zl={provides:function(t){var a=!1;H.matchMedia&&(a=H.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},o={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:c(c({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var i=c(c({},o),{},{attributeName:"opacity"}),s={tag:"circle",attributes:c(c({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||s.children.push({tag:"animate",attributes:c(c({},o),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:c(c({},i),{},{values:"1;0;1;1;0;1;"})}),n.push(s),n.push({tag:"path",attributes:c(c({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:c(c({},i),{},{values:"1;0;0;0;0;1;"})}]}),a||n.push({tag:"path",attributes:c(c({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:c(c({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Ul={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-symbol"),o=r===null?!1:r===""?!0:r;return a.symbol=o,a}}}},Wl=[Ts,_l,jl,Sl,Al,Nl,Rl,Ll,Dl,zl,Ul];qs(Wl,{mixoutsTo:L});L.noAuto;L.config;L.library;L.dom;var it=L.parse;L.findIconDefinition;L.toHtml;var Kl=L.icon;L.layer;L.text;L.counter;function F(e,t,a){return(t=Hl(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Jt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function W(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?Jt(Object(a),!0).forEach(function(n){F(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Jt(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function Bl(e,t){if(e==null)return{};var a,n,r=Yl(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)===-1&&{}.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}function Yl(e,t){if(e==null)return{};var a={};for(var n in e)if({}.hasOwnProperty.call(e,n)){if(t.indexOf(n)!==-1)continue;a[n]=e[n]}return a}function Vl(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Hl(e){var t=Vl(e,"string");return typeof t=="symbol"?t:t+""}function $e(e){"@babel/helpers - typeof";return $e=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},$e(e)}function Ke(e,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?F({},e,t):{}}function Gl(e){var t,a=(t={"fa-spin":e.spin,"fa-pulse":e.pulse,"fa-fw":e.fixedWidth,"fa-border":e.border,"fa-li":e.listItem,"fa-inverse":e.inverse,"fa-flip":e.flip===!0,"fa-flip-horizontal":e.flip==="horizontal"||e.flip==="both","fa-flip-vertical":e.flip==="vertical"||e.flip==="both"},F(F(F(F(F(F(F(F(F(F(t,"fa-".concat(e.size),e.size!==null),"fa-rotate-".concat(e.rotation),e.rotation!==null),"fa-rotate-by",e.rotateBy),"fa-pull-".concat(e.pull),e.pull!==null),"fa-swap-opacity",e.swapOpacity),"fa-bounce",e.bounce),"fa-shake",e.shake),"fa-beat",e.beat),"fa-fade",e.fade),"fa-beat-fade",e.beatFade),F(F(F(F(t,"fa-flash",e.flash),"fa-spin-pulse",e.spinPulse),"fa-spin-reverse",e.spinReverse),"fa-width-auto",e.widthAuto));return Object.keys(a).map(function(n){return a[n]?n:null}).filter(function(n){return n})}var ql=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},rn={exports:{}};(function(e){(function(t){var a=function(d,y,P){if(!f(y)||m(y)||k(y)||j(y)||l(y))return y;var T,N=0,ee=0;if(p(y))for(T=[],ee=y.length;N<ee;N++)T.push(a(d,y[N],P));else{T={};for(var fe in y)Object.prototype.hasOwnProperty.call(y,fe)&&(T[d(fe,P)]=a(d,y[fe],P))}return T},n=function(d,y){y=y||{};var P=y.separator||"_",T=y.split||/(?=[A-Z])/;return d.split(T).join(P)},r=function(d){return w(d)?d:(d=d.replace(/[\-_\s]+(.)?/g,function(y,P){return P?P.toUpperCase():""}),d.substr(0,1).toLowerCase()+d.substr(1))},o=function(d){var y=r(d);return y.substr(0,1).toUpperCase()+y.substr(1)},i=function(d,y){return n(d,y).toLowerCase()},s=Object.prototype.toString,l=function(d){return typeof d=="function"},f=function(d){return d===Object(d)},p=function(d){return s.call(d)=="[object Array]"},m=function(d){return s.call(d)=="[object Date]"},k=function(d){return s.call(d)=="[object RegExp]"},j=function(d){return s.call(d)=="[object Boolean]"},w=function(d){return d=d-0,d===d},A=function(d,y){var P=y&&"process"in y?y.process:y;return typeof P!="function"?d:function(T,N){return P(T,d,N)}},_={camelize:r,decamelize:i,pascalize:o,depascalize:i,camelizeKeys:function(d,y){return a(A(r,y),d)},decamelizeKeys:function(d,y){return a(A(i,y),d,y)},pascalizeKeys:function(d,y){return a(A(o,y),d)},depascalizeKeys:function(){return this.decamelizeKeys.apply(this,arguments)}};e.exports?e.exports=_:t.humps=_})(ql)})(rn);var Xl=rn.exports,Jl=["class","style"];function Ql(e){return e.split(";").map(function(t){return t.trim()}).filter(function(t){return t}).reduce(function(t,a){var n=a.indexOf(":"),r=Xl.camelize(a.slice(0,n)),o=a.slice(n+1).trim();return t[r]=o,t},{})}function Zl(e){return e.split(/\s+/).reduce(function(t,a){return t[a]=!0,t},{})}function on(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var n=(e.children||[]).map(function(l){return on(l)}),r=Object.keys(e.attributes||{}).reduce(function(l,f){var p=e.attributes[f];switch(f){case"class":l.class=Zl(p);break;case"style":l.style=Ql(p);break;default:l.attrs[f]=p}return l},{attrs:{},class:{},style:{}});a.class;var o=a.style,i=o===void 0?{}:o,s=Bl(a,Jl);return mn(e.tag,W(W(W({},t),{},{class:r.class,style:W(W({},r.style),i)},r.attrs),s),n)}var sn=!1;try{sn=!0}catch{}function eu(){if(!sn&&console&&typeof console.error=="function"){var e;(e=console).error.apply(e,arguments)}}function Qt(e){if(e&&$e(e)==="object"&&e.prefix&&e.iconName&&e.icon)return e;if(it.icon)return it.icon(e);if(e===null)return null;if($e(e)==="object"&&e.prefix&&e.iconName)return e;if(Array.isArray(e)&&e.length===2)return{prefix:e[0],iconName:e[1]};if(typeof e=="string")return{prefix:"fas",iconName:e}}var tu=R({name:"FontAwesomeIcon",props:{border:{type:Boolean,default:!1},fixedWidth:{type:Boolean,default:!1},flip:{type:[Boolean,String],default:!1,validator:function(t){return[!0,!1,"horizontal","vertical","both"].indexOf(t)>-1}},icon:{type:[Object,Array,String],required:!0},mask:{type:[Object,Array,String],default:null},maskId:{type:String,default:null},listItem:{type:Boolean,default:!1},pull:{type:String,default:null,validator:function(t){return["right","left"].indexOf(t)>-1}},pulse:{type:Boolean,default:!1},rotation:{type:[String,Number],default:null,validator:function(t){return[90,180,270].indexOf(Number.parseInt(t,10))>-1}},rotateBy:{type:Boolean,default:!1},swapOpacity:{type:Boolean,default:!1},size:{type:String,default:null,validator:function(t){return["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"].indexOf(t)>-1}},spin:{type:Boolean,default:!1},transform:{type:[String,Object],default:null},symbol:{type:[Boolean,String],default:!1},title:{type:String,default:null},titleId:{type:String,default:null},inverse:{type:Boolean,default:!1},bounce:{type:Boolean,default:!1},shake:{type:Boolean,default:!1},beat:{type:Boolean,default:!1},fade:{type:Boolean,default:!1},beatFade:{type:Boolean,default:!1},flash:{type:Boolean,default:!1},spinPulse:{type:Boolean,default:!1},spinReverse:{type:Boolean,default:!1},widthAuto:{type:Boolean,default:!1}},setup:function(t,a){var n=a.attrs,r=V(function(){return Qt(t.icon)}),o=V(function(){return Ke("classes",Gl(t))}),i=V(function(){return Ke("transform",typeof t.transform=="string"?it.transform(t.transform):t.transform)}),s=V(function(){return Ke("mask",Qt(t.mask))}),l=V(function(){var p=W(W(W(W({},o.value),i.value),s.value),{},{symbol:t.symbol,maskId:t.maskId});return p.title=t.title,p.titleId=t.titleId,Kl(r.value,p)});ot(l,function(p){if(!p)return eu("Could not find one or more icon(s)",r.value,s.value)},{immediate:!0});var f=V(function(){return l.value?on(l.value.abstract[0],{},n):null});return function(){return f.value}}});var au={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]};const nu={key:0,class:"fixed inset-0 z-[100] flex h-dvh w-screen items-center justify-center bg-ink/45 px-3 py-4"},ru={"data-testid":"exam-modal",class:"exam-modal-card surface-card","aria-modal":"true",role:"dialog"},iu={class:"flex h-[48px] items-center justify-between border-b border-clay/10 px-4"},ou={class:"text-sm font-semibold text-ink"},su={class:"flex-1 border-b border-clay/10 px-4 py-3 sm:px-5 sm:py-4"},lu={class:"exam-modal-body"},uu={"data-testid":"exam-prompt",class:"exam-modal-prompt"},fu={class:"min-h-[28px] text-lg font-semibold text-ink"},cu={class:"text-sm text-ink/65"},du={"data-testid":"exam-actions",class:"flex h-[56px] items-center justify-between px-4"},mu=R({__name:"ExamModal",props:{open:{type:Boolean},question:{},currentIndex:{},totalQuestions:{}},emits:["next","unknown","confirmClose"],setup(e,{emit:t}){const a=e,n=t;function r(){window.confirm("確定要結束練習嗎？")&&n("confirmClose")}return ot(()=>a.open,o=>{if(o){yn();return}kt()},{immediate:!0}),ea(()=>{a.open&&kt()}),(o,i)=>(h(),pn(hn,{to:"body"},[a.open?(h(),v("div",nu,[u("section",ru,[u("div",iu,[u("p",ou,b(a.totalQuestions===0?0:a.currentIndex+1)+" / "+b(a.totalQuestions),1),u("button",{type:"button",class:"text-lg text-ink/70 hover:text-ink","aria-label":"關閉練習",onClick:r},[$(x(tu),{icon:x(au)},null,8,["icon"])])]),u("div",su,[u("div",lu,[u("p",uu,b(a.question?.promptText??"-"),1),u("p",fu,b(a.question?.answerRevealed?a.question.answerText:""),1),u("p",cu,b(a.question?.answerRevealed?"已顯示答案，請決定是否標記為我不清楚":"請先自行作答，再決定是否按下我不清楚"),1)])]),u("div",du,[$(re,{"data-testid":"exam-unknown-button",variant:"danger",onClick:i[0]||(i[0]=s=>n("unknown"))},{default:ie(()=>[...i[2]||(i[2]=[oe(" 我不清楚 ",-1)])]),_:1}),$(re,{"data-testid":"exam-next-button",variant:"ghost",onClick:i[1]||(i[1]=s=>n("next"))},{default:ie(()=>[...i[3]||(i[3]=[oe(" 下一步 ",-1)])]),_:1})])])])):Ie("",!0)]))}}),pu={key:0,class:"section-card space-y-3"},hu={class:"flex items-center justify-between gap-2"},vu={class:"flex flex-wrap gap-2"},gu={class:"inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-white"},yu=R({__name:"UnknownResultPanel",props:{snapshot:{}},emits:["clear"],setup(e,{emit:t}){const a=t;return(n,r)=>e.snapshot?(h(),v("section",pu,[u("div",hu,[r[2]||(r[2]=u("div",null,[u("h2",{class:"text-sm font-semibold text-ink"},"我不清楚的音節"),u("p",{class:"text-xs text-ink/60"},"你按下「我不清楚」的音節如下（顯示：平／片／羅馬拼音）")],-1)),$(re,{"data-testid":"result-panel-clear-button",variant:"ghost",class:"whitespace-nowrap",onClick:r[0]||(r[0]=o=>a("clear"))},{default:ie(()=>[...r[1]||(r[1]=[oe("清除",-1)])]),_:1})]),u("div",vu,[(h(!0),v(C,null,O(e.snapshot.results,o=>(h(),v("span",{key:o.kanaId,class:"detail-pill"},[u("span",null,b(o.hiragana)+" / "+b(o.katakana)+" "+b(o.romaji),1),u("span",gu,b(o.count),1)]))),128))])])):Ie("",!0)}});function ln(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const n=Math.floor(Math.random()*(a+1)),r=t[a],o=t[n];t[a]=o,t[n]=r}return t}function bu(e,t){if(e.length===0||t<=0)return[];const a=[];for(;a.length<t;)a.push(...ln(e));return a.slice(0,t)}function ku(e){if(!e||typeof e!="object")return!1;const t=e;return typeof t.kanaId=="string"&&typeof t.hiragana=="string"&&typeof t.katakana=="string"&&typeof t.romaji=="string"&&typeof t.count=="number"}function xu(e){if(!e||typeof e!="object")return!1;const t=e;return typeof t.updatedAt=="string"&&typeof t.totalUnknownCount=="number"&&Array.isArray(t.results)&&t.results.every(ku)}function wu(){return bn(st,xu)}function _u(e){xn(st,e)}function ju(){kn(st)}function Su(e){const t=[];for(const a of e.selectedKanaItems)e.includeHiragana&&t.push({id:`${a.id}-hiragana`,kanaId:a.id,script:"hiragana",promptText:a.hiragana,answerText:`${a.romaji}（平假名）`,hintText:"按「下一步」顯示羅馬拼音",answerRevealed:!1,unknownMarked:!1,hiragana:a.hiragana,katakana:a.katakana,romaji:a.romaji}),e.includeKatakana&&t.push({id:`${a.id}-katakana`,kanaId:a.id,script:"katakana",promptText:a.katakana,answerText:`${a.romaji}（片假名）`,hintText:"按「下一步」顯示羅馬拼音",answerRevealed:!1,unknownMarked:!1,hiragana:a.hiragana,katakana:a.katakana,romaji:a.romaji});return bu(ln(t),e.questionCount)}function Au(){const e=ae(!1),t=ae(0),a=ae([]),n=ae(wu()),r=ae({}),o=V(()=>a.value.length),i=V(()=>a.value[t.value]??null);function s(){const w=Object.values(r.value).sort((_,d)=>d.count!==_.count?d.count-_.count:_.romaji.localeCompare(d.romaji)),A={updatedAt:new Date().toISOString(),totalUnknownCount:w.reduce((_,d)=>_+d.count,0),results:w};_u(A),n.value=A,e.value=!1,t.value=0,a.value=[],r.value={}}function l(w){a.value=Su(w),t.value=0,r.value={},e.value=a.value.length>0}function f(){if(t.value>=a.value.length-1){s();return}t.value+=1}function p(){const w=i.value;if(w){if(!w.answerRevealed){w.answerRevealed=!0,w.hintText="再按「下一步」進入下一題";return}f()}}function m(){const w=i.value;if(w){if(!w.unknownMarked){const A=r.value[w.kanaId];r.value[w.kanaId]={kanaId:w.kanaId,hiragana:w.hiragana,katakana:w.katakana,romaji:w.romaji,count:A?A.count+1:1},w.unknownMarked=!0}if(!w.answerRevealed){w.answerRevealed=!0,w.hintText="再按「下一步」進入下一題";return}f()}}function k(){e.value&&s()}function j(){ju(),n.value=null}return{isOpen:e,currentIndex:t,totalQuestions:o,currentQuestion:i,latestUnknownSnapshot:n,start:l,nextStep:p,markUnknown:m,confirmClose:k,clearLatestResults:j}}const $u={class:"practice-view space-y-1 py-1"},Iu={"data-testid":"practice-main-grid",class:"practice-reference-grid grid gap-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.9fr)]"},Pu={class:"space-y-1"},Eu=R({__name:"PracticeView",setup(e){const t=Pe(),a=Au(),n=ae(null);let r=null;function o(){r!==null&&(window.clearTimeout(r),r=null)}function i(m){gn(()=>{o(),r=window.setTimeout(()=>{r=null,m()},0)})}function s(){a.latestUnknownSnapshot.value?.results.length&&i(()=>{const m=n.value;if(!m)return;const k=Math.max(m.getBoundingClientRect().top+window.scrollY-8,0);window.scrollTo({top:k,behavior:"smooth"})})}function l(){i(()=>{window.scrollTo({top:0,behavior:"smooth"})})}function f(){if(t.effectiveQuestionCount.value<1){window.alert("值必須大於或等於1");return}if(t.selectedKanaItems.value.length===0){window.alert("請至少勾選一個假名才能開始出題");return}if(!t.includeHiragana.value&&!t.includeKatakana.value){window.alert("請至少選擇平假名或片假名其中一項才能開始出題");return}a.start({selectedKanaItems:t.selectedKanaItems.value,questionCount:t.effectiveQuestionCount.value,includeHiragana:t.includeHiragana.value,includeKatakana:t.includeKatakana.value})}function p(m="toolbar"){a.latestUnknownSnapshot.value&&window.confirm("確定要清除所有「我不清楚的音節」紀錄嗎？")&&(o(),a.clearLatestResults(),m==="result-panel"&&l())}return ot(()=>a.latestUnknownSnapshot.value?.updatedAt,(m,k)=>{m&&m!==k&&s()},{flush:"post"}),vn(()=>{s()}),ea(()=>{o()}),(m,k)=>(h(),v("div",$u,[$(Tn,{"has-latest-result":!!x(a).latestUnknownSnapshot.value,onStartExam:f,onClearLatestResult:k[0]||(k[0]=j=>p("toolbar"))},null,8,["has-latest-result"]),u("div",Iu,[u("div",Pu,[$(Gn),$(rr)]),k[1]||(U(-1,!0),(k[1]=u("div",{"data-testid":"practice-reference-sections",class:"practice-static-stack space-y-1"},[$(br),$(Ar),$(Rr),$(Vr),$(ni),$(gi),$(ji)])).cacheIndex=1,U(1),k[1])]),u("div",{ref_key:"resultPanelRef",ref:n},[$(yu,{snapshot:x(a).latestUnknownSnapshot.value,onClear:k[2]||(k[2]=j=>p("result-panel"))},null,8,["snapshot"])],512),$(mu,{open:x(a).isOpen.value,question:x(a).currentQuestion.value,"current-index":x(a).currentIndex.value,"total-questions":x(a).totalQuestions.value,onNext:x(a).nextStep,onUnknown:x(a).markUnknown,onConfirmClose:x(a).confirmClose},null,8,["open","question","current-index","total-questions","onNext","onUnknown","onConfirmClose"])]))}});export{Eu as default};
